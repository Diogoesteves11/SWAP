import type { Time } from '@/types/Time'

export interface ShiftDetail {
  shiftId: number // the original shift.id
  classroomId: number
  teacherId: number
  name: string // e.g. "T1"
  numStudents: number // totalStudentsRegistered
}

export interface ScheduleEvent {
  courseId: number
  courseAbbreviation: string
  courseSemester: number

  day: string // e.g. "Seg"
  from: Time
  to: Time

  shifts: ShiftDetail[]
}

export interface EventLayout {
  event: ScheduleEvent
  top: number // in percentage
  height: number // in percentage
  left: number // in percentage (for overlaps)
  width: number // in percentage (for overlaps)
  originalIndex: number // added for stable ordering
}

export interface ScheduleFilters {
  courseId: number | null
  courseSem: number | null
}
