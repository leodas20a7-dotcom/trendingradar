/**
 * Sports & Records Service
 * Extracts and filters high-impact records, sporting milestones, and breakthrough achievements
 */

import { fetchTrendingNews } from './newsService.js';
import { fetchOnThisDayHistory } from './historyService.js';

const ICONIC_RECORDS_ARCHIVE = [
  {
    id: 'rec_virat_50th_century',
    title: 'Virat Kohli Breaks Sachin Tendulkar\'s All-Time Record for Most ODI Centuries (50)',
    summary: 'Virat Kohli scored his 50th One Day International century against New Zealand at Wankhede Stadium in the ICC Cricket World Cup semi-final, surpassing Sachin Tendulkar\'s record of 49 centuries.',
    personOrTeam: 'Virat Kohli',
    country: 'India',
    location: 'india',
    category: 'Records',
    achievementSubCategory: 'Cricket Record',
    achievementType: 'Confirmed World Record',
    verificationStatus: 'verified',
    eventDate: '2023-11-15',
    sources: [{ publisher: 'ICC & BCCI Official Record', url: 'https://www.icc-cricket.com/', title: 'Kohli 50th ODI Century Record' }]
  },
  {
    id: 'rec_neeraj_chopra_olympic_gold',
    title: 'Neeraj Chopra Wins Historic Olympic Gold Medal in Javelin Throw (87.58m)',
    summary: 'Neeraj Chopra became the first track and field athlete from independent India to win an Olympic gold medal with a throw of 87.58 meters at the Tokyo 2020 Games.',
    personOrTeam: 'Neeraj Chopra',
    country: 'India',
    location: 'india',
    category: 'Records',
    achievementSubCategory: 'Olympic Achievement',
    achievementType: 'Confirmed Olympic Record',
    verificationStatus: 'verified',
    eventDate: '2021-08-07',
    sources: [{ publisher: 'International Olympic Committee (IOC)', url: 'https://olympics.com/', title: 'Neeraj Chopra Olympic Gold' }]
  },
  {
    id: 'rec_isro_chandrayaan3_south_pole',
    title: 'ISRO Becomes First Nation to Land Spacecraft Near Moon\'s South Pole',
    summary: 'India\'s Chandrayaan-3 Vikram lander successfully executed a soft landing near the lunar south pole, making India the fourth country to achieve a soft moon landing and the first near the south pole.',
    personOrTeam: 'ISRO Chandrayaan-3 Team',
    country: 'India',
    location: 'india',
    category: 'Records',
    achievementSubCategory: 'Space Achievement',
    achievementType: 'Historic Space Milestone',
    verificationStatus: 'verified',
    eventDate: '2023-08-23',
    sources: [{ publisher: 'ISRO Official Announcement', url: 'https://www.isro.gov.in/', title: 'Chandrayaan-3 Soft Landing' }]
  },
  {
    id: 'rec_rohit_sharma_264',
    title: 'Rohit Sharma Sets Highest Individual Score in ODI Cricket History (264)',
    summary: 'Rohit Sharma smashed 264 runs off 173 balls against Sri Lanka at Eden Gardens, setting the all-time world record for the highest individual score in One Day International cricket.',
    personOrTeam: 'Rohit Sharma',
    country: 'India',
    location: 'india',
    category: 'Records',
    achievementSubCategory: 'Cricket Record',
    achievementType: 'Confirmed World Record',
    verificationStatus: 'verified',
    eventDate: '2014-11-13',
    sources: [{ publisher: 'ESPNcricinfo & ICC Records', url: 'https://www.espncricinfo.com/', title: 'Rohit Sharma 264 Record' }]
  },
  {
    id: 'rec_usain_bolt_958',
    title: 'Usain Bolt Sets 100m Sprint World Record at 9.58 Seconds',
    summary: 'Usain Bolt shattered the 100m world record running 9.58 seconds at the World Athletics Championships in Berlin, reaching a peak speed of 44.72 km/h.',
    personOrTeam: 'Usain Bolt',
    country: 'Jamaica / Global',
    location: 'worldwide',
    category: 'Records',
    achievementSubCategory: 'Olympic Achievement',
    achievementType: 'Confirmed World Record',
    verificationStatus: 'verified',
    eventDate: '2009-08-16',
    sources: [{ publisher: 'World Athletics & Guinness Records', url: 'https://worldathletics.org/', title: 'Usain Bolt 9.58s Record' }]
  }
];

export async function fetchRecordsAndAchievements(existingEvents = null) {
  let pool = existingEvents || [];

  if (!pool || pool.length === 0) {
    try {
      const [news, history] = await Promise.all([
        fetchTrendingNews().catch(() => []),
        fetchOnThisDayHistory().catch(() => [])
      ]);
      pool = [...news, ...history];
    } catch {
      pool = [];
    }
  }

  const liveRecords = pool.filter(item => {
    if (item.achievementType) return true;
    const text = (item.title + ' ' + (item.summary || '')).toLowerCase();
    return /\b(record|guinness|century|hat-trick|olympic|world title|championship|breakthrough|milestone|fastest|highest ever)\b/.test(text);
  });

  return [...liveRecords, ...ICONIC_RECORDS_ARCHIVE];
}
