<template>
  <div class="title-main">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderTitle',
})
</script>

<style scoped>
.title-main {
  max-width: fit-content;
  position: relative;
  padding: 0.4rem 1.2rem;
  z-index: 1;
  margin-bottom: 24px;

  background-color: #80becc;
  color: white;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  text-align: center;
  box-shadow: 8px 8px 0 0 #d4e9ee;
}
</style>
