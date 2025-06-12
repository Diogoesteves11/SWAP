<template>
  <div ref="dropdown" class="dropdown" :style="{ width }">
    <button class="dropdown-trigger" :disabled="disabled" @click="toggle">
      <span class="value">
        <slot name="value" :option="modelValue">
          {{ displayValue }}
        </slot>
      </span>
      <span class="arrow">▾</span>
    </button>
    <teleport to="body">
      <ul v-if="open" class="dropdown-menu" :style="menuStyles">
        <li v-for="opt in options" :key="opt">
          <button class="dropdown-item" @click="select(opt)">
            <slot name="item" :option="opt">
              {{ opt }}
            </slot>
          </button>
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type PropType,
  computed,
} from 'vue'

export default defineComponent({
  name: 'DropdownMenu',
  props: {
    options: {
      type: Array as PropType<(string | number)[]>,
      required: true,
    },
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      default: '',
    },
    width: {
      type: String,
      default: '120px',
    },
    placeholder: {
      type: String,
      default: '-',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false)
    const dropdown = ref<HTMLElement | null>(null)

    // reactive style object for the teleported menu
    const menuStyles = reactive({
      top: '0px',
      left: '0px',
      width: 'auto',
    })

    const displayValue = computed(() => {
      return props.modelValue !== '' && props.modelValue != null
        ? props.modelValue
        : props.placeholder
    })

    function updateMenuPosition() {
      if (!dropdown.value) return
      const rect = dropdown.value.getBoundingClientRect()
      menuStyles.top = `${rect.bottom + 4 + window.scrollY}px`
      menuStyles.left = `${rect.left + window.scrollX}px`
      menuStyles.width = `${rect.width}px`
    }

    function toggle() {
      if (props.disabled) return
      open.value = !open.value
      if (open.value) {
        nextTick(updateMenuPosition)
      }
    }

    function select(opt: string | number) {
      if (props.disabled) return
      emit('update:modelValue', opt)
      open.value = false
    }

    // close on outside click…
    const onClickOutside = (e: MouseEvent) => {
      if (!dropdown.value?.contains(e.target as Node)) open.value = false
    }
    onMounted(() => document.addEventListener('click', onClickOutside))
    onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

    return {
      open,
      dropdown,
      menuStyles,
      toggle,
      select,
      displayValue,
    }
  },
})
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0rem 0.75rem;
  background-color: #80becc;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.dropdown-trigger:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}

.arrow {
  padding-left: 12px;
  border-left: 1px solid #fff;
}

.dropdown-menu {
  position: absolute;
  background-color: #fff;
  border: 3px solid #80becc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 0.5rem 0.5rem;
  background: none;
  border-bottom: 3px solid #80becc;
  text-align: left;
  font-size: 1rem;
  color: #80becc;
  cursor: pointer;
}

.dropdown-menu li:last-child .dropdown-item {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f0f8fa;
}
</style>
