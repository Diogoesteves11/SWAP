<template>
  <NavBar />
  <div class="content">
    <SideBar :userId="userId" @changeView="selectedView = $event" />

    <!-- Conditional MessageList rendering -->
    <MessageList
      v-if="selectedView === 'inbox'"
      :userId="userId"
      :messages="messages"
      :inbox="inbox"
      :selected-id="selectedId"
      @select="$emit('select', $event)"
      @approve="$emit('approve', $event)"
      @reject="$emit('reject', $event)"
    />

    <MessageList
      v-else-if="selectedView === 'sent'"
      :userId="userId"
      :messages="messages"
      :inbox="sent"
      :selected-id="selectedId"
      @select="$emit('select', $event)"
      @approve="$emit('approve', $event)"
      @reject="$emit('reject', $event)"
    />

    <MessageList
      v-else-if="selectedView === 'bin'"
      :userId="userId"
      :messages="messages"
      :inbox="bin"
      :selected-id="selectedId"
      @select="$emit('select', $event)"
      @approve="$emit('approve', $event)"
      @reject="$emit('reject', $event)"
    />

    <MessagePreview
      v-if="selectedMessage"
      :userId="userId"
      :message="selectedMessage"
      :in-bin="selectedView === 'bin'"
      @reply="(id) => $emit('reply', id)"
      @approve="(id) => $emit('approve', id)"
      @reject="(id) => $emit('reject', id)"
      @delete="(id) => $emit('delete', id)"
      @restore="(id) => $emit('restore', id)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/Sidebar.vue'
import MessageList from '@/components/Messages/MessageList.vue'
import MessagePreview from '@/components/Messages/MessagePreview.vue'
import type { Message } from '@/types/Messages'

export default defineComponent({
  name: 'MessagesTemplate',
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
    inbox: {
      type: Array as PropType<number[]>,
      required: true,
    },
    sent: {
      type: Array as PropType<number[]>,
      required: true,
    },
    bin: {
      type: Array as PropType<number[]>,
      required: true,
    },
    selectedId: {
      type: Number as PropType<number | null>,
      default: null,
    },
    selectedMessage: {
      type: Object as PropType<Message | null>,
      default: null,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  emits: ['select', 'approve', 'reject', 'delete', 'restore', 'reply'],
  components: {
    NavBar,
    SideBar,
    MessageList,
    MessagePreview,
  },
  setup() {
    const selectedView = ref<'inbox' | 'sent' | 'bin'>('inbox')
    return { selectedView }
  },
})
</script>

<style scoped>
.content {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}
</style>
