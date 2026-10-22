import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'PRISM — Modern News & Intelligence Aggregator',
  description: 'Ultra-premium, real-time news aggregator powered by NewsData.io, verified global wires, and Supabase cloud sync.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%2309090b"/><circle cx="50" cy="50" r="16" fill="%2310b981"/></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#FBFBFC] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
