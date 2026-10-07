import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  Calculator, 
  Receipt, 
  FileText, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Calendar,
  Globe,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CurrencyCode, Madhhab, SavedCalculation, DonationRecord, BeneficiaryApplication } from '../types';
import { formatCurrency } from '../lib/currency';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onViewCertificate: (record: DonationRecord) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  isOpen,
  onClose,
  currency,
  setCurrency,
  onViewCertificate,
}) => {
  const { user, profile, signOut, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState<'calculations' | 'disbursements' | 'applications'>('calculations');
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [applications, setApplications] = useState<BeneficiaryApplication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 1. Fetch saved calculations
        const calcQuery = query(
          collection(db, 'calculations'),
          where('userId', '==', user.uid)
        );
        const calcSnap = await getDocs(calcQuery);
        const calcs: SavedCalculation[] = [];
        calcSnap.forEach((d) => calcs.push(d.data() as SavedCalculation));
        setCalculations(calcs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

        // 2. Fetch donations by user
        const donQuery = query(
          collection(db, 'donations'),
          where('donorId', '==', user.uid)
        );
        const donSnap = await getDocs(donQuery);
        const dons: DonationRecord[] = [];
        donSnap.forEach((d) => dons.push(d.data() as DonationRecord));
        setDonations(dons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

        // 3. Fetch applications by user
        const appQuery = query(
          collection(db, 'applications'),
          where('applicantUid', '==', user.uid)
        );
        const appSnap = await getDocs(appQuery);
        const apps: BeneficiaryApplication[] = [];
        appSnap.forEach((d) => apps.push(d.data() as BeneficiaryApplication));
        setApplications(apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.warn("Could not query user collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-12 h-12 rounded-full border-2 border-emerald-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {user.displayName || 'Zakat Donor Profile'}
              </h3>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 text-xs font-semibold flex items-center space-x-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preferences settings pill */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Preferred Madhhab:</span>
            <select
              value={profile?.madhhab || 'Shafii'}
              onChange={(e) => updatePreferences(currency, e.target.value as Madhhab)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="Shafii">Shafi'i (Jewelry Exempt)</option>
              <option value="Hanafi">Hanafi (All Jewelry Subject)</option>
              <option value="Maliki">Maliki</option>
              <option value="Hanbali">Hanbali</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Default Currency:</span>
            <select
              value={currency}
              onChange={(e) => {
                const newCurr = e.target.value as CurrencyCode;
                setCurrency(newCurr);
                updatePreferences(newCurr, profile?.madhhab || 'Shafii');
              }}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="SAR">SAR (﷼)</option>
              <option value="MYR">MYR (RM)</option>
            </select>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex space-x-2 mt-6 border-b border-slate-100 pb-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('calculations')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'calculations'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Saved Calculations ({calculations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disbursements')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'disbursements'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Disbursements & Receipts ({donations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'applications'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Aid Applications ({applications.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading your records from Firestore...
            </div>
          ) : activeTab === 'calculations' ? (
            calculations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No saved calculations yet. Use the Zakat Calculator to save your annual records.
              </div>
            ) : (
              <div className="space-y-3">
                {calculations.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        Zakat Obligation: {formatCurrency(c.zakatDue, c.currency)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Net Wealth: {formatCurrency(c.netZakatable, c.currency)} • Nisab: {formatCurrency(c.nisabThreshold, c.currency)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Calculated
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'disbursements' ? (
            donations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No disbursements recorded on this account yet.
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-bold text-emerald-800">
                        {d.receiptNumber}
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5">
                        {d.caseTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {d.zakatType} • {formatCurrency(d.amount, d.currency)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewCertificate(d)}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs bg-[#0F5132] text-white hover:bg-[#1B4332] transition-colors"
                    >
                      View Certificate
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            applications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                You have not submitted any aid applications yet.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        {a.beneficiaryAlias} ({a.category})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Requested: {formatCurrency(a.requestedAmount, a.currency)} • {a.location}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Submitted: {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Under Ward Review
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
