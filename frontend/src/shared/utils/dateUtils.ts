export function parseDate(input?: string | number | null): Date | null {
  if (input == null) return null;
  if (typeof input === "number") {
    const ms = input < 1e12 ? input * 1000 : input;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

export function timeAgo(date: Date | null): string {
  if (!date) return "unknown";
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec} second${sec !== 1 ? "s" : ""} ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min !== 1 ? "s" : ""} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr !== 1 ? "s" : ""} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day !== 1 ? "s" : ""} ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} month${month !== 1 ? "s" : ""} ago`;
  const year = Math.floor(day / 365);
  return `${year} year${year !== 1 ? "s" : ""} ago`;
}

export const parseRRuleSummary = (rrule: string): { type: 'one-time' | 'recurring'; summary: string; details: string } => {
    if (!rrule) return { type: 'recurring', summary: 'Unknown schedule', details: '' };

    if (rrule.startsWith('DTSTART:')) {
        const dateStr = rrule.replace('DTSTART:', '');
        if (dateStr.length === 8) {
            const year = dateStr.slice(0, 4);
            const month = dateStr.slice(4, 6);
            const day = dateStr.slice(6, 8);
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return {
                type: 'one-time',
                summary: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                details: year
            };
        }
        return { type: 'one-time', summary: dateStr, details: '' };
    }

    const parts: string[] = [];
    const byDayMatch = rrule.match(/BYDAY=([A-Z,]+)/);
    let daysStr = 'Every week';
    if (byDayMatch) {
        const dayMap: Record<string, string> = {
            'MO': 'Mon', 'TU': 'Tue', 'WE': 'Wed', 'TH': 'Thu',
            'FR': 'Fri', 'SA': 'Sat', 'SU': 'Sun'
        };
        const days = byDayMatch[1].split(',').map(d => dayMap[d] || d);
        daysStr = days.join(', ');
    }
    parts.push(daysStr);

    let details = '';
    const untilMatch = rrule.match(/UNTIL=(\d{8})/);
    if (untilMatch) {
        const dateStr = untilMatch[1];
        const year = dateStr.slice(0, 4);
        const month = dateStr.slice(4, 6);
        const day = dateStr.slice(6, 8);
        details = `Until ${month}/${day}/${year}`;
    }

    const countMatch = rrule.match(/COUNT=(\d+)/);
    if (countMatch) {
        details = `For ${countMatch[1]} weeks`;
    }

    if (!details) {
        details = 'Repeats indefinitely';
    }

    return { type: 'recurring', summary: parts.join(' '), details };
};

/**
 * Formats an exdate string (YYYYMMDD) into a human-readable format (MM/DD).
 */
export const formatExdate = (exdate: string): string => {
    if (exdate.length === 8) {
        const month = exdate.slice(4, 6);
        const day = exdate.slice(6, 8);
        return `${month}/${day}`;
    }
    return exdate;
};
