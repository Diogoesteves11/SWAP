<template>
  <header :class="['popup-header', { 'popup-header--danger': danger }]">
    <h1 class="popup-header__title">
      {{ title }} <span v-if="subtitle" class="popup-header__subtitle"> - {{ subtitle }}</span>
    </h1>

    <div class="popup-header__icons">
      <button v-if="!disableReturn" @click="onUndo">
        <ReturnIcon width="25px" iconColor="#fff" />
      </button>
      <button v-if="!disableCross" @click="onClose">
        <XIcon width="30px" height="30px" iconColor="#fff" />
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReturnIcon from '@/assets/icons/ReturnIcon.vue'
import XIcon from '@/assets/icons/XIcon.vue'

import { usePopupManager } from '@/stores/popupManager'

const popupManager = usePopupManager()

export default defineComponent({
  name: 'PopupHeader',
  components: {
    ReturnIcon,
    XIcon,
  },
  props: {
    disableReturn: {
      type: Boolean,
      default: true,
    },
    disableCross: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    danger: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onUndo() {
      popupManager.closeTop()
    },
    onClose() {
      popupManager.closeAll()
    },
    handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.onUndo()
      }
    },
  },
})
</script>

<style scoped>
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #aed6df;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0px 7px #d4e9ee;
}

.popup-header--danger {
  background-color: #ffa4a4;
  box-shadow: 0px 7px #ffe8e8;
}

.popup-header__title {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
}

.popup-header__subtitle {
  font-size: 22px;
  font-weight: 300;
}

.popup-header__icons {
  display: flex;
  gap: 1rem;
}
</style>
