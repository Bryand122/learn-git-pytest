/** The three time slots offered on the scheduling screen. */
export const TIME_SLOTS = [
  { id: "morning", label: "Matin", emoji: "🌞", startHour: 10, endHour: 12 },
  { id: "afternoon", label: "Après-midi", emoji: "☀️", startHour: 14, endHour: 17 },
  { id: "evening", label: "Soir", emoji: "🌙", startHour: 19, endHour: 22 },
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];
export type TimeSlotId = TimeSlot["id"];

/** Everything the invitee picked on screen 2. */
export interface DatePlan {
  date: Date;
  slot: TimeSlotId;
  activity?: string;
}

export function getTimeSlot(id: TimeSlotId): TimeSlot {
  // The id always comes from TIME_SLOTS, so the lookup cannot fail.
  return TIME_SLOTS.find((slot) => slot.id === id) as TimeSlot;
}
