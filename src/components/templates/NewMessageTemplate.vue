<template>
  <NavBar />
  <div class="content">
    <SideBar :userId="userId" />
    <MessageBox
      :initial-recipient="initialRecipient"
      :initial-subject="initialSubject"
      @send="(payload) => $emit('send-new', payload)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/Sidebar.vue'
import MessageBox from '@/components/Messages/MessageBox.vue'

export default defineComponent({
  name: 'NewMessageTemplate',
  props: {
    initialRecipient: { type: String, default: '' },
    initialSubject: { type: String, default: '' },
    userId: { type: Number, required: true },
  },
  components: {
    NavBar,
    SideBar,
    MessageBox,
  },
  emits: ['send-new'],
  setup(props) {
    return toRefs(props)
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
