/**
 * Sports & Records Service
 * Extracts and filters high-impact records, sporting milestones, and breakthrough achievements
 * from news feeds, historical archives, and official sporting records.
 */

import { fetchTrendingNews } from './newsService.js';
import { fetchOnThisDayHistory } from './historyService.js';

/**
 * Discovers and filters records and notable achievements
 * @param {Array<Object>} [existingEvents=null] Optional pre-fetched events to avoid duplicate network calls
 */
export async function fetchRecordsAndAchievements(existingEvents = null) {
  let pool = existingEvents;

  if (!pool || pool.length === 0) {
    const [news, history] = await Promise.all([
      fetchTrendingNews(),
      fetchOnThisDayHistory()
    ]);
    pool = [...news, ...history];
  }

  // Filter items that qualify as records or major achievements
  const records = pool.filter(item => {
    if (item.achievementType) return true;

    const text = (item.title + ' ' + (item.summary || '')).toLowerCase();
    const isRecordOrMilestone = /\b(record|guinness|century|hat-trick|olympic medal|world title|championship|breakthrough|milestone|historic win|first time|fastest|highest ever|won gold)\b/.test(text);

    return isRecordOrMilestone;
  });

  // Enhance record metadata
  return records.map(r => {
    let subCategory = 'General Milestone';
    const combined = (r.title + ' ' + (r.summary || '')).toLowerCase();

    if (/\b(cricket|kohli|dhoni|rohit|ipl|icc|bcci|test|t20|odi)\b/.test(combined)) {
      subCategory = 'Cricket Record';
    } else if (/\b(olympic|medal|athletics|javelin|chopra|track)\b/.test(combined)) {
      subCategory = 'Olympic Achievement';
    } else if (/\b(football|fifa|messi|ronaldo|goal)\b/.test(combined)) {
      subCategory = 'Football Record';
    } else if (/\b(isro|nasa|space|satellite|moon|chandrayaan|mars)\b/.test(combined)) {
      subCategory = 'Space Achievement';
    } else if (/\b(science|nobel|discovery|medicine|physics)\b/.test(combined)) {
      subCategory = 'Scientific Breakthrough';
    } else if (/\b(tech|ai|quantum|computing|chip)\b/.test(combined)) {
      subCategory = 'Technology Milestone';
    }

    return {
      ...r,
      achievementSubCategory: subCategory
    };
  });
}

