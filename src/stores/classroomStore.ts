import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Classroom {
  id: number
  name: string
  capacity: number
  buildingId: string
}

export const useClassroomStore = defineStore('classroom', () => {
  // state
  const classrooms = ref<Classroom[]>([])
  const isLoaded = ref(false)

  /** Fetch all classrooms (only once) */
  async function fetchClassrooms() {
    if (isLoaded.value) return
    try {
      const res = await fetch('http://localhost:3000/classrooms')
      if (!res.ok) throw new Error(`Classrooms fetch failed: ${res.status}`)
      classrooms.value = await res.json()
      isLoaded.value = true
    } catch (err) {
      console.error('Error loading classrooms:', err)
      classrooms.value = []
      isLoaded.value = false
    }
  }

  /** Find one by its numeric ID */
  function getClassroomById(id: number): Classroom | undefined {
    return classrooms.value.find((c) => c.id === id)
  }

  /** Optionally clear (e.g. on logout) */
  function clearClassrooms() {
    classrooms.value = []
    isLoaded.value = false
  }

  return {
    // state
    classrooms,
    isLoaded,
    // actions
    fetchClassrooms,
    clearClassrooms,
    // getters
    getClassroomById,
  }
})
