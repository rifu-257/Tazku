import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  Building2, 
  Sparkles, 
  Info, 
  ChevronRight,
  Filter,
  Globe,
  Check
} from 'lucide-react';
import { ClaimantItem } from '../types';

interface ClaimantsMethodScreenProps {
  onBack: () => void;
  onSelectClaimant: (claimant: ClaimantItem) => void;
  onOpenBlogGuide?: () => void;
  claimants: ClaimantItem[];
  onEntrustVakeel?: (vakeel: any) => void;
}

export const ClaimantsMethodScreen: React.FC<ClaimantsMethodScreenProps> = ({
  onBack,
  onSelectClaimant,
  claimants,
  onOpenBlogGuide,
  onEntrustVakeel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'own_mahal' | 'naqlu_zakat'>('own_mahal');

  // Filter claimants based on selected jurisdiction
  const filteredClaimants = claimants.filter(item => {
    const isOwnMahal = item.mahal.toLowerCase().includes('ward 3') || 
                       item.mahal.toLowerCase().includes('juma masjid');
    const matchesJurisdiction = selectedJurisdiction === 'own_mahal' ? isOwnMahal : !isOwnMahal;

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mahal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesJurisdiction && matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Al-Fuqara', 'Al-Gharimin', 'Medical Aid', 'Education', 'Widow Support'];

  return (
    <div className="flex-1 flex flex-col bg-[#FBFBF9] min-h-screen text-[#112A20] font-sans pb-24">
      {/* 1. Header Banner */}
      <div className="bg-[#1B4332] text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-sm relative">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white cursor-pointer"
            title="Back to Dashboard"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] text-[#F3EFE6] font-bold uppercase tracking-wider block">
              {selectedJurisdiction === 'own_mahal' ? '100% Direct Local Disbursement' : 'External Transfer Permissibility'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              {selectedJurisdiction === 'own_mahal' ? 'Own Mahallu Claimants' : 'Naqlu Zakat Recipients'}
            </h1>
          </div>
        </div>

        {/* Jurisdiction / Distribution Selector: Juma Masjid Mahallu Committee Ward 3 or Naqlu Zakat */}
        <div className="mt-3 space-y-2">
          {/* Toggle pill selector */}
          <div className="flex bg-black/20 p-1 rounded-2xl border border-white/15 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setSelectedJurisdiction('own_mahal')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedJurisdiction === 'own_mahal'
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-[#F3EFE6] hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Own Mahallu (Ward 3)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedJurisdiction('naqlu_zakat')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedJurisdiction === 'naqlu_zakat'
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-[#F3EFE6] hover:text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Naqlu Zakat</span>
            </button>
          </div>

          {/* Detailed Selected Option Card */}
          {selectedJurisdiction === 'own_mahal' ? (
            <div 
              onClick={() => setSelectedJurisdiction('own_mahal')}
              className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border-2 border-[#E9F3ED]/80 flex items-center justify-between gap-3 shadow-xs cursor-pointer transition hover:bg-white/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Building2 className="w-5 h-5 text-[#E9F3ED]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xs sm:text-sm font-extrabold text-white truncate">
                      Juma Masjid Mahallu Committee
                    </h2>
                    <span className="text-[10px] bg-[#E9F3ED] text-[#1B4332] px-2 py-0.5 rounded-full font-bold shrink-0">
                      Ward 3
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F3EFE6] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E9F3ED] shrink-0" />
                    <span className="truncate">Verified local resident families in your own Mahallu</span>
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center shrink-0 shadow-xs" title="Selected">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setSelectedJurisdiction('naqlu_zakat')}
              className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border-2 border-amber-300/80 flex items-center justify-between gap-3 shadow-xs cursor-pointer transition hover:bg-white/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xs sm:text-sm font-extrabold text-white truncate">
                      Naqlu Zakat (Transfer Outside)
                    </h2>
                    <span className="text-[10px] bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full font-bold shrink-0">
                      Outside Mahallu
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F3EFE6] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-200 shrink-0" />
                    <span className="truncate">Transfer to needy relatives, calamity zones & external Mahals</span>
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-300 text-amber-950 flex items-center justify-center shrink-0 shadow-xs" title="Selected">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Container */}
      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Search and Category Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#526059] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified local claimants or needs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBE5D8] rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-[#40916C] focus:ring-1 focus:ring-[#40916C] shadow-2xs text-[#112A20]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'bg-white text-[#526059] border border-[#EBE5D8] hover:bg-[#F3EFE6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Claimants List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-[#112A20] uppercase tracking-wider">
              Verified Recipients ({filteredClaimants.length})
            </h3>
            <span className="text-[11px] text-[#2D6A4F] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#40916C]" />
              <span>Physical Ward Audit Passed</span>
            </span>
          </div>

          {filteredClaimants.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EBE5D8]">
              <p className="text-xs text-[#526059] font-medium">
                No claimants found matching "{searchQuery}".
              </p>
            </div>
          ) : (
            filteredClaimants.map((item) => {
              const percent = Math.min(100, Math.round((item.funded / item.amount) * 100));
              const remaining = Math.max(0, item.amount - item.funded);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4.5 border border-[#EBE5D8] shadow-xs hover:border-[#40916C]/50 transition space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#112A20]">{item.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.urgency === 'Urgent'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-[#E9F3ED] text-[#1B4332] border border-[#40916C]/20'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold bg-[#E9F3ED] text-[#1B4332] px-2 py-0.5 rounded-md border border-[#40916C]/20">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-[#526059] flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-[#526059]" />
                          <span>{item.mahal}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-extrabold text-[#1B4332] block">
                        ₹ {item.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#526059] block">Target Aid</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#526059] leading-relaxed bg-[#FBFBF9] p-2.5 rounded-xl border border-[#EBE5D8]">
                    {item.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#526059]">
                        Funded: <strong className="text-[#112A20]">₹ {item.funded.toLocaleString()}</strong> ({percent}%)
                      </span>
                      <span className="text-[#526059]">
                        Remaining: <strong className="text-[#1B4332]">₹ {remaining.toLocaleString()}</strong>
                      </span>
                    </div>
                    <div className="w-full bg-[#EBE5D8] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1B4332] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-[#526059]">
                      ID: #{item.id} • Verified by Ward Elder
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectClaimant(item)}
                      className="py-2 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                      <span>{remaining > 0 ? 'Donate to Case' : 'View Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
