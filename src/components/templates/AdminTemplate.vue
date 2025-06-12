<template>
  <NavBar />
  <div class="admin-main">
    <div class="admin-callendar">
      <div class="admin-filter__wrapper">
        <FilterBar
          :semester="filters.courseSem"
          :uc="filters.courseId"
          :uc-options="ucOptions"
          :uc-disabled="ucDisabled"
          @update:semester="$emit('update:semester', $event)"
          @update:uc="$emit('update:uc', $event)"
          @generate="$emit('generate')"
          @clear="$emit('clear')"
        />
      </div>
      <div class="admin-calendar__wrapper">
        <ScheduleCalendar @select="(e) => $emit('select', e)" :events="events" />
      </div>
    </div>
    <div class="admin-allocations">
      <HeaderTitle>Não Alocados</HeaderTitle>

      <div class="student-list">
        <div v-for="student in students" :key="student.id" class="student-item">
          <button @click="$emit('select-student', student)" class="student-button">
            <p>{{ student.name }}</p>
          </button>
          <button @click="$emit('edit-student', student.id)">
            <EditIcon width="25" height="25" icon-color="#C7E2E9" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FilterBar from '@/components/FilterBar/FilterBar.vue'
import ScheduleCalendar from '@/components/Schedule/ScheduleCalendar.vue'
import HeaderTitle from '@/components/HeaderTitle.vue'
import EditIcon from '@/assets/icons/EditIcon.vue'
import type { ScheduleEvent, ScheduleFilters } from '@/types/ScheduleTypes'
import type { Student } from '@/types/Student'

export default defineComponent({
  name: 'AdminTemplate',
  components: {
    NavBar,
    FilterBar,
    ScheduleCalendar,
    HeaderTitle,
    EditIcon,
  },
  props: {
    events: {
      type: Array as PropType<ScheduleEvent[]>,
      required: true,
    },
    students: {
      type: Array as PropType<Student[]>,
      required: true,
    },
    filters: {
      type: Object as PropType<ScheduleFilters>,
      required: true,
    },
    ucOptions: {
      type: Array as PropType<{ value: number; label: string }[]>,
      required: true,
    },
    ucDisabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'update:semester',
    'update:uc',
    'generate',
    'clear',
    'edit-student',
    'select',
    'select-student',
  ],
})
</script>

<style scoped>
.admin-main {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
}
.admin-allocations {
  width: 300px;
  padding: 16px;
  border-left: 8px solid #80becc;
  border-top: 8px solid #80becc;
}

.admin-filter__wrapper {
  border-top: 8px solid #80becc;
  border-bottom: 8px solid #80becc;
}

.admin-calendar__wrapper {
  height: 100%;
  padding: 20px;
}

.admin-callendar {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.student-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: calc(100vh - 190px);
}

.student-item {
  min-height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.student-button {
  all: unset;
  cursor: pointer;
  padding: 0.1rem 0.5rem;
  border-radius: 2px;
  transition: background-color 0.2s ease;
  flex: 2;
}

.student-button:hover {
  background-color: #e3f3f9;
}
</style>
