import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Landmark, 
  CheckCircle2,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { InterestPurificationModule } from './InterestPurificationModule';

interface InterestScreenProps {
  linkedBank?: { bankName: string; accountNumber: string; ifsc: string; linkedAt?: string; accountHolderName?: string; accountType?: string } | null;
  onDisburseInterest: (purificationData: {
    amount: number;
    destinationName: string;
    destinationCategory: string;
    receiptNumber: string;
    banksPurified: string[];
  }) => void;
  onViewReceipt: (receiptNumber: string) => void;
  recentActivities: Array<{
    id?: string;
    name: string;
    amount: string;
    date: string;
    status: string;
    receiptNumber: string;
    zakatType?: string;
    notes?: string;
  }>;
  onBackToHome: () => void;
  onLinkBank?: () => void;
}

export const InterestScreen: React.FC<InterestScreenProps> = ({
  linkedBank,
  onDisburseInterest,
  onViewReceipt,
  recentActivities,
  onBackToHome,
  onLinkBank,
}) => {
  // Filter purification activities
  const purificationHistory = recentActivities.filter(
    (act) => act.zakatType === 'Interest Purification / Takhallus' || act.name.includes('Purification')
  );

  // Bank account balance: ALWAYS an amount above ₹ 1,00,000 as strictly requested
  const [bankBalance] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tazku_bank_account_balance') : null;
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 100000) return parsed;
    }
    return 184520; // Verified default: ₹ 1,84,520.00 (strictly > ₹ 1,00,000)
  });

  // State for Recent Months Statement Review Modal
  const [isRecentMonthsModalOpen, setIsRecentMonthsModalOpen] = useState(false);

  const isBankLinked = !!(linkedBank && linkedBank.accountNumber);

  return (
    <div className="flex-1 flex flex-col pb-20 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-[#0D7C66] text-white p-5 sm:p-6 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-teal-100 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold border border-white/20">
            <Landmark className="w-3.5 h-3.5 text-amber-300" />
            <span>Riba Isolation Hub</span>
          </div>
        </div>

        <div className="mt-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Interest (Riba) Purification
          </h1>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-6">
        
        {/* Unlinked Bank Account Notice Banner */}
        {!isBankLinked && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/90 shadow-xs flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-amber-950">
                  You are not linked your account
                </h3>
                <span className="text-[10px] font-bold bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Not Linked
                </span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                You have not linked your bank account yet. Live interest auto-detection and balance segregation require a connected bank account.
              </p>
              {onLinkBank && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onLinkBank}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D7C66] hover:bg-[#0A6654] text-white font-bold text-xs transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-4 h-4 text-teal-200" />
                    <span>Link Bank Account Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Core Bank Interest Tracker & Disposal Module */}
        <div>
          <div className="mb-2">
            <h2 className="text-sm font-bold text-gray-900">Live Bank Statement Tracker</h2>
            <p className="text-[11px] text-gray-500">Auto-detected interest credits isolated from Zakatable wealth</p>
          </div>

          <InterestPurificationModule
            linkedBank={linkedBank}
            bankBalance={bankBalance}
            isRecentMonthsModalOpen={isRecentMonthsModalOpen}
            onToggleRecentMonths={setIsRecentMonthsModalOpen}
            onDisburseInterest={onDisburseInterest}
            onViewReceipt={onViewReceipt}
            onLinkBank={onLinkBank}
          />
        </div>

        {/* Purification History & Audited Receipts */}
        {purificationHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2ECE9] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0D7C66]" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Your Purification History
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#0D7C66] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                Audited Ledger
              </span>
            </div>

            <div className="space-y-2">
              {purificationHistory.map((item, idx) => (
                <div
                  key={item.receiptNumber || idx}
                  className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900">{item.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800">
                        Purified
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.date} • Receipt: <span className="font-mono">{item.receiptNumber}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-amber-900">{item.amount}</span>
                    <button
                      type="button"
                      onClick={() => onViewReceipt(item.receiptNumber)}
                      className="text-[10px] font-bold text-[#0D7C66] bg-white border border-teal-200 px-2 py-1 rounded-md hover:bg-teal-50 transition cursor-pointer"
                    >
                      Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
