import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  UserCheck, 
  HelpCircle, 
  LifeBuoy, 
  Calendar, 
  Calculator, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  ArrowRight, 
  MoreVertical, 
  QrCode, 
  X,
  Camera,
  Coins,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface OnboardingScreenProps {
  onLogin: () => void;
  onCreateAccount: () => void;
  onOpenTracker: () => void;
  onOpenCalculator: () => void;
  onOpenArticles: () => void;
  onOpenFAQ: () => void;
  onOpenSupport: () => void;
  onSelectMahalLogin: () => void;
  onSelectVakeelLogin: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onLogin,
  onCreateAccount,
  onOpenTracker,
  onOpenCalculator,
  onOpenArticles,
  onOpenFAQ,
  onOpenSupport,
  onSelectMahalLogin,
  onSelectVakeelLogin,
}) => {
  // Top-Right Popover State
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Close popover on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Features list as required by Prompt Section 2
  const featureCards = [
    {
      id: 'tracker',
      title: 'Zakat Tracker and Money Management',
      subtitle: 'Income, expense ledger & Nisab balance tracking',
      tag: 'Financials',
      icon: Calendar,
      onClick: onOpenTracker,
    },
    {
      id: 'calculator',
      title: 'Zakat Calculator',
      subtitle: 'Dynamic gold, silver, cash & asset valuation',
      tag: 'Nisab Calculator',
      icon: Calculator,
      onClick: onOpenCalculator,
    },
    {
      id: 'faq',
      title: 'FAQ',
      subtitle: 'Common questions & instant community support',
      tag: 'Support',
      icon: MessageSquare,
      onClick: onOpenFAQ,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBFBF9] px-6 py-7 min-h-screen relative font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & TOP-RIGHT MENU POPOVER                                        */}
      {/* ========================================================================= */}
      <div className="relative pt-2">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Bold Typography */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1B4332] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              T
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-extrabold tracking-tight text-[#112A20] font-sans">
                Tazku<span className="text-[#40916C]">.</span>
              </span>
            </div>
          </div>

          {/* Right: Header Action Area */}
          <div className="relative flex items-center gap-1.5">
            {/* Interactive Action Popover */}
            {isPopoverOpen && (
              <>
                {/* Backdrop dismiss overlay */}
                <div 
                  className="fixed inset-0 z-40 bg-black/10 backdrop-blur-2xs"
                  onClick={() => setIsPopoverOpen(false)}
                />

                {/* Floating white card with rounded-2xl and soft drop shadow */}
                <div className="absolute right-0 top-12 z-50 w-60 bg-white rounded-2xl shadow-xl border border-[#EBE5D8] p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#526059] uppercase tracking-wider">
                    Institutional Portals
                  </div>

                  {/* 1. Mahal Login */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onSelectMahalLogin();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#E9F3ED] text-[#1B4332] flex items-center gap-3 transition text-left group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E9F3ED] group-hover:bg-[#d8ebe0] text-[#1B4332] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-[#112A20]">
                        Mahal Login
                      </span>
                      <span className="text-[10px] text-[#526059] block leading-tight mt-0.5">
                        Mahallu Committee Portal
                      </span>
                    </div>
                  </button>

                  {/* 2. Vakeel Login */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onSelectVakeelLogin();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#E9F3ED] text-[#1B4332] flex items-center gap-3 transition text-left group mt-0.5 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E9F3ED] group-hover:bg-[#d8ebe0] text-[#1B4332] flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-[#112A20]">
                        Vakeel Login
                      </span>
                      <span className="text-[10px] text-[#526059] block leading-tight mt-0.5">
                        Authorized Vakeel Portal
                      </span>
                    </div>
                  </button>

                  {/* 3. Thin Divider Line */}
                  <div className="my-1.5 border-t border-[#EBE5D8]" />

                  {/* 4. Help and Support */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onOpenSupport();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-[#E9F3ED] text-[#1B4332] flex items-center gap-3 transition text-left group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E9F3ED] group-hover:bg-[#d8ebe0] text-[#1B4332] flex items-center justify-center shrink-0">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-[#112A20]">
                        Help and Support
                      </span>
                      <span className="text-[10px] text-[#526059] block leading-tight mt-0.5">
                        FAQ & Customer Assistance
                      </span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2. Hero Tagline */}
        <div className="mt-6 mb-4">
          <p className="text-sm sm:text-base font-extrabold text-[#1B4332] leading-snug">
            A Zakat Calculation, Collection and Allocation Innovation.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN PAGE CONTENT: FEATURE OVERVIEW CARDS                              */}
      {/* ========================================================================= */}
      <div className="space-y-3 flex-1 my-3">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={card.onClick}
              className="w-full bg-white hover:bg-[#F3EFE6]/40 border border-[#EBE5D8] hover:border-[#40916C]/60 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                {/* Soft mint squircle icon with vibrant hover transition */}
                <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] group-hover:bg-[#1B4332] text-[#1B4332] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs group-hover:scale-105">
                  <Icon className="w-5 h-5 transition-transform duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-[#112A20] group-hover:text-[#1B4332] transition-colors leading-tight truncate">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#526059] group-hover:text-[#112A20] transition-colors line-clamp-1 leading-snug">
                    {card.subtitle}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F3EFE6] group-hover:bg-[#E9F3ED] flex items-center justify-center transition-colors text-[#526059] group-hover:text-[#1B4332] shrink-0">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM AUTHENTICATION CONTROLS                                         */}
      {/* ========================================================================= */}
      <div className="mt-4 space-y-3">
        {/* Primary Button: "Login" (Solid Deep Emerald #1B4332 with white text, rounded-2xl) */}
        <button
          type="button"
          onClick={onLogin}
          className="w-full py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Button: "Create Account" (White background, emerald border and text, rounded-2xl) */}
        <button
          type="button"
          onClick={onCreateAccount}
          className="w-full py-3.5 bg-white hover:bg-[#F3EFE6] text-[#1B4332] border-2 border-[#1B4332] rounded-2xl font-bold text-sm transition cursor-pointer"
        >
          Create Account
        </button>


        {/* Legal Disclaimer */}
        <div className="pt-2 text-center">
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
            By continuing, you acknowledge and agree to abide by our{' '}
            <span 
              onClick={onOpenArticles}
              className="text-gray-600 font-semibold underline cursor-pointer"
            >
              Terms of Service
            </span>{' '}
            and{' '}
            <span 
              onClick={onOpenArticles}
              className="text-gray-600 font-semibold underline cursor-pointer"
            >
              Privacy Policy
            </span>.
          </p>
        </div>
      </div>

      {/* QR Scanner Interactive Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#EBE5D8] pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#1B4332]" />
                <h3 className="font-bold text-sm text-[#112A20]">Scan Mahallu QR Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQRScanner(false)}
                className="w-7 h-7 rounded-full bg-[#F3EFE6] text-[#526059] hover:bg-[#EBE5D8] flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Viewfinder Preview Simulation */}
            <div className="relative aspect-square w-full bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white p-4">
              <div className="w-48 h-48 border-2 border-[#40916C] rounded-xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#40916C] -mt-0.5 -ml-0.5"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#40916C] -mt-0.5 -mr-0.5"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#40916C] -mb-0.5 -ml-0.5"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#40916C] -mb-0.5 -mr-0.5"></div>
                <div className="w-full h-0.5 bg-[#40916C] shadow-[0_0_8px_#40916C] animate-bounce"></div>
              </div>
              <p className="text-[11px] text-gray-300 mt-4 text-center">
                Point camera at your Mahallu Council or Beneficiary QR
              </p>
            </div>

            {/* Simulated QR Action */}
            <button
              type="button"
              onClick={() => {
                setScannedResult("Juma Masjid Central Ward #3 (Verified)");
                setTimeout(() => {
                  setShowQRScanner(false);
                  onLogin();
                }, 1000);
              }}
              className="w-full py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4" />
              <span>Simulate Scan Mahallu QR</span>
            </button>

            {scannedResult && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold">
                ✓ Detected: {scannedResult}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
