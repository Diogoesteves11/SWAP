<template>
  <button class="send-button">
    <ReplyIcon iconColor="#80BECC" />
    <p class="text">Responder</p>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReplyIcon from '@/assets/icons/ReplyIcon.vue'

export default defineComponent({
  name: 'SendButton',
  components: {
    ReplyIcon,
  },
})
</script>

<style scoped>
.send-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  height: 40px;
  flex-shrink: 0;
  padding: 0 12px;
  border-radius: 14px;
  border: 2px solid #80becc;
  background: rgba(217, 217, 217, 0);
  cursor: pointer;
  gap: 10px;
}

.text {
  color: #80becc;
  font-family: Jost;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
}
</style>
