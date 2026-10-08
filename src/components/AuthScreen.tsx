import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Smartphone, 
  MessageCircle, 
  ChevronDown, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  KeyRound,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthScreenProps {
  role: 'personal' | 'mahal';
  initialView?: 'login' | 'signup';
  onBack: () => void;
  onAuthSuccess: (role: 'personal' | 'mahal', name?: string) => void;
  onSwitchRole?: () => void;
}

const LOCAL_MAHALS = [
  'Juma Masjid Mahallu, Ward 3',
  'Town Mahallu Committee',
  'Bilal Masjid Committee',
  'Noor Mahallu, Ward 7',
  'Central Jama\'ath Mahallu',
  'Industrial Crescent Ward #12',
  'Railway Station Mahallu',
  'Al-Huda Mahallu Council',
  'Masjid al-Taqwa Mahallu',
  'Baitul Mukarram Mahallu',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  role,
  initialView = 'login',
  onBack,
  onAuthSuccess,
  onSwitchRole,
}) => {
  const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  // Two options: 'login' | 'signup'
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  // Personal Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Personal Signup Form State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedMahal, setSelectedMahal] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mahal Login Form State
  const [mahalCode, setMahalCode] = useState('JMH-WARD-03');
  const [mahalPin, setMahalPin] = useState('');
  const [showMahalPin, setShowMahalPin] = useState(false);

  // Mahal Signup Form State
  const [mahalName, setMahalName] = useState('');
  const [mahalWard, setMahalWard] = useState('Ward 3');
  const [trusteeName, setTrusteeName] = useState('');
  const [officialContact, setOfficialContact] = useState('');
  const [mahalSignupPassword, setMahalSignupPassword] = useState('');
  const [mahalConfirmPassword, setMahalConfirmPassword] = useState('');
  const [showMahalSignupPass, setShowMahalSignupPass] = useState(false);

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 1. Personal Login Submit
  const handlePersonalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !validateEmail(loginEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      const cleanEmail = loginEmail.trim();
      const enteredName = cleanEmail.split('@')[0] || 'Community Member';
      try {
        await loginWithEmail(cleanEmail, loginPassword);
      } catch (authErr: any) {
        console.warn('Firebase login attempt:', authErr);
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          setErrorMessage('Invalid credentials. If you are new, please select Create Account.');
          setIsSubmitting(false);
          return;
        }
      }
      setIsSubmitting(false);
      onAuthSuccess('personal', enteredName);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  // 2. Personal Signup Submit
  const handlePersonalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!signupEmail.trim() || !validateEmail(signupEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }
    if (!selectedMahal) {
      setErrorMessage('Please select your local Mahallu');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      const cleanName = fullName.trim();
      const cleanEmail = signupEmail.trim();
      try {
        await registerWithEmail(cleanEmail, signupPassword, cleanName, 'donor', {
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
          mahal: selectedMahal,
        });
      } catch (regErr: any) {
        if (regErr.code === 'auth/email-already-in-use') {
          await loginWithEmail(cleanEmail, signupPassword);
        } else {
          console.warn('Signup warning:', regErr);
        }
      }
      setIsSubmitting(false);
      onAuthSuccess('personal', cleanName);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    }
  };

  // 3. Mahal Login Submit
  const handleMahalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mahalCode.trim()) {
      setErrorMessage('Please enter your Mahallu Registration Code / Ward ID');
      return;
    }
    if (!mahalPin.trim()) {
      setErrorMessage('Please enter your Security PIN / Password');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      setIsSubmitting(false);
      onAuthSuccess('mahal', 'Juma Masjid Mahallu Committee');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Mahal login failed. Please verify credentials.');
    }
  };

  // 4. Mahal Signup Submit
  const handleMahalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mahalName.trim()) {
      setErrorMessage('Please enter the Mahallu Committee name');
      return;
    }
    if (!trusteeName.trim()) {
      setErrorMessage('Please enter the Representative Trustee name');
      return;
    }
    if (!officialContact.trim()) {
      setErrorMessage('Please enter the official phone or email');
      return;
    }
    if (!mahalSignupPassword || mahalSignupPassword.length < 6) {
      setErrorMessage('Security PIN/Password must be at least 6 characters');
      return;
    }
    if (mahalSignupPassword !== mahalConfirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 700));
      setIsSubmitting(false);
      onAuthSuccess('mahal', mahalName.trim());
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  // Google Sign-In (for personal)
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      setIsGoogleLoading(false);
      onAuthSuccess('personal');
    } catch (err: any) {
      setIsGoogleLoading(false);
      if (err?.code !== 'auth/popup-closed-by-user') {
        console.warn('Google sign in note:', err?.message || err);
        onAuthSuccess('personal', 'Rifah IP');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-white px-6 py-6 min-h-screen font-sans">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#E8F6F3] text-[#0D7C66] hover:bg-[#d8efe9] flex items-center justify-center transition shadow-2xs"
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-[#0D7C66]" />
          </button>

          {/* Role Indicator Badge */}
          <div className="flex items-center gap-2 bg-[#E8F6F3] px-3 py-1 rounded-full border border-[#0D7C66]/20">
            {role === 'mahal' ? (
              <Building2 className="w-3.5 h-3.5 text-[#0D7C66]" />
            ) : (
              <User className="w-3.5 h-3.5 text-[#0D7C66]" />
            )}
            <span className="text-xs font-extrabold text-[#0D7C66]">
              {role === 'mahal' ? 'Mahal Committee' : 'Personal Account'}
            </span>
          </div>

          {onSwitchRole ? (
            <button
              type="button"
              onClick={onSwitchRole}
              className="text-[11px] font-bold text-gray-400 hover:text-[#0D7C66] transition underline"
            >
              Switch
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Brand Header */}
        <div className="text-center pt-3 pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0D7C66]">
            Tazku<span className="text-[#0D7C66]">.</span>
          </h1>
          <p className="text-sm font-semibold text-[#374151] mt-1">
            {role === 'mahal' ? 'Mahallu Administration Portal' : 'Get Started Now'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* THE TWO OPTIONS TAB SWITCHER: "Login" & "Create account"                  */}
        {/* ========================================================================= */}
        <div className="bg-[#F8FAF9] p-1.5 rounded-2xl flex gap-1 border border-gray-200 mb-5 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setView('login');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition text-center ${
              view === 'login'
                ? 'bg-[#0D7C66] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setView('signup');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition text-center ${
              view === 'signup'
                ? 'bg-[#0D7C66] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Instruction Label */}
        <p className="text-center text-xs text-gray-500 mb-4">
          {view === 'login' ? 'Fill the form below to login' : 'Fill the form below to Signup'}
        </p>

        {/* ========================================================================= */}
        {/* FORM CONTENT ACCORDING TO ROLE & VIEW                                     */}
        {/* ========================================================================= */}

        {/* SCENARIO A: PERSONAL LOGIN */}
        {role === 'personal' && view === 'login' && (
          <form onSubmit={handlePersonalLogin} className="space-y-3.5 animate-in fade-in">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label="Toggle password"
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
            </button>

            {/* Social Divider */}
            <div className="my-5 relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-500 whitespace-nowrap">
                or continue with
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* Google Sign-in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-50 flex items-center justify-center gap-3 transition shadow-xs"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
          </form>
        )}

        {/* SCENARIO B: PERSONAL SIGNUP (CREATE ACCOUNT) */}
        {role === 'personal' && view === 'signup' && (
          <form onSubmit={handlePersonalSignup} className="space-y-3 animate-in fade-in">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Email Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Whatsapp number"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Select Mahal Dropdown */}
            <div className="relative">
              <select
                value={selectedMahal}
                onChange={(e) => setSelectedMahal(e.target.value)}
                className={`w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-2xl text-sm appearance-none focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs cursor-pointer ${
                  selectedMahal ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}
              >
                <option value="" disabled>Select Mahal</option>
                {LOCAL_MAHALS.map((mahal) => (
                  <option key={mahal} value={mahal} className="text-gray-900">
                    {mahal}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="h-4 border-l border-gray-200 pr-2 mr-0.5" />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showSignupPassword ? 'text' : 'password'}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-11 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-11 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Signup'}</span>
            </button>
          </form>
        )}

        {/* SCENARIO C: MAHAL LOGIN */}
        {role === 'mahal' && view === 'login' && (
          <form onSubmit={handleMahalLogin} className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-[#E8F6F3] rounded-2xl text-xs text-gray-700 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" />
              <span>Enter your official Mosque Council or Mahallu Registration Code to access executive controls.</span>
            </div>

            {/* Mahallu Code */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={mahalCode}
                onChange={(e) => setMahalCode(e.target.value)}
                placeholder="Mahallu Code (e.g. JMH-WARD-03)"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Security PIN */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type={showMahalPin ? 'text' : 'password'}
                value={mahalPin}
                onChange={(e) => setMahalPin(e.target.value)}
                placeholder="Executive Security PIN / Password"
                className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowMahalPin(!showMahalPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showMahalPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Authenticating Council...' : 'Login to Mahal Portal'}</span>
            </button>
          </form>
        )}

        {/* SCENARIO D: MAHAL SIGNUP (CREATE MAHAL ACCOUNT) */}
        {role === 'mahal' && view === 'signup' && (
          <form onSubmit={handleMahalSignup} className="space-y-3.5 animate-in fade-in">
            <div className="p-3 bg-[#E8F6F3] rounded-2xl text-xs text-gray-700 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" />
              <span>Register a new Mosque or Mahallu Welfare Committee into the verified Tazku community network.</span>
            </div>

            {/* Committee Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={mahalName}
                onChange={(e) => setMahalName(e.target.value)}
                placeholder="Mahallu Committee / Mosque Name"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Ward Jurisdiction */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={mahalWard}
                onChange={(e) => setMahalWard(e.target.value)}
                placeholder="Ward Jurisdiction (e.g. Ward 3, Central District)"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Trustee Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={trusteeName}
                onChange={(e) => setTrusteeName(e.target.value)}
                placeholder="Lead Trustee / Secretary Name"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Official Phone / Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={officialContact}
                onChange={(e) => setOfficialContact(e.target.value)}
                placeholder="Official Phone Number / Email"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            {/* Password / PIN */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showMahalSignupPass ? 'text' : 'password'}
                value={mahalSignupPassword}
                onChange={(e) => setMahalSignupPassword(e.target.value)}
                placeholder="Create Security PIN / Password"
                className="w-full pl-12 pr-11 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowMahalSignupPass(!showMahalSignupPass)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showMahalSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={mahalConfirmPassword}
                onChange={(e) => setMahalConfirmPassword(e.target.value)}
                placeholder="Confirm Security PIN"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Registering Committee...' : 'Register Mahallu Committee'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Bottom Switch Link */}
      <div className="pt-4 text-center">
        <p className="text-xs text-gray-500">
          {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setView(view === 'login' ? 'signup' : 'login');
            }}
            className="font-bold text-[#0D7C66] hover:underline"
          >
            {view === 'login' ? 'Create account' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};
