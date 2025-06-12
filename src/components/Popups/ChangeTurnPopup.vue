<template>
  <InfoPopup :title="'TP'" @close="(cp: number) => onClose(cp)">
    <template #content>
      <div class="turn-layout">
        <div class="current-turn-display">
          <p>{{ currentTurn?.name || 'N/A' }}</p>
          <ChangeIcon height="30" color="#fff" />
        </div>

        <div class="turn-table-container">
          <table class="turn-table">
            <thead>
              <tr>
                <th>Turno</th>
                <th>Número de alunos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="turn in turns" :key="turn.name" :class="{ 'current-turn': turn.current }">
                <td>
                  <p class="thin-text">{{ turn.name }}</p>
                </td>
                <td>
                  <p class="thin-text">{{ turn.students }}/{{ turn.capacity }}</p>
                </td>
                <td>
                  <NormalButton class="join-button" :disabled="turn.current" @click="onJoin(turn)">
                    Aderir
                  </NormalButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </InfoPopup>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InfoPopup from './InfoPopup.vue'
import ChangeIcon from '@/assets/icons/ChangeIcon.vue'
import NormalButton from '../Buttons/NormalButton.vue'

export interface Turn {
  name: string
  current: boolean
  students: number
  capacity: number
}

export default defineComponent({
  name: 'ChangeTurnPopup',
  components: {
    InfoPopup,
    ChangeIcon,
    NormalButton,
  },
  props: {
    turns: {
      type: Array as PropType<Turn[]>,
      required: true,
    },
  },
  emits: ['close', 'join', 'joinfull'],
  methods: {
    onClose(cp: number) {
      this.$emit('close', cp)
    },
    onJoin(turn: Turn) {
      if (turn.capacity <= turn.students) {
        this.$emit('joinfull', turn)
      } else {
        this.$emit('join', turn)
        this.$emit('close')
      }
    },
  },
  computed: {
    currentTurn(): Turn | undefined {
      return this.turns.find((t) => t.current)
    },
  },
})
</script>

<style scoped>
.thin-text {
  font-size: 18px;
  font-weight: 400;
}

.turn-layout {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1rem;
}

.current-turn-display {
  display: flex;
  flex-direction: row;
  align-items: left;
  gap: 2rem;
}

.turn-table-container {
  flex: 1;
}

.turn-table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.turn-table td {
  padding: 0.5rem 0.75rem;
}

.turn-table th {
  font-weight: 100;
}

.current-turn {
  color: #60a5fa;
  font-weight: 600;
}

.join-button {
  background-color: #80becc;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.join-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.join-button:not(:disabled):hover {
  background-color: #bfdbfe;
}
</style>
