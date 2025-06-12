<template>
  <IconBase
    iconName="LogoutIcon"
    :width="width"
    :height="height"
    :iconColor="iconColor"
    viewBox="0 0 36 36"
  >
    <path
      d="M25.5 10.5L23.385 12.615L27.255 16.5H12V19.5H27.255L23.385 23.37L25.5 25.5L33 18M6 7.5H18V4.5H6C4.35 4.5 3 5.85 3 7.5V28.5C3 30.15 4.35 31.5 6 31.5H18V28.5H6V7.5Z"
    />
  </IconBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconBase from './IconBase.vue'

export default defineComponent({
  name: 'MessageIcon',
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
      default: 36,
    },
    height: {
      type: [Number, String],
      default: 36,
    },
  },
})
</script>
