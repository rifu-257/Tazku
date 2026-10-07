import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
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
import { UserProfile, SavedCalculation, BeneficiaryCase, DonationRecord, BeneficiaryApplication } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
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
      if (partial && Object.keys(partial).length > 0) {
        await updateDoc(userRef, {
          ...partial,
          updatedAt: serverTimestamp(),
        });
      }
      return snap.data() as UserProfile;
    } else {
      const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Community Member',
        photoURL: user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        preferredCurrency: 'USD',
        madhhab: 'Shafii',
        ...partial,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
  }
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
