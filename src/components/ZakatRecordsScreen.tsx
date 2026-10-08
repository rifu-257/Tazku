import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Sparkles,
  HelpCircle,
  TrendingDown,
  Info,
  Calculator,
  Coins,
  Wallet,
  ArrowRight,
  Trash2,
  Bookmark,
  Receipt,
  FileSpreadsheet,
  Clock,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { SavedCalculation } from '../types';
import { useAuth } from '../context/AuthContext';
import { getUserCalculations } from '../lib/firebase';

interface TransactionEntry {
  id: string;
  title: string;
  amount: number;
  time?: string;
}

interface DateGroupedTransaction {
  id: string;
  dayNumber: string;
  dayOfWeek: string;
  dateSubtext: string;
  entries: TransactionEntry[];
}

export interface ZakatRecordsScreenProps {
  onBack: () => void;
  onOpenCalculator?: () => void;
  onGiveZakat?: (prefillAmount?: number) => void;
  recentActivities?: Array<{
    id?: string;
    name: string;
    amount: string;
    date: string;
    status: string;
    receiptNumber: string;
    zakatType?: string;
    notes?: string;
  }>;
}

export const ZakatRecordsScreen: React.FC<ZakatRecordsScreenProps> = ({
  onBack,
  onOpenCalculator,
  onGiveZakat,
  recentActivities = [],
}) => {
  const { user } = useAuth();

  // Active view tab inside Records: 'calculations' | 'transactions'
  const [activeTab, setActiveTab] = useState<'calculations' | 'transactions'>('calculations');

  // =========================================================================
  // 1. CALCULATION RECORDS STATE
  // =========================================================================
  const defaultCalculations: SavedCalculation[] = [
    {
      id: 'calc_demo_01',
      userId: 'community_member',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      cash: 65000,
      goldGrams: 24,
      silverGrams: 0,
      investments: 40000,
      businessAssets: 20000,
      liabilities: 16400,
      netZakatable: 245000,
      nisabThreshold: 56337,
      zakatDue: 6125,
      currency: 'INR',
      status: 'calculated',
    },
    {
      id: 'calc_demo_02',
      userId: 'community_member',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      cash: 120000,
      goldGrams: 35,
      silverGrams: 100,
      investments: 50000,
      businessAssets: 0,
      liabilities: 10000,
      netZakatable: 375000,
      nisabThreshold: 56337,
      zakatDue: 9375,
      currency: 'INR',
      status: 'disbursed',
    }
  ];

  const [calculations, setCalculations] = useState<SavedCalculation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tazku_saved_calculations');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return defaultCalculations;
  });

  // Listen for newly saved calculations in real time
  useEffect(() => {
    const handleNewCalc = (e: any) => {
      if (e.detail) {
        setCalculations(prev => {
          const exists = prev.some(item => item.id === e.detail.id);
          if (exists) return prev;
          return [e.detail, ...prev];
        });
      }
    };
    window.addEventListener('tazku_calculation_saved', handleNewCalc);
    return () => window.removeEventListener('tazku_calculation_saved', handleNewCalc);
  }, []);

  // Fetch remote calculations from Firestore if authenticated
  useEffect(() => {
    if (user?.uid) {
      getUserCalculations(user.uid).then(remote => {
        if (remote && remote.length > 0) {
          setCalculations(prev => {
            const merged = [...remote];
            prev.forEach(p => {
              if (!merged.some(m => m.id === p.id)) merged.push(p);
            });
            try {
              localStorage.setItem('tazku_saved_calculations', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleDeleteCalculation = (id: string) => {
    const updated = calculations.filter(c => c.id !== id);
    setCalculations(updated);
    try {
      localStorage.setItem('tazku_saved_calculations', JSON.stringify(updated));
    } catch {}
  };

  // Only show legitimate Zakat-eligible records (never show 'Below Nisab (Exempt)' in records)
  const displayCalculations = calculations.filter(
    calc => calc.netZakatable >= calc.nisabThreshold && calc.zakatDue > 0
  );

  // =========================================================================
  // 2. TRANSACTIONS & MONEY MANAGEMENT STATE
  // =========================================================================
  const [incomeAmount] = useState<number>(0.00);
  const [expenseAmount, setExpenseAmount] = useState<number>(7493.00);
  const balanceAmount = incomeAmount - expenseAmount;

  const [nisabAmount] = useState<number>(29750.00);
  const [todayZakat] = useState<number>(0);
  const [totalZakatDue] = useState<number>(0);

  const [transactionGroups, setTransactionGroups] = useState<DateGroupedTransaction[]>([
    {
      id: 'grp-1',
      dayNumber: '7',
      dayOfWeek: 'Wed',
      dateSubtext: '10/26',
      entries: [
        { id: 'tx-1', title: 'Zakat Payment', amount: 857.00, time: '11:30 AM' },
        { id: 'tx-2', title: 'Zakat Payment', amount: 90.00, time: '04:15 PM' },
      ],
    },
    {
      id: 'grp-2',
      dayNumber: '27',
      dayOfWeek: 'Mon',
      dateSubtext: '07/26',
      entries: [
        { id: 'tx-3', title: 'Zakat Payment', amount: 6456.00, time: '02:00 PM' },
        { id: 'tx-4', title: 'Zakat Payment', amount: 89.00, time: '06:45 PM' },
      ],
    },
    {
      id: 'grp-3',
      dayNumber: '14',
      dayOfWeek: 'Tue',
      dateSubtext: '05/26',
      entries: [
        { id: 'tx-5', title: 'Zakat Payment', amount: 1200.00, time: '09:20 AM' },
      ],
    },
  ]);

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState('500');
  const [newPaymentNote, setNewPaymentNote] = useState('Zakat Payment');

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newPaymentAmount);
    if (isNaN(amt) || amt <= 0) return;

    const today = new Date();
    const dayNum = String(today.getDate());
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayWk = daysOfWeek[today.getDay()];
    const dateSub = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;

    const newEntry: TransactionEntry = {
      id: `tx-${Date.now()}`,
      title: newPaymentNote || 'Zakat Payment',
      amount: amt,
      time: 'Just now',
    };

    setTransactionGroups(prev => {
      const existingFirst = prev[0];
      if (existingFirst && existingFirst.dayNumber === dayNum && existingFirst.dateSubtext === dateSub) {
        return [
          {
            ...existingFirst,
            entries: [newEntry, ...existingFirst.entries],
          },
          ...prev.slice(1),
        ];
      }
      return [
        {
          id: `grp-${Date.now()}`,
          dayNumber: dayNum,
          dayOfWeek: dayWk,
          dateSubtext: dateSub,
          entries: [newEntry],
        },
        ...prev,
      ];
    });

    setExpenseAmount(prev => prev + amt);
    setShowAddPaymentModal(false);
    setNewPaymentAmount('');
  };

  const totalTransactionEntriesCount = transactionGroups.reduce((acc, g) => acc + g.entries.length, 0);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FBFBF9] min-h-screen text-[#112A20] font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SCREEN BANNER (Solid Deep Forest Emerald #1B4332)          */}
      {/* ========================================================================= */}
      <div className="bg-[#1B4332] text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-sm relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] text-[#F3EFE6] font-bold uppercase tracking-wider block">
                Audited History & Ledger
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Records
              </h1>
            </div>
          </div>

          {onOpenCalculator && (
            <button
              type="button"
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#1B4332] hover:bg-[#F3EFE6] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Calculate</span>
            </button>
          )}
        </div>

        {/* Segmented Mode Switcher: Calculations vs Transactions */}
        <div className="mt-4 flex bg-black/20 p-1 rounded-2xl border border-white/15 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setActiveTab('calculations')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'calculations'
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-[#F3EFE6] hover:text-white hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Zakat Calculations</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'calculations' ? 'bg-[#E9F3ED] text-[#1B4332]' : 'bg-white/20 text-white'
            }`}>
              {displayCalculations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-[#F3EFE6] hover:text-white hover:bg-white/10'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Transactions & Ledger</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'transactions' ? 'bg-[#E9F3ED] text-[#1B4332]' : 'bg-white/20 text-white'
            }`}>
              {totalTransactionEntriesCount}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT A: CALCULATION RECORDS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'calculations' && (
        <div className="px-4 mt-5 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-150">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl border border-[#EBE5D8] shadow-2xs">
              <span className="text-[10px] text-[#526059] font-bold uppercase tracking-wider block">
                Latest Calculated Due
              </span>
              <span className="font-mono font-extrabold text-lg text-[#1B4332] block mt-0.5">
                ₹ {displayCalculations[0]?.zakatDue.toLocaleString('en-IN') || '0.00'}
              </span>
              <span className="text-[10px] text-[#40916C] font-medium">
                2.5% on Net Zakatable Wealth
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#EBE5D8] shadow-2xs">
              <span className="text-[10px] text-[#526059] font-bold uppercase tracking-wider block">
                Nisab Benchmark
              </span>
              <span className="font-mono font-extrabold text-lg text-[#112A20] block mt-0.5">
                ₹ {displayCalculations[0]?.nisabThreshold.toLocaleString('en-IN') || '56,337'}
              </span>
              <span className="text-[10px] text-[#526059] font-medium">
                Silver standard (612.36g)
              </span>
            </div>
          </div>

          {/* Records List Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <h2 className="text-xs font-extrabold text-[#112A20] uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Saved Calculations History ({displayCalculations.length})</span>
            </h2>
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] hover:underline cursor-pointer"
              >
                + New Calculation
              </button>
            )}
          </div>

          {/* Calculations Cards */}
          {displayCalculations.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center mx-auto">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#112A20]">No Calculation Records Yet</h3>
                <p className="text-xs text-[#526059] mt-1 max-w-xs mx-auto">
                  Perform a Zakat assessment and tap <strong>"Save Calculation to History"</strong> to store and track your audited records here.
                </p>
              </div>
              {onOpenCalculator && (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Start Zakat Calculation
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayCalculations.map((calc, idx) => {
                return (
                  <div
                    key={calc.id || idx}
                    className="bg-white rounded-3xl p-4.5 border border-[#EBE5D8] shadow-xs hover:border-[#40916C]/40 transition space-y-3.5"
                  >
                    {/* Prominent Calculation Result Banner (Warm Sand #F3EFE6) */}
                    <div className="bg-[#F3EFE6] p-3.5 rounded-2xl border border-[#EBE5D8] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider block">
                          Zakat Obligatory Due (2.5%)
                        </span>
                        <span className="font-mono font-extrabold text-xl text-[#1B4332] block mt-0.5">
                          ₹ {calc.zakatDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#526059] uppercase tracking-wider block">
                          Net Zakatable Wealth
                        </span>
                        <span className="font-mono font-bold text-sm text-[#112A20] block mt-0.5">
                          ₹ {calc.netZakatable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Asset Breakdown Chips */}
                    <div className="space-y-1.5 pt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#526059] block">
                        Itemized Asset Breakdown
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {calc.cash > 0 && (
                          <span className="bg-[#FBFBF9] px-2.5 py-1 rounded-lg border border-[#EBE5D8] font-medium text-[#112A20]">
                            Cash & Bank: <strong>₹ {calc.cash.toLocaleString('en-IN')}</strong>
                          </span>
                        )}
                        {calc.goldGrams > 0 && (
                          <span className="bg-[#FBFBF9] px-2.5 py-1 rounded-lg border border-[#EBE5D8] font-medium text-[#112A20]">
                            Gold: <strong>{calc.goldGrams}g</strong>
                          </span>
                        )}
                        {calc.silverGrams > 0 && (
                          <span className="bg-[#FBFBF9] px-2.5 py-1 rounded-lg border border-[#EBE5D8] font-medium text-[#112A20]">
                            Silver: <strong>{calc.silverGrams}g</strong>
                          </span>
                        )}
                        {calc.investments > 0 && (
                          <span className="bg-[#FBFBF9] px-2.5 py-1 rounded-lg border border-[#EBE5D8] font-medium text-[#112A20]">
                            Investments: <strong>₹ {calc.investments.toLocaleString('en-IN')}</strong>
                          </span>
                        )}
                        {calc.businessAssets > 0 && (
                          <span className="bg-[#FBFBF9] px-2.5 py-1 rounded-lg border border-[#EBE5D8] font-medium text-[#112A20]">
                            Business: <strong>₹ {calc.businessAssets.toLocaleString('en-IN')}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Timestamp, Delete & Disburse Action */}
                    <div className="pt-2 border-t border-[#EBE5D8] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#526059]" />
                        <span className="text-[11px] font-semibold text-[#526059]">
                          {formatDate(calc.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCalculation(calc.id)}
                          className="w-6 h-6 rounded-full text-[#526059] hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition cursor-pointer ml-1"
                          title="Delete calculation record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {onGiveZakat && calc.zakatDue > 0 && (
                        <button
                          type="button"
                          onClick={() => onGiveZakat(calc.zakatDue)}
                          className="px-3.5 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-300" />
                          <span>Allot ₹ {calc.zakatDue.toLocaleString('en-IN')}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT B: TRANSACTIONS & MONEY MANAGEMENT LEDGER                  */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="animate-in fade-in duration-150">
          <div className="mx-4 mt-4 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b-2 border-[#1B4332]">
              <h2 className="text-base font-bold text-[#1B4332] leading-tight">
                Transactions Ledger
              </h2>
            </div>

            {/* Grouped Date-Card List */}
            <div className="space-y-3 pt-1">
              {transactionGroups.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl text-center text-xs text-[#526059] border border-[#EBE5D8]">
                  No transactions logged yet. Click "Add Entry" to record your Zakat disbursements.
                </div>
              ) : (
                transactionGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-3xl p-4 shadow-sm border border-[#EBE5D8] flex items-stretch gap-4 transition hover:shadow-md"
                  >
                    {/* Left Date Badge */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-16 text-center pr-3 border-r border-[#EBE5D8]">
                      <span className="text-2xl font-extrabold text-[#112A20] font-sans leading-none">
                        {group.dayNumber}
                      </span>
                      <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#1B4332] text-white text-[10px] font-bold tracking-wide shadow-2xs">
                        {group.dayOfWeek}
                      </div>
                      <span className="text-[11px] font-medium text-[#526059] mt-1 font-mono">
                        {group.dateSubtext}
                      </span>
                    </div>

                    {/* Right Transaction Entries */}
                    <div className="flex-1 flex flex-col justify-center divide-y divide-[#EBE5D8]/60">
                      {group.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="py-2 first:pt-0 last:pb-0 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
                            <span className="text-xs font-semibold text-[#112A20]">
                              {entry.title}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#D97706] tracking-tight">
                            ₹ {entry.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Action Footer: Calculate / Allot */}
          {onGiveZakat && (
            <div className="mx-4 mt-6 pt-2">
              <button
                type="button"
                onClick={() => onGiveZakat()}
                className="w-full py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Disburse Zakat from Money Pool</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK ADD PAYMENT ENTRY MODAL                                             */}
      {/* ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl border border-[#EBE5D8] animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#EBE5D8]">
              <h3 className="font-bold text-sm text-[#112A20]">Record Zakat Payment</h3>
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="w-7 h-7 rounded-full bg-[#F3EFE6] text-[#526059] hover:text-[#112A20] flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#526059] mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newPaymentAmount}
                  onChange={(e) => setNewPaymentAmount(e.target.value)}
                  placeholder="e.g. 857.00"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-bold text-[#112A20] focus:bg-white focus:border-[#40916C] focus:outline-hidden focus:ring-1 focus:ring-[#40916C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526059] mb-1">
                  Description / Claimant Tag
                </label>
                <input
                  type="text"
                  value={newPaymentNote}
                  onChange={(e) => setNewPaymentNote(e.target.value)}
                  placeholder="e.g. Zakat Payment (Akbar Ali relief)"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-medium text-[#112A20] focus:bg-white focus:border-[#40916C] focus:outline-hidden focus:ring-1 focus:ring-[#40916C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save Payment Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Also export as ZakatTrackerScreen for backwards compatibility
export const ZakatTrackerScreen = ZakatRecordsScreen;
