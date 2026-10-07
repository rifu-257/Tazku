import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Sparkles,
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';

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

interface ZakatTrackerScreenProps {
  onBack: () => void;
  onOpenCalculator?: () => void;
  onGiveZakat?: () => void;
}

export const ZakatTrackerScreen: React.FC<ZakatTrackerScreenProps> = ({
  onBack,
  onOpenCalculator,
  onGiveZakat,
}) => {
  // Financial Overview State matching reference design
  const [incomeAmount] = useState<number>(0.00);
  const [expenseAmount, setExpenseAmount] = useState<number>(7493.00);
  const balanceAmount = incomeAmount - expenseAmount;

  // Zakat Status values
  const [nisabAmount] = useState<number>(29750.00); // e.g. Silver Nisab classical benchmark in INR
  const [todayZakat] = useState<number>(0);
  const [totalZakatDue] = useState<number>(0);

  // Grouped Date-Card Transactions list matching reference design
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

  // Modal for quick addition of a new payment entry
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

    // Prepend or add to group
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

  return (
    <div className="flex-1 flex flex-col bg-[#F6F9F8] min-h-screen text-gray-900 font-sans pb-20">
      
      {/* ========================================================================= */}
      {/* 1. THEME, HEADER & TOP WAVE BACKGROUND                                    */}
      {/* ========================================================================= */}
      <div className="bg-[#0D7C66] text-white pt-6 pb-12 px-4 rounded-b-[2.5rem] shadow-sm relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Zakat Tracker
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MONEY MANAGEMENT SUMMARY CARD (Overlapping Top Banner)                 */}
      {/* ========================================================================= */}
      <div className="relative -mt-7 mx-4 z-10">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100/80">
          <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
            {/* Column 1: Income */}
            <div className="px-2">
              <span className="text-xs font-medium text-gray-500 block mb-1">
                Income
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono tracking-tight block">
                ₹ {incomeAmount.toFixed(2)}
              </span>
            </div>

            {/* Column 2: Expense */}
            <div className="px-2">
              <span className="text-xs font-medium text-gray-500 block mb-1">
                Expense
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#E67E22] font-mono tracking-tight block">
                ₹ {expenseAmount.toFixed(2)}
              </span>
            </div>

            {/* Column 3: Balance */}
            <div className="px-2">
              <span className="text-xs font-medium text-gray-500 block mb-1">
                Balance
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono tracking-tight block">
                ₹ {balanceAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ZAKAT DUE & NISAB STATUS CARD                                          */}
      {/* ========================================================================= */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/90 space-y-3.5">
          {/* Top Row: 2 Columns */}
          <div className="grid grid-cols-2 text-center divide-x divide-gray-100">
            <div className="px-2">
              <span className="text-xs font-medium text-gray-500 block mb-1">
                Nisab Amount
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#0D7C66] font-mono block">
                ₹ {nisabAmount.toFixed(2)}
              </span>
            </div>

            <div className="px-2">
              <span className="text-xs font-medium text-gray-500 block mb-1">
                Today's Zakat
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#0D7C66] font-mono block">
                ₹ {todayZakat}
              </span>
            </div>
          </div>

          {/* Subtle Horizontal Divider */}
          <div className="border-t border-gray-100" />

          {/* Bottom Row: Centered Full Width */}
          <div className="text-center pt-0.5">
            <span className="text-xs font-medium text-gray-500 block">
              Total Zakat Due (including today)
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0D7C66] font-mono mt-0.5 block">
              ₹ {totalZakatDue}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TRANSACTIONS LEDGER SECTION                                            */}
      {/* ========================================================================= */}
      <div className="mx-4 mt-6 space-y-3">
        {/* Section Heading with stylized teal underline bar */}
        <div className="inline-block border-b-2 border-[#0D7C66] pb-1">
          <h2 className="text-base font-bold text-[#0D7C66] leading-tight">
            Transactions
          </h2>
        </div>

        {/* Grouped Date-Card List */}
        <div className="space-y-3 pt-1">
          {transactionGroups.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl text-center text-xs text-gray-400 border border-gray-100">
              No transactions logged yet. Click "Add Entry" to record your Zakat disbursements.
            </div>
          ) : (
            transactionGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100/90 flex items-stretch gap-4 transition hover:shadow-md"
              >
                {/* Left Date Badge */}
                <div className="flex flex-col items-center justify-center shrink-0 w-16 text-center pr-3 border-r border-gray-100">
                  {/* Large Day Number */}
                  <span className="text-2xl font-extrabold text-gray-900 font-sans leading-none">
                    {group.dayNumber}
                  </span>

                  {/* Day of Week Pill Badge (Vibrant Blue #3B82F6 with white text) */}
                  <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold tracking-wide shadow-2xs">
                    {group.dayOfWeek}
                  </div>

                  {/* Month/Year Subtext */}
                  <span className="text-[11px] font-medium text-gray-400 mt-1 font-mono">
                    {group.dateSubtext}
                  </span>
                </div>

                {/* Right Transaction Entries */}
                <div className="flex-1 flex flex-col justify-center divide-y divide-gray-50">
                  {group.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="py-2 first:pt-0 last:pb-0 flex items-center justify-between"
                    >
                      {/* Label with orange bullet point */}
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E67E22] shrink-0" />
                        <span className="text-xs font-semibold text-gray-800">
                          {entry.title}
                        </span>
                      </div>

                      {/* Right-aligned orange currency amount */}
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#E67E22] tracking-tight">
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
            onClick={onGiveZakat}
            className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Disburse Zakat from Money Pool</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK ADD PAYMENT ENTRY MODAL                                             */}
      {/* ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">Record Zakat Payment</h3>
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newPaymentAmount}
                  onChange={(e) => setNewPaymentAmount(e.target.value)}
                  placeholder="e.g. 857.00"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description / Claimant Tag
                </label>
                <input
                  type="text"
                  value={newPaymentNote}
                  onChange={(e) => setNewPaymentNote(e.target.value)}
                  placeholder="e.g. Zakat Payment (Akbar Ali relief)"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition"
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
