<template>
  <div>
    <!-- LoginTemplate is the dumb component. The page handles the logic. -->
    <LoginTemplate
      :username="username"
      :password="password"
      @update:username="handleUsernameUpdate"
      @update:password="handlePasswordUpdate"
      @submit="handleSubmit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginTemplate from '@/components/templates/LoginTemplate.vue'

export default defineComponent({
  name: 'LoginPage',
  components: {
    LoginTemplate,
  },
  setup() {
    const username = ref('')
    const password = ref('')
    const router = useRouter()

    const handleUsernameUpdate = (value: string) => {
      username.value = value
    }

    const handlePasswordUpdate = (value: string) => {
      password.value = value
    }

    const handleSubmit = async () => {
      // Handle your login logic here
      try {
        const [directorsRes, studentsRes, teachersRes] = await Promise.all([
          fetch('http://localhost:3000/directors'),
          fetch('http://localhost:3000/students'),
          fetch('http://localhost:3000/teachers'),
        ])
        if (!directorsRes.ok || !studentsRes.ok || !teachersRes.ok) {
          throw new Error('Failed to fetch data')
        }
        const directors = await directorsRes.json()
        const students = await studentsRes.json()
        const teachers = await teachersRes.json()

        const director = directors.find(
          (d: { email: string; password: string }) =>
            d.email === username.value && d.password === password.value,
        )
        if (director) {
          router.push('/admin')
          return
        }
        const student = students.find(
          (s: { email: string; password: string }) =>
            s.email === username.value && s.password === password.value,
        )
        if (student) {
          router.push(`/student/${student.id}`)
          return
        }
        const teacher = teachers.find(
          (t: { email: string; password: string }) =>
            t.email === username.value && t.password === password.value,
        )
        if (teacher) {
          router.push(`/messages/${teacher.id}`)
          return
        }
        alert('Invalid credentials')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    console.log('Logging in with', username.value, password.value)

    return {
      username,
      password,
      handleUsernameUpdate,
      handlePasswordUpdate,
      handleSubmit,
    }
  },
})
</script>
