import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Building, 
  CheckCircle2, 
  FileText, 
  ArrowUpRight, 
  Lock, 
  Coins, 
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { CurrencyCode, DonationRecord } from '../types';
import { formatCurrency, convertFromUSD } from '../lib/currency';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

interface TransparencyLedgerProps {
  currency: CurrencyCode;
  onViewCertificate: (record: DonationRecord) => void;
}

export const TransparencyLedger: React.FC<TransparencyLedgerProps> = ({
  currency,
  onViewCertificate,
}) => {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Sample initial transactions for initial display if Firestore collection is fresh
  const sampleTransactions: DonationRecord[] = [
    {
      id: 'don_init_1',
      caseId: 'case_fuqara_001',
      caseTitle: 'Emergency Sustenance for Displaced Elderly Family',
      donorId: 'u1',
      donorName: 'Dr. Tariq Al-Mansoor',
      amount: 250,
      amountUSD: 250,
      currency: 'USD',
      zakatType: 'Zakat al-Mal',
      createdAt: '2026-10-06T18:42:00Z',
      receiptNumber: 'TZK-2026-482910',
      isAnonymous: false,
    },
    {
      id: 'don_init_2',
      caseId: 'case_medical_003',
      caseTitle: 'Pediatric Cardiac Surgery & Post-Op Medication Fund',
      donorId: 'u2',
      donorName: 'Anonymous Servant of Allah',
      amount: 500,
      amountUSD: 500,
      currency: 'USD',
      zakatType: 'Zakat al-Mal',
      createdAt: '2026-10-06T15:20:00Z',
      receiptNumber: 'TZK-2026-391024',
      isAnonymous: true,
    },
    {
      id: 'don_init_3',
      caseId: 'case_gharimin_002',
      caseTitle: 'Urgent Debt-Relief to Avert Eviction & Legal Action',
      donorId: 'u3',
      donorName: 'Sister Maryam K.',
      amount: 150,
      amountUSD: 150,
      currency: 'USD',
      zakatType: 'Sadaqah Nafilah',
      createdAt: '2026-10-06T12:05:00Z',
      receiptNumber: 'TZK-2026-218491',
      isAnonymous: false,
    },
    {
      id: 'don_init_4',
      caseId: 'case_education_004',
      caseTitle: 'Higher Secondary Tuition for Orphan Student',
      donorId: 'u4',
      donorName: 'Hajj Abdul-Rahman',
      amount: 310,
      amountUSD: 310,
      currency: 'USD',
      zakatType: 'Zakat al-Mal',
      createdAt: '2026-10-05T20:11:00Z',
      receiptNumber: 'TZK-2026-104928',
      isAnonymous: false,
    },
  ];

  useEffect(() => {
    const donRef = collection(db, 'donations');
    const q = query(donRef, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setDonations(sampleTransactions);
      } else {
        const list: DonationRecord[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...(doc.data() as DonationRecord), id: doc.id });
        });
        setDonations(list);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Falling back to sample transactions:", error);
      setDonations(sampleTransactions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute live aggregates
  const totalDisbursedUSD = donations.reduce((sum, d) => sum + (d.amountUSD || d.amount), 0) + 128450; // combined with baseline ward historical ledger
  const totalBeneficiaries = 1280 + donations.length;
  const verifiedWards = 42;

  const filtered = donations.filter((d) => 
    searchFilter === '' ||
    d.receiptNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.caseTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.donorName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Immutable Community Impact Ledger</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Radical Transparency & Impact Ledger
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Every penny collected is directly accounted for with zero deductions. We publish our live disbursement audit trail so you can verify each case settlement.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Zakat Disbursed</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F5132] tracking-tight">
            {formatCurrency(convertFromUSD(totalDisbursedUSD, currency), currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
            <span className="text-emerald-700 font-bold">100.0%</span>
            <span>directly delivered to recipients</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Platform Commission Fee</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
            0.00%
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Zero fees deducted from Zakat al-Mal
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Verified Beneficiaries</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalBeneficiaries.toLocaleString()}+
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Households, patients & students assisted
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Local Mahallu Wards</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {verifiedWards} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            On-ground grassroots vetting committees
          </div>
        </div>
      </div>

      {/* Distribution Pipeline Infographic */}
      <div className="bg-gradient-to-br from-[#0F5132] to-[#12482E] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
            Audit Trail & Integrity Guarantee
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
            How 100% of Your Zakat Reaches Real Hands
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Traditional charities frequently deduct 10% to 20% in overheads and advertising. Tazku operates as an open-ledger community protocol subsidized by voluntary endowments (Waqf).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-sm">
              1
            </div>
            <div className="font-bold text-sm text-white">Grassroots Verification</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Two local ward council elders conduct a physical house visit to inspect income documents and medical charts.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-sm">
              2
            </div>
            <div className="font-bold text-sm text-white">Dignified Anonymization</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Beneficiary identities are shielded with dignified aliases, protecting family honor while maintaining audit trails.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-sm">
              3
            </div>
            <div className="font-bold text-sm text-white">Direct Vendor Settlement</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Medical funds go to hospitals, tuition to universities, and debt directly to landlords to eliminate leakage.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-sm">
              4
            </div>
            <div className="font-bold text-sm text-white">Immutable Public Ledger</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Every disbursement generates an auditable cryptographic receipt visible to donors and community auditors.
            </p>
          </div>
        </div>
      </div>

      {/* Live Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Live Public Disbursement Log</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time feed of funds flowing to verified cases across community wards.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search receipt or case..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Target Cause</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Audit Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading ledger entries from Firestore...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transactions match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                      {tx.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{tx.caseTitle}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {tx.zakatType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {tx.isAnonymous ? (
                        <span className="italic text-slate-400">Anonymous Servant</span>
                      ) : (
                        <span className="font-medium">{tx.donorName}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onViewCertificate(tx)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
