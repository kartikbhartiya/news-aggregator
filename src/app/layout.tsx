import type { Metadata } from 'next';
import { Newsreader, Inter } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'THE VERITAS DISPATCH — Editorial News Aggregator',
  description: 'Curated global intelligence, multi-source wire dispatches, financial markets, and deep reading with Supabase cloud dossier.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📰</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#FAF9F6] text-[#18181B] selection:bg-[#FEF08A] selection:text-[#18181B] font-sans">
        {children}
      </body>
    </html>
  );
}
