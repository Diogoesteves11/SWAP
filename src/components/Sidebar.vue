<template>
  <aside class="sidebar">
    <button class="menu-item" @click="handleView('inbox')">
      <MessageIcon width="30" height="30" icon-color="#80BECC" />
      <span class="label">Caixa de Entrada</span>
    </button>

    <button class="menu-item" @click="handleView('sent')">
      <SendIcon width="25" height="25" icon-color="#80BECC" />
      <span class="label">Itens Enviados</span>
    </button>

    <button class="menu-item" @click="handleView('bin')">
      <TrashIcon width="23" height="23" icon-color="#80BECC" />
      <span class="label">Lixo</span>
    </button>

    <button class="menu-item new-msg" @click="handleNew()">
      <EditIcon width="25" height="25" icon-color="#80BECC" />
      <span class="label">Nova Mensagem</span>
    </button>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MessageIcon from '@/assets/icons/MessageIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import EditIcon from '@/assets/icons/EditIcon.vue'
import SendIcon from '@/assets/icons/SendIcon.vue'

export default defineComponent({
  name: 'SideBar',
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  components: { MessageIcon, TrashIcon, EditIcon, SendIcon },
  emits: ['changeView'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()

    function handleView(view: 'inbox' | 'sent' | 'bin') {
      // if you’re on “new message”, go back to /messages first
      if (route.path.endsWith('/new-message')) {
        router.push(`/messages/${props.userId}`)
      }
      // tell parent which view to activate
      emit('changeView', view)
    }

    function handleNew() {
      router.push(`/messages/${props.userId}/new-message`)
    }

    return { handleView, handleNew }
  },
})
</script>

<style scoped>
.sidebar {
  width: 18rem;
  height: 100vh;
  background: #fff;
  padding: 1rem;
  border-right: 2px solid #b9dfe8;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0;
  cursor: pointer;
  color: #80becc;
  font-size: 1rem;
}

.new-msg {
  border-top: 2px solid #b9dfe8;
  padding-top: 24px;
}

.menu-item:hover {
  font-weight: 500;
}

.menu-item .label {
  margin-left: 0.75rem;
  text-align: left;
}
</style>
