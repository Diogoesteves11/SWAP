<template>
  <div class="filter-bar">
    <div class="filter">
      <p>Semestre</p>
      <DropdownMenu v-model="semesterValue" :options="[1, 2, 3, 4, 5, 6]" width="100px" />
    </div>
    <div class="filter">
      <p>UC</p>
      <DropdownMenu
        v-model="ucValue"
        :options="ucOptions.map((o) => o.value)"
        :disabled="ucDisabled"
        width="200px"
      >
        <template #item="{ option }">
          {{ ucOptions.find((o) => o.value === option)?.label }}
        </template>
        <template #value>
          {{ ucOptions.find((o) => o.value === ucValue)?.label || '-' }}
        </template>
      </DropdownMenu>
    </div>

    <div class="clean-wrapper" @click="clearFilters">
      <CleanUpIcon width="40" height="40" icon-color="#80BECC" />
    </div>

    <div v-if="showScheduleButton">
      <SmallButton @click="toggleSchedule">{{ buttonText }}</SmallButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import CleanUpIcon from '@/assets/icons/CleanUpIcon.vue'
import DropdownMenu from '@/components/FilterBar/DropdownMenu.vue'
import SmallButton from '@/components/Buttons/SmallButton.vue'

export default defineComponent({
  name: 'FilterBar',
  components: {
    CleanUpIcon,
    DropdownMenu,
    SmallButton,
  },
  props: {
    semester: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
    uc: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
    ucOptions: {
      type: Array as PropType<{ value: number; label: string }[]>,
      default: () => [],
    },
    ucDisabled: {
      type: Boolean,
      default: false,
    },
    showScheduleButton: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      default: 'Meu Horário',
    },
  },
  emits: ['update:semester', 'update:uc', 'clear', 'update:buttonText'],
  setup(props, { emit }) {
    const semesterValue = computed({
      get: () => props.semester,
      set: (val: string | number | null) => emit('update:semester', val),
    })

    const ucValue = computed({
      get: () => props.uc,
      set: (val: string | number | null) => emit('update:uc', val),
    })

    function clearFilters() {
      emit('update:semester', null)
      emit('update:uc', null)
      emit('clear')
    }

    function toggleSchedule() {
      const newText = props.buttonText === 'Horário Completo' ? 'Meu Horário' : 'Horário Completo'
      emit('update:buttonText', newText)
    }

    return {
      semesterValue,
      ucValue,
      clearFilters,
      toggleSchedule,
    }
  },
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  width: 100%;
  height: 50px;
  background: #d4e9ee;
  align-items: center;
  padding: 0 16px;
  position: relative;
  gap: 30px;
}

.filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.clean-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-right: 8px;
  cursor: pointer;
}
</style>
