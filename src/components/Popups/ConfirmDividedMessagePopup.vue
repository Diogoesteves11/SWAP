<template>
  <ConfirmPopup
    danger
    :title="'Aviso'"
    :chainPop="chainPop"
    @confirmed="onConfirm"
    @close="(cp: number) => onClose(cp)"
  >
    <template #content>
      <div class="confirmation-dialog">
        <p class="upper-text">{{ upperText }}</p>
        <div class="divider"></div>
        <p class="bottom-text">{{ bottomText }}</p>
      </div>
    </template>
  </ConfirmPopup>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ConfirmPopup from './ConfirmPopup.vue'

export default defineComponent({
  name: 'ConfirmDividedMessagePopup',
  components: {
    ConfirmPopup,
  },
  props: {
    upperText: {
      type: String,
      required: true,
    },
    bottomText: {
      type: String,
      required: true,
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
    onClose(cp = 1) {
      this.$emit('close', cp)
    },
    onConfirm() {
      this.$emit('confirmed')
    },
  },
})
</script>

<style scoped>
.confirmation-dialog {
  display: flex;
  flex-direction: column;
  padding: 10px;
  text-align: left;
}

.upper-text {
  font-size: 18px;
  font-weight: bold;
  color: #ffa4a4;
}

.bottom-text {
  font-size: 16px;
  color: #ffa4a4;
}

.divider {
  width: 70%;
  height: 1px;
  background-color: #ffa4a4;
  margin: 8px 0;
}
</style>
