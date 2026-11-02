# ConvenioMart TrendRadar

> Real-time, factual content discovery engine purpose-built for the ConvenioMart social media marketing team.

TrendRadar delivers immediate daily discovery across records broken, legendary birthdays, cultural festivals, breaking news, historical milestones, and upcoming marketing opportunities — strictly anchored to **Indian Standard Time (Asia/Kolkata)** with zero monthly API cost.

---

## 1. System Architecture & Features

### Core Modules
- **Asia/Kolkata (IST) Clock & Date Engine**: Prevents UTC rollover bugs. All calendar events, daily refreshes, and upcoming offsets are strictly calculated against UTC+5:30.
- **4-Level Smart Deduplication Engine**:
  - *Level 1*: Canonical URL matching with tracking parameter stripping (`utm_*`, `fbclid`, `gclid`, hash fragments).
  - *Level 2*: Headline normalization (punctuation, excess whitespace, and acronym standardizations like MS Dhoni, T20, IPL, ISRO).
  - *Level 3*: Token overlap & Jaccard similarity evaluation with stopword filtering.
  - *Level 4*: Event-level entity grouping with multi-source attribution (*"N related articles"* dropdown preserving every original publisher and link).
- **3-Tier Content Verification System**:
  - `Verified`: Formally confirmed by official governing bodies (ISRO, NASA, ICC, BCCI, FIFA, Olympics, Guinness, UN) or structured encyclopedic archives.
  - `Reported`: Published by mainstream tier-1 news agencies (The Hindu, ESPNcricinfo, BBC, Reuters).
  - `Unverified`: Single-publisher unconfirmed claims or unverified blogs.
- **Marketing Workflow Tracker**:
  - *Save for Later*: Bookmarking opportunities into a dedicated Saved Content dashboard.
  - *Mark as Posted*: Sets an *"Already Posted"* badge preventing duplicate campaign usage, with instant *Undo* capability.
  - *Not Relevant*: Dismisses noise without corrupting cache or historical stores.
  - *Export Digest*: One-click formatted clipboard export of saved content.
- **Bounded LocalStorage**:
  - Quota-safe storage architecture with TTL expiration, auto-pruning, and LRU bounds (500 historical signatures max).

---

## 2. Free Public Data Sources & API Limitations

| Provider | Endpoint / Feed | Content Discovered | Limitations & Safeguards |
| :--- | :--- | :--- | :--- |
| **Wikipedia On This Day API** | `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/{MM}/{DD}` | Historical milestones, sports breakthroughs, notable birthdays | Free public Wikimedia REST API. Cached for 24 hours per day to prevent rate limits. |
| **Wikidata SPARQL** | `https://query.wikidata.org/sparql` | Structured personality data & birth dates | Subject to public SPARQL server timeouts under high load; resilient 6-second timeout fallback ensures zero UI stalls. |
| **The Hindu RSS** | `https://www.thehindu.com/news/national/feeder/default.rss` | National & regional (Tamil Nadu / India) news | Parsed via dual-mode XML reader with CORS proxy fallback for browser support. |
| **The Hindu Sport RSS** | `https://www.thehindu.com/sport/feeder/default.rss` | Cricket, athletics, and Indian sports records | Standard RSS feed format, cached for 15 minutes. |
| **ESPNcricinfo RSS** | `https://www.espncricinfo.com/rss/content/story/feeds/0.xml` | Cricket matches, milestones, and series updates | Cricket coverage with official match reporting. |
| **BBC News RSS** | `https://feeds.bbci.co.uk/news/world/rss.xml` & `/technology/rss.xml` | International events, space, science & tech milestones | Global coverage, deduplicated against Indian publishers. |
| **Indian & UN Calendar Engine** | In-engine structured registry | Tamil Nadu Day, Pongal, Puthandu, national holidays, UN days | Factually validated against Government of India Gazette & official UN observances calendar. |

---

## 3. Getting Started Locally

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Execution
```bash
# Clone or navigate to the directory
cd "Trending Radar"

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be live at `http://localhost:3000` (or `http://localhost:5173`).

### Automated Test Suite
To run all automated verification unit tests:
```bash
# Run core architecture tests (Deduplication, IST date, Verification status)
npm run test:units

# Run public API adapter tests (RSS parsing, Curated Birthdays, Observance Engine)
node scripts/test-phase2-adapters.js

# Run the complete 18-point final verification suite
node scripts/test-final-suite.js
```

### Production Build
```bash
npm run build
```
This generates an optimized static bundle in the `dist/` directory.

---

## 4. Deploying to Vercel

ConvenioMart TrendRadar is a modern Vite React application designed for zero-config deployment to Vercel:

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. In the [Vercel Dashboard](https://vercel.com/), click **"Add New Project"** and select your repository.
3. Vercel automatically detects Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. Your TrendRadar application will be live in ~30 seconds with global CDN caching.

---

## 5. Future Supabase Integration Path

The application was intentionally built with an isolated storage abstraction layer ([`src/utils/storageUtils.js`](src/utils/storageUtils.js)) and state layer ([`src/context/TrendContext.jsx`](src/context/TrendContext.jsx)).

When the marketing team is ready to introduce multi-user team synchronization via Supabase:

1. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Database Schema**:
   Create the following PostgreSQL tables in Supabase:
   ```sql
   -- Team posted tracking
   create table posted_events (
     id text primary key,
     title text not null,
     posted_at timestamp with time zone default timezone('utc'::text, now()),
     posted_by text,
     notes text
   );

   -- Team saved bookmarks
   create table saved_events (
     id text primary key,
     saved_at timestamp with time zone default timezone('utc'::text, now()),
     event_data jsonb not null
   );
   ```

3. **Adapter Swap**:
   In `src/utils/storageUtils.js`, update the implementation of `postedStore` and `savedStore` to read/write from Supabase while maintaining the exact same JavaScript method signatures (`getAll()`, `markAsPosted()`, `undoPosted()`, `toggleSave()`).
   *Zero UI components or pages will require modification.*

---

## 6. ConvenioMart Brand Aesthetics
- **Theme**: Clean SaaS White & Neutral light theme
- **Navy Primary**: `#0B192C`
- **Purple Brand Accent**: `#6C22A6` / `#4A249D`
- **Emerald Verified**: `#059669`
- **Amber Reported**: `#D97706`
- **Rose Unverified**: `#DC2626`

