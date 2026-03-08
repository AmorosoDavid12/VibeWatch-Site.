import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./utils/auth-provider";
import SmartAppBanner from "./components/SmartAppBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'VibeWatch — Track Your Entertainment Vibe',
    template: '%s | VibeWatch',
  },
  description: 'Track movies and TV shows, build your watchlist, rate what you\'ve watched, and discover new content with VibeWatch.',
  metadataBase: new URL('https://vibewatch.app'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'VibeWatch — Track Your Entertainment Vibe',
    description: 'Track movies and TV shows, build your watchlist, rate what you\'ve watched, and discover new content.',
    url: 'https://vibewatch.app',
    siteName: 'VibeWatch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeWatch — Track Your Entertainment Vibe',
    description: 'Track movies and TV shows, build your watchlist, rate what you\'ve watched, and discover new content.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SmartAppBanner />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
