import React from 'react';
import { 
  BarChart3, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Building2, 
  Download, 
  CheckCircle2 
} from 'lucide-react';

interface ZakkuStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadReport: () => void;
}

export const ZakkuStatsModal: React.FC<ZakkuStatsModalProps> = ({
  isOpen,
  onClose,
  onDownloadReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 border border-[#E2ECE9] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#E8F6F3] text-[#0D7C66] rounded-xl font-bold">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Mahallu Community Metrics</h2>
              <span className="text-[10px] text-[#0D7C66] font-semibold">100% Public Audit Trail</span>
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

        {/* Big numbers */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20">
            <span className="text-[10px] text-[#0D7C66] font-bold block">Total Disbursed</span>
            <div className="text-lg font-mono font-extrabold text-gray-900 mt-0.5">₹1.38 Cr</div>
            <span className="text-[9px] text-gray-500">100% to verified claimants</span>
          </div>

          <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-600 font-bold block">Admin Commission</span>
            <div className="text-lg font-mono font-extrabold text-[#0D7C66] mt-0.5">0.00%</div>
            <span className="text-[9px] text-gray-500">Zero deductions</span>
          </div>

          <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-600 font-bold block">Families Aided</span>
            <div className="text-lg font-mono font-extrabold text-gray-900 mt-0.5">482</div>
            <span className="text-[9px] text-gray-500">Across 28 wards</span>
          </div>

          <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-600 font-bold block">Active Committees</span>
            <div className="text-lg font-mono font-extrabold text-gray-900 mt-0.5">28</div>
            <span className="text-[9px] text-gray-500">Grassroots Mahallu councils</span>
          </div>
        </div>

        {/* Verification guarantee */}
        <div className="p-3 bg-white rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <ShieldCheck className="w-4 h-4 text-[#0D7C66]" />
            <span>Mahallu Fiqh Governance</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Every disbursement is audited against local bank statements, hospital invoices, and utility accounts to preserve total integrity.
          </p>
        </div>

        <button
          type="button"
          onClick={onDownloadReport}
          className="w-full py-3 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Verified Community Audit Report</span>
        </button>
      </div>
    </div>
  );
};
