import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Teacher } from '@/types/Teacher'

export const useTeacherStore = defineStore('teacher', () => {
  // State: list of teachers and a load flag for caching
  const teachers = ref<Teacher[]>([])
  const isLoaded = ref(false)

  async function fetchTeachers() {
    if (isLoaded.value) return
    try {
      const res = await fetch('http://localhost:3000/teachers')
      if (!res.ok) throw new Error(`Error fetching teachers: ${res.status}`)
      const data: Teacher[] = await res.json()
      teachers.value = data
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
    }
  }

  const getTeacherById = (id: number) => {
    return teachers.value.find((t) => Number(t.id) === id)
  }

  return {
    // state
    teachers,
    // getters
    getTeacherById,
    // actions
    fetchTeachers,
  }
})
