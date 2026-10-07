import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Wallet, 
  Coins, 
  TrendingUp, 
  Building2, 
  Receipt, 
  Info, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Bookmark, 
  RotateCcw, 
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { CurrencyCode, Madhhab, ZakatCalculationInput } from '../types';
import { 
  formatCurrency, 
  getNisabValue, 
  convertFromUSD, 
  BASE_COMMODITY_PRICES 
} from '../lib/currency';
import { useAuth } from '../context/AuthContext';
import { saveUserCalculation } from '../lib/firebase';

interface ZakatCalculatorProps {
  currency: CurrencyCode;
  nisabStandard: 'gold' | 'silver';
  onDisburseNow: (amount: number, calculatedZakat: number) => void;
}

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({
  currency,
  nisabStandard,
  onDisburseNow,
}) => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [madhhab, setMadhhab] = useState<Madhhab>(profile?.madhhab || 'Shafii');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form Inputs
  const [inputs, setInputs] = useState<ZakatCalculationInput>({
    cashInHand: 0,
    bankBalances: 0,
    foreignCurrency: 0,
    goldGrams24k: 0,
    goldGrams22k: 0,
    isPersonalJewelryExempt: true,
    silverGrams: 0,
    tradingStocks: 0,
    longTermStocks: 0,
    cryptocurrency: 0,
    businessInventory: 0,
    tradeReceivables: 0,
    immediateDebts: 0,
    immediateBills: 0,
    useLunarYear: false,
    nisabStandard,
    currency,
  });

  const handleInputChange = (field: keyof ZakatCalculationInput, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? Math.max(0, value) : value,
    }));
  };

  // Prices in chosen currency
  const goldPricePerGram = convertFromUSD(BASE_COMMODITY_PRICES.goldPricePerGramUSD, currency);
  const silverPricePerGram = convertFromUSD(BASE_COMMODITY_PRICES.silverPricePerGramUSD, currency);
  const activeNisabThreshold = getNisabValue(nisabStandard, currency);

  // Asset Breakdown Calculations
  const calculations = useMemo(() => {
    // 1. Cash
    const cashTotal = (inputs.cashInHand || 0) + (inputs.bankBalances || 0) + (inputs.foreignCurrency || 0);

    // 2. Gold & Silver
    // 22k is 91.6% pure
    let effectiveGold24k = inputs.goldGrams24k || 0;
    let effectiveGold22k = inputs.goldGrams22k || 0;

    // Madhhab handling for jewelry exemption:
    // If Hanafi, personal jewelry is NOT exempt. If Shafi'i/Maliki/Hanbali and user checked exemption, exempt personal jewelry
    if (madhhab === 'Hanafi') {
      // In Hanafi all gold/silver is zakatable
    } else if (inputs.isPersonalJewelryExempt) {
      // Exemption applies if chosen
    }

    const goldValue = (effectiveGold24k * goldPricePerGram) + (effectiveGold22k * (22 / 24) * goldPricePerGram);
    const silverValue = (inputs.silverGrams || 0) * silverPricePerGram;
    const preciousMetalsTotal = goldValue + silverValue;

    // 3. Investments & Stocks
    // Trading stocks at 100%, Long term stocks at estimated ~30% zakatable underlying asset proxy
    const stocksTotal = (inputs.tradingStocks || 0) + ((inputs.longTermStocks || 0) * 0.30) + (inputs.cryptocurrency || 0);

    // 4. Business Assets
    const businessTotal = (inputs.businessInventory || 0) + (inputs.tradeReceivables || 0);

    // Gross Wealth
    const grossWealth = cashTotal + preciousMetalsTotal + stocksTotal + businessTotal;

    // 5. Deductible Liabilities
    const totalLiabilities = (inputs.immediateDebts || 0) + (inputs.immediateBills || 0);

    // Net Zakatable Wealth
    const netZakatable = Math.max(0, grossWealth - totalLiabilities);

    // Eligibility
    const isObligatory = netZakatable >= activeNisabThreshold;

    // Zakat rate: 2.5% solar or 2.577% lunar
    const rate = calendarType === 'lunar' ? 0.02577 : 0.025;
    const zakatDue = isObligatory ? netZakatable * rate : 0;

    return {
      cashTotal,
      goldValue,
      silverValue,
      preciousMetalsTotal,
      stocksTotal,
      businessTotal,
      grossWealth,
      totalLiabilities,
      netZakatable,
      isObligatory,
      rate,
      zakatDue,
    };
  }, [inputs, goldPricePerGram, silverPricePerGram, madhhab, calendarType, activeNisabThreshold]);

  const handleSaveCalculation = async () => {
    if (!user) {
      alert("Please sign in with Google to save your calculation history.");
      return;
    }

    try {
      setIsSaving(true);
      await saveUserCalculation({
        userId: user.uid,
        cash: calculations.cashTotal,
        goldGrams: (inputs.goldGrams24k || 0) + (inputs.goldGrams22k || 0),
        silverGrams: inputs.silverGrams || 0,
        investments: calculations.stocksTotal,
        businessAssets: calculations.businessTotal,
        liabilities: calculations.totalLiabilities,
        netZakatable: calculations.netZakatable,
        nisabThreshold: activeNisabThreshold,
        zakatDue: calculations.zakatDue,
        currency,
        status: 'calculated',
      });
      setSaveSuccessMsg("Calculation successfully saved to your profile!");
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Save calculation failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { num: 1, title: 'Cash & Savings', icon: Wallet, desc: 'Liquid bank balances & cash' },
    { num: 2, title: 'Gold & Silver', icon: Coins, desc: 'Precious metals & karat selection' },
    { num: 3, title: 'Investments', icon: TrendingUp, desc: 'Stocks, funds & crypto' },
    { num: 4, title: 'Business Assets', icon: Building2, desc: 'Trade inventory & receivables' },
    { num: 5, title: 'Liabilities', icon: Receipt, desc: 'Immediate debts & bills' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-3">
          <Calculator className="w-3.5 h-3.5 text-emerald-700" />
          <span>Interactive Fiqh Calculation Engine</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Zakat Calculator
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Calculate your obligatory Zakat across 5 distinct asset classes with Madhhab-specific guidelines and real-time commodity Nisab thresholds.
        </p>

        {/* Global toggles bar: Madhhab & Calendar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          {/* Madhhab Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-700">Jurisprudence (Madhhab):</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              {(['Shafii', 'Hanafi', 'Maliki', 'Hanbali'] as Madhhab[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMadhhab(m)}
                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                    madhhab === m
                      ? 'bg-[#0F5132] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'Shafii' ? "Shafi'i" : m}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {/* Calendar type */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-700">Year Basis:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setCalendarType('solar')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                  calendarType === 'solar'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Solar / Gregorian (2.50%)
              </button>
              <button
                type="button"
                onClick={() => setCalendarType('lunar')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                  calendarType === 'lunar'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hijri Lunar (2.577%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Steps & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Step Navigation & Form Input Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step Pill Navigation */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            {steps.map((st) => {
              const Icon = st.icon;
              const isCurrent = currentStep === st.num;
              const isCompleted = currentStep > st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl text-center transition-all ${
                    isCurrent
                      ? 'bg-white text-[#0F5132] font-bold shadow-sm ring-1 ring-emerald-600/30'
                      : isCompleted
                      ? 'text-emerald-800 hover:bg-white/60'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isCurrent ? 'text-[#0F5132]' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-semibold leading-tight line-clamp-1">{st.title}</span>
                </button>
              );
            })}
          </div>

          {/* Form Step Body */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Step 1: Cash & Liquid Balances */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-emerald-700" />
                      <span>Step 1: Cash & Liquid Balances</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Includes all cash on hand, bank account balances, and foreign currencies converted to {currency}.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cash at Home / Physical Safes ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.cashInHand || ''}
                      onChange={(e) => handleInputChange('cashInHand', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Checking, Savings & Digital Bank Balances ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.bankBalances || ''}
                      onChange={(e) => handleInputChange('bankBalances', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Include interest-free savings, current accounts, and high-yield deposits (only principal amount is Zakatable, not haram interest).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Foreign Currency Holdings (Value in {currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.foreignCurrency || ''}
                      onChange={(e) => handleInputChange('foreignCurrency', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Gold & Silver Holdings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-amber-600" />
                      <span>Step 2: Gold & Silver Holdings</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Bullion, coins, ingots, and jewelry. Rates: Gold ~{formatCurrency(goldPricePerGram, currency)}/g, Silver ~{formatCurrency(silverPricePerGram, currency)}/g.
                    </p>
                  </div>
                </div>

                {/* Madhhab Jurisprudence Insight Card */}
                <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-xs text-amber-950">
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>Fiqh Guideline for {madhhab === 'Shafii' ? "Shafi'i" : madhhab} Madhhab</span>
                  </div>
                  {madhhab === 'Hanafi' ? (
                    <p>
                      In the <strong>Hanafi</strong> school, all gold and silver jewelry is subject to Zakat once the total weight crosses the Nisab, regardless of whether it is worn regularly for personal adornment.
                    </p>
                  ) : (
                    <div>
                      <p>
                        In the <strong>{madhhab === 'Shafii' ? "Shafi'i" : madhhab}</strong> school, customary gold/silver jewelry owned and worn by women for personal use is exempt from Zakat, provided it does not exceed reasonable social custom.
                      </p>
                      <label className="flex items-center space-x-2 mt-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={inputs.isPersonalJewelryExempt}
                          onChange={(e) => handleInputChange('isPersonalJewelryExempt', e.target.checked)}
                          className="w-4 h-4 text-[#0F5132] rounded-md border-amber-400 focus:ring-amber-500"
                        />
                        <span className="font-semibold text-amber-900">
                          Apply personal-use jewelry exemption according to {madhhab === 'Shafii' ? "Shafi'i" : madhhab} fiqh
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      24 Karat Gold (Total Grams Owned)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.goldGrams24k || ''}
                      onChange={(e) => handleInputChange('goldGrams24k', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 50"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <div className="text-[11px] text-slate-500 mt-1">
                      Est. Value: {formatCurrency((inputs.goldGrams24k || 0) * goldPricePerGram, currency)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      22 Karat Gold (Total Grams Owned)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.goldGrams22k || ''}
                      onChange={(e) => handleInputChange('goldGrams22k', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 75"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <div className="text-[11px] text-slate-500 mt-1">
                      Est. Value: {formatCurrency((inputs.goldGrams22k || 0) * (22/24) * goldPricePerGram, currency)}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pure Silver (Total Grams Owned)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.silverGrams || ''}
                      onChange={(e) => handleInputChange('silverGrams', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 200"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <div className="text-[11px] text-slate-500 mt-1">
                      Est. Value: {formatCurrency((inputs.silverGrams || 0) * silverPricePerGram, currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Investments & Stocks */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-700" />
                      <span>Step 3: Investments, Stocks & Crypto</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Distinction between short-term capital gains trading vs. long-term dividend holdings.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                    <span className="font-bold">AAOIFI & Islamic Fiqh Academy Standard:</span> Active short-term shares held for trading are 100% Zakatable at current market value. Long-term shares held for annual dividends are Zakatable only on the company's liquid and trade assets (~30% proxy rule).
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Short-Term Active Trading Stocks & Mutual Funds ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.tradingStocks || ''}
                      onChange={(e) => handleInputChange('tradingStocks', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Calculated at 100% market value.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Long-Term Passive / Dividend Stocks ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.longTermStocks || ''}
                      onChange={(e) => handleInputChange('longTermStocks', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Automatically calculated at standard 30% zakatable proportion ({formatCurrency((inputs.longTermStocks || 0) * 0.30, currency)} zakatable).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cryptocurrency & Digital Assets Held as Wealth ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.cryptocurrency || ''}
                      onChange={(e) => handleInputChange('cryptocurrency', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Business Inventory & Receivables */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-emerald-700" />
                      <span>Step 4: Business Inventory & Receivables</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Applies to commercial trade stock, retail goods, and collectible customer invoices.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">What is NOT Zakatable:</span> Fixed company assets (machinery, factory buildings, office computers, delivery vehicles) are exempt from Zakat. Only goods meant for sale are Zakatable.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Finished Goods & Trade Merchandise for Sale ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.businessInventory || ''}
                      onChange={(e) => handleInputChange('businessInventory', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Valued at wholesale replacement or current market selling price.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Trade Receivables / Invoices Expected to be Collected ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.tradeReceivables || ''}
                      onChange={(e) => handleInputChange('tradeReceivables', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Only include receivables that are reliably expected to be paid.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Deductible Liabilities & Debts */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                      <Receipt className="w-5 h-5 text-red-600" />
                      <span>Step 5: Deductible Liabilities & Immediate Debts</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Debts and payments due immediately or in the current lunar cycle are deducted from your gross wealth.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-950">
                    <span className="font-bold">Fiqh Rule on Long-Term Debt:</span> For long-term debts (e.g. 25-year mortgage or 5-year business loan), you do NOT deduct the entire balance. You only deduct the principal payments due immediately within this annual cycle.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Debts & Loan Installments Due Immediately / This Year ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.immediateDebts || ''}
                      onChange={(e) => handleInputChange('immediateDebts', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Overdue Utility Bills, Taxes & Employee Wages Due ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.immediateBills || ''}
                      onChange={(e) => handleInputChange('immediateBills', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full text-base font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <div className="text-xs text-slate-400 font-medium">
                Step {currentStep} of 5
              </div>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5132] text-white hover:bg-[#1B4332] transition-colors shadow-sm"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('zakat-result-card');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Review Final Summary</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Dynamic Output Card & Breakdown (5 cols) */}
        <div id="zakat-result-card" className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-[#0F5132] p-6 shadow-xl relative overflow-hidden">
            {/* Top accent badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <h3 className="font-extrabold text-slate-900 text-lg">Zakat Summary Card</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {calendarType === 'lunar' ? '2.577% Hijri' : '2.50% Solar'}
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="divide-y divide-slate-100 text-xs py-2">
              <div className="py-2.5 flex justify-between items-center text-slate-600">
                <span>1. Cash & Bank Balances:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(calculations.cashTotal, currency)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-slate-600">
                <span>2. Gold & Silver Value:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(calculations.preciousMetalsTotal, currency)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-slate-600">
                <span>3. Zakatable Investments:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(calculations.stocksTotal, currency)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-slate-600">
                <span>4. Business Inventory & Receivables:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(calculations.businessTotal, currency)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-slate-700 font-bold bg-slate-50/80 px-2 rounded-sm">
                <span>Total Gross Wealth:</span>
                <span className="text-slate-900">{formatCurrency(calculations.grossWealth, currency)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center text-red-600">
                <span>Less: Deductible Liabilities:</span>
                <span className="font-semibold">-{formatCurrency(calculations.totalLiabilities, currency)}</span>
              </div>
            </div>

            {/* Net Wealth vs Nisab Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">Net Zakatable Wealth:</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(calculations.netZakatable, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Nisab Threshold ({nisabStandard === 'gold' ? 'Gold 87.48g' : 'Silver 612.36g'}):
                </span>
                <span className="font-bold text-slate-700">
                  {formatCurrency(activeNisabThreshold, currency)}
                </span>
              </div>

              {/* Obligation Status */}
              <div className="pt-2 border-t border-slate-200">
                {calculations.isObligatory ? (
                  <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-100/70 p-2 rounded-lg text-xs font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zakat is Obligatory (Net wealth exceeds Nisab)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-slate-600 bg-amber-50 p-2 rounded-lg text-xs font-semibold">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Net wealth is below Nisab. No obligatory Zakat due.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Final Big Zakat Output */}
            <div className="mt-6 bg-gradient-to-br from-[#0F5132] to-[#1B4332] rounded-2xl p-6 text-white text-center shadow-lg border border-amber-400/40 relative">
              <div className="text-xs uppercase tracking-wider text-amber-200/90 font-bold mb-1">
                Your Calculated Zakat Due
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 tracking-tight my-2">
                {formatCurrency(calculations.zakatDue, currency)}
              </div>
              <p className="text-[11px] text-emerald-100/80">
                {calculations.isObligatory
                  ? `Pure 100% direct disbursement to verified causes with 0% administrative fee.`
                  : `You can still offer voluntary Sadaqah Nafilah to support urgent cases.`}
              </p>

              {/* Direct Disburse CTA Button */}
              <button
                type="button"
                onClick={() => onDisburseNow(calculations.zakatDue > 0 ? calculations.zakatDue : 50, calculations.zakatDue)}
                className="w-full mt-5 py-3.5 px-4 rounded-xl font-extrabold text-sm bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md hover:shadow-amber-400/30 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Disburse Now to Verified Causes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar: Save & Reset */}
            <div className="mt-4 flex items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={handleSaveCalculation}
                disabled={isSaving}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isSaving ? 'Saving...' : 'Save Calculation'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputs({
                    cashInHand: 0,
                    bankBalances: 0,
                    foreignCurrency: 0,
                    goldGrams24k: 0,
                    goldGrams22k: 0,
                    isPersonalJewelryExempt: true,
                    silverGrams: 0,
                    tradingStocks: 0,
                    longTermStocks: 0,
                    cryptocurrency: 0,
                    businessInventory: 0,
                    tradeReceivables: 0,
                    immediateDebts: 0,
                    immediateBills: 0,
                    useLunarYear: false,
                    nisabStandard,
                    currency,
                  });
                  setCurrentStep(1);
                }}
                className="py-2 px-3 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Reset calculator"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg text-center font-semibold">
                {saveSuccessMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
