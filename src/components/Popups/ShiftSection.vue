<template>
  <div>
    <div class="shift-row">
      <div class="shift-title">{{ title }}</div>
      <span class="shift-label">Numero de alunos</span>
    </div>

    <div class="shift-row">
      <div class="info-left">{{ room }}</div>
      <div class="info-center">{{ current }}/{{ max }}</div>
      <button class="edit-btn" @click="emitEdit">
        <EditIcon iconColor="#C7E2E9" width="28" height="28" />
      </button>
    </div>

    <div class="shift-row">
      <div class="info-left">{{ teacher }}</div>
      <div class="info-center"></div>
      <button class="edit-btn" @click="emitEdit">
        <EditIcon iconColor="#C7E2E9" width="28" height="28" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EditIcon from '@/assets/icons/EditIcon.vue'

export default defineComponent({
  name: 'ShiftSection',
  components: { EditIcon },
  props: {
    title: { type: String, required: true },
    room: { type: String, required: true },
    teacher: { type: String, required: true },
    current: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  emits: ['edit'],
  methods: {
    emitEdit(): void {
      this.$emit('edit')
    },
  },
})
</script>

<style scoped>
.shift-title {
  max-width: 200px;
  font-size: 22px;
  font-weight: 400;
  color: #80becc;
  border-bottom: 2px solid #80becc;
  padding-bottom: 0.25rem;
  margin-bottom: 0.75rem;
}

.shift-label {
  font-size: 14px;
  font-weight: 300;
  margin-right: 4.2rem;
}

.shift-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  margin-bottom: 0.5rem;
}

.info-left {
  font-size: 22px;
  font-weight: 400;
  color: #80becc;
  margin-left: 30px;
}

.info-center {
  font-size: 20px;
  font-weight: 300;
  color: #80becc;
  margin-right: 5.5rem;
}

.edit-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.edit-btn:focus {
  outline: none;
}
</style>
