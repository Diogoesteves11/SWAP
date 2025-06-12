import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStudentStore } from '@/stores/studentStore'
import { type AllocationDetail } from '@/types/AllocationDetail'

interface RawAllocation {
  id: number
  shiftId: number
  studentId: number
}

interface RawShift {
  id: number
  courseId: number
  // other shift fields omitted
}

export const useAllocationStore = defineStore('allocation', () => {
  // State: fetched allocations and cache flags
  const allocations = ref<AllocationDetail[]>([])
  const isLoaded = ref(false)
  const currentStudentId = ref<number | null>(null)

  /**
   * Fetch allocations for a student, initialize base entries for enrolled courses
   */
  async function fetchAllocations(studentId: number) {
    if (isLoaded.value && currentStudentId.value === studentId) return

    allocations.value = []
    currentStudentId.value = null
    isLoaded.value = false

    try {
      const studentStore = useStudentStore()
      const student = studentStore.getStudentById(studentId)
      if (!student) throw new Error(`Student ${studentId} not found`)

      // Fetch existing allocations from server
      const allocRes = await fetch(`http://localhost:3000/allocations?studentId=${studentId}`)
      if (!allocRes.ok) throw new Error(`Allocations fetch failed: ${allocRes.status}`)
      const rawAllocs: RawAllocation[] = await allocRes.json()

      // Fetch shifts for those allocations
      const shiftIds = rawAllocs.map((a) => Number(a.shiftId))
      const shiftQuery = shiftIds.map((id) => `id=${id}`).join('&')
      const shiftRes = await fetch(`http://localhost:3000/shifts?${shiftQuery}`)
      if (!shiftRes.ok) throw new Error(`Shifts fetch failed: ${shiftRes.status}`)
      const rawShifts: RawShift[] = await shiftRes.json()

      // Build detailed allocations (with actual shift info)
      const realAllocations: AllocationDetail[] = rawAllocs.map((a) => {
        const shift = rawShifts.find((s) => Number(s.id) === Number(a.shiftId))
        return {
          courseId: Number(shift?.courseId) ?? 0,
          shiftId: Number(a.shiftId),
          changedFrom: false,
          changedTo: false,
        }
      })

      // Determine which enrolled courses have no allocations yet
      const allocatedCourseIds = new Set(realAllocations.map((a) => Number(a.courseId)))
      const missingCourses = student.enrolled.filter(
        (courseId) => !allocatedCourseIds.has(courseId),
      )

      // Create base allocations for courses with no shifts assigned
      const baseAllocs: AllocationDetail[] = missingCourses.map((courseId) => ({
        courseId,
        shiftId: null,
        changedFrom: false,
        changedTo: false,
      }))

      // Final allocation list
      allocations.value = [...realAllocations, ...baseAllocs]
      currentStudentId.value = studentId
      isLoaded.value = true
    } catch (error) {
      console.error('Error loading allocations:', error)
      allocations.value = []
      currentStudentId.value = null
      isLoaded.value = false
    }
  }

  /**
   * Insert or update one allocation detail.
   * If shiftId matches an existing entry → update its flags.
   * Else if there's a base entry for the same course (shiftId===null) → replace it.
   * Otherwise push as new.
   */
  function upsertAllocation(allocation: AllocationDetail) {
    const { courseId, shiftId, changedFrom, changedTo } = allocation

    // exact shift match?
    const byShift = allocations.value.find((a) => Number(a.shiftId) === shiftId)
    if (byShift) {
      byShift.changedFrom = changedFrom
      byShift.changedTo = changedTo
      return
    }

    // replace base null‐shift entry for this course?
    const baseIndex = allocations.value.findIndex(
      (a) => Number(a.courseId) === courseId && Number(a.shiftId) === null,
    )
    if (baseIndex !== -1) {
      allocations.value[baseIndex] = { courseId, shiftId, changedFrom, changedTo }
      return
    }

    // otherwise add anew
    allocations.value.push({ courseId, shiftId, changedFrom, changedTo })
  }

  /**
   * Persist any changes to the backend:
   * - DELETE any allocation flagged changedFrom
   * - POST any allocation flagged changedTo
   * Then clear all flags.
   */
  async function syncAllocations() {
    if (currentStudentId.value == null) {
      throw new Error('No student selected for allocations')
    }
    const sid = currentStudentId.value
    console.log(allocations.value)
    // Process deletions first
    for (const alloc of allocations.value) {
      if (alloc.changedFrom && alloc.shiftId != null) {
        // find the server record
        const res = await fetch(
          `http://localhost:3000/allocations?studentId=${sid}&shiftId=${alloc.shiftId}`,
        )
        if (!res.ok) {
          console.warn('Failed to lookup alloc for delete', alloc)
        } else {
          const raws: RawAllocation[] = await res.json()
          if (raws.length) {
            // delete the first matching record
            await fetch(`http://localhost:3000/allocations/${raws[0].id}`, { method: 'DELETE' })
          }
        }
        // clear the flag
        alloc.changedFrom = false
      }
    }

    // Process additions
    for (const alloc of allocations.value) {
      if (alloc.changedTo && alloc.shiftId != null) {
        // create a new server record
        await fetch(`http://localhost:3000/allocations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: sid,
            shiftId: alloc.shiftId,
          }),
        })
        // clear the flag
        alloc.changedTo = false
      }
    }
  }

  /**
   * Clear cached allocations
   */
  function clearAllocations() {
    allocations.value = []
    currentStudentId.value = null
    isLoaded.value = false
  }

  return {
    // state
    allocations,
    currentStudentId,
    isLoaded,
    // actions
    fetchAllocations,
    upsertAllocation,
    syncAllocations,
    clearAllocations,
  }
})
