/**
 * Content Verification Service
 * 
 * 3-Tier Verification Classification:
 * 1. Verified: Confirmed by an official governing body, official authority, or validated encyclopedic archive.
 * 2. Reported: Published by reputable mainstream news agencies, but awaiting direct official declaration.
 * 3. Unverified: Breaking claim, unverified reporting, or lack of primary source corroboration.
 */

// Official governing bodies and primary authorities
const OFFICIAL_AUTHORITY_DOMAINS = [
  'isro.gov.in',
  'nasa.gov',
  'pib.gov.in',
  'gov.in',
  'un.org',
  'who.int',
  'unesco.org',
  'guinnessworldrecords.com',
  'icc-cricket.com',
  'bcci.tv',
  'fifa.com',
  'olympics.com',
  'worldathletics.org',
  'fide.com',
  'nobelprize.org'
];

// Tier-1 Reputable News Publishers
const REPUTABLE_NEWS_DOMAINS = [
  'thehindu.com',
  'indianexpress.com',
  'espncricinfo.com',
  'bbc.com',
  'bbc.co.uk',
  'reuters.com',
  'apnews.com',
  'hindustantimes.com',
  'timesofindia.indiatimes.com',
  'ndtv.com'
];

/**
 * Extracts root domain from URL string
 */
function extractDomain(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

/**
 * Evaluates the verification status of an event item
 * 
 * @param {Object} event
 * @returns {Object} { status: 'verified' | 'reported' | 'unverified', reason: string, isOfficial: boolean }
 */
export function evaluateVerificationStatus(event) {
  if (!event) {
    return { status: 'unverified', reason: 'No event data available', isOfficial: false };
  }

  // Pre-designated verified datasets (e.g. historical archives, Wikidata, official UN calendar)
  if (event.sourceType === 'history_api' || event.sourceType === 'wikidata' || event.sourceType === 'official_calendar') {
    return {
      status: 'verified',
      reason: 'Verified by structured encyclopedic / official archive',
      isOfficial: true
    };
  }

  const sources = event.sources || (event.url ? [{ url: event.url, publisher: event.publisher }] : []);
  if (!sources || sources.length === 0) {
    return {
      status: 'unverified',
      reason: 'No verifiable source links provided',
      isOfficial: false
    };
  }

  // Rule: World record requires official confirmation
  const isRecordClaim = Boolean(
    event.achievementType === 'record' || 
    (event.title && /world record|guinness record|breaks record|national record/i.test(event.title))
  );

  let hasOfficialSource = false;
  let hasReputableNews = false;

  for (const src of sources) {
    const domain = extractDomain(src.url);
    if (!domain) continue;

    if (OFFICIAL_AUTHORITY_DOMAINS.some(auth => domain.endsWith(auth))) {
      hasOfficialSource = true;
      break;
    }

    if (REPUTABLE_NEWS_DOMAINS.some(rep => domain.endsWith(rep))) {
      hasReputableNews = true;
    }
  }

  // If claim is a world record
  if (isRecordClaim) {
    if (hasOfficialSource) {
      return {
        status: 'verified',
        reason: 'Officially confirmed by governing authority / Guinness',
        isOfficial: true
      };
    }
    if (hasReputableNews) {
      return {
        status: 'reported',
        reason: 'Reported record achievement (awaiting official governing body confirmation)',
        isOfficial: false
      };
    }
    return {
      status: 'unverified',
      reason: 'Unverified world record claim without official or tier-1 source corroboration',
      isOfficial: false
    };
  }

  if (hasOfficialSource) {
    return {
      status: 'verified',
      reason: 'Confirmed directly by official government / organizational source',
      isOfficial: true
    };
  }

  if (hasReputableNews) {
    return {
      status: 'reported',
      reason: 'Reported by reputable news agency with editorial review',
      isOfficial: false
    };
  }

  return {
    status: 'unverified',
    reason: 'Initial unconfirmed report or non-mainstream source',
    isOfficial: false
  };
}

/**
 * Returns UI metadata for rendering status badges
 */
export function getVerificationBadge(status) {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified',
        color: '#059669', // Emerald
        bgColor: '#ECFDF5',
        borderColor: '#A7F3D0',
        icon: 'CheckCircle2',
        tooltip: 'Officially confirmed by governing authority or encyclopedic source'
      };
    case 'reported':
      return {
        label: 'Reported',
        color: '#D97706', // Amber
        bgColor: '#FFFBEB',
        borderColor: '#FDE68A',
        icon: 'AlertCircle',
        tooltip: 'Reported by reputable media sources, awaiting formal declaration'
      };
    case 'unverified':
    default:
      return {
        label: 'Unverified',
        color: '#DC2626', // Rose
        bgColor: '#FEF2F2',
        borderColor: '#FECACA',
        icon: 'HelpCircle',
        tooltip: 'Unverified report or single unconfirmed publisher'
      };
  }
}
