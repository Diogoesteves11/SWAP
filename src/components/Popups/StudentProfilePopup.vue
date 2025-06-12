<template>
  <InfoPopup :title="'Aluno'" @close="onClose">
    <template #content>
      <div class="profile-layout">
        <div class="avatar-placeholder">
          <StudentProfile height="80" width="70" />
        </div>

        <div class="profile-info">
          <div class="info-row" v-for="(value, label) in formattedInfo" :key="label">
            <span class="label">{{ label }}:</span>
            <p class="value">{{ value }}</p>
          </div>

          <NormalButton class="join-button" @click="onContact()"> Contactar </NormalButton>
        </div>
      </div>
    </template>
  </InfoPopup>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InfoPopup from './InfoPopup.vue'
import StudentProfile from '@/assets/icons/StudentProfile.vue'
import NormalButton from '../Buttons/NormalButton.vue'

export interface StudentProfile {
  name: string
  number: string
  status: boolean
  semester: number
}

export default defineComponent({
  name: 'StudentProfilePopup',
  components: {
    InfoPopup,
    StudentProfile,
    NormalButton,
  },
  props: {
    student: {
      type: Object as PropType<StudentProfile>,
      required: true,
    },
  },
  emits: ['close', 'contact'],
  methods: {
    onClose() {
      this.$emit('close')
    },
    onContact() {
      this.$emit('contact', this.student)
      this.onClose()
    },
  },
  computed: {
    formattedInfo() {
      return {
        Nome: this.student.name,
        Nº: this.student.number,
        Estatuto: this.student.status ? 'Sim' : 'Não',
        'Semestre Atual': this.student.semester,
      }
    },
  },
})
</script>

<style scoped>
.profile-layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.5rem;
}

.join-button {
  background-color: #80becc;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.join-button:not(:disabled):hover {
  background-color: #bfdbfe;
}

.avatar-placeholder {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  gap: 1rem;
}

.label {
  font-weight: 300;
}

.value {
  font-size: 1rem;
}
</style>
