# THE VERITAS DISPATCH
### *A Super-Premium, Editorial Multi-Source News Aggregator & Intelligence Platform*

> **Design Philosophy**: An antidote to generic, "vibecoded" templates. Built with a pristine, gallery-grade white and warm-linen editorial palette (`#FAF9F6`), timeless typography hierarchy (*Newsreader* serif + *Inter* grotesque), hairline dividers, and the dignity of classic broadsheets (Financial Times, The New York Times, Monocle).

---

## ✨ Signature Capabilities

1. **Editorial Broadsheet Architecture (Non-Vibecoded)**
   - Asymmetrical newspaper layout: Flagship Hero Dispatch, In-Depth Analytical investigations, and real-time Fast Wire column.
   - Genuine publication masthead with live clocks for financial capitals (**London**, **New York**, **Tokyo**), date, and volume number.
   - Refined drop-cap typography on longform reading mode.

2. **Real-Time Financial Markets Ticker Ribbon**
   - Live streaming ticker with S&P 500, NASDAQ, 10-Yr US Treasury Yields, Brent Crude, Spot Gold, FTSE 100, Nikkei 225, EUR/USD, and Bitcoin.

3. **Multi-Source Live Aggregator Engine & NewsData.io API**
   - **NewsData.io Official API Integration**: Pre-configured with your API key (`pub_2bc43ef290e749dcb847f0b952d04320`), ingesting from a global catalog of over 330,000+ live articles across international publishers.
   - **World & Geopolitics**: *The New York Times*, *BBC News*, *NPR Public Radio*, *NewsData.io World Wire*.
   - **Capital Markets & Economy**: *CNBC Markets*, *NYT Business*, *NewsData.io Business Stream*.
   - **Technology & AI**: *The Verge*, *Ars Technica*, *TechCrunch*, *NewsData.io Technology Wire*, and official *Hacker News* Firebase API.
   - **Science & Climate**: *Phys.org*, *Nature Scientific Wire*, *NYT Science*.
   - **Culture & Ideas**: *NYT Arts & Culture*.
   - High-throughput parallel server parser (`fast-xml-parser`) with stale-while-revalidate caching and quota-preserving memory buffers.

4. **Supabase Cloud Synchronization & Dossier**
   - Pre-configured with your Supabase credentials:
     - **Supabase URL**: `https://pubfwtqkapmffhkdtivb.supabase.co`
     - **Anon Key**: `sb_publishable_oW1OqsQACt179fRhH8WXDw_7uXkdDl2`
   - Zero-latency optimistic local storage fallback: bookmarks and notes work seamlessly out of the box even before database migrations are run.
   - Dedicated **Dossier Drawer**: organize saved articles, search bookmarks, attach private research notes, and export to Markdown.
   - **Supabase Health Monitor**: 1-click SQL copy migration snippet in the Settings modal with live connection test.

5. **Audio Narration (Text-to-Speech)**
   - Built-in Web Speech API voice narrator with Play/Pause, speed adjustment (1x, 1.25x, 1.5x), and natural voice selection.

6. **3-Minute Morning Executive Briefing**
   - Curated high-level strategic synthesis of the day's top 5 events across World, Markets, and Tech with audio listen mode.

7. **Global Command Palette (`⌘K` / `Ctrl+K`)**
   - Rapid keyboard navigation: search articles, jump to sections, open the reading dossier, or refresh feeds.

8. **Custom RSS Subscription Engine**
   - Add any RSS or Atom URL (e.g. Substack newsletters, blogs, regional newspapers) with shelf category assignment.

---

## 🚀 Quick Start

### 1. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dispatch.

### 2. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Database Schema

To enable cross-device cloud persistence in Supabase, open your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** → **New Query**, paste the following script, and click **Run**:

```sql
-- The Veritas Dispatch Supabase Cloud Schema
create table if not exists public.bookmarks (
  id text primary key,
  title text not null,
  description text,
  content text,
  url text not null,
  source jsonb,
  author text,
  published_at timestamptz,
  image_url text,
  category text,
  read_time int,
  notes text,
  created_at timestamptz default now()
);

alter table public.bookmarks enable row level security;
create policy "Allow all operations for anon" on public.bookmarks for all using (true) with check (true);

create table if not exists public.reading_history (
  id serial primary key,
  article_id text not null unique,
  read_at timestamptz default now()
);
alter table public.reading_history enable row level security;
create policy "Allow all on history for anon" on public.reading_history for all using (true) with check (true);

create table if not exists public.custom_feeds (
  id text primary key,
  name text not null,
  url text not null,
  category text default 'all',
  created_at timestamptz default now()
);
alter table public.custom_feeds enable row level security;
create policy "Allow all on custom feeds for anon" on public.custom_feeds for all using (true) with check (true);
```

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── news/
│   │   │   │   ├── route.ts            # Parallel news aggregator endpoint
│   │   │   │   ├── briefing/route.ts   # 3-min executive briefing endpoint
│   │   │   │   ├── custom/route.ts     # Custom RSS feed validator & parser
│   │   │   │   └── markets/route.ts    # Financial ticker tape endpoint
│   │   │   ├── layout.tsx              # Newsreader & Inter typography setup
│   │   │   ├── globals.css             # Architectural styling & drop caps
│   │   │   └── page.tsx                # Broadsheet front page
│   ├── components/
│   │   ├── Masthead.tsx                # Editorial header, clocks, search & shelf nav
│   │   ├── MarketTickerBar.tsx         # Live financial market wire tape
│   │   ├── ArticleCard.tsx             # Lead hero, featured, wire, & standard cards
│   │   ├── ArticleReaderModal.tsx      # Distraction-free reader with TTS audio & notes
│   │   ├── ExecutiveBriefingModal.tsx  # 3-min morning briefing modal
│   │   ├── BookmarksDrawer.tsx         # Saved dossier drawer with Markdown export
│   │   ├── SupabaseSettingsModal.tsx   # Supabase cloud health, SQL script & feeds
│   │   └── CommandPalette.tsx          # ⌘K quick action search modal
│   ├── lib/
│   │   ├── curated-sources.ts          # Curated RSS feed registry
│   │   ├── mock-news.ts                # High-fidelity editorial fallback catalog
│   │   ├── news-fetcher.ts             # Server news aggregator with cache & deduplication
│   │   ├── rss-parser.ts               # XML/Atom image & excerpt extractor
│   │   ├── market-ticker.ts            # Global indices & commodities data
│   │   └── supabase.ts                 # Supabase client & sync engine
│   └── types/
│       └── news.ts                     # TypeScript definitions
├── .env.local                          # Supabase credentials
└── README.md
```
