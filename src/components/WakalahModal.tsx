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
      const donorName = isAnonymous ? 'Anonymous Servant of Allah' : (profile?.displayName || user?.displayName || 'Raheem Panoly');
      
      const record = await recordDonation({
        caseId: `vakeel_${vakeel.id}`,
        caseTitle: `Entrusted to Vakeel: ${vakeel.name} (${vakeel.regNumber})`,
        donorId: user ? user.uid : 'raheem_panoly',
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
          colors: ['#0D7C66', '#E8F6F3', '#10B981', '#F59E0B'],
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
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#E2ECE9] shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D7C66]"></span>
            <h2 className="font-bold text-sm text-gray-900">Wakalah Proxy Entrustment</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Vakeel Info */}
        <div className="p-3.5 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">{vakeel.name}</h3>
            <span className="text-[10px] bg-[#0D7C66] text-white px-2 py-0.5 rounded-full font-bold">
              {vakeel.regNumber}
            </span>
          </div>
          <p className="text-[11px] text-[#0D7C66] font-medium">{vakeel.title}</p>
          <p className="text-[10px] text-gray-500">{vakeel.mahalluJurisdiction}</p>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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

          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
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
