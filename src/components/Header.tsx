import React, { useState } from 'react';
import { 
  Calculator, 
  HeartHandshake, 
  ShieldCheck, 
  FileText, 
  Coins, 
  User as UserIcon, 
  LogOut, 
  Globe, 
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CurrencyCode, Madhhab } from '../types';
import { CURRENCY_RATES } from '../lib/currency';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  nisabStandard: 'gold' | 'silver';
  setNisabStandard: (s: 'gold' | 'silver') => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  nisabStandard,
  setNisabStandard,
  onOpenProfile,
}) => {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign-in cancelled or failed", err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'calculator', label: 'Zakat Calculator', icon: Calculator },
    { id: 'causes', label: 'Verified Causes', icon: HeartHandshake },
    { id: 'transparency', label: 'Transparency Ledger', icon: ShieldCheck },
    { id: 'apply', label: 'Apply for Aid', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-[#0B3D26] text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Zero-Commission Fiqh Compliant Zakat Distribution Platform
            </span>
            <span className="hidden md:inline text-emerald-300/60">•</span>
            <span className="hidden md:inline text-emerald-200/80">
              Audited by Local Ward Committees
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Nisab Quick Toggle */}
            <div className="flex items-center space-x-1.5 bg-black/20 rounded-full px-2 py-0.5">
              <span className="text-[11px] text-emerald-200">Nisab:</span>
              <button
                type="button"
                onClick={() => setNisabStandard('gold')}
                className={`text-[11px] px-1.5 py-0.5 rounded-full transition-colors ${
                  nisabStandard === 'gold' 
                    ? 'bg-amber-400 text-emerald-950 font-semibold' 
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Gold (87.48g)
              </button>
              <button
                type="button"
                onClick={() => setNisabStandard('silver')}
                className={`text-[11px] px-1.5 py-0.5 rounded-full transition-colors ${
                  nisabStandard === 'silver' 
                    ? 'bg-amber-400 text-emerald-950 font-semibold' 
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Silver (612.36g)
              </button>
            </div>

            {/* Currency selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center space-x-1 text-[11px] text-emerald-200 hover:text-white bg-black/20 px-2 py-0.5 rounded-full"
              >
                <Globe className="w-3 h-3" />
                <span className="font-semibold">{currency}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {currencyDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 text-slate-800 z-50">
                  {Object.entries(CURRENCY_RATES).map(([code, meta]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code as CurrencyCode);
                        setCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                        currency === code ? 'font-bold text-emerald-800 bg-emerald-50/60' : ''
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-slate-400">{meta.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button 
            type="button"
            onClick={() => setActiveTab('overview')} 
            className="flex items-center space-x-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F5132] to-[#1B4332] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-amber-400/30">
              <div className="relative flex items-center justify-center">
                {/* Islamic stylized crescent leaf emblem */}
                <Coins className="w-5 h-5 text-amber-300" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-[#0F5132]">
                  Tazku
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  تزكوا
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Transparent & Dignified Zakat
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F5132]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & User Profile */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-emerald-50 border border-slate-200 text-slate-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full border border-emerald-600"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0F5132] text-white hover:bg-[#1B4332] shadow-sm transition-all disabled:opacity-50"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>{isSigningIn ? 'Connecting...' : 'Sign In with Google'}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-[#0F5132] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-700" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
