'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';
import AuthBrandPanel from '../components/AuthBrandPanel';

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasLength) return { level: 1, label: 'Too short', color: 'bg-error' };
    if (hasLength && hasUpper && hasNumber && hasSpecial)
      return { level: 3, label: 'Strong', color: 'bg-success' };
    if (hasLength && (hasNumber || hasUpper))
      return { level: 2, label: 'Medium', color: 'bg-warning' };
    return { level: 1, label: 'Weak', color: 'bg-error' };
  };

  const { level, label, color } = getStrength();
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-fast ${
              i <= level ? color : 'bg-[var(--border-subtle)]'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1 ${level === 3 ? 'text-success' : level === 2 ? 'text-warning' : 'text-error'}`}>
        {label}
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const router = useRouter();

  // Verify user has a valid recovery session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      await supabase.auth.signOut();
      setSuccess(true);
      setTimeout(() => router.push('/signin'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full bg-[var(--bg-input)] text-primary px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border-default)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)] transition-colors duration-fast placeholder:text-tertiary';

  // Loading state while checking session
  if (hasSession === null) {
    return (
      <div className="flex min-h-screen bg-page items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  // No recovery session
  if (!hasSession) {
    return (
      <div className="flex min-h-screen bg-page">
        <AuthBrandPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-surface border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-primary mb-2">Link expired</h2>
              <p className="text-sm text-secondary mb-6">
                Your password reset link has expired or is invalid. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-6 rounded-[var(--radius-md)] transition-colors"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-page">
      <AuthBrandPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-accent tracking-tight">VibeWatch</h1>
            <p className="text-secondary text-sm mt-1">Track your entertainment vibe</p>
          </div>

          <div className="bg-surface border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
            {!success ? (
              <>
                <h2 className="text-2xl font-semibold text-primary mb-2">Set new password</h2>
                <p className="text-sm text-secondary mb-8">Enter your new password below.</p>

                {error && (
                  <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-error/10 border border-error/30 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-error">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter new password"
                        className={inputClasses}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        autoFocus
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <PasswordStrength password={password} />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirm-password"
                      placeholder="Confirm new password"
                      className={inputClasses}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-error mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || password.length < 8 || password !== confirmPassword}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] transition-all duration-fast active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="animate-fade-in text-center py-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Password updated</h2>
                <p className="text-sm text-secondary">
                  Redirecting you to login...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
