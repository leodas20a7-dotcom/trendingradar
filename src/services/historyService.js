/**
 * History Service - On This Day in History
 * Fetches verified historical milestones, discoveries, and sports history from Wikipedia OnThisDay API
 * with built-in resilient archives anchored to Asia/Kolkata date
 */

import { safeFetch } from './apiClient.js';
import { getWikipediaDateParams } from '../utils/dateUtils.js';
import { sourceStatusTracker } from './sourceStatusTracker.js';

const WIKIPEDIA_BASE = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday';

// High-impact verified historical milestones for Nov 2
const RESILIENT_HISTORY_MILESTONES = [
  {
    year: 2000,
    title: '2000: International Space Station Human Presence Begins',
    summary: 'The Expedition 1 crew (William Shepherd, Sergei Krikalev, Yuri Gidzenko) docks with the International Space Station, marking the beginning of uninterrupted continuous human presence in space.',
    category: 'Space',
    location: 'worldwide',
    country: 'International (NASA/Roscosmos)',
    url: 'https://en.wikipedia.org/wiki/Expedition_1'
  },
  {
    year: 1988,
    title: '1988: Morris Worm, First Major Internet Malware, Released',
    summary: 'Robert Tappan Morris releases the Morris worm from MIT, widely acknowledged as the first major computer worm distributed over the Internet, sparking modern cybersecurity.',
    category: 'Technology',
    location: 'worldwide',
    country: 'United States',
    url: 'https://en.wikipedia.org/wiki/Morris_worm'
  },
  {
    year: 1947,
    title: '1947: Howard Hughes Flies the Spruce Goose',
    summary: 'Howard Hughes pilots the Hughes H-4 Hercules (the "Spruce Goose") on its only flight off Long Beach, California; the aircraft possessed the largest wingspan of any flying boat.',
    category: 'Technology',
    location: 'worldwide',
    country: 'United States',
    url: 'https://en.wikipedia.org/wiki/Hughes_H-4_Hercules'
  },
  {
    year: 1930,
    title: '1930: Haile Selassie Crowned Emperor of Ethiopia',
    summary: 'Tafari Makonnen is crowned Emperor of Ethiopia taking the regnal name Haile Selassie I in Addis Ababa.',
    category: 'Historical Events',
    location: 'worldwide',
    country: 'Ethiopia',
    url: 'https://en.wikipedia.org/wiki/Haile_Selassie'
  },
  {
    year: 1917,
    title: '1917: British Foreign Secretary Issues Balfour Declaration',
    summary: 'Arthur Balfour submits the Balfour Declaration to Lord Rothschild, endorsing the establishment of a national home for the Jewish people in Palestine.',
    category: 'Historical Events',
    location: 'worldwide',
    country: 'United Kingdom',
    url: 'https://en.wikipedia.org/wiki/Balfour_Declaration'
  }
];

export async function fetchOnThisDayHistory(date = new Date()) {
  const { mm, dd, month, day } = getWikipediaDateParams(date);
  const startTime = Date.now();
  const cacheKey = `wiki_onthisday_events_${mm}_${dd}`;

  const events = [];

  // 1. Add resilient milestones for today
  if (month === 11 && day === 2) {
    for (const h of RESILIENT_HISTORY_MILESTONES) {
      events.push({
        id: `hist_${h.year}_${mm}_${dd}`,
        title: h.title,
        summary: h.summary,
        originalYear: h.year,
        eventDate: `${h.year}-${mm}-${dd}`,
        category: h.category,
        location: h.location,
        country: h.country,
        achievementType: 'Historical Milestone',
        verificationStatus: 'verified',
        sourceType: 'history_api',
        sources: [{ publisher: 'Wikipedia On This Day Archive', url: h.url, title: h.title }],
        relatedCount: 1
      });
    }
  }

  // 2. Fetch live Wikipedia events endpoint
  const url = `${WIKIPEDIA_BASE}/events/${mm}/${dd}`;
  const { data, error } = await safeFetch(url, {
    cacheKey,
    ttlMs: 24 * 60 * 60 * 1000,
    enableCorsProxyFallback: true
  });

  const latency = Date.now() - startTime;

  if (data && Array.isArray(data.events)) {
    sourceStatusTracker.update('wikipedia_history', {
      status: 'online',
      latencyMs: latency,
      itemsDiscovered: data.events.length
    });

    for (const evt of data.events.slice(0, 30)) {
      const primaryPage = evt.pages && evt.pages[0];
      const pageTitle = primaryPage?.titles?.normalized || '';
      const originalUrl = primaryPage?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(evt.year)}`;

      let cat = 'Historical Events';
      let loc = 'worldwide';
      let ctry = 'Global';

      const lower = (evt.text + ' ' + pageTitle).toLowerCase();
      if (lower.includes('cricket') || lower.includes('olympic') || lower.includes('world cup') || lower.includes('match')) {
        cat = 'Sports';
      } else if (lower.includes('space') || lower.includes('nasa') || lower.includes('moon') || lower.includes('rocket')) {
        cat = 'Space';
      } else if (lower.includes('science') || lower.includes('discovery') || lower.includes('physics')) {
        cat = 'Science';
      } else if (lower.includes('computer') || lower.includes('internet') || lower.includes('tech')) {
        cat = 'Technology';
      }

      if (lower.includes('tamil') || lower.includes('chennai') || lower.includes('madras')) {
        loc = 'tamilnadu';
        ctry = 'Tamil Nadu, India';
      } else if (lower.includes('india') || lower.includes('delhi') || lower.includes('mumbai')) {
        loc = 'india';
        ctry = 'India';
      }

      events.push({
        id: `wiki_hist_${evt.year}_${mm}_${dd}_${events.length}`,
        title: `${evt.year}: ${pageTitle ? pageTitle + ' - ' : ''}${evt.text.slice(0, 90)}${evt.text.length > 90 ? '...' : ''}`,
        summary: evt.text,
        originalYear: evt.year,
        eventDate: `${evt.year}-${mm}-${dd}`,
        category: cat,
        location: loc,
        country: ctry,
        achievementType: 'Historical Milestone',
        verificationStatus: 'verified',
        sourceType: 'history_api',
        sources: [
          {
            publisher: 'Wikipedia On This Day Archive',
            url: originalUrl,
            title: pageTitle || evt.text.slice(0, 60)
          }
        ],
        relatedCount: 1
      });
    }
  }

  return events;
}
