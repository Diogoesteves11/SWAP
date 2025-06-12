import { useScheduleStore } from '@/stores/scheduleStore'

/**
 * Look up the name of a shift by its numeric ID.
 *
 * This function searches through all loaded ScheduleEvent entries
 * in the scheduleStore for a ShiftDetail whose `shiftId` matches.
 * Returns the `name` (e.g. "T1", "PL3") or `null` if not found.
 */
export function getShiftNameById(shiftId: number): string | null {
  const scheduleStore = useScheduleStore()
  // Make sure events are loaded (you may need to await fetchEvents() elsewhere)
  for (const evt of scheduleStore.events) {
    const detail = evt.shifts.find((s) => s.shiftId === shiftId)
    if (detail) {
      return detail.name
    }
  }
  return null
}

/**
 * Reverse lookup: given a courseId and a shift name, return its shiftId.
 *
 * Returns the numeric `shiftId`, or `null` if not found.
 */
export function getShiftIdByName(courseId: number, shiftName: string): number | null {
  const scheduleStore = useScheduleStore()
  // Find the event for that course
  const evt = scheduleStore.events.find((e) => e.courseId === courseId)
  if (!evt) return null
  const detail = evt.shifts.find((s) => s.name === shiftName)
  return detail ? detail.shiftId : null
}
