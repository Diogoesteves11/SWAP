<template>
  <NavBar />
  <div class="student-main">
    <div class="student-callendar">
      <div class="student-filter__wrapper">
        <FilterBar
          :semester="filters.courseSem"
          :uc="filters.courseId"
          :uc-options="ucOptions"
          :uc-disabled="ucDisabled"
          :show-schedule-button="true"
          :button-text="currentButtonText"
          @update:buttonText="handleButtonTextUpdate"
          @update:semester="handleSemesterUpdate"
          @update:uc="handleUcUpdate"
          @clear="handleClear"
        />
      </div>
      <div class="student-calendar__wrapper">
        <ScheduleCalendar :events="filteredEvents" />
      </div>
    </div>
    <div class="student-allocations">
      <HeaderTitle>Inscrições</HeaderTitle>
      <div class="student-allocations__list">
        <ShiftList
          v-for="course in courses"
          :key="course.courseId"
          :course-abbreviation="course.courseAbbreviation"
          :term-shift="selectedTermForCourse(course.courseId)"
          :pl-shift="selectedPlForCourse(course.courseId)"
          @change-request="(t) => $emit('change-request', course.courseId, t)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed, ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FilterBar from '@/components/FilterBar/FilterBar.vue'
import ScheduleCalendar from '@/components/Schedule/ScheduleCalendar.vue'
import HeaderTitle from '@/components/HeaderTitle.vue'
import type { ScheduleEvent, ScheduleFilters } from '@/types/ScheduleTypes'
import ShiftList from '@/components/ShiftList.vue'
import { type AllocationDetail } from '@/types/AllocationDetail'

export default defineComponent({
  name: 'StudentTemplate',
  components: {
    NavBar,
    FilterBar,
    ScheduleCalendar,
    HeaderTitle,
    ShiftList,
  },
  props: {
    events: {
      type: Array as PropType<ScheduleEvent[]>,
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
    allocations: {
      type: Array as PropType<AllocationDetail[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const currentButtonText = ref('Horário Completo')

    // Group events by courseId
    const eventsByCourse = computed(() => {
      const map = new Map<number, ScheduleEvent[]>()
      props.events.forEach((e) => {
        if (!map.has(e.courseId)) map.set(e.courseId, [])
        map.get(e.courseId)!.push(e)
      })
      return map
    })

    // Get the highlighted shiftIds for the student
    const highlightedShifts = computed(() => {
      const allocatedShiftIds = props.allocations.map((a) => Number(a.shiftId))

      // Collect the shiftIds that the student is allocated to
      return allocatedShiftIds
    })

    const filteredEvents = computed(() => {
      const enrolledCourseIds = props.allocations.map((a) => Number(a.courseId))
      const allocatedShiftIds = props.allocations.map((a) => Number(a.shiftId))

      // Horário Completo: mostrar todos os eventos das UCs em que está inscrito (todos os turnos)
      if (currentButtonText.value === 'Horário Completo') {
        return props.events.filter((event) => enrolledCourseIds.includes(Number(event.courseId)))
      }

      // "Meu Horário": Apenas mostrar os turnos aos quais o aluno está alocado
      return props.events
        .map((event) => {
          const matchingShifts = event.shifts.filter((shift) =>
            allocatedShiftIds.includes(Number(shift.shiftId)),
          )

          // Se não houver turnos válidos (com shiftId alocado), remove esse evento
          if (matchingShifts.length > 0) {
            return {
              ...event,
              shifts: matchingShifts,
            }
          }

          return null
        })
        .filter((e): e is ScheduleEvent => e !== null) // Filtra qualquer evento que seja null (sem turnos alocados válidos)
    })

    // Build a list of unique courses
    const courses = computed(() => {
      return Array.from(eventsByCourse.value.entries()).map(([courseId, evs]) => ({
        courseId,
        courseAbbreviation: evs[0].courseAbbreviation,
      }))
    })

    // Helper functions
    function selectedShiftForCourse(courseId: number, prefix: 'T' | 'PL'): string {
      const allocs = props.allocations.filter(
        (a) => Number(a.courseId) === courseId && Number(a.shiftId) != null,
      )

      if (!allocs.length) return 'N/A'

      const evs = eventsByCourse.value.get(courseId) || []
      for (const a of allocs) {
        for (const ev of evs) {
          const shift = ev.shifts.find((s) => s.shiftId === a.shiftId)
          if (shift?.name.startsWith(prefix)) return shift.name
        }
      }
      return 'N/A'
    }

    const selectedTermForCourse = (cid: number) => selectedShiftForCourse(cid, 'T')
    const selectedPlForCourse = (cid: number) => selectedShiftForCourse(cid, 'PL')

    // Event handlers
    const handleButtonTextUpdate = (newText: string) => {
      currentButtonText.value = newText
      emit('changeSchedule', newText)
    }

    const handleSemesterUpdate = (val: string | number | null) => {
      emit('update:semester', val)
    }

    const handleUcUpdate = (val: string | number | null) => {
      emit('update:uc', val)
    }

    const handleClear = () => {
      emit('clear')
    }

    return {
      currentButtonText,
      courses,
      filteredEvents,
      highlightedShifts,
      selectedTermForCourse,
      selectedPlForCourse,
      handleButtonTextUpdate,
      handleSemesterUpdate,
      handleUcUpdate,
      handleClear,
    }
  },
  emits: ['update:semester', 'update:uc', 'clear', 'changeSchedule', 'change-request'],
})
</script>

<style scoped>
.student-main {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
}
.student-allocations {
  width: 300px;
  padding: 16px;
  border-left: 8px solid #80becc;
  border-top: 8px solid #80becc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.student-allocations__list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
  flex: 2;
}

.student-allocations__buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
}

.student-filter__wrapper {
  border-top: 8px solid #80becc;
  border-bottom: 8px solid #80becc;
}

.student-calendar__wrapper {
  height: 100%;
  padding: 20px;
}

.student-callendar {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.student-calendar__labels {
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 15px;
  margin-right: 30px;
  margin-top: -40px;
}
</style>
