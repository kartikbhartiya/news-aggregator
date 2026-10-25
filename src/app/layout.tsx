import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-mono-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FAF9FC',
};

export const metadata: Metadata = {
  title: 'PRISM — Apple-Grade News & Intelligence Aggregator',
  description: 'Ultra-premium, real-time news aggregator with Liquid Glass physics, NewsData.io integration, and Supabase cloud sync.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Prism News',
  },
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-512.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#FAF9FC] text-zinc-900 selection:bg-zinc-950 selection:text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
