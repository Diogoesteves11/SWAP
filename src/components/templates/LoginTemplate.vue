<template>
  <div class="login">
    <div class="background">
      <div class="tilted bg-1"></div>
      <div class="tilted bg-2"></div>
      <div class="tilted bg-3"></div>
    </div>

    <div class="login-box">
      <h1 class="title">Login</h1>

      <UserInput
        id="username"
        :modelValue="username"
        @update:modelValue="$emit('update:username', $event)"
        label="User:"
        placeholder="ID do Utilizador"
      />

      <UserInput
        id="password"
        type="password"
        :modelValue="password"
        @update:modelValue="$emit('update:password', $event)"
        label="Password:"
        placeholder="Password"
      />

      <div class="btn-align">
        <NormalButton @click="$emit('submit')">Entrar</NormalButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserInput from '@/components/UserInput.vue'
import NormalButton from '@/components/Buttons/NormalButton.vue'

export default defineComponent({
  name: 'LoginTemplate',
  components: {
    UserInput,
    NormalButton,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
})
</script>

<style scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-33deg);
  display: flex;
  gap: 40px; /* Always 50px between rectangles */
  pointer-events: none;
}

.tilted {
  /* dimensions */
  width: 30vw;
  min-width: 430px;
  height: 90vh;
  min-height: 493px;
  border-radius: 20px;
  flex-shrink: 0; /* Prevent shrinking in flex layout */
}

.bg-1 {
  background: #d4e9ee;
}

.bg-2 {
  background: #aed6df;
}

.bg-3 {
  background: #d4e9ee;
}

.login-box {
  position: relative;
  z-index: 2;
  background: transparent;
  padding: 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 64px;
  color: #ffffff;
  margin-bottom: 30px;
}

.label {
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 5px;
  align-self: flex-start;
}

.btn-align {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
