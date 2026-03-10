'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import AuthBrandPanel from '../components/AuthBrandPanel';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendResetEmail = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (resetError) throw resetError;

      setIsSubmitted(true);
      setCooldown(60);
    } catch (err: unknown) {
      // For security, don't reveal if the email exists or not
      // Still show success state
      setIsSubmitted(true);
      setCooldown(60);
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    await sendResetEmail();
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await sendResetEmail();
  };

  const inputClasses =
    'w-full bg-[var(--bg-input)] text-primary px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border-default)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)] transition-colors duration-fast placeholder:text-tertiary';

  return (
    <div className="flex min-h-screen bg-page">
      {/* Brand panel - left side (desktop only) */}
      <AuthBrandPanel />

      {/* Form panel - right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-accent tracking-tight">VibeWatch</h1>
            <p className="text-secondary text-sm mt-1">Track your entertainment vibe</p>
          </div>

          {/* Card */}
          <div className="bg-surface border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
            {/* Back link */}
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to login
            </Link>

            {!isSubmitted ? (
              /* ===== EMAIL INPUT STATE ===== */
              <>
                <h2 className="text-2xl font-semibold text-primary mb-2">Reset your password</h2>
                <p className="text-sm text-secondary mb-8 leading-relaxed">
                  Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>

                {error && (
                  <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-error/10 border border-error/30 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-error">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your@email.com"
                      className={inputClasses}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] transition-all duration-fast active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ===== SUCCESS STATE ===== */
              <div className="animate-fade-in text-center py-4">
                {/* Success icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-2xl font-semibold text-primary mb-2">Check your inbox</h2>
                <p className="text-sm text-secondary mb-2 leading-relaxed">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-medium text-primary mb-6">{email}</p>
                <p className="text-xs text-tertiary mb-8">
                  The link will expire in 1 hour. Didn&apos;t receive the email? Check your spam folder or try again.
                </p>

                {/* Resend button with cooldown */}
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="w-full py-3 px-4 rounded-[var(--radius-md)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-elevated text-primary font-medium transition-all duration-fast disabled:opacity-40 disabled:pointer-events-none mb-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    'Resend Email'
                  )}
                </button>

                <Link
                  href="/signin"
                  className="inline-block text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
