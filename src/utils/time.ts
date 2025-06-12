import type { Time } from '@/types/Time'

/**
 * Parses a string in the format "HH:mm" into a Time object.
 * @param timeString - A string representing time (e.g., "08:30")
 * @returns A Time object.
 */
export function parseTime(timeString: string): Time {
  const [hours, minutes] = timeString.split(':').map(Number)
  return { hours, minutes }
}

/**
 * Formats a Time object into a string "HH:mm".
 * @param time - The Time object.
 * @returns A formatted time string.
 */
export function formatTime(time: Time): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(time.hours)}:${pad(time.minutes)}`
}

/**
 * Checks if time t1 is before time t2.
 * @param t1 - The first Time object.
 * @param t2 - The second Time object.
 * @returns True if t1 is before t2, false otherwise.
 */
export function isBefore(t1: Time, t2: Time): boolean {
  if (t1.hours < t2.hours) return true
  if (t1.hours === t2.hours && t1.minutes < t2.minutes) return true
  return false
}

/**
 * Checks if time t1 is after time t2.
 * @param t1 - The first Time object.
 * @param t2 - The second Time object.
 * @returns True if t1 is after t2, false otherwise.
 */
export function isAfter(t1: Time, t2: Time): boolean {
  if (t1.hours > t2.hours) return true
  if (t1.hours === t2.hours && t1.minutes > t2.minutes) return true
  return false
}

/**
 * Returns the difference in minutes between two times.
 * @param t1 - The first Time object.
 * @param t2 - The second Time object.
 * @returns The difference in minutes (t2 - t1).
 */
export function differenceInMinutes(t1: Time, t2: Time): number {
  const minutes1 = t1.hours * 60 + t1.minutes
  const minutes2 = t2.hours * 60 + t2.minutes
  return minutes2 - minutes1
}
