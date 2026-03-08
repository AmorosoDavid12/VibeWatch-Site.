import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watched',
  robots: { index: false, follow: false },
};

export default function WatchedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
