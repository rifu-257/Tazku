import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocFromServer, 
  setDoc, 
  updateDoc,
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, LinkedBankAccount, SavedCalculation, BeneficiaryCase, DonationRecord, BeneficiaryApplication } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
// Enforce persistence so user is never logged out unless they explicitly click Logout
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Could not set auth persistence:", err);
});
export const googleProvider = new GoogleAuthProvider();

// Test Connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

// Required Error Handling Format
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile Operations
export async function syncUserProfile(user: FirebaseUser, partial?: Partial<UserProfile>): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existing = snap.data() as UserProfile;
      const cachedBankJson = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${user.uid}`) : null;
      const cachedBank = cachedBankJson ? JSON.parse(cachedBankJson) : null;
      const bankToKeep = existing.linkedBankAccount || cachedBank;

      const updates: any = {
        id: user.uid,
        ...partial,
        updatedAt: serverTimestamp(),
      };
      if (bankToKeep && !existing.linkedBankAccount) {
        updates.linkedBankAccount = bankToKeep;
      }
      if (partial?.displayName) {
        updates.displayName = partial.displayName;
      }

      await updateDoc(userRef, updates);
      return {
        ...existing,
        ...updates,
        linkedBankAccount: updates.linkedBankAccount || existing.linkedBankAccount || null,
      } as UserProfile;
    } else {
      const enteredOrEmailName = partial?.displayName || user.displayName || (user.email ? user.email.split('@')[0] : 'Community Member');
      const cachedBankJson = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${user.uid}`) : null;
      const cachedBank = cachedBankJson ? JSON.parse(cachedBankJson) : null;

      const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        displayName: enteredOrEmailName,
        photoURL: user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        preferredCurrency: 'USD',
        madhhab: 'Shafii',
        role: partial?.role || 'donor',
        linkedBankAccount: partial?.linkedBankAccount || cachedBank || null,
        ...partial,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
  }
}

// Persist linked bank account in Firestore
export async function saveUserBankAccount(
  userId: string, 
  bankDetails: { 
    bankName: string; 
    accountNumber: string; 
    ifsc: string;
    accountHolderName?: string;
    accountType?: string;
    linkedAt?: string;
  }
): Promise<LinkedBankAccount> {
  const userRef = doc(db, 'users', userId);
  const linkedData: LinkedBankAccount = {
    bankName: bankDetails.bankName,
    accountNumber: bankDetails.accountNumber,
    ifsc: bankDetails.ifsc,
    accountHolderName: bankDetails.accountHolderName || 'Primary Account Holder',
    accountType: bankDetails.accountType || 'Savings Account',
    linkedAt: bankDetails.linkedAt || new Date().toISOString(),
  };

  try {
    await setDoc(userRef, {
      id: userId,
      linkedBankAccount: linkedData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    try {
      localStorage.setItem(`tazku_linked_bank_${userId}`, JSON.stringify(linkedData));
    } catch {}
    return linkedData;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
  }
}

// Fetch user's saved bank account from Firestore
export async function getUserBankAccount(userId: string): Promise<LinkedBankAccount | null> {
  if (!userId) return null;
  const userRef = doc(db, 'users', userId);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.linkedBankAccount) {
        try {
          localStorage.setItem(`tazku_linked_bank_${userId}`, JSON.stringify(data.linkedBankAccount));
        } catch {}
        return data.linkedBankAccount as LinkedBankAccount;
      }
    }
    const cached = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${userId}`) : null;
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn("Could not fetch user bank account:", err);
    const cached = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${userId}`) : null;
    return cached ? JSON.parse(cached) : null;
  }
}

// Unlink bank account in Firestore (only unlinks when user explicitly triggers it)
export async function unlinkUserBankAccount(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    await setDoc(userRef, {
      id: userId,
      linkedBankAccount: null,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    try {
      localStorage.removeItem(`tazku_linked_bank_${userId}`);
    } catch {}
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
  }
}

// Save active role in Firestore
export async function saveUserRole(userId: string, role: 'donor' | 'mahal' | 'vakeel'): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp(),
    });
    try {
      localStorage.setItem('tazku_active_role', role);
    } catch {}
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
  }
}

// Email/Password Auth Helpers
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function signUpWithEmail(
  email: string, 
  pass: string, 
  displayName: string,
  role: 'donor' | 'mahal' | 'vakeel' = 'donor',
  extraProfileData?: {
    phoneNumber?: string;
    whatsappNumber?: string;
    mahal?: string;
  }
): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const cleanName = displayName.trim() || email.split('@')[0] || 'Community Member';
  try {
    await updateProfile(cred.user, { displayName: cleanName });
  } catch {}
  await syncUserProfile(cred.user, { 
    displayName: cleanName, 
    role,
    ...extraProfileData 
  });
  return cred.user;
}

// Calculation history operations
export async function saveUserCalculation(calc: Omit<SavedCalculation, 'id' | 'createdAt'>): Promise<string> {
  if (!auth.currentUser) throw new Error('Must be signed in to save calculation');
  const id = `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const calcDoc = doc(db, 'calculations', id);
  try {
    await setDoc(calcDoc, {
      ...calc,
      id,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `calculations/${id}`);
  }
}

// Donations operations
export async function recordDonation(donation: Omit<DonationRecord, 'id' | 'createdAt' | 'receiptNumber'>): Promise<DonationRecord> {
  const timestamp = Date.now();
  const receiptNumber = `TZK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const id = `don_${timestamp}_${Math.random().toString(36).substring(2, 6)}`;
  
  const record: DonationRecord = {
    ...donation,
    id,
    receiptNumber,
    createdAt: new Date().toISOString(),
  };

  try {
    // 1. Write donation record
    const donRef = doc(db, 'donations', id);
    await setDoc(donRef, record);

    // 2. Increment raised amount on case
    const caseRef = doc(db, 'cases', donation.caseId);
    const caseSnap = await getDoc(caseRef);
    if (caseSnap.exists()) {
      const existingCase = caseSnap.data() as BeneficiaryCase;
      const newRaised = (existingCase.raisedAmount || 0) + donation.amountUSD;
      const isFunded = newRaised >= existingCase.targetAmount;
      await updateDoc(caseRef, {
        raisedAmount: newRaised,
        status: isFunded ? 'funded' : existingCase.status,
      });
    }

    return record;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `donations/${id}`);
  }
}

// Submit aid application
export async function submitAidApplication(appData: Omit<BeneficiaryApplication, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const appRef = doc(db, 'applications', id);
  try {
    await setDoc(appRef, {
      ...appData,
      id,
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `applications/${id}`);
  }
}
