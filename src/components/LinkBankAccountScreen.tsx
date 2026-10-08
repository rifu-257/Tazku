import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  CreditCard,
  ChevronDown,
  AlertCircle,
  User
} from 'lucide-react';

interface LinkBankAccountScreenProps {
  onSkip: () => void;
  onLinkSuccess: (bankDetails: { 
    bankName: string; 
    accountNumber: string; 
    ifsc: string;
    accountHolderName?: string;
    accountType?: string;
  }) => void;
  userName?: string;
  roleType?: 'personal' | 'mahal';
  existingBank?: { 
    bankName: string; 
    accountNumber: string; 
    ifsc: string;
    accountHolderName?: string;
    accountType?: string;
  } | null;
}

const POPULAR_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Federal Bank',
  'Axis Bank',
  'Kerala Gramin Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Kotak Mahindra Bank',
  'Other Bank',
];

export const LinkBankAccountScreen: React.FC<LinkBankAccountScreenProps> = ({
  onSkip,
  onLinkSuccess,
  userName = 'Community Member',
  roleType = 'personal',
  existingBank,
}) => {
  const [selectedBank, setSelectedBank] = useState(() => {
    if (!existingBank) return '';
    return POPULAR_BANKS.includes(existingBank.bankName) ? existingBank.bankName : 'Other Bank';
  });
  const [customBankName, setCustomBankName] = useState(() => {
    if (!existingBank) return '';
    return POPULAR_BANKS.includes(existingBank.bankName) ? '' : existingBank.bankName;
  });
  const [accountHolderName, setAccountHolderName] = useState(existingBank?.accountHolderName || userName);
  const [accountType, setAccountType] = useState(existingBank?.accountType || 'Savings Account');
  const [accountNumber, setAccountNumber] = useState(existingBank?.accountNumber || '');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(existingBank?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(existingBank?.ifsc || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (existingBank) {
      if (POPULAR_BANKS.includes(existingBank.bankName)) {
        setSelectedBank(existingBank.bankName);
        setCustomBankName('');
      } else {
        setSelectedBank('Other Bank');
        setCustomBankName(existingBank.bankName);
      }
      setAccountHolderName(existingBank.accountHolderName || userName);
      setAccountType(existingBank.accountType || 'Savings Account');
      setAccountNumber(existingBank.accountNumber || '');
      setConfirmAccountNumber(existingBank.accountNumber || '');
      setIfscCode(existingBank.ifsc || '');
    }
  }, [existingBank, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const activeBankName = selectedBank === 'Other Bank' ? customBankName.trim() : selectedBank;

    if (!activeBankName) {
      setErrorMessage('Please select or enter your bank name');
      return;
    }
    if (!accountNumber.trim() || accountNumber.length < 8) {
      setErrorMessage('Please enter a valid bank account number (at least 8 digits)');
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setErrorMessage('Account numbers do not match');
      return;
    }

    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      onLinkSuccess({
        bankName: activeBankName,
        accountNumber: accountNumber.trim(),
        ifsc: ifscCode.trim().toUpperCase() || 'SBIN0001234',
        accountHolderName: accountHolderName.trim() || userName,
        accountType: accountType,
      });
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-7 min-h-screen font-sans">
      <div>
        {/* Top Header with Skip Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0D7C66] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              T
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Tazku<span className="text-[#0D7C66]">.</span>
            </span>
          </div>

          {/* Prominent SKIP Option */}
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-1.5 rounded-full bg-[#E8F6F3] hover:bg-[#d8efe9] text-[#0D7C66] text-xs font-bold transition flex items-center gap-1 shadow-2xs"
          >
            <span>Skip for now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Title */}
        <div className="mt-7 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F6F3] text-[#0D7C66] flex items-center justify-center mb-3 shadow-2xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2 border border-emerald-200">
            <User className="w-3 h-3 text-[#0D7C66]" />
            <span>Account: {userName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Link Your Bank Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
            Connect your bank account to enable seamless 1-click Zakat disbursement and instant audited receipts.
          </p>
        </div>

        {/* Existing Linked Bank Notice */}
        {existingBank && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0D7C66] shrink-0" />
              <div>
                <span className="font-bold">Active in Firebase:</span> {existingBank.bankName} (••••{existingBank.accountNumber.slice(-4)})
                <span className="block text-[10px] text-emerald-700">You can update details below or continue.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-bold text-[#0D7C66] hover:underline px-2 py-1 bg-white rounded-lg border border-emerald-200 shadow-2xs cursor-pointer shrink-0"
            >
              Continue &rarr;
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Select Bank */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Select Your Bank
            </label>
            <div className="relative">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className={`w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm appearance-none focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs cursor-pointer ${
                  selectedBank ? 'text-gray-900 font-semibold' : 'text-gray-400'
                }`}
              >
                <option value="" disabled>Choose Bank Name</option>
                {POPULAR_BANKS.map((b) => (
                  <option key={b} value={b} className="text-gray-900">
                    {b}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Custom bank input if 'Other Bank' is selected */}
          {selectedBank === 'Other Bank' && (
            <div className="animate-in fade-in">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Enter Bank Name
              </label>
              <input
                type="text"
                value={customBankName}
                onChange={(e) => setCustomBankName(e.target.value)}
                placeholder="e.g. South Indian Bank"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>
          )}

          {/* 2. Account Holder Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="e.g. Asma Binte Rashid"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
            />
          </div>

          {/* 3. Account Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('Savings Account')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  accountType === 'Savings Account'
                    ? 'bg-[#E8F6F3] text-[#0D7C66] border-[#0D7C66]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                Savings Account
              </button>
              <button
                type="button"
                onClick={() => setAccountType('Current Account')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  accountType === 'Current Account'
                    ? 'bg-[#E8F6F3] text-[#0D7C66] border-[#0D7C66]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                Current Account
              </button>
            </div>
          </div>

          {/* 4. Account Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="password"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="•••• •••• •••• ••••"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-mono tracking-widest text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
            />
          </div>

          {/* 3. Confirm Account Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Re-enter Account Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value)}
              placeholder="Confirm account number"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
            />
          </div>

          {/* 4. IFSC Code (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              IFSC Code <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="e.g. HDFC0001234"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-mono uppercase text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
            />
          </div>

      

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLinking}
            className="w-full py-4 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            <span>{isLinking ? 'Verifying Account...' : 'Link Account & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Skip Button at bottom as well */}
      <div className="pt-6 text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition py-2"
        >
          I'll link my bank account later • <span className="underline">Skip to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
