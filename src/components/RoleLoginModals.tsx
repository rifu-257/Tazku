import React, { useState } from 'react';
import { Building2, UserCheck, X, Lock, CheckCircle2, ShieldCheck, Key } from 'lucide-react';

interface RoleLoginModalProps {
  type: 'mahal' | 'vakeel' | null;
  onClose: () => void;
  onSuccess: (roleName: string) => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  type,
  onClose,
  onSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!type) return null;

  const isMahal = type === 'mahal';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !pin) {
      setErrorMsg('Please enter both your registered ID and security PIN');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(isMahal ? `Mahallu Committee Representative (${identifier})` : `Authorized Vakeel (${identifier})`);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl border border-[#EBE5D8] animate-in slide-in-from-bottom-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#EBE5D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center">
              {isMahal ? <Building2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#112A20]">
                {isMahal ? 'Mahal Committee Portal' : 'Vakeel Agent Portal'}
              </h3>
              <span className="text-[10px] text-[#40916C] font-semibold">
                Authorized Personnel Access
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3EFE6] text-[#526059] hover:text-[#112A20] flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#526059] mb-1">
              {isMahal ? 'Mahallu Registration Code / Ward ID' : 'Certified Vakeel ID Number'}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isMahal ? 'e.g. JMH-WARD-03' : 'e.g. VK-2024-09'}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-bold text-[#112A20] focus:bg-white focus:border-[#40916C] focus:outline-hidden focus:ring-1 focus:ring-[#40916C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#526059] mb-1">
              Secret Security PIN / Passcode
            </label>
            <input
              type="password"
              required
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-bold tracking-widest text-[#112A20] focus:bg-white focus:border-[#40916C] focus:outline-hidden focus:ring-1 focus:ring-[#40916C]"
            />
          </div>

          {errorMsg && (
            <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="p-2.5 bg-[#E9F3ED] rounded-xl text-[11px] text-[#1B4332] flex items-center gap-2 border border-[#40916C]/20">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#40916C]" />
            <span>Encrypted End-to-End Shariah Audit Verification</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Verifying Credentials...' : `Log In as ${isMahal ? 'Mahal Council' : 'Vakeel'}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
