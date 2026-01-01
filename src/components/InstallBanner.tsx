"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check for reset parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('reset') === 'true') {
      localStorage.removeItem('pwa-tutorial-seen');
      localStorage.removeItem('install-banner-dismissed');
      localStorage.removeItem('pwa-installed');
      window.history.replaceState({}, '', '/');
    }
    
    // Check for tutorial parameter in URL
    if (urlParams.get('tutorial') === 'true') {
      localStorage.removeItem('pwa-tutorial-seen');
      setShowTutorial(true);
      window.history.replaceState({}, '', '/');
      return;
    }

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    // If standalone, check if we should show tutorial
    if (standalone) {
      const tutorialSeen = localStorage.getItem('pwa-tutorial-seen');
      if (!tutorialSeen) {
        setShowTutorial(true);
      }
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('install-banner-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 3) return;
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const mobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);
    setIsIOS(ios);

    // Only show banner on mobile
    if (!mobile) return;

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS or if no prompt event, show banner anyway after delay
    setTimeout(() => {
      setShowBanner(true);
    }, 2000);

    // Hide on install and show tutorial
    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setShowIOSInstructions(false);
      localStorage.setItem('pwa-installed', 'true');
      setTimeout(() => setShowTutorial(true), 500);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSInstructions(false);
    localStorage.setItem('install-banner-dismissed', new Date().toISOString());
  };

  const handleTutorialDismiss = () => {
    setShowTutorial(false);
    localStorage.setItem('pwa-tutorial-seen', 'true');
  };

  if (!showBanner && !showTutorial && !showIOSInstructions) return null;

  // Tutorial after install
  if (showTutorial) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
          <button 
            onClick={handleTutorialDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">You&apos;re all set!</h3>
            <p className="text-slate-600 text-sm">Here&apos;s how to analyze any article</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
              <div>
                <p className="text-sm font-medium text-slate-800">Read any news article</p>
                <p className="text-xs text-slate-500">In Chrome, Safari, or any browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
              <div>
                <p className="text-sm font-medium text-slate-800">Tap Share</p>
                <p className="text-xs text-slate-500">Look for the share button in your browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-medium text-slate-800">Select MirrorSource</p>
                <p className="text-xs text-slate-500">We&apos;ll find alternative sources instantly</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleTutorialDismiss}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // iOS/Android instructions modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Install MirrorSource</h3>
            <p className="text-slate-600 text-sm">Add to your home screen for easy article sharing</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            {isIOS ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <p className="text-sm text-slate-700">Tap the <span className="inline-block w-5 h-5 align-middle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></span> Share button</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <p className="text-sm text-slate-700">Scroll down and tap <strong>Add to Home Screen</strong></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <p className="text-sm text-slate-700">Tap <strong>Add</strong></p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <p className="text-sm text-slate-700">Tap the <strong>⋮</strong> menu (top right)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <p className="text-sm text-slate-700">Tap <strong>Add to Home screen</strong></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <p className="text-sm text-slate-700">Tap <strong>Add</strong> to confirm</p>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            Once installed, share any article directly to MirrorSource!
          </p>

          <button
            onClick={handleDismiss}
            className="w-full mt-4 py-3 text-slate-500 text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // Bottom banner
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 p-3 safe-area-pb">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download size={20} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Install MirrorSource</p>
            <p className="text-xs text-slate-500 truncate">Share articles with one tap</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}