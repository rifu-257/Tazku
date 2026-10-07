import React from 'react';
import { ShieldCheck, HeartHandshake, Coins, FileText, Scale } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B301E] text-slate-300 border-t border-emerald-900/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F5132] to-[#1B4332] flex items-center justify-center border border-amber-400/40">
                <Coins className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-xl font-extrabold text-white">Tazku</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold">
                تزكوا
              </span>
            </div>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Empowering communities through transparent, verified, and dignified Zakat calculations and 100% zero-commission direct disbursement.
            </p>
            <div className="text-[11px] text-amber-300/90 font-medium">
              Zero platform commissions • Zero middlemen
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform Modules</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('overview')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Live Nisab & Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Smart Zakat Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('causes')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Verified Recipient Causes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('transparency')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Public Transparency Ledger
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('apply')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Apply for Ward Aid
                </button>
              </li>
            </ul>
          </div>

          {/* Quranic Reference */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quranic Mandate (9:60)</h4>
            <div className="font-amiri text-sm text-amber-200/90 leading-relaxed">
              إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ
            </div>
            <p className="text-[11px] text-emerald-100/60 leading-relaxed">
              "Zakat expenditures are only for the poor and for the needy and for those employed to collect [zakat]..." (At-Tawbah 9:60)
            </p>
          </div>

          {/* Mahallu Auditing & Governance */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Community Ward Governance</h4>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed">
              Tazku is governed jointly by grassroots Mahallu committees, local medical clinics, and audited Islamic scholars to ensure 100% compliance with Shariah and civil welfare regulations.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-amber-300 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Cryptographically Verifiable Receipts</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-900/60 text-center text-[11px] text-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} Tazku Community Protocol. Fiqh Compliant & Open Source for Hackathon Demo.
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Google Cloud & Firebase</span>
            <span>•</span>
            <span>100% Non-Profit Community Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
