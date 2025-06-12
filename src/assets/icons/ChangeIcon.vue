<template>
  <IconBase
    iconName="CalendarIcon"
    :width="width"
    :height="height"
    :iconColor="iconColor"
    viewBox="0 0 19 20"
  >
    <path
      d="M17.5729 4.03125H5.07292C3.96785 4.03125 2.90804 4.47024 2.12664 5.25164C1.34524 6.03304 0.90625 7.09285 0.90625 8.19792V10.2813M17.5729 9.23958V11.3229C17.5729 12.428 17.1339 13.4878 16.3525 14.2692C15.5711 15.0506 14.5113 15.4896 13.4062 15.4896H0.90625"
      stroke="#80BECC"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14.4479 7.15625L17.5729 4.03125L14.4479 0.90625M4.03125 12.3646L0.90625 15.4896L4.03125 18.6146"
      stroke="#80BECC"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconBase from './IconBase.vue'

export default defineComponent({
  name: 'ChangeIcon',
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
