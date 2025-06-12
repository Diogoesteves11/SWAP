<template>
  <div class="classroom-container">
    <div class="left-section">
      <p class="section-title">{{ shift }}</p>
      <p class="divider" />
      <p class="room">{{ building }} {{ room }}</p>
      <p class="professor">{{ professor }}</p>
    </div>
    <div class="right-section">
      <p class="students-label">Número de alunos</p>
      <p class="students-count">{{ studentCount.current }} / {{ studentCount.total }}</p>
    </div>
    <div class="actions">
      <button class="icon-button" @click="onGearClassRoom">
        <ClassDetailsSettings :width="30" :height="30" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ClassDetailsSettings from '@/assets/icons/ClassDetailsSettings.vue'

export default defineComponent({
  name: 'ClassRoomInfo',
  components: {
    ClassDetailsSettings,
  },
  props: {
    shift: {
      type: String,
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    professor: {
      type: String,
      required: true,
    },
    studentCount: {
      type: Object as PropType<{ current: number; total: number }>,
      required: true,
    },
  },
  emits: ['classgear'],
  methods: {
    onGearClassRoom() {
      this.$emit('classgear')
    },
  },
})
</script>

<style scoped>
.classroom-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  position: relative;
}

.left-section {
  flex: 1;
}

.section-title {
  font-weight: 600;
  font-size: 1rem;
  display: inline-block;
}

.divider {
  width: 90%;
  height: 1px;
  background-color: #aed6df;
  margin: 8px 0;
}

.room,
.professor {
  font-size: 1rem;
  margin: 0.25rem 0;
}

.right-section {
  text-align: center;
  margin-right: 4rem;
}

.students-label {
  font-size: 0.75rem;
  font-weight: 300;
  color: #000;
}

.students-count {
  font-size: 1rem;
  font-weight: 500;
}

.actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>
