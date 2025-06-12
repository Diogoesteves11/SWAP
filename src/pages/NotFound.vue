<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Oops! Esta página não existe.</p>
    <router-link class="home-btn" to="/"> Voltar </router-link>
  </div>
</template>

<script setup lang="ts">
// no extra logic needed here
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #333;
}

.not-found h1 {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.not-found p {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.home-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #80becc;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.home-btn:hover {
  transform: scale(1.05);
}
</style>
