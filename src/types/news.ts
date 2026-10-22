export type NewsCategory = 
  | 'all'
  | 'world'
  | 'business'
  | 'tech'
  | 'science'
  | 'culture'
  | 'markets';

export interface ArticleSource {
  id: string;
  name: string;
  favicon?: string;
  credibilityScore?: number; // e.g. 98%
  badge?: string; // 'Flagship Wire', 'In-Depth', 'Verified'
  websiteUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: ArticleSource;
  author?: string;
  publishedAt: string;
  imageUrl?: string;
  category: NewsCategory;
  readTime: number; // in minutes
  isBreaking?: boolean;
  isLeadStory?: boolean;
  bulletPoints?: string[];
  sentiment?: 'neutral' | 'bullish' | 'critical' | 'analytical';
  userNotes?: string;
  savedAt?: string;
  isRead?: boolean;
}

export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  category: 'index' | 'commodity' | 'currency' | 'crypto';
}

export interface ExecutiveBriefing {
  id: string;
  edition: string;
  date: string;
  leadHighlight: string;
  globalPulse: string;
  marketOutlook: string;
  keyDevelopments: Array<{
    title: string;
    summary: string;
    category: string;
    impact: 'High' | 'Critical' | 'Medium';
    timeAgo: string;
  }>;
}

export interface CustomRssFeed {
  id: string;
  name: string;
  url: string;
  category: NewsCategory;
  addedAt: string;
}

export interface UserPreferences {
  fontFamily: 'serif' | 'sans';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  readingSpeed: number;
  autoPlayAudio: boolean;
  bookmarkedOnly: boolean;
  selectedCategory: NewsCategory;
  selectedSource: string;
  density: 'comfortable' | 'compact' | 'broadsheet';
}
