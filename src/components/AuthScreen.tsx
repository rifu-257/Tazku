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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { syncUserProfile } from '../lib/firebase';

interface AuthScreenProps {
  initialView: 'login' | 'signup';
  onBackToOnboarding: () => void;
  onAuthSuccess: (donorName?: string) => void;
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
  initialView,
  onBackToOnboarding,
  onAuthSuccess,
}) => {
  const { signInWithGoogle } = useAuth();
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Form State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedMahal, setSelectedMahal] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!validateEmail(loginEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate/Authenticate
      await new Promise(r => setTimeout(r, 600));
      setIsSubmitting(false);
      onAuthSuccess(loginEmail.split('@')[0] || 'Raheem Panoly');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
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
    if (!signupPassword) {
      setErrorMessage('Please enter a password');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 700));
      setIsSubmitting(false);
      onAuthSuccess(fullName);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      setIsGoogleLoading(false);
      onAuthSuccess();
    } catch (err: any) {
      setIsGoogleLoading(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error("Google sign in failed:", err);
        // Fallback demo completion if popup was prevented or declined
        onAuthSuccess('Contributor User');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen font-sans">
      {/* 1. TOP NAVIGATION: Left-aligned teal back arrow */}
      <div className="pt-6 px-6 pb-2">
        <button
          type="button"
          onClick={onBackToOnboarding}
          className="w-10 h-10 rounded-full bg-[#E8F6F3] text-[#0D7C66] hover:bg-[#d8efe9] flex items-center justify-center transition shadow-2xs"
          title="Back to Onboarding"
          aria-label="Back to Onboarding"
        >
          <ArrowLeft className="w-5 h-5 text-[#0D7C66]" />
        </button>
      </div>

      {/* 2. BRAND HEADER (Centered) */}
      <div className="text-center pt-2 pb-5 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0D7C66] font-sans">
          Zakku<span className="text-[#0D7C66]">.</span>
        </h1>
        <p className="text-base font-semibold text-[#374151] mt-1.5">
          Get Started Now
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mx-6 mb-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: LOGIN PAGE                                                      */}
      {/* ========================================================================= */}
      {view === 'login' ? (
        <div className="flex-1 flex flex-col justify-between px-6 pb-8 animate-in fade-in duration-200">
          <div>
            {/* Instruction Label */}
            <p className="text-center text-xs text-gray-500 mb-5">
              Fill the form below to login
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* 1. Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
              </div>

              {/* 2. Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Primary Action Button: "Login" */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
              </button>
            </form>

            {/* Social Auth Divider */}
            <div className="my-6 relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-500 whitespace-nowrap">
                or continue with
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* Google Multicolored Button: "Continue with Google" */}
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
          </div>

          {/* Bottom Switch Link */}
          <div className="pt-6 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setView('signup');
                }}
                className="font-bold text-[#0D7C66] hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCREEN 2: SIGN UP / CREATE ACCOUNT PAGE                                   */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col justify-between px-6 pb-8 animate-in fade-in duration-200">
          <div>
            {/* Instruction Label */}
            <p className="text-center text-xs text-gray-500 mb-5">
              Fill the form below to Signup
            </p>

            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* 1. Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
              </div>

              {/* 2. Email Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
              </div>

              {/* 3. Phone Number */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
              </div>

              {/* 4. WhatsApp Number */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Whatsapp number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
              </div>

              {/* 5. Select Mahal Dropdown */}
              <div className="relative">
                <select
                  value={selectedMahal}
                  onChange={(e) => setSelectedMahal(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm appearance-none focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs cursor-pointer ${
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
                {/* Right Icon with subtle vertical divider */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <div className="h-5 border-l border-gray-200 pr-2.5 mr-0.5" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* 6. Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* 7. Confirm Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#0D7C66] focus:ring-1 focus:ring-[#0D7C66] transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Primary Action Button: "Signup" */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-[#0D7C66] hover:bg-[#0A6654] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Signup'}</span>
              </button>
            </form>

            {/* Social Auth Divider */}
            <div className="my-6 relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-500 whitespace-nowrap">
                or continue with
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* Google Multicolored Button: "Continue with Google" */}
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
          </div>

          {/* Bottom Switch Link */}
          <div className="pt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setView('login');
                }}
                className="font-bold text-[#0D7C66] hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
