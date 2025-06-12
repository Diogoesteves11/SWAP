<template>
  <div
    @click="$emit('select', event)"
    class="schedule-event"
    :style="{
      top: top + '%',
      height: height + '%',
      left: left + '%',
      width: width + '%',
      backgroundColor: color,
    }"
  >
    <div class="event-content">
      <div class="event-title">{{ event.courseAbbreviation }}</div>
      <div class="event-terms">
        {{ event.shifts.map((shift) => shift.name).join(', ') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ScheduleEvent } from '@/types/ScheduleTypes'

export default defineComponent({
  name: 'EventSlot',
  emits: ['select'],
  props: {
    event: {
      type: Object as PropType<ScheduleEvent>,
      required: true,
    },
    top: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    left: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: '#d4e9ee',
    },
  },
})
</script>

<style scoped>
.schedule-event {
  position: absolute;
  border-radius: 3px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 2px;
  border-bottom: 2px solid #fff;
  border-top: 2px solid #fff;
  cursor: pointer;
}
.event-content {
  text-align: center;
  line-height: 1.125rem;
}
.event-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  color: #80becc;
}
.event-terms {
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  color: #000;
}
</style>
