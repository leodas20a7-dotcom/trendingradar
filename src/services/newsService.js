/**
 * News Service - Real-World RSS Feed Aggregation Engine
 * Safely fetches and parses trusted RSS feeds from The Hindu, BBC, ESPNcricinfo
 * with browser CORS proxies, HTML stripping, category classification, and deduplication.
 */

import { safeFetch } from './apiClient.js';
import { evaluateVerificationStatus } from './verificationService.js';
import { deduplicateAndGroupEvents } from './deduplicationService.js';
import { sourceStatusTracker } from './sourceStatusTracker.js';

export const RSS_FEEDS_CONFIG = [
  {
    id: 'rss_thehindu_national',
    trackerId: 'rss_thehindu',
    name: 'The Hindu National',
    publisher: 'The Hindu',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    defaultCategory: 'National',
    defaultLocation: 'india',
    defaultCountry: 'India'
  },
  {
    id: 'rss_thehindu_sports',
    trackerId: 'rss_thehindu',
    name: 'The Hindu Sports',
    publisher: 'The Hindu',
    url: 'https://www.thehindu.com/sport/feeder/default.rss',
    defaultCategory: 'Sports',
    defaultLocation: 'india',
    defaultCountry: 'India'
  },
  {
    id: 'rss_espncricinfo',
    trackerId: 'rss_espncricinfo',
    name: 'ESPNcricinfo Cricket Stories',
    publisher: 'ESPNcricinfo',
    url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
    defaultCategory: 'Sports',
    defaultLocation: 'india',
    defaultCountry: 'India'
  },
  {
    id: 'rss_bbc_world',
    trackerId: 'rss_bbc',
    name: 'BBC World News',
    publisher: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    defaultCategory: 'International',
    defaultLocation: 'worldwide',
    defaultCountry: 'Global'
  },
  {
    id: 'rss_bbc_tech',
    trackerId: 'rss_bbc',
    name: 'BBC Technology',
    publisher: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    defaultCategory: 'Technology',
    defaultLocation: 'worldwide',
    defaultCountry: 'Global'
  }
];

/**
 * Strips HTML tags and unescapes XML/HTML entities
 */
function cleanHtml(html = '') {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust XML Item parser working across Browser DOMParser and Regex fallback
 */
export function parseRssXml(xmlString, feedConfig) {
  if (!xmlString || typeof xmlString !== 'string') return [];

  const items = [];

  // Browser DOMParser path
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const itemNodes = xmlDoc.querySelectorAll('item, entry');

      itemNodes.forEach(node => {
        const titleNode = node.querySelector('title');
        const linkNode = node.querySelector('link');
        const descNode = node.querySelector('description, summary');
        const pubDateNode = node.querySelector('pubDate, published, updated');

        const title = cleanHtml(titleNode?.textContent || '');
        const url = (linkNode?.getAttribute('href') || linkNode?.textContent || '').trim();
        const summary = cleanHtml(descNode?.textContent || '');
        const publishedAt = pubDateNode?.textContent?.trim() || null;

        if (title && url) {
          items.push({
            title,
            summary,
            url,
            publishedAt,
            publisher: feedConfig.publisher,
            defaultCategory: feedConfig.defaultCategory,
            defaultLocation: feedConfig.defaultLocation,
            defaultCountry: feedConfig.defaultCountry
          });
        }
      });

      if (items.length > 0) return items;
    } catch {
      // Fall through to regex parser
    }
  }

  // Regex fallback (runs on Node or when DOMParser fails on quirky XML)
  const itemRegex = /<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi;
  const matches = xmlString.match(itemRegex) || [];

  for (const block of matches) {
    const titleMatch = block.match(/<title(?:\s+[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = block.match(/<link(?:\s+[^>]*href=["']([^"']+)["'])?(?:\s+[^>]*)?>([\s\S]*?)<\/link>/i);
    const descMatch = block.match(/<(?:description|summary)(?:\s+[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:description|summary)>/i);
    const pubDateMatch = block.match(/<(?:pubDate|published|updated)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:pubDate|published|updated)>/i);

    const title = cleanHtml(titleMatch ? titleMatch[1] : '');
    let url = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';
    const summary = cleanHtml(descMatch ? descMatch[1] : '');
    const publishedAt = pubDateMatch ? pubDateMatch[1].trim() : null;

    if (title && (url || block.includes('guid'))) {
      if (!url) {
        const guidMatch = block.match(/<guid(?:\s+isPermaLink=["']true["'])?>([\s\S]*?)<\/guid>/i);
        if (guidMatch && guidMatch[1].startsWith('http')) url = guidMatch[1].trim();
      }

      if (url) {
        items.push({
          title,
          summary,
          url,
          publishedAt,
          publisher: feedConfig.publisher,
          defaultCategory: feedConfig.defaultCategory,
          defaultLocation: feedConfig.defaultLocation,
          defaultCountry: feedConfig.defaultCountry
        });
      }
    }
  }

  return items;
}

/**
 * Detects specific category, location, and person from article content
 */
function enrichNewsItem(rawItem) {
  const combined = (rawItem.title + ' ' + rawItem.summary).toLowerCase();

  let category = rawItem.defaultCategory || 'General';
  let location = rawItem.defaultLocation || 'worldwide';
  let country = rawItem.defaultCountry || 'Global';

  // Location heuristics
  if (/\b(tamil nadu|chennai|coimbatore|madurai|trichy|salem|tirunelveli|dmk|aiadmk|mk stalin)\b/.test(combined)) {
    location = 'tamilnadu';
    country = 'India (Tamil Nadu)';
  } else if (/\b(india|delhi|mumbai|bengaluru|hyderabad|bjp|congress|isro|bcci|modi|parliament)\b/.test(combined)) {
    location = 'india';
    country = 'India';
  }

  // Category heuristics
  if (/\b(cricket|kohli|rohit|dhoni|ipl|bcci|icc|test match|t20|football|tennis|badminton|olympic|world cup|fifa)\b/.test(combined)) {
    category = 'Sports';
  } else if (/\b(isro|nasa|satellite|space|galaxy|moon|mars|rocket|telescope)\b/.test(combined)) {
    category = 'Space';
  } else if (/\b(ai|artificial intelligence|tech|google|apple|microsoft|semiconductor|cyber|robot|software)\b/.test(combined)) {
    category = 'Technology';
  } else if (/\b(cinema|film|movie|actor|actress|box office|hollywood|bollywood|kollywood|release)\b/.test(combined)) {
    category = 'Entertainment';
  } else if (/\b(economy|market|gdp|inflation|sensex|nifty|rbi|rupee|stocks|trade|business|startup)\b/.test(combined)) {
    category = 'Business';
  } else if (/\b(science|study|researchers|university|discovery|biology|chemistry|physics)\b/.test(combined)) {
    category = 'Science';
  }

  // Record / Achievement detection
  let achievementType = null;
  if (/\b(record|breaks record|world record|highest ever|milestone|historic victory|champion)\b/.test(combined)) {
    achievementType = 'Reported Achievement';
  }

  // Verification status evaluation
  const evalResult = evaluateVerificationStatus({
    title: rawItem.title,
    achievementType: achievementType ? 'record' : null,
    sources: [{ url: rawItem.url, publisher: rawItem.publisher }]
  });

  return {
    title: rawItem.title,
    summary: rawItem.summary,
    url: rawItem.url,
    publisher: rawItem.publisher,
    publishedAt: rawItem.publishedAt,
    eventDate: rawItem.publishedAt ? rawItem.publishedAt.slice(0, 10) : null,
    category,
    location,
    country,
    achievementType,
    verificationStatus: evalResult.status,
    sourceType: 'news'
  };
}

/**
 * Fetches all configured RSS feeds and returns deduplicated, grouped trending events
 */
export async function fetchTrendingNews() {
  const allRawItems = [];

  for (const feed of RSS_FEEDS_CONFIG) {
    const startTime = Date.now();
    const cacheKey = `rss_cache_${feed.id}`;

    const { data: xmlText, error, fromCache } = await safeFetch(feed.url, {
      cacheKey,
      ttlMs: 15 * 60 * 1000, // 15 mins TTL
      responseType: 'text',
      enableCorsProxyFallback: true,
      headers: { 'User-Agent': 'ConvenioMartTrendRadar/1.0' }
    });

    const latency = Date.now() - startTime;

    if (error || !xmlText) {
      sourceStatusTracker.update(feed.trackerId, {
        status: fromCache ? 'cached' : 'unavailable',
        latencyMs: latency,
        error: error || 'Failed to fetch RSS feed'
      });
      continue;
    }

    try {
      const parsed = parseRssXml(xmlText, feed);
      const enriched = parsed.map(enrichNewsItem);
      allRawItems.push(...enriched);

      sourceStatusTracker.update(feed.trackerId, {
        status: 'online',
        latencyMs: latency,
        error: null,
        itemsDiscovered: parsed.length
      });
    } catch (parseErr) {
      sourceStatusTracker.update(feed.trackerId, {
        status: 'degraded',
        latencyMs: latency,
        error: `XML Parse Error: ${parseErr.message}`
      });
    }
  }

  // Deduplicate and group matching events across feeds
  const groupedEvents = deduplicateAndGroupEvents(allRawItems);
  return groupedEvents;
}

