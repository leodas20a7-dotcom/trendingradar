/**
 * Date and Time Utilities for ConvenioMart TrendRadar
 * All calendar operations are strictly anchored to Asia/Kolkata (IST, UTC+5:30)
 * to avoid UTC-rollover date discrepancies.
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Parses any date input safely into a standard JavaScript Date object.
 * Returns null if invalid.
 */
export function parseDateSafe(input) {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Returns the current date parts in Asia/Kolkata timezone.
 * @param {Date|string|number} [date=new Date()]
 * @returns {Object} Object with year, month (1-12), day (1-31), weekday, formatted strings
 */
export function getISTDateParts(date = new Date()) {
  const safeDate = parseDateSafe(date) || new Date();

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    weekday: 'long'
  });

  const parts = formatter.formatToParts(safeDate);
  const map = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }

  const year = parseInt(map.year, 10);
  const month = parseInt(map.month, 10);
  const day = parseInt(map.day, 10);
  const weekday = map.weekday;
  const hour = map.hour;
  const minute = map.minute;
  const second = map.second;
  const dayPeriod = map.dayPeriod ? map.dayPeriod.toUpperCase() : '';

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const isoDate = `${year}-${mm}-${dd}`;

  const monthName = safeDate.toLocaleString('en-IN', { timeZone: IST_TIMEZONE, month: 'long' });
  const shortMonthName = safeDate.toLocaleString('en-IN', { timeZone: IST_TIMEZONE, month: 'short' });

  return {
    year,
    month,
    day,
    weekday,
    monthName,
    shortMonthName,
    isoDate, // YYYY-MM-DD in IST
    formattedDate: `${weekday}, ${day} ${monthName} ${year}`,
    formattedShortDate: `${day} ${shortMonthName} ${year}`,
    formattedTime: `${hour}:${minute}:${second} ${dayPeriod} IST`,
    timeString: `${hour}:${minute} ${dayPeriod}`
  };
}

/**
 * Returns two-digit MM and DD for Wikipedia OnThisDay API based on IST.
 */
export function getWikipediaDateParams(date = new Date()) {
  const { month, day } = getISTDateParts(date);
  return {
    mm: String(month).padStart(2, '0'),
    dd: String(day).padStart(2, '0'),
    month,
    day
  };
}

/**
 * Compares two dates to check if they occur on the same calendar day in IST.
 */
export function isSameDayIST(d1, d2) {
  const p1 = getISTDateParts(d1);
  const p2 = getISTDateParts(d2);
  return p1.isoDate === p2.isoDate;
}

/**
 * Returns an ISO date string (YYYY-MM-DD) offset by a given number of days from baseDate in IST.
 */
export function getOffsetDateIST(offsetDays, baseDate = new Date()) {
  const safeDate = parseDateSafe(baseDate) || new Date();
  const target = new Date(safeDate.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return getISTDateParts(target);
}

/**
 * Returns whether a date falls within the next N days from today in IST.
 */
export function isWithinUpcomingDaysIST(targetDate, daysAhead = 7, baseDate = new Date()) {
  const target = parseDateSafe(targetDate);
  if (!target) return false;

  const baseParts = getISTDateParts(baseDate);
  const targetParts = getISTDateParts(target);

  // Compare using midnight-based UTC timestamps of the ISO strings
  const baseMidnight = new Date(`${baseParts.isoDate}T00:00:00Z`).getTime();
  const targetMidnight = new Date(`${targetParts.isoDate}T00:00:00Z`).getTime();

  const diffDays = Math.round((targetMidnight - baseMidnight) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysAhead;
}

/**
 * Formats relative time (e.g. "12m ago", "2h ago", "Yesterday", "3 days ago")
 */
export function formatRelativeTime(dateInput) {
  const date = parseDateSafe(dateInput);
  if (!date) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  const parts = getISTDateParts(date);
  return parts.formattedShortDate;
}

