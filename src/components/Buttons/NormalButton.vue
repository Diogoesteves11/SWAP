<template>
  <button class="btn-atom">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NormalButton',
})
</script>

<style scoped>
.btn-atom {
  /* Layout */
  padding: 0.15rem 1.5rem;

  /* Typography */
  color: #80becc;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  /* Style */
  background-color: #fff; /* Button background */
  border: 2px solid #ffffff00;
  border-radius: 4px;
  background: #fff;
  box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.btn-atom:hover {
  border-color: #80becc;
}
</style>
