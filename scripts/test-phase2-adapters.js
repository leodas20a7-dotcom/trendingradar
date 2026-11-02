/**
 * Automated Verification Script for Phase 2 Public Data Adapters
 * Run with: node scripts/test-phase2-adapters.js
 */

import { parseRssXml } from '../src/services/newsService.js';
import { getFestivalsForDate, getUpcomingFestivals } from '../src/services/festivalService.js';
import { fetchCelebrityBirthdays, getUpcomingCuratedBirthdays } from '../src/services/birthdayService.js';
import { fetchOnThisDayHistory } from '../src/services/historyService.js';
import { sourceStatusTracker } from '../src/services/sourceStatusTracker.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing RSS XML Parsing & CDATA Sanitization ---');
  const sampleRssXml = `
    <rss version="2.0">
      <channel>
        <title>The Hindu National</title>
        <item>
          <title><![CDATA[ISRO successfully prepares next phase of lunar exploration]]></title>
          <link>https://www.thehindu.com/sci-tech/science/isro-mission-phase/article9999.ece?utm_source=rss</link>
          <description><![CDATA[<p>Scientists in Bengaluru confirmed telemetry signals are healthy. <a href="#">Read more</a></p>]]></description>
          <pubDate>Mon, 02 Nov 2026 05:30:00 GMT</pubDate>
        </item>
        <item>
          <title>Tamil Nadu signs multi-crore investment MoU in Chennai</title>
          <link>https://www.thehindu.com/news/national/tamil-nadu/tn-mou-investment/article8888.ece</link>
          <description>The initiative is expected to generate 5000 new jobs in Coimbatore and Chennai.</description>
          <pubDate>Mon, 02 Nov 2026 06:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>
  `;

  const parsed = parseRssXml(sampleRssXml, {
    publisher: 'The Hindu',
    defaultCategory: 'National',
    defaultLocation: 'india',
    defaultCountry: 'India'
  });

  assert(parsed.length === 2, `Parsed 2 items from RSS XML (got: ${parsed.length})`);
  assert(!parsed[0].summary.includes('<p>') && !parsed[0].summary.includes('</a>'), 'Strips HTML tags from description');
  assert(parsed[0].title.includes('ISRO'), 'Correctly extracted CDATA headline');
  assert(parsed[1].url.includes('article8888.ece'), 'Extracted link correctly');

  console.log('\n--- 2. Testing Festival & Observance Engine (Asia/Kolkata) ---');
  const testNov2 = new Date('2026-11-02T10:00:00+05:30');
  const festivalsNov2 = getFestivalsForDate(testNov2);
  console.log(`  Found ${festivalsNov2.length} festivals for Nov 2:`, festivalsNov2.map(f => f.title));
  assert(festivalsNov2.some(f => f.title.includes('Crimes against Journalists')), 'Detected UN International Day on Nov 2');

  const testNov1 = new Date('2026-11-01T10:00:00+05:30');
  const festivalsNov1 = getFestivalsForDate(testNov1);
  assert(festivalsNov1.some(f => f.title.includes('Tamil Nadu Day')), 'Detected Tamil Nadu Day on Nov 1');

  const upcoming7 = getUpcomingFestivals(7, testNov2);
  console.log(`  Upcoming occasions in next 7 days:`, upcoming7.map(u => `${u.title} (${u.daysAwayLabel})`));
  assert(upcoming7.length >= 2, `Found ${upcoming7.length} upcoming occasions within 7 days`);
  assert(upcoming7.some(u => u.title.includes('Tsunami Awareness')), 'Includes World Tsunami Awareness Day (Nov 5)');
  assert(upcoming7.some(u => u.title.includes('Cancer Awareness')), 'Includes National Cancer Awareness Day (Nov 7)');

  console.log('\n--- 3. Testing Curated Indian & Tamil Celebrity Birthdays ---');
  const bdaysNov2 = await fetchCelebrityBirthdays(testNov2);
  const srk = bdaysNov2.find(b => b.personOrTeam === 'Shah Rukh Khan');
  assert(Boolean(srk), 'Shah Rukh Khan birthday recognized on Nov 2');
  if (srk) {
    assert(srk.location === 'india', 'SRK location mapped to India');
    assert(srk.verificationStatus === 'verified', 'Curated personality marked as Verified');
    assert(srk.birthYear === 1965, 'Exact birth year 1965 verified');
    assert(srk.sources[0].url.includes('wikipedia.org'), 'Source link points to authentic biography');
  }

  const upcomingBdays = getUpcomingCuratedBirthdays(7, testNov2);
  console.log('  Upcoming iconic birthdays in next 7 days:', upcomingBdays.map(b => b.personOrTeam));
  assert(upcomingBdays.some(b => b.personOrTeam === 'Virat Kohli'), 'Detects Virat Kohli birthday in upcoming 7 days (Nov 5)');
  assert(upcomingBdays.some(b => b.personOrTeam === 'Kamal Haasan'), 'Detects Kamal Haasan birthday in upcoming 7 days (Nov 7)');
  assert(upcomingBdays.some(b => b.personOrTeam === 'C. V. Raman'), 'Detects Nobel Laureate C.V. Raman birthday in upcoming 7 days (Nov 7)');

  console.log('\n--- 4. Testing Source Status Tracker ---');
  sourceStatusTracker.update('wikipedia_history', { status: 'online', latencyMs: 140, itemsDiscovered: 45 });
  sourceStatusTracker.update('rss_thehindu', { status: 'online', latencyMs: 220, itemsDiscovered: 12 });
  const overall = sourceStatusTracker.getOverallStatus();
  assert(overall === 'healthy' || overall === 'partial', `Overall status reported correctly: ${overall}`);

  console.log(`\n========================================`);
  console.log(`Phase 2 Unit Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();

