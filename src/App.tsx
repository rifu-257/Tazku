import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Send, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  User, 
  Home, 
  Users, 
  Search, 
  Bell, 
  ChevronRight, 
  Upload, 
  ArrowLeft, 
  Sparkles, 
  BarChart3, 
  Download, 
  ShieldCheck, 
  Check, 
  Calendar, 
  LogOut, 
  X,
  BookOpen,
  HelpCircle,
  Headphones,
  Coins,
  Building2,
  UserCheck,
  CreditCard,
  Landmark,
  Edit3,
  Phone,
  ClipboardList
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EditProfileModal } from './components/EditProfileModal';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { LinkBankAccountScreen } from './components/LinkBankAccountScreen';
import { ClaimantsMethodScreen } from './components/ClaimantsMethodScreen';
import { ZakkuCalculatorModal } from './components/ZakkuCalculatorModal';
import { ZakatCalculatorAccordionScreen } from './components/ZakatCalculatorAccordionScreen';
import { ZakkuGuideModal } from './components/ZakkuGuideModal';
import { ZakkuClaimantModal } from './components/ZakkuClaimantModal';
import { ZakkuChatDrawer } from './components/ZakkuChatDrawer';
import { ZakkuNotificationDrawer } from './components/ZakkuNotificationDrawer';
import { ZakkuStatsModal } from './components/ZakkuStatsModal';
import { CertificateModal } from './components/CertificateModal';
import { ZakatRecordsScreen } from './components/ZakatRecordsScreen';
import { ZakatTrackerScreen } from './components/ZakatTrackerScreen';
import { RoleLoginModal } from './components/RoleLoginModals';
import { MahalluPortalScreen } from './components/MahalluPortalScreen';
import { VakeelPortalScreen } from './components/VakeelPortalScreen';
import { AuthScreen } from './components/AuthScreen';
import { AccountActionScreen } from './components/AccountActionScreen';
import { FAQSupportModal } from './components/FAQSupportModal';
import { WakalahModal } from './components/WakalahModal';
import { InterestPurificationModule } from './components/InterestPurificationModule';
import { InterestScreen } from './components/InterestScreen';
import { UnlinkedBankAccountModal } from './components/UnlinkedBankAccountModal';
import { 
  ClaimantItem, 
  DonationRecord, 
  MessageContact, 
  NotificationItem,
  LinkedBankAccount
} from './types';
import { db, auth, submitAidApplication, saveUserBankAccount, unlinkUserBankAccount, saveUserRole, getUserBankAccount, recordDonation } from './lib/firebase';

function TazkuApp() {
  const { user, profile, signInWithGoogle, signOut, refreshProfile, loading } = useAuth();
  
  // Cinematic Splash Screen State (2.2s duration)
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // High-level App Screen Flow: 'role_select' -> 'account_action' -> 'auth' -> ('link_bank' if personal) -> 'main'
  const [mainScreen, setMainScreen] = useState<'role_select' | 'account_action' | 'auth' | 'link_bank' | 'main' | 'onboarding'>('role_select');
  const [selectedRoleType, setSelectedRoleType] = useState<'personal' | 'mahal'>('personal');
  const [authInitialView, setAuthInitialView] = useState<'login' | 'signup'>('login');
  const [linkedBankAccount, setLinkedBankAccount] = useState<LinkedBankAccount | null>(null);

  // Active Role State: 'donor' | 'mahal' | 'vakeel'
  const [activeRole, setActiveRole] = useState<'donor' | 'mahal' | 'vakeel'>(() => {
    return (typeof window !== 'undefined' ? (localStorage.getItem('tazku_active_role') as any) : null) || 'donor';
  });

  const [hasExplicitlyLoggedOut, setHasExplicitlyLoggedOut] = useState<boolean>(false);
  const [customEnteredName, setCustomEnteredName] = useState<string>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('tazku_entered_name') : '') || '';
  });

  // Track if current logged-in Mahallu is newly registered (fresh clean data)
  const [isFreshMahallu, setIsFreshMahallu] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('tazku_is_fresh_mahallu') === 'true';
  });
  const [mahalluCommitteeProfile, setMahalluCommitteeProfile] = useState<{
    name: string;
    ward?: string;
    trustee?: string;
    contact?: string;
    regCode?: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('tazku_mahallu_profile');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return null;
  });

  // Bottom Navigation & Tab State:
  // 5 tabs requested: Home, Tracker, Calculator, Articles/Docs, Profile
  // Plus special view: 'claimants' (Screen 2) and 'application'
  const [activeTab, setActiveTab] = useState<'home' | 'tracker' | 'calculator' | 'interest' | 'articles' | 'profile' | 'claimants' | 'application' | 'messages'>('home');
  const [applicationSubView, setApplicationSubView] = useState<'form' | 'status'>('form');

  // Modals & Overlays State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUnlinkedBankModalOpen, setIsUnlinkedBankModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);

  // Recent Activity Feed State (supports standard donations and Interest Purification / Takhallus)
  const [recentActivities, setRecentActivities] = useState<Array<{
    id?: string;
    caseId?: string;
    name: string;
    amount: string;
    date: string;
    status: string;
    receiptNumber: string;
    zakatType?: 'Zakat al-Mal' | 'Zakat al-Fitr' | 'Sadaqah Nafilah' | 'Interest Purification / Takhallus';
    createdAt?: string;
    notes?: string;
  }>>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tazku_recent_activities') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      { 
        name: 'Education Aid - Ward 4', 
        amount: '₹5,000', 
        date: 'Yesterday', 
        status: 'Completed',
        receiptNumber: 'TZK-2026-918230',
        zakatType: 'Zakat al-Mal',
      },
      { 
        name: 'Debt Relief - Case #84', 
        amount: '₹12,000', 
        date: '3 days ago', 
        status: 'Verified',
        receiptNumber: 'TZK-2026-831490',
        zakatType: 'Zakat al-Mal',
      },
      { 
        name: 'Emergency Food - Bilal Masjid', 
        amount: '₹9,000', 
        date: 'Oct 02', 
        status: 'Completed',
        receiptNumber: 'TZK-2026-728190',
        zakatType: 'Zakat al-Mal',
      }
    ];
  });

  // Handle Interest Purification disbursement
  const handleDisburseInterest = async (purificationData: {
    amount: number;
    destinationName: string;
    destinationCategory: string;
    receiptNumber: string;
    banksPurified: string[];
  }) => {
    const newActivity = {
      id: `pur_${Date.now()}`,
      caseId: 'public_welfare_takhallus',
      name: 'Interest Purification / Takhallus',
      amount: `₹${purificationData.amount.toLocaleString('en-IN')}`,
      date: 'Today',
      status: 'Completed',
      receiptNumber: purificationData.receiptNumber,
      zakatType: 'Interest Purification / Takhallus' as const,
      createdAt: new Date().toISOString(),
      notes: `Purified non-permissible interest from ${purificationData.banksPurified.join(', ')} allocated to ${purificationData.destinationName} via Takhallus without expectation of spiritual reward.`
    };

    setRecentActivities(prev => {
      const filtered = prev.filter(a => a.receiptNumber !== purificationData.receiptNumber);
      const updated = [newActivity, ...filtered];
      try {
        localStorage.setItem('tazku_recent_activities', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (user?.uid) {
      try {
        await recordDonation({
          caseId: 'public_welfare_takhallus',
          caseTitle: `Interest Purification - ${purificationData.destinationName}`,
          donorId: user.uid,
          donorName: displayName,
          amount: purificationData.amount,
          amountUSD: Math.round(purificationData.amount / 86.5),
          currency: 'INR',
          zakatType: 'Interest Purification / Takhallus',
          isAnonymous: false,
          notes: newActivity.notes
        });
      } catch (e) {
        console.error("Failed to record interest purification to Firestore:", e);
      }
    }
  };

  const handleViewPurificationReceipt = (receiptNumber: string) => {
    const found = recentActivities.find(a => a.receiptNumber === receiptNumber);
    if (found) {
      setSelectedReceipt({
        id: found.id || `rec_pur_${Date.now()}`,
        caseId: found.caseId || 'public_welfare_takhallus',
        caseTitle: found.name,
        donorId: user ? user.uid : 'community_member',
        donorName: displayName,
        amount: parseInt(found.amount.replace(/[^0-9]/g, '')) || 1855,
        amountUSD: Math.round((parseInt(found.amount.replace(/[^0-9]/g, '')) || 1855) / 86.5),
        currency: 'INR',
        zakatType: 'Interest Purification / Takhallus',
        createdAt: found.createdAt || new Date().toISOString(),
        receiptNumber: found.receiptNumber,
        isAnonymous: false,
        notes: found.notes || 'Purified non-permissible interest via Takhallus into non-Zakat community welfare.'
      });
      setIsCertificateOpen(true);
    } else {
      setSelectedReceipt({
        id: `rec_pur_${Date.now()}`,
        caseId: 'public_welfare_takhallus',
        caseTitle: 'Interest Purification / Takhallus',
        donorId: user ? user.uid : 'community_member',
        donorName: displayName,
        amount: 1855,
        amountUSD: 21,
        currency: 'INR',
        zakatType: 'Interest Purification / Takhallus',
        createdAt: new Date().toISOString(),
        receiptNumber: receiptNumber,
        isAnonymous: false,
        notes: 'Purified non-permissible interest via Takhallus into non-Zakat community welfare.'
      });
      setIsCertificateOpen(true);
    }
  };
  const [activeChatContact, setActiveChatContact] = useState<MessageContact | null>(null);
  const [roleLoginType, setRoleLoginType] = useState<'mahal' | 'vakeel' | null>(null);
  const [faqSupportConfig, setFaqSupportConfig] = useState<{ isOpen: boolean; tab: 'faq' | 'support' }>({ isOpen: false, tab: 'faq' });
  const [selectedVakeelForWakalah, setSelectedVakeelForWakalah] = useState<any | null>(null);

  // Claimants state
  const [selectedClaimant, setSelectedClaimant] = useState<ClaimantItem | null>(null);
  const [prefilledAmount, setPrefilledAmount] = useState<number | undefined>(undefined);

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    mahallu: '',
    reason: '',
    requestedAmount: '25000',
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Initial Claimants List
  const [claimantsList, setClaimantsList] = useState<ClaimantItem[]>([
    { 
      id: '101', 
      name: 'Akbar Ali', 
      mahal: 'Juma Masjid Mahallu, Ward 3', 
      category: 'Al-Fuqara', 
      amount: 15000, 
      funded: 9600, 
      status: 'Approved',
      urgency: 'Urgent',
      description: 'Senior breadwinner with chronic impairment. Monthly grain & basic family sustenance.'
    },
    { 
      id: '102', 
      name: 'Raheem K.', 
      mahal: 'Town Mahallu Committee', 
      category: 'Al-Gharimin', 
      amount: 25000, 
      funded: 18000, 
      status: 'Approved',
      urgency: 'Urgent',
      description: 'Micro-retail kiosk damaged during monsoon. Immediate debt relief to clear arrears.'
    },
    { 
      id: '103', 
      name: 'Thwaha M.', 
      mahal: 'Bilal Masjid Committee', 
      category: 'Medical Aid', 
      amount: 30000, 
      funded: 12500, 
      status: 'Approved',
      urgency: 'Urgent',
      description: 'Pediatric treatment and surgery medicines deposit at civil hospital.'
    },
    { 
      id: '104', 
      name: 'Shafeeq P.', 
      mahal: 'Noor Mahallu, Ward 7', 
      category: 'Education', 
      amount: 8000, 
      funded: 8000, 
      status: 'Disbursed',
      urgency: 'Standard',
      description: 'Engineering polytechnic semester admission fee challan for orphan student.'
    },
    { 
      id: '105', 
      name: 'Sister Fatima & 3 Children', 
      mahal: 'Industrial Crescent Ward #12', 
      category: 'Widow Support', 
      amount: 18000, 
      funded: 11000, 
      status: 'Approved',
      urgency: 'Standard',
      description: 'Widowed mother seeking industrial sewing machine to start home tailoring micro-income.'
    },
    { 
      id: '106', 
      name: 'Khadija Beevi & Grandchildren', 
      mahal: 'Juma Masjid Mahallu, Ward 3', 
      category: 'Widow Support', 
      amount: 12000, 
      funded: 4500, 
      status: 'Approved',
      urgency: 'Urgent',
      description: 'Ward 3 resident elderly widow caring for 2 school-going orphans. Essential nutrition & textbook allowance.'
    },
    { 
      id: '107', 
      name: 'Muhammad Basheer K.', 
      mahal: 'Juma Masjid Mahallu, Ward 3', 
      category: 'Al-Gharimin', 
      amount: 20000, 
      funded: 14000, 
      status: 'Approved',
      urgency: 'Standard',
      description: 'Darul Aman House, Ward 3 stall owner facing monsoon inventory losses. Rehabilitation of family livelihood.'
    },
  ]);

  // Messages State
  const [contacts, setContacts] = useState<MessageContact[]>([
    {
      id: 'c1',
      name: 'Thowfeeq Rahman',
      role: 'Mahallu Secretary',
      avatarText: 'TR',
      lastMsg: 'Your documents have been verified.',
      time: '10:45 AM',
      messages: [
        { id: 'm1', sender: 'official', text: 'As-salamu alaykum brother. We have logged your request in the Mahallu welfare registry.', time: '10:30 AM' },
        { id: 'm2', sender: 'user', text: 'Wa alaykumu as-salam. JazakAllah Khair. Do you need any physical receipts?', time: '10:38 AM' },
        { id: 'm3', sender: 'official', text: 'Your documents have been verified by the executive board. No further papers needed.', time: '10:45 AM' },
      ],
    },
    {
      id: 'c2',
      name: 'Anwar Ali',
      role: 'Relief Coordinator',
      avatarText: 'AA',
      lastMsg: 'Please share the bank passbook page.',
      time: 'Yesterday',
      messages: [
        { id: 'm4', sender: 'official', text: 'Marhaban. For direct account settlement, please share the IFSC & passbook first page.', time: 'Yesterday' },
      ],
    },
    {
      id: 'c3',
      name: 'Sirajudheen',
      role: 'Field Auditor',
      avatarText: 'S',
      lastMsg: 'Site visit completed for Case #102.',
      time: 'Oct 04',
      messages: [
        { id: 'm5', sender: 'official', text: 'Site inspection completed today at the tenant kiosk. Living status confirmed.', time: 'Oct 04' },
      ],
    },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Disbursement Confirmed',
      description: 'Your contribution of ₹5,000 for Education Aid (Ward 4) was handed over.',
      time: '2h ago',
      unread: true,
      type: 'disbursement',
    },
    {
      id: 'n2',
      title: 'Case #102 Verified by Ward',
      description: 'Raheem K. debt relief claim was approved by the Mahallu Committee.',
      time: 'Yesterday',
      unread: true,
      type: 'approval',
    },
    {
      id: 'n3',
      title: 'Ramadan Nisab Published',
      description: 'Silver Nisab updated to ₹56,337 based on current spot metal prices.',
      time: '3 days ago',
      unread: false,
      type: 'announcement',
    },
  ]);

  const handleDonationSuccess = (receipt: DonationRecord) => {
    setSelectedReceipt(receipt);
    setIsCertificateOpen(true);

    if (selectedClaimant) {
      setClaimantsList(prev => prev.map(c => {
        if (c.id === selectedClaimant.id) {
          const newFunded = c.funded + receipt.amount;
          return {
            ...c,
            funded: newFunded,
            status: newFunded >= c.amount ? 'Disbursed' : c.status,
          };
        }
        return c;
      }));
    }
  };

  const handleSendMessage = (contactId: string, text: string) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user' as const,
      text,
      time: 'Just now',
    };

    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          lastMsg: text,
          time: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    }));

    if (activeChatContact && activeChatContact.id === contactId) {
      setActiveChatContact(prev => prev ? {
        ...prev,
        lastMsg: text,
        time: 'Just now',
        messages: [...prev.messages, newMsg],
      } : null);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mahallu) return;

    try {
      setIsSubmittingApp(true);
      await submitAidApplication({
        applicantUid: user ? user.uid : 'anon_applicant',
        beneficiaryAlias: formData.fullName,
        category: 'Al-Gharimin',
        requestedAmount: parseFloat(formData.requestedAmount) || 25000,
        currency: 'INR',
        location: formData.mahallu,
        pincode: '676505',
        description: formData.reason,
        supportingDocNotes: `Files: ${uploadedFiles.join(', ') || 'Self-declaration submitted'} | Phone: ${formData.phone}`,
      });

      setIsSubmittingApp(false);
      setApplicationSubView('status');
    } catch (err) {
      console.error(err);
      setIsSubmittingApp(false);
      setApplicationSubView('status');
    }
  };

  // Handler for opening Interest option - prompts user if bank account is not linked
  const handleOpenInterest = () => {
    if (!linkedBankAccount || !linkedBankAccount.accountNumber) {
      setIsUnlinkedBankModalOpen(true);
    } else {
      setActiveTab('interest');
    }
  };

  // 1. Restore persisted linked bank account strictly for the current authenticated user
  useEffect(() => {
    if (user?.uid) {
      if (profile?.linkedBankAccount) {
        setLinkedBankAccount(profile.linkedBankAccount);
      } else {
        const cached = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${user.uid}`) : null;
        if (cached) {
          try {
            setLinkedBankAccount(JSON.parse(cached));
          } catch {
            setLinkedBankAccount(null);
          }
        } else {
          setLinkedBankAccount(null);
        }
      }
    } else {
      setLinkedBankAccount(null);
    }
  }, [profile, user]);

  // 2. Initial boot session restoration: keep session active without auto logout, prompt bank link if needed
  const [initialSessionRestored, setInitialSessionRestored] = useState(false);

  useEffect(() => {
    if (user && !hasExplicitlyLoggedOut && !initialSessionRestored) {
      setInitialSessionRestored(true);
      const savedRole = profile?.role || (typeof window !== 'undefined' ? (localStorage.getItem('tazku_active_role') as any) : null);
      if (savedRole && (savedRole === 'donor' || savedRole === 'mahal' || savedRole === 'vakeel')) {
        setActiveRole(savedRole);
      }
      // On boot restore: if mahal or vakeel, go directly to portal without bank prompt.
      if (savedRole === 'mahal' || savedRole === 'vakeel') {
        setMainScreen('main');
      } else if (profile?.linkedBankAccount?.accountNumber) {
        setMainScreen('main');
      } else {
        const cached = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${user.uid}`) : null;
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed?.accountNumber) {
              setLinkedBankAccount(parsed);
              setMainScreen('main');
              return;
            }
          } catch {}
        }

        getUserBankAccount(user.uid).then((savedBank) => {
          if (savedBank?.accountNumber) {
            setLinkedBankAccount(savedBank);
            setMainScreen('main');
          } else {
            setMainScreen('link_bank');
          }
        }).catch(() => {
          setMainScreen('link_bank');
        });
      }
    }
  }, [user, profile, hasExplicitlyLoggedOut, initialSessionRestored]);

  // 3. User-controlled unlinking (only unlinks when user explicitly clicks it)
  const handleUnlinkBankAccount = async () => {
    if (window.confirm("Are you sure you want to unlink this bank account? It will remain unlinked until you link a new one.")) {
      setLinkedBankAccount(null);
      if (user?.uid) {
        try {
          await unlinkUserBankAccount(user.uid);
        } catch (e) {
          console.error("Failed to unlink bank account in Firebase:", e);
        }
      }
    }
  };

  // Centralized Sign Out handler: transition immediately to the Get Started Screen (onboarding)
  const handleSignOut = async () => {
    setHasExplicitlyLoggedOut(true);
    try {
      await signOut();
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.removeItem('tazku_active_role');
      localStorage.removeItem('tazku_entered_name');
      localStorage.removeItem('tazku_is_fresh_mahallu');
      localStorage.removeItem('tazku_mahallu_profile');
      localStorage.removeItem('tazku_fresh_mahallu_claimants');
      localStorage.removeItem('tazku_fresh_mahallu_residents');
    } catch {}
    setIsFreshMahallu(false);
    setMahalluCommitteeProfile(null);
    setActiveRole('donor');
    setMainScreen('onboarding');
    setActiveTab('home');
  };

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;
  // Clean fallback: entered name, email name, or Community Member (NEVER Raheem Panoly)
  const displayName = profile?.displayName || user?.displayName || customEnteredName || (user?.email ? user.email.split('@')[0] : 'Community Member');
  const displayInitials = (displayName || 'CM')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CM';

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#112A20] font-sans flex justify-center">
      {/* Cinematic Splash Screen (0.0s - 2.2s) */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          onSkip={() => setShowSplash(false)}
        />
      )}

      {/* Mobile-Frame Canvas */}
      <div className="w-full max-w-md min-h-screen bg-[#FBFBF9] shadow-xl flex flex-col relative border-x border-[#EBE5D8]">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: LOGIN PAGE WITH TWO LOGINS: MAHAL LOGIN & PERSONAL LOGIN        */}
        {/* ========================================================================= */}
        {mainScreen === 'role_select' ? (
          <RoleSelectionScreen
            onSelectRole={(role) => {
              setSelectedRoleType(role);
              setMainScreen('account_action');
            }}
            onOpenOverview={() => setMainScreen('onboarding')}
          />
        ) : mainScreen === 'account_action' ? (
          /* ========================================================================= */
          /* SCREEN 2: AFTER THE TWO LOGINS -> TWO OPTIONS: CREATE ACCOUNT & LOGIN     */
          /* ========================================================================= */
          <AccountActionScreen
            role={selectedRoleType}
            onBack={() => setMainScreen('role_select')}
            onSelectAction={(action) => {
              setAuthInitialView(action);
              setMainScreen('auth');
            }}
          />
        ) : mainScreen === 'auth' ? (
          /* ========================================================================= */
          /* SCREEN 3: AUTHENTICATION FORM (LOGIN OR CREATE ACCOUNT)                   */
          /* ========================================================================= */
          <AuthScreen
            role={selectedRoleType}
            initialView={authInitialView}
            onBack={() => setMainScreen('account_action')}
            onAuthSuccess={async (roleType, name, isNewAccount, committeeDetails) => {
              if (name) {
                setCustomEnteredName(name);
                try {
                  localStorage.setItem('tazku_entered_name', name);
                } catch {}
              }
              setHasExplicitlyLoggedOut(false);
              const targetRole = roleType === 'mahal' ? 'mahal' : 'donor';
              setActiveRole(targetRole);
              try {
                localStorage.setItem('tazku_active_role', targetRole);
              } catch {}

              // New account handling for Mahallu Portal
              if (targetRole === 'mahal') {
                const isFresh = !!isNewAccount;
                setIsFreshMahallu(isFresh);
                try {
                  localStorage.setItem('tazku_is_fresh_mahallu', isFresh ? 'true' : 'false');
                } catch {}

                if (committeeDetails) {
                  setMahalluCommitteeProfile(committeeDetails);
                  try {
                    localStorage.setItem('tazku_mahallu_profile', JSON.stringify(committeeDetails));
                  } catch {}
                } else if (!isFresh) {
                  setMahalluCommitteeProfile(null);
                  try {
                    localStorage.removeItem('tazku_mahallu_profile');
                  } catch {}
                }
              }

              const currentUid = user?.uid || auth.currentUser?.uid;
              let hasLinkedAccount = false;
              if (currentUid) {
                saveUserRole(currentUid, targetRole).catch(() => {});
                try {
                  const savedBank = await getUserBankAccount(currentUid);
                  if (savedBank && savedBank.accountNumber) {
                    setLinkedBankAccount(savedBank);
                    hasLinkedAccount = true;
                  }
                } catch {}

                if (!hasLinkedAccount) {
                  const cached = typeof window !== 'undefined' ? localStorage.getItem(`tazku_linked_bank_${currentUid}`) : null;
                  if (cached) {
                    try {
                      const parsed = JSON.parse(cached);
                      if (parsed?.accountNumber) {
                        setLinkedBankAccount(parsed);
                        hasLinkedAccount = true;
                      }
                    } catch {}
                  }
                }
              }

              if (!hasLinkedAccount && profile?.linkedBankAccount?.accountNumber) {
                setLinkedBankAccount(profile.linkedBankAccount);
                hasLinkedAccount = true;
              }

              // After mahal login, directly open the Mahallu Portal (no link bank account screen)
              // If the user has ALREADY linked the account, DO NOT show the link your bank account page!
              if (targetRole === 'mahal') {
                setMainScreen('main');
                setActiveTab('home');
              } else if (hasLinkedAccount) {
                setMainScreen('main');
                setActiveTab('home');
              } else {
                // Show link bank account page only if user has no account linked
                setMainScreen('link_bank');
              }
            }}
          />
        ) : mainScreen === 'link_bank' ? (
          /* ========================================================================= */
          /* SCREEN 4: LINK BANK ACCOUNT (SHOWN TO NEW LOGS & MANAGEABLE AT ANY TIME)  */
          /* ========================================================================= */
          <LinkBankAccountScreen
            userName={displayName}
            roleType={selectedRoleType}
            existingBank={linkedBankAccount}
            onSkip={() => {
              const targetRole = selectedRoleType === 'mahal' ? 'mahal' : 'donor';
              setActiveRole(targetRole);
              try {
                localStorage.setItem('tazku_active_role', targetRole);
              } catch {}
              const currentUid = user?.uid || auth.currentUser?.uid;
              if (currentUid) {
                saveUserRole(currentUid, targetRole).catch(() => {});
              }
              setMainScreen('main');
              setActiveTab('home');
            }}
            onLinkSuccess={async (bankDetails) => {
              const linkedData: LinkedBankAccount = {
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNumber,
                ifsc: bankDetails.ifsc,
                accountHolderName: bankDetails.accountHolderName || displayName,
                accountType: bankDetails.accountType || 'Savings Account',
                linkedAt: new Date().toISOString(),
              };
              setLinkedBankAccount(linkedData);
              const currentUid = user?.uid || auth.currentUser?.uid;
              if (currentUid) {
                try {
                  await saveUserBankAccount(currentUid, linkedData);
                  await refreshProfile();
                } catch (e) {
                  console.error("Failed to persist bank account to Firebase:", e);
                }
              } else {
                try {
                  localStorage.setItem('tazku_linked_bank_pending', JSON.stringify(linkedData));
                } catch {}
              }
              const targetRole = selectedRoleType === 'mahal' ? 'mahal' : 'donor';
              setActiveRole(targetRole);
              try {
                localStorage.setItem('tazku_active_role', targetRole);
              } catch {}
              if (currentUid) {
                saveUserRole(currentUid, targetRole).catch(() => {});
              }
              setMainScreen('main');
              setActiveTab('home');
            }}
          />
        ) : mainScreen === 'onboarding' ? (
          /* ========================================================================= */
          /* ONBOARDING & FEATURES OVERVIEW SCREEN                                     */
          /* ========================================================================= */
          <OnboardingScreen
            onLogin={() => {
              setMainScreen('role_select');
            }}
            onCreateAccount={() => {
              setMainScreen('role_select');
            }}
            onOpenTracker={() => {
              setActiveRole('donor');
              setMainScreen('main');
              setActiveTab('tracker');
            }}
            onOpenCalculator={() => {
              setActiveRole('donor');
              setMainScreen('main');
              setActiveTab('calculator');
            }}
            onOpenArticles={() => {
              setIsGuideOpen(true);
            }}
            onOpenFAQ={() => {
              setFaqSupportConfig({ isOpen: true, tab: 'faq' });
            }}
            onOpenSupport={() => {
              setFaqSupportConfig({ isOpen: true, tab: 'support' });
            }}
            onSelectMahalLogin={() => {
              setSelectedRoleType('mahal');
              setMainScreen('account_action');
            }}
            onSelectVakeelLogin={() => {
              setRoleLoginType('vakeel');
            }}
          />
        ) : activeRole === 'mahal' ? (
          /* ========================================================================= */
          /* MAHAL COMMITTEE ADMIN PORTAL                                              */
          /* ========================================================================= */
          <MahalluPortalScreen
            isNewAccount={isFreshMahallu}
            committeeProfile={mahalluCommitteeProfile}
            onBackToHome={() => {
              handleSignOut();
            }}
            onSwitchRole={(newRole) => {
              if (newRole === 'vakeel') {
                setActiveRole('vakeel');
              } else {
                setActiveRole('donor');
                setActiveTab('home');
              }
            }}
          />
        ) : activeRole === 'vakeel' ? (
          /* ========================================================================= */
          /* AUTHORIZED VAKEEL PORTAL                                                  */
          /* ========================================================================= */
          <VakeelPortalScreen
            onBackToHome={() => {
              handleSignOut();
            }}
            onSwitchRole={(newRole) => {
              setActiveRole(newRole);
              if (newRole === 'donor') setActiveTab('home');
            }}
          />
        ) : (
          /* ========================================================================= */
          /* MAIN APPLICATION FLOW (Home, Claimants, Tracker, Articles, Profile)       */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col pb-16">
            
            {/* ===================== VIEW 1: HOME DASHBOARD ===================== */}
            {activeTab === 'home' && (
              <div className="flex-1 flex flex-col animate-in fade-in duration-150">
                {/* Top Greeting Header */}
                <div className="bg-[#1B4332] text-white p-6 rounded-b-[2.5rem] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-lg overflow-hidden group-hover:scale-105 transition">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{displayInitials}</span>
                        )}
                      </div>
                      <div>
                        <h1 className="text-lg font-bold flex items-center gap-1.5">
                          <span>{displayName}</span>
                          <ChevronRight className="w-4 h-4 text-[#EBE5D8]" />
                        </h1>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Logout Button */}
                      <button 
                        type="button" 
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                        title="Logout"
                        aria-label="Logout"
                      >
                        <LogOut className="w-3.5 h-3.5 text-white" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>

                  {/* Bank Account Status / Direct Aid Badge */}
                  {linkedBankAccount ? (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{linkedBankAccount.bankName}</span>
                            <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] px-2 py-0.5 rounded-full font-bold">
                              Linked
                            </span>
                          </div>
                          <p className="text-[11px] text-[#F3EFE6] font-mono mt-0.5">
                            A/C: •••• {linkedBankAccount.accountNumber.slice(-4)} • Direct Settlement
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMainScreen('link_bank')}
                          className="text-[10px] bg-white/20 hover:bg-white/30 text-white font-semibold px-2 py-1 rounded-full transition cursor-pointer"
                          title="Manage bank account"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          onClick={handleUnlinkBankAccount}
                          className="text-[10px] bg-white/15 hover:bg-white/25 text-rose-100 font-semibold px-2 py-1 rounded-full transition cursor-pointer"
                          title="Unlink this bank account"
                        >
                          Unlink
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                          <ShieldCheck className="w-4 h-4 text-[#E9F3ED]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">Direct Local Zakat Aid</span>
                          <p className="text-[10px] text-[#F3EFE6]">100% verified Mahallu families • 0% platform deductions</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setMainScreen('link_bank')}
                        className="text-[10px] bg-[#F3EFE6] text-[#1B4332] font-bold px-2.5 py-1 rounded-full shadow-2xs hover:bg-white transition cursor-pointer"
                      >
                        Link Bank
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Action Banner: Calculate Your Zakat */}
                <div className="px-5 -mt-5">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('calculator')}
                    className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between transition border-2 border-[#EBE5D8] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/15 rounded-xl">
                        <Calculator className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base leading-tight">Calculate Your Zakat</div>
                        <div className="text-xs text-[#F3EFE6]">Live Nisab gold/silver calculation</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#EBE5D8]" />
                  </button>
                </div>

                {/* Donate Option (No Application Option on Personal Home Page) */}
                <div className="px-5 mt-4">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('claimants')}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#1B4332] text-white rounded-2xl font-bold text-sm hover:bg-[#2D6A4F] transition shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Donate Zakat Directly</span>
                  </button>
                </div>

                {/* ================================================================= */}
                {/* CORE PLATFORM SERVICES & TOOLS (Elements after Login / Sign-up)  */}
                {/* ================================================================= */}
                <div className="px-5 mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Services & Management</h2>
                      <p className="text-[11px] text-gray-500">Essential calculation, tracking & support modules</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* 1. Zakat Records & Transactions */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('tracker')}
                      className="w-full bg-white hover:bg-[#F3EFE6]/40 border border-[#EBE5D8] hover:border-[#40916C]/60 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] group-hover:bg-[#1B4332] text-[#1B4332] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs group-hover:scale-105">
                          <ClipboardList className="w-5 h-5 transition-transform duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-[#112A20] group-hover:text-[#1B4332] transition-colors leading-tight truncate">
                            Zakat Records & Transactions
                          </h3>
                          <p className="text-[11px] text-[#526059] group-hover:text-[#112A20] transition-colors line-clamp-1 leading-snug mt-0.5">
                            Calculation history, Nisab audits & payment ledger
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F3EFE6] group-hover:bg-[#E9F3ED] flex items-center justify-center transition-colors text-[#526059] group-hover:text-[#1B4332] shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    {/* 2. Zakat Calculator */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('calculator')}
                      className="w-full bg-white hover:bg-[#F3EFE6]/40 border border-[#EBE5D8] hover:border-[#40916C]/60 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] group-hover:bg-[#1B4332] text-[#1B4332] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs group-hover:scale-105">
                          <Calculator className="w-5 h-5 transition-transform duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-[#112A20] group-hover:text-[#1B4332] transition-colors leading-tight truncate">
                            Zakat Calculator
                          </h3>
                          <p className="text-[11px] text-[#526059] group-hover:text-[#112A20] transition-colors line-clamp-1 leading-snug mt-0.5">
                            Dynamic gold, silver, cash & asset valuation
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F3EFE6] group-hover:bg-[#E9F3ED] flex items-center justify-center transition-colors text-[#526059] group-hover:text-[#1B4332] shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    {/* 3. Interest (Riba) Purification */}
                    <button
                      type="button"
                      onClick={handleOpenInterest}
                      className="w-full bg-white hover:bg-[#F3EFE6]/40 border border-[#EBE5D8] hover:border-[#40916C]/60 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] group-hover:bg-[#B45309] text-[#B45309] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs group-hover:scale-105">
                          <Landmark className="w-5 h-5 transition-transform duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-bold text-[#112A20] group-hover:text-[#1B4332] transition-colors leading-tight truncate">
                              Interest (Riba) Purification
                            </h3>
                            {!linkedBankAccount && (
                              <span className="text-[9px] font-bold bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.2 rounded-full border border-[#D97706]/30 shrink-0">
                                Link Bank
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#526059] group-hover:text-[#112A20] transition-colors line-clamp-1 leading-snug mt-0.5">
                            Takhallus ledger & statement interest isolation
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F3EFE6] group-hover:bg-[#E9F3ED] flex items-center justify-center transition-colors text-[#526059] group-hover:text-[#1B4332] shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    {/* 4. FAQ */}
                    <button
                      type="button"
                      onClick={() => setFaqSupportConfig({ isOpen: true, tab: 'faq' })}
                      className="w-full bg-white hover:bg-[#F3EFE6]/40 border border-[#EBE5D8] hover:border-[#40916C]/60 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] group-hover:bg-[#1B4332] text-[#1B4332] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs group-hover:scale-105">
                          <MessageSquare className="w-5 h-5 transition-transform duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-[#112A20] group-hover:text-[#1B4332] transition-colors leading-tight truncate">
                            FAQ
                          </h3>
                          <p className="text-[11px] text-[#526059] group-hover:text-[#112A20] transition-colors line-clamp-1 leading-snug mt-0.5">
                            Common questions & instant community support
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F3EFE6] group-hover:bg-[#E9F3ED] flex items-center justify-center transition-colors text-[#526059] group-hover:text-[#1B4332] shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity Transaction Feed */}
                <div className="px-5 mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#112A20]">Recent Activity</h2>
                    <button 
                      type="button"
                      onClick={() => setIsStatsOpen(true)}
                      className="text-xs text-[#2D6A4F] hover:text-[#1B4332] font-semibold hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {recentActivities.map((act, i) => {
                      const isPurification = act.zakatType === 'Interest Purification / Takhallus' || act.name.includes('Purification');
                      const parsedAmount = parseInt(act.amount.replace(/[^0-9]/g, '')) || 0;
                      return (
                        <div 
                          key={act.receiptNumber || i} 
                          onClick={() => {
                            setSelectedReceipt({
                              id: act.id || `rec_${i}`,
                              caseId: act.caseId || `case_${i}`,
                              caseTitle: act.name,
                              donorId: user ? user.uid : 'community_member',
                              donorName: displayName,
                              amount: parsedAmount,
                              amountUSD: Math.round(parsedAmount / 86.5),
                              currency: 'INR',
                              zakatType: act.zakatType || 'Zakat al-Mal',
                              createdAt: act.createdAt || new Date().toISOString(),
                              receiptNumber: act.receiptNumber,
                              isAnonymous: false,
                              notes: act.notes
                            });
                            setIsCertificateOpen(true);
                          }}
                          className={`flex items-center justify-between p-3.5 bg-white rounded-2xl border shadow-xs hover:border-[#40916C]/40 cursor-pointer transition ${
                            isPurification 
                              ? 'border-[#D97706]/30 bg-linear-to-r from-white to-[#FEF3C7]/20 hover:border-[#D97706]' 
                              : 'border-[#EBE5D8]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              isPurification ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#E9F3ED] text-[#1B4332]'
                            }`}>
                              {isPurification ? (
                                <Sparkles className="w-5 h-5 text-[#B45309]" />
                              ) : (
                                <CheckCircle2 className="w-5 h-5 text-[#40916C]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#112A20] truncate">{act.name}</span>
                                {isPurification && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-[#FEF3C7] text-[#B45309] border border-[#D97706]/30 shrink-0">
                                    Takhallus
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#526059] truncate">
                                {act.date} • {act.status}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-mono font-bold text-xs block ${
                              isPurification ? 'text-[#B45309]' : 'text-[#1B4332]'
                            }`}>
                              {act.amount}
                            </span>
                            <span className="text-[9px] text-[#526059]">View Receipt</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 2: CLAIMANTS / DISTRIBUTION METHOD SELECTION (After "Give Zakat")  */}
            {/* ========================================================================= */}
            {activeTab === 'claimants' && (
              <ClaimantsMethodScreen
                onBack={() => setActiveTab('home')}
                claimants={claimantsList}
                onSelectClaimant={(c) => setSelectedClaimant(c)}
                onOpenBlogGuide={() => setIsGuideOpen(true)}
                onEntrustVakeel={(v) => setSelectedVakeelForWakalah(v)}
              />
            )}

            {/* ===================== VIEW 3: RECORDS ===================== */}
            {activeTab === 'tracker' && (
              <ZakatRecordsScreen
                onBack={() => setActiveTab('home')}
                onOpenCalculator={() => setActiveTab('calculator')}
                onGiveZakat={(amt) => {
                  if (amt) setPrefilledAmount(amt);
                  setActiveTab('claimants');
                }}
                recentActivities={recentActivities}
              />
            )}

            {/* ===================== VIEW 3.5: ACCORDION CALCULATOR SCREEN ===================== */}
            {activeTab === 'calculator' && (
              <ZakatCalculatorAccordionScreen
                onBack={() => setActiveTab('home')}
                onAllotZakat={(amt) => {
                  setPrefilledAmount(amt);
                  setActiveTab('claimants');
                }}
                onViewRecords={() => setActiveTab('tracker')}
              />
            )}

            {/* ===================== VIEW 4: ARTICLES & DOCS ===================== */}
            {activeTab === 'articles' && (
              <div className="flex-1 flex flex-col p-5 space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">
                    Zakat Knowledge Base & Articles
                  </h1>
                  <p className="text-xs text-gray-500">
                    Scholarly research, Fiqh manuals, and distribution guidelines
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      tag: 'Core Rules',
                      title: 'Understanding Zakat: Rules & Hawl Calculation',
                      desc: 'Comprehensive guidance on the 8 categories, hawl dates, and contemporary asset valuations.',
                      time: '5 min read'
                    },
                    {
                      tag: 'Fiqh Ruling',
                      title: 'The Principles of Naqlu Zakat (Transfer of Funds)',
                      desc: 'When is it legally permissible to transfer Zakat outside the local Mahallu jurisdiction?',
                      time: '7 min read'
                    },
                    {
                      tag: 'Governance',
                      title: 'Wakalah bil-Qabd: Appointing an Authorized Vakeel',
                      desc: 'The Shariah legal framework of appointing a religious representative to distribute Zakat.',
                      time: '4 min read'
                    },
                    {
                      tag: 'Commodities',
                      title: 'Gold vs Silver Nisab: Which standard should you choose?',
                      desc: 'Detailed analysis of classical jurists on maximizing benefit for impoverished recipients.',
                      time: '6 min read'
                    }
                  ].map((art, idx) => (
                    <div
                      key={idx}
                      onClick={() => setIsGuideOpen(true)}
                      className="p-4 bg-white rounded-2xl border border-[#EBE5D8] shadow-xs hover:border-[#40916C]/50 cursor-pointer transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] px-2 py-0.5 rounded-full font-bold">
                          {art.tag}
                        </span>
                        <span className="text-[10px] text-[#526059]">{art.time}</span>
                      </div>
                      <h3 className="font-bold text-xs text-[#112A20] leading-snug">{art.title}</h3>
                      <p className="text-[11px] text-[#526059] leading-relaxed">{art.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== VIEW 5: PROFILE & SETTINGS ===================== */}
            {activeTab === 'profile' && (
              <div className="flex-1 flex flex-col p-5 space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-[#112A20] leading-tight">
                    Donor Account & Profile
                  </h1>
                  <p className="text-xs text-[#526059]">
                    Manage your credentials, certificates, and Mahallu association
                  </p>
                </div>

                {/* Profile Header Card with Quick Edit */}
                <div className="bg-white p-4 rounded-2xl border border-[#EBE5D8] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#E9F3ED] text-[#1B4332] font-bold text-xl flex items-center justify-center border border-[#40916C]/20 shrink-0">
                      {profile?.photoURL || user?.photoURL ? (
                        <img 
                          src={profile?.photoURL || user?.photoURL || ''} 
                          alt={displayName} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <span>{displayInitials}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#112A20] leading-snug">{displayName}</h3>
                      <span className="text-xs text-[#526059]">{user?.email || 'Contributor ID: #TK-88190'}</span>
                      <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] font-bold px-2 py-0.5 rounded-full border border-[#40916C]/20 block w-fit mt-1">
                        Verified Mahallu Member
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#E9F3ED] hover:bg-[#d8ebe0] text-[#1B4332] rounded-xl font-bold text-xs transition border border-[#40916C]/20 cursor-pointer shrink-0"
                    title="Edit Profile Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Linked Bank Account Card with Persistent Status and Unlink Option */}
                {linkedBankAccount ? (
                  <div className="bg-white p-4 rounded-2xl border border-[#EBE5D8] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#1B4332]" />
                        <span className="text-xs font-bold text-[#112A20]">Linked Bank Account</span>
                      </div>
                      <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] font-bold px-2 py-0.5 rounded-full border border-[#40916C]/20">
                        Active & Synced
                      </span>
                    </div>
                    <div className="text-xs text-[#526059] bg-[#FBFBF9] p-2.5 rounded-xl border border-[#EBE5D8]">
                      <div className="font-bold text-[#112A20]">{linkedBankAccount.bankName}</div>
                      <div className="text-[11px] text-[#526059] font-mono mt-0.5">
                        A/C: •••• {linkedBankAccount.accountNumber.slice(-4)} • IFSC: {linkedBankAccount.ifsc}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setMainScreen('link_bank')}
                        className="text-xs text-[#2D6A4F] hover:text-[#1B4332] font-bold px-3 py-1.5 rounded-xl hover:bg-[#F3EFE6] transition cursor-pointer border border-[#EBE5D8]"
                      >
                        Update Details
                      </button>
                      <button
                        type="button"
                        onClick={handleUnlinkBankAccount}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                      >
                        Unlink Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-2xl border border-dashed border-[#EBE5D8] shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#112A20]">No Bank Account Linked</div>
                      <div className="text-[11px] text-[#526059]">Link once to disburse Zakat directly</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMainScreen('link_bank')}
                      className="text-xs bg-[#1B4332] text-white font-bold px-3 py-1.5 rounded-xl hover:bg-[#2D6A4F] transition cursor-pointer shadow-xs"
                    >
                      Link Bank
                    </button>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFaqSupportConfig({ isOpen: true, tab: 'support' })}
                    className="w-full py-3 bg-white border border-[#EBE5D8] text-[#112A20] hover:bg-[#F3EFE6] rounded-full font-bold text-xs transition cursor-pointer"
                  >
                    Help & Support Helpline
                  </button>

                  {!user ? (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await signInWithGoogle();
                        } catch (e) {
                          console.warn("Google sign in note:", e);
                        }
                      }}
                      className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Sign In with Google
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ===================== VIEW 6: APPLICATION & STATUS ===================== */}
            {activeTab === 'application' && (
              <div className="flex-1 flex flex-col p-5 animate-in fade-in duration-150 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-xl font-bold text-[#112A20] leading-tight">Zakat Application</h1>
                    <p className="text-xs text-[#526059]">Mahallu welfare claim portal</p>
                  </div>
                  <div className="bg-[#F3EFE6] p-1 rounded-full flex gap-1 border border-[#EBE5D8]">
                    <button
                      type="button"
                      onClick={() => setApplicationSubView('form')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                        applicationSubView === 'form' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#526059]'
                      }`}
                    >
                      New Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplicationSubView('status')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                        applicationSubView === 'status' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#526059]'
                      }`}
                    >
                      Status & Timeline
                    </button>
                  </div>
                </div>

                {applicationSubView === 'form' ? (
                  <form onSubmit={handleApplicationSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#112A20] mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter claimant name" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs focus:ring-1 focus:ring-[#40916C] focus:border-[#40916C] focus:outline-hidden font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#112A20] mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="name@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs focus:ring-1 focus:ring-[#40916C] focus:border-[#40916C] focus:outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#112A20] mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+91 XXXXX XXXXX" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs focus:ring-1 focus:ring-[#40916C] focus:border-[#40916C] focus:outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#112A20] mb-1">Mahallu / Ward</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Juma Masjid, Ward 3" 
                          value={formData.mahallu}
                          onChange={(e) => setFormData({...formData, mahallu: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs focus:ring-1 focus:ring-[#40916C] focus:border-[#40916C] focus:outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#112A20] mb-1">Requested (₹)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="e.g. 25000" 
                          value={formData.requestedAmount}
                          onChange={(e) => setFormData({...formData, requestedAmount: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs focus:ring-1 focus:ring-[#40916C] focus:border-[#40916C] focus:outline-hidden font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#112A20] mb-1">Reason for Application</label>
                      <textarea 
                        rows={2}
                        required
                        placeholder="Explain your situation (debt, emergency, education, livelihood...)"
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full px-3.5 py-2 bg-white border border-[#EBE5D8] rounded-xl text-xs focus:ring-1 focus:ring-[#40916C] focus:border-[#40916C] focus:outline-hidden leading-relaxed"
                      />
                    </div>

                    {/* Upload Documents Box */}
                    <div>
                      <label className="block text-xs font-semibold text-[#112A20] mb-1">Supporting Documents</label>
                      <label className="border-2 border-dashed border-[#EBE5D8] hover:border-[#40916C] rounded-2xl p-4 text-center bg-[#FBFBF9] hover:bg-[#F3EFE6]/30 cursor-pointer block transition">
                        <Upload className="w-5 h-5 text-[#526059] mx-auto mb-1" />
                        <span className="text-[11px] text-[#526059] block">Upload ID, ration card, or hospital bills</span>
                        <span className="text-[10px] text-[#2D6A4F] font-semibold">PDF, JPG up to 5MB</span>
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) {
                              const names = Array.from(e.target.files).map(f => f.name);
                              setUploadedFiles(prev => [...prev, ...names]);
                            }
                          }}
                        />
                      </label>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {uploadedFiles.map((fn, idx) => (
                            <span key={idx} className="text-[10px] bg-[#E9F3ED] text-[#1B4332] px-2 py-0.5 rounded-full font-bold border border-[#40916C]/20">
                              ✓ {fn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingApp}
                      className="w-full mt-3 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingApp ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#F3EFE6] p-4 rounded-2xl border border-[#EBE5D8]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-[#1B4332] uppercase tracking-wider">
                          Application ID: #APP-2026-884
                        </span>
                        <span className="text-[10px] bg-[#1B4332] text-white px-2.5 py-0.5 rounded-full font-bold">
                          Under Review
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#EBE5D8]">
                        <div>
                          <span className="text-[10px] text-[#526059] block">Target Need</span>
                          <span className="font-mono font-bold text-[#112A20] text-xs">₹25,000</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#526059] block">Allotted</span>
                          <span className="font-mono font-bold text-[#1B4332] text-xs">₹18,500</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#526059] block">Timeline</span>
                          <span className="font-mono font-bold text-[#D97706] text-xs">8 Days Left</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#EBE5D8] shadow-xs">
                      <h3 className="text-xs font-bold text-[#112A20] uppercase tracking-wider mb-4">
                        Verification Milestones
                      </h3>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1B4332]/25">
                        <div className="relative">
                          <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                          <div className="text-xs font-bold text-[#112A20] leading-tight">
                            Application Submitted
                          </div>
                          <div className="text-[11px] text-[#526059] mt-0.5">
                            Received by Central Ward Registry • Oct 04, 2026
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                          <div className="text-xs font-bold text-[#112A20] leading-tight">
                            Initial Review
                          </div>
                          <div className="text-[11px] text-[#526059] mt-0.5">
                            Vetted by Mahallu Welfare Board • Oct 05, 2026
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[10px] font-bold">
                            ●
                          </div>
                          <div className="text-xs font-bold text-[#112A20] leading-tight">
                            Document Verification & Home Visit
                          </div>
                          <div className="text-[11px] text-[#2D6A4F] font-semibold mt-0.5">
                            Field Auditor (Sirajudheen) visit in progress
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#EBE5D8] text-[#526059] flex items-center justify-center text-[10px]">
                            4
                          </div>
                          <div className="text-xs font-bold text-[#526059] leading-tight">
                            Disbursed to Beneficiary Account
                          </div>
                          <div className="text-[11px] text-[#526059]/80 mt-0.5">
                            Direct bank / merchant settlement
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== VIEW 7: MESSAGES ===================== */}
            {activeTab === 'messages' && (
              <div className="flex-1 flex flex-col p-5 animate-in fade-in duration-150">
                <h1 className="text-xl font-bold text-[#112A20] mb-1">Mahal Communications</h1>
                <p className="text-xs text-[#526059] mb-4">Direct contact with local collectors & verifiers</p>

                <div className="space-y-2.5">
                  {contacts.map((msg) => (
                    <div 
                      key={msg.id} 
                      onClick={() => setActiveChatContact(msg)}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#EBE5D8] shadow-xs cursor-pointer hover:bg-[#F3EFE6]/40 transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E9F3ED] text-[#1B4332] font-bold flex items-center justify-center shrink-0">
                        {msg.avatarText}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-bold text-[#112A20] truncate">{msg.name}</h4>
                          <span className="text-[10px] text-[#526059]">{msg.time}</span>
                        </div>
                        <div className="text-[11px] text-[#2D6A4F] font-medium">{msg.role}</div>
                        <p className="text-[11px] text-[#526059] truncate">{msg.lastMsg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== VIEW 8: INTEREST (RIBA) PURIFICATION ===================== */}
            {activeTab === 'interest' && (
              <InterestScreen
                linkedBank={linkedBankAccount}
                onDisburseInterest={handleDisburseInterest}
                onViewReceipt={handleViewPurificationReceipt}
                recentActivities={recentActivities}
                onBackToHome={() => setActiveTab('home')}
                onLinkBank={() => setMainScreen('link_bank')}
              />
            )}

            {/* ========================================================================= */}
            {/* 5. STICKY BOTTOM NAVIGATION BAR (Home, Tracker, Calculator, Interest, Profile) */}
            {/* ========================================================================= */}
            <nav className="fixed bottom-0 max-w-md w-full h-16 bg-white border-t border-[#EBE5D8] flex items-center justify-around px-2 z-40 shadow-lg">
              {/* 1. Home */}
              <button 
                type="button"
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold transition px-2 py-1 cursor-pointer ${
                  activeTab === 'home' ? 'text-[#1B4332]' : 'text-[#526059] hover:text-[#112A20]'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              {/* 2. Records */}
              <button 
                type="button"
                onClick={() => setActiveTab('tracker')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold transition px-2 py-1 cursor-pointer ${
                  activeTab === 'tracker' ? 'text-[#1B4332]' : 'text-[#526059] hover:text-[#112A20]'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                <span>Records</span>
              </button>

              {/* 3. Calculator */}
              <button 
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold transition px-2 py-1 cursor-pointer ${
                  activeTab === 'calculator' ? 'text-[#1B4332]' : 'text-[#526059] hover:text-[#112A20]'
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span>Calculator</span>
              </button>

              {/* 4. Interest */}
              <button 
                type="button"
                onClick={handleOpenInterest}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold transition px-2 py-1 cursor-pointer ${
                  activeTab === 'interest' ? 'text-[#1B4332]' : 'text-[#526059] hover:text-[#112A20]'
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span>Interest</span>
              </button>

              {/* 5. Profile */}
              <button 
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold transition px-2 py-1 cursor-pointer ${
                  activeTab === 'profile' ? 'text-[#1B4332]' : 'text-[#526059] hover:text-[#112A20]'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>

          </div>
        )}

        {/* ===================== MODALS & DRAWERS ===================== */}

        {/* Chat Drawer Overlay */}
        <ZakkuChatDrawer
          contact={activeChatContact}
          onClose={() => setActiveChatContact(null)}
          onSendMessage={handleSendMessage}
        />

        {/* Zakat Calculator Modal */}
        <ZakkuCalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          onAllotZakat={(amt) => {
            setPrefilledAmount(amt);
            setActiveTab('claimants');
          }}
        />

        {/* Guide / Articles Modal */}
        <ZakkuGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onOpenCalculator={() => {
            setIsGuideOpen(false);
            setActiveTab('calculator');
          }}
        />

        {/* Claimant Allotment Modal */}
        <ZakkuClaimantModal
          claimant={selectedClaimant}
          onClose={() => setSelectedClaimant(null)}
          onDonationSuccess={handleDonationSuccess}
          prefilledAmount={prefilledAmount}
        />

        {/* Stats Modal */}
        <ZakkuStatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          onDownloadReport={() => {
            setIsStatsOpen(false);
            setSelectedReceipt({
              id: 'rep_annual_01',
              caseId: 'case_summary',
              caseTitle: 'Official Community Mahallu Zakat & Audit Certificate',
              donorId: user ? user.uid : 'community_member',
              donorName: displayName,
              amount: 26000,
              amountUSD: 300,
              currency: 'INR',
              zakatType: 'Zakat al-Mal',
              createdAt: new Date().toISOString(),
              receiptNumber: 'TZK-2026-REPORT-91',
              isAnonymous: false,
            });
            setIsCertificateOpen(true);
          }}
        />

        {/* Notification Drawer */}
        <ZakkuNotificationDrawer
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
        />

        {/* Official Certificate & Tax Receipt Modal */}
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          record={selectedReceipt}
        />

        {/* Role Login Modals (Mahal Login / Vakeel Login) */}
        <RoleLoginModal
          type={roleLoginType}
          onClose={() => setRoleLoginType(null)}
          onSuccess={(roleLabel) => {
            const nextRole = roleLoginType === 'mahal' ? 'mahal' : 'vakeel';
            setRoleLoginType(null);
            setActiveRole(nextRole);
            setMainScreen('main');
          }}
        />

        {/* FAQ & Support Modal */}
        <FAQSupportModal
          isOpen={faqSupportConfig.isOpen}
          initialTab={faqSupportConfig.tab}
          onClose={() => setFaqSupportConfig({ isOpen: false, tab: 'faq' })}
        />

        {/* Wakalah Modal for Vakeel Allotment */}
        <WakalahModal
          vakeel={selectedVakeelForWakalah}
          onClose={() => setSelectedVakeelForWakalah(null)}
          onSuccess={(receipt) => {
            setSelectedVakeelForWakalah(null);
            setSelectedReceipt(receipt);
            setIsCertificateOpen(true);
          }}
        />

        {/* Edit Profile Details Modal */}
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSaveSuccess={(newName) => {
            if (newName) {
              setCustomEnteredName(newName);
            }
          }}
        />

        {/* Unlinked Bank Account Notification Modal */}
        <UnlinkedBankAccountModal
          isOpen={isUnlinkedBankModalOpen}
          onClose={() => setIsUnlinkedBankModalOpen(false)}
          onLinkBank={() => {
            setIsUnlinkedBankModalOpen(false);
            setMainScreen('link_bank');
          }}
          onContinueToInterest={() => {
            setIsUnlinkedBankModalOpen(false);
            setActiveTab('interest');
          }}
        />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TazkuApp />
    </AuthProvider>
  );
}
