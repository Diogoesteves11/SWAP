<template>
  <BasePopup
    :disableCross="false"
    :disableReturn="disableReturn"
    :visible="true"
    :subtitle="subtitle"
    :title="title"
    @close="onClose"
  >
    <div class="message-structure">
      <slot name="content">
        <p>{{ message }}</p>
      </slot>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BasePopup from './BasePopup.vue'

export default defineComponent({
  name: 'InfoPopup',
  components: {
    BasePopup,
  },
  props: {
    message: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      requeried: false,
    },
    chainPop: {
      type: Number,
      default: 1,
    },
    disableReturn: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  methods: {
    onClose() {
      this.$emit('close', this.chainPop)
    },
  },
})
</script>

<style scoped>
.message-structure {
  padding: 1rem;
  white-space: pre-line;
}

.icons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
}
</style>
