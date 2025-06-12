<template>
  <IconBase
    iconName="MessageIcon"
    :width="width"
    :height="height"
    :iconColor="iconColor"
    viewBox="0 0 42 42"
  >
    <path
      d="M38.5 10.5C38.5 8.575 36.925 7 35 7H7C5.075 7 3.5 8.575 3.5 10.5V31.5C3.5 33.425 5.075 35 7 35H35C36.925 35 38.5 33.425 38.5 31.5V10.5ZM35 10.5L21 19.25L7 10.5H35ZM35 31.5H7V14L21 22.75L35 14V31.5Z"
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
      default: 42,
    },
    height: {
      type: [Number, String],
      default: 42,
    },
  },
})
</script>
