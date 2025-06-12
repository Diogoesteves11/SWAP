<template>
  <div class="input-atom">
    <label v-if="label" :for="id" class="label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="updateValue"
      class="input"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserInput',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const updateValue = (event: Event) => {
      const input = event.target as HTMLInputElement
      emit('update:modelValue', input.value)
    }
    return {
      updateValue,
    }
  },
})
</script>

<style scoped>
.input-atom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 30px;
}

.input-atom label {
  font-size: 20px;
  color: #ffffff;
}

.input-atom input {
  width: 350px;
  height: 45px;
  border-radius: 10px;
  border: none;
  padding: 0 15px;
  font-size: 16px;
  color: #80becc;
  background-color: #fff;
}

.input-atom input:focus {
  border-color: #80becc;
  outline: none;
}
</style>
