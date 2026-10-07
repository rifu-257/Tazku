import React from 'react';
import { BookOpen, X, CheckCircle2, ShieldCheck, Scale, Users, Sparkles } from 'lucide-react';

interface ZakkuGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculator: () => void;
}

export const ZakkuGuideModal: React.FC<ZakkuGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenCalculator,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#E2ECE9] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#E8F6F3] text-[#0D7C66] rounded-xl font-bold">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] bg-[#0D7C66] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Fiqh Guide
              </span>
              <h2 className="text-sm font-bold text-gray-900 mt-1">Understanding Zakat: Rules & Distribution</h2>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Core Definition */}
        <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 text-[#0D7C66]">
            <CheckCircle2 className="w-4 h-4" /> 1. The Divine Obligation
          </h3>
          <p>
            Zakat is the third pillar of Islam—a mandatory annual due of <strong>2.5%</strong> on surplus qualifying wealth held for one full lunar year (Hawl), designed to purify wealth and eradicate poverty in local communities.
          </p>
        </div>

        {/* Section 2: Nisab & Hawl */}
        <div className="p-3.5 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20 space-y-2 text-xs text-gray-800">
          <h3 className="font-bold text-[#0D7C66] flex items-center gap-1.5">
            <Scale className="w-4 h-4" /> 2. Nisab Thresholds
          </h3>
          <p className="text-[11px] text-gray-600">
            Nisab is the minimum threshold of wealth below which no Zakat is due:
          </p>
          <ul className="space-y-1.5 text-[11px] list-disc list-inside">
            <li><strong>Gold Standard:</strong> 87.48 grams of gold (~₹6,43,000).</li>
            <li><strong>Silver Standard:</strong> 612.36 grams of silver (~₹56,337). Recommended by classical scholars for liquid cash to maximize benefit to the needy.</li>
          </ul>
        </div>

        {/* Section 3: The 8 Beneficiary Classes */}
        <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 text-[#0D7C66]">
            <Users className="w-4 h-4" /> 3. The Eight Quranic Beneficiaries (9:60)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-[#F8FAF9] rounded-xl border border-gray-100">
              <strong className="text-gray-900 block">Al-Fuqara</strong>
              <span className="text-gray-500">The destitute without sustenance</span>
            </div>
            <div className="p-2 bg-[#F8FAF9] rounded-xl border border-gray-100">
              <strong className="text-gray-900 block">Al-Masakin</strong>
              <span className="text-gray-500">The working poor needing relief</span>
            </div>
            <div className="p-2 bg-[#F8FAF9] rounded-xl border border-gray-100">
              <strong className="text-gray-900 block">Al-Gharimin</strong>
              <span className="text-gray-500">Debtors facing legal distress</span>
            </div>
            <div className="p-2 bg-[#F8FAF9] rounded-xl border border-gray-100">
              <strong className="text-gray-900 block">Fi Sabilillah</strong>
              <span className="text-gray-500">Community welfare & education</span>
            </div>
          </div>
        </div>

        {/* Section 4: Mahallu Ward Verification */}
        <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-gray-200 text-xs text-gray-700 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#0D7C66] shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block">Zero-Commission Mahallu Auditing</strong>
            <span className="text-[11px] text-gray-500 leading-normal block mt-0.5">
              Zakku ensures 100% of your funds reach genuine families vetted physically by local Mahallu elders with zero overhead deductions.
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenCalculator();
          }}
          className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Launch Zakat Calculator</span>
        </button>
      </div>
    </div>
  );
};
