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
  Check,
  UserCheck,
  Coins,
  Receipt
} from 'lucide-react';
import { MahalResidentsDirectory } from './MahalResidentsDirectory';

interface ClaimantReviewItem {
  id: string;
  name: string;
  ward: string;
  category: string;
  amountRequested: number;
  amountFunded: number;
  familyMembers: number;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'More Info Needed';
  reason: string;
  documents: string[];
  appliedDate: string;
  reviewNote?: string;
}

interface MahalluDonorEntry {
  id: string;
  donorName: string;
  wardAddress: string;
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
  onSwitchRole?: (role: 'donor' | 'vakeel' | 'personal') => void;
}

export const MahalluPortalScreen: React.FC<MahalluPortalScreenProps> = ({
  onBackToHome,
  onSwitchRole,
}) => {
  // Four dedicated tabs: 'donors_claimants' | 'residents_census' | 'application' | 'ledger'
  const [activeTab, setActiveTab] = useState<'donors_claimants' | 'residents_census' | 'application' | 'ledger'>('donors_claimants');

  // Sub-view toggle inside "All Donors & Claimants"
  const [directorySubTab, setDirectorySubTab] = useState<'donors' | 'claimants'>('claimants');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // 1. All Claimants List (Who applied for Zakat)
  const [claimants, setClaimants] = useState<ClaimantReviewItem[]>([
    {
      id: 'CLM-01',
      name: 'Sister Zainaba & 3 Dependents',
      ward: 'Ward 3, Noor Street',
      category: 'Al-Fuqara',
      amountRequested: 20000,
      amountFunded: 12000,
      familyMembers: 4,
      status: 'Pending',
      reason: 'Husband passed away due to cardiac failure. Immediate rent arrears and essential groceries support.',
      documents: ['Medical Discharge Summary', 'Ration Card BPL', 'Ward Council Verification Letter'],
      appliedDate: 'Yesterday',
    },
    {
      id: 'CLM-02',
      name: 'Muhammad Basheer K.',
      ward: 'Ward 3, Old Market Lane',
      category: 'Al-Gharimin',
      amountRequested: 35000,
      amountFunded: 20000,
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
      amountFunded: 12000,
      familyMembers: 2,
      status: 'Disbursed',
      reason: 'Final year Bachelor of Science semester fees challan and laboratory instrument deposit.',
      documents: ['College Admission Fee Slip', 'Orphan Care Registration'],
      appliedDate: '1 week ago',
      reviewNote: 'Approved in executive committee meeting. Disbursed via direct educational voucher.',
    },
    {
      id: 'CLM-04',
      name: 'Abdul Rasheed (Wheelchair Patient)',
      ward: 'Ward 3, Hilltop Road',
      category: 'Al-Fuqara',
      amountRequested: 18000,
      amountFunded: 0,
      familyMembers: 3,
      status: 'More Info Needed',
      reason: 'Monthly insulin medication and specialized therapy consultation costs.',
      documents: ['Prescription Copy'],
      appliedDate: '5 days ago',
      reviewNote: 'Requested government pharmacy subsidy confirmation passbook.',
    },
    {
      id: 'CLM-05',
      name: 'Sister Fatima & 3 Children',
      ward: 'Ward 3, Industrial Colony',
      category: 'Widow Support',
      amountRequested: 18000,
      amountFunded: 18000,
      familyMembers: 4,
      status: 'Disbursed',
      reason: 'Widowed mother provided industrial sewing machine to start home tailoring micro-income.',
      documents: ['Death Certificate', 'BPL Card', 'Ward Head Recommendation'],
      appliedDate: '2 weeks ago',
      reviewNote: 'Machine delivered on Oct 02. Family earning sustainable income.',
    },
  ]);

  // Review Modal State
  const [selectedReviewClaimant, setSelectedReviewClaimant] = useState<ClaimantReviewItem | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  // 2. All Donors List (Who contributed to this Mahal)
  const [donors] = useState<MahalluDonorEntry[]>([
    {
      id: 'DNR-01',
      donorName: 'Br. Tariq Mansoor',
      wardAddress: 'Ward 3, Resident House #42',
      amount: 45000,
      zakatType: 'Zakat al-Mal (Gold & Cash)',
      date: 'Today, 11:20 AM',
      receiptNumber: 'TZK-MHL-9821',
    },
    {
      id: 'DNR-02',
      donorName: 'Hajjia Mariyam K.',
      wardAddress: 'Ward 3, North Crescent',
      amount: 28000,
      zakatType: 'Zakat al-Mal (Commercial Stock)',
      date: 'Yesterday, 04:30 PM',
      receiptNumber: 'TZK-MHL-9818',
    },
    {
      id: 'DNR-03',
      donorName: 'Br. Adil Rasheed',
      wardAddress: 'Ward 3, River View Road',
      amount: 60000,
      zakatType: 'Zakat al-Mal (Annual Savings)',
      date: 'Oct 04, 2026',
      receiptNumber: 'TZK-MHL-9804',
    },
    {
      id: 'DNR-04',
      donorName: 'Anonymous Ward 3 Contributor',
      wardAddress: 'Ward 3 (Verified Resident)',
      amount: 25000,
      zakatType: 'Zakat al-Fitr & Sadaqah',
      date: 'Oct 03, 2026',
      receiptNumber: 'TZK-MHL-9799',
    },
    {
      id: 'DNR-05',
      donorName: 'K. M. Shafeeq & Family',
      wardAddress: 'Ward 3, Market Road',
      amount: 15000,
      zakatType: 'Zakat al-Mal',
      date: 'Oct 01, 2026',
      receiptNumber: 'TZK-MHL-9782',
    },
  ]);

  // 3. Disbursements to Verified Families (Own Mahal)
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

  // 4. Zakat Application Form State (For registering new applicant)
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    wardNumber: 'Ward 3',
    familySize: '4',
    incomeMonthly: '',
    category: 'Al-Fuqara',
    requestedAmount: '',
    investigator: 'Hafiz Usman (Ward Field Auditor)',
    notes: '',
  });
  const [applicationSuccess, setApplicationSuccess] = useState(false);

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

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationForm.name || !applicationForm.requestedAmount) return;

    const newClaimant: ClaimantReviewItem = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      name: applicationForm.name,
      ward: `${applicationForm.wardNumber}, Mahallu Registry`,
      category: applicationForm.category,
      amountRequested: parseFloat(applicationForm.requestedAmount) || 15000,
      amountFunded: 0,
      familyMembers: parseInt(applicationForm.familySize) || 4,
      status: 'Pending',
      reason: applicationForm.notes || 'Registered through Mahallu Welfare Desk. Field verification pending.',
      documents: ['Ward Field Verification Certificate', 'Trustee Signed Challan'],
      appliedDate: 'Just now (New Application)',
      reviewNote: `Submitted by ${applicationForm.investigator}. Awaiting board sign-off.`,
    };

    setClaimants(prev => [newClaimant, ...prev]);
    setApplicationSuccess(true);
    setApplicationForm({
      name: '',
      wardNumber: 'Ward 3',
      familySize: '4',
      incomeMonthly: '',
      category: 'Al-Fuqara',
      requestedAmount: '',
      investigator: 'Hafiz Usman (Ward Field Auditor)',
      notes: '',
    });
    setTimeout(() => {
      setApplicationSuccess(false);
      // Switch view to claimants directory to see it immediately
      setActiveTab('donors_claimants');
      setDirectorySubTab('claimants');
    }, 2000);
  };

  // Calculations (Strictly Own Mahallu)
  const totalOwnMahalFunds = donors.reduce((sum, d) => sum + d.amount, 0);
  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const availableBalance = totalOwnMahalFunds - totalDisbursed;
  const pendingCount = claimants.filter(c => c.status === 'Pending').length;

  const filteredClaimants = claimants.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredDonors = donors.filter(d => {
    return d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.zakatType.toLowerCase().includes(searchQuery.toLowerCase());
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
            <span>Switch Role / Logout</span>
          </button>

         
        </div>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Juma Masjid Mahallu Committee
            </h1>
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
                {pendingCount} Pending Applications
              </span>
            </div>
          </div>
        </div>

        {/* Financial Overview (Strictly Own Mahal) */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Own Collections</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
              ₹ {totalOwnMahalFunds.toLocaleString()}
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
              ₹ {availableBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Dedicated Tabs Navigation */}
      <div className="px-4 mt-3">
        <div className="flex bg-[#E8F6F3] p-1 rounded-2xl gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'donors_claimants', label: 'Claimants & Donors' },
            { id: 'residents_census', label: 'Census Directory' },
            { id: 'application', label: 'Zakat Application' },
            { id: 'ledger', label: 'Fund Ledger' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2 text-[11px] font-extrabold rounded-xl transition text-center whitespace-nowrap cursor-pointer ${
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

      {/* 3. Main Content Container */}
      <div className="px-4 mt-4 space-y-4 max-w-md mx-auto w-full">
        
        {/* ========================================================================= */}
        {/* TAB 1: ALL DONORS & CLAIMANTS (Requested Core Option)                     */}
        {/* ========================================================================= */}
        {activeTab === 'donors_claimants' && (
          <div className="space-y-3.5">
            {/* Quick-Access Card: Mahal Residents Directory & Census */}
            <div 
              onClick={() => setActiveTab('residents_census')}
              className="bg-white p-4 rounded-3xl border border-[#0D7C66]/20 hover:border-[#0D7C66] shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F6F3] text-[#0D7C66] flex items-center justify-center shrink-0 group-hover:scale-105 transition shadow-2xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#0D7C66] transition">
                    Mahal Residents Directory
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    Census, family member rosters, economic tags & house numbers.
                  </p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#E8F6F3] text-[#0D7C66] px-2.5 py-0.5 rounded-full border border-[#0D7C66]/20">
                      1,420 Registered Residents • 312 Households
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#E8F6F3] flex items-center justify-center text-gray-400 group-hover:text-[#0D7C66] transition shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Sub-tabs toggle between Claimants and Donors */}
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setDirectorySubTab('claimants')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  directorySubTab === 'claimants'
                    ? 'bg-[#0D7C66] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All Claimants ({claimants.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDirectorySubTab('donors')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  directorySubTab === 'donors'
                    ? 'bg-[#0D7C66] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>All Donors ({donors.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={directorySubTab === 'claimants' ? "Search claimants by name or need..." : "Search donors by name..."}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* SUB-VIEW A: ALL CLAIMANTS (Who applied for Zakat) */}
            {directorySubTab === 'claimants' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-gray-500 font-medium">
                    People who applied for Zakat in this Mahallu
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('application')}
                    className="text-xs font-bold text-[#0D7C66] hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Application</span>
                  </button>
                </div>

                {filteredClaimants.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Disbursed'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'More Info Needed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {item.ward} • {item.familyMembers} Family Members
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono block">
                          ₹ {item.amountRequested.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 block">Requested</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100">
                      {item.reason}
                    </p>

                    {item.reviewNote && (
                      <div className="text-[11px] text-[#0D7C66] bg-[#E8F6F3] p-2 rounded-xl font-medium">
                        <strong>Committee Audit Note:</strong> {item.reviewNote}
                      </div>
                    )}

                    {/* Committee Actions */}
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'Approved', 'Approved by Ward 3 Executive Board.')}
                        className="flex-1 py-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Aid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'Disbursed', 'Funds fully handed over.')}
                        className="flex-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full font-bold text-xs transition"
                      >
                        Mark Disbursed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW B: ALL DONORS (Who contributed to this Mahal) */}
            {directorySubTab === 'donors' && (
              <div className="space-y-3">
                <span className="text-xs text-gray-500 font-medium px-1 block">
                  All local community donors who contributed Zakat to this Mahallu
                </span>

                {filteredDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">{donor.donorName}</h4>
                      <p className="text-[11px] text-gray-500">{donor.wardAddress} • {donor.zakatType}</p>
                      <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                        Receipt: {donor.receiptNumber}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono block">
                        ₹ {donor.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">{donor.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: MAHAL RESIDENTS DIRECTORY & CENSUS                                    */}
        {/* ========================================================================= */}
        {activeTab === 'residents_census' && (
          <MahalResidentsDirectory
            onBack={() => setActiveTab('donors_claimants')}
            onOpenApplicationWithResident={(resident) => {
              setApplicationForm(prev => ({
                ...prev,
                name: resident.fullName,
                wardNumber: resident.ward,
                requestedAmount: '15000',
                notes: `Referred from Mahallu Census record #${resident.id} (${resident.houseName}). ${resident.specialConsiderations?.join(', ') || ''}`,
              }));
              setActiveTab('application');
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ZAKAT APPLICATION OPTION (Add/Register new aid applicant)         */}
        {/* ========================================================================= */}
        {activeTab === 'application' && (
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0D7C66]" />
                <h3 className="text-sm font-bold text-gray-900">Zakat Aid Application</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Register individuals or families in Ward 3 who applied for Zakat relief assistance.
              </p>
            </div>

            {applicationSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Application successfully registered and added to Mahallu claimants roster!</span>
              </div>
            )}

            <form onSubmit={handleApplicationSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Applicant Full Name / Head of Household
                </label>
                <input
                  type="text"
                  required
                  value={applicationForm.name}
                  onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                  placeholder="e.g. Br. Usman & 4 Family Members"
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
                    value={applicationForm.wardNumber}
                    onChange={(e) => setApplicationForm({ ...applicationForm, wardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Family Dependents
                  </label>
                  <input
                    type="number"
                    value={applicationForm.familySize}
                    onChange={(e) => setApplicationForm({ ...applicationForm, familySize: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quranic Category
                  </label>
                  <select
                    value={applicationForm.category}
                    onChange={(e) => setApplicationForm({ ...applicationForm, category: e.target.value })}
                    className="w-full px-2.5 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  >
                    <option value="Al-Fuqara">Al-Fuqara (The Impoverished)</option>
                    <option value="Al-Masakin">Al-Masakin (The Destitute)</option>
                    <option value="Al-Gharimin">Al-Gharimin (Insolvency/Debt)</option>
                    <option value="Medical Aid">Medical Emergency</option>
                    <option value="Education">Education Relief</option>
                    <option value="Widow Support">Widow & Orphan Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Requested Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={applicationForm.requestedAmount}
                    onChange={(e) => setApplicationForm({ ...applicationForm, requestedAmount: e.target.value })}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Application & Field Findings
                </label>
                <textarea
                  rows={3}
                  value={applicationForm.notes}
                  onChange={(e) => setApplicationForm({ ...applicationForm, notes: e.target.value })}
                  placeholder="Detail the family circumstances, house verification, and required assistance..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-[#0D7C66] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Submit & Certify Application</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FUND LEDGER (Strictly Own Mahal - No Naqlu Zakat!)                 */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="bg-white p-4.5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                  Own Mahallu Zakat Ledger
                </h3>
                <span className="text-[10px] bg-emerald-50 text-[#0D7C66] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Ward 3 Retained (100%)
                </span>
              </div>

              <div className="p-4 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20">
                <span className="text-xs font-bold text-[#0D7C66] block">
                  Total Collections Received (Own Ward)
                </span>
                <span className="text-2xl font-extrabold text-[#0D7C66] font-mono mt-1 block">
                  ₹ {totalOwnMahalFunds.toLocaleString()}
                </span>
                
              </div>
            </div>

            {/* List of Incoming Contributions */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-gray-700 px-1">
                Recent Direct Zakat Collections
              </h3>

              {donors.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-900 block">{entry.donorName}</span>
                    <p className="text-[11px] text-gray-500">{entry.wardAddress} • {entry.zakatType}</p>
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
