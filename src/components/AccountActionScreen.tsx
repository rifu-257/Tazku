import React from 'react';
import { 
  ArrowLeft, 
  LogIn, 
  UserPlus, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

interface AccountActionScreenProps {
  role: 'personal' | 'mahal';
  onBack: () => void;
  onSelectAction: (action: 'login' | 'signup') => void;
}

export const AccountActionScreen: React.FC<AccountActionScreenProps> = ({
  role,
  onBack,
  onSelectAction,
}) => {
  const isMahal = role === 'mahal';

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBFBF9] px-6 py-7 min-h-screen font-sans animate-in fade-in duration-200">
      <div>
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#F3EFE6] text-[#1B4332] hover:bg-[#EBE5D8] flex items-center justify-center transition shadow-2xs border border-[#EBE5D8] cursor-pointer"
            title="Back to Login Selection"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1B4332]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1B4332] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              T
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#112A20]">
              Tazku<span className="text-[#40916C]">.</span>
            </span>
          </div>

          <div className="w-10" /> {/* Spacer for balanced header */}
        </div>

        {/* Role Badge & Portal Title */}
        <div className="mt-8 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112A20] tracking-tight">
            {isMahal ? 'Mahal Login' : 'Personal Login'}
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] mt-2 max-w-xs mx-auto leading-relaxed">
            {isMahal
              ? 'Access local jurisdiction fund records, claimants & Zakat applications.'
              : 'Calculate your Nisab, track funds and donate directly to verified local causes.'}
          </p>
        </div>

        {/* The Two Options: Login and Create Account */}
        <div className="space-y-4 mt-6">
          {/* OPTION 1: LOGIN */}
          <button
            type="button"
            onClick={() => onSelectAction('login')}
            className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-3xl p-5 text-left transition group shadow-md hover:shadow-lg relative overflow-hidden flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition">
                <LogIn className="w-6 h-6" />
              </div>
              <div className="pr-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white">
                    Login
                  </h2>
                  <span className="text-[10px] font-bold bg-[#F3EFE6] text-[#1B4332] px-2.5 py-0.5 rounded-full">
                    Existing
                  </span>
                </div>
                <p className="text-xs text-[#E9F3ED] mt-1 leading-relaxed">
                  Sign in with your registered email and password credentials.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* OPTION 2: CREATE ACCOUNT */}
          <button
            type="button"
            onClick={() => onSelectAction('signup')}
            className="w-full bg-white hover:bg-[#F3EFE6]/40 border-2 border-[#EBE5D8] hover:border-[#40916C] rounded-3xl p-5 text-left transition group shadow-xs hover:shadow-md relative overflow-hidden flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center shrink-0 border border-[#40916C]/20 group-hover:scale-105 transition">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="pr-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-[#112A20] group-hover:text-[#1B4332] transition">
                    Create Account
                  </h2>
                  <span className="text-[10px] font-bold bg-[#F3EFE6] text-[#2D6A4F] px-2.5 py-0.5 rounded-full border border-[#EBE5D8]">
                    New User
                  </span>
                </div>
                <p className="text-xs text-[#526059] mt-1 leading-relaxed">
                  {isMahal
                    ? 'Register your local Mahallu Committee & assign administrative trustees.'
                    : 'Create a new personal contributor profile in under 2 minutes.'}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F3EFE6] border border-[#EBE5D8] text-[#40916C] group-hover:bg-[#1B4332] group-hover:text-white transition flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Trust & Security Footnote */}
      <div className="mt-8 pt-4 border-t border-[#EBE5D8] text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-[#526059] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#40916C]" />
          <span>256-bit SSL Secure Auth • Verified Shariah Compliance</span>
        </div>
      </div>
    </div>
  );
};
