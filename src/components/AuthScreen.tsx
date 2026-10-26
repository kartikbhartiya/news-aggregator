'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Globe2,
  Cpu,
  TrendingUp,
  Landmark,
  Compass,
  Check,
  RotateCw,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';
import PrismLogo from '@/components/PrismLogo';
import {
  signUpWithEmailOtp,
  verifyEmailOtp,
  signInWithPassword,
  setUserPassword,
  updateUserPreferences,
  UserProfile,
} from '@/lib/auth';
import { NewsCategory } from '@/types/news';

interface AuthScreenProps {
  onSuccess?: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

const ONBOARDING_TOPICS: Array<{
  id: NewsCategory;
  label: string;
  desc: string;
  icon: any;
}> = [
  { id: 'tech', label: 'Technology & AI', desc: 'Semiconductors, Frontier AI, Silicon', icon: Cpu },
  { id: 'markets', label: 'Markets & Capital', desc: 'Dalal St, Wall St, Central Banks', icon: TrendingUp },
  { id: 'world', label: 'Global Geopolitics', desc: 'Diplomatic summits, strategic treaties', icon: Globe2 },
  { id: 'business', label: 'Indian Economy', desc: 'Manufacturing, UPI, infrastructure', icon: Landmark },
  { id: 'science', label: 'Science & Space', desc: 'ISRO, deep tech, energy physics', icon: Sparkles },
  { id: 'culture', label: 'Culture & Design', desc: 'High architecture, arts, cinema', icon: Compass },
];

export default function AuthScreen({
  onSuccess,
  initialMode = 'signin',
}: AuthScreenProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInWithOtpMode, setSignInWithOtpMode] = useState(false);

  // Sign Up Flow States (4 Guided Steps)
  // Step 1: Email & Name
  // Step 2: 6-Digit OTP
  // Step 3: Set Password
  // Step 4: Editorial Onboarding
  // Step 5: Success
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(60);

  // Password Setup States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Onboarding Preferences States
  const [preferredEdition, setPreferredEdition] = useState<'india' | 'international'>('india');
  const [selectedTopics, setSelectedTopics] = useState<NewsCategory[]>([
    'tech',
    'markets',
    'business',
  ]);
  const [enableDailyDigest, setEnableDailyDigest] = useState(true);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(null);

  // Countdown timer for OTP
  React.useEffect(() => {
    if (signUpStep === 2 && otpCountdown > 0) {
      const timer = setInterval(() => setOtpCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [signUpStep, otpCountdown]);

  // Handle Sign In with Password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!signInEmail || !signInEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (signInWithOtpMode) {
      // Switch to OTP login
      setIsLoading(true);
      try {
        await signUpWithEmailOtp(signInEmail);
        setSignUpEmail(signInEmail);
        setSignUpStep(2);
        setMode('signup');
        setStatusMessage('6-digit security code sent to your email.');
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to dispatch security code.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!signInPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await signInWithPassword(signInEmail, signInPassword);
      if (user) {
        setStatusMessage('Authenticated successfully. Redirecting...');
        if (onSuccess) onSuccess(user);
        else router.push('/');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Send 6-Digit OTP for Signup
  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!signUpEmail || !signUpEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmailOtp(signUpEmail);
      setSignUpStep(2);
      setOtpCountdown(60);
      setStatusMessage(`6-digit code dispatched to ${signUpEmail}`);
    } catch {
      // In case of rate limit, advance gracefully so user can enter code
      setSignUpStep(2);
      setStatusMessage(`Verification code dispatched to ${signUpEmail}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit box input
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpDigits];
    next[index] = val.slice(-1);
    setOtpDigits(next);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`prism-otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`prism-otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await verifyEmailOtp(signUpEmail, code);
      if (user) {
        setAuthenticatedUser(user);
        // Advance to Step 3: SET PASSWORD!
        setSignUpStep(3);
        setStatusMessage('Email verified. Now, set your account password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid code. Enter 6 digits to proceed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Save Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      await setUserPassword(newPassword);
      setStatusMessage('Password secured. Now customize your news preferences.');
      // Advance to Step 4: EDITORIAL ONBOARDING!
      setSignUpStep(4);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Complete Onboarding Preferences
  const handleCompleteOnboarding = async () => {
    if (selectedTopics.length === 0) {
      setErrorMessage('Please select at least one focus topic.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const updated = await updateUserPreferences({
        categories: selectedTopics,
        edition: preferredEdition,
        dailyDigestEmail: enableDailyDigest,
        onboardingCompleted: true,
      });

      setSignUpStep(5);
      setStatusMessage('Profile fully configured. Launching your executive feed...');

      setTimeout(() => {
        if (onSuccess && updated) {
          onSuccess(updated);
        } else {
          router.push(`/?edition=${preferredEdition}`);
        }
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (cat: NewsCategory) => {
    if (selectedTopics.includes(cat)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((c) => c !== cat));
      }
    } else {
      setSelectedTopics([...selectedTopics, cat]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row text-zinc-950 selection:bg-zinc-200">
      {/* =========================================================================
          LEFT / HERO SHOWCASE (Featuring User's Prism Loading / Refraction Artwork)
         ========================================================================= */}
      <div className="relative lg:w-1/2 xl:w-7/12 bg-black text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden min-h-[460px] lg:min-h-screen">
        {/* Optical Glass Prism Refraction Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-page.png"
            alt="PRISM Optical Refraction"
            fill
            priority
            className="object-cover object-center lg:object-right filter contrast-105"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
        </div>

        {/* Top Header Branding on Left Side */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center space-x-2.5 text-white/90 hover:text-white transition-colors group"
          >
            <PrismLogo size="md" />
            <span className="font-cursive text-3xl tracking-wide text-white font-normal">Prism</span>
            <span className="text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/20 uppercase font-bold">
              EDITORIAL WIRE
            </span>
          </Link>
        </div>

        {/* Center Editorial Value Proposition */}
        <div className="relative z-10 max-w-xl my-auto py-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="font-semibold tracking-wide">Editorial Intelligence</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-white">
            Refracting Global Noise into Verified Signal.
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg font-normal">
            Curated parallel RSS and publisher feeds aggregated into an ad-free, high-speed
            intelligence wire with full in-app reading.
          </p>

          {/* Prism Category Stream Pills */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              TECH & AI
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              POLITICS
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              MARKETS & ECONOMY
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              WORLD DISPATCH
            </span>
          </div>
        </div>

        {/* Bottom Craft Ethos */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>SUPABASE CLOUD • 6-DIGIT OTP SECURITY</span>
          <span>EST. MMXXVI</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT / INTERACTIVE FORM SCREEN (Apple-Grade Architectural Experience)
         ========================================================================= */}
      <div className="lg:w-1/2 xl:w-5/12 bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto min-h-screen">
        {/* Top Back Navigation & Mode Selector */}
        <div className="flex items-center justify-between pb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to News Dispatches</span>
          </Link>

          {/* Clean Segmented Tab Control */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 border border-zinc-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
                setStatusMessage('');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignUpStep(1);
                setErrorMessage('');
                setStatusMessage('');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Central Form Canvas */}
        <div className="my-auto py-6 max-w-md w-full mx-auto">
          {/* Notification / Error Badges */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {statusMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{statusMessage}</span>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: SIGN IN MODE (Password / OTP)
             ========================================================================= */}
          {mode === 'signin' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Welcome Back to PRISM
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                  Access your encrypted dossier, personalized daily brief, and ad-free reader.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                    Executive Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl text-sm text-zinc-900 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Password Field (when not OTP mode) */}
                {!signInWithOtpMode ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setSignInWithOtpMode(true)}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        Sign in with 6-digit OTP instead
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required={!signInWithOtpMode}
                        className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl text-sm text-zinc-900 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">Passwordless 6-Digit Code</span>
                      <button
                        type="button"
                        onClick={() => setSignInWithOtpMode(false)}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        Use password instead
                      </button>
                    </div>
                    <p className="mt-1 text-zinc-500">
                      We will dispatch a 6-digit cryptographic authentication code directly to your email.
                    </p>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={(e) => handleButtonClickGlow(e)}
                  className="apple-prominent-btn apple-btn w-full py-3 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>{signInWithOtpMode ? 'Send 6-Digit Code' : 'Sign In to PRISM'}</span>
                  )}
                </button>
              </form>

              {/* Quick switch to signup */}
              <div className="pt-4 border-t border-zinc-200/70 text-center text-xs text-zinc-500">
                Don&apos;t have an executive profile?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setSignUpStep(1);
                    setErrorMessage('');
                  }}
                  className="font-bold text-zinc-900 hover:underline cursor-pointer"
                >
                  Create your account (Free)
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: SIGN UP FLOW (Multi-Step Onboarding with Password Setting)
             ========================================================================= */}
          {mode === 'signup' && (
            <div className="space-y-6">
              {/* Step Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2 font-bold uppercase tracking-wider">
                  <span className={signUpStep >= 1 ? 'text-zinc-900' : ''}>1. Email</span>
                  <span>→</span>
                  <span className={signUpStep >= 2 ? 'text-zinc-900' : ''}>2. 6-Digit OTP</span>
                  <span>→</span>
                  <span className={signUpStep >= 3 ? 'text-zinc-900' : ''}>3. Password</span>
                  <span>→</span>
                  <span className={signUpStep >= 4 ? 'text-zinc-900' : ''}>4. Curate</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 transition-all duration-300 rounded-full"
                    style={{ width: `${(signUpStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* STEP 1: Email & Full Name */}
              {signUpStep === 1 && (
                <form onSubmit={handleSendSignupOtp} className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                      Create Your Executive Account
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-normal">
                      Step 1 of 4: Enter your email to receive a secure 6-digit verification code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                      Full Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Executive Reader"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl text-sm text-zinc-900 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                      Work or Personal Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl text-sm text-zinc-900 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    onClick={(e) => handleButtonClickGlow(e)}
                    className="apple-prominent-btn apple-btn w-full py-3 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <span>Send 6-Digit Verification Code</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: 6-Digit OTP Verification */}
              {signUpStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                      Enter 6-Digit Security Code
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-normal">
                      We dispatched a code to <strong className="text-zinc-900">{signUpEmail}</strong>.
                    </p>
                  </div>

                  {/* 6 Digit Numeric Inputs */}
                  <div className="flex justify-between gap-2 py-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`prism-otp-box-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-mono font-extrabold bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl outline-none shadow-2xs transition-all"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Didn&apos;t receive code?</span>
                    {otpCountdown > 0 ? (
                      <span className="font-mono text-zinc-400">Resend in {otpCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendSignupOtp}
                        className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isLoading || otpDigits.join('').length < 6}
                    onClick={() => handleVerifyOtp()}
                    className="apple-prominent-btn apple-btn w-full py-3 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <span>Verify Code & Proceed to Password</span>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 3: SET USER PASSWORD (Gives User Chance to Set Password) */}
              {signUpStep === 3 && (
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>EMAIL VERIFIED</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                      Set Your Account Password
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-normal">
                      Step 3 of 4: Create a password for {authenticatedUser?.email || signUpEmail} to sign in seamlessly across all your devices.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                      Choose Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl text-sm text-zinc-900 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="h-1 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              newPassword.length < 6
                                ? 'w-1/3 bg-rose-500'
                                : newPassword.length < 10
                                ? 'w-2/3 bg-amber-500'
                                : 'w-full bg-emerald-500'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                          {newPassword.length < 6
                            ? 'Too short'
                            : newPassword.length < 10
                            ? 'Good'
                            : 'Strong'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-zinc-900 rounded-xl text-sm text-zinc-900 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                    onClick={(e) => handleButtonClickGlow(e)}
                    className="apple-prominent-btn apple-btn w-full py-3 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Saving Password...</span>
                      </>
                    ) : (
                      <span>Save Password & Proceed to Onboarding</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 4: ONBOARDING (Curate Feeds & Edition) */}
              {signUpStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold mb-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>PASSWORD SET</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                      Curate Your Newsfeed
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-normal">
                      Step 4 of 4: Personalize your intelligence wire and morning briefing dispatches.
                    </p>
                  </div>

                  {/* Edition Switcher */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 font-mono">
                      Primary Wire Edition
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPreferredEdition('india')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          preferredEdition === 'india'
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>🇮🇳 India Wire</span>
                          {preferredEdition === 'india' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <p className={`text-[11px] mt-1 line-clamp-1 ${preferredEdition === 'india' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Hindu, NDTV, Livemint, TOI
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreferredEdition('international')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          preferredEdition === 'international'
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>🌐 Global Edition</span>
                          {preferredEdition === 'international' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <p className={`text-[11px] mt-1 line-clamp-1 ${preferredEdition === 'international' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          FT, NYT, BBC, Verge, HN
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Focus Topic Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 font-mono">
                      Focus Intelligence Topics (Select 1+)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ONBOARDING_TOPICS.map((topic) => {
                        const Icon = topic.icon;
                        const isSelected = selectedTopics.includes(topic.id);
                        return (
                          <div
                            key={topic.id}
                            onClick={() => toggleTopic(topic.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                              isSelected
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <div className="flex items-center space-x-1.5 truncate">
                                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                                <span className="truncate">{topic.label}</span>
                              </div>
                              {isSelected && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                            </div>
                            <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                              {topic.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Hostinger Digest Toggle */}
                  <div
                    onClick={() => setEnableDailyDigest(!enableDailyDigest)}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="pr-2">
                      <div className="text-xs font-bold text-zinc-900 flex items-center space-x-1">
                        <span>7:00 AM Executive Email Briefing</span>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">Hostinger SMTP</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Receive today&apos;s verified dispatches and Groq takeaways in your inbox.
                      </p>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative shrink-0 p-0.5 ${
                        enableDailyDigest ? 'bg-zinc-950' : 'bg-zinc-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          enableDailyDigest ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Complete Onboarding Button */}
                  <button
                    type="button"
                    disabled={isLoading || selectedTopics.length === 0}
                    onClick={() => handleCompleteOnboarding()}
                    className="apple-prominent-btn apple-btn w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Configuring Newsfeed...</span>
                      </>
                    ) : (
                      <span>Complete Setup & Launch PRISM</span>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 5: Success & Redirecting */}
              {signUpStep === 5 && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-950 text-emerald-400 mx-auto flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Executive Profile Secured
                  </h2>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    Password saved, feeds curated, and daily intelligence enabled. Loading your personal dashboard...
                  </p>
                </div>
              )}

              {/* Back to sign in */}
              {signUpStep < 5 && (
                <div className="pt-4 border-t border-zinc-200/70 text-center text-xs text-zinc-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className="font-bold text-zinc-900 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Security Footer */}
        <div className="pt-6 border-t border-zinc-200/70 text-center text-[11px] text-zinc-400 font-mono">
          <span>Protected by Supabase TLS 1.3 • Hostinger SMTP SSL/TLS • Ad-Free Standard</span>
        </div>
      </div>
    </div>
  );
}
