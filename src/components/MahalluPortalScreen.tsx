import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Users, 
  ArrowLeft, 
  Download, 
  PlusCircle, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Send,
  LogOut,
  MapPin,
  Check
} from 'lucide-react';

interface ClaimantReviewItem {
  id: string;
  name: string;
  ward: string;
  category: string;
  amountRequested: number;
  familyMembers: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'More Info Needed';
  reason: string;
  documents: string[];
  appliedDate: string;
  reviewNote?: string;
}

interface FundLedgerEntry {
  id: string;
  sourceType: 'Own Mahallu' | 'Naqlu Zakat (Inward)';
  donorName: string;
  originWard: string;
  amount: number;
  zakatType: string;
  date: string;
  receiptNumber: string;
}

interface DisbursementRecord {
  id: string;
  beneficiaryName: string;
  category: string;
  amount: number;
  disbursedDate: string;
  method: string;
  signatory: string;
  receiptId: string;
}

interface MahalluPortalScreenProps {
  onBackToHome: () => void;
  onSwitchRole: (role: 'donor' | 'vakeel') => void;
}

export const MahalluPortalScreen: React.FC<MahalluPortalScreenProps> = ({
  onBackToHome,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'claimants' | 'ledger' | 'disbursements' | 'certify'>('claimants');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // 1. Claimants Review List
  const [claimants, setClaimants] = useState<ClaimantReviewItem[]>([
    {
      id: 'CLM-01',
      name: 'Sister Zainaba & 3 Dependents',
      ward: 'Ward 3, Noor Street',
      category: 'Al-Fuqara',
      amountRequested: 20000,
      familyMembers: 4,
      status: 'Pending',
      reason: 'Husband passed away due to cardiac failure. Immediate rent arrears and essential groceries support.',
      documents: ['Medical Discharge Summary', 'Ration Card BPL', 'Ward Council Verification Letter'],
      appliedDate: 'Yesterday',
    },
    {
      id: 'CLM-02',
      name: 'Muhammad Basheer K.',
      ward: 'Ward 2, Old Market Lane',
      category: 'Al-Gharimin',
      amountRequested: 35000,
      familyMembers: 5,
      status: 'Pending',
      reason: 'Small stationery stall suffered flash flood damage. Supplier debt due this month.',
      documents: ['Shop Rental Agreement', 'Supplier Invoice Challans', 'Local Mahallu Inspection Form'],
      appliedDate: '3 days ago',
    },
    {
      id: 'CLM-03',
      name: 'Khadija P. (Orphan Student)',
      ward: 'Ward 3, East Crescent',
      category: 'Al-Masakin',
      amountRequested: 12000,
      familyMembers: 2,
      status: 'Approved',
      reason: 'Final year Bachelor of Science semester fees challan and laboratory instrument deposit.',
      documents: ['College Admission Fee Slip', 'Orphan Care Registration'],
      appliedDate: '1 week ago',
      reviewNote: 'Approved in executive committee meeting on Oct 03. Disbursed via education voucher.',
    },
    {
      id: 'CLM-04',
      name: 'Abdul Rasheed (Wheelchair Patient)',
      ward: 'Ward 1, Hilltop Road',
      category: 'Al-Fuqara',
      amountRequested: 18000,
      familyMembers: 3,
      status: 'More Info Needed',
      reason: 'Monthly insulin medication and specialized therapy consultation costs.',
      documents: ['Prescription Copy'],
      appliedDate: '5 days ago',
      reviewNote: 'Requested government pharmacy subsidy confirmation passbook.',
    },
  ]);

  // Review Modal State
  const [selectedReviewClaimant, setSelectedReviewClaimant] = useState<ClaimantReviewItem | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  // 2. Fund Ledger List
  const [ledgerEntries] = useState<FundLedgerEntry[]>([
    {
      id: 'LED-001',
      sourceType: 'Own Mahallu',
      donorName: 'Br. Tariq Mansoor',
      originWard: 'Ward 3 (Resident)',
      amount: 45000,
      zakatType: 'Zakat al-Mal (Gold & Cash)',
      date: 'Today, 11:20 AM',
      receiptNumber: 'TZK-LED-9821',
    },
    {
      id: 'LED-002',
      sourceType: 'Naqlu Zakat (Inward)',
      donorName: 'Anonymous Contributor (UAE NRI)',
      originWard: 'Dubai -> Ward 3 Allocation',
      amount: 50000,
      zakatType: 'Zakat al-Mal (Annual Savings)',
      date: 'Yesterday, 04:30 PM',
      receiptNumber: 'TZK-LED-9818',
    },
    {
      id: 'LED-003',
      sourceType: 'Own Mahallu',
      donorName: 'Hajjia Mariyam K.',
      originWard: 'Ward 3 (North Block)',
      amount: 28000,
      zakatType: 'Zakat al-Mal (Commercial Stock)',
      date: 'Oct 04, 2026',
      receiptNumber: 'TZK-LED-9804',
    },
    {
      id: 'LED-004',
      sourceType: 'Naqlu Zakat (Inward)',
      donorName: 'Dr. Faisal & Family',
      originWard: 'Kochi Mahallu Network -> Ward 3',
      amount: 35000,
      zakatType: 'Naqlu Zakat Relief Pool',
      date: 'Oct 02, 2026',
      receiptNumber: 'TZK-LED-9799',
    },
  ]);

  // 3. Disbursements
  const [disbursements] = useState<DisbursementRecord[]>([
    {
      id: 'DSB-101',
      beneficiaryName: 'Sister Fatima & 3 Children',
      category: 'Al-Fuqara',
      amount: 18000,
      disbursedDate: 'Oct 05, 2026',
      method: 'Direct Bank Settlement (Account Payee)',
      signatory: 'Imam & Mahallu Secretary',
      receiptId: 'DISB-2026-081',
    },
    {
      id: 'DSB-102',
      beneficiaryName: 'Khadija P. (Orphan Student)',
      category: 'Al-Masakin (Education Aid)',
      amount: 12000,
      disbursedDate: 'Oct 04, 2026',
      method: 'College Institutional Fee Challan',
      signatory: 'Education Subcommittee Convener',
      receiptId: 'DISB-2026-079',
    },
    {
      id: 'DSB-103',
      beneficiaryName: 'Elderly Household (Urgent Grains)',
      category: 'Al-Fuqara',
      amount: 9600,
      disbursedDate: 'Oct 02, 2026',
      method: 'Quarterly Mahallu Ration Card Stamp',
      signatory: 'Ward 3 Relief Trustee',
      receiptId: 'DISB-2026-072',
    },
  ]);

  // 4. Certify Application Form State
  const [certifyForm, setCertifyForm] = useState({
    name: '',
    wardNumber: 'Ward 3',
    nationalId: '',
    category: 'Al-Fuqara',
    incomeMonthly: '',
    requestedAmount: '',
    investigator: 'Hafiz Usman (Ward Field Auditor)',
    notes: '',
  });
  const [certifySuccess, setCertifySuccess] = useState(false);

  // Status Action Handlers
  const handleUpdateStatus = (id: string, newStatus: ClaimantReviewItem['status'], note?: string) => {
    setClaimants(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          reviewNote: note || c.reviewNote,
        };
      }
      return c;
    }));
    setSelectedReviewClaimant(null);
    setReviewNoteInput('');
  };

  const handleCertifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certifyForm.name || !certifyForm.requestedAmount) return;

    const newClaimant: ClaimantReviewItem = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      name: certifyForm.name,
      ward: `${certifyForm.wardNumber}, Mahallu Registry`,
      category: certifyForm.category,
      amountRequested: parseFloat(certifyForm.requestedAmount) || 15000,
      familyMembers: 3,
      status: 'Approved',
      reason: certifyForm.notes || 'Verified by Ward Field Investigator.',
      documents: ['Ward Field Verification Certificate', 'Trustee Signed Challan'],
      appliedDate: 'Just now (Direct Certified)',
      reviewNote: `Directly certified by ${certifyForm.investigator}. Priority queue updated.`,
    };

    setClaimants(prev => [newClaimant, ...prev]);
    setCertifySuccess(true);
    setCertifyForm({
      name: '',
      wardNumber: 'Ward 3',
      nationalId: '',
      category: 'Al-Fuqara',
      incomeMonthly: '',
      requestedAmount: '',
      investigator: 'Hafiz Usman (Ward Field Auditor)',
      notes: '',
    });
    setTimeout(() => setCertifySuccess(false), 3000);
  };

  // Calculations
  const ownMahalluTotal = ledgerEntries
    .filter(e => e.sourceType === 'Own Mahallu')
    .reduce((sum, e) => sum + e.amount, 0);
  const naqluTotal = ledgerEntries
    .filter(e => e.sourceType === 'Naqlu Zakat (Inward)')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalFunds = ownMahalluTotal + naqluTotal;
  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const pendingReviewsCount = claimants.filter(c => c.status === 'Pending').length;

  const filteredClaimants = claimants.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF9] min-h-screen text-gray-900 font-sans pb-24">
      {/* 1. Header: Mahallu Name & Verification Status Badge */}
      <div className="bg-[#0D7C66] text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-sm relative">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs text-teal-100 hover:text-white transition bg-white/10 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tazku</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-white/15 text-white font-bold px-2.5 py-1 rounded-full border border-white/20">
              Mahallu Portal
            </span>
            <button
              type="button"
              onClick={onBackToHome}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
              title="Sign Out to Onboarding"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white leading-tight">
                Juma Masjid Mahallu Committee
              </h1>
            </div>
            <p className="text-xs text-teal-100 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Ward 3 Jurisdiction • Reg #MHL-676505</span>
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-400/20 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                Verified Mahallu Executive
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-100 px-2 py-0.5 rounded-full font-bold">
                {pendingReviewsCount} Pending Applications
              </span>
            </div>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Total Ledger</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
              ₹ {totalFunds.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Disbursed</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-300 font-mono">
              ₹ {totalDisbursed.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Available</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
              ₹ {(totalFunds - totalDisbursed).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Dedicated Tabs Navigation */}
      <div className="px-4 mt-3">
        <div className="flex bg-[#E8F6F3] p-1 rounded-2xl gap-1">
          {[
            { id: 'claimants', label: 'Claimants Review' },
            { id: 'ledger', label: 'Fund Ledger' },
            { id: 'disbursements', label: 'Disbursement' },
            { id: 'certify', label: 'Certify New' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-[11px] font-extrabold rounded-xl transition text-center ${
                activeTab === tab.id
                  ? 'bg-[#0D7C66] text-white shadow-xs'
                  : 'text-[#0D7C66] hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="px-4 mt-4 space-y-4">
        
        {/* ===================== TAB 1: CLAIMANTS REVIEW ===================== */}
        {activeTab === 'claimants' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <span>Local Aid Applications</span>
                <span className="text-xs bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-full font-bold">
                  {filteredClaimants.length}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('certify')}
                className="text-xs text-[#0D7C66] font-bold hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Certify Candidate</span>
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search claimants or ward..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#0D7C66]"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-hidden"
              >
                <option value="All">All Fiqh Classes</option>
                <option value="Al-Fuqara">Al-Fuqara</option>
                <option value="Al-Masakin">Al-Masakin</option>
                <option value="Al-Gharimin">Al-Gharimin</option>
              </select>
            </div>

            {/* Claimants Card List */}
            <div className="space-y-3">
              {filteredClaimants.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900">{item.name}</h3>
                        <span className="text-[10px] bg-slate-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {item.ward}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {item.familyMembers} Family Members
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#0D7C66] font-mono block">
                        ₹ {item.amountRequested.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : item.status === 'More Info Needed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100">
                    {item.reason}
                  </p>

                  {/* Documents Verified */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Submitted Evidentiary Documents:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.documents.map((doc, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <FileText className="w-3 h-3 text-[#0D7C66]" />
                          <span>{doc}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.reviewNote && (
                    <div className="text-[11px] text-[#0D7C66] bg-[#E8F6F3] p-2 rounded-xl font-medium">
                      <strong>Committee Audit Note:</strong> {item.reviewNote}
                    </div>
                  )}

                  {/* Action Controls for Ward Reviewers */}
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'Approved', 'Approved by Ward 3 Executive Board for immediate relief.')}
                      className="flex-1 py-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReviewClaimant(item);
                        setReviewNoteInput(item.reviewNote || '');
                      }}
                      className="py-2 px-3 bg-[#E8F6F3] text-[#0D7C66] hover:bg-[#d8efe9] rounded-full font-bold text-xs transition"
                    >
                      More Info
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'Rejected', 'Application does not meet the 8 Quranic entitlement criteria.')}
                      className="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-full font-bold text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: FUND LEDGER ===================== */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Zakat Collection Summary
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20">
                  <span className="text-[10px] font-bold text-[#0D7C66] block">
                    Own Ward Direct Zakat
                  </span>
                  <span className="text-base font-extrabold text-[#0D7C66] font-mono mt-1 block">
                    ₹ {ownMahalluTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    From Ward 3 Residents
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-900 block">
                    Naqlu Zakat (Inward)
                  </span>
                  <span className="text-base font-extrabold text-amber-900 font-mono mt-1 block">
                    ₹ {naqluTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Transferred from Outside Mahals
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-[#F8FAF9] rounded-xl text-[11px] text-gray-600 leading-snug">
                <strong className="text-gray-900">Shariah Principle:</strong> Naqlu Zakat is accepted into Ward 3 to cover high local poverty deficits, authorized under classical Fiqh jurisdiction.
              </div>
            </div>

            {/* Ledger Transactions */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-gray-700 px-1">
                Recent Inward Zakat Contributions
              </h3>

              {ledgerEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        entry.sourceType === 'Own Mahallu'
                          ? 'bg-[#E8F6F3] text-[#0D7C66]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {entry.sourceType}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{entry.donorName}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">{entry.originWard} • {entry.zakatType}</p>
                    <span className="text-[10px] font-mono text-gray-400 block">{entry.receiptNumber}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono">
                      +₹ {entry.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{entry.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: DISBURSEMENT TRACKER ===================== */}
        {activeTab === 'disbursements' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Released Zakat Disbursements</h3>
                <p className="text-xs text-gray-500">Documented transfers to verified households</p>
              </div>
              <span className="text-xs font-bold text-[#0D7C66] bg-[#E8F6F3] px-2.5 py-1 rounded-full">
                100% Direct Transfer
              </span>
            </div>

            <div className="space-y-3">
              {disbursements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">{item.beneficiaryName}</h4>
                      <span className="text-[10px] font-bold text-[#0D7C66] bg-[#E8F6F3] px-2 py-0.5 rounded-md mt-1 inline-block">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono block">
                        ₹ {item.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.disbursedDate}</span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAF9] p-2.5 rounded-xl text-xs space-y-1">
                    <div className="text-[11px] text-gray-600">
                      <strong>Method:</strong> {item.method}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      <strong>Authorized Signatory:</strong> {item.signatory}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[10px]">
                    <span className="font-mono text-gray-400">Ref: {item.receiptId}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Handover Confirmed & Audited
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: CERTIFY APPLICATIONS ===================== */}
        {activeTab === 'certify' && (
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Certify New Beneficiary</h3>
              <p className="text-xs text-gray-500">
                Register verified needy household directly into the Ward 3 Mahallu Zakat roster.
              </p>
            </div>

            {certifySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Beneficiary successfully certified and added to active Mahallu network!</span>
              </div>
            )}

            <form onSubmit={handleCertifySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Beneficiary Full Name / Family Head
                </label>
                <input
                  type="text"
                  required
                  value={certifyForm.name}
                  onChange={(e) => setCertifyForm({ ...certifyForm, name: e.target.value })}
                  placeholder="e.g. Sister Mumtaz & 4 Children"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ward Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={certifyForm.wardNumber}
                    onChange={(e) => setCertifyForm({ ...certifyForm, wardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quranic Category
                  </label>
                  <select
                    value={certifyForm.category}
                    onChange={(e) => setCertifyForm({ ...certifyForm, category: e.target.value })}
                    className="w-full px-2.5 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                  >
                    <option value="Al-Fuqara">Al-Fuqara (Impoverished)</option>
                    <option value="Al-Masakin">Al-Masakin (Destitute)</option>
                    <option value="Al-Gharimin">Al-Gharimin (Debt Relief)</option>
                    <option value="Ibn al-Sabil">Ibn al-Sabil (Stranded)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Monthly Family Income (₹)
                  </label>
                  <input
                    type="number"
                    value={certifyForm.incomeMonthly}
                    onChange={(e) => setCertifyForm({ ...certifyForm, incomeMonthly: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Relief Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={certifyForm.requestedAmount}
                    onChange={(e) => setCertifyForm({ ...certifyForm, requestedAmount: e.target.value })}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Field Investigation Findings & Circumstances
                </label>
                <textarea
                  rows={3}
                  value={certifyForm.notes}
                  onChange={(e) => setCertifyForm({ ...certifyForm, notes: e.target.value })}
                  placeholder="Detail living conditions, house inspection confirmation, and required aid..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Certify & Publish to Mahallu Roster</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Review Modal for "More Info Needed" */}
      {selectedReviewClaimant && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900">Request Further Clarification</h3>
              <button
                type="button"
                onClick={() => setSelectedReviewClaimant(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-xs text-gray-500">Applicant:</span>
              <p className="text-xs font-bold text-gray-900">{selectedReviewClaimant.name}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Specific Documentation or Audit Questions Required:
              </label>
              <textarea
                rows={3}
                value={reviewNoteInput}
                onChange={(e) => setReviewNoteInput(e.target.value)}
                placeholder="e.g. Please provide recent electricity bill or hospital doctor receipt..."
                className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-[#0D7C66]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReviewClaimant(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedReviewClaimant.id, 'More Info Needed', reviewNoteInput)}
                className="flex-1 py-2 bg-[#0D7C66] text-white rounded-full text-xs font-bold"
              >
                Save & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
