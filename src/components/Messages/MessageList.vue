<template>
  <div class="list">
    <!-- Cabeçalho -->
    <div class="header-row">
      <div class="header">Remetente</div>
      <div class="header">Número</div>
      <div class="header" style="text-align: left">Mensagem</div>
    </div>
    <!-- Mensagens -->
    <div v-for="message in inboxMessages" :key="message.id" class="msgs">
      <MessageItem
        :userId="userId"
        :message="message"
        :selected="message.id === selectedId"
        @select="(id) => $emit('select', id)"
        @approve="(id) => $emit('approve', id)"
        @reject="(id) => $emit('reject', id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import MessageItem from '@/components/Messages/MessageItem.vue'
import type { Message } from '@/types/Messages'

export default defineComponent({
  name: 'MessageBox',
  components: { MessageItem },
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
    inbox: {
      type: Array as PropType<number[]>,
      required: true,
    },
    selectedId: {
      type: Number as PropType<number | null>,
      required: false,
      default: null,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  emits: ['select', 'approve', 'reject'],
  setup(props) {
    const inboxMessages = computed(() =>
      props.messages.filter((msg) => props.inbox.includes(msg.id)),
    )

    return {
      inboxMessages,
    }
  },
})
</script>

<style scoped>
.list {
  width: 90%;
  min-width: 200px;
  max-width: 800px;
  padding-left: 20px;
  padding-top: 40px;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 20px 10px;
  grid-auto-rows: min-content;
}

/* Cabeçalho */
.header {
  font-weight: bold;
  color: black;
  text-align: center;
}

.header-row {
  display: contents;
}

.header-row::after {
  content: '';
  grid-column: 1 / -1;
  border-bottom: 2px solid #aed6df;
  padding-left: 10px;
}

.msgs > div {
  padding: 5px 0;
}

.msgs {
  display: contents;
}

.msgs::after {
  content: '';
  grid-column: 1 / -1; /* Estica da primeira à última coluna */
  border-bottom: 2px solid #aed6df;
}

.text-color {
  color: #80becc;
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-cell {
  display: flex;
  flex-direction: column;
  text-align: left;
}

/* Texto normal e subtexto */
.subtext {
  color: black;
  margin-top: 2px;
}

/* Turno automático */
.turno {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon {
  width: 25px;
  height: 20px;
  cursor: pointer;
  color: #80becc;
  transition: transform 0.2s;
}

.icon:hover {
  transform: scale(1.2);
}

.icon-selec {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
</style>
