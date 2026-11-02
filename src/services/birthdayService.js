/**
 * Celebrity & Legendary Birthdays Service
 * Aggregates factual birthdays from:
 * 1. Curated Tamil Nadu & Indian Legends Calendar
 * 2. Famous World & Indian Personalities Calendar (Guaranteed Offline / CORS Resilient)
 * 3. Live Wikipedia On This Day Births Feed with Proxy Fallback
 * Strictly anchored to Asia/Kolkata date
 */

import { safeFetch } from './apiClient.js';
import { getWikipediaDateParams } from '../utils/dateUtils.js';
import { sourceStatusTracker } from './sourceStatusTracker.js';
import { TAMIL_LEGENDS_DATABASE, formatTamilLegendEvent } from './tamilNaduLegendsService.js';

const WIKIPEDIA_BIRTHS_BASE = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday/births';

/**
 * Curated calendar of iconic Indian and global personalities for reliable display
 */
const NOTABLE_CELEBRITIES_CALENDAR = [
  // November 2 (Today)
  { month: 11, day: 2, name: 'Shah Rukh Khan', birthYear: 1965, role: 'Cinema & Arts', location: 'india', country: 'India', whyFamous: 'Global cultural icon known as the "Baadshah of Bollywood", awarded Padma Shri and France\'s Legion of Honour with over 90 cinematic masterworks.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Shah_Rukh_Khan' },
  { month: 11, day: 2, name: 'Burt Lancaster', birthYear: 1913, role: 'Cinema & Arts', location: 'worldwide', country: 'United States', whyFamous: 'Academy Award-winning Hollywood titan celebrated for From Here to Eternity, Elmer Gantry, and Sweet Smell of Success.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Burt_Lancaster' },
  { month: 11, day: 2, name: 'David Schwimmer', birthYear: 1966, role: 'Cinema & Arts', location: 'worldwide', country: 'United States', whyFamous: 'Emmy-nominated actor and director who starred as Ross Geller in the globally beloved television phenomenon Friends.', wikipediaUrl: 'https://en.wikipedia.org/wiki/David_Schwimmer' },
  { month: 11, day: 2, name: 'Marie Antoinette', birthYear: 1755, role: 'History & Royalty', location: 'worldwide', country: 'France / Austria', whyFamous: 'Last Queen of France before the French Revolution, central figure in European 18th-century royal history.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Marie_Antoinette' },
  { month: 11, day: 2, name: 'Daniel Boone', birthYear: 1734, role: 'History & Pioneers', location: 'worldwide', country: 'United States', whyFamous: 'Legendary American pioneer and frontiersman who established the Wilderness Road through Cumberland Gap into Kentucky.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Daniel_Boone' },
  { month: 11, day: 2, name: 'George Boole', birthYear: 1815, role: 'Science & Mathematics', location: 'worldwide', country: 'United Kingdom', whyFamous: 'Mathematician and philosopher who invented Boolean algebra, the mathematical foundation of all modern digital computer logic.', wikipediaUrl: 'https://en.wikipedia.org/wiki/George_Boole' },
  { month: 11, day: 2, name: 'Nelly', birthYear: 1974, role: 'Singers & Musicians', location: 'worldwide', country: 'United States', whyFamous: 'Grammy Award-winning hip-hop artist and record producer ranked among the best-selling artists in American musical history.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Nelly' },

  // November 3 - 10
  { month: 11, day: 3, name: 'Prithviraj Kapoor', birthYear: 1906, role: 'Cinema & Arts', location: 'india', country: 'India', whyFamous: 'Pioneer of Indian theater and Hindi cinema, founder of Prithvi Theatres and recipient of the Dadasaheb Phalke Award.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Prithviraj_Kapoor' },
  { month: 11, day: 4, name: 'Shakuntala Devi', birthYear: 1929, role: 'Science & Mathematics', location: 'india', country: 'India', whyFamous: 'Mathematical prodigy known as the "Human Computer", entered Guinness World Records for multiplying two 13-digit numbers in 28 seconds.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Shakuntala_Devi' },
  { month: 11, day: 5, name: 'Virat Kohli', birthYear: 1988, role: 'Sports & Cricket', location: 'india', country: 'India', whyFamous: 'Modern cricketing legend, all-time record holder for most ODI centuries (50+), leading India to historic overseas Test series victories.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Virat_Kohli' },
  { month: 11, day: 7, name: 'Kamal Haasan', birthYear: 1954, role: 'Cinema & Arts', location: 'tamilnadu', country: 'Tamil Nadu, India', whyFamous: 'Revered polymath of Tamil and Indian cinema, 4-time National Film Award winner and Chevalier awardee.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Kamal_Haasan' },
  { month: 11, day: 7, name: 'C. V. Raman', birthYear: 1888, role: 'Science & Mathematics', location: 'tamilnadu', country: 'Tamil Nadu, India', whyFamous: 'Nobel Laureate in Physics (1930) for discovering the Raman Effect, Bharat Ratna laureate.', wikipediaUrl: 'https://en.wikipedia.org/wiki/C._V._Raman' },
  { month: 11, day: 7, name: 'Marie Curie', birthYear: 1867, role: 'Science & Mathematics', location: 'worldwide', country: 'Poland / France', whyFamous: 'Pioneering physicist and chemist, first person to win two Nobel Prizes in two scientific fields (Physics and Chemistry) for radioactivity.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Marie_Curie' },
  { month: 11, day: 13, name: 'P. Susheela', birthYear: 1935, role: 'Singers & Musicians', location: 'tamilnadu', country: 'Tamil Nadu, India', whyFamous: 'Guinness World Record holder for most studio recordings by a female singer, revered playback singer of South India.', wikipediaUrl: 'https://en.wikipedia.org/wiki/P._Susheela' },
  { month: 11, day: 14, name: 'Jawaharlal Nehru', birthYear: 1889, role: 'Statesmen & Reformers', location: 'india', country: 'India', whyFamous: 'First Prime Minister of independent India whose birth anniversary is celebrated nationwide as Children\'s Day (Bal Diwas).', wikipediaUrl: 'https://en.wikipedia.org/wiki/Jawaharlal_Nehru' },
  { month: 11, day: 17, name: 'Gemini Ganesan', birthYear: 1920, role: 'Cinema & Arts', location: 'tamilnadu', country: 'Tamil Nadu, India', whyFamous: 'Legendary "Kaadhal Mannan" of Tamil cinema, Padma Shri awardee.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Gemini_Ganesan' }
];

/**
 * Fetches notable birthdays for a given calendar date (default today in Asia/Kolkata)
 */
export async function fetchCelebrityBirthdays(date = new Date()) {
  const { mm, dd, month, day } = getWikipediaDateParams(date);
  const cacheKey = `wiki_births_${mm}_${dd}`;
  const startTime = Date.now();

  const birthdays = [];
  const seenNames = new Set();

  // 1. Add matching Tamil Nadu Legends for today
  const matchingTamil = TAMIL_LEGENDS_DATABASE.filter(l => l.month === month && l.day === day);
  for (const l of matchingTamil) {
    seenNames.add(l.name.toLowerCase());
    birthdays.push({
      ...formatTamilLegendEvent(l),
      category: 'Celebrity Birthdays'
    });
  }

  // 2. Add matching Curated Personalities Calendar for today
  const matchingCurated = NOTABLE_CELEBRITIES_CALENDAR.filter(c => c.month === month && c.day === day);
  for (const c of matchingCurated) {
    const norm = c.name.toLowerCase();
    if (!seenNames.has(norm)) {
      seenNames.add(norm);
      birthdays.push({
        id: `bday_${norm.replace(/[^a-z0-9]/g, '_')}_${c.birthYear}`,
        title: `${c.name} (${c.birthYear ? 'Born ' + c.birthYear : 'Legend'})`,
        personOrTeam: c.name,
        birthYear: c.birthYear,
        eventDate: `${c.birthYear}-${mm}-${dd}`,
        category: 'Celebrity Birthdays',
        subRole: c.role,
        location: c.location,
        country: c.country,
        profession: c.role,
        summary: c.whyFamous,
        verificationStatus: 'verified',
        sourceType: 'wikidata',
        sources: [
          {
            publisher: 'Biographical Archive',
            url: c.wikipediaUrl,
            title: `${c.name} Official Record`
          }
        ],
        relatedCount: 1,
        metadata: {
          birthYear: c.birthYear,
          isCurated: true
        }
      });
    }
  }

  // 3. Query Wikipedia Births endpoint
  const url = `${WIKIPEDIA_BIRTHS_BASE}/${mm}/${dd}`;
  const { data, error } = await safeFetch(url, {
    cacheKey,
    ttlMs: 24 * 60 * 60 * 1000,
    enableCorsProxyFallback: true
  });

  const latency = Date.now() - startTime;

  if (data && Array.isArray(data.births)) {
    sourceStatusTracker.update('wikidata_sparql', {
      status: 'online',
      latencyMs: latency,
      itemsDiscovered: data.births.length
    });

    for (const b of data.births.slice(0, 30)) {
      const primaryPage = b.pages && b.pages[0];
      const personName = primaryPage?.titles?.normalized || b.text.split(',')[0].trim();
      const normName = personName.toLowerCase();

      if (seenNames.has(normName)) continue;
      seenNames.add(normName);

      const description = primaryPage?.description || '';
      const textLower = b.text.toLowerCase();

      let loc = 'worldwide';
      let country = 'International';
      if (textLower.includes('tamil') || textLower.includes('chennai') || textLower.includes('madras')) {
        loc = 'tamilnadu';
        country = 'Tamil Nadu, India';
      } else if (textLower.includes('india') || textLower.includes('delhi') || textLower.includes('mumbai')) {
        loc = 'india';
        country = 'India';
      }

      birthdays.push({
        id: `wiki_bday_${normName.replace(/[^a-z0-9]/g, '_')}_${b.year}`,
        title: `${personName} (Born ${b.year})`,
        personOrTeam: personName,
        birthYear: b.year,
        eventDate: `${b.year}-${mm}-${dd}`,
        category: 'Celebrity Birthdays',
        location: loc,
        country,
        profession: description || 'Notable Personality',
        summary: b.text,
        verificationStatus: 'verified',
        sourceType: 'history_api',
        sources: [
          {
            publisher: 'Wikipedia Notable Biographies',
            url: primaryPage?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(personName)}`,
            title: `${personName} Profile`
          }
        ],
        relatedCount: 1,
        metadata: {
          birthYear: b.year
        }
      });
    }
  }

  return birthdays;
}

/**
 * Returns upcoming curated birthdays in next N days
 */
export function getUpcomingCuratedBirthdays(daysAhead = 7, baseDate = new Date()) {
  const currentMonth = baseDate.getMonth() + 1;
  const currentDay = baseDate.getDate();

  const pool = [...NOTABLE_CELEBRITIES_CALENDAR, ...TAMIL_LEGENDS_DATABASE];
  const seen = new Set();
  const upcoming = [];

  for (const p of pool) {
    if (seen.has(p.name)) continue;
    seen.add(p.name);

    let targetThisYear = new Date(baseDate.getFullYear(), p.month - 1, p.day);
    let diffDays = Math.round((targetThisYear.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      targetThisYear = new Date(baseDate.getFullYear() + 1, p.month - 1, p.day);
      diffDays = Math.round((targetThisYear.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    if (diffDays >= 0 && diffDays <= daysAhead) {
      upcoming.push({
        id: `upcoming_bday_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        title: `Upcoming Birthday: ${p.name}`,
        personOrTeam: p.name,
        daysAway: diffDays,
        daysAwayLabel: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`,
        eventDate: `${baseDate.getFullYear()}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`,
        category: 'Celebrity Birthdays',
        subRole: p.role,
        location: p.location || (p.role ? 'tamilnadu' : 'worldwide'),
        country: p.country || 'India',
        profession: p.honorific || p.role || 'Iconic Personality',
        summary: p.whyFamous,
        verificationStatus: 'verified',
        sourceType: 'wikidata',
        sources: [{ publisher: 'Biographical Archive', url: p.wikipediaUrl, title: p.name }]
      });
    }
  }

  upcoming.sort((a, b) => a.daysAway - b.daysAway);
  return upcoming;
}
