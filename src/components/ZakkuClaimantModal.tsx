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
          colors: ['#0D7C66', '#E8F6F3', '#10B981', '#F59E0B'],
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
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#E2ECE9] shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D7C66]"></span>
            <h2 className="font-bold text-sm text-gray-900">Claimant Allotment</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Claimant Info Card */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">{claimant.name}</h3>
            <span className="text-[10px] bg-[#E8F6F3] text-[#0D7C66] px-2.5 py-0.5 rounded-full font-bold">
              {claimant.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span>{claimant.mahal}</span>
          </p>

          <div className="mt-3 p-3 bg-[#E8F6F3] rounded-2xl text-center border border-[#0D7C66]/20">
            <span className="text-[11px] text-gray-600 block">Verified Target Need</span>
            <span className="text-2xl font-extrabold font-mono text-[#0D7C66]">
              ₹{claimant.amount.toLocaleString('en-IN')}
            </span>
            <div className="text-[10px] text-gray-500 mt-0.5">
              Raised: ₹{claimant.funded.toLocaleString('en-IN')} • Remaining: ₹{remaining.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Choose Amount (₹)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    amount === p
                      ? 'bg-[#0D7C66] text-white border-[#0D7C66]'
                      : 'bg-[#F8FAF9] text-gray-700 border-gray-200 hover:bg-gray-100'
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
                className="w-full py-1.5 mb-2 text-xs font-semibold text-[#0D7C66] bg-[#E8F6F3] border border-[#0D7C66]/30 rounded-xl hover:bg-[#d8efe9] transition"
              >
                Fund Full Remaining (₹{remaining.toLocaleString('en-IN')})
              </button>
            )}

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">₹</span>
              <input
                type="number"
                min="100"
                value={customStr}
                onChange={(e) => {
                  setCustomStr(e.target.value);
                  setAmount(parseFloat(e.target.value) || 0);
                }}
                className="w-full pl-8 pr-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                placeholder="Custom Amount"
                required
              />
            </div>
          </div>

          {/* Intention */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Intention (Niyyah)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Zakat al-Mal', 'Zakat al-Fitr', 'Sadaqah Nafilah'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setZakatType(type)}
                  className={`py-1.5 text-[10px] font-bold rounded-lg border text-center transition ${
                    zakatType === type
                      ? 'bg-[#E8F6F3] border-[#0D7C66] text-[#0D7C66]'
                      : 'bg-[#F8FAF9] text-gray-600 border-gray-200'
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
              className="w-3.5 h-3.5 rounded-sm text-[#0D7C66] border-gray-300 focus:ring-[#0D7C66]"
            />
            <span className="text-xs text-gray-600 font-medium">Keep donor name confidential</span>
          </label>

          {/* Trust Banner */}
          <div className="p-2.5 bg-[#F8FAF9] rounded-xl border border-gray-200 flex items-center gap-2 text-[11px] text-gray-600">
            <ShieldCheck className="w-4 h-4 text-[#0D7C66] shrink-0" />
            <span>100% Direct Disbursement to Verified Mahallu Case</span>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
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
