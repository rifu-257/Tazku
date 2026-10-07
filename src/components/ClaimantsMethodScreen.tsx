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
  Filter
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

  // Filter claimants
  const filteredClaimants = claimants.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mahal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Al-Fuqara', 'Al-Gharimin', 'Medical Aid', 'Education', 'Widow Support'];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAF9] min-h-screen text-gray-900 font-sans pb-24">
      {/* 1. Header Banner */}
      <div className="bg-[#0D7C66] text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-sm relative">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white"
            title="Back to Dashboard"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] text-teal-100 font-bold uppercase tracking-wider block">
              100% Direct Local Disbursement
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Own Mahallu Claimants
            </h1>
          </div>
        </div>

        {/* Own Mahallu Jurisdiction Card (Fixed - No Distribution Method Switcher) */}
        <div className="mt-3 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-white">
                Juma Masjid Mahallu Committee
              </h2>
              <span className="text-[10px] bg-emerald-400 text-teal-950 px-2 py-0.5 rounded-full font-bold">
                Ward 3
              </span>
            </div>
            <p className="text-[11px] text-teal-100 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Verified local resident families in your own Mahallu</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Content Container */}
      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Search and Category Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified local claimants or needs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-[#0D7C66] shadow-2xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#0D7C66] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Verified Recipients ({filteredClaimants.length})
            </h3>
            <span className="text-[11px] text-[#0D7C66] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Physical Ward Audit Passed</span>
            </span>
          </div>

          {filteredClaimants.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-gray-200">
              <p className="text-xs text-gray-500 font-medium">
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
                  className="bg-white rounded-3xl p-4.5 border border-gray-100 shadow-xs hover:border-[#0D7C66]/30 transition space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.urgency === 'Urgent'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold bg-[#E8F6F3] text-[#0D7C66] px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{item.mahal}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-extrabold text-[#0D7C66] block">
                        ₹ {item.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">Target Aid</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100">
                    {item.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">
                        Funded: <strong className="text-gray-900">₹ {item.funded.toLocaleString()}</strong> ({percent}%)
                      </span>
                      <span className="text-gray-500">
                        Remaining: <strong className="text-[#0D7C66]">₹ {remaining.toLocaleString()}</strong>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0D7C66] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      ID: #{item.id} • Verified by Ward Elder
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectClaimant(item)}
                      className="py-2 px-4 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5"
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
