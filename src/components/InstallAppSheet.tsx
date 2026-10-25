'use client';

import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, Smartphone, Check, ArrowDown, Sparkles } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface InstallAppSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallAppSheet({ isOpen, onClose }: InstallAppSheetProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already launched as standalone PWA
    const standaloneMode =
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standaloneMode);

    // Android/Chrome beforeinstallprompt listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/40 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] border border-white/60 shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom duration-300 flex flex-col space-y-6">
        {/* iOS Sheet Grabber Handle */}
        <div className="w-10 h-1.5 rounded-full bg-zinc-300 mx-auto -mt-2 mb-1 sm:hidden" />

        {/* Header with App Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            {/* App Icon */}
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 p-2.5 shadow-md flex items-center justify-center border border-white/20">
              <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 rotate-45 shadow-sm" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-zinc-950 tracking-tight">Prism Mobile</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                  Native PWA
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Full-screen web application</p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              onClose();
            }}
            className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Benefits Pill Cards */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-zinc-800">Edge-to-Edge Glass</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="font-semibold text-zinc-800">Zero Browser Bars</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-zinc-800">Tactile Haptics</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-semibold text-zinc-800">Cloud Dossier Sync</span>
          </div>
        </div>

        {/* Platform-Specific Step Guide */}
        {isIOS ? (
          <div className="space-y-3 bg-zinc-50/90 rounded-2xl p-4 border border-zinc-200/80">
            <div className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>How to add on iOS Safari:</span>
            </div>
            <div className="space-y-3 text-xs text-zinc-700">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-sky-600 font-bold">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <span>1. Tap the <strong>Share</strong> button in the bottom Safari bar</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-900 font-bold">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <span>2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-emerald-600 font-bold">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>3. Tap <strong>Add</strong> in the top-right corner</span>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleInstallClick}
              className="apple-prominent-btn apple-btn w-full py-3.5 px-4 rounded-2xl text-xs font-bold tracking-tight flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Install Prism App to Home Screen</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 bg-zinc-50/90 rounded-2xl p-4 border border-zinc-200/80 text-xs text-zinc-700">
            <p className="font-semibold text-zinc-900">Chrome / Edge / Safari:</p>
            <p className="text-zinc-600">
              Open your browser menu (or share icon) and select <strong>&ldquo;Add to Home Screen&rdquo;</strong> or <strong>&ldquo;Install App&rdquo;</strong>.
            </p>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
          <span>Progressive Web App v2.4</span>
          <span>Apple HIG Compliant</span>
        </div>
      </div>
    </div>
  );
}
