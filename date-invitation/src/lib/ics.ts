import { getTimeSlot, type DatePlan } from "./constants";

const pad = (value: number) => String(value).padStart(2, "0");

/** Format a date as a floating local ICS timestamp (YYYYMMDDTHHMMSS). */
function formatLocal(date: Date, hour: number): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(hour)}0000`
  );
}

/** Format a date as a UTC ICS timestamp, used for DTSTAMP. */
function formatUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

/** Escape reserved characters as required by RFC 5545. */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Build the ICS file content for the chosen date, slot and activity. */
export function buildIcs(plan: DatePlan): string {
  const slot = getTimeSlot(plan.slot);
  const description = [
    `Créneau : ${slot.emoji} ${slot.label}`,
    plan.activity?.trim() ? `Programme : ${plan.activity.trim()}` : null,
    "Rendez-vous accepté avec amour ❤️",
  ]
    .filter(Boolean)
    .join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Notre Date//Invitation//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-notre-date@invitation.love`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatLocal(plan.date, slot.startHour)}`,
    `DTEND:${formatLocal(plan.date, slot.endHour)}`,
    `SUMMARY:${escapeText("Notre date ❤️")}`,
    `DESCRIPTION:${escapeText(description)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // RFC 5545 requires CRLF line endings.
  return lines.join("\r\n");
}

/** Trigger a browser download of the ICS file. */
export function downloadIcs(plan: DatePlan): void {
  const blob = new Blob([buildIcs(plan)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "notre-date.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
