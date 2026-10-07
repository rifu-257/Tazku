import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  AlertTriangle, 
  Search, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  Coins, 
  Building2, 
  Sparkles,
  Info,
  ChevronRight,
  Award
} from 'lucide-react';
import { ClaimantItem } from '../types';

export type DistributionMethod = 'own_mahal' | 'other_mahal' | 'vakeel';

interface CertifiedVakeel {
  id: string;
  name: string;
  title: string;
  regNumber: string;
  mahalluJurisdiction: string;
  experienceYears: number;
  activeCasesManaged: number;
  rating: string;
  verifiedShariahBadge: string;
}

interface ClaimantsMethodScreenProps {
  onBack: () => void;
  onSelectClaimant: (claimant: ClaimantItem) => void;
  onOpenBlogGuide: () => void;
  onEntrustVakeel: (vakeel: CertifiedVakeel) => void;
  claimants: ClaimantItem[];
}

export const ClaimantsMethodScreen: React.FC<ClaimantsMethodScreenProps> = ({
  onBack,
  onSelectClaimant,
  onOpenBlogGuide,
  onEntrustVakeel,
  claimants,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<DistributionMethod>('own_mahal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Other Mahal selection state
  const otherMahals = [
    { id: 'om1', name: 'Wayanad Landslide Rehabilitation Ward', state: 'Kerala', urgentCases: 14 },
    { id: 'om2', name: 'Mewat Rural Educational Welfare Mahal', state: 'Haryana', urgentCases: 9 },
    { id: 'om3', name: 'Kashmir Valley Orphan Care Relief Ward', state: 'J&K', urgentCases: 12 },
    { id: 'om4', name: 'Sundarbans Coastal Cyclone Relief Mahal', state: 'West Bengal', urgentCases: 8 },
  ];
  const [selectedOtherMahal, setSelectedOtherMahal] = useState(otherMahals[0]);

  // Vetted certified local Vakeels
  const vakeels: CertifiedVakeel[] = [
    {
      id: 'vk_1',
      name: 'Usthad Abdul Hameed Faizy',
      title: 'Senior Fiqh Trustee & Registered Vakeel',
      regNumber: 'VK-2024-09',
      mahalluJurisdiction: 'Central Mahallu Shariah Council',
      experienceYears: 18,
      activeCasesManaged: 34,
      rating: '4.9/5',
      verifiedShariahBadge: 'Certified Islamic Fiqh Trustee (Wakalah)'
    },
    {
      id: 'vk_2',
      name: 'Usthad Zainuddin Baqavi',
      title: 'Mahallu Qazi & Designated Welfare Agent',
      regNumber: 'VK-2023-41',
      mahalluJurisdiction: 'North Regional Jama’ath Council',
      experienceYears: 14,
      activeCasesManaged: 28,
      rating: '5.0/5',
      verifiedShariahBadge: 'Authorized Mahallu Qazi Proxy'
    },
    {
      id: 'vk_3',
      name: 'Usthad Rasheed Saqafi',
      title: 'Authorized Religious Agent & Relief Auditor',
      regNumber: 'VK-2024-77',
      mahalluJurisdiction: 'Eastern Rural Jama’ath Federation',
      experienceYears: 11,
      activeCasesManaged: 22,
      rating: '4.8/5',
      verifiedShariahBadge: 'Certified Shariah Relief Auditor'
    },
  ];

  const categories = ['All', 'Al-Fuqara', 'Al-Gharimin', 'Medical Aid', 'Education', 'Widow Support'];

  const filteredClaimants = claimants.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = 
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mahal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF9] min-h-screen">
      {/* 1. Top Header: Solid #0D7C66 Teal rounded header banner */}
      <div className="bg-[#0D7C66] text-white pt-6 pb-12 px-5 rounded-b-[2.5rem] shadow-sm relative">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Claimants
          </h1>
        </div>
      </div>

      {/* 2. "Select Distribution Method" Card (Elevated overlapping card) */}
      <div className="px-5 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-2">
          <label className="block text-xs font-bold text-gray-900">
            Select Distribution Method
          </label>
          
          {/* Styled dropdown selector */}
          <div className="relative">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as DistributionMethod)}
              className="w-full bg-[#F8FAF9] hover:bg-white text-xs font-bold text-gray-800 py-3 pl-3.5 pr-10 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:bg-white focus:outline-hidden appearance-none cursor-pointer transition shadow-2xs"
            >
              <option value="own_mahal">
                1. Own Mahal (Local Neighborhood Beneficiaries)
              </option>
              <option value="other_mahal">
                2. Other Mahal - Naqlu Zakat (Distressed External Mahals)
              </option>
              <option value="vakeel">
                3. Vakeel (Entrust Authorized Religious Agent)
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <p className="text-[10px] text-gray-500 pt-0.5">
            {selectedMethod === 'own_mahal' && 'Prioritizes eligible destitute families within your home Mahallu jurisdiction.'}
            {selectedMethod === 'other_mahal' && 'Transfer Zakat to a different needy Mahal according to Fiqh provisions (Naqlu Zakat).'}
            {selectedMethod === 'vakeel' && 'Entrust your Zakat to a certified religious representative (Wakalah bil-Qabd).'}
          </p>
        </div>
      </div>

      {/* 3. Shariah Guidance Alert Box */}
      <div className="px-5 mt-4">
        <button
          type="button"
          onClick={onOpenBlogGuide}
          className="w-full bg-[#FEF9C3] hover:bg-[#fef08a] border border-[#FDE047] rounded-2xl p-3.5 flex items-start gap-2.5 transition text-left shadow-2xs"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              Refer to our blog before selecting a claimant to ensure the category and counts align with Zakat rules.
            </p>
            <span className="text-[11px] font-bold text-[#0D7C66] mt-1 inline-flex items-center gap-1">
              Read Fiqh Guidelines & Blog <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      </div>

      {/* 4. Dynamic Beneficiary / Assignment List */}
      <div className="flex-1 px-5 mt-5 pb-6 space-y-3">
        {/* ================= METHOD 1: OWN MAHAL ================= */}
        {selectedMethod === 'own_mahal' && (
          <div className="space-y-3">
            {/* Home Mahal Badge */}
            <div className="flex items-center justify-between p-3 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0D7C66]" />
                <span className="font-bold text-gray-900">Juma Masjid Central Ward #3</span>
              </div>
              <span className="text-[10px] font-bold text-[#0D7C66] bg-white px-2 py-0.5 rounded-full border border-[#0D7C66]/20">
                Home Mahal
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search claimant name or category..."
                className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-[#0D7C66] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Claimant Cards List */}
            <div className="space-y-3">
              {filteredClaimants.map((c) => {
                const percent = Math.min(100, Math.round((c.funded / c.amount) * 100));
                return (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0D7C66]/40 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                          <span className="text-[10px] bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-full font-bold">
                            {c.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{c.mahal}</p>
                      </div>

                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        {c.status}
                      </span>
                    </div>

                    {c.description && (
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0D7C66] rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-700">
                        <span>Target: ₹{c.amount.toLocaleString('en-IN')}</span>
                        <span className="text-[#0D7C66]">Raised: ₹{c.funded.toLocaleString('en-IN')} ({percent}%)</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => onSelectClaimant(c)}
                      className="w-full py-2.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Allot Zakat to {c.name.split(' ')[0]}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= METHOD 2: OTHER MAHAL (NAQLU ZAKAT) ================= */}
        {selectedMethod === 'other_mahal' && (
          <div className="space-y-3">
            {/* Fiqh Explanation Banner */}
            <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1.5 text-xs text-gray-700">
              <div className="flex items-center gap-1.5 font-bold text-[#0D7C66]">
                <Info className="w-4 h-4" />
                <span>Fiqh Ruling on Naqlu Zakat (Transfer of Funds)</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Classical jurisprudence permits transferring Zakat outside the home locality when a disaster, acute medical emergency, or severe famine strikes an external Muslim community, or when direct relatives reside there.
              </p>
            </div>

            {/* Other Mahal Selector Chips */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Select Needy Destination Mahal
              </label>
              <div className="space-y-2">
                {otherMahals.map((om) => {
                  const isSelected = selectedOtherMahal.id === om.id;
                  return (
                    <div
                      key={om.id}
                      onClick={() => setSelectedOtherMahal(om)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#E8F6F3] border-[#0D7C66] text-[#0D7C66] shadow-xs'
                          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs leading-snug">{om.name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {om.state} • {om.urgentCases} Vetted Relief Cases
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-[#0D7C66] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* External Claimants List */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-gray-800 mb-2">
                Vetted Cases in {selectedOtherMahal.name}
              </h3>
              <div className="space-y-3">
                {[
                  {
                    id: 'ext_1',
                    name: 'Displaced Hamlet Families (12 Huts)',
                    mahal: selectedOtherMahal.name,
                    category: 'Al-Fuqara',
                    amount: 60000,
                    funded: 38000,
                    status: 'Approved' as const,
                    description: 'Emergency shelter re-building and provision of clean drinking water.'
                  },
                  {
                    id: 'ext_2',
                    name: 'Subsidized Medical Dispensary',
                    mahal: selectedOtherMahal.name,
                    category: 'Medical Aid',
                    amount: 45000,
                    funded: 22000,
                    status: 'Approved' as const,
                    description: 'Emergency prescription supplies and critical pediatric treatments.'
                  }
                ].map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900">{c.name}</h4>
                          <span className="text-[10px] bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-full font-bold">
                            {c.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{c.mahal}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600">{c.description}</p>
                    <button
                      type="button"
                      onClick={() => onSelectClaimant(c)}
                      className="w-full py-2.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Transfer Zakat (Naqlu Zakat)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= METHOD 3: VAKEEL (AUTHORIZED AGENT) ================= */}
        {selectedMethod === 'vakeel' && (
          <div className="space-y-3">
            {/* Vakeel Concept Overview */}
            <div className="p-3.5 bg-[#E8F6F3] rounded-2xl border border-[#0D7C66]/20 space-y-1 text-xs text-gray-800">
              <div className="flex items-center gap-1.5 font-bold text-[#0D7C66]">
                <ShieldCheck className="w-4 h-4" />
                <span>Wakalah bil-Qabd (Entrusting Authorized Representatives)</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                If you are unsure of individual claimants or busy with work, Islamic Fiqh permits appointing a trusted, certified religious scholar or Mahallu Trustee to take possession of your Zakat on behalf of the poor.
              </p>
            </div>

            {/* Certified Vakeels List */}
            <div className="space-y-3">
              {vakeels.map((v) => (
                <div
                  key={v.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0D7C66]/30 transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#E8F6F3] text-[#0D7C66] font-bold text-base flex items-center justify-center border border-[#0D7C66]/20">
                        {v.name.split(' ')[1]?.[0] || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{v.name}</h4>
                        <span className="text-[11px] text-[#0D7C66] font-semibold block">{v.title}</span>
                        <span className="text-[10px] text-gray-400">{v.mahalluJurisdiction}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                      {v.regNumber}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#F8FAF9] rounded-xl flex items-center justify-between text-[11px] text-gray-600">
                    <span>{v.experienceYears} Years Service</span>
                    <span>•</span>
                    <span>{v.activeCasesManaged} Beneficiary Cases Audited</span>
                    <span>•</span>
                    <span className="font-bold text-[#0D7C66]">{v.rating} Verified</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEntrustVakeel(v)}
                    className="w-full py-2.5 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Entrust Zakat to {v.name.split(' ')[1] || v.name} (Wakalah)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
