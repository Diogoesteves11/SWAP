<template>
  <InfoPopup :title="title" :subtitle="subtitle" @close="onClose">
    <template #content>
      <div class="class-list">
        <ClassDetails
          v-for="(roomItem, index) in shifts"
          :key="index"
          :shift="roomItem.shift"
          :building="roomItem.building"
          :room="roomItem.code"
          :professor="roomItem.professor"
          :studentCount="roomItem.studentCount"
          @classgear="onGearClassRoom(roomItem)"
          @profgear="onGearProfessor(roomItem)"
        />
      </div>
    </template>
  </InfoPopup>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InfoPopup from './InfoPopup.vue'
import ClassDetails from './ClassDetails.vue'

export type RoomInfo = {
  shift: string
  building: string
  code: string
  professor: string
  studentCount: {
    current: number
    total: number
  }
}

export default defineComponent({
  name: 'ShiftDetailsUpdatePopup',
  components: {
    InfoPopup,
    ClassDetails,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    shifts: {
      type: Array as PropType<RoomInfo[]>,
      required: true,
    },
    chainPop: {
      type: Number,
      default: 1,
    },
  },
  emits: ['close', 'classgear', 'profgear'],
  methods: {
    onClose() {
      this.$emit('close', this.chainPop)
    },
    onGearClassRoom(roomItem: RoomInfo) {
      this.$emit('classgear', roomItem)
    },
    onGearProfessor(roomItem: RoomInfo) {
      this.$emit('profgear', roomItem)
    },
  },
})
</script>

<style scoped>
.class-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
