<template>
  <NavBar />
  <div class="edit-main">
    <div class="edit-callendar">
      <div class="edit-filter__wrapper">
        <FilterBar
          :semester="filters.courseSem"
          :uc="filters.courseId"
          :uc-options="ucOptions"
          :uc-disabled="ucDisabled"
          @update:semester="$emit('update:semester', $event)"
          @update:uc="$emit('update:uc', $event)"
          @clear="$emit('clear')"
        />
      </div>
      <div class="edit-calendar__wrapper">
        <ScheduleCalendar
          @select="(e) => $emit('select', e)"
          :events="events"
          :allocations="allocations"
        />
      </div>
      <div class="edit-calendar__labels">
        <CalendarLabel color="#AED6DF">
          <ScribbleIcon strokeColor="#AED6DF" /> Horário Completo
        </CalendarLabel>
        <CalendarLabel color="#C5EDC5"
          ><ScribbleIcon strokeColor="#C5EDC5" /> Horário Atual
        </CalendarLabel>
        <CalendarLabel color="#FFDCA4"
          ><ScribbleIcon strokeColor="#FFDCA4" /> Trocas
        </CalendarLabel>
        <CalendarLabel color="#FFA4A4"
          ><ScribbleIcon strokeColor="#FFA4A4" /> Não Alocado
        </CalendarLabel>
      </div>
    </div>
    <div class="edit-allocations">
      <HeaderTitle>Turnos</HeaderTitle>

      <div class="edit-allocations__list">
        <ShiftSelector
          v-for="course in courses"
          :key="course.courseId"
          :primary-color="getCourseColor(course.courseId)"
          :course-abbreviation="course.courseAbbreviation"
          :term-shift="selectedTermForCourse(course.courseId)"
          :pl-shift="selectedPlForCourse(course.courseId)"
          :term-options="termOptionsForCourse(course.courseId)"
          :pl-options="plOptionsForCourse(course.courseId)"
          @term-changed="(name) => $emit('term-changed', course.courseId, name)"
          @pl-changed="(name) => $emit('pl-changed', course.courseId, name)"
        />
      </div>

      <div class="edit-allocations__buttons">
        <NormalButton @click="$emit('go-back')">Voltar</NormalButton>
        <NormalButton @click="$emit('apply')">Aplicar</NormalButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FilterBar from '@/components/FilterBar/FilterBar.vue'
import ScheduleCalendar from '@/components/Schedule/ScheduleCalendar.vue'
import HeaderTitle from '@/components/HeaderTitle.vue'
import NormalButton from '@/components/Buttons/NormalButton.vue'
import CalendarLabel from '@/components/Schedule/CalendarLabel.vue'
import ScribbleIcon from '@/assets/icons/ScribbleIcon.vue'
import ShiftSelector from '@/components/ShiftSelector.vue'
import { type AllocationDetail } from '@/types/AllocationDetail'
import type { ScheduleEvent, ScheduleFilters } from '@/types/ScheduleTypes'

export default defineComponent({
  name: 'EditTemplate',
  components: {
    NavBar,
    FilterBar,
    ScheduleCalendar,
    HeaderTitle,
    NormalButton,
    CalendarLabel,
    ScribbleIcon,
    ShiftSelector,
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
  setup(props) {
    function getCourseColor(courseId: number): string {
      // look for any exact‐shift allocations first
      for (const a of props.allocations) {
        if (a.courseId !== courseId) continue
        if (a.shiftId != null) {
          // find the matching event & shift
          const evs = eventsByCourse.value.get(courseId) || []
          for (const ev of evs) {
            const s = ev.shifts.find((s) => s.shiftId === a.shiftId)
            if (!s) continue
            if (a.changedFrom) return '#FFDCA4'
            if (a.changedTo) return '#FFDCA4'
          }
        }
      }
      // then check null‐shift (unallocated) at course level
      const courseAlloc = props.allocations.find(
        (a) => a.courseId === courseId && a.shiftId == null,
      )
      if (courseAlloc) {
        return '#FFA4A4' // red for unallocated
      }
      // default “complete” color
      return '#C5EDC5'
    }

    // Group events by courseId
    const eventsByCourse = computed(() => {
      const map = new Map<number, ScheduleEvent[]>()
      props.events.forEach((e) => {
        if (!map.has(e.courseId)) map.set(e.courseId, [])
        map.get(e.courseId)!.push(e)
      })
      return map
    })

    // Build a list of unique courses
    const courses = computed(() => {
      return Array.from(eventsByCourse.value.entries()).map(([courseId, evs]) => ({
        courseId,
        courseAbbreviation: evs[0].courseAbbreviation,
      }))
    })

    // helper to pick the allocated shift name for a given course & prefix
    function selectedShiftForCourse(courseId: number, prefix: 'T' | 'PL'): string {
      // 1) get all allocations for that course (may include both T and PL)
      const allocs = props.allocations.filter((a) => a.courseId === courseId && a.shiftId != null)
      if (!allocs.length) return ''

      // 2) for each allocation, find its shiftDetail and test the prefix
      const evs = eventsByCourse.value.get(courseId) || []
      for (const a of allocs) {
        for (const ev of evs) {
          const shift = ev.shifts.find((s) => s.shiftId === a.shiftId)
          if (shift && shift.name.startsWith(prefix)) {
            return shift.name
          }
        }
      }
      return ''
    }
    const selectedTermForCourse = (cid: number) => selectedShiftForCourse(cid, 'T')
    const selectedPlForCourse = (cid: number) => selectedShiftForCourse(cid, 'PL')

    // Helpers to build option lists
    function optionsForCourse(courseId: number, prefix: 'T' | 'PL'): string[] {
      const evs = eventsByCourse.value.get(courseId) || []
      const names = evs.flatMap((ev) =>
        ev.shifts.filter((s) => s.name.startsWith(prefix)).map((s) => s.name),
      )
      const unique = Array.from(new Set(names))
      // sort numerically by the number after the prefix
      return unique.sort((a, b) => {
        const na = parseInt(a.replace(prefix, ''), 10)
        const nb = parseInt(b.replace(prefix, ''), 10)
        return na - nb
      })
    }
    const termOptionsForCourse = (cid: number) => optionsForCourse(cid, 'T')
    const plOptionsForCourse = (cid: number) => optionsForCourse(cid, 'PL')

    return {
      courses,
      selectedTermForCourse,
      selectedPlForCourse,
      termOptionsForCourse,
      plOptionsForCourse,
      getCourseColor,
    }
  },
  emits: [
    'update:semester',
    'update:uc',
    'clear',
    'go-back',
    'term-changed',
    'pl-changed',
    'apply',
    'select',
  ],
})
</script>

<style scoped>
.edit-main {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
}
.edit-allocations {
  width: 300px;
  padding: 16px;
  border-left: 8px solid #80becc;
  border-top: 8px solid #80becc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.edit-allocations__list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
  flex: 2;
}

.edit-allocations__buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
}

.edit-filter__wrapper {
  border-top: 8px solid #80becc;
  border-bottom: 8px solid #80becc;
}

.edit-calendar__wrapper {
  height: 100%;
  padding: 20px;
}

.edit-callendar {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.edit-calendar__labels {
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 15px;
  margin-right: 30px;
  margin-top: -40px;
}
</style>
