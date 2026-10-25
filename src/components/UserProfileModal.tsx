'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Send, 
  ShieldCheck, 
  Sliders, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw,
  ExternalLink,
  Clock,
  Compass
} from 'lucide-react';
import { UserProfile, signOutUser } from '@/lib/auth';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenOnboarding: () => void;
  onSignOut: () => void;
  onOpenBriefing: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onOpenOnboarding,
  onSignOut,
  onOpenBriefing,
}: UserProfileModalProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen || !user) return null;

  const handleSendTestNewsletter = async (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userName: user.fullName || user.email.split('@')[0],
          edition: user.preferences?.edition || 'international',
          categories: user.preferences?.categories || [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatus({
          success: true,
          message: `Dispatched successfully to ${user.email} via Hostinger SMTP (ID: ${data.messageId?.slice(0, 16)}...)`,
        });
      } else {
        setEmailStatus({
          success: false,
          message: data.error || 'Failed to dispatch via Hostinger SMTP.',
        });
      }
    } catch (err: any) {
      setEmailStatus({
        success: false,
        message: err?.message || 'Network error communicating with SMTP gateway.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSignOutClick = async (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    await signOutUser();
    onSignOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-8 text-zinc-950"
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

        {/* Profile Header */}
        <div className="flex items-center space-x-4 pb-6 border-b border-zinc-100">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.fullName || 'User Avatar'}
              className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-sm object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight truncate">
                {user.fullName || user.email.split('@')[0]}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{user.email}</p>
            <p className="text-[11px] text-zinc-400 mt-1">PRISM Executive Intelligence Member</p>
          </div>
        </div>

        {/* 1. Personalized Daily AI Briefing Banner */}
        <div className="my-6 p-4 rounded-2xl bg-zinc-950 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10px] font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 mr-1" />
              <span>PERSONALIZED AI BRIEF</span>
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {user.preferences?.edition === 'india' ? '🇮🇳 India Edition' : '🌐 Global Wire'}
            </span>
          </div>

          <h4 className="text-base font-extrabold tracking-tight">
            Tailored to your selected domains ({user.preferences?.categories?.join(', ') || 'Tech, Markets'})
          </h4>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-emerald-400 font-medium">Groq Neural Synthesis Active</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBriefing();
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-100 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>Open 3-Min Brief</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Hostinger SMTP Daily Digest Dispatch (Testing Button) */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">Hostinger SMTP Daily Digest</h4>
                <p className="text-[11px] text-zinc-500">Gateway: smtp.hostinger.com:465 (SSL)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-mono text-[10px] font-bold border border-zinc-200">
              noreply@support.zarpit.com
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            Test the automated daily news briefing dispatch to your mailbox. PRISM compiles today's top verified dispatches into an Apple-grade responsive email.
          </p>

          <button
            type="button"
            onClick={handleSendTestNewsletter}
            disabled={isSendingEmail}
            className="apple-prominent-btn apple-btn w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSendingEmail ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching via Hostinger SMTP...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Daily Digest to My Email</span>
              </>
            )}
          </button>

          {/* Email Status Notification */}
          {emailStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
              emailStatus.success 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {emailStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-mono">{emailStatus.message}</span>
            </div>
          )}
        </div>

        {/* 3. News Preferences Management */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-950 uppercase font-mono tracking-wider">
              My Intelligence Domains
            </h4>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="text-xs font-bold text-zinc-900 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.preferences?.categories?.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-xs font-bold text-zinc-800 shadow-2xs uppercase"
              >
                {cat}
              </span>
            ))}
            <span className="px-2.5 py-1 rounded-full bg-zinc-200/70 text-xs font-semibold text-zinc-700">
              {user.preferences?.edition === 'india' ? '🇮🇳 India Edition' : '🌐 Global Wire'}
            </span>
          </div>
        </div>

        {/* 4. Sign Out */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud Auth Active</span>
          </div>

          <button
            type="button"
            onClick={handleSignOutClick}
            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
