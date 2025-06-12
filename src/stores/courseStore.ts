import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course } from '@/types/Course'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([])
  const isLoaded = ref(false)

  const fetchCourses = async () => {
    if (isLoaded.value) return

    const res = await fetch('http://localhost:3000/courses')
    if (!res.ok) throw new Error('Failed to fetch courses')

    const data = await res.json()
    courses.value = data
    isLoaded.value = true
  }

  const getCourseById = (id: number) => courses.value.find((c) => Number(c.id) === id)

  const getCourseLabel = (id: number) => {
    const course = getCourseById(id)
    return course ? `${course.abbreviation} (${course.semester}º Sem)` : '—'
  }

  return {
    courses,
    fetchCourses,
    getCourseById,
    getCourseLabel,
  }
})
