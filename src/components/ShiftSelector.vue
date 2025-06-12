<template>
  <div class="shift-selector" :style="{ '--primary-color': primaryColor }">
    <!-- Left block with course abbreviation -->
    <div class="selector-left">
      <span class="course-abbrev">{{ courseAbbreviation }}</span>
    </div>

    <!-- Right block with two rows -->
    <div class="selector-right">
      <!-- Term shift row -->
      <button ref="termButton" class="shift-row" @click="toggleTerm">
        <span class="shift-label">{{ selectedTerm }}</span>
        <span class="shift-icon">▾</span>
      </button>

      <!-- PL shift row -->
      <button ref="plButton" class="shift-row" @click="togglePL">
        <span class="shift-label">{{ selectedPL }}</span>
        <span class="shift-icon">▾</span>
      </button>

      <!-- Term dropdown -->
      <teleport to="body">
        <ul
          v-if="openTerm"
          class="dropdown-menu"
          :style="{
            ...menuStylesTerm,
            '--primary-color': primaryColor,
          }"
        >
          <li v-for="opt in termOptions" :key="opt">
            <button
              class="dropdown-item"
              @click.prevent="onSelectTerm(opt)"
              :style="{ borderBottom: '3px solid ' + primaryColor, color: primaryColor }"
            >
              {{ opt }}
            </button>
          </li>
        </ul>
      </teleport>

      <!-- PL dropdown -->
      <teleport to="body">
        <ul
          v-if="openPL"
          class="dropdown-menu"
          :style="{
            ...menuStylesPL,
            '--primary-color': primaryColor,
          }"
        >
          <li v-for="opt in plOptions" :key="opt">
            <button
              class="dropdown-item"
              @click.prevent="onSelectPL(opt)"
              :style="{ borderBottom: '3px solid ' + primaryColor, color: primaryColor }"
            >
              {{ opt }}
            </button>
          </li>
        </ul>
      </teleport>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  type PropType,
  ref,
  reactive,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue'

export default defineComponent({
  name: 'ShiftSelector',
  props: {
    primaryColor: { type: String, default: '#C5EDC5' },
    courseAbbreviation: { type: String, required: true },
    termShift: { type: String, default: '' },
    plShift: { type: String, default: '' },
    termOptions: { type: Array as PropType<string[]>, default: () => [] },
    plOptions: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: ['term-changed', 'pl-changed'],
  setup(props, { emit }) {
    // Local reactive copies of the initial props:
    const selectedTerm = ref(props.termShift)
    const selectedPL = ref(props.plShift)

    // If parent ever changes the props, keep us in sync:
    watch(
      () => props.termShift,
      (v) => {
        selectedTerm.value = v
      },
    )
    watch(
      () => props.plShift,
      (v) => {
        selectedPL.value = v
      },
    )

    const openTerm = ref(false)
    const openPL = ref(false)
    const termButton = ref<HTMLElement | null>(null)
    const plButton = ref<HTMLElement | null>(null)

    const menuStylesTerm = reactive({ top: '0px', left: '0px', minWidth: '0px' })
    const menuStylesPL = reactive({ top: '0px', left: '0px', minWidth: '0px' })

    function updateMenuPosition(btnRef: typeof termButton, menuStyles: typeof menuStylesTerm) {
      const btn = btnRef.value
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      menuStyles.top = `${rect.bottom + window.scrollY - 40}px`
      menuStyles.left = `${rect.left + window.scrollX}px`
      menuStyles.minWidth = `${rect.width}px`
    }

    function toggleTerm() {
      openTerm.value = !openTerm.value
      openPL.value = false
      if (openTerm.value) nextTick(() => updateMenuPosition(termButton, menuStylesTerm))
    }
    function togglePL() {
      openPL.value = !openPL.value
      openTerm.value = false
      if (openPL.value) nextTick(() => updateMenuPosition(plButton, menuStylesPL))
    }

    function onSelectTerm(opt: string) {
      if (opt !== selectedTerm.value) {
        selectedTerm.value = opt
        emit('term-changed', opt)
      }
      openTerm.value = false
    }
    function onSelectPL(opt: string) {
      if (opt !== selectedPL.value) {
        selectedPL.value = opt
        emit('pl-changed', opt)
      }
      openPL.value = false
    }

    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node
      if (!termButton.value?.contains(t) && openTerm.value) openTerm.value = false
      if (!plButton.value?.contains(t) && openPL.value) openPL.value = false
    }
    onMounted(() => document.addEventListener('click', onClickOutside))
    onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

    return {
      selectedTerm,
      selectedPL,
      openTerm,
      openPL,
      termButton,
      plButton,
      menuStylesTerm,
      menuStylesPL,
      toggleTerm,
      togglePL,
      onSelectTerm,
      onSelectPL,
    }
  },
})
</script>

<style scoped>
.shift-selector {
  width: 100%;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}
.selector-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  background-color: var(--primary-color);
}
.course-abbrev {
  color: #fff;
  font-weight: bold;
  font-size: 1.25rem;
}
.selector-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  background-color: #fff;
}
.shift-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
}
.shift-label {
  color: var(--primary-color);
}
.shift-icon {
  margin-left: 8px;
  color: var(--primary-color);
}
.dropdown-menu {
  position: absolute;
  background-color: #fff;
  border: 3px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  overflow: hidden;
}
.dropdown-item {
  width: 100%;
  padding: 0.5rem 0.5rem;
  background: none;
  border-bottom: 3px solid var(--primary-color);
  text-align: left;
  font-size: 1rem;
  color: var(--primary-color);
  cursor: pointer;
}
.dropdown-menu li:last-child .dropdown-item {
  border-bottom: none;
}
</style>
