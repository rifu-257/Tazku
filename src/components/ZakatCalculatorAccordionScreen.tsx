import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Coins, 
  Scale, 
  Wallet, 
  Building, 
  TrendingUp, 
  Briefcase, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveUserCalculation } from '../lib/firebase';

interface ZakatCalculatorAccordionScreenProps {
  onBack: () => void;
  onAllotZakat: (amount: number) => void;
}

export const ZakatCalculatorAccordionScreen: React.FC<ZakatCalculatorAccordionScreenProps> = ({
  onBack,
  onAllotZakat,
}) => {
  const { user } = useAuth();

  // Accordion Expand/Collapse States
  const [isGoldOpen, setIsGoldOpen] = useState(true);
  const [isSilverOpen, setIsSilverOpen] = useState(true);
  const [isNisabRateOpen, setIsNisabRateOpen] = useState(true);
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);

  // A. Gold State
  const [weight24k, setWeight24k] = useState<string>('0');
  const [price24k, setPrice24k] = useState<string>('7350');

  const [weight22k, setWeight22k] = useState<string>('0');
  const [price22k, setPrice22k] = useState<string>('6737.50');

  const [weight18k, setWeight18k] = useState<string>('0');
  const [price18k, setPrice18k] = useState<string>('5512.50');

  // B. Silver State
  const [silverWeight, setSilverWeight] = useState<string>('0');
  const [silverPrice, setSilverPrice] = useState<string>('92.00');

  // C. Silver Nisab Rate Setting
  const [silverNisabRateInput, setSilverNisabRateInput] = useState<string>('92.00');

  // D. Other Assets State
  // Cash
  const [cashInHand, setCashInHand] = useState<string>('0');
  const [cashInBank, setCashInBank] = useState<string>('0');
  const [fixedDeposits, setFixedDeposits] = useState<string>('0');

  // Land Property
  const [propertyResaleValue, setPropertyResaleValue] = useState<string>('0');

  // Investments
  const [tradingShares, setTradingShares] = useState<string>('0');
  const [mutualFunds, setMutualFunds] = useState<string>('0');
  const [loansReceivable, setLoansReceivable] = useState<string>('0');

  // Business
  const [businessStock, setBusinessStock] = useState<string>('0');
  const [tradeReceivables, setTradeReceivables] = useState<string>('0');
  const [deductibleBusinessDebts, setDeductibleBusinessDebts] = useState<string>('0');

  // UI status
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Helper formatting
  const formatINR = (val: number) => {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculations
  const calc = useMemo(() => {
    // 1. Gold calculations
    const w24 = parseFloat(weight24k) || 0;
    const p24 = parseFloat(price24k) || 0;
    const val24 = w24 * p24;

    const w22 = parseFloat(weight22k) || 0;
    const p22 = parseFloat(price22k) || 0;
    const val22 = w22 * p22;

    const w18 = parseFloat(weight18k) || 0;
    const p18 = parseFloat(price18k) || 0;
    const val18 = w18 * p18;

    // Sum of equivalent 24k grams
    const totalPureGoldGrams = w24 * (24 / 24) + w22 * (22 / 24) + w18 * (18 / 24);
    const totalGoldValue = val24 + val22 + val18;
    const zakatOnGold = totalGoldValue * 0.025;

    // 2. Silver calculations
    const sWeight = parseFloat(silverWeight) || 0;
    const sPrice = parseFloat(silverPrice) || 0;
    const totalSilverValue = sWeight * sPrice;
    const zakatOnSilver = totalSilverValue * 0.025;

    // 3. Other Assets
    const cashTotal = (parseFloat(cashInHand) || 0) + (parseFloat(cashInBank) || 0) + (parseFloat(fixedDeposits) || 0);
    const propertyTotal = parseFloat(propertyResaleValue) || 0;
    const investmentsTotal = (parseFloat(tradingShares) || 0) + (parseFloat(mutualFunds) || 0) + (parseFloat(loansReceivable) || 0);
    const netBusinessTotal = Math.max(0, ((parseFloat(businessStock) || 0) + (parseFloat(tradeReceivables) || 0)) - (parseFloat(deductibleBusinessDebts) || 0));

    // 4. Total Wealth
    const totalWealth = totalGoldValue + totalSilverValue + cashTotal + propertyTotal + investmentsTotal + netBusinessTotal;

    // 5. Silver Nisab Threshold (52.5 Tolas = 612.36g)
    const activeRate = parseFloat(silverNisabRateInput);
    const isRateValid = !isNaN(activeRate) && activeRate > 0;
    const silverNisabThreshold = isRateValid ? 612.36 * activeRate : 0;

    const isAboveNisab = isRateValid && totalWealth >= silverNisabThreshold;
    const zakatOnTotalWealth = isAboveNisab ? totalWealth * 0.025 : 0;

    return {
      val24,
      val22,
      val18,
      totalPureGoldGrams,
      totalGoldValue,
      zakatOnGold,
      totalSilverValue,
      zakatOnSilver,
      cashTotal,
      propertyTotal,
      investmentsTotal,
      netBusinessTotal,
      totalWealth,
      isRateValid,
      silverNisabThreshold,
      isAboveNisab,
      zakatOnTotalWealth,
    };
  }, [
    weight24k, price24k, weight22k, price22k, weight18k, price18k,
    silverWeight, silverPrice, silverNisabRateInput,
    cashInHand, cashInBank, fixedDeposits,
    propertyResaleValue,
    tradingShares, mutualFunds, loansReceivable,
    businessStock, tradeReceivables, deductibleBusinessDebts,
  ]);

  const handleSaveCalculation = async () => {
    if (!user) {
      alert("Please sign in to save this calculation to your profile.");
      return;
    }
    try {
      setIsSaving(true);
      await saveUserCalculation({
        userId: user.uid,
        cash: calc.cashTotal,
        goldGrams: calc.totalPureGoldGrams,
        silverGrams: parseFloat(silverWeight) || 0,
        investments: calc.investmentsTotal,
        businessAssets: calc.netBusinessTotal,
        liabilities: parseFloat(deductibleBusinessDebts) || 0,
        netZakatable: calc.totalWealth,
        nisabThreshold: calc.silverNisabThreshold,
        zakatDue: calc.zakatOnTotalWealth,
        currency: 'INR',
        status: 'calculated',
      });
      setSavedSuccessMsg(true);
      setTimeout(() => setSavedSuccessMsg(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF9] min-h-screen text-gray-900 font-sans pb-24">
      {/* 1. Header: Solid Persian Emerald / Deep Teal Banner */}
      <div className="bg-[#0D7C66] text-white pt-6 pb-6 px-4 rounded-b-[2rem] shadow-sm relative flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          Zakat Calculator
        </h1>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Intro subtitle */}
        <p className="text-xs text-gray-500 px-1">
          Islamic Fiqh compliant wealth & Nisab calculation with real-time commodity valuation.
        </p>

        {/* ========================================================================= */}
        {/* 2.A GOLD ACCORDION                                                        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          {/* Header */}
          <div
            onClick={() => setIsGoldOpen(!isGoldOpen)}
            className="bg-[#E8F6F3] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition hover:bg-[#dff0ec]"
          >
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#0D7C66]" />
              <span className="font-extrabold text-sm text-[#0D7C66] tracking-wider uppercase">
                GOLD
              </span>
            </div>
            {isGoldOpen ? (
              <ChevronUp className="w-4 h-4 text-[#0D7C66]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0D7C66]" />
            )}
          </div>

          {/* Body */}
          {isGoldOpen && (
            <div className="mt-4 space-y-4">
              {/* Sub-section 1: 24 Carat Gold/Jewelry */}
              <div className="space-y-2 p-3 bg-[#F8FAF9] rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-800">
                  24 Carat Gold/Jewelry
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Weight in Gram</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={weight24k}
                      onChange={(e) => setWeight24k(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Price per Gram (₹)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={price24k}
                      onChange={(e) => setPrice24k(e.target.value)}
                      placeholder="7350"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                    />
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-[#0D7C66] pt-0.5">
                  Estimated Value: ₹ {formatINR(calc.val24)}
                </div>
              </div>

              {/* Sub-section 2: 22 Carat Gold/Jewelry */}
              <div className="space-y-2 p-3 bg-[#F8FAF9] rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-800">
                  22 Carat Gold/Jewelry
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Weight in Gram</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={weight22k}
                      onChange={(e) => setWeight22k(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Price per Gram (₹)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={price22k}
                      onChange={(e) => setPrice22k(e.target.value)}
                      placeholder="6737.50"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                    />
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-[#0D7C66] pt-0.5">
                  Estimated Value: ₹ {formatINR(calc.val22)}
                </div>
              </div>

              {/* Sub-section 3: 18 Carat Gold/Jewelry */}
              <div className="space-y-2 p-3 bg-[#F8FAF9] rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-800">
                  18 Carat Gold/Jewelry
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Weight in Gram</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={weight18k}
                      onChange={(e) => setWeight18k(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Price per Gram (₹)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={price18k}
                      onChange={(e) => setPrice18k(e.target.value)}
                      placeholder="5512.50"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                    />
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-[#0D7C66] pt-0.5">
                  Estimated Value: ₹ {formatINR(calc.val18)}
                </div>
              </div>

              {/* Bottom Summary Pill: ZAKAT ON GOLD */}
              <div className="bg-[#E8F6F3] p-3.5 rounded-2xl border border-[#0D7C66]/20 space-y-1">
                <div className="text-[11px] font-extrabold text-[#0D7C66] uppercase tracking-wider">
                  ZAKAT ON GOLD
                </div>
                <div className="text-xs text-gray-700">
                  Total pure Gold you have:{' '}
                  <span className="font-bold font-mono text-gray-900">
                    {calc.totalPureGoldGrams.toFixed(2)}
                  </span>{' '}
                  gms
                </div>
                <div className="text-xs font-bold text-[#0D7C66]">
                  Zakat on Gold: ₹ {formatINR(calc.zakatOnGold)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2.B SILVER ACCORDION                                                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          {/* Header */}
          <div
            onClick={() => setIsSilverOpen(!isSilverOpen)}
            className="bg-[#E8F6F3] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition hover:bg-[#dff0ec]"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0D7C66]" />
              <span className="font-extrabold text-sm text-[#0D7C66] tracking-wider uppercase">
                SILVER
              </span>
            </div>
            {isSilverOpen ? (
              <ChevronUp className="w-4 h-4 text-[#0D7C66]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0D7C66]" />
            )}
          </div>

          {/* Body */}
          {isSilverOpen && (
            <div className="mt-4 space-y-3">
              <p className="text-[11px] text-gray-500 italic px-1">
                Include Household Silver Utensils, Artefacts, and Jewelery.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Weight in Gram</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={silverWeight}
                    onChange={(e) => setSilverWeight(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Price per Gram (₹)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={silverPrice}
                    onChange={(e) => setSilverPrice(e.target.value)}
                    placeholder="92.00"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                  />
                </div>
              </div>

              <div className="text-[11px] font-semibold text-[#0D7C66]">
                Estimated Value: ₹ {formatINR(calc.totalSilverValue)}
              </div>

              {/* Bottom Summary Pill: ZAKAT ON SILVER */}
              <div className="bg-[#E8F6F3] p-3.5 rounded-2xl border border-[#0D7C66]/20 space-y-1 mt-2">
                <div className="text-[11px] font-extrabold text-[#0D7C66] uppercase tracking-wider">
                  ZAKAT ON SILVER
                </div>
                <div className="text-xs text-gray-700">
                  Total pure Silver you have:{' '}
                  <span className="font-bold font-mono text-gray-900">
                    {(parseFloat(silverWeight) || 0).toFixed(2)}
                  </span>{' '}
                  gms
                </div>
                <div className="text-xs font-bold text-[#0D7C66]">
                  Zakat on Silver: ₹ {formatINR(calc.zakatOnSilver)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2.C SILVER NISAB RATE ACCORDION                                           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          {/* Header */}
          <div
            onClick={() => setIsNisabRateOpen(!isNisabRateOpen)}
            className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between cursor-pointer select-none transition"
          >
            <span className="text-[11px] font-bold text-amber-900 leading-snug">
              * Enter today's rate of 1 gm of silver in your city/Nearest city to calculate Zakat
            </span>
            {isNisabRateOpen ? (
              <ChevronUp className="w-4 h-4 text-amber-800 shrink-0 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-800 shrink-0 ml-1" />
            )}
          </div>

          {isNisabRateOpen && (
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">
                  Enter silver price per gram (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={silverNisabRateInput}
                  onChange={(e) => setSilverNisabRateInput(e.target.value)}
                  placeholder="e.g. 92.00"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>
              <div className="text-[11px] text-gray-500 leading-relaxed">
                Nisab Cutoff (52.5 Tolas / 612.36g Silver):{' '}
                <strong className="text-[#0D7C66]">
                  ₹ {calc.isRateValid ? formatINR(calc.silverNisabThreshold) : '0.00'}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2.D OTHER ASSET ACCORDIONS (Collapsed by default)                         */}
        {/* ========================================================================= */}

        {/* Accordion 1: CASH IN HAND/BANK */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          <div
            onClick={() => setIsCashOpen(!isCashOpen)}
            className="bg-[#E8F6F3] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition hover:bg-[#dff0ec]"
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#0D7C66]" />
              <span className="font-extrabold text-sm text-[#0D7C66] tracking-wider uppercase">
                CASH IN HAND/BANK
              </span>
            </div>
            {isCashOpen ? (
              <ChevronUp className="w-4 h-4 text-[#0D7C66]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0D7C66]" />
            )}
          </div>

          {isCashOpen && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Cash at Home / Physical Safes (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={cashInHand}
                  onChange={(e) => setCashInHand(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Checking & Savings Accounts (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={cashInBank}
                  onChange={(e) => setCashInBank(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Fixed Deposits / High-Yield Principal (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={fixedDeposits}
                  onChange={(e) => setFixedDeposits(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div className="text-[11px] font-semibold text-[#0D7C66] pt-1">
                Subtotal Cash Assets: ₹ {formatINR(calc.cashTotal)}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: LAND PROPERTY */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          <div
            onClick={() => setIsPropertyOpen(!isPropertyOpen)}
            className="bg-[#E8F6F3] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition hover:bg-[#dff0ec]"
          >
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0D7C66]" />
              <span className="font-extrabold text-sm text-[#0D7C66] tracking-wider uppercase">
                LAND PROPERTY
              </span>
            </div>
            {isPropertyOpen ? (
              <ChevronUp className="w-4 h-4 text-[#0D7C66]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0D7C66]" />
            )}
          </div>

          {isPropertyOpen && (
            <div className="mt-4 space-y-3">
              <p className="text-[11px] text-gray-500 italic">
                Only commercial land and properties bought strictly for business resale are Zakatable. Personal family residence is completely exempt.
              </p>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Market Value of Resale Land / Commercial Real Estate (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={propertyResaleValue}
                  onChange={(e) => setPropertyResaleValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div className="text-[11px] font-semibold text-[#0D7C66] pt-1">
                Subtotal Land Property: ₹ {formatINR(calc.propertyTotal)}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: INVESTMENT IN SHARES / BONDS / MUTUAL FUNDS... */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          <div
            onClick={() => setIsInvestmentsOpen(!isInvestmentsOpen)}
            className="bg-[#E8F6F3] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition hover:bg-[#dff0ec]"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0D7C66]" />
              <span className="font-extrabold text-xs sm:text-sm text-[#0D7C66] tracking-tight uppercase line-clamp-1">
                INVESTMENT IN SHARES / BONDS / FUNDS / LOANS
              </span>
            </div>
            {isInvestmentsOpen ? (
              <ChevronUp className="w-4 h-4 text-[#0D7C66] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0D7C66] shrink-0" />
            )}
          </div>

          {isInvestmentsOpen && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Trading Stocks & Equities Held for Short-term Resale (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={tradingShares}
                  onChange={(e) => setTradingShares(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Mutual Funds / Sukuk / Dividend Units (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={mutualFunds}
                  onChange={(e) => setMutualFunds(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Loans & Advances Given (Expected to be recovered) (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={loansReceivable}
                  onChange={(e) => setLoansReceivable(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div className="text-[11px] font-semibold text-[#0D7C66] pt-1">
                Subtotal Investments & Loans: ₹ {formatINR(calc.investmentsTotal)}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 4: BUSINESS */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition">
          <div
            onClick={() => setIsBusinessOpen(!isBusinessOpen)}
            className="bg-[#E8F6F3] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition hover:bg-[#dff0ec]"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0D7C66]" />
              <span className="font-extrabold text-sm text-[#0D7C66] tracking-wider uppercase">
                BUSINESS
              </span>
            </div>
            {isBusinessOpen ? (
              <ChevronUp className="w-4 h-4 text-[#0D7C66]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0D7C66]" />
            )}
          </div>

          {isBusinessOpen && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Finished Tradable Merchandise / Wholesale Stock (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={businessStock}
                  onChange={(e) => setBusinessStock(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Trade Receivables from Customers (Reliable invoices) (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={tradeReceivables}
                  onChange={(e) => setTradeReceivables(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-red-600 mb-1 font-medium">
                  Less: Immediate Operational Debts & Supplier Invoices Due (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={deductibleBusinessDebts}
                  onChange={(e) => setDeductibleBusinessDebts(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs font-bold text-red-900 focus:outline-hidden focus:border-red-400"
                />
              </div>

              <div className="text-[11px] font-semibold text-[#0D7C66] pt-1">
                Net Business Assets: ₹ {formatINR(calc.netBusinessTotal)}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. SUMMARY & FINAL OUTPUT CARD (Zakat on Wealth)                          */}
        {/* ========================================================================= */}
        <div className="bg-[#E8F6F3] rounded-3xl p-5 border border-[#0D7C66]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-[#0D7C66]/20 pb-2">
            <h2 className="text-sm font-extrabold text-[#0D7C66] tracking-wider uppercase">
              ZAKAT ON WEALTH
            </h2>
            <span className="text-[10px] bg-[#0D7C66] text-white px-2 py-0.5 rounded-full font-bold">
              2.5% Rate
            </span>
          </div>

          {/* Total Wealth */}
          <div className="flex justify-between items-baseline text-xs text-gray-700">
            <span>Total Wealth you have:</span>
            <span className="font-mono font-bold text-sm text-gray-900">
              ₹ {formatINR(calc.totalWealth)}
            </span>
          </div>

          {/* Validation & Zakat on Wealth Output */}
          <div className="pt-2 border-t border-[#0D7C66]/20">
            {!calc.isRateValid ? (
              <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Zakat on Wealth: * fill the silver price input</span>
              </div>
            ) : calc.isAboveNisab ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-600">Zakat on Wealth:</div>
                <div className="text-2xl font-extrabold font-mono text-[#0D7C66]">
                  ₹ {formatINR(calc.zakatOnTotalWealth)}
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Net wealth exceeds Silver Nisab threshold (₹ {formatINR(calc.silverNisabThreshold)}). Zakat is obligatory.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-600 space-y-1">
                <div>Zakat on Wealth: <strong className="text-gray-900">₹ 0.00</strong></div>
                <div className="text-[10px] text-amber-800 bg-amber-100/60 p-2 rounded-xl">
                  Total wealth is below Silver Nisab (₹ {formatINR(calc.silverNisabThreshold)}). No obligatory Zakat due.
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                const amt = calc.zakatOnTotalWealth > 0 ? calc.zakatOnTotalWealth : 2500;
                onAllotZakat(amt);
              }}
              className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {calc.zakatOnTotalWealth > 0
                  ? `Allot ₹ ${formatINR(calc.zakatOnTotalWealth)} to Claimants`
                  : 'Proceed to Claimants Directory'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSaveCalculation}
              disabled={isSaving}
              className="w-full py-2.5 bg-white text-[#0D7C66] hover:bg-gray-50 border border-[#0D7C66]/30 rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Calculation to History'}</span>
            </button>

            {savedSuccessMsg && (
              <div className="text-[11px] text-center text-emerald-800 font-bold bg-white/80 p-1.5 rounded-xl border border-emerald-300">
                ✓ Calculation successfully saved to your profile!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
