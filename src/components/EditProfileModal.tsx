import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  MessageSquare,
  Building2,
  BookOpen,
  DollarSign,
  Check,
  AlertCircle,
  Save,
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CurrencyCode, Madhhab } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (updatedName?: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
];

const MAHAL_OPTIONS = [
  'Juma Masjid Central Ward #3 (Audited)',
  'Baitul Aman Mahallu Committee',
  'Noorul Islam Juma Masjid, Ward 1',
  'Madina Town Mahallu Trust',
  'Custom Mahallu / Other',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  const { user, profile, updateProfileDetails } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [mahal, setMahal] = useState('');
  const [madhhab, setMadhhab] = useState<Madhhab>('Shafii');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('INR');
  const [photoURL, setPhotoURL] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form when opened or profile changes
  useEffect(() => {
    if (isOpen) {
      const storedCustomName = typeof window !== 'undefined' ? localStorage.getItem('tazku_entered_name') : '';
      const initialName = profile?.displayName || user?.displayName || storedCustomName || (user?.email ? user.email.split('@')[0] : 'Community Member');
      setDisplayName(initialName);
      setPhoneNumber(profile?.phoneNumber || '');
      setWhatsappNumber(profile?.whatsappNumber || profile?.phoneNumber || '');
      setMahal(profile?.mahal || 'Juma Masjid Central Ward #3 (Audited)');
      setMadhhab(profile?.madhhab || 'Shafii');
      setPreferredCurrency(profile?.preferredCurrency || 'INR');
      setPhotoURL(profile?.photoURL || user?.photoURL || '');
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen, profile, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage('Please enter your display name.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const trimmedName = displayName.trim();
      await updateProfileDetails({
        displayName: trimmedName,
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim(),
        mahal: mahal.trim(),
        madhhab,
        preferredCurrency,
        photoURL: photoURL.trim() || undefined,
      });

      // Always save to localStorage for instant local sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('tazku_entered_name', trimmedName);
      }

      setSuccessMessage('Profile details updated successfully!');
      if (onSaveSuccess) {
        onSaveSuccess(trimmedName);
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-[#0D7C66]/20 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        {/* Header */}
        <div className="bg-[#0D7C66] text-white p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/20">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="edit-profile-title" className="text-lg font-extrabold tracking-tight">
                Edit Profile Details
              </h2>
              <p className="text-xs text-teal-100">
                Update personal info, contacts & preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs text-gray-700 flex-1">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-800 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Profile Avatar Selection */}
          <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-gray-100 space-y-2.5">
            <label className="text-[11px] font-bold text-gray-800 block">
              Profile Photo / Avatar
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#0D7C66] text-white font-extrabold text-xl flex items-center justify-center shrink-0 overflow-hidden shadow-xs border-2 border-white ring-2 ring-[#0D7C66]/20">
                {photoURL ? (
                  <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span>
                    {(displayName || 'CM')
                      .split(' ')
                      .filter(Boolean)
                      .map(w => w[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoURL(preset)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition hover:scale-105 cursor-pointer ${
                        photoURL === preset ? 'border-[#0D7C66] ring-2 ring-[#0D7C66]/30' : 'border-gray-200 opacity-80 hover:opacity-100'
                      }`}
                      title={`Choose Preset Avatar ${idx + 1}`}
                    >
                      <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {photoURL && (
                    <button
                      type="button"
                      onClick={() => setPhotoURL('')}
                      className="text-[10px] text-gray-500 hover:text-red-600 ml-1 underline cursor-pointer"
                    >
                      Use Initials
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Or paste custom photo URL..."
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full text-[11px] px-2.5 py-1.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden bg-white"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0D7C66]" />
              <span>Full Name / Display Name *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Muhammed Shafi"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] focus:outline-hidden text-xs bg-white text-gray-900 font-medium"
            />
          </div>

          {/* Contact Numbers: Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0D7C66]" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98471 28910"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden text-xs bg-white text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98471 28910"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden text-xs bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Registered Mahallu */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0D7C66]" />
              <span>Registered Mahallu Jurisdiction</span>
            </label>
            <select
              value={mahal}
              onChange={(e) => setMahal(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden text-xs bg-white text-gray-900 font-medium"
            >
              {MAHAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Fiqh Madhhab & Currency Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0D7C66]" />
                <span>Fiqh Madhhab</span>
              </label>
              <select
                value={madhhab}
                onChange={(e) => setMadhhab(e.target.value as Madhhab)}
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden text-xs bg-white text-gray-900 font-medium"
              >
                <option value="Shafii">Shafi'i (شافعي)</option>
                <option value="Hanafi">Hanafi (حنفي)</option>
                <option value="Maliki">Maliki (مالكي)</option>
                <option value="Hanbali">Hanbali (حنبلي)</option>
              </select>
              <span className="text-[10px] text-gray-400 block">Determines Nisab & jewelry exemption rules</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#0D7C66]" />
                <span>Preferred Currency</span>
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#0D7C66] focus:outline-hidden text-xs bg-white text-gray-900 font-medium"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="AED">AED (د.إ) - UAE Dirham</option>
                <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="MYR">MYR (RM) - Malaysian Ringgit</option>
              </select>
              <span className="text-[10px] text-gray-400 block">Default currency for nisab and calculations</span>
            </div>
          </div>

          {/* Account Status Information */}
          <div className="bg-[#E8F6F3]/60 p-3 rounded-2xl border border-[#0D7C66]/15 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#0A6654] leading-relaxed">
              Your profile changes are synchronized with your account and reflected across all your Mahallu receipts, zakat calculations, and official tax certificates.
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0D7C66] hover:bg-[#0A6654] text-white shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
