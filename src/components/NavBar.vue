<template>
  <nav class="navbar">
    <!-- left: title -->
    <div class="navbar__title">
      {{ title }}
    </div>

    <!-- right: icons -->
    <div class="navbar__icons">
      <!-- Messages (only for non-teachers) -->
      <button
        v-if="!isTeacher"
        class="icon-btn"
        :disabled="isMessages"
        @click="navigateTo('messages', userId)"
      >
        <MessageIcon width="36" height="36" :iconColor="isMessages ? '#246D7D' : 'white'" />
      </button>

      <!-- Admin calendar -->
      <button
        v-if="(userId === 1021 && !isTeacher) || isEdit"
        class="icon-btn"
        :disabled="isAdmin"
        @click="navigateTo('admin')"
      >
        <CalendarIcon width="36" height="36" :iconColor="isAdmin ? '#246D7D' : 'white'" />
      </button>

      <!-- Student calendar -->
      <button
        v-if="userId !== 1021 && !isTeacher && !isEdit"
        class="icon-btn"
        :disabled="isStudent"
        @click="navigateTo('student', userId)"
      >
        <CalendarIcon width="36" height="36" :iconColor="isStudent ? '#246D7D' : 'white'" />
      </button>

      <!-- Logout always -->
      <button class="icon-btn" @click="onLogout">
        <LogoutIcon width="36" height="36" iconColor="white" />
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRouter, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import MessageIcon from '@/assets/icons/MessageIcon.vue'
import CalendarIcon from '@/assets/icons/CalendarIcon.vue'
import LogoutIcon from '@/assets/icons/LogoutIcon.vue'

// import your teachers store
import { useTeacherStore } from '@/stores/teacherStore'

type PageName = 'admin' | 'messages' | 'edit' | 'student'

export default defineComponent({
  name: 'NavBar',
  components: { MessageIcon, CalendarIcon, LogoutIcon },
  setup() {
    const router = useRouter()
    const route = useRoute() as RouteLocationNormalizedLoaded

    // teachers store
    const teacherStore = useTeacherStore()
    onMounted(() => {
      // make sure we have the list of teachers loaded
      teacherStore.fetchTeachers?.()
    })

    // current route name
    const currentRouteName = computed(() => route.name as string)

    const isMessages = computed(() => currentRouteName.value === 'messages')
    const isAdmin = computed(() => currentRouteName.value === 'admin')
    const isEdit = computed(() => currentRouteName.value === 'edit')
    const isStudent = computed(() => currentRouteName.value === 'student')
    const isNewMessage = computed(() => currentRouteName.value === 'new-message')

    // derive userId from route params (or default 1021)
    const userId = computed(
      () => Number(route.params.studentId) || Number(route.params.userId) || 1021,
    )

    // new flag: are they a teacher?
    const isTeacher = computed(() => {
      // if store has a getter:
      return !!teacherStore.getTeacherById?.(userId.value)
    })

    // dynamic title
    const title = computed(() => {
      if (isMessages.value) return 'Mensagens'
      if (isAdmin.value) return 'Horário Geral'
      if (isEdit.value) return 'Alocação Manual'
      if (isStudent.value) return 'Meu Horário'
      if (isNewMessage.value) return 'Mensagens - Nova Mensagem'
      return 'oopsie!'
    })

    function navigateTo(pageName: PageName, id?: number) {
      if (currentRouteName.value === pageName) return
      const params: Record<string, number> = {}
      if (pageName === 'messages' && id != null) params.userId = id
      if (pageName === 'student' && id != null) params.studentId = id

      router.push({
        name: pageName,
        params: Object.keys(params).length ? params : undefined,
      })
    }

    function onLogout() {
      router.push({ name: 'login' })
    }

    return {
      userId,
      isMessages,
      isAdmin,
      isStudent,
      isTeacher,
      isEdit,
      title,
      navigateTo,
      onLogout,
    }
  },
})
</script>

<style scoped>
.navbar {
  background-color: #80becc;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-shadow: 0 8px 0 0 #d4e9ee;
}
.navbar__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}
.navbar__icons {
  display: flex;
  gap: 0.75rem;
}
.icon-btn {
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
}
.icon-btn:disabled {
  cursor: default;
}
</style>
