/** Saturday (6) and Sunday (0) — the only selectable days. */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * First weekend day on or after `from`. Used to open the calendar on a
 * month that actually contains a selectable day (e.g. on a Monday at the
 * end of the month, the next weekend may be in the following month).
 */
export function nextWeekendDay(from: Date = new Date()): Date {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  while (!isWeekend(date)) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}
