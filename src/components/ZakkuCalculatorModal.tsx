import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Coins, 
  Scale, 
  Wallet, 
  TrendingUp, 
  Receipt, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveUserCalculation } from '../lib/firebase';

interface ZakkuCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllotZakat: (amount: number) => void;
}

export const ZakkuCalculatorModal: React.FC<ZakkuCalculatorModalProps> = ({
  isOpen,
  onClose,
  onAllotZakat,
}) => {
  const { user } = useAuth();
  const [nisabStandard, setNisabStandard] = useState<'gold' | 'silver'>('silver');
  const [cash, setCash] = useState<string>('120000');
  const [goldGrams, setGoldGrams] = useState<string>('25');
  const [silverGrams, setSilverGrams] = useState<string>('0');
  const [stocks, setStocks] = useState<string>('45000');
  const [businessStock, setBusinessStock] = useState<string>('0');
  const [debts, setDebts] = useState<string>('15000');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live market commodity prices in INR
  const GOLD_PRICE_PER_GRAM = 7350; // 24K INR/g
  const SILVER_PRICE_PER_GRAM = 92; // Fine silver INR/g
  const GOLD_NISAB_GRAMS = 87.48; // ~₹643,000
  const SILVER_NISAB_GRAMS = 612.36; // ~₹56,337

  const goldNisabValue = GOLD_PRICE_PER_GRAM * GOLD_NISAB_GRAMS;
  const silverNisabValue = SILVER_PRICE_PER_GRAM * SILVER_NISAB_GRAMS;
  const currentThreshold = nisabStandard === 'gold' ? goldNisabValue : silverNisabValue;

  const calculations = useMemo(() => {
    const c = parseFloat(cash) || 0;
    const g = (parseFloat(goldGrams) || 0) * GOLD_PRICE_PER_GRAM;
    const s = (parseFloat(silverGrams) || 0) * SILVER_PRICE_PER_GRAM;
    const inv = parseFloat(stocks) || 0;
    const b = parseFloat(businessStock) || 0;
    const d = parseFloat(debts) || 0;

    const gross = c + g + s + inv + b;
    const net = Math.max(0, gross - d);
    const isObligatory = net >= currentThreshold;
    const due = isObligatory ? Math.round(net * 0.025) : 0;

    return { gross, net, isObligatory, due };
  }, [cash, goldGrams, silverGrams, stocks, businessStock, debts, currentThreshold]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const newCalc: any = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: user?.uid || 'community_member',
        createdAt: new Date().toISOString(),
        cash: parseFloat(cash) || 0,
        goldGrams: parseFloat(goldGrams) || 0,
        silverGrams: parseFloat(silverGrams) || 0,
        investments: parseFloat(stocks) || 0,
        businessAssets: parseFloat(businessStock) || 0,
        liabilities: parseFloat(debts) || 0,
        netZakatable: calculations.net,
        nisabThreshold: currentThreshold,
        zakatDue: calculations.due,
        currency: 'INR',
        status: 'calculated',
      };

      // 1. Save to local storage
      try {
        const cached = localStorage.getItem('tazku_saved_calculations');
        const parsed = cached ? JSON.parse(cached) : [];
        localStorage.setItem('tazku_saved_calculations', JSON.stringify([newCalc, ...parsed]));
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }

      // 2. Dispatch event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tazku_calculation_saved', { detail: newCalc }));
      }

      // 3. Sync to Firebase if user is logged in
      if (user?.uid) {
        try {
          await saveUserCalculation({
            userId: user.uid,
            cash: parseFloat(cash) || 0,
            goldGrams: parseFloat(goldGrams) || 0,
            silverGrams: parseFloat(silverGrams) || 0,
            investments: parseFloat(stocks) || 0,
            businessAssets: parseFloat(businessStock) || 0,
            liabilities: parseFloat(debts) || 0,
            netZakatable: calculations.net,
            nisabThreshold: currentThreshold,
            zakatDue: calculations.due,
            currency: 'INR',
            status: 'calculated',
          });
        } catch (fbErr) {
          console.warn("Firestore sync error:", fbErr);
        }
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#EBE5D8] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#112A20] leading-tight">
                Nisab & Zakat Calculator
              </h2>
              <span className="text-[11px] text-[#40916C] font-semibold">
                Fiqh Compliant • 2.5% Rate
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F3EFE6] text-[#526059] hover:text-[#112A20] flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Nisab Selector Banner */}
        <div className="mt-4 p-3.5 bg-[#F3EFE6] rounded-2xl border border-[#EBE5D8]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#40916C]" /> Nisab Benchmark
            </span>
            <div className="flex gap-1 bg-white p-0.5 rounded-full border border-[#EBE5D8]">
              <button
                type="button"
                onClick={() => setNisabStandard('silver')}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                  nisabStandard === 'silver' ? 'bg-[#1B4332] text-white shadow-2xs' : 'text-[#526059]'
                }`}
              >
                Silver (612g)
              </button>
              <button
                type="button"
                onClick={() => setNisabStandard('gold')}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                  nisabStandard === 'gold' ? 'bg-[#1B4332] text-white shadow-2xs' : 'text-[#526059]'
                }`}
              >
                Gold (87.5g)
              </button>
            </div>
          </div>
          <div className="flex justify-between items-baseline text-xs text-[#526059]">
            <span>Threshold for Zakat:</span>
            <span className="font-mono font-bold text-[#1B4332] text-sm">
              ₹{currentThreshold.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-semibold text-[#526059] mb-1 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#1B4332]" />
              Cash on Hand & Bank Balances (₹)
            </label>
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold text-[#112A20] focus:outline-hidden focus:border-[#40916C] focus:ring-1 focus:ring-[#40916C]"
              placeholder="0"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">
              Only halal principal balances. Non-permissible bank interest (Riba) is excluded & purified separately.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[#526059] mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                Gold (Grams)
              </label>
              <input
                type="number"
                value={goldGrams}
                onChange={(e) => setGoldGrams(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold text-[#112A20] focus:outline-hidden focus:border-[#40916C] focus:ring-1 focus:ring-[#40916C]"
                placeholder="0"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">@ ₹7,350/g</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#526059] mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#526059]" />
                Silver (Grams)
              </label>
              <input
                type="number"
                value={silverGrams}
                onChange={(e) => setSilverGrams(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold text-[#112A20] focus:outline-hidden focus:border-[#40916C] focus:ring-1 focus:ring-[#40916C]"
                placeholder="0"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">@ ₹92/g</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#526059] mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#1B4332]" />
              Shares, Mutual Funds & Business Goods (₹)
            </label>
            <input
              type="number"
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold text-[#112A20] focus:outline-hidden focus:border-[#40916C] focus:ring-1 focus:ring-[#40916C]"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#526059] mb-1 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-rose-500" />
              Immediate Debts & Liabilities to Deduct (₹)
            </label>
            <input
              type="number"
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-[#112A20] focus:outline-hidden focus:border-rose-400"
              placeholder="0"
            />
          </div>
        </div>

        {/* Calculation Result Card (Warm Oat / Sand #F3EFE6) */}
        <div className="mt-5 p-4 bg-[#F3EFE6] border border-[#EBE5D8] text-[#112A20] rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#526059] mb-1">
            <span>Net Zakatable Wealth</span>
            <span className="font-mono font-bold text-[#112A20]">
              ₹{calculations.net.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border-t border-[#EBE5D8] pt-2.5 mt-2 flex justify-between items-end">
            <div>
              <span className="text-[11px] text-[#1B4332] uppercase font-bold tracking-wider block">
                Zakat Obligation (2.5%)
              </span>
              <div className="text-2xl font-extrabold font-mono text-[#1B4332] mt-0.5">
                ₹{calculations.due.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              {calculations.isObligatory ? (
                <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] border border-[#40916C]/20 px-2.5 py-1 rounded-full font-bold inline-block">
                  ✓ Zakat Obligatory
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  Below Nisab
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              onAllotZakat(calculations.due > 0 ? calculations.due : 2500);
              onClose();
            }}
            className="w-full py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Allot {calculations.due > 0 ? `₹${calculations.due.toLocaleString('en-IN')}` : 'Zakat'} to Claimants</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 bg-white text-[#1B4332] hover:bg-[#F3EFE6] border border-[#EBE5D8] rounded-full font-semibold text-xs transition cursor-pointer"
          >
            {savedSuccess ? '✓ Saved to Your Profile!' : isSaving ? 'Saving...' : 'Save Calculation to History'}
          </button>
        </div>
      </div>
    </div>
  );
};
