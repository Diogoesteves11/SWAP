<template>
  <div class="calendar-label" :style="labelStyle">
    <p class="calendar-label-text">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue'

// Utility to lighten a hex color by a given percent (0-1)
function lightenColor(hex: string, percent: number): string {
  // Remove leading '#'
  const normalizedHex = hex.replace('#', '')
  const num = parseInt(normalizedHex, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff

  r = Math.min(255, Math.floor(r + (255 - r) * percent))
  g = Math.min(255, Math.floor(g + (255 - g) * percent))
  b = Math.min(255, Math.floor(b + (255 - b) * percent))

  return `rgb(${r}, ${g}, ${b})`
}

export default defineComponent({
  name: 'CalendarLabel',
  props: {
    color: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    // Compute styles based on the passed color
    const labelStyle = computed(() => {
      const mainColor = props.color
      const bgColor = lightenColor(mainColor, 0.7)
      return {
        border: `3px solid ${mainColor}`,
        backgroundColor: bgColor,
        color: mainColor,
        textShadow: `0 0 2px ${mainColor}, 0 0 5px ${mainColor}`,
      }
    })

    return { labelStyle }
  },
})
</script>

<style scoped>
.calendar-label {
  transform: translateY(40px);
  border-radius: 20px;
  padding: 32px 10px;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  max-width: 200px;
}

.calendar-label-text {
  transform: translateY(-17px);
  color: #fff;
  -webkit-text-stroke-color: #aed6df;
  font-size: 13px;
  font-weight: 900;
  line-height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
