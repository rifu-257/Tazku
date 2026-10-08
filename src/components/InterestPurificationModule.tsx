import React, { useState } from 'react';
import { 
  Landmark, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Info, 
  HeartHandshake, 
  Droplets, 
  Stethoscope, 
  Building, 
  Check, 
  Receipt,
  Calendar,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Clock,
  Wallet
} from 'lucide-react';
import { LinkedBankAccount } from '../types';

export interface BankInterestRecord {
  id: string;
  bankName: string;
  shortCode: string;
  accountNumberMasked: string;
  amount: number;
  lastCreditedDate: string;
  statementTag: 'Interest Credit' | 'INT COLL' | 'SB INT' | 'MODS INT';
  quarter: string;
  month: string;
  referenceId: string;
  isPurified: boolean;
  purifiedAt?: string;
  purifiedReceipt?: string;
  color: string;
}

interface InterestPurificationModuleProps {
  linkedBank?: { bankName: string; accountNumber: string; ifsc: string; linkedAt?: string; accountHolderName?: string; accountType?: string } | null;
  onDisburseInterest: (purificationData: {
    amount: number;
    destinationName: string;
    destinationCategory: string;
    receiptNumber: string;
    banksPurified: string[];
  }) => void;
  onViewReceipt?: (receiptNumber: string) => void;
  isRecentMonthsModalOpen?: boolean;
  onToggleRecentMonths?: (open: boolean) => void;
  bankBalance?: number;
  onLinkBank?: () => void;
}

export const InterestPurificationModule: React.FC<InterestPurificationModuleProps> = ({
  linkedBank,
  onDisburseInterest,
  onViewReceipt,
  isRecentMonthsModalOpen: externalModalOpen,
  onToggleRecentMonths: externalToggleRecentMonths,
  bankBalance: externalBalance,
  onLinkBank,
}) => {
  // Modal state for Recent Months statement review
  const [internalRecentMonthsModalOpen, setInternalRecentMonthsModalOpen] = useState(false);
  const isRecentMonthsModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalRecentMonthsModalOpen;
  const setRecentMonthsModalOpen = externalToggleRecentMonths || setInternalRecentMonthsModalOpen;

  // Active bank details from user's linked account or fallback when not linked
  const isAccountLinked = !!(linkedBank && linkedBank.accountNumber);
  const activeBankName = isAccountLinked ? linkedBank.bankName : 'No Bank Account Linked';
  const activeAccountNumber = isAccountLinked ? `•••• ${linkedBank.accountNumber.slice(-4)}` : 'Not Linked';
  const activeIfsc = isAccountLinked ? linkedBank.ifsc : '—';
  const activeAccountType = isAccountLinked ? (linkedBank.accountType || 'Savings Account') : 'Not Connected';

  // Bank account balance: ALWAYS an amount above ₹ 1,00,000 as strictly requested
  const [bankBalance] = useState<number>(() => {
    if (externalBalance && externalBalance > 100000) return externalBalance;
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tazku_bank_account_balance') : null;
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 100000) return parsed;
    }
    return 184520; // Verified default: ₹ 1,84,520.00 (strictly > 100,000)
  });

  // Initial state for auto-detected bank interest credits with month-by-month recent months records
  const [bankRecords, setBankRecords] = useState<BankInterestRecord[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tazku_purified_interest_records') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'sbi_interest_sep',
        bankName: activeBankName,
        shortCode: 'SBI',
        accountNumberMasked: `${activeBankName} ${activeAccountNumber}`,
        amount: 620.00,
        lastCreditedDate: 'Sep 30, 2026',
        statementTag: 'SB INT',
        quarter: 'Q2 (Jul - Sep 2026)',
        month: 'September 2026',
        referenceId: 'TXN-SBIN-20260930-INT',
        isPurified: false,
        color: 'from-blue-600 to-indigo-700',
      },
      {
        id: 'sbi_interest_aug',
        bankName: activeBankName,
        shortCode: 'SBI',
        accountNumberMasked: `${activeBankName} ${activeAccountNumber}`,
        amount: 310.00,
        lastCreditedDate: 'Aug 31, 2026',
        statementTag: 'SB INT',
        quarter: 'Q2 (Jul - Sep 2026)',
        month: 'August 2026',
        referenceId: 'TXN-SBIN-20260831-INT',
        isPurified: false,
        color: 'from-blue-600 to-indigo-700',
      },
      {
        id: 'sbi_interest_jul',
        bankName: activeBankName,
        shortCode: 'SBI',
        accountNumberMasked: `${activeBankName} ${activeAccountNumber}`,
        amount: 310.00,
        lastCreditedDate: 'Jul 31, 2026',
        statementTag: 'SB INT',
        quarter: 'Q2 (Jul - Sep 2026)',
        month: 'July 2026',
        referenceId: 'TXN-SBIN-20260731-INT',
        isPurified: false,
        color: 'from-blue-600 to-indigo-700',
      },
      {
        id: 'indian_bank_interest_jun',
        bankName: 'Indian Bank',
        shortCode: 'Indian Bank',
        accountNumberMasked: 'Indian Bank •••• 9104',
        amount: 615.00,
        lastCreditedDate: 'Jun 30, 2026',
        statementTag: 'INT COLL',
        quarter: 'Q1 (Apr - Jun 2026)',
        month: 'June 2026',
        referenceId: 'TXN-IB-20260630-INT',
        isPurified: false,
        color: 'from-amber-600 to-red-600',
      },
    ];
  });

  // Modal State for Allocation Sheet
  const [isAllocationSheetOpen, setIsAllocationSheetOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('public_sanitation');
  const [hasAffirmedTakhallus, setHasAffirmedTakhallus] = useState(true);
  const [isProcessingDisposal, setIsProcessingDisposal] = useState(false);
  const [lastPurifiedReceipt, setLastPurifiedReceipt] = useState<string | null>(null);

  // Unpurified records
  const pendingRecords = bankRecords.filter(r => !r.isPurified);
  const totalAccumulatedInterest = pendingRecords.reduce((sum, r) => sum + r.amount, 0);
  const allPurified = pendingRecords.length === 0;
  const halalBalance = Math.max(0, bankBalance - totalAccumulatedInterest);

  // Welfare destinations suitable for non-Zakat Takhallus
  const welfareDestinations = [
    {
      id: 'public_sanitation',
      title: 'Public Sanitation & Clean Water Infrastructure',
      category: 'Public Municipal Utility',
      icon: Droplets,
      description: 'Village public washrooms, water filtration plant & paving shared access roads where personal benefit is generalized.',
      tag: 'Recommended for Takhallus',
    },
    {
      id: 'medical_debt_relief',
      title: 'Emergency Medical Debt Relief',
      category: 'Indigent Distress',
      icon: Stethoscope,
      description: 'Direct settlement of emergency hospital liabilities and distress for families with zero surplus income.',
      tag: 'Critical Relief',
    },
    {
      id: 'mahallu_welfare',
      title: 'Local Mahallu General Community Welfare',
      category: 'Mahallu Public Amenities',
      icon: Building,
      description: 'Public utility bills, disaster emergency equipment and general welfare without religious restriction.',
      tag: 'Local Mahallu Fund',
    },
  ];

  // Handle disposal execution
  const handleConfirmDisposal = async () => {
    if (!hasAffirmedTakhallus || totalAccumulatedInterest <= 0) return;
    setIsProcessingDisposal(true);

    try {
      const selectedDestObj = welfareDestinations.find(d => d.id === selectedDestination) || welfareDestinations[0];
      const receiptNumber = `TZK-PUR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowStr = new Date().toISOString();

      // Update state
      const updatedRecords = bankRecords.map(r => {
        if (!r.isPurified) {
          return {
            ...r,
            isPurified: true,
            purifiedAt: nowStr,
            purifiedReceipt: receiptNumber,
          };
        }
        return r;
      });

      setBankRecords(updatedRecords);
      try {
        localStorage.setItem('tazku_purified_interest_records', JSON.stringify(updatedRecords));
      } catch {}

      setLastPurifiedReceipt(receiptNumber);

      // Trigger app-level callback to log into Recent Activity & Firestore
      onDisburseInterest({
        amount: totalAccumulatedInterest,
        destinationName: selectedDestObj.title,
        destinationCategory: selectedDestObj.category,
        receiptNumber,
        banksPurified: pendingRecords.map(r => r.bankName),
      });

      setIsProcessingDisposal(false);
      setIsAllocationSheetOpen(false);
    } catch (e) {
      console.error('Failed to process interest disposal:', e);
      setIsProcessingDisposal(false);
    }
  };

  // Re-detect or simulate fresh interest accrual (for testing/demo)
  const handleResetForDemo = () => {
    const reset = bankRecords.map(r => ({
      ...r,
      isPurified: false,
      purifiedAt: undefined,
      purifiedReceipt: undefined,
    }));
    setBankRecords(reset);
    setLastPurifiedReceipt(null);
    try {
      localStorage.setItem('tazku_purified_interest_records', JSON.stringify(reset));
    } catch {}
  };

  return (
    <div className="w-full">
      {/* Container: Clean white elevated card (rounded-2xl with subtle #E2ECE9 border and soft shadow) */}
      <div className="bg-white rounded-2xl border border-[#E2ECE9] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        
        {/* Accent Bar at Top */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-amber-400 to-teal-600" />

        {/* 2. Header & Fiqh Context Banner */}
        <div className="p-4 sm:p-5 pb-3.5 border-b border-[#F0F5F3]">
          <div className="flex flex-wrap items-start justify-between gap-2.5">
            {/* Left Title */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight leading-snug">
                  Bank Interest Tracker (Riba Purification)
                </h3>
              </div>
            </div>

            {/* Right Badge: Soft mint tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F6F3] text-[#0D7C66] text-[11px] font-bold border border-[#0D7C66]/20 shrink-0">
              <Sparkles className="w-3 h-3 text-[#0D7C66]" />
              <span>Auto-Detected via Linked Accounts</span>
            </div>
          </div>
        </div>

        {/* 3. Linked Bank Account & Live Balance Hero Card */}
        <div className="p-4 sm:p-5 bg-linear-to-br from-[#F4FAF8] via-teal-50/40 to-white border-b border-[#E2ECE9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-xs shrink-0 ${
                isAccountLinked ? 'bg-[#0D7C66]' : 'bg-amber-600'
              }`}>
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900">{activeBankName}</span>
                  {isAccountLinked ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Linked Account
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      Account Not Linked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  {isAccountLinked 
                    ? `A/C: ${activeAccountNumber} • IFSC: ${activeIfsc} • ${activeAccountType}`
                    : 'Statement sync paused • Link your account to scan for Riba'}
                </p>
              </div>
            </div>
            
            {/* Live Feed indicator or Link Action */}
            {isAccountLinked ? (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D7C66] bg-white px-3 py-1 rounded-full border border-teal-100 shadow-2xs self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Net Banking Sync Active</span>
              </div>
            ) : onLinkBank ? (
              <button
                type="button"
                onClick={onLinkBank}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0D7C66] hover:bg-[#0A6654] px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5 text-teal-200" />
                <span>Link Bank Account</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-2xs self-start sm:self-auto">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Account Not Linked</span>
              </div>
            )}
          </div>

          {/* Account Balance & Total Interest Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {/* 1. Linked Bank Account Balance */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2ECE9] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <Wallet className="w-3.5 h-3.5 text-[#0D7C66]" />
                  <span>Total Bank Balance</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isAccountLinked 
                    ? 'text-teal-700 bg-teal-50 border-teal-100'
                    : 'text-amber-800 bg-amber-50 border-amber-200'
                }`}>
                  {isAccountLinked ? 'Audited > ₹1,00,000' : 'Unlinked'}
                </span>
              </div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-gray-900 mt-1.5">
                {isAccountLinked 
                  ? `₹ ${bankBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : '₹ 0.00'}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {isAccountLinked 
                  ? 'Current ledger balance held in your linked bank account'
                  : 'Link your bank account to auto-fetch ledger balance'}
              </p>
            </div>

            {/* 2. Total Interest Money in Bank Account */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50/60 rounded-2xl p-4 border border-amber-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Total Interest Money in Bank</span>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  {isAccountLinked ? 'Riba / Takhallus' : 'Scan Paused'}
                </span>
              </div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-amber-900 mt-1.5">
                {isAccountLinked 
                  ? `₹ ${totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : '₹ 0.00'}
              </div>
              <p className="text-[10px] text-amber-800 mt-0.5">
                {isAccountLinked 
                  ? <>Net Permissible Capital: <strong>₹ {halalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></>
                  : 'You are not linked your account. Link to scan statements.'}
              </p>
            </div>
          </div>

          {/* 3. Action Buttons & Recent Months Statement Trigger */}
          <div className="mt-3.5 space-y-2.5">
            <button
              type="button"
              onClick={() => setRecentMonthsModalOpen(true)}
              className="w-full py-3 px-4 bg-white hover:bg-teal-50/60 border border-[#0D7C66]/40 hover:border-[#0D7C66] text-[#0D7C66] rounded-xl text-xs font-bold transition flex items-center justify-between shadow-2xs hover:shadow-xs cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E8F6F3] group-hover:bg-[#0D7C66] text-[#0D7C66] group-hover:text-white flex items-center justify-center transition shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-extrabold text-xs text-gray-900 group-hover:text-[#0D7C66] transition">
                    View Interest Credited in Recent Months
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Month-by-month bank statement audit & credit dates
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                  {bankRecords.length} Recent Credits • ₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <ChevronRight className="w-4 h-4 text-[#0D7C66] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Primary Action Button */}
            {!allPurified ? (
              <button
                type="button"
                onClick={() => setIsAllocationSheetOpen(true)}
                className="w-full bg-[#0D7C66] hover:bg-[#0A6654] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-teal-200" />
                <span>Donate / Purify Interest (₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0D7C66] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-950">
                      All Detected Interest Purified via Takhallus!
                    </span>
                    <p className="text-[10px] text-emerald-700">
                      Receipt logged in Recent Activity. Zero illicit funds in your wealth pool.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lastPurifiedReceipt && onViewReceipt && (
                    <button
                      type="button"
                      onClick={() => onViewReceipt(lastPurifiedReceipt)}
                      className="text-xs font-bold text-[#0D7C66] bg-white border border-emerald-300 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                    >
                      Receipt
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetForDemo}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline px-1 cursor-pointer"
                    title="Simulate newly accrued quarterly interest"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ALLOCATION SHEET / MODAL FOR INTEREST DISPOSAL (TAKHALLUS)               */}
      {/* ========================================================================= */ }
      {isAllocationSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-amber-50/70 to-teal-50/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    Interest Purification Allocation
                  </h3>
                  <p className="text-xs text-gray-500">
                    Disposal of Riba via Takhallus (Non-Zakat Public Welfare)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAllocationSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Highlight Amount Banner */}
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    Amount to Disburse & Purify
                  </span>
                  <div className="text-xs text-amber-900 mt-0.5">
                    From SBI (₹1,240) + Indian Bank (₹615)
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-2xl text-amber-950 block">
                    ₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Fiqh Clarification Card */}
              <div className="bg-[#F8FAF9] rounded-2xl p-3.5 border border-[#E2ECE9] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Fiqh Principle of Takhallus:</strong> Unlike Zakat (which carries religious reward), bank interest is spent purely to unburden and purify your personal wealth. The funds are directed to public community infrastructure or emergency hardship where individual ownership is avoided.
                </p>
              </div>

              {/* Destination Selection */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">
                  Select Non-Zakat Community Welfare Channel:
                </label>
                <div className="space-y-2.5">
                  {welfareDestinations.map((dest) => {
                    const IconComp = dest.icon;
                    const isSelected = selectedDestination === dest.id;
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestination(dest.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#E8F6F3]/60 border-[#0D7C66] shadow-xs ring-1 ring-[#0D7C66]' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#0D7C66] text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-xs sm:text-sm text-gray-900">
                                {dest.title}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 shrink-0">
                                {dest.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                              {dest.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fiqh Affirmation Checkbox */}
              <div 
                onClick={() => setHasAffirmedTakhallus(!hasAffirmedTakhallus)}
                className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 cursor-pointer select-none"
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                  hasAffirmedTakhallus ? 'bg-[#0D7C66] border-[#0D7C66] text-white' : 'bg-white border-gray-300'
                }`}>
                  {hasAffirmedTakhallus && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs text-amber-950 leading-relaxed">
                  I affirm this disbursement is made for wealth purification (<strong>Takhallus al-Riba</strong>) without expectation of spiritual reward (Thawab), and is kept completely distinct from my obligatory Zakat al-Mal.
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsAllocationSheetOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!hasAffirmedTakhallus || isProcessingDisposal}
                onClick={handleConfirmDisposal}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0D7C66] hover:bg-[#0A6654] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm transition shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessingDisposal ? (
                  <span>Processing Transfer...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-200" />
                    <span>Confirm Purification & Disburse ₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTEREST CREDITED IN RECENT MONTHS                                 */}
      {/* ========================================================================= */}
      {isRecentMonthsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-emerald-50 via-teal-50/50 to-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0D7C66] text-white flex items-center justify-center shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    Recent Months Interest Credits
                  </h3>
                  <p className="text-xs text-gray-500">
                    Auto-detected statement credits from {activeBankName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRecentMonthsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Account Overview & Balances Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Linked Bank Account
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {activeBankName} ({activeAccountNumber})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Total Ledger Balance
                    </span>
                    <span className="font-mono font-extrabold text-sm text-[#0D7C66]">
                      ₹ {bankBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-900">
                      Total Interest Money in Account:
                    </span>
                    <p className="text-[10px] text-amber-700">Must be removed without reward expectation</p>
                  </div>
                  <span className="font-mono font-extrabold text-base text-amber-900">
                    ₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Month-by-Month Statement Cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-800">
                    Itemized Monthly Statement Credits ({bankRecords.length} Months):
                  </h4>
                  <span className="text-[10px] text-teal-700 font-semibold">Live Audit</span>
                </div>

                <div className="space-y-2.5">
                  {bankRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        rec.isPurified 
                          ? 'bg-slate-50 border-slate-200 opacity-70'
                          : 'bg-white border-amber-200/80 hover:border-amber-400 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            rec.isPurified ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900">{rec.month}</span>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60">
                                {rec.statementTag}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {rec.lastCreditedDate} • Ref: {rec.referenceId}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono font-extrabold text-sm ${
                            rec.isPurified ? 'text-gray-400 line-through' : 'text-amber-800'
                          }`}>
                            ₹ {rec.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="block text-[9px] font-bold mt-0.5">
                            {rec.isPurified ? (
                              <span className="text-emerald-700">✓ Purified</span>
                            ) : (
                              <span className="text-amber-700">Credited (Pending)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiqh & Isolation Guidance */}
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed">
                <strong>Fiqh Requirement:</strong> Your total bank account balance of <strong>₹ {bankBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> includes <strong>₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> in bank interest credited over recent months. In Islamic jurisprudence, 100% of this interest must be disposed of via Takhallus, leaving your pure capital untouched (<strong>₹ {halalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>).
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setRecentMonthsModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition cursor-pointer"
              >
                Close
              </button>

              {!allPurified && (
                <button
                  type="button"
                  onClick={() => {
                    setRecentMonthsModalOpen(false);
                    setIsAllocationSheetOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D7C66] hover:bg-[#0A6654] text-white font-bold text-xs transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-teal-200" />
                  <span>Purify Interest (₹ {totalAccumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
