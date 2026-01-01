"use client";

import { useState, useEffect } from "react";
import { X, Share, Plus, ExternalLink } from "lucide-react";

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    setIsIOS(ios);
    setIsAndroid(android);

    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    const installed = localStorage.getItem('pwa-installed');
    
    if (standalone || installed) {
      // Show tutorial after install
      const tutorialSeen = localStorage.getItem('pwa-tutorial-seen');
      if (!tutorialSeen && (ios || android)) {
        setShowTutorial(true);
      }
      return;
    }

    // Don't show if dismissed in last 7 days
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    // Show prompt on mobile after 3 seconds
    if (ios || android) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Listen for beforeinstallprompt (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
      setShowTutorial(true);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
        setShowTutorial(true);
      }
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  const handleTutorialDismiss = () => {
    setShowTutorial(false);
    localStorage.setItem('pwa-tutorial-seen', 'true');
  };

  // Install prompt for iOS
  if (showPrompt && isIOS && !isStandalone) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <img src="/icon-192.png" alt="MirrorSource" className="w-12 h-12 rounded-xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Add MirrorSource to Home Screen</h3>
            <p className="text-slate-600 text-sm">Get quick access and share articles directly from any app</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <p className="text-sm text-slate-700">Tap the <Share size={16} className="inline text-blue-600" /> Share button below</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <p className="text-sm text-slate-700">Scroll down and tap <span className="font-medium">"Add to Home Screen"</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <p className="text-sm text-slate-700">Tap <span className="font-medium">"Add"</span> to confirm</p>
            </div>
          </div>

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

  // Install prompt for Android
  if (showPrompt && isAndroid && !isStandalone) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <img src="/icon-192.png" alt="MirrorSource" className="w-12 h-12 rounded-xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Install MirrorSource</h3>
            <p className="text-slate-600 text-sm">Add to your home screen for quick access and easy sharing</p>
          </div>

          <button
            onClick={handleInstall}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add to Home Screen
          </button>

          <button
            onClick={handleDismiss}
            className="w-full mt-3 py-3 text-slate-500 text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // Tutorial after install
  if (showTutorial) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-300">
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">You're all set!</h3>
            <p className="text-slate-600 text-sm">Here's how to analyze any article</p>
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
                <p className="text-sm font-medium text-slate-800">Tap Share <Share size={14} className="inline text-blue-600" /></p>
                <p className="text-xs text-slate-500">Look for the share button in your browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-medium text-slate-800">Select MirrorSource</p>
                <p className="text-xs text-slate-500">We'll find alternative sources instantly</p>
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

  return null;
}