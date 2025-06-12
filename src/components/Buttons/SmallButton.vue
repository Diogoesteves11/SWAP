<template>
  <button class="small-btn">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SmallButton',
})
</script>

<style scoped>
.small-btn {
  /* Layout */
  padding: 0.1rem 1rem;

  /* Typography */
  color: #fff;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  /* Style */
  background-color: #6dc6da; /* Button background */
  border-radius: 4px;
  cursor: pointer;
}

.small-btn:hover {
  transform: scale(1.05);
}
</style>
