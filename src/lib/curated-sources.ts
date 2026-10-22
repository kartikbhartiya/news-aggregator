import { ArticleSource, NewsCategory } from '@/types/news';

export interface FeedConfig {
  id: string;
  name: string;
  url: string;
  category: NewsCategory;
  source: ArticleSource;
}

export const CURATED_FEEDS: FeedConfig[] = [
  // World & Geopolitics
  {
    id: 'nyt-world',
    name: 'The New York Times',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    category: 'world',
    source: {
      id: 'nyt',
      name: 'The New York Times',
      credibilityScore: 98,
      badge: 'Flagship Editorial',
      websiteUrl: 'https://nytimes.com',
    },
  },
  {
    id: 'bbc-world',
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'world',
    source: {
      id: 'bbc',
      name: 'BBC News',
      credibilityScore: 97,
      badge: 'Global Wire',
      websiteUrl: 'https://bbc.com/news',
    },
  },
  {
    id: 'npr-news',
    name: 'NPR News',
    url: 'https://feeds.npr.org/1001/rss.xml',
    category: 'world',
    source: {
      id: 'npr',
      name: 'NPR Public Radio',
      credibilityScore: 96,
      badge: 'Independent',
      websiteUrl: 'https://npr.org',
    },
  },

  // Business & Markets
  {
    id: 'cnbc-business',
    name: 'CNBC Markets',
    url: 'https://search.cnbc.com/rs/search/view.html?partnerId=2000&keywords=business&sort=date',
    category: 'markets',
    source: {
      id: 'cnbc',
      name: 'CNBC',
      credibilityScore: 94,
      badge: 'Financial Wire',
      websiteUrl: 'https://cnbc.com',
    },
  },
  {
    id: 'nyt-business',
    name: 'NYT Business & Economy',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    category: 'business',
    source: {
      id: 'nyt-biz',
      name: 'The New York Times',
      credibilityScore: 98,
      badge: 'Deep Analysis',
      websiteUrl: 'https://nytimes.com/section/business',
    },
  },

  // Technology & AI
  {
    id: 'the-verge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    source: {
      id: 'verge',
      name: 'The Verge',
      credibilityScore: 93,
      badge: 'Tech & Culture',
      websiteUrl: 'https://theverge.com',
    },
  },
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech',
    source: {
      id: 'arstechnica',
      name: 'Ars Technica',
      credibilityScore: 96,
      badge: 'In-Depth Tech',
      websiteUrl: 'https://arstechnica.com',
    },
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
    source: {
      id: 'techcrunch',
      name: 'TechCrunch',
      credibilityScore: 92,
      badge: 'Venture & Startups',
      websiteUrl: 'https://techcrunch.com',
    },
  },

  // Science & Environment
  {
    id: 'phys-org',
    name: 'Phys.org Science',
    url: 'https://phys.org/rss-feed/',
    category: 'science',
    source: {
      id: 'physorg',
      name: 'Phys.org',
      credibilityScore: 97,
      badge: 'Peer-Reviewed Wire',
      websiteUrl: 'https://phys.org',
    },
  },
  {
    id: 'nyt-science',
    name: 'NYT Science & Climate',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
    category: 'science',
    source: {
      id: 'nyt-sci',
      name: 'The New York Times',
      credibilityScore: 98,
      badge: 'Climate & Space',
      websiteUrl: 'https://nytimes.com/section/science',
    },
  },

  // Culture & Longform
  {
    id: 'nyt-arts',
    name: 'NYT Culture & Ideas',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml',
    category: 'culture',
    source: {
      id: 'nyt-arts',
      name: 'The New York Times',
      credibilityScore: 97,
      badge: 'Criticism & Culture',
      websiteUrl: 'https://nytimes.com/section/arts',
    },
  },
];
