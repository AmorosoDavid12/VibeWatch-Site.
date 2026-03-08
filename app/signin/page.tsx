'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../utils/auth-provider';
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

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get('verified') === 'true' ? 'Email verified! Please sign in.' : ''
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const usernameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (user) {
      router.push(returnUrl);
    }
  }, [user, router, returnUrl]);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const checkUsername = useCallback((value: string) => {
    if (usernameTimeoutRef.current) clearTimeout(usernameTimeoutRef.current);

    if (!value || value.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    usernameTimeoutRef.current = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', value.toLowerCase())
          .maybeSingle();

        setUsernameStatus(data ? 'taken' : 'available');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);
  }, []);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    checkUsername(value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    if (usernameStatus === 'taken') {
      setError('Username is already taken');
      return;
    }
    if (!privacyAccepted) {
      setError('Please accept the Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccessMessage('Check your email to verify your account');
      setActiveTab('login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  if (user) return null;

  const inputClasses =
    'w-full bg-[var(--bg-input)] text-primary px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border-default)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)] transition-colors duration-fast placeholder:text-tertiary';

  return (
    <div className="flex min-h-screen bg-base">
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

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-success/10 border border-success/30 text-success text-sm flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Android deep link bridge */}
          {successMessage && searchParams.get('verified') === 'true' && isAndroid && (
            <div className="mb-6 space-y-3">
              <button
                onClick={() => { window.location.href = 'vibewatch://login'; }}
                className="w-full rounded-[var(--radius-md)] bg-accent hover:bg-accent-hover px-6 py-3 text-sm font-semibold text-white cursor-pointer transition-colors"
              >
                Open in VibeWatch App
              </button>
              <p className="text-center text-xs text-tertiary">Or sign in below to continue on web</p>
            </div>
          )}

          {/* Tabs */}
          <div className="relative flex mb-8">
            <button
              className={`flex-1 py-3 text-base font-medium transition-colors duration-fast ${
                activeTab === 'login' ? 'text-primary' : 'text-tertiary hover:text-secondary'
              }`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Log in
            </button>
            <button
              className={`flex-1 py-3 text-base font-medium transition-colors duration-fast ${
                activeTab === 'signup' ? 'text-primary' : 'text-tertiary hover:text-secondary'
              }`}
              onClick={() => { setActiveTab('signup'); setError(''); }}
            >
              Sign up
            </button>
            {/* Animated tab indicator */}
            <div
              className="absolute bottom-0 h-0.5 bg-accent transition-all duration-normal ease-default"
              style={{
                width: '50%',
                left: activeTab === 'login' ? '0%' : '50%',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border-subtle)]" />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-error/10 border border-error/30 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-error">{error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* ===== LOGIN FORM ===== */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    className={inputClasses}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-accent hover:text-accent-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] transition-all duration-fast active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none shadow-glow/50 hover:shadow-glow"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-subtle)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-base px-4 text-tertiary">or</span>
                </div>
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[var(--radius-md)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-elevated text-primary font-medium transition-all duration-fast disabled:opacity-40"
              >
                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              <p className="text-center text-sm text-tertiary mt-6">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className="text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            /* ===== SIGNUP FORM ===== */
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-secondary mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    placeholder="Choose a username"
                    className={inputClasses}
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    minLength={3}
                    maxLength={20}
                    autoFocus
                    required
                  />
                  {usernameStatus !== 'idle' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'checking' && (
                        <svg className="animate-spin h-4 w-4 text-tertiary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {usernameStatus === 'available' && (
                        <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {usernameStatus === 'taken' && (
                        <svg className="h-4 w-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
                {usernameStatus === 'taken' && (
                  <p className="text-xs text-error mt-1">Username is already taken</p>
                )}
                {usernameStatus === 'available' && (
                  <p className="text-xs text-success mt-1">Username is available</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  placeholder="your@email.com"
                  className={inputClasses}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    placeholder="Create a password"
                    className={inputClasses}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    placeholder="Confirm your password"
                    className={inputClasses}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-error mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Privacy policy checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-input)] accent-accent"
                />
                <span className="text-sm text-secondary">
                  I agree to the{' '}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-accent hover:text-accent-hover transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || usernameStatus === 'taken' || !privacyAccepted}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-[var(--radius-md)] transition-all duration-fast active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none shadow-glow/50 hover:shadow-glow"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-subtle)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-base px-4 text-tertiary">or</span>
                </div>
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[var(--radius-md)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-elevated text-primary font-medium transition-all duration-fast disabled:opacity-40"
              >
                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              <p className="text-center text-sm text-tertiary mt-6">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className="text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-base items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
