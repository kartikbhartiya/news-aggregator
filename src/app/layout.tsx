import type { Metadata, Viewport } from 'next';
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono, Pinyon_Script } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const pinyonScript = Pinyon_Script({
  subsets: ['latin'],
  variable: '--font-cursive',
  display: 'swap',
  weight: '400',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090B',
};

export const metadata: Metadata = {
  title: 'PRISM - News Aggregator',
  description: 'High-signal, black & white editorial news aggregator with full readable articles, tactile claymorphic architecture, and verified source intelligence.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PRISM - News Aggregator',
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
    <html lang="en" className={`${newsreader.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${pinyonScript.variable} antialiased`}>
      <body className="min-h-screen bg-[#FBFBFB] text-zinc-950 selection:bg-zinc-950 selection:text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
