import React from 'react';
import { 
  X, 
  Landmark, 
  AlertTriangle, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface UnlinkedBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkBank: () => void;
  onContinueToInterest?: () => void;
}

export const UnlinkedBankAccountModal: React.FC<UnlinkedBankAccountModalProps> = ({
  isOpen,
  onClose,
  onLinkBank,
  onContinueToInterest,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Teal/Amber theme */}
        <div className="bg-linear-to-br from-[#0D7C66] to-[#0A6654] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/15 px-2 py-0.5 rounded-full border border-white/20 inline-block mb-1">
                Bank Connection Required
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                You are not linked your account
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Warning Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950">
                Live Statement Sync Inactive
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                You have not linked your bank account yet. To auto-detect bank interest credits (Riba), track statement items, and execute purified disposal (Takhallus), your bank account must be linked.
              </p>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Why link your bank account?
            </span>
            <div className="grid grid-cols-1 gap-2 text-xs text-gray-700">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-[#0D7C66] shrink-0" />
                <span>Automatic isolation of interest from Halal wealth</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                <Sparkles className="w-4 h-4 text-[#0D7C66] shrink-0" />
                <span>Live statement scan with 100% audited Takhallus ledger</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                <CreditCard className="w-4 h-4 text-[#0D7C66] shrink-0" />
                <span>Zero-fee direct bank-to-charity disbursement</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLinkBank();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0D7C66] hover:bg-[#0A6654] text-white font-extrabold text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <CreditCard className="w-4 h-4 text-teal-200" />
              <span>Link Bank Account Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-semibold text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              Stay on Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
