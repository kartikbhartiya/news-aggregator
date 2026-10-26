'use client';

import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Lock, Eye, EyeOff, AlertCircle, Cpu, TrendingUp, Building2, Landmark, Rocket, Film } from 'lucide-react';
import { NewsCategory } from '@/types/news';
import { updateUserPreferences, setUserPassword, UserProfile } from '@/lib/auth';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface OnboardingModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  onComplete: (updatedUser: UserProfile) => void;
}

const TOPIC_OPTIONS: Array<{ id: NewsCategory; label: string; icon: any; desc: string }> = [
  { id: 'tech', label: 'Tech & Silicon AI', icon: Cpu, desc: 'Semiconductors, LLMs, Quantum & Edge Compute' },
  { id: 'markets', label: 'Capital Markets', icon: TrendingUp, desc: 'Equities, Sovereign Bonds, Forex & Yields' },
  { id: 'business', label: 'Macro Economy', icon: Building2, desc: 'Central Banks, Industrial Capex & Inflation' },
  { id: 'world', label: 'Global Geopolitics', icon: Landmark, desc: 'Trade Corridors, Treaties & Diplomacy' },
  { id: 'science', label: 'Science & Aerospace', icon: Rocket, desc: 'Spaceflight, Clean Energy & Biotech' },
  { id: 'culture', label: 'Culture & Cinema', icon: Film, desc: 'Independent Film, Architecture & Society' },
];

export default function OnboardingModal({ isOpen, user, onComplete }: OnboardingModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(
    user?.preferences?.categories || ['tech', 'markets', 'business']
  );
  const [selectedEdition, setSelectedEdition] = useState<'india' | 'international'>(
    user?.preferences?.edition || 'international'
  );
  const [dailyDigest, setDailyDigest] = useState<boolean>(
    user?.preferences?.dailyDigestEmail !== false
  );

  // Mandatory password states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: NewsCategory, e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Check if user has an existing saved password or entered one here
    const userEmail = user?.email?.toLowerCase().trim() || '';
    const hasExistingPwd = typeof window !== 'undefined' && localStorage.getItem(`prism_pwd_${userEmail}`);

    if (!hasExistingPwd && !password) {
      setPasswordError('Please set your account password before completing onboarding.');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsSaving(true);

    try {
      if (password) {
        await setUserPassword(password);
      }

      const updated = await updateUserPreferences({
        categories: selectedCategories,
        edition: selectedEdition,
        dailyDigestEmail: dailyDigest,
        onboardingCompleted: true,
      });

      if (updated) {
        onComplete(updated);
      }
    } catch (err: any) {
      console.error(err);
      setPasswordError(err?.message || 'Failed to save account setup.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-[32px] bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-8 my-8 text-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-950 border border-zinc-200 text-[10px] font-mono font-bold tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-zinc-950" />
            <span>MEMBER PREFERENCES</span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-950">
            Configure Your Personal Intelligence Feed
          </h2>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            Choose your focus topics. Your personal feed will curate verified wire stories specifically for your selections.
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-6">
          {/* 1. Category Selection Grid */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-2.5">
              1. Select Focus Topics
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPIC_OPTIONS.map((topic) => {
                const isSelected = selectedCategories.includes(topic.id);
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.id}
                    onClick={(e) => toggleCategory(topic.id, e)}
                    className={`clay-card p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-zinc-950 text-white border-zinc-900 shadow-sm'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-white/10' : 'bg-white border border-zinc-200'}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-700'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{topic.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                      </div>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {topic.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Primary Edition Switcher */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-2">
              2. Preferred Edition Focus
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  setSelectedEdition('india');
                }}
                className={`apple-btn p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedEdition === 'india'
                    ? 'bg-zinc-950 text-white border-zinc-900 shadow-sm'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                }`}
              >
                <div className="text-base mb-1">🇮🇳</div>
                <div className="text-xs font-bold">India Wire</div>
                <div className={`text-[10px] mt-0.5 ${selectedEdition === 'india' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  The Hindu, NDTV, Livemint & TOI
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  setSelectedEdition('international');
                }}
                className={`apple-btn p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedEdition === 'international'
                    ? 'bg-zinc-950 text-white border-zinc-900 shadow-sm'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                }`}
              >
                <div className="text-base mb-1">🌐</div>
                <div className="text-xs font-bold">Global Wire</div>
                <div className={`text-[10px] mt-0.5 ${selectedEdition === 'international' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  NYT, BBC, Verge, Ars & HN
                </div>
              </button>
            </div>
          </div>

          {/* 3. Mandatory Password Setup */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-4 h-4 text-zinc-700" />
              <label className="text-xs font-mono font-bold uppercase text-zinc-800">
                3. Secure Account Password (Required)
              </label>
            </div>
            <p className="text-[11px] text-zinc-500 mb-3">
              Set your account password to enable password sign-in for future sessions.
            </p>

            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter secure password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
              />
            </div>

            {passwordError && (
              <div className="mt-2.5 flex items-center space-x-1.5 text-rose-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
          </div>

          {/* 4. Daily SMTP Email Digest Toggle */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-zinc-900">
                Hostinger SMTP Morning Digest
              </div>
              <div className="text-[11px] text-zinc-500">
                Curated briefing email via noreply@support.zarpit.com
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDailyDigest(!dailyDigest)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                dailyDigest ? 'bg-zinc-950' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  dailyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Complete Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="apple-prominent-btn apple-btn w-full py-3.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <span>Finalizing Profile...</span>
            ) : (
              <>
                <span>Complete Setup & Launch Personal Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
