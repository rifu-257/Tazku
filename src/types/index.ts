export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SAR' | 'MYR';

export type Madhhab = 'Hanafi' | 'Shafii' | 'Maliki' | 'Hanbali';

export type QuranicCategory = 
  | 'Al-Fuqara' // The Extremely Impoverished
  | 'Al-Masakin' // The Needy
  | 'Al-Gharimin' // Debt-Relief
  | 'Medical Aid'
  | 'Education Support'
  | 'Widow & Orphan Support'
  | 'Fi Sabilillah' // Community Welfare
  | 'Ibn al-Sabil'; // Stranded Wayfarers

export interface NisabRates {
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldWeightGrams: number;
  silverWeightGrams: number;
  lastUpdated: string;
}

export interface LinkedBankAccount {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  linkedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  preferredCurrency: CurrencyCode;
  madhhab: Madhhab;
  role?: 'donor' | 'mahal' | 'vakeel';
  linkedBankAccount?: LinkedBankAccount | null;
}

export interface ZakatCalculationInput {
  cashInHand: number;
  bankBalances: number;
  foreignCurrency: number;
  goldGrams24k: number;
  goldGrams22k: number;
  isPersonalJewelryExempt: boolean;
  silverGrams: number;
  tradingStocks: number;
  longTermStocks: number;
  cryptocurrency: number;
  businessInventory: number;
  tradeReceivables: number;
  immediateDebts: number;
  immediateBills: number;
  useLunarYear: boolean;
  nisabStandard: 'gold' | 'silver';
  currency: CurrencyCode;
}

export interface SavedCalculation {
  id: string;
  userId: string;
  createdAt: string;
  cash: number;
  goldGrams: number;
  silverGrams: number;
  investments: number;
  businessAssets: number;
  liabilities: number;
  netZakatable: number;
  nisabThreshold: number;
  zakatDue: number;
  currency: CurrencyCode;
  status: 'calculated' | 'disbursed' | 'partial';
}

export interface BeneficiaryCase {
  id: string;
  title: string;
  beneficiaryAlias: string;
  category: QuranicCategory;
  location: string;
  pincode?: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  verifiedBy: string;
  verificationBadge: string;
  urgency: 'urgent' | 'high' | 'standard';
  status: 'active' | 'funded' | 'disbursed';
  applicantUid?: string;
  createdAt: string;
  impactMetric: string;
}

export interface DonationRecord {
  id: string;
  caseId: string;
  caseTitle: string;
  donorId: string;
  donorName: string;
  amount: number;
  amountUSD: number;
  currency: CurrencyCode;
  zakatType: 'Zakat al-Mal' | 'Zakat al-Fitr' | 'Sadaqah Nafilah';
  createdAt: string;
  receiptNumber: string;
  isAnonymous: boolean;
  notes?: string;
}

export interface BeneficiaryApplication {
  id: string;
  applicantUid: string;
  beneficiaryAlias: string;
  category: QuranicCategory;
  requestedAmount: number;
  currency: CurrencyCode;
  location: string;
  pincode: string;
  description: string;
  supportingDocNotes: string;
  status: 'pending_review' | 'verified_and_live' | 'rejected';
  createdAt: string;
}

export interface ClaimantItem {
  id: string;
  name: string;
  mahal: string;
  category: string;
  amount: number;
  funded: number;
  status: 'Under Review' | 'Approved' | 'Disbursed';
  urgency?: 'Urgent' | 'Standard';
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'official';
  text: string;
  time: string;
}

export interface MessageContact {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  lastMsg: string;
  time: string;
  unreadCount?: number;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'disbursement' | 'approval' | 'announcement';
}
