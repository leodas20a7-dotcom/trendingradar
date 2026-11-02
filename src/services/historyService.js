/**
 * History Service - On This Day in History
 * Fetches verified historical milestones, discoveries, and sports history from Wikipedia OnThisDay API
 * Anchored to Asia/Kolkata current date
 */

import { safeFetch } from './apiClient.js';
import { getWikipediaDateParams } from '../utils/dateUtils.js';
import { sourceStatusTracker } from './sourceStatusTracker.js';

const WIKIPEDIA_BASE = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday';

/**
 * Detects category and location from event text and article titles
 */
function categorizeHistoryEvent(text = '', pages = []) {
  const lower = (text + ' ' + pages.map(p => p.titles?.normalized || '').join(' ')).toLowerCase();

  let category = 'Historical Events';
  let location = 'worldwide';
  let country = 'Global';

  // Location detection
  if (/\b(tamil nadu|madras|chennai|coimbatore|madurai|kaveri|thanjavur)\b/.test(lower)) {
    location = 'tamilnadu';
    country = 'India (Tamil Nadu)';
  } else if (/\b(india|indian|delhi|mumbai|bombay|bengal|kolkata|calcutta|gandhi|nehru|bcci|isro)\b/.test(lower)) {
    location = 'india';
    country = 'India';
  }

  // Category detection
  if (/\b(cricket|olympic|world cup|football|tennis|medal|championship|match|tournament|athletics)\b/.test(lower)) {
    category = 'Sports';
  } else if (/\b(space|satellite|isro|nasa|apollo|moon|orbit|rocket|mars|planet|launch)\b/.test(lower)) {
    category = 'Space';
  } else if (/\b(discovery|nobel|physics|chemistry|medicine|vaccine|invented|patent|scientific)\b/.test(lower)) {
    category = 'Science';
  } else if (/\b(computer|internet|software|technology|electric|telecom|transistor)\b/.test(lower)) {
    category = 'Technology';
  }

  return { category, location, country };
}

/**
 * Fetches On This Day historical events for the given date (default today in Asia/Kolkata)
 */
export async function fetchOnThisDayHistory(date = new Date()) {
  const { mm, dd } = getWikipediaDateParams(date);
  const startTime = Date.now();
  const cacheKey = `wiki_onthisday_events_${mm}_${dd}`;

  const url = `${WIKIPEDIA_BASE}/events/${mm}/${dd}`;

  const { data, error, fromCache } = await safeFetch(url, {
    cacheKey,
    ttlMs: 24 * 60 * 60 * 1000, // 24 hours
    headers: {
      'User-Agent': 'ConvenioMartTrendRadar/1.0 (marketing@conveniomart.example)'
    }
  });

  const latency = Date.now() - startTime;

  if (error || !data) {
    sourceStatusTracker.update('wikipedia_history', {
      status: fromCache ? 'cached' : 'unavailable',
      error: error || 'Failed to fetch Wikipedia OnThisDay',
      latencyMs: latency
    });
    return [];
  }

  const rawEvents = data.events || [];

  const normalizedEvents = rawEvents.map((evt, idx) => {
    const primaryPage = evt.pages && evt.pages[0];
    const originalUrl = primaryPage?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(evt.year)}`;
    const pageTitle = primaryPage?.titles?.normalized || '';
    const { category, location, country } = categorizeHistoryEvent(evt.text, evt.pages || []);

    return {
      id: `hist_${evt.year}_${mm}_${dd}_${idx}`,
      title: `${evt.year}: ${pageTitle ? pageTitle + ' - ' : ''}${evt.text.slice(0, 100)}${evt.text.length > 100 ? '...' : ''}`,
      summary: evt.text,
      originalYear: evt.year,
      eventDate: `${evt.year}-${mm}-${dd}`,
      publishedAt: null,
      category,
      location,
      country,
      personOrTeam: pageTitle,
      achievementType: category === 'Sports' ? 'Historical Sporting Milestone' : 'Historical Milestone',
      verificationStatus: 'verified',
      sourceType: 'history_api',
      sources: [
        {
          publisher: 'Wikipedia On This Day Archive',
          url: originalUrl,
          publishedAt: `${evt.year}-${mm}-${dd}`,
          title: pageTitle || evt.text.slice(0, 80)
        }
      ],
      relatedCount: 1,
      metadata: {
        year: evt.year,
        pages: (evt.pages || []).slice(0, 3).map(p => ({
          title: p.titles?.normalized,
          url: p.content_urls?.desktop?.page,
          thumbnail: p.thumbnail?.source
        }))
      }
    };
  });

  sourceStatusTracker.update('wikipedia_history', {
    status: 'online',
    error: null,
    latencyMs: latency,
    itemsDiscovered: normalizedEvents.length
  });

  return normalizedEvents;
}

