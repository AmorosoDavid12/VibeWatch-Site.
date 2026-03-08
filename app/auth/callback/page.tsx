'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import { Suspense } from 'react';

type CallbackState = 'loading' | 'verified' | 'error';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>('loading');
  const [message, setMessage] = useState('Verifying...');
  const [countdown, setCountdown] = useState(3);
  const [redirectTo, setRedirectTo] = useState('/');
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const redirectWithCountdown = useCallback((to: string, seconds: number) => {
    setState('verified');
    setRedirectTo(to);
    setCountdown(seconds);
    let remaining = seconds;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        router.push(to);
      }
    }, 1000);
  }, [router]);

  useEffect(() => {
    const handleCallback = async () => {
      const type = searchParams.get('type');
      const code = searchParams.get('code');

      // Code exchange (OAuth or email verification via PKCE)
      if (code) {
        const isEmailVerification = type === 'signup' || type === 'email';

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (isEmailVerification) {
          await supabase.auth.signOut();
        }

        if (error) {
          setState('error');
          setMessage('Authentication failed. Redirecting to login...');
          setTimeout(() => router.push('/signin'), 2000);
          return;
        }

        if (isEmailVerification) {
          setMessage('Email verified! Please sign in.');
          redirectWithCountdown('/signin', 3);
          return;
        }

        // OAuth login — redirect immediately
        router.push('/');
        return;
      }

      // Password recovery — redirect to reset page
      if (type === 'recovery') {
        setTimeout(() => router.push('/reset-password'), 500);
        return;
      }

      // Fallback: email verification via hash fragment (non-PKCE)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut();
        setMessage('Email verified! Please sign in.');
        redirectWithCountdown('/signin', 3);
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await supabase.auth.signOut();
          setMessage('Email verified! Please sign in.');
          redirectWithCountdown('/signin', 3);
          subscription.unsubscribe();
        }
      });

      // Timeout fallback
      setTimeout(() => {
        subscription.unsubscribe();
        setMessage('Verification complete. Redirecting...');
        router.push('/signin');
      }, 5000);
    };

    handleCallback();
  }, [router, searchParams, redirectWithCountdown]);

  if (state === 'verified') {
    return (
      <div className="flex min-h-screen bg-base items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
            <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-primary text-lg font-semibold mb-1">{message}</h2>
          <p className="text-tertiary text-sm mb-6">Redirecting in {countdown}s</p>
          <button
            onClick={() => {
              if (countdownRef.current) clearInterval(countdownRef.current);
              router.push(redirectTo);
            }}
            className="text-sm text-accent hover:underline cursor-pointer"
          >
            Continue now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-secondary text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-base items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
