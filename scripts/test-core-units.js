/**
 * Unit Test Runner for Phase 1 Core Architecture
 * Run with: node scripts/test-core-units.js
 */

import {
  normalizeUrl,
  normalizeHeadline,
  calculateHeadlineSimilarity
} from '../src/utils/textNormalization.js';

import {
  deduplicateAndGroupEvents,
  areItemsRelatedEvent
} from '../src/services/deduplicationService.js';

import {
  evaluateVerificationStatus
} from '../src/services/verificationService.js';

import {
  getISTDateParts,
  isSameDayIST,
  isWithinUpcomingDaysIST
} from '../src/utils/dateUtils.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

console.log('\n--- 1. Testing URL Normalization & UTM Stripping ---');
const rawUrl1 = 'https://www.thehindu.com/sport/cricket/article1234.ece?utm_source=twitter&utm_medium=social&utm_campaign=trend#comments';
const norm1 = normalizeUrl(rawUrl1);
assert(!norm1.includes('utm_source'), 'Strips utm_source');
assert(!norm1.includes('utm_medium'), 'Strips utm_medium');
assert(!norm1.includes('#comments'), 'Strips URL hash fragments');
assert(norm1.includes('/sport/cricket/article1234.ece'), 'Preserves article canonical path');

const rawUrl2 = 'https://www.thehindu.com/sport/cricket/article1234.ece/';
assert(normalizeUrl(rawUrl1) === normalizeUrl(rawUrl2), 'Level 1: Canonical URLs match across tracking parameters and trailing slashes');

console.log('\n--- 2. Testing Headline Normalization & Similarity ---');
const h1 = 'India wins World Cup under Dhoni.';
const h2 = 'MS Dhoni leads India to historic World Cup victory.';
const normH1 = normalizeHeadline(h1);
const normH2 = normalizeHeadline(h2);
assert(normH1.includes('dhoni') && normH1.includes('world cup'), 'Normalizes punctuation and abbreviations');
const simScore = calculateHeadlineSimilarity(h1, h2);
console.log(`  Similarity between ("${h1}") and ("${h2}"): ${(simScore * 100).toFixed(1)}%`);
assert(simScore >= 0.55, 'Dhoni World Cup examples pass similarity threshold as related content');

console.log('\n--- 3. Testing Safeguards (Do Not Merge Unrelated) ---');
const eventA = {
  title: 'Virat Kohli scores 50th ODI century in Mumbai',
  personOrTeam: 'Virat Kohli',
  eventDate: '2023-11-15',
  category: 'Sports',
  url: 'https://espncricinfo.com/series/1/kohli-century'
};
const eventB = {
  title: 'Rohit Sharma breaks sixes record in Ahmedabad',
  personOrTeam: 'Rohit Sharma',
  eventDate: '2023-11-15',
  category: 'Sports',
  url: 'https://thehindu.com/sport/rohit-sixes'
};
const matchDistinctPersons = areItemsRelatedEvent(eventA, eventB);
assert(!matchDistinctPersons.isMatch, 'Safeguard: Does not merge separate achievements by different players on same day');

const eventC = {
  title: 'ISRO launches Chandrayaan-3 mission',
  eventDate: '2023-07-14',
  category: 'Science',
  url: 'https://isro.gov.in/launch1'
};
const eventD = {
  title: 'ISRO launches Aditya-L1 solar observatory',
  eventDate: '2023-09-02',
  category: 'Science',
  url: 'https://isro.gov.in/launch2'
};
const matchDifferentDates = areItemsRelatedEvent(eventC, eventD);
assert(!matchDifferentDates.isMatch, 'Safeguard: Does not merge different space missions occurring on different dates');

console.log('\n--- 4. Testing Multi-Level Deduplication & Source Grouping ---');
const feedItems = [
  {
    title: 'India wins World Cup under Dhoni',
    summary: 'India lifts trophy after 28 years.',
    publisher: 'The Hindu',
    url: 'https://thehindu.com/sport/india-wc?utm_source=feed',
    personOrTeam: 'MS Dhoni',
    eventDate: '2011-04-02',
    category: 'Sports'
  },
  {
    title: 'MS Dhoni leads India to historic World Cup victory',
    summary: 'A six to finish the World Cup in style at Wankhede.',
    publisher: 'BBC News',
    url: 'https://bbc.com/sport/cricket/india-world-cup',
    personOrTeam: 'MS Dhoni',
    eventDate: '2011-04-02',
    category: 'Sports'
  },
  {
    title: 'World Cup 2011: Dhoni and India crowned world champions',
    summary: 'Celebrations across India as national team secures trophy.',
    publisher: 'Reuters',
    url: 'https://reuters.com/article/cricket-wc-dhoni',
    personOrTeam: 'MS Dhoni',
    eventDate: '2011-04-02',
    category: 'Sports'
  },
  {
    title: 'Unrelated: New technology discoveries in quantum computing',
    summary: 'Researchers demonstrate quantum advantage.',
    publisher: 'TechCrunch',
    url: 'https://techcrunch.com/quantum',
    category: 'Technology'
  }
];

const grouped = deduplicateAndGroupEvents(feedItems);
assert(grouped.length === 2, `Grouped 4 articles into 2 distinct events (got: ${grouped.length})`);
const cricketEvent = grouped.find(g => g.category === 'Sports');
assert(cricketEvent && cricketEvent.sources.length === 3, `Combined 3 publishers into 1 event card with 3 sources (got: ${cricketEvent?.sources.length})`);
assert(cricketEvent.sources.some(s => s.publisher === 'The Hindu'), 'Retains The Hindu source link');
assert(cricketEvent.sources.some(s => s.publisher === 'BBC News'), 'Retains BBC News source link');
assert(cricketEvent.sources.some(s => s.publisher === 'Reuters'), 'Retains Reuters source link');

console.log('\n--- 5. Testing Content Verification Logic ---');
const officialSpaceEvent = {
  title: 'Chandrayaan-3 soft landing confirmed on lunar south pole',
  url: 'https://www.isro.gov.in/chandrayaan3-landing.html',
  publisher: 'ISRO Official',
  sources: [{ url: 'https://www.isro.gov.in/chandrayaan3-landing.html', publisher: 'ISRO' }]
};
const eval1 = evaluateVerificationStatus(officialSpaceEvent);
assert(eval1.status === 'verified' && eval1.isOfficial, 'ISRO source marked as Officially Verified');

const worldRecordClaim = {
  title: 'Local athlete breaks world record in marathon claim',
  achievementType: 'record',
  url: 'https://dailyblog.example.com/athlete-record',
  sources: [{ url: 'https://dailyblog.example.com/athlete-record', publisher: 'Daily Blog' }]
};
const eval2 = evaluateVerificationStatus(worldRecordClaim);
assert(eval2.status === 'unverified', 'Unverified world record claim marked as Unverified');

const reportedNews = {
  title: 'Cabinet approves new infrastructure initiative',
  url: 'https://thehindu.com/news/national/cabinet-project',
  sources: [{ url: 'https://thehindu.com/news/national/cabinet-project', publisher: 'The Hindu' }]
};
const eval3 = evaluateVerificationStatus(reportedNews);
assert(eval3.status === 'reported', 'Tier-1 news publisher marked as Reported');

console.log('\n--- 6. Testing Asia/Kolkata (IST) Date Engine ---');
const istParts = getISTDateParts();
console.log(`  Current IST calculation: ${istParts.formattedDate} | ${istParts.formattedTime}`);
assert(istParts.year >= 2024 && istParts.isoDate.length === 10, 'Computes valid IST calendar date');

const testToday = new Date('2026-11-02T11:28:00+05:30');
const testUpcoming = new Date('2026-11-06T12:00:00+05:30');
const testFarAway = new Date('2026-11-20T12:00:00+05:30');

assert(isWithinUpcomingDaysIST(testUpcoming, 7, testToday), 'Detects event within upcoming 7 days');
assert(!isWithinUpcomingDaysIST(testFarAway, 7, testToday), 'Excludes event beyond 7 days');

console.log(`\n========================================`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}

