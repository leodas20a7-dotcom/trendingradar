/**
 * Text and URL Normalization Utilities for Smart Deduplication
 */

// Tracking parameters to strip from URLs
const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'ref',
  'ref_src',
  'ocid',
  'source',
  'campaign',
  '_hsenc',
  '_hsmi',
  'mc_cid',
  'mc_eid'
]);

// Common English stopwords for content similarity
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'won\'t', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // Common news filler verbs
  'says', 'said', 'report', 'reports', 'claims', 'shows', 'reveals', 'leads', 'leading',
  'new', 'today', 'latest', 'amid', 'over', 'ahead'
]);

// Common abbreviations normalization map
const ABBREVIATION_MAP = {
  'm.s.': 'ms',
  'm s': 'ms',
  'u.s.': 'us',
  'u.k.': 'uk',
  'u.n.': 'un',
  'w.t.c.': 'wtc',
  't-20': 't20',
  't 20': 't20',
  'twenty20': 't20',
  'odi': 'odi',
  'i.p.l.': 'ipl',
  'i.c.c.': 'icc',
  'b.c.c.i.': 'bcci',
  'isro': 'isro',
  'drdo': 'drdo',
  'nasa': 'nasa'
};

/**
 * Level 1: URL Normalization
 * Removes tracking parameters, trailing slashes, protocols, and standardizes casing
 */
export function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const urlObj = new URL(rawUrl.trim());
    
    // Remove tracking query params
    const keysToDelete = [];
    urlObj.searchParams.forEach((_, key) => {
      const lowerKey = key.toLowerCase();
      if (TRACKING_PARAMS.has(lowerKey) || lowerKey.startsWith('utm_')) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(k => urlObj.searchParams.delete(k));

    // Strip hash/fragment
    urlObj.hash = '';

    // Strip 'www.' prefix from hostname for canonical comparison
    if (urlObj.hostname.startsWith('www.')) {
      urlObj.hostname = urlObj.hostname.slice(4);
    }

    // Standardize pathname (remove redundant trailing slash unless root)
    let pathname = urlObj.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    urlObj.pathname = pathname;

    return urlObj.toString().toLowerCase();
  } catch {
    // If not a valid URL structure, do basic string cleanup
    return rawUrl
      .trim()
      .toLowerCase()
      .replace(/[?#].*$/, '')
      .replace(/\/+$/, '');
  }
}

/**
 * Level 2: Headline Normalization
 * Lowercase, remove unnecessary punctuation, normalize extra whitespace, standardize common abbreviations
 */
export function normalizeHeadline(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.toLowerCase().trim();

  // Standardize abbreviations
  for (const [abbr, repl] of Object.entries(ABBREVIATION_MAP)) {
    const regex = new RegExp(`\\b${abbr.replace(/\./g, '\\.')}\\b`, 'gi');
    cleaned = cleaned.replace(regex, repl);
  }

  // Replace hyphens and slashes with spaces to preserve word boundaries
  cleaned = cleaned.replace(/[-/]/g, ' ');

  // Remove punctuation except alphanumeric characters and spaces
  cleaned = cleaned.replace(/[^\w\s]/g, '');

  // Collapse multiple whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

// Known significant 2-letter tokens in Indian & international news/sports
const ALLOWED_SHORT_TOKENS = new Set(['ms', 'un', 'us', 'uk', 'eu', 'ai', 'wc', 'pm', 'cm', 'mp', 'it', 'up', 'tn']);

/**
 * Tokenizes normalized headline and removes stopwords
 */
export function extractSignificantKeywords(text) {
  const normalized = normalizeHeadline(text);
  if (!normalized) return [];

  const words = normalized.split(/\s+/);
  return words.filter(word => {
    if (STOPWORDS.has(word)) return false;
    return word.length > 2 || ALLOWED_SHORT_TOKENS.has(word);
  });
}

/**
 * Level 3: Headline Similarity (Jaccard Index on significant word tokens)
 * Returns similarity score between 0.0 and 1.0
 */
export function calculateJaccardSimilarity(text1, text2) {
  const set1 = new Set(extractSignificantKeywords(text1));
  const set2 = new Set(extractSignificantKeywords(text2));

  if (set1.size === 0 || set2.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of set1) {
    if (set2.has(token)) {
      intersectionCount++;
    }
  }

  const unionCount = new Set([...set1, ...set2]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Calculates Levenshtein Distance for string similarity
 */
export function calculateLevenshteinSimilarity(s1, s2) {
  const a = normalizeHeadline(s1);
  const b = normalizeHeadline(s2);

  if (a === b) return 1.0;
  if (!a.length || !b.length) return 0.0;

  const matrix = Array.from({ length: a.length + 1 }, () => 
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = matrix[a.length][b.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - (distance / maxLength);
}

/**
 * Headline similarity metric.
 * News headlines frequently invert sentence structure ("India wins under Dhoni" vs "Dhoni leads India to win").
 * If Jaccard token overlap is high or share 3+ key entities, headlines represent the same related event.
 */
export function calculateHeadlineSimilarity(text1, text2) {
  const kw1 = extractSignificantKeywords(text1);
  const kw2Set = new Set(extractSignificantKeywords(text2));
  const sharedCount = kw1.filter(k => kw2Set.has(k)).length;

  const jaccard = calculateJaccardSimilarity(text1, text2);

  // If they share 3 or more significant entities/keywords (e.g. Dhoni, India, World Cup)
  if (sharedCount >= 3) {
    return Math.max(0.68, jaccard);
  }

  // If token overlap is already strong, headline word-order inversion shouldn't penalize it
  if (jaccard >= 0.50) {
    return Math.max(0.60, jaccard);
  }

  const levenshtein = calculateLevenshteinSimilarity(text1, text2);
  return (jaccard * 0.75) + (levenshtein * 0.25);
}
