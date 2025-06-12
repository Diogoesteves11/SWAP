<template>
  <div class="day-schedule">
    <!-- Background grid layer -->
    <div class="grid-background">
      <div v-for="row in gridRows" :key="'grid-row-' + row" class="grid-row">
        <TimeSlot />
      </div>
    </div>
    <!-- Events overlay layer -->
    <div class="events-overlay">
      <EventSlot
        v-for="layout in eventLayouts"
        :key="`event-${layout.event.shifts.map((s) => s.shiftId).join('-')}`"
        :event="layout.event"
        :top="layout.top"
        :height="layout.height"
        :left="layout.left"
        :width="layout.width"
        :color="getEventColor(layout.event)"
        @select="(e) => $emit('select', e)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import TimeSlot from '@/components/Schedule/TimeSlot.vue'
import EventSlot from '@/components/Schedule/EventSlot.vue'
import type { ScheduleEvent, EventLayout } from '@/types/ScheduleTypes'
import type { AllocationDetail } from '@/types/AllocationDetail'
import { differenceInMinutes } from '@/utils/time'
import { DAY_START, DAY_DURATION_MINUTES, NUM_HOURS } from '@/constants/scheduleConstants'

export default defineComponent({
  name: 'DaySchedule',
  emits: ['select'],
  components: { TimeSlot, EventSlot },
  props: {
    day: {
      type: String,
      required: true,
    },
    events: {
      type: Array as () => ScheduleEvent[],
      required: true,
    },
    allocations: {
      type: Array as () => AllocationDetail[],
      required: false,
    },
  },
  setup(props) {
    // Compute event layouts for this day.
    const eventLayouts = computed<EventLayout[]>(() => {
      const baseLayouts: EventLayout[] = props.events.map((event, index) => {
        const startDiff = differenceInMinutes(DAY_START, event.from)
        const duration = differenceInMinutes(event.from, event.to)
        return {
          event,
          top: (startDiff / DAY_DURATION_MINUTES) * 100 - 0.15,
          height: (duration / DAY_DURATION_MINUTES) * 100,
          left: 0,
          width: 100,
          originalIndex: index,
        }
      })
      // Overlap adjustment omitted for brevity (same as before)
      baseLayouts.forEach((current, i) => {
        const overlapping = baseLayouts.filter((other, j) => {
          if (i === j) return false
          return !(
            other.top >= current.top + current.height || other.top + other.height <= current.top
          )
        })
        if (overlapping.length > 0) {
          const totalColumns = overlapping.length + 1
          current.width = 100 / totalColumns
          const group = [current, ...overlapping].sort((a, b) => {
            if (a.top === b.top) return a.originalIndex - b.originalIndex
            return a.top - b.top
          })
          const indexInGroup = group.findIndex((item) => item === current)
          current.left = indexInGroup * current.width
        }
      })
      return baseLayouts
    })

    // Create an array to render grid rows
    const gridRows = computed(() => Array.from({ length: NUM_HOURS }, (_, i) => i))

    // Determine event color based on allocation flags and course match
    function getEventColor(event: ScheduleEvent): string {
      // First check exact shift allocations
      for (const shift of event.shifts) {
        const alloc = props.allocations?.find((a) => a.shiftId === shift.shiftId)
        if (alloc) {
          if (alloc.changedFrom) return '#d4e9ee' // Blue-ish
          if (alloc.changedTo) return '#FFF6E8' // Yellow
          return '#F0FFF0' // Green
        }
      }
      // Next check course-level null-shift allocations
      const courseAlloc = props.allocations?.find(
        (a) => a.shiftId == null && a.courseId === event.courseId,
      )
      if (courseAlloc) {
        return '#FFF0F0' // Red
      }
      // Default
      return '#d4e9ee'
    }

    return {
      eventLayouts,
      gridRows,
      getEventColor,
    }
  },
})
</script>

<style scoped>
.day-schedule {
  position: relative;
  width: 100%;
  height: 100%;
}
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.grid-row {
  flex: 1;
  border-bottom: 2px solid #fff;
}
.events-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
