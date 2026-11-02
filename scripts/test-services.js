// Test script to verify API adapters
async function testWikipedia() {
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/11/02', {
      headers: { 'User-Agent': 'ConvenioMartTrendRadar/1.0 (marketing@conveniomart.example)' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[OK] Wikipedia OnThisDay:', {
      events: data.events?.length || 0,
      births: data.births?.length || 0,
      holidays: data.holidays?.length || 0
    });
  } catch (err) {
    console.error('[FAIL] Wikipedia OnThisDay:', err.message);
  }
}

async function testWikidata() {
  try {
    const query = `
      SELECT ?person ?personLabel ?birthDate ?occupationLabel WHERE {
        ?person wdt:P31 wd:Q5 .
        ?person wdt:P569 ?birthDate .
        FILTER(MONTH(?birthDate) = 11 && DAY(?birthDate) = 2)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      LIMIT 5
    `;
    const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'ConvenioMartTrendRadar/1.0 (marketing@conveniomart.example)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[OK] Wikidata SPARQL returned bindings:', data.results?.bindings?.length || 0);
  } catch (err) {
    console.log('[INFO] Wikidata SPARQL (status handled):', err.message);
  }
}

async function testRssFeeds() {
  const feeds = [
    { name: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
    { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'ESPNcricinfo', url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml' }
  ];

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'ConvenioMartTrendRadar/1.0' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      console.log(`[OK] RSS ${feed.name}: received ${text.length} bytes`);
    } catch (err) {
      console.log(`[FAIL] RSS ${feed.name}:`, err.message);
    }
  }
}

async function run() {
  console.log('Testing live public sources...');
  await testWikipedia();
  await testWikidata();
  await testRssFeeds();
}

run();

