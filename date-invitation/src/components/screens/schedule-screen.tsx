"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHaptics } from "@/hooks/use-haptics";
import { TIME_SLOTS, type DatePlan, type TimeSlotId } from "@/lib/constants";
import { nextWeekendDay } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface ScheduleScreenProps {
  onConfirm: (plan: DatePlan) => void;
}

/** Reveal-on-mount wrapper for the progressive sections of the form. */
function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

/** Screen 2 — pick a weekend day, a time slot and (optionally) an activity. */
export function ScheduleScreen({ onConfirm }: ScheduleScreenProps) {
  const { vibrate } = useHaptics();
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<TimeSlotId | null>(null);
  const [activity, setActivity] = useState("");

  const handleConfirm = () => {
    if (!date || !slot) return;
    vibrate([16, 30, 20]);
    onConfirm({ date, slot, activity: activity.trim() || undefined });
  };

  return (
    <Card className="mx-auto w-full max-w-xl px-5 py-10 sm:px-10 sm:py-12">
      <div className="text-center">
        <h1 className="text-balance text-2xl font-bold tracking-tight text-bordeaux sm:text-3xl">
          Choisis un week&#8209;end qui te convient ❤️
        </h1>
        <p className="mt-3 text-bordeaux/60">Tu peux choisir la date que tu préfères.</p>
      </div>

      {/* Calendar — only Saturdays and Sundays are selectable */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="mt-8 rounded-3xl border border-bordeaux/5 bg-white/60 p-4 shadow-inner shadow-bordeaux/5 sm:p-6"
      >
        <DayPicker
          mode="single"
          locale={fr}
          selected={date}
          onSelect={(day) => {
            setDate(day ?? undefined);
            if (day) vibrate(10);
          }}
          disabled={[{ dayOfWeek: [1, 2, 3, 4, 5] }, { before: new Date() }]}
          startMonth={new Date()}
          // Open on the month of the next available weekend, which can be
          // the following month when the current one has no weekend left.
          defaultMonth={nextWeekendDay()}
          fixedWeeks
          classNames={{
            root: "mx-auto w-fit",
            months: "relative",
            month_caption: "flex h-10 items-center justify-center",
            caption_label:
              "text-sm font-bold uppercase tracking-widest text-bordeaux/80",
            nav: "absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between",
            button_previous:
              "flex h-9 w-9 items-center justify-center rounded-full text-bordeaux/70 transition-all duration-200 hover:bg-rose/10 hover:text-bordeaux disabled:opacity-25 disabled:hover:bg-transparent",
            button_next:
              "flex h-9 w-9 items-center justify-center rounded-full text-bordeaux/70 transition-all duration-200 hover:bg-rose/10 hover:text-bordeaux disabled:opacity-25 disabled:hover:bg-transparent",
            chevron: "h-4 w-4 fill-current",
            month_grid: "mt-3 border-separate border-spacing-1",
            weekday:
              "pb-2 text-[11px] font-semibold uppercase tracking-wider text-bordeaux/40",
            day: "p-0 text-center",
            day_button:
              "mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium text-bordeaux/80 transition-all duration-200 hover:scale-105 hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100 disabled:hover:bg-transparent sm:h-11 sm:w-11",
            selected:
              "[&>button]:scale-105 [&>button]:bg-gradient-to-br [&>button]:from-rose [&>button]:to-bordeaux [&>button]:!text-white [&>button]:shadow-lg [&>button]:shadow-rose/40",
            today: "[&>button]:font-bold",
            outside: "opacity-0",
          }}
        />
        <p className="mt-3 text-center text-xs font-medium text-bordeaux/40">
          Seuls les samedis et dimanches sont ouverts 💫
        </p>
      </motion.div>

      {/* Time slot — appears once a date is picked */}
      <AnimatePresence>
        {date && (
          <Reveal key="slots">
            <div className="pt-8">
              <p className="text-center text-sm font-semibold uppercase tracking-widest text-bordeaux/50">
                {format(date, "EEEE d MMMM", { locale: fr })}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((timeSlot) => (
                  <motion.button
                    key={timeSlot.id}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setSlot(timeSlot.id);
                      vibrate(10);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3.5",
                      "text-sm font-semibold transition-all duration-300",
                      slot === timeSlot.id
                        ? "scale-[1.03] border-transparent bg-gradient-to-br from-rose to-bordeaux text-white shadow-lg shadow-rose/30"
                        : "border-bordeaux/10 bg-white/70 text-bordeaux/70 hover:bg-white hover:shadow-md hover:shadow-bordeaux/10"
                    )}
                  >
                    <span className="text-xl">{timeSlot.emoji}</span>
                    {timeSlot.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </AnimatePresence>

      {/* Optional activity + confirm — appears once a slot is picked */}
      <AnimatePresence>
        {date && slot && (
          <Reveal key="activity">
            <div className="flex flex-col gap-5 pt-7">
              <Input
                value={activity}
                onChange={(event) => setActivity(event.target.value)}
                placeholder="Qu’aimerais-tu faire ? (restaurant, cinéma, balade, surprise…)"
                maxLength={120}
                aria-label="Activité souhaitée (facultatif)"
              />
              <motion.button
                type="button"
                onClick={handleConfirm}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="mx-auto inline-flex h-13 items-center justify-center gap-2 rounded-full
                  bg-gradient-to-br from-rose to-bordeaux px-10 py-3.5 text-base font-semibold
                  text-white shadow-lg shadow-rose/30 transition-shadow duration-300
                  hover:shadow-xl hover:shadow-rose/45"
              >
                ❤️ Confirmer
              </motion.button>
            </div>
          </Reveal>
        )}
      </AnimatePresence>
    </Card>
  );
}
