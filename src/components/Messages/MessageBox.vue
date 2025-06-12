<template>
  <div class="box-container">
    <div class="msg-header">
      <div class="subject-form">
        <label class="label" for="username">Para:</label>
        <input id="username" v-model="recipient" class="input" type="text" />
      </div>
      <div class="line"></div>
      <div class="subject-form">
        <label class="label" for="subject">Assunto:</label>
        <input id="subject" v-model="subject" class="input" type="text" />
      </div>
      <div class="line"></div>
      <textarea
        aria-label="Mensagem de texto"
        v-model="message"
        class="message"
        placeholder="(Escreva aqui a sua mensagem)"
      ></textarea>
    </div>
    <SendButton class="button" @click="$emit('send', { recipient, subject, content: message })">
      Enviar
    </SendButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import SendButton from '@/components/Buttons/SendButton.vue'

export default defineComponent({
  name: 'MessageBox',
  components: { SendButton },
  props: {
    initialRecipient: { type: String, default: '' },
    initialSubject: { type: String, default: '' },
  },
  emits: ['send'],
  setup(props, { emit }) {
    // pull them out
    const { initialRecipient, initialSubject } = toRefs(props)

    // initialize your v-models with the props
    const recipient = ref(initialRecipient.value)
    const subject = ref(initialSubject.value)
    const message = ref('')

    return { recipient, subject, message, emit }
  },
})
</script>

<style scoped>
.box-container {
  display: flex;
  flex-direction: column;
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  max-width: 1000px;
  min-width: 700px;
  margin: 40px 40px;

  padding: 26px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  background: #fff;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  justify-content: flex-start;
}

.msg-header {
  display: flex;
  flex-direction: column;
  width: calc(100% - 30px);
  height: calc(100% - 10px);
  gap: 6px;
  padding-left: 10px;
}

.subject-form {
  display: flex;
  flex-direction: row; /* texto + input na mesma linha */
  align-items: center;
  max-width: 600px;
}

.label {
  color: #80becc;
  font-size: 22px;
  font-weight: 600;
  width: 110px;
}

.input {
  border: none;
  color: #000;
  width: 100%;
  margin-left: 12px;

  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.message {
  width: 100%;
  height: 100%;
  min-height: 150px;
  max-height: 90%;
  border: none;
  outline: none;
  overflow-y: auto;
  resize: none;

  color: #000;
  font-size: 22px;
  font-weight: 200;
  padding: 8px;
  box-sizing: border-box;
}

.line {
  width: 600px;
  height: 2px;
  background:
    linear-gradient(0deg, #aed6df 0%, #aed6df 100%),
    linear-gradient(0deg, #aed6df 0%, #aed6df 100%),
    linear-gradient(0deg, #aed6df 0%, #aed6df 100%), #aed6df;
}

.x-icon {
  align-self: flex-end;
}

.x-icon:hover {
  transform: scale(0.9);
}

.button {
  align-self: flex-end;
}

.button:hover {
  transform: scale(0.9);
}
</style>
