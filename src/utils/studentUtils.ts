import { type Course } from '@/types/Course'
import { useStudentStore } from '@/stores/studentStore'

/**
 * Given a list of course IDs that a student is enrolled in,
 * and the master list of courses, return the student's current semester,
 * defined as the maximum semester of all their enrolled courses.
 * If none match, returns 0.
 */
export function calculateStudentSemester(enrolledCourseIds: number[], courses: Course[]): number {
  let maxSem = 0
  const lookup = new Map(courses.map((c) => [c.id, c.semester]))
  for (const courseId of enrolledCourseIds) {
    const sem = lookup.get(courseId)
    if (sem != null && sem > maxSem) {
      maxSem = sem
    }
  }
  return maxSem
}

/**
 * Returns true if `userId` matches the `id` of one of the students in your studentStore.
 * @param userId the ID to check
 */
export function isStudentId(userId: number): boolean {
  const studentStore = useStudentStore()
  return studentStore.getStudentById(userId) != null
}
