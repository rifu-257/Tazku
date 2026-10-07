import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Lock, 
  Heart,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BeneficiaryCase, CurrencyCode, DonationRecord } from '../types';
import { formatCurrency, convertToUSD, convertFromUSD } from '../lib/currency';
import { useAuth } from '../context/AuthContext';
import { recordDonation } from '../lib/firebase';

interface DisburseModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCase: BeneficiaryCase | null;
  currency: CurrencyCode;
  initialAmount?: number;
  onDonationSuccess: (receipt: DonationRecord) => void;
}

export const DisburseModal: React.FC<DisburseModalProps> = ({
  isOpen,
  onClose,
  targetCase,
  currency,
  initialAmount,
  onDonationSuccess,
}) => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<number>(initialAmount || 50);
  const [customAmountStr, setCustomAmountStr] = useState<string>(initialAmount ? String(initialAmount) : '50');
  const [zakatType, setZakatType] = useState<'Zakat al-Mal' | 'Zakat al-Fitr' | 'Sadaqah Nafilah'>('Zakat al-Mal');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>(profile?.displayName || user?.displayName || '');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen || !targetCase) return null;

  const targetUSD = targetCase.targetAmount;
  const raisedUSD = targetCase.raisedAmount || 0;
  const remainingInTargetCurrency = Math.max(0, convertFromUSD(targetUSD - raisedUSD, currency));

  const presets = [25, 50, 100, 250];

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
  };

  const handleRemainingSelect = () => {
    const val = Math.round(remainingInTargetCurrency);
    setAmount(val);
    setCustomAmountStr(String(val));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    try {
      setIsProcessing(true);
      const amountUSD = convertToUSD(amount, currency);
      
      const record = await recordDonation({
        caseId: targetCase.id,
        caseTitle: targetCase.title,
        donorId: user ? user.uid : 'guest',
        donorName: isAnonymous ? 'Anonymous Servant of Allah' : (donorName || 'Generous Donor'),
        amount,
        amountUSD,
        currency,
        zakatType,
        isAnonymous,
        notes: notes || undefined,
      });

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F5132', '#D4AF37', '#1B4332', '#FDE047'],
        });
      } catch (err) {
        // ignore if canvas blocked
      }

      setIsProcessing(false);
      onDonationSuccess(record);
      onClose();
    } catch (err) {
      console.error("Donation record failed:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Direct Fiqh-Compliant Disbursement</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            Disburse to {targetCase.beneficiaryAlias}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            Case: {targetCase.title}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Disbursement Amount ({currency})
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2.5">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    amount === p
                      ? 'bg-[#0F5132] text-white border-[#0F5132] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatCurrency(p, currency)}
                </button>
              ))}
            </div>

            {remainingInTargetCurrency > 0 && (
              <button
                type="button"
                onClick={handleRemainingSelect}
                className="w-full mb-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Fund Full Remaining Balance ({formatCurrency(remainingInTargetCurrency, currency)})
              </button>
            )}

            {/* Custom amount */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                {currency}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={customAmountStr}
                onChange={handleCustomChange}
                placeholder="Enter custom amount"
                className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Intention / Zakat Classification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Intention / Classification (Niyyah)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Zakat al-Mal', 'Zakat al-Fitr', 'Sadaqah Nafilah'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setZakatType(type)}
                  className={`py-2 px-2 text-[11px] font-semibold rounded-xl border text-center transition-all ${
                    zakatType === type
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Donor Identity / Anonymity */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded-md text-[#0F5132] border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Keep my donation anonymous (Sadaqah Khāfiyyah)
              </span>
            </label>

            {!isAnonymous && (
              <div>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Your Name (for Zakat Certificate & Tax Receipt)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            )}
          </div>

          {/* Du'a or Notes */}
          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional Du'a or prayer message for the beneficiary family..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Trust Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-start space-x-2 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero-Commission Guarantee:</span> 100% of your {formatCurrency(amount, currency)} is earmarked for this verified case. Transaction processing costs are fully subsidized by community endowment.
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md hover:shadow-amber-400/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-emerald-950" />
            <span>
              {isProcessing ? 'Processing Disbursement...' : `Disburse ${formatCurrency(amount, currency)} Now`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
