import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Student } from '@/types/Student'

export const useStudentStore = defineStore('student', () => {
  // State: list of students and a load flag for caching
  const students = ref<Student[]>([])
  const isLoaded = ref(false)

  async function fetchStudents() {
    if (isLoaded.value) return
    try {
      const res = await fetch('http://localhost:3000/students')
      if (!res.ok) throw new Error(`Error fetching students: ${res.status}`)
      const data: Student[] = await res.json()
      students.value = data
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  function getStudentById(id: number) {
    return students.value.find((s) => Number(s.id) === id)
  }

  return {
    // state
    students,
    // getters
    getStudentById,
    // actions
    fetchStudents,
  }
})
