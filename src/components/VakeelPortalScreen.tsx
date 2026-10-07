import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  Coins, 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  Send, 
  Clock, 
  Heart, 
  Eye, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Users,
  Camera,
  Check
} from 'lucide-react';

interface AssignedFundItem {
  id: string;
  donorName: string;
  amount: number;
  remainingAmount: number;
  zakatType: string;
  delegationDate: string;
  stipulation: string;
  wakalahContractRef: string;
}

interface NiyyahLogItem {
  id: string;
  donorName: string;
  date: string;
  amount: number;
  zakatType: string;
  niyyahWording: string;
  digitalConsentHash: string;
  donorPhoneMasked: string;
}

interface VakeelBeneficiaryItem {
  id: string;
  name: string;
  category: string;
  location: string;
  targetAmount: number;
  receivedAmount: number;
  urgency: 'Immediate' | 'High' | 'Standard';
  caseSummary: string;
  familySize: number;
}

interface ProofSubmission {
  id: string;
  donorName: string;
  beneficiaryName: string;
  amount: number;
  date: string;
  method: string;
  documentRef: string;
  status: 'Verified & Sent to Donor' | 'Pending Review';
}

interface VakeelPortalScreenProps {
  onBackToHome: () => void;
  onSwitchRole: (role: 'donor' | 'mahal') => void;
}

export const VakeelPortalScreen: React.FC<VakeelPortalScreenProps> = ({
  onBackToHome,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'assigned' | 'niyyah' | 'recipients' | 'proof'>('assigned');

  // 1. Assigned Zakat Funds
  const [assignedFunds, setAssignedFunds] = useState<AssignedFundItem[]>([
    {
      id: 'AF-01',
      donorName: 'Br. Adil Rasheed (Kochi)',
      amount: 60000,
      remainingAmount: 22000,
      zakatType: 'Zakat al-Mal (Gold Nisab)',
      delegationDate: 'Oct 02, 2026',
      stipulation: 'Disburse to widows or orphan caregivers in Northern Wards before Shawwal.',
      wakalahContractRef: 'WKL-2026-9021',
    },
    {
      id: 'AF-02',
      donorName: 'Anonymous Executive Donor (Dubai)',
      amount: 75000,
      remainingAmount: 45000,
      zakatType: 'Zakat al-Mal (Annual Dividend)',
      delegationDate: 'Oct 04, 2026',
      stipulation: 'Emergency medical treatment debts and pediatric health operations.',
      wakalahContractRef: 'WKL-2026-9034',
    },
    {
      id: 'AF-03',
      donorName: 'Family of Late Hajjia Amina',
      amount: 50000,
      remainingAmount: 50000,
      zakatType: 'Kaffarah & Fidyah Allocation',
      delegationDate: 'Yesterday',
      stipulation: 'Staple grain rations and flour distributions for poorest elderly families.',
      wakalahContractRef: 'WKL-2026-9048',
    },
  ]);

  // 2. Niyyah & Delegation Log
  const [niyyahLogs] = useState<NiyyahLogItem[]>([
    {
      id: 'NYH-101',
      donorName: 'Br. Adil Rasheed',
      date: 'Oct 02, 2026 • 09:15 AM',
      amount: 60000,
      zakatType: 'Zakat al-Mal',
      niyyahWording: 'I appoint Usthad Muhammad as my authorized Wakil bil-Qabd to identify valid recipients under Surah At-Tawbah 9:60 and discharge my obligatory Zakat.',
      digitalConsentHash: '0x8f2a...91d4e',
      donorPhoneMasked: '+91 9847••••12',
    },
    {
      id: 'NYH-102',
      donorName: 'Anonymous Executive Donor',
      date: 'Oct 04, 2026 • 08:30 PM',
      amount: 75000,
      zakatType: 'Zakat al-Mal',
      niyyahWording: 'Solemn Wakalah entrusted for pediatric medical emergencies with zero commission deduction.',
      digitalConsentHash: '0x3c7e...b50a1',
      donorPhoneMasked: '+971 50••••49',
    },
    {
      id: 'NYH-103',
      donorName: 'Family of Late Hajjia Amina',
      date: 'Yesterday • 11:00 AM',
      amount: 50000,
      zakatType: 'Fidyah & Kaffarah',
      niyyahWording: 'Fidyah for missed fasting and voluntary expiation distributed as nourishing food items.',
      digitalConsentHash: '0x5b19...f72cc',
      donorPhoneMasked: '+91 9446••••88',
    },
  ]);

  // 3. Eligible Recipients Assigned to this Vakeel
  const [recipients, setRecipients] = useState<VakeelBeneficiaryItem[]>([
    {
      id: 'RCP-01',
      name: 'Elderly Household (Widow Fatima & Grandchildren)',
      category: 'Al-Fuqara',
      location: 'Ward 3, Industrial Colony',
      targetAmount: 25000,
      receivedAmount: 18000,
      urgency: 'Immediate',
      caseSummary: 'No breadwinner. Urgent winter clothing, staple grains, and room shelter rent.',
      familySize: 4,
    },
    {
      id: 'RCP-02',
      name: 'Master Rayyan (Dialysis Patient Aid)',
      category: 'Medical / Al-Masakin',
      location: 'Ward 2, Riverside Quarters',
      targetAmount: 40000,
      receivedAmount: 20000,
      urgency: 'Immediate',
      caseSummary: 'Requires bi-weekly hospital renal dialysis treatment and medication chits.',
      familySize: 3,
    },
    {
      id: 'RCP-03',
      name: 'Kareemullah (Stranded Laborer)',
      category: 'Ibn al-Sabil',
      location: 'Railway Junction Ward',
      targetAmount: 12000,
      receivedAmount: 4000,
      urgency: 'High',
      caseSummary: 'Wage theft victim without transit fare to return to native home and settle arrears.',
      familySize: 1,
    },
    {
      id: 'RCP-04',
      name: 'Sister Hafsa (Vocational Tailoring Kit)',
      category: 'Al-Fuqara (Sustainable Lift)',
      location: 'Ward 4, Market Colony',
      targetAmount: 15000,
      receivedAmount: 15000,
      urgency: 'Standard',
      caseSummary: 'Fully funded! Sewing machine handed over. Family now generating micro-income.',
      familySize: 3,
    },
  ]);

  // 4. Execution Proofs Log
  const [proofs, setProofs] = useState<ProofSubmission[]>([
    {
      id: 'PRF-01',
      donorName: 'Br. Adil Rasheed',
      beneficiaryName: 'Sister Hafsa (Vocational Sewing Machine)',
      amount: 15000,
      date: 'Oct 04, 2026',
      method: 'In-Person Handover with Mahallu Witness Signatures',
      documentRef: 'ACK-2026-OCT-094',
      status: 'Verified & Sent to Donor',
    },
    {
      id: 'PRF-02',
      donorName: 'Anonymous Executive Donor',
      beneficiaryName: 'Master Rayyan (Dialysis Clinic Payment)',
      amount: 20000,
      date: 'Oct 05, 2026',
      method: 'Hospital Direct Billing Counter Receipt',
      documentRef: 'HOSP-2026-CHAL-41',
      status: 'Verified & Sent to Donor',
    },
  ]);

  // Disburse Modal State
  const [selectedRecipientForDisburse, setSelectedRecipientForDisburse] = useState<VakeelBeneficiaryItem | null>(null);
  const [selectedAssignedFundId, setSelectedAssignedFundId] = useState<string>(assignedFunds[0]?.id || '');
  const [disburseAmountInput, setDisburseAmountInput] = useState<string>('5000');
  const [disburseSuccessMsg, setDisburseSuccessMsg] = useState(false);

  // New Proof Submission Form State
  const [proofForm, setProofForm] = useState({
    donorName: 'Br. Adil Rasheed',
    beneficiaryName: '',
    amount: '',
    handoverDate: 'Today',
    method: 'Direct Bank NEFT / RTGS Transfer',
    referenceCode: '',
    notes: '',
  });
  const [proofSuccessMsg, setProofSuccessMsg] = useState(false);

  // Stats calculation
  const totalEntrusted = assignedFunds.reduce((sum, f) => sum + f.amount, 0);
  const totalRemaining = assignedFunds.reduce((sum, f) => sum + f.remainingAmount, 0);
  const totalExecuted = totalEntrusted - totalRemaining;

  const handleExecuteDisbursement = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(disburseAmountInput);
    if (!selectedRecipientForDisburse || isNaN(amt) || amt <= 0) return;

    // Deduct from assigned fund
    setAssignedFunds(prev => prev.map(f => {
      if (f.id === selectedAssignedFundId) {
        return {
          ...f,
          remainingAmount: Math.max(0, f.remainingAmount - amt),
        };
      }
      return f;
    }));

    // Add to recipient received amount
    setRecipients(prev => prev.map(r => {
      if (r.id === selectedRecipientForDisburse.id) {
        return {
          ...r,
          receivedAmount: r.receivedAmount + amt,
        };
      }
      return r;
    }));

    // Auto add to proof submissions
    const matchingFund = assignedFunds.find(f => f.id === selectedAssignedFundId);
    const newProof: ProofSubmission = {
      id: `PRF-${Date.now().toString().slice(-4)}`,
      donorName: matchingFund?.donorName || 'Authorized Donor',
      beneficiaryName: selectedRecipientForDisburse.name,
      amount: amt,
      date: 'Just now',
      method: 'Vakeel Direct Delivery with Acknowledgment Slip',
      documentRef: `ACK-${Date.now().toString().slice(-6)}`,
      status: 'Verified & Sent to Donor',
    };
    setProofs(prev => [newProof, ...prev]);

    setDisburseSuccessMsg(true);
    setTimeout(() => {
      setDisburseSuccessMsg(false);
      setSelectedRecipientForDisburse(null);
    }, 1800);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(proofForm.amount);
    if (!proofForm.beneficiaryName || isNaN(amt) || amt <= 0) return;

    const newProof: ProofSubmission = {
      id: `PRF-${Date.now().toString().slice(-4)}`,
      donorName: proofForm.donorName,
      beneficiaryName: proofForm.beneficiaryName,
      amount: amt,
      date: proofForm.handoverDate,
      method: proofForm.method,
      documentRef: proofForm.referenceCode || `ACK-${Date.now().toString().slice(-6)}`,
      status: 'Verified & Sent to Donor',
    };

    setProofs(prev => [newProof, ...prev]);
    setProofSuccessMsg(true);
    setProofForm({
      donorName: 'Br. Adil Rasheed',
      beneficiaryName: '',
      amount: '',
      handoverDate: 'Today',
      method: 'Direct Bank NEFT / RTGS Transfer',
      referenceCode: '',
      notes: '',
    });
    setTimeout(() => setProofSuccessMsg(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF9] min-h-screen text-gray-900 font-sans pb-24">
      {/* 1. Header: Vakeel Profile & Certification ID */}
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
              Vakeel Portal
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Usthad Muhammad Musliyar
            </h1>
            <p className="text-xs text-teal-100 mt-0.5">
              Authorized Vakeel • ID: #VK-88 (Shariah Verified)
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-400/20 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                Wakil bil-Qabd Certified
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-100 px-2 py-0.5 rounded-full font-bold">
                {assignedFunds.length} Active Entrustments
              </span>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Total Entrusted</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
              ₹ {totalEntrusted.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Disbursed</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-300 font-mono">
              ₹ {totalExecuted.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-teal-100 block">Unallocated</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
              ₹ {totalRemaining.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="px-4 mt-3">
        <div className="flex bg-[#E8F6F3] p-1 rounded-2xl gap-1">
          {[
            { id: 'assigned', label: 'Assigned Funds' },
            { id: 'niyyah', label: 'Niyyah Log' },
            { id: 'recipients', label: 'Recipients' },
            { id: 'proof', label: 'Execution Proof' },
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
        
        {/* ===================== MODULE 1: ASSIGNED ZAKAT FUNDS ===================== */}
        {activeTab === 'assigned' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Entrusted Donor Portfolios</h3>
                <p className="text-xs text-gray-500">Zakat capital received under Shariah Wakalah terms</p>
              </div>
              <span className="text-xs font-bold text-[#0D7C66] bg-[#E8F6F3] px-2 py-0.5 rounded-full">
                {assignedFunds.length} Donors
              </span>
            </div>

            <div className="space-y-3">
              {assignedFunds.map((fund) => {
                const percentDisbursed = Math.round(((fund.amount - fund.remainingAmount) / fund.amount) * 100);
                return (
                  <div
                    key={fund.id}
                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900">{fund.donorName}</h4>
                        <span className="text-[10px] font-bold text-[#0D7C66] bg-[#E8F6F3] px-2 py-0.5 rounded-md mt-1 inline-block">
                          {fund.zakatType}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-900 font-mono block">
                          ₹ {fund.amount.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{fund.wakalahContractRef}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Disbursed: ₹ {(fund.amount - fund.remainingAmount).toLocaleString()} ({percentDisbursed}%)</span>
                        <span className="font-bold text-[#0D7C66]">Remaining: ₹ {fund.remainingAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0D7C66] h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentDisbursed}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#F8FAF9] rounded-xl text-xs space-y-1 border border-gray-100">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Donor Stipulation / Specific Intent:
                      </div>
                      <p className="text-xs text-gray-700 italic">
                        "{fund.stipulation}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-400">Delegated: {fund.delegationDate}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAssignedFundId(fund.id);
                          setActiveTab('recipients');
                        }}
                        className="text-xs text-[#0D7C66] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Allocate to Recipients</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== MODULE 2: NIYYAH & DELEGATION LOG ===================== */}
        {activeTab === 'niyyah' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recorded Wakalah Authorizations</h3>
              <p className="text-xs text-gray-500">Verifiable religious consent registry with digital hashes</p>
            </div>

            <div className="space-y-3">
              {niyyahLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">{log.donorName}</h4>
                      <span className="text-[10px] text-gray-400 block">{log.donorPhoneMasked}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono block">
                        ₹ {log.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {log.zakatType}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#E8F6F3] p-3 rounded-2xl border border-[#0D7C66]/20 space-y-1">
                    <span className="text-[10px] font-bold text-[#0D7C66] uppercase tracking-wider block">
                      Stated Niyyah & Delegation Formula:
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed italic">
                      "{log.niyyahWording}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                    <span>{log.date}</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
                      Hash: {log.digitalConsentHash}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== MODULE 3: ELIGIBLE RECIPIENTS ===================== */}
        {activeTab === 'recipients' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Eligible Recipients Directory</h3>
                <p className="text-xs text-gray-500">Directly assign entrusted Zakat funds</p>
              </div>
              <span className="text-xs font-bold text-[#0D7C66] bg-[#E8F6F3] px-2.5 py-1 rounded-full">
                8 Quranic Classes
              </span>
            </div>

            <div className="space-y-3">
              {recipients.map((rec) => {
                const needed = Math.max(0, rec.targetAmount - rec.receivedAmount);
                return (
                  <div
                    key={rec.id}
                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900">{rec.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rec.urgency === 'Immediate'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rec.urgency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-md">
                            {rec.category}
                          </span>
                          <span className="text-[11px] text-gray-500">{rec.location}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-gray-900 font-mono block">
                          ₹ {rec.targetAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 block">Target</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100">
                      {rec.caseSummary}
                    </p>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        Received: <strong className="text-emerald-700">₹ {rec.receivedAmount.toLocaleString()}</strong>
                      </span>
                      <span className="text-gray-500">
                        Remaining Need: <strong className="text-amber-800">₹ {needed.toLocaleString()}</strong>
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">{rec.familySize} Family Members</span>
                      {needed > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecipientForDisburse(rec);
                            setDisburseAmountInput(String(Math.min(needed, 10000)));
                          }}
                          className="py-2 px-4 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Disburse Entrusted Capital</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fully Funded</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== MODULE 4: EXECUTION PROOF ===================== */}
        {activeTab === 'proof' && (
          <div className="space-y-4">
            {/* Proof Submission Form */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Submit Delivery Confirmation</h3>
                <p className="text-xs text-gray-500">
                  Transmit verifiable proof of Zakat receipt back to the delegating donor.
                </p>
              </div>

              {proofSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Execution proof successfully verified and linked to donor portal!</span>
                </div>
              )}

              <form onSubmit={handleProofSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Entrusting Donor
                    </label>
                    <select
                      value={proofForm.donorName}
                      onChange={(e) => setProofForm({ ...proofForm, donorName: e.target.value })}
                      className="w-full px-2.5 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                    >
                      {assignedFunds.map(f => (
                        <option key={f.id} value={f.donorName}>{f.donorName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Recipient / Case Name
                    </label>
                    <input
                      type="text"
                      required
                      value={proofForm.beneficiaryName}
                      onChange={(e) => setProofForm({ ...proofForm, beneficiaryName: e.target.value })}
                      placeholder="e.g. Master Rayyan"
                      className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Handed Over Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={proofForm.amount}
                      onChange={(e) => setProofForm({ ...proofForm, amount: e.target.value })}
                      placeholder="e.g. 10000"
                      className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Bank Ref / Receipt ID
                    </label>
                    <input
                      type="text"
                      value={proofForm.referenceCode}
                      onChange={(e) => setProofForm({ ...proofForm, referenceCode: e.target.value })}
                      placeholder="e.g. UTR-982180"
                      className="w-full px-3 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Handover Method
                  </label>
                  <select
                    value={proofForm.method}
                    onChange={(e) => setProofForm({ ...proofForm, method: e.target.value })}
                    className="w-full px-2.5 py-2 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  >
                    <option value="Direct Bank NEFT / RTGS Transfer">Direct Bank NEFT / RTGS Transfer</option>
                    <option value="In-Person Cash Handover with Signature">In-Person Cash Handover with Signature</option>
                    <option value="Hospital / School Direct Challan">Hospital / School Direct Challan</option>
                    <option value="Grain & Provision Wholesale Card">Grain & Provision Wholesale Card</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-300" />
                  <span>Log & Transmit Proof to Donor</span>
                </button>
              </form>
            </div>

            {/* List of past proofs */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-gray-700 px-1">
                Verified Delivery Records
              </h3>

              {proofs.map((prf) => (
                <div
                  key={prf.id}
                  className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-gray-900">{prf.beneficiaryName}</h4>
                    <p className="text-[11px] text-gray-500">For {prf.donorName} • {prf.method}</p>
                    <span className="text-[10px] font-mono text-gray-400 block">Ref: {prf.documentRef}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-extrabold text-[#0D7C66] font-mono block">
                      ₹ {prf.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Donor Verified</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Disburse Modal */}
      {selectedRecipientForDisburse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900">Disburse Entrusted Capital</h3>
              <button
                type="button"
                onClick={() => setSelectedRecipientForDisburse(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {disburseSuccessMsg ? (
              <div className="p-4 bg-emerald-50 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Disbursement Logged!</h4>
                <p className="text-xs text-emerald-700">
                  Wakalah portfolio updated and delivery proof recorded.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteDisbursement} className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500">Beneficiary:</span>
                  <p className="text-xs font-bold text-gray-900">{selectedRecipientForDisburse.name}</p>
                  <span className="text-[10px] bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-md font-bold mt-1 inline-block">
                    {selectedRecipientForDisburse.category}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Delegating Donor Portfolio
                  </label>
                  <select
                    value={selectedAssignedFundId}
                    onChange={(e) => setSelectedAssignedFundId(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  >
                    {assignedFunds.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.donorName} (Avail: ₹ {f.remainingAmount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Disbursement Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={disburseAmountInput}
                    onChange={(e) => setDisburseAmountInput(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAF9] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipientForDisburse(null)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#0D7C66] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#0A6654]"
                  >
                    Confirm Release
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
