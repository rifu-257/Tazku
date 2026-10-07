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
      icon: Calendar,
      onClick: onOpenTracker,
    },
    {
      id: 'calculator',
      title: 'Zakat Calculator',
      icon: Calculator,
      onClick: onOpenCalculator,
    },
    {
      id: 'articles',
      title: 'Zakat related Articles',
      icon: FileText,
      onClick: onOpenArticles,
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: MessageSquare,
      onClick: onOpenFAQ,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-7 min-h-screen relative font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & TOP-RIGHT MENU POPOVER                                        */}
      {/* ========================================================================= */}
      <div className="relative pt-2">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Bold Typography */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0D7C66] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              T
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 font-sans">
                Tazku<span className="text-[#0D7C66]">.</span>
              </span>
            </div>
          </div>

          {/* Right: Top-Right Scanner/Menu Action Button */}
          <div className="relative flex items-center gap-1.5">
            {/* Quick QR Scanner Icon Shortcut */}
            <button
              type="button"
              onClick={() => setShowQRScanner(true)}
              className="w-10 h-10 rounded-full bg-[#E8F6F3] text-[#0D7C66] hover:bg-[#d8efe9] flex items-center justify-center transition shadow-2xs"
              title="Scan QR Code"
              aria-label="Scan QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Menu Popover Trigger Button */}
            <button
              type="button"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                isPopoverOpen 
                  ? 'bg-[#0D7C66] text-white shadow-md' 
                  : 'bg-[#E8F6F3] text-[#0D7C66] hover:bg-[#d8efe9] shadow-2xs'
              }`}
              title="Role Portals & Menu"
              aria-label="Open portal options menu"
              aria-expanded={isPopoverOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Interactive Action Popover (Anchored to top-right button) */}
            {isPopoverOpen && (
              <>
                {/* Backdrop dismiss overlay */}
                <div 
                  className="fixed inset-0 z-40 bg-black/10 backdrop-blur-2xs"
                  onClick={() => setIsPopoverOpen(false)}
                />

                {/* Floating white card with rounded-2xl and soft drop shadow */}
                <div className="absolute right-0 top-12 z-50 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Institutional Portals
                  </div>

                  {/* 1. Mahal Login */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onSelectMahalLogin();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#E8F6F3] text-[#0D7C66] flex items-center gap-3 transition text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E8F6F3] group-hover:bg-[#d5ece6] text-[#0D7C66] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-[#0D7C66]">
                        Mahal Login
                      </span>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
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
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#E8F6F3] text-[#0D7C66] flex items-center gap-3 transition text-left group mt-0.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E8F6F3] group-hover:bg-[#d5ece6] text-[#0D7C66] flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-[#0D7C66]">
                        Vakeel Login
                      </span>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                        Authorized Vakeel Portal
                      </span>
                    </div>
                  </button>

                  {/* 3. Thin Divider Line */}
                  <div className="my-1.5 border-t border-gray-100" />

                  {/* 4. Help and Support */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      onOpenSupport();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-[#E8F6F3] text-[#0D7C66] flex items-center gap-3 transition text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E8F6F3] group-hover:bg-[#d5ece6] text-[#0D7C66] flex items-center justify-center shrink-0">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-[#0D7C66]">
                        Help and Support
                      </span>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
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
          <p className="text-sm sm:text-base font-extrabold text-[#0D7C66] leading-snug">
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
              className="w-full bg-[#F8FAF9] hover:bg-[#E8F6F3]/60 border border-gray-100 rounded-2xl p-4 flex items-center justify-between transition group text-left shadow-2xs hover:border-[#0D7C66]/30"
            >
              <div className="flex items-center gap-3.5">
                {/* Soft mint-circle icon background */}
                <div className="w-11 h-11 rounded-full bg-[#E8F6F3] text-[#0D7C66] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0D7C66] transition leading-tight">
                    {card.title}
                  </h3>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    Tap to explore instant tools & guides
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D7C66] group-hover:translate-x-0.5 transition shrink-0" />
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM AUTHENTICATION CONTROLS                                         */}
      {/* ========================================================================= */}
      <div className="mt-4 space-y-3">
        {/* Primary Button: "Login" (Solid teal #0D7C66 with white text, rounded-2xl) */}
        <button
          type="button"
          onClick={onLogin}
          className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Button: "Create Account" (White background, teal border and text, rounded-2xl) */}
        <button
          type="button"
          onClick={onCreateAccount}
          className="w-full py-3.5 bg-white hover:bg-[#E8F6F3]/30 text-[#0D7C66] border-2 border-[#0D7C66] rounded-2xl font-bold text-sm transition"
        >
          Create Account
        </button>

        {/* Quick Institutional Role Access Notice */}
        <div className="text-center pt-1">
          <span className="text-[11px] text-gray-500">
            Mahallu Committee or Certified Vakeel? Use the{' '}
            <button
              type="button"
              onClick={() => setIsPopoverOpen(true)}
              className="text-[#0D7C66] font-bold underline hover:text-[#0A6654]"
            >
              top-right menu
            </button>{' '}
            to sign in.
          </span>
        </div>

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
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#0D7C66]" />
                <h3 className="font-bold text-sm text-gray-900">Scan Mahallu QR Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQRScanner(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Viewfinder Preview Simulation */}
            <div className="relative aspect-square w-full bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white p-4">
              <div className="w-48 h-48 border-2 border-[#0D7C66] rounded-xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 -mt-0.5 -ml-0.5"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 -mt-0.5 -mr-0.5"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 -mb-0.5 -ml-0.5"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 -mb-0.5 -mr-0.5"></div>
                <div className="w-full h-0.5 bg-emerald-400/80 shadow-[0_0_8px_#34d399] animate-bounce"></div>
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
              className="w-full py-2.5 bg-[#0D7C66] text-white rounded-full font-bold text-xs hover:bg-[#0A6654] transition flex items-center justify-center gap-1.5"
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
