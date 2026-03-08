import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in or create an account on VibeWatch to track movies and TV shows.',
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
