<template>
  <div class="weekly-schedule">
    <!-- Time labels column -->
    <div class="time-labels-column">
      <div v-for="(label, index) in hourLabels" :key="'time-label-' + index" class="time-label">
        {{ label }}
      </div>
    </div>

    <!-- Days columns -->
    <div class="days-columns">
      <div v-for="day in DAYS" :key="day" class="day-column">
        <div class="day-header">{{ day }}</div>
        <div class="day-container">
          <DaySchedule
            @select="(e) => $emit('select', e)"
            :day="day"
            :events="eventsByDay[day] || []"
            :allocations="allocations"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import DaySchedule from '@/components/Schedule/DaySchedule.vue'
import type { ScheduleEvent } from '@/types/ScheduleTypes'
import { type AllocationDetail } from '@/types/AllocationDetail'
import { DAYS, DAY_START, NUM_HOURS } from '@/constants/scheduleConstants'

export default defineComponent({
  name: 'ScheduleCalendar',
  emits: ['select'],
  components: { DaySchedule },
  props: {
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
    const eventsByDay = computed(() => {
      const result: { [key: string]: ScheduleEvent[] } = {}
      DAYS.forEach((day) => {
        result[day] = props.events.filter((event) => event.day === day)
      })
      return result
    })

    const hourLabels = computed(() => {
      const labels: string[] = []
      const startHour = DAY_START.hours
      for (let i = 0; i < NUM_HOURS; i++) {
        const currentHour = startHour + i
        labels.push((currentHour < 10 ? '0' : '') + currentHour + ':00')
      }
      return labels
    })

    return {
      eventsByDay,
      hourLabels,
      DAYS,
    }
  },
})
</script>

<style scoped>
.weekly-schedule {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* Time labels column on the left */
.time-labels-column {
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
}

.time-label {
  flex: 1;
  display: flex;
  justify-content: center;
  font-size: 0.8rem;
}

.time-label:first-child {
  margin-top: 1.5rem;
}

/* Days columns on top */
.days-columns {
  display: flex;
  flex: 1;
}

.day-column {
  flex: 1;
  border-right: 2px solid #fff;
  display: flex;
  flex-direction: column;
}

.day-column:last-child {
  border-right: none;
}

.day-header {
  text-align: center;
  font-weight: 700;
  padding-bottom: 4px;
}

.day-container {
  position: relative;
  flex: 1;
}
</style>
