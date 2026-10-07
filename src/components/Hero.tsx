import React, { useState } from 'react';
import { 
  Calculator, 
  HeartHandshake, 
  FileText, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Scale
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { formatCurrency, getNisabValue, BASE_COMMODITY_PRICES, convertFromUSD } from '../lib/currency';

interface HeroProps {
  onNavigate: (tab: string) => void;
  currency: CurrencyCode;
  nisabStandard: 'gold' | 'silver';
  setNisabStandard: (std: 'gold' | 'silver') => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  currency,
  nisabStandard,
  setNisabStandard,
}) => {
  const [quickNetWealth, setQuickNetWealth] = useState<string>('');

  const goldNisabValue = getNisabValue('gold', currency);
  const silverNisabValue = getNisabValue('silver', currency);
  const goldPricePerGram = convertFromUSD(BASE_COMMODITY_PRICES.goldPricePerGramUSD, currency);
  const silverPricePerGram = convertFromUSD(BASE_COMMODITY_PRICES.silverPricePerGramUSD, currency);

  const activeNisabThreshold = nisabStandard === 'gold' ? goldNisabValue : silverNisabValue;
  const userWealthNumber = parseFloat(quickNetWealth) || 0;
  const isEligible = userWealthNumber >= activeNisabThreshold;
  const estimatedZakat = isEligible ? userWealthNumber * 0.025 : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#0F5132] to-[#12482E] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
      {/* Decorative Islamic Geometric subtle background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none islamic-pattern"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-amber-400/30 rounded-full px-4 py-1.5 shadow-inner backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-amber-200">
              Community Hackathon Demo: 100% Zero Commission Fiqh Protocol
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Empowering Communities Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 underline decoration-amber-400/50 decoration-wavy">
              Transparent & Dignified
            </span>{' '}
            Zakat.
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            Calculate your obligatory Zakat with scholarly precision, audit live commodity Nisab thresholds, and disburse 100% of your funds directly to verified local ward cases.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('calculator')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-amber-400 text-emerald-950 hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/20 flex items-center space-x-2 group"
            >
              <Calculator className="w-5 h-5 text-emerald-900" />
              <span>Calculate My Zakat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('causes')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <HeartHandshake className="w-5 h-5 text-amber-300" />
              <span>Explore Verified Cases</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('apply')}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-100 transition-all flex items-center space-x-2"
            >
              <FileText className="w-5 h-5 text-emerald-300" />
              <span>Apply for Aid</span>
            </button>
          </div>
        </div>

        {/* Live Nisab Ticker Bar & Interactive Calculator Teaser */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-900/10 text-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            {/* Ticker title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-800">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Live Nisab Ticker & Market Rates
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Live Refreshed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                The minimum wealth (held for one hawl) required before Zakat becomes obligatory.
              </p>
            </div>

            {/* Standard Selector Switch */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setNisabStandard('gold')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  nisabStandard === 'gold'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Gold Standard (87.48g)</span>
              </button>
              <button
                type="button"
                onClick={() => setNisabStandard('silver')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  nisabStandard === 'silver'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Silver Standard (612.36g)</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Gold Nisab Card */}
            <div className={`p-5 rounded-xl border transition-all ${
              nisabStandard === 'gold' 
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="flex items-center space-x-1 text-amber-900 font-bold">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gold Nisab (87.48g)</span>
                </span>
                <span className="bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded text-[10px]">
                  {formatCurrency(goldPricePerGram, currency)}/g
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(goldNisabValue, currency)}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Contemporary standard recommended for investment portfolios and business assets.
              </p>
            </div>

            {/* Silver Nisab Card */}
            <div className={`p-5 rounded-xl border transition-all ${
              nisabStandard === 'silver' 
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="flex items-center space-x-1 text-slate-700 font-bold">
                  <Scale className="w-3.5 h-3.5 text-slate-500" />
                  <span>Silver Nisab (612.36g)</span>
                </span>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                  {formatCurrency(silverPricePerGram, currency)}/g
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(silverNisabValue, currency)}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Classical conservative standard in classical fiqh; maximizes benefit to the poor.
              </p>
            </div>

            {/* Live Quick Checker */}
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Quick Net Worth Check</span>
                </div>
                <div className="mt-2 relative">
                  <input
                    type="number"
                    value={quickNetWealth}
                    onChange={(e) => setQuickNetWealth(e.target.value)}
                    placeholder={`Enter your net savings (${currency})`}
                    className="w-full text-sm font-semibold bg-white border border-emerald-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                  />
                </div>
              </div>

              {quickNetWealth !== '' ? (
                <div className="mt-3 text-xs pt-2 border-t border-emerald-200/60">
                  {isEligible ? (
                    <div className="flex items-start space-x-2 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Zakat is Obligatory!</span>
                        <div className="text-[11px] text-emerald-800">
                          Est. 2.5%: <strong>{formatCurrency(estimatedZakat, currency)}</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2 text-slate-600">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">Below Nisab Cutoff</span>
                        <div className="text-[11px]">No obligatory Zakat due at this amount.</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 mt-3">
                  Type your liquid savings above or launch the multi-step calculator for exact assets & debts.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4 Pillars Trust Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">0% Admin Fee</div>
              <div className="text-xs text-emerald-200/80">Every dollar goes to recipients</div>
            </div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Ward Audited</div>
              <div className="text-xs text-emerald-200/80">Physical on-ground verification</div>
            </div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Real-Time Ledger</div>
              <div className="text-xs text-emerald-200/80">100% transparent audit log</div>
            </div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Instant Receipt</div>
              <div className="text-xs text-emerald-200/80">Fiqh certified tax certificate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
