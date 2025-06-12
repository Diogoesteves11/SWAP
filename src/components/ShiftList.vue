<template>
  <div class="shift-list">
    <!-- Left block with course abbreviation -->
    <div class="selector-left">
      <span class="course-abbrev">{{ courseAbbreviation }}</span>
    </div>
    <div class="selector-right">
      <!-- Term shift row -->
      <button class="shift-row" @click="$emit('change-request', 'T')">
        <span class="shift-label">{{ TShift }}</span>
        <span class="shift-icon">
          <ChangeIcon :height="20" :width="19" />
        </span>
      </button>

      <!-- PL shift row -->
      <button class="shift-row" @click="$emit('change-request', 'PL')">
        <span class="shift-label">{{ PlShift }}</span>
        <span class="shift-icon">
          <ChangeIcon :height="20" :width="19" />
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ChangeIcon from '@/assets/icons/ChangeIcon.vue'

export default defineComponent({
  name: 'ShiftList',
  components: {
    ChangeIcon,
  },
  emits: ['change-request'],
  props: {
    courseAbbreviation: { type: String, required: true },
    termShift: { type: String, default: '' },
    plShift: { type: String, default: '' },
  },
  setup(props) {
    const PlShift = ref(props.plShift)
    const TShift = ref(props.termShift)

    return {
      PlShift,
      TShift,
    }
  },
})
</script>

<style scoped>
.shift-list {
  width: 100%;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}

.selector-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  background-color: #aed6df;
}
.course-abbrev {
  color: #fff;
  font-weight: bold;
  font-size: 1.25rem;
}
.selector-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  background-color: #fff;
}

.shift-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
}
.shift-label {
  color: #aed6df;
}
.shift-icon {
  margin-left: 8px;
  color: #fff;
}
</style>
