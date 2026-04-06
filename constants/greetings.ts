import { format, getDay, getHours, isWeekend } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GreetingPeriod = "morning" | "afternoon" | "evening" | "night";

export interface GreetingOptions {
  /** User's first name or full name */
  name?: string;
  /** Provide a custom date (defaults to now) */
  date?: Date;
  /** Include a time-aware emoji */
  withEmoji?: boolean;
  /** Append the current day/date context e.g. "Happy Monday!" */
  withDayContext?: boolean;
}

export interface GreetingResult {
  /** Full greeting string e.g. "Good morning, Ada 🌤️" */
  message: string;
  /** The resolved time period */
  period: GreetingPeriod;
  /** Formatted time string e.g. "7:42 AM" */
  time: string;
  /** Formatted date string e.g. "Thursday, March 26" */
  date: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_EMOJIS: Record<GreetingPeriod, string> = {
  morning: "🌤️",
  afternoon: "☀️",
  evening: "🌇",
  night: "🌙",
};

const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives the greeting period from the hour of the day.
 *
 *  0 – 4   → night
 *  5 – 11  → morning
 * 12 – 16  → afternoon
 * 17 – 20  → evening
 * 21 – 23  → night
 */
export function getPeriod(date: Date): GreetingPeriod {
  const hour = getHours(date);
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Returns a short contextual note based on the day of the week.
 * e.g. "Happy Monday!", "Happy Friday! 🎉", "Hope you're enjoying the weekend!"
 */
export function getDayContext(date: Date): string {
  const day = getDay(date); // 0 = Sunday, 6 = Saturday

  if (isWeekend(date)) {
    return day === 6
      ? "Hope you're having a great Saturday!"
      : "Enjoy the rest of your Sunday!";
  }

  if (day === 1) return "Happy Monday! Let's have a great week.";
  if (day === 5) return "Happy Friday! 🎉 Almost the weekend.";

  return `Happy ${DAY_LABELS[day]}!`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Generates a time-aware greeting.
 *
 * @example
 * getGreeting({ name: "Ada", withEmoji: true })
 * // { message: "Good morning, Ada 🌤️", period: "morning", time: "9:04 AM", date: "Thursday, March 26" }
 */
export function getGreeting(options: GreetingOptions = {}): GreetingResult {
  const {
    name,
    date = new Date(),
    withEmoji = true,
    withDayContext = false,
  } = options;

  const period = getPeriod(date);
  const emoji = withEmoji ? ` ${PERIOD_EMOJIS[period]}` : "";
  const nameSegment = name ? `, ${name}` : "";

  const base = `Good ${period}${nameSegment}${emoji}`;
  const dayContext = withDayContext ? ` ${getDayContext(date)}` : "";

  return {
    message: `${base}${dayContext}`,
    period,
    time: format(date, "h:mm a"), // e.g. "9:04 AM"
    date: format(date, "EEEE, MMMM d"), // e.g. "Thursday, March 26"
  };
}
