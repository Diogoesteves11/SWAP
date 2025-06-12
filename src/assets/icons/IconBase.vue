<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
  >
    <title :id="uniqueId" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'IconBase',
  props: {
    iconName: {
      type: String as PropType<string>,
      default: 'box',
    },
    width: {
      type: [Number, String] as PropType<number | string>,
      default: 18,
    },
    height: {
      type: [Number, String] as PropType<number | string>,
      default: 18,
    },
    iconColor: {
      type: String as PropType<string>,
      default: 'currentColor',
    },
    viewBox: {
      type: String as PropType<string>,
      default: '0 0 448 512',
    },
  },
  data() {
    return {
      uniqueId: `${this.iconName}-${crypto.randomUUID()}`,
    }
  },
})
</script>
