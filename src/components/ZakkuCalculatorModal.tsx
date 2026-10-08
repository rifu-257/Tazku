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
    if (!user) {
      alert("Sign in to sync your calculation to your profile.");
      return;
    }
    try {
      setIsSaving(true);
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
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#E2ECE9] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F6F3] text-[#0D7C66] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Nisab & Zakat Calculator
              </h2>
              <span className="text-[11px] text-[#0D7C66] font-semibold">
                Fiqh Compliant • 2.5% Rate
              </span>
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

        {/* Nisab Selector Banner */}
        <div className="mt-4 p-3.5 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0D7C66] flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Nisab Benchmark
            </span>
            <div className="flex gap-1 bg-white/80 p-0.5 rounded-full border border-[#0D7C66]/20">
              <button
                type="button"
                onClick={() => setNisabStandard('silver')}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition ${
                  nisabStandard === 'silver' ? 'bg-[#0D7C66] text-white' : 'text-gray-600'
                }`}
              >
                Silver (612g)
              </button>
              <button
                type="button"
                onClick={() => setNisabStandard('gold')}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition ${
                  nisabStandard === 'gold' ? 'bg-[#0D7C66] text-white' : 'text-gray-600'
                }`}
              >
                Gold (87.5g)
              </button>
            </div>
          </div>
          <div className="flex justify-between items-baseline text-xs text-gray-700">
            <span>Threshold for Zakat:</span>
            <span className="font-mono font-bold text-[#0D7C66] text-sm">
              ₹{currentThreshold.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#0D7C66]" />
              Cash on Hand & Bank Balances (₹)
            </label>
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
              placeholder="0"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">
              Only halal principal balances. Non-permissible bank interest (Riba) is excluded & purified separately.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Gold (Grams)
              </label>
              <input
                type="number"
                value={goldGrams}
                onChange={(e) => setGoldGrams(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                placeholder="0"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">@ ₹7,350/g</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-gray-400" />
                Silver (Grams)
              </label>
              <input
                type="number"
                value={silverGrams}
                onChange={(e) => setSilverGrams(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                placeholder="0"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">@ ₹92/g</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#0D7C66]" />
              Shares, Mutual Funds & Business Goods (₹)
            </label>
            <input
              type="number"
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-rose-500" />
              Immediate Debts & Liabilities to Deduct (₹)
            </label>
            <input
              type="number"
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-rose-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-rose-400 focus:outline-hidden"
              placeholder="0"
            />
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className="mt-5 p-4 bg-[#0D7C66] text-white rounded-2xl shadow-lg">
          <div className="flex justify-between items-center text-xs text-teal-100 mb-1">
            <span>Net Zakatable Wealth</span>
            <span className="font-mono font-bold text-white">
              ₹{calculations.net.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border-t border-white/20 pt-2.5 mt-2 flex justify-between items-end">
            <div>
              <span className="text-[11px] text-teal-200 uppercase font-bold tracking-wider block">
                Zakat Obligation (2.5%)
              </span>
              <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                ₹{calculations.due.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              {calculations.isObligatory ? (
                <span className="text-[10px] bg-emerald-400/30 text-emerald-100 border border-emerald-300/40 px-2.5 py-1 rounded-full font-bold inline-block">
                  ✓ Zakat Obligatory
                </span>
              ) : (
                <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-full font-semibold">
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
            className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Allot {calculations.due > 0 ? `₹${calculations.due.toLocaleString('en-IN')}` : 'Zakat'} to Claimants</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 bg-[#E8F6F3] text-[#0D7C66] hover:bg-[#d8efe9] rounded-full font-semibold text-xs transition"
          >
            {savedSuccess ? '✓ Saved to Your Profile!' : isSaving ? 'Saving...' : 'Save Calculation to History'}
          </button>
        </div>
      </div>
    </div>
  );
};
