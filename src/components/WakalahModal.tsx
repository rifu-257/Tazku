import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  ShieldCheck, 
  Lock, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DonationRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { recordDonation } from '../lib/firebase';

interface CertifiedVakeel {
  id: string;
  name: string;
  title: string;
  regNumber: string;
  mahalluJurisdiction: string;
  experienceYears: number;
  activeCasesManaged: number;
  rating: string;
  verifiedShariahBadge: string;
}

interface WakalahModalProps {
  vakeel: CertifiedVakeel | null;
  onClose: () => void;
  onSuccess: (receipt: DonationRecord) => void;
}

export const WakalahModal: React.FC<WakalahModalProps> = ({
  vakeel,
  onClose,
  onSuccess,
}) => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<number>(5000);
  const [customStr, setCustomStr] = useState<string>('5000');
  const [zakatType, setZakatType] = useState<'Zakat al-Mal' | 'Zakat al-Fitr' | 'Sadaqah Nafilah'>('Zakat al-Mal');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!vakeel) return null;

  const presets = [2500, 5000, 10000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    try {
      setIsProcessing(true);
      const donorName = isAnonymous 
        ? 'Anonymous Servant of Allah' 
        : (profile?.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Community Donor'));
      
      const record = await recordDonation({
        caseId: `vakeel_${vakeel.id}`,
        caseTitle: `Entrusted to Vakeel: ${vakeel.name} (${vakeel.regNumber})`,
        donorId: user ? user.uid : 'community_donor',
        donorName,
        amount,
        amountUSD: Math.round(amount / 86.5),
        currency: 'INR',
        zakatType,
        isAnonymous,
        notes: `Wakalah bil-Qabd proxy entrustment to ${vakeel.name} (${vakeel.mahalluJurisdiction})`,
      });

      try {
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1B4332', '#40916C', '#E9F3ED', '#D97706'],
        });
      } catch (err) {
        // ignore
      }

      setIsProcessing(false);
      onSuccess(record);
      onClose();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#EBE5D8] shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#EBE5D8] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]"></span>
            <h2 className="font-bold text-sm text-[#112A20]">Wakalah Proxy Entrustment</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3EFE6] text-[#526059] hover:text-[#112A20] flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Vakeel Info */}
        <div className="p-3.5 bg-[#E9F3ED] rounded-2xl border border-[#40916C]/20 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#112A20]">{vakeel.name}</h3>
            <span className="text-[10px] bg-[#1B4332] text-white px-2 py-0.5 rounded-full font-bold">
              {vakeel.regNumber}
            </span>
          </div>
          <p className="text-[11px] text-[#1B4332] font-medium">{vakeel.title}</p>
          <p className="text-[10px] text-[#526059]">{vakeel.mahalluJurisdiction}</p>
        </div>

        {/* Shariah Wakalah Declaration Text */}
        <div className="p-3 bg-[#FEF9C3] border border-[#FDE047] rounded-xl text-[11px] text-amber-950 space-y-1 leading-relaxed">
          <div className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>Official Wakalah Statement (Niyyah)</span>
          </div>
          <p className="italic">
            "I appoint {vakeel.name} as my authorized religious agent (Wakil bil-Qabd) to receive my Zakat and distribute it directly into the hands of eligible Quranic beneficiaries."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#112A20] mb-1.5">
              Entrusted Zakat Amount (₹)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setAmount(p);
                    setCustomStr(String(p));
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    amount === p
                      ? 'bg-[#1B4332] text-white border-[#1B4332]'
                      : 'bg-[#FBFBF9] text-[#526059] border-[#EBE5D8] hover:bg-[#F3EFE6]'
                  }`}
                >
                  ₹{p.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#526059]">₹</span>
              <input
                type="number"
                min="100"
                value={customStr}
                onChange={(e) => {
                  setCustomStr(e.target.value);
                  setAmount(parseFloat(e.target.value) || 0);
                }}
                className="w-full pl-8 pr-3 py-2 bg-white border border-[#EBE5D8] rounded-xl text-xs font-bold text-[#112A20] focus:bg-white focus:border-[#40916C] focus:outline-hidden"
                placeholder="Custom Amount"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#112A20] mb-1">
              Intention (Niyyah)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Zakat al-Mal', 'Zakat al-Fitr', 'Sadaqah Nafilah'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setZakatType(type)}
                  className={`py-1.5 text-[10px] font-bold rounded-lg border text-center transition cursor-pointer ${
                    zakatType === type
                      ? 'bg-[#E9F3ED] border-[#40916C] text-[#1B4332]'
                      : 'bg-[#FBFBF9] text-[#526059] border-[#EBE5D8]'
                  }`}
                >
                  {type === 'Sadaqah Nafilah' ? 'Sadaqah' : type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isProcessing ? 'Executing Wakalah Proxy...' : `Confirm Wakalah Allotment (₹${amount.toLocaleString('en-IN')})`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
