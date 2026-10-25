'use client';

import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Globe, Cpu, TrendingUp, Building2, Landmark, Rocket, Film } from 'lucide-react';
import { NewsCategory } from '@/types/news';
import { updateUserPreferences, UserPreferences, UserProfile } from '@/lib/auth';
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

  const handleFinish = async (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    setIsSaving(true);

    try {
      const updated = await updateUserPreferences({
        categories: selectedCategories,
        edition: selectedEdition,
        dailyDigestEmail: dailyDigest,
        onboardingCompleted: true,
      });
      if (updated) {
        onComplete(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-[32px] bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-8 overflow-hidden text-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>EXECUTIVE ONBOARDING</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">
            Tailor Your Intelligence Stream
          </h2>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            Select the intelligence domains that matter most. PRISM will weight your dashboard feed, AI briefings, and daily SMTP dispatches.
          </p>
        </div>

        {/* 1. Category Selection Grid */}
        <div className="mb-6">
          <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-2.5">
            1. Select Primary Intelligence Domains (Multi-Select)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TOPIC_OPTIONS.map((topic) => {
              const isSelected = selectedCategories.includes(topic.id);
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={(e) => toggleCategory(topic.id, e)}
                  className={`apple-btn p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-900 shadow-sm'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200/80'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-white/10' : 'bg-white border border-zinc-200'}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-zinc-700'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{topic.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
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
        <div className="mb-6">
          <label className="block text-xs font-mono font-bold uppercase text-zinc-600 mb-2">
            2. Primary News Wire Edition
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

        {/* 3. Daily SMTP Email Digest Toggle */}
        <div className="mb-6 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-900">
              Hostinger SMTP Daily Digest
            </div>
            <div className="text-[11px] text-zinc-500">
              Receive a curated morning briefing email via noreply@support.zarpit.com
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

        {/* Finish Button */}
        <button
          type="button"
          onClick={handleFinish}
          disabled={isSaving}
          className="apple-prominent-btn apple-btn w-full py-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving Dossier...</span>
          ) : (
            <>
              <span>Launch Personalized PRISM Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
