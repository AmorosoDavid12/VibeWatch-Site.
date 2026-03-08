'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, pendingAuthType } from './supabase';

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            getNotDisplayedReason?: () => string;
            getSkippedReason?: () => string;
          }) => void) => void;
        };
      };
    };
  }
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] onAuthStateChange:', event, 'pendingAuthType:', pendingAuthType);
        console.log('[Auth] Session user:', session?.user?.id, 'email:', session?.user?.email);
        console.log('[Auth] User metadata:', JSON.stringify(session?.user?.user_metadata));

        // Supabase ignores our redirectTo for verification/recovery emails
        // and always redirects to the Site URL. We captured the type from
        // the URL hash at module load (before Supabase cleared it).
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && pendingAuthType === 'recovery')) {
          window.location.href = '/reset-password';
          return;
        }

        if (event === 'SIGNED_IN' && pendingAuthType === 'signup') {
          await supabase.auth.signOut();
          window.location.href = '/signin?verified=true';
          return;
        }

        // Ensure profile exists after sign-in
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureProfile(session.user);
        }

        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ensureProfile = async (user: User) => {
    try {
      console.log('[Auth] ensureProfile: checking for user', user.id);

      // Check if profile already exists
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('[Auth] ensureProfile: error fetching profile:', fetchError.message);
        return;
      }

      if (profile) {
        console.log('[Auth] ensureProfile: profile already exists, username:', profile.username);

        // Check if profile was auto-created by DB trigger with email-based username
        // and we have a real username from metadata that should replace it
        const metadataUsername = user.user_metadata?.username || user.user_metadata?.data?.username;
        const emailPrefix = user.email?.split('@')[0];
        const looksEmailBased = profile.username === emailPrefix
          || profile.username === emailPrefix?.substring(0, 6)
          || profile.username.startsWith(emailPrefix?.substring(0, 6) || '');

        console.log('[Auth] ensureProfile: metadataUsername:', metadataUsername, 'emailPrefix:', emailPrefix, 'looksEmailBased:', looksEmailBased);

        if (metadataUsername && looksEmailBased) {
          const randomSuffix = Math.floor(10000 + Math.random() * 90000);
          const updatedUsername = `${metadataUsername}#${randomSuffix}`;
          console.log('[Auth] ensureProfile: updating email-based username to:', updatedUsername);

          const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: updatedUsername })
            .eq('id', user.id);

          if (updateError) {
            console.error('[Auth] ensureProfile: update error:', updateError.message);
          } else {
            console.log('[Auth] ensureProfile: username updated successfully to:', updatedUsername);
          }
        }
        return;
      }

      // Extract username from metadata (matches mobile app logic)
      const username =
        user.user_metadata?.username ||
        user.user_metadata?.data?.username ||
        user.user_metadata?.full_name?.split(' ')[0]?.toLowerCase()?.substring(0, 10) ||
        user.user_metadata?.name?.split(' ')[0]?.toLowerCase()?.substring(0, 10) ||
        user.email?.split('@')[0]?.substring(0, 6) ||
        'user';

      console.log('[Auth] ensureProfile: extracted username:', username);
      console.log('[Auth] ensureProfile: metadata sources checked:', JSON.stringify({
        'user_metadata.username': user.user_metadata?.username,
        'user_metadata.data.username': user.user_metadata?.data?.username,
        'user_metadata.full_name': user.user_metadata?.full_name,
        'user_metadata.name': user.user_metadata?.name,
        'email': user.email,
      }));

      // Add random suffix for uniqueness (matches mobile app format)
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const finalUsername = `${username}#${randomSuffix}`;

      console.log('[Auth] ensureProfile: creating profile with username:', finalUsername);

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: finalUsername,
          is_public: false,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('[Auth] ensureProfile: insert error:', insertError.message);
        // Try upsert as fallback (profile might have been created by a DB trigger)
        console.log('[Auth] ensureProfile: trying upsert as fallback...');
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: finalUsername,
            is_public: false,
          }, { onConflict: 'id' });

        if (upsertError) {
          console.error('[Auth] ensureProfile: upsert also failed:', upsertError.message);
        } else {
          console.log('[Auth] ensureProfile: upserted successfully with username:', finalUsername);
        }
      } else {
        console.log('[Auth] ensureProfile: created profile successfully, username:', finalUsername);
      }
    } catch (err) {
      console.error('[Auth] ensureProfile: unexpected error:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    console.log('[Auth] signUp called with username:', username);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { username },
      },
    });

    if (error) {
      console.error('[Auth] signUp error:', error.message);
      throw error;
    }

    console.log('[Auth] signUp success, user id:', data.user?.id);
    console.log('[Auth] signUp user_metadata:', JSON.stringify(data.user?.user_metadata));
  };

  const signInWithGoogle = async () => {
    // Generate nonce: raw for Supabase, SHA-256 hashed for Google
    const rawNonce = crypto.randomUUID();
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(rawNonce)
    );
    const hashedNonce = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    await loadGoogleScript();

    return new Promise<void>((resolve, reject) => {
      let settled = false;

      window.google!.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response) => {
          if (settled) return;
          settled = true;
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: rawNonce,
            });
            if (error) reject(error);
            else resolve();
          } catch (err) {
            reject(err);
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      });

      window.google!.accounts.id.prompt((notification) => {
        if (settled) return;
        if (notification.isNotDisplayed()) {
          settled = true;
          reject(new Error(
            'Google sign-in could not be shown. Try clearing your browser data or use email sign-in.'
          ));
        } else if (notification.isSkippedMoment()) {
          settled = true;
          // User dismissed the prompt — not a real error
          reject(new Error('CANCELLED'));
        }
      });
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 