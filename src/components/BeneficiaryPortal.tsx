import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Building,
  UserCheck
} from 'lucide-react';
import { CurrencyCode, QuranicCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { submitAidApplication } from '../lib/firebase';

interface BeneficiaryPortalProps {
  currency: CurrencyCode;
}

export const BeneficiaryPortal: React.FC<BeneficiaryPortalProps> = ({ currency }) => {
  const { user } = useAuth();
  const [alias, setAlias] = useState('');
  const [category, setCategory] = useState<QuranicCategory>('Medical Aid');
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [description, setDescription] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const categories: QuranicCategory[] = [
    'Medical Aid',
    'Al-Gharimin',
    'Al-Fuqara',
    'Al-Masakin',
    'Education Support',
    'Widow & Orphan Support',
    'Fi Sabilillah',
  ];

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedAmount || parseFloat(requestedAmount) <= 0) return;

    try {
      setIsSubmitting(true);
      const appId = await submitAidApplication({
        applicantUid: user ? user.uid : 'anon_applicant',
        beneficiaryAlias: alias || 'Confidential Applicant',
        category,
        requestedAmount: parseFloat(requestedAmount),
        currency,
        location,
        pincode,
        description,
        supportingDocNotes: `${docNotes} | Files Attached: ${uploadedFiles.join(', ') || 'Paper documents to be inspected on-site'}`,
      });

      setSubmittedId(appId);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Application failed:", err);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedId(null);
    setAlias('');
    setRequestedAmount('');
    setLocation('');
    setPincode('');
    setDescription('');
    setDocNotes('');
    setUploadedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-3">
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          <span>Dignified Grassroots Assistance</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Beneficiary & Ward Assistance Portal
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Are you facing urgent medical bills, debt, education fees, or living sustenance emergencies? Submit a confidential request to your local ward audit committee.
        </p>
      </div>

      {submittedId ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Application Submitted Successfully
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Request Case #{submittedId}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your application has been logged into the secure Mahallu review queue. Two authorized local ward representatives will review your circumstances within 48 to 72 hours.
            </p>
          </div>

          {/* Next Steps Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3 text-xs">
            <div className="font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>What Happens Next:</span>
            </div>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>Our local committee will contact your phone/representative discreetly.</li>
              <li>A confidential document verification visit will be arranged.</li>
              <li>Once verified, your cause will be published with an anonymized alias to receive 100% direct relief funds.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#0F5132] text-white hover:bg-[#1B4332] transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          {/* Privacy Note */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Strict Dignity & Privacy Safeguard:</span> We protect your identity and family honor. Your legal name and private address will never be publicly exposed. On the community portal, only a respectful pseudonym (e.g. "Family of Brother M.") is visible.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Alias / Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Beneficiary Alias / Representative Name
                </label>
                <input
                  type="text"
                  required
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g. Brother Z. (Father of 3) or Full Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Category of Need */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category of Need (Quranic Classification)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QuranicCategory)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Amount Needed */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assistance Amount Needed ({currency})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  placeholder="e.g. 750"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              {/* Mahallu / Ward */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Local Ward / Mahallu / Neighborhood
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. North Crescent Ward #12"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Pin code */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Area Postal / PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 400012"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Circumstances & Urgency Explanation
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the financial hardship, whether medical diagnosis, job disruption, urgent debt notice, or educational fee deadlines..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
              ></textarea>
            </div>

            {/* Supporting Document Upload Placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Supporting Verification Documents (Hospital bills, rent notice, ration card, fee slip)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 text-center transition-colors bg-slate-50/60">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700">
                  Upload PDF or image proofs
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Invoices, doctor prescriptions, tenancy agreements
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleMockUpload}
                  className="mt-3 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-600">Attached Files:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadedFiles.map((fn, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {fn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional notes */}
            <div>
              <input
                type="text"
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
                placeholder="Optional notes for the ward auditors (e.g. best hours to call, family member contacts)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm bg-[#0F5132] text-white hover:bg-[#1B4332] transition-colors shadow-md hover:shadow-emerald-950/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Submitting Application...' : 'Submit Confidential Aid Request'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
