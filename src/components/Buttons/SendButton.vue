<template>
  <button class="send-button">
    <p class="text">Enviar</p>
    <SendIcon iconColor="#80BECC" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SendIcon from '@/assets/icons/SendIcon.vue'

export default defineComponent({
  name: 'SendButton',
  components: {
    SendIcon,
  },
})
</script>

<style scoped>
.send-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  height: 40px;
  flex-shrink: 0;
  padding: 0 12px;
  border-radius: 14px;
  border: 2px solid #80becc;
  background: rgba(217, 217, 217, 0);
  cursor: pointer;
}

.text {
  color: #80becc;
  font-family: Jost;
  font-size: 20px;
  font-weight: 400;
  margin: 0;
}
</style>
