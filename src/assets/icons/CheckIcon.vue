<template>
  <IconBase iconName="CheckIcon" :width="width" :height="height" :iconColor="iconColor">
    <path
      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
    />
  </IconBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconBase from './IconBase.vue'

export default defineComponent({
  name: 'CheckIcon',
  components: {
    IconBase,
  },
  props: {
    iconColor: {
      type: String,
      default: 'currentColor',
    },
    width: {
      type: [Number, String],
      default: 30,
    },
    height: {
      type: [Number, String],
      default: 30,
    },
  },
})
</script>
