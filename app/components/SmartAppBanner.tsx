'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const PLAY_STORE_URL = 'market://details?id=com.vibewatch.app';
const DEEP_LINK = 'vibewatch://';
const DISMISS_KEY = 'vibewatch-app-banner-dismissed';

const HIDDEN_PATHS = ['/reset-password'];

export default function SmartAppBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isAndroid = /android/i.test(navigator.userAgent);
    // Don't show in WebViews (the app itself uses a WebView for some flows)
    const isWebView = /wv|WebView/i.test(navigator.userAgent);
    const dismissed = sessionStorage.getItem(DISMISS_KEY);

    if (isAndroid && !isWebView && !dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible || HIDDEN_PATHS.includes(pathname)) return null;

  const handleOpen = () => {
    // Try deep link first, fall back to Play Store after a delay
    const fallbackTimer = setTimeout(() => {
      window.location.href = PLAY_STORE_URL;
    }, 800);

    window.addEventListener('blur', () => clearTimeout(fallbackTimer), { once: true });
    window.location.href = DEEP_LINK;
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  return (
    <div className="bg-elevated border-b border-[var(--border-subtle)] px-3 py-2.5">
      <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="text-tertiary hover:text-secondary transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* App icon */}
        <Image
          src="/icon/MainIcon.png"
          alt="VibeWatch"
          width={36}
          height={36}
          className="rounded-[var(--radius-sm)] flex-shrink-0"
        />

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-primary text-sm font-semibold leading-tight">VibeWatch</p>
          <p className="text-tertiary text-xs leading-tight">Better on the app</p>
        </div>

        {/* Open button */}
        <button
          onClick={handleOpen}
          className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-1.5 rounded-[var(--radius-full)] transition-colors flex-shrink-0 cursor-pointer"
        >
          Open
        </button>
      </div>
    </div>
  );
}
