/**
 * Festivals & Special Days Engine
 * Covers Tamil Nadu festivals, Indian national celebrations, regional festivals,
 * and United Nations International Days.
 * Strictly anchored to Asia/Kolkata date.
 */

import { getISTDateParts } from '../utils/dateUtils.js';

export const FESTIVALS_DATABASE = [
  // November
  {
    month: 11,
    day: 1,
    name: 'Tamil Nadu Day (Tamil Nadu Pirappu)',
    region: 'Tamil Nadu',
    location: 'tamilnadu',
    type: 'State Observance',
    explanation: 'Commemorates the formation of the linguistic state of Tamil Nadu in 1956.',
    source: 'Government of Tamil Nadu Official Gazette',
    sourceUrl: 'https://www.tn.gov.in/'
  },
  {
    month: 11,
    day: 2,
    name: 'International Day to End Impunity for Crimes against Journalists',
    region: 'International',
    location: 'worldwide',
    type: 'UN International Day',
    explanation: 'Adopted by the United Nations General Assembly in Resolution A/RES/68/163 to safeguard freedom of expression.',
    source: 'United Nations Official Calendar',
    sourceUrl: 'https://www.un.org/en/observances/end-impunity-crimes-journalists'
  },
  {
    month: 11,
    day: 5,
    name: 'World Tsunami Awareness Day',
    region: 'International',
    location: 'worldwide',
    type: 'UN International Day',
    explanation: 'UN designated day to raise awareness about tsunami risk reduction and early warning systems.',
    source: 'United Nations Disaster Risk Reduction',
    sourceUrl: 'https://www.un.org/en/observances/tsunami-awareness-day'
  },
  {
    month: 11,
    day: 7,
    name: 'National Cancer Awareness Day (India)',
    region: 'India',
    location: 'india',
    type: 'National Awareness Day',
    explanation: 'Observed annually in India on the birth anniversary of Nobel laureate Madame Curie to promote early cancer detection.',
    source: 'Ministry of Health and Family Welfare (MoHFW)',
    sourceUrl: 'https://main.mohfw.gov.in/'
  },
  {
    month: 11,
    day: 11,
    name: 'National Education Day (Rashtriya Shiksha Diwas)',
    region: 'India',
    location: 'india',
    type: 'National Observance',
    explanation: 'Commemorates the birth anniversary of Maulana Abul Kalam Azad, the first education minister of independent India.',
    source: 'Ministry of Education, Government of India',
    sourceUrl: 'https://www.education.gov.in/'
  },
  {
    month: 11,
    day: 14,
    name: 'Children\'s Day (Bal Diwas) & World Diabetes Day',
    region: 'India & International',
    location: 'india',
    type: 'National & Global Observance',
    explanation: 'Celebrated across India on Jawaharlal Nehru\'s birthday to advocate for child welfare, and globally as UN World Diabetes Day.',
    source: 'Government of India & WHO',
    sourceUrl: 'https://www.who.int/campaigns/world-diabetes-day'
  },
  {
    month: 11,
    day: 19,
    name: 'National Integration Day & World Toilet Day',
    region: 'India & International',
    location: 'india',
    type: 'National & UN Observance',
    explanation: 'Commemorates national unity on Indira Gandhi\'s birth anniversary, alongside UN sanitation awareness day.',
    source: 'United Nations & Govt of India',
    sourceUrl: 'https://www.un.org/en/observances/toilet-day'
  },
  {
    month: 11,
    day: 20,
    name: 'World Children\'s Day',
    region: 'International',
    location: 'worldwide',
    type: 'UN International Day',
    explanation: 'Promotes international togetherness, awareness among children worldwide, and improving children\'s welfare.',
    source: 'UNICEF / United Nations',
    sourceUrl: 'https://www.un.org/en/observances/world-childrens-day'
  },
  {
    month: 11,
    day: 26,
    name: 'Constitution Day of India (Samvidhan Divas)',
    region: 'India',
    location: 'india',
    type: 'National Observance',
    explanation: 'Commemorates the adoption of the Constitution of India in 1949 by the Constituent Assembly.',
    source: 'Ministry of Law and Justice, Govt of India',
    sourceUrl: 'https://legislative.gov.in/constitution-day'
  },
  // December
  {
    month: 12,
    day: 1,
    name: 'World AIDS Day',
    region: 'International',
    location: 'worldwide',
    type: 'UN International Day',
    explanation: 'Dedicated to raising awareness of the AIDS pandemic caused by the spread of HIV infection.',
    source: 'UNAIDS / WHO',
    sourceUrl: 'https://www.who.int/campaigns/world-aids-day'
  },
  {
    month: 12,
    day: 4,
    name: 'Indian Navy Day',
    region: 'India',
    location: 'india',
    type: 'National Defense Observance',
    explanation: 'Celebrates the accomplishments and role of the Indian Naval forces, commemorating Operation Trident in 1971.',
    source: 'Indian Navy / Ministry of Defence',
    sourceUrl: 'https://indiannavy.nic.in/'
  },
  {
    month: 12,
    day: 10,
    name: 'Human Rights Day',
    region: 'International',
    location: 'worldwide',
    type: 'UN International Day',
    explanation: 'Commemorates the day the UN General Assembly adopted the Universal Declaration of Human Rights in 1948.',
    source: 'United Nations Human Rights (OHCHR)',
    sourceUrl: 'https://www.un.org/en/observances/human-rights-day'
  },
  {
    month: 12,
    day: 22,
    name: 'National Mathematics Day',
    region: 'India',
    location: 'india',
    type: 'National Observance',
    explanation: 'Celebrated across India on the birth anniversary of mathematical visionary Srinivasa Ramanujan.',
    source: 'Department of Science & Technology, India',
    sourceUrl: 'https://dst.gov.in/'
  },
  {
    month: 12,
    day: 25,
    name: 'Christmas & Good Governance Day (India)',
    region: 'India & International',
    location: 'india',
    type: 'Gazetted Holiday & Observance',
    explanation: 'Celebration of Christmas, also observed in India as Good Governance Day in honor of Atal Bihari Vajpayee.',
    source: 'Government of India Gazette',
    sourceUrl: 'https://dopt.gov.in/'
  },
  // January & Key Tamil Festivals
  {
    month: 1,
    day: 14,
    name: 'Thai Pongal & Makar Sankranti',
    region: 'Tamil Nadu & India',
    location: 'tamilnadu',
    type: 'Major Cultural Harvest Festival',
    explanation: 'The paramount 4-day Tamil harvest festival thanking the Sun God and nature for harvest bounty.',
    source: 'Government of Tamil Nadu Holiday Calendar',
    sourceUrl: 'https://www.tn.gov.in/'
  },
  {
    month: 1,
    day: 15,
    name: 'Mattu Pongal & Thiruvalluvar Day',
    region: 'Tamil Nadu',
    location: 'tamilnadu',
    type: 'Tamil Cultural Celebration',
    explanation: 'Celebrates cattle and agriculture, and honors the venerable Tamil sage poet Thiruvalluvar.',
    source: 'Tamil Nadu Public Holiday List',
    sourceUrl: 'https://www.tn.gov.in/'
  },
  {
    month: 1,
    day: 16,
    name: 'Kaanum Pongal / Uzhavar Thirunal',
    region: 'Tamil Nadu',
    location: 'tamilnadu',
    type: 'Cultural Festival',
    explanation: 'The concluding day of Pongal dedicated to family reunions, community feasts, and honoring farmers.',
    source: 'Tamil Nadu Gazette',
    sourceUrl: 'https://www.tn.gov.in/'
  },
  {
    month: 1,
    day: 26,
    name: 'Republic Day of India',
    region: 'India',
    location: 'india',
    type: 'National Gazetted Holiday',
    explanation: 'Commemorates the date when the Constitution of India came into effect in 1950.',
    source: 'Government of India Official Portal',
    sourceUrl: 'https://www.india.gov.in/'
  },
  {
    month: 4,
    day: 14,
    name: 'Puthandu (Tamil New Year) & Ambedkar Jayanti',
    region: 'Tamil Nadu & India',
    location: 'tamilnadu',
    type: 'State & National Observance',
    explanation: 'First day of the Tamil calendar month Chithirai, alongside Dr. B.R. Ambedkar\'s birth anniversary.',
    source: 'Tamil Nadu Government Calendar',
    sourceUrl: 'https://www.tn.gov.in/'
  },
  {
    month: 8,
    day: 15,
    name: 'Independence Day of India',
    region: 'India',
    location: 'india',
    type: 'National Gazetted Holiday',
    explanation: 'Commemorates the nation\'s independence from colonial rule in 1947.',
    source: 'Government of India',
    sourceUrl: 'https://www.india.gov.in/'
  },
  {
    month: 10,
    day: 2,
    name: 'Gandhi Jayanti & International Day of Non-Violence',
    region: 'India & International',
    location: 'india',
    type: 'National Holiday & UN Observance',
    explanation: 'Celebrates Mahatma Gandhi\'s birth anniversary and promotes non-violence worldwide.',
    source: 'United Nations & Government of India',
    sourceUrl: 'https://www.un.org/en/observances/non-violence-day'
  }
];

/**
 * Returns festivals occurring on the exact calendar date
 */
export function getFestivalsForDate(date = new Date()) {
  const { month, day, isoDate } = getISTDateParts(date);

  const matches = FESTIVALS_DATABASE.filter(f => f.month === month && f.day === day);

  return matches.map((f, idx) => ({
    id: `fest_${month}_${day}_${idx}`,
    title: f.name,
    summary: f.explanation,
    eventDate: isoDate,
    publishedAt: null,
    category: 'Festivals & Special Days',
    location: f.location,
    country: f.region,
    personOrTeam: f.region,
    achievementType: f.type,
    verificationStatus: 'verified',
    sourceType: 'official_calendar',
    sources: [
      {
        publisher: f.source,
        url: f.sourceUrl,
        publishedAt: isoDate,
        title: `${f.name} Official Notice`
      }
    ],
    relatedCount: 1,
    metadata: {
      type: f.type,
      region: f.region
    }
  }));
}

/**
 * Returns upcoming festivals within N days from baseDate
 */
export function getUpcomingFestivals(daysAhead = 7, baseDate = new Date()) {
  const currentParts = getISTDateParts(baseDate);
  const currentYear = currentParts.year;

  const upcoming = [];

  for (const f of FESTIVALS_DATABASE) {
    // Check festival date for this year
    let targetDate = new Date(currentYear, f.month - 1, f.day);
    // If date already passed earlier this year, check next year
    if (targetDate.getTime() < new Date(currentParts.isoDate).getTime()) {
      targetDate = new Date(currentYear + 1, f.month - 1, f.day);
    }

    const baseMidnight = new Date(`${currentParts.isoDate}T00:00:00Z`).getTime();
    const targetParts = getISTDateParts(targetDate);
    const targetMidnight = new Date(`${targetParts.isoDate}T00:00:00Z`).getTime();

    const diffDays = Math.round((targetMidnight - baseMidnight) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= daysAhead) {
      upcoming.push({
        id: `upcoming_fest_${targetParts.isoDate}_${f.name.replace(/\s+/g, '_')}`,
        title: f.name,
        summary: f.explanation,
        eventDate: targetParts.isoDate,
        daysAway: diffDays,
        daysAwayLabel: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`,
        category: 'Festivals & Special Days',
        location: f.location,
        country: f.region,
        achievementType: f.type,
        verificationStatus: 'verified',
        sourceType: 'official_calendar',
        sources: [
          {
            publisher: f.source,
            url: f.sourceUrl,
            title: f.name
          }
        ],
        metadata: {
          region: f.region,
          type: f.type
        }
      });
    }
  }

  upcoming.sort((a, b) => a.daysAway - b.daysAway);
  return upcoming;
}

