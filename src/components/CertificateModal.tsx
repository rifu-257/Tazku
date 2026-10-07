import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Download,
  Building,
  Coins
} from 'lucide-react';
import { DonationRecord } from '../types';
import { formatCurrency } from '../lib/currency';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DonationRecord | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(record.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </span>
            <span className="text-sm font-bold text-slate-800">
              Disbursement Confirmed & Ledger Audited
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div 
          id="printable-certificate" 
          className="mt-4 p-6 sm:p-10 rounded-2xl border-4 border-double border-[#0F5132]/30 bg-gradient-to-b from-[#FAF8F5] via-white to-[#F5F2EB] relative text-slate-900 shadow-sm"
        >
          {/* Subtle Watermark emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Coins className="w-96 h-96 text-emerald-950" />
          </div>

          {/* Top Certificate Header */}
          <div className="text-center space-y-1 relative z-10">
            <div className="font-amiri text-2xl text-emerald-900 font-bold tracking-wider">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-[11px] tracking-widest uppercase text-amber-700 font-bold mt-1">
              TAZKU COMMUNITY FOUNDATION • 100% DIRECT DISBURSEMENT
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F5132] tracking-tight">
              Official Zakat Certificate & Tax Receipt
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              Receipt No: <span className="font-mono font-bold text-slate-800">{record.receiptNumber}</span>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="my-6 flex items-center justify-center space-x-3">
            <div className="h-px bg-amber-400/50 w-24"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-amber-500"></div>
            <div className="h-px bg-amber-400/50 w-24"></div>
          </div>

          {/* Main Statement */}
          <div className="text-center space-y-4 my-6 relative z-10">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
              This certifies that on <span className="text-slate-900 font-bold">{formattedDate}</span>
            </p>

            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {record.donorName}
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              has faithfully fulfilled an obligation of{' '}
              <strong className="text-emerald-900 font-bold underline decoration-amber-400">
                {record.zakatType}
              </strong>{' '}
              in accordance with Islamic jurisprudence (Fiqh) standards.
            </p>

            {/* Big Amount Card */}
            <div className="inline-block bg-white border-2 border-emerald-800/30 rounded-2xl px-8 py-4 shadow-sm">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Disbursed Amount
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F5132] mt-0.5">
                {formatCurrency(record.amount, record.currency)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Zero Commission Applied (100% Net Direct Transfer)
              </div>
            </div>

            {/* Allocated Cause */}
            <div className="pt-2 text-xs text-slate-700">
              <span className="text-slate-500">Beneficiary Allocation: </span>
              <strong className="font-bold text-slate-900">{record.caseTitle}</strong>
            </div>
          </div>

          {/* Bottom Seal & Verification Details */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            {/* QR Verification mock */}
            <div className="flex items-center space-x-3 text-left">
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-14 h-14 text-emerald-950" />
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <div className="font-bold text-slate-800">Public Ledger Verification</div>
                <div>Hash: {record.id.slice(0, 14)}...</div>
                <div className="text-emerald-700 font-semibold">100% On-Ground Audited</div>
              </div>
            </div>

            {/* Official Seal Emblem */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 bg-amber-50 flex items-center justify-center text-center p-1 shadow-inner">
                <div className="text-[9px] font-extrabold text-amber-900 uppercase leading-tight">
                  TAZKU<br />SEAL OF<br />AUDIT
                </div>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">
                Authorized Board
              </span>
            </div>
          </div>
        </div>

        {/* Modal footer CTA */}
        <div className="mt-6 flex items-center justify-end space-x-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0F5132] text-white hover:bg-[#1B4332] transition-colors"
          >
            Close & Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
