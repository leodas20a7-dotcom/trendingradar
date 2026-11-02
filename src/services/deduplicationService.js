/**
 * Smart Multi-Level Duplicate Detection & Event Grouping Engine
 * 
 * Levels:
 * Level 1: Exact normalized URL matching (UTM & tracking parameter stripping)
 * Level 2: Normalized headline matching
 * Level 3: Token overlap & Jaccard/Levenshtein text similarity
 * Level 4: Entity / subject / date event-level grouping with multi-source attribution
 */

import {
  normalizeUrl,
  normalizeHeadline,
  calculateHeadlineSimilarity,
  extractSignificantKeywords
} from '../utils/textNormalization.js';

// Similarity threshold to consider two headlines as covering the same event
const SIMILARITY_THRESHOLD = 0.58;

/**
 * Generates a stable unique ID for an event based on normalized title and event date
 */
export function generateEventId(item) {
  const normTitle = normalizeHeadline(item.title || '');
  const dateKey = item.eventDate || item.publishedAt ? (item.eventDate || item.publishedAt).slice(0, 10) : 'nodate';
  const slug = normTitle.slice(0, 40).replace(/\s+/g, '-');
  return `evt_${dateKey}_${slug || Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Extracts entities or key subjects from headline/summary/person fields
 */
function extractEntities(item) {
  const entities = new Set();
  if (item.personOrTeam) {
    normalizeHeadline(item.personOrTeam)
      .split(/\s+/)
      .forEach(w => w.length > 2 && entities.add(w));
  }
  return entities;
}

/**
 * Checks safeguards: do these two items represent strictly different events?
 */
function safeguardsForbidMerge(itemA, itemB) {
  // Safeguard 1: Different non-empty event dates
  if (itemA.eventDate && itemB.eventDate) {
    const dA = itemA.eventDate.slice(0, 10);
    const dB = itemB.eventDate.slice(0, 10);
    if (dA !== dB) {
      return true; // Different calendar event dates -> do not merge
    }
  }

  // Safeguard 2: Explicitly distinct subjects/categories
  if (itemA.category && itemB.category && itemA.category !== itemB.category) {
    // If one is Sports and another is Science, don't merge
    return true;
  }

  // Safeguard 3: If personOrTeam is known for both and share zero overlap
  if (itemA.personOrTeam && itemB.personOrTeam) {
    const normA = normalizeHeadline(itemA.personOrTeam);
    const normB = normalizeHeadline(itemB.personOrTeam);
    if (normA && normB && !normA.includes(normB) && !normB.includes(normA)) {
      const tokensA = new Set(normA.split(/\s+/));
      const tokensB = new Set(normB.split(/\s+/));
      const hasCommon = [...tokensA].some(t => tokensB.has(t));
      if (!hasCommon) return true;
    }
  }

  return false;
}

/**
 * Tests if itemA and itemB describe the same real-world event
 */
export function areItemsRelatedEvent(itemA, itemB) {
  // Level 1: Exact URL match
  const normUrlA = normalizeUrl(itemA.url || (itemA.sources && itemA.sources[0]?.url));
  const normUrlB = normalizeUrl(itemB.url || (itemB.sources && itemB.sources[0]?.url));
  if (normUrlA && normUrlB && normUrlA === normUrlB) {
    return { isMatch: true, reason: 'level1_exact_url' };
  }

  // Level 2: Exact normalized headline match
  const normHeadA = normalizeHeadline(itemA.title);
  const normHeadB = normalizeHeadline(itemB.title);
  if (normHeadA && normHeadB && normHeadA === normHeadB) {
    return { isMatch: true, reason: 'level2_exact_headline' };
  }

  // Check safeguards before fuzzy checks
  if (safeguardsForbidMerge(itemA, itemB)) {
    return { isMatch: false, reason: 'safeguard_mismatch' };
  }

  // Level 3 & Level 4: Headline text similarity + entity overlap
  const similarity = calculateHeadlineSimilarity(itemA.title, itemB.title);
  
  if (similarity >= SIMILARITY_THRESHOLD) {
    return { isMatch: true, reason: 'level3_headline_similarity', score: similarity };
  }

  // Entity-assisted grouping: if significant keyword overlap >= 40% AND common entity exists
  const kwA = extractSignificantKeywords(itemA.title);
  const kwB = extractSignificantKeywords(itemB.title);
  const entA = extractEntities(itemA);
  const entB = extractEntities(itemB);

  const sharedEntities = [...entA].filter(e => entB.has(e));
  if (sharedEntities.length > 0) {
    const setB = new Set(kwB);
    const sharedKw = kwA.filter(k => setB.has(k));
    if (sharedKw.length >= 2) {
      return { isMatch: true, reason: 'level4_entity_grouping', score: 0.55 };
    }
  }

  return { isMatch: false, score: similarity };
}

/**
 * Deduplicates and groups a raw list of raw event items into structured event cards
 * preserving every original publisher and article URL.
 * 
 * @param {Array<Object>} rawItems List of event/news objects
 * @returns {Array<Object>} Grouped unique events with multi-source attribution
 */
export function deduplicateAndGroupEvents(rawItems = []) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return [];
  }

  const grouped = [];
  const seenUrls = new Set();

  for (const rawItem of rawItems) {
    if (!rawItem || !rawItem.title) continue;

    const normUrl = normalizeUrl(rawItem.url);
    if (normUrl && seenUrls.has(normUrl)) {
      // Discard duplicate article URL
      continue;
    }

    const currentSource = {
      publisher: rawItem.publisher || 'Unknown Publisher',
      url: rawItem.url || '',
      publishedAt: rawItem.publishedAt || rawItem.eventDate || new Date().toISOString(),
      title: rawItem.title
    };

    // Check against existing grouped events
    let merged = false;
    for (const existing of grouped) {
      const matchResult = areItemsRelatedEvent(existing, rawItem);
      if (matchResult.isMatch) {
        // Merge into existing event card
        // Check if this source URL is already in existing.sources
        const existingUrls = new Set(existing.sources.map(s => normalizeUrl(s.url)));
        if (!existingUrls.has(normUrl)) {
          existing.sources.push(currentSource);
        }

        // Keep highest verification status
        if (rawItem.verificationStatus === 'verified' && existing.verificationStatus !== 'verified') {
          existing.verificationStatus = 'verified';
        } else if (rawItem.verificationStatus === 'reported' && existing.verificationStatus === 'unverified') {
          existing.verificationStatus = 'reported';
        }

        // Pick the longer/richer summary if existing is very brief
        if ((!existing.summary || existing.summary.length < 40) && rawItem.summary && rawItem.summary.length > existing.summary?.length) {
          existing.summary = rawItem.summary;
        }

        // Fill missing fields
        if (!existing.personOrTeam && rawItem.personOrTeam) {
          existing.personOrTeam = rawItem.personOrTeam;
        }
        if (!existing.country && rawItem.country) {
          existing.country = rawItem.country;
        }
        if (!existing.location && rawItem.location) {
          existing.location = rawItem.location;
        }

        existing.relatedCount = existing.sources.length;
        merged = true;
        break;
      }
    }

    if (!merged) {
      if (normUrl) seenUrls.add(normUrl);

      const eventId = rawItem.id || generateEventId(rawItem);
      const newEvent = {
        id: eventId,
        title: rawItem.title,
        summary: rawItem.summary || '',
        category: rawItem.category || 'General',
        location: rawItem.location || 'worldwide',
        country: rawItem.country || 'Global',
        personOrTeam: rawItem.personOrTeam || '',
        achievementType: rawItem.achievementType || '',
        eventDate: rawItem.eventDate || null,
        publishedAt: rawItem.publishedAt || null,
        verificationStatus: rawItem.verificationStatus || 'reported',
        sources: [currentSource],
        relatedCount: 1,
        sourceType: rawItem.sourceType || 'news',
        metadata: rawItem.metadata || {}
      };

      grouped.push(newEvent);
    }
  }

  return grouped;
}

