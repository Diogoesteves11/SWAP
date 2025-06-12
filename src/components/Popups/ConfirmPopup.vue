<template>
  <BasePopup :danger="danger" :visible="true" :title="'Aviso'" @close="onClose(1)">
    <div class="message-structure">
      <slot name="content">
        <p>{{ message }}</p>
      </slot>
    </div>
    <div class="icons">
      <button>
        <ConfirmIcon
          :icon-color="danger ? '#ffa4a4' : '#80BECC'"
          :width="26"
          :height="25"
          @click="onConfirm"
        />
      </button>
      <button>
        <XIcon
          :icon-color="danger ? '#ffa4a4' : '#80BECC'"
          :width="35"
          :height="35"
          @click="onClose(1)"
        />
      </button>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ConfirmIcon from '@/assets/icons/ConfirmIcon.vue'
import XIcon from '@/assets/icons/XIcon.vue'
import BasePopup from './BasePopup.vue'

export default defineComponent({
  name: 'ConfirmPopup',
  components: {
    BasePopup,
    ConfirmIcon,
    XIcon,
  },
  props: {
    message: {
      type: String,
      required: false,
    },
    chainPop: {
      type: Number,
      default: 1,
    },
    danger: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'confirmed'],
  methods: {
    onClose(cp: number) {
      this.$emit('close', cp)
    },
    onConfirm() {
      this.$emit('confirmed')
      this.onClose(this.chainPop)
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
