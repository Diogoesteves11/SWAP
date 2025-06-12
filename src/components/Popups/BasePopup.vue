<template>
  <div v-if="visible" class="base-popup__overlay" @click.self="onClose">
    <div class="base-popup__content">
      <PopupHeader
        :danger="danger"
        :disableReturn="disableReturn"
        :disableCross="disableCross"
        :title="title"
        :subtitle="subtitle"
      />
      <div class="base-popup__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PopupHeader from './PopupHeader.vue'

export default defineComponent({
  name: 'BasePopup',
  components: {
    PopupHeader,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    disableReturn: {
      type: Boolean,
      default: true,
    },
    disableCross: {
      type: Boolean,
      default: true,
    },
    danger: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  methods: {
    onClose() {
      this.$emit('close')
    },
    handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.onClose()
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style scoped>
.base-popup__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.base-popup__content {
  background-color: white;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.base-popup__header {
  margin-bottom: 1rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

.base-popup__body {
  font-size: 16px;
}
</style>
