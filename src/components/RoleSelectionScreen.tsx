import React from 'react';
import { 
  Building2, 
  User, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface RoleSelectionScreenProps {
  onBack?: () => void;
  onSelectRole: (role: 'personal' | 'mahal') => void;
  onOpenOverview?: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onBack,
  onSelectRole,
  onOpenOverview,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-7 min-h-screen font-sans animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0D7C66] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              T
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Tazku<span className="text-[#0D7C66]">.</span>
            </span>
          </div>
        </div>

        {/* Title & Brand Tagline */}
        <div className="mt-7 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tazku Login
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#0D7C66] mt-1.5 max-w-xs mx-auto leading-snug">
            A Zakat Calculation, Collection and Allocation Innovation.
          </p>
          <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Please choose whether you want to access the official Mahallu portal or your Personal account.
          </p>
        </div>

        {/* The Two Login Options: Mahal Login & Personal Login */}
        <div className="space-y-4 mt-6">
          {/* OPTION 1: MAHAL LOGIN */}
          <button
            type="button"
            onClick={() => onSelectRole('mahal')}
            className="w-full bg-[#F8FAF9] hover:bg-[#E8F6F3]/50 border-2 border-[#E2ECE9] hover:border-[#0D7C66]/50 rounded-3xl p-5 text-left transition-all duration-200 group shadow-xs hover:shadow-md relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0D7C66] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-gray-900 group-hover:text-[#0D7C66] transition-colors">
                    Mahal Login
                  </h2>
                  <span className="text-[10px] font-bold bg-[#0D7C66] text-white px-2 py-0.5 rounded-full">
                    Official Portal
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  For Mahallu Committee Trustees, Mosque Imams & Ward Administrators.
                </p>
                
              </div>
              <div className="self-center">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#0D7C66] group-hover:text-white group-hover:border-[#0D7C66] transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </button>

          {/* OPTION 2: PERSONAL LOGIN */}
          <button
            type="button"
            onClick={() => onSelectRole('personal')}
            className="w-full bg-[#F8FAF9] hover:bg-[#E8F6F3]/50 border-2 border-[#E2ECE9] hover:border-[#0D7C66]/50 rounded-3xl p-5 text-left transition-all duration-200 group shadow-xs hover:shadow-md relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F6F3] text-[#0D7C66] border border-[#0D7C66]/20 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-gray-900 group-hover:text-[#0D7C66] transition-colors">
                    Personal Login
                  </h2>
                  <span className="text-[10px] font-bold bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-full border border-[#0D7C66]/20">
                    Individual Contributor
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  For Individual Donors, Wealth Trackers & Community Zakat Payers.
                </p>
                
              </div>
              <div className="self-center">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#0D7C66] group-hover:text-white group-hover:border-[#0D7C66] transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Trust Footer & Optional Overview Link */}
      <div className="mt-8 pt-4 border-t border-gray-100 text-center space-y-2">
        {onOpenOverview && (
          <button
            type="button"
            onClick={onOpenOverview}
            className="text-xs text-[#0D7C66] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Explore Tazku Calculator, Articles & FAQ</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#0D7C66]" />
          <span>Verified Mahallu Shariah Network • 100% Direct Local Aid</span>
        </div>
      </div>
    </div>
  );
};
