import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { ScheduleEvent, ShiftDetail } from '@/types/ScheduleTypes'
import { parseTime } from '@/utils/time'

interface RawShift {
  id: number
  courseId: number
  classroomId: number
  teacherId: number
  day: string
  from: number
  to: number
  name: string
  totalStudentsRegistered: number
}
interface Course {
  id: number
  abbreviation: string
  semester: number
}

export const useScheduleStore = defineStore('schedule', () => {
  // raw cache
  const events = ref<ScheduleEvent[]>([])
  const isLoaded = ref(false)

  const filters = reactive({
    courseSem: null as number | null,
    courseId: null as number | null,
  })

  const filteredEvents = computed(() => {
    if (filters.courseSem == null && filters.courseId == null) {
      return [] as ScheduleEvent[]
    }

    return events.value.filter((e) => {
      if (filters.courseSem && e.courseSemester !== filters.courseSem) return false
      if (filters.courseId && e.courseId !== filters.courseId) return false
      return true
    })
  })
  async function fetchEvents() {
    // 0) only fetch once
    if (isLoaded.value) return

    // 1) fetch everything in parallel
    const [shRes, coRes] = await Promise.all([
      fetch('http://localhost:3000/shifts'),
      fetch('http://localhost:3000/courses'),
    ])
    if (!shRes.ok || !coRes.ok) throw new Error('Network error')

    const shifts: RawShift[] = await shRes.json()
    const courses: Course[] = await coRes.json()

    // 2) make lookups
    const courseMap = new Map(
      courses.map((c) => [Number(c.id), { abbr: c.abbreviation, sem: c.semester }]),
    )

    // 3) group shifts by course/day/from/to
    const grouped = new Map<string, ScheduleEvent>()

    shifts.forEach((s) => {
      const key = `${s.courseId}|${s.day}|${s.from}|${s.to}`
      const { abbr, sem } = courseMap.get(s.courseId) ?? { abbr: '—', sem: 0 }

      const detail: ShiftDetail = {
        shiftId: s.id,
        classroomId: s.classroomId,
        teacherId: s.teacherId,
        name: s.name,
        numStudents: s.totalStudentsRegistered,
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          courseId: s.courseId,
          courseAbbreviation: abbr,
          courseSemester: sem,
          day: s.day,
          from: parseTime(`${s.from}:00`),
          to: parseTime(`${s.to}:00`),
          shifts: [detail],
        })
      } else {
        grouped.get(key)!.shifts.push(detail)
      }
    })

    events.value = Array.from(grouped.values())
    isLoaded.value = true
  }

  function setFilter(key: keyof typeof filters, value: (typeof filters)[typeof key]) {
    filters[key] = value
  }
  function resetFilters() {
    const keys = Object.keys(filters) as Array<keyof typeof filters>
    keys.forEach((key) => {
      filters[key] = null
    })
  }
  return {
    // state
    events,
    filters,

    // getters
    filteredEvents,

    // actions
    fetchEvents,
    setFilter,
    resetFilters,
  }
})
