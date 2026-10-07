import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Search, 
  ShieldCheck, 
  Coins, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  Sparkles, 
  AlertCircle,
  Filter,
  UserCheck
} from 'lucide-react';
import { BeneficiaryCase, QuranicCategory, CurrencyCode } from '../types';
import { formatCurrency, convertFromUSD, convertToUSD } from '../lib/currency';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';
import { INITIAL_BENEFICIARY_CASES } from '../data/initialCases';

interface CausesDirectoryProps {
  currency: CurrencyCode;
  onSelectCauseForDonation: (targetCase: BeneficiaryCase) => void;
  selectedCauseId?: string;
}

export const CausesDirectory: React.FC<CausesDirectoryProps> = ({
  currency,
  onSelectCauseForDonation,
}) => {
  const [cases, setCases] = useState<BeneficiaryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load from Firestore with live synchronization, or seed initial cases
  useEffect(() => {
    const casesCol = collection(db, 'cases');

    const unsubscribe = onSnapshot(casesCol, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial verified cases into Firestore so it has persistent live data
        for (const initialCase of INITIAL_BENEFICIARY_CASES) {
          try {
            await setDoc(doc(db, 'cases', initialCase.id), initialCase);
          } catch (e) {
            console.error("Error seeding initial case", e);
          }
        }
        setCases(INITIAL_BENEFICIARY_CASES);
      } else {
        const loaded: BeneficiaryCase[] = [];
        snapshot.forEach((d) => {
          loaded.push({ ...(d.data() as BeneficiaryCase), id: d.id });
        });
        setCases(loaded);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore listener fallback to initial cases:", error);
      setCases(INITIAL_BENEFICIARY_CASES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', label: 'All Verified Cases' },
    { id: 'Al-Fuqara', label: 'Al-Fuqara (Impoverished)' },
    { id: 'Al-Masakin', label: 'Al-Masakin (Needy)' },
    { id: 'Al-Gharimin', label: 'Al-Gharimin (Debt-Relief)' },
    { id: 'Medical Aid', label: 'Medical Emergencies' },
    { id: 'Education Support', label: 'Education Aid' },
    { id: 'Widow & Orphan Support', label: 'Widows & Orphans' },
    { id: 'Fi Sabilillah', label: 'Fi Sabilillah (Welfare)' },
  ];

  // Filtering
  const filteredCases = cases.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesQuery = 
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.beneficiaryAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.verifiedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-3">
          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Quranic Beneficiary Directory (As-Sadaqat 9:60)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Verified Recipient & Community Causes
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Every case is rigorously investigated and verified by local Mahallu ward committees. Beneficiary dignity is preserved through anonymized aliases.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by neighborhood ward, medical condition, debt-relief, or keyword..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Categories scrollable chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-80">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="h-16 bg-slate-100 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            </div>
          ))}
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No cases found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your category filter or search terms.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c) => {
            const targetInCurrency = convertFromUSD(c.targetAmount, currency);
            const raisedInCurrency = convertFromUSD(c.raisedAmount || 0, currency);
            const remainingInCurrency = Math.max(0, targetInCurrency - raisedInCurrency);
            const percentRaised = Math.min(100, Math.round(((c.raisedAmount || 0) / c.targetAmount) * 100));
            const isFunded = percentRaised >= 100;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header with category badge & urgency */}
                  <div className="p-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.category}
                      </span>
                      {c.urgency === 'urgent' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800 animate-pulse">
                          Urgent Priority
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                      {c.title}
                    </h3>

                    {/* Dignified alias & location */}
                    <div className="mt-2.5 flex items-center space-x-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{c.beneficiaryAlias}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{c.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Description */}
                  <div className="p-5 py-4 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Impact Metric callout */}
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{c.impactMetric}</span>
                    </div>

                    {/* Verification badge */}
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{c.verifiedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Quick Action */}
                <div className="p-5 pt-0">
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(raisedInCurrency, currency)}
                        </span>
                        <span className="text-slate-400 text-[11px]"> raised</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-600">
                          {formatCurrency(targetInCurrency, currency)}
                        </span>
                        <span className="text-slate-400 text-[11px]"> target</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isFunded ? 'bg-emerald-600' : 'bg-gradient-to-r from-amber-400 to-[#0F5132]'
                        }`}
                        style={{ width: `${percentRaised}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>{percentRaised}% funded</span>
                      <span className="font-medium text-emerald-800">
                        {isFunded ? 'Goal Met!' : `${formatCurrency(remainingInCurrency, currency)} needed`}
                      </span>
                    </div>
                  </div>

                  {/* Disburse Button */}
                  <button
                    type="button"
                    onClick={() => onSelectCauseForDonation(c)}
                    className="w-full mt-4 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#0F5132] text-white hover:bg-[#1B4332] transition-colors shadow-xs hover:shadow-emerald-900/10 flex items-center justify-center space-x-2"
                  >
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>{isFunded ? 'Contribute Surplus Relief' : 'Disburse Zakat / Sadaqah'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
