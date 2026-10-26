'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, ArrowRight, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { signUpWithEmailOtp, verifyEmailOtp, signInWithPassword, UserProfile } from '@/lib/auth';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await signUpWithEmailOtp(email.trim());
      setOtpSent(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to dispatch 6-digit verification code. Please check email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken || otpToken.trim().length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await verifyEmailOtp(email.trim(), otpToken.trim());
      if (user) {
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid or expired 6-digit OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await signInWithPassword(email.trim(), password);
      if (user) {
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid email or password credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-8 overflow-hidden text-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Monogram */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-md mb-3 border border-zinc-800">
            <div className="w-5 h-5 rounded-sm bg-gradient-to-tr from-emerald-400 to-cyan-400 rotate-45" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950">
            PRISM Intelligence
          </h2>
          <p className="mt-1 text-xs text-zinc-500 font-medium">
            Sovereign access to verified wires, AI briefings & daily digests
          </p>
        </div>

        {/* Auth Mode Segmented Pill */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80 mb-6">
          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              setTab('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Sign Up (6-Digit OTP)
          </button>
          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              setTab('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Sign In (Password)
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start space-x-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* SIGN UP WITH 6-DIGIT OTP FLOW */}
        {tab === 'signup' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="executive@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="apple-prominent-btn apple-btn w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Dispatching OTP...</span>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  Verification code dispatched to <strong>{email}</strong>. Enter the 6 digits below:
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="123456"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-2.5 tracking-[0.4em] font-mono text-center text-sm font-bold rounded-xl border border-zinc-200 bg-white text-zinc-950 focus:outline-none focus:border-zinc-950 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="apple-prominent-btn apple-btn flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <span>Verifying...</span> : <span>Verify & Access</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="px-3 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-600 hover:bg-zinc-50 cursor-pointer font-medium"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SIGN IN WITH PASSWORD FLOW */}
        {tab === 'signin' && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="executive@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="apple-prominent-btn apple-btn w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Supabase Security Footnote */}
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-center space-x-2 text-[11px] font-mono text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by Supabase Cloud Authentication</span>
        </div>
      </div>
    </div>
  );
}
