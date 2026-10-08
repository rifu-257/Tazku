import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Coins, 
  ShieldCheck, 
  Lock, 
  Heart, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClaimantItem, DonationRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { recordDonation } from '../lib/firebase';

interface ZakkuClaimantModalProps {
  claimant: ClaimantItem | null;
  onClose: () => void;
  onDonationSuccess: (receipt: DonationRecord) => void;
  prefilledAmount?: number;
}

export const ZakkuClaimantModal: React.FC<ZakkuClaimantModalProps> = ({
  claimant,
  onClose,
  onDonationSuccess,
  prefilledAmount,
}) => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<number>(prefilledAmount || 2500);
  const [customStr, setCustomStr] = useState<string>(prefilledAmount ? String(prefilledAmount) : '2500');
  const [zakatType, setZakatType] = useState<'Zakat al-Mal' | 'Zakat al-Fitr' | 'Sadaqah Nafilah'>('Zakat al-Mal');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!claimant) return null;

  const remaining = Math.max(0, claimant.amount - claimant.funded);
  const presets = [1000, 2500, 5000];

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomStr(String(val));
  };

  const handleRemainingSelect = () => {
    setAmount(remaining);
    setCustomStr(String(remaining));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    try {
      setIsProcessing(true);
      const donorName = isAnonymous 
        ? 'Anonymous Servant of Allah' 
        : (profile?.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Community Donor'));
      
      const record = await recordDonation({
        caseId: claimant.id,
        caseTitle: `${claimant.name} (${claimant.category}) - ${claimant.mahal}`,
        donorId: user ? user.uid : 'community_donor',
        donorName,
        amount,
        amountUSD: Math.round(amount / 86.5),
        currency: 'INR',
        zakatType,
        isAnonymous,
        notes: `Allotted via Tazku Mahallu Platform to ${claimant.name}`,
      });

      // Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1B4332', '#40916C', '#E9F3ED', '#D97706'],
        });
      } catch (err) {
        // ignore
      }

      setIsProcessing(false);
      onDonationSuccess(record);
      onClose();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#EBE5D8] shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#EBE5D8] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]"></span>
            <h2 className="font-bold text-sm text-[#112A20]">Claimant Allotment</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-7 h-7 rounded-full bg-[#F3EFE6] text-[#526059] hover:text-[#112A20] flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Claimant Info Card */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#112A20]">{claimant.name}</h3>
            <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] px-2.5 py-0.5 rounded-full font-bold border border-[#40916C]/20">
              {claimant.category}
            </span>
          </div>
          <p className="text-xs text-[#526059] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#40916C] shrink-0" />
            <span>{claimant.mahal}</span>
          </p>

          <div className="mt-3 p-3 bg-[#E9F3ED] rounded-2xl text-center border border-[#40916C]/20">
            <span className="text-[11px] text-[#526059] block">Verified Target Need</span>
            <span className="text-2xl font-extrabold font-mono text-[#1B4332]">
              ₹{claimant.amount.toLocaleString('en-IN')}
            </span>
            <div className="text-[10px] text-[#526059] mt-0.5">
              Raised: ₹{claimant.funded.toLocaleString('en-IN')} • Remaining: ₹{remaining.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#112A20] mb-1.5">
              Choose Amount (₹)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
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

            {remaining > 0 && (
              <button
                type="button"
                onClick={handleRemainingSelect}
                className="w-full py-1.5 mb-2 text-xs font-semibold text-[#1B4332] bg-[#E9F3ED] border border-[#40916C]/30 rounded-xl hover:bg-[#d8ece0] transition cursor-pointer"
              >
                Fund Full Remaining (₹{remaining.toLocaleString('en-IN')})
              </button>
            )}

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

          {/* Intention */}
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

          {/* Anonymity */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-3.5 h-3.5 rounded-sm text-[#1B4332] border-[#EBE5D8] focus:ring-[#40916C]"
            />
            <span className="text-xs text-[#526059] font-medium">Keep donor name confidential</span>
          </label>

          {/* Trust Banner */}
          <div className="p-2.5 bg-[#F3EFE6] rounded-xl border border-[#EBE5D8] flex items-center gap-2 text-[11px] text-[#526059]">
            <ShieldCheck className="w-4 h-4 text-[#40916C] shrink-0" />
            <span>100% Direct Disbursement to Verified Mahallu Case</span>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isProcessing ? 'Processing Allotment...' : `Confirm Zakat Allotment (₹${amount.toLocaleString('en-IN')})`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
