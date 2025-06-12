<template>
  <InfoPopup :title="title" :disableReturn="false" :subtitle="subtitle" @close="onClose">
    <template #content>
      <div class="summary-container">
        <div class="top">
          <div class="header-row">
            <p class="title">{{ shift }}</p>
            <div>
              <div class="label">Número de alunos</div>
              <p class="value">{{ studentCount.current }}/{{ studentCount.total }}</p>
            </div>
          </div>

          <p class="main-room">
            {{ currentBuilding }} <span>{{ currentCode }}</span>
          </p>

          <div class="available-rooms">
            <div class="header-row">
              <div class="section-title">Salas Disponíveis</div>
              <div class="section-title">Capacidade</div>
            </div>
            <div class="room-list">
              <div v-for="(roomItem, index) in availableRooms" :key="index" class="room-line full">
                <p class="room-name">{{ roomItem.building }} {{ roomItem.code }}</p>
                <div class="capacity-group">
                  <p class="capacity">{{ roomItem.capacity }}</p>
                  <button class="swap-btn" @click="onSwap(roomItem)">
                    <ChangeIcon height="20" color="#fff" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </InfoPopup>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InfoPopup from './InfoPopup.vue'
import ChangeIcon from '@/assets/icons/ChangeIcon.vue'

export interface RoomSmallInfo {
  building: string
  code: string
  capacity: number
}

export default defineComponent({
  name: 'ClassRoomExchangePopup',
  components: {
    InfoPopup,
    ChangeIcon,
  },
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    shift: { type: String, required: true },
    currentBuilding: { type: String, required: true },
    currentCode: { type: String, required: true },
    studentCount: {
      type: Object as PropType<{ current: number; total: number }>,
      required: true,
    },
    chainPop: { type: Number, default: 1 },
    availableRooms: {
      type: Array as PropType<RoomSmallInfo[]>,
      required: true,
    },
  },
  emits: ['close', 'swap'],
  methods: {
    onClose() {
      this.$emit('close', this.chainPop)
    },
    onSwap(roomItem: RoomSmallInfo) {
      this.$emit('swap', roomItem)
    },
  },
})
</script>

<style scoped>
.summary-container {
  padding: 0.5rem 1.5rem;
}

.top {
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 7rem;
}

.title {
  border-bottom: 2px solid #80becc;
  font-weight: 500;
  font-size: 1.1rem;
  width: fit-content;
}

.main-room {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.label {
  margin-top: 2rem;
  font-weight: 300;
  font-size: 0.85rem;
}

.value {
  font-size: 1.2rem;
}

.available-rooms {
  flex: 1;
  min-width: 220px;
}

.section-title {
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.room-list {
  display: flex;
  flex-direction: column;
}

.room-line.full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  font-size: 1rem;
}

.room-name {
  font-size: 1rem;
  font-weight: 500;
}

.capacity-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.capacity {
  font-weight: 500;
  font-size: 1rem;
}

.swap-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #80becc;
}

.swap-btn:hover {
  opacity: 0.7;
}
</style>
