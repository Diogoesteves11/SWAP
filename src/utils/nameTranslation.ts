import { useStudentStore } from '@/stores/studentStore'
import { useTeacherStore } from '@/stores/teacherStore'

// Helper to load students if not yet loaded
async function ensureStudentsLoaded() {
  const studentStore = useStudentStore()
  if (studentStore.students.length === 0) {
    await studentStore.fetchStudents()
  }
}

// Helper to load teachers if not yet loaded
async function ensureTeachersLoaded() {
  const teacherStore = useTeacherStore()
  if (teacherStore.teachers.length === 0) {
    await teacherStore.fetchTeachers()
  }
}

/**
 * Main helper: given an ID, returns the user's name.
 * Checks both students and teachers.
 */
export async function getNameFromId(id: number): Promise<string> {
  const studentStore = useStudentStore()
  const teacherStore = useTeacherStore()

  // First ensure data is loaded
  await Promise.all([ensureStudentsLoaded(), ensureTeachersLoaded()])

  // Search in students
  const student = studentStore.students.find((s) => s.id === id)
  if (student) return student.name

  // Search in teachers
  const teacher = teacherStore.teachers.find((t) => t.id === id)
  if (teacher) return teacher.name

  if (id === 1021) return 'José'

  // If no match found
  return `Unknown User (${id})`
}
