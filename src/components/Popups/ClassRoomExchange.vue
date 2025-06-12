<template>
  <div class="exchange-container">
    <p class="exchange-title">Troca</p>
    <div class="exchange-values">
      <p class="value-from">{{ fromLabel }} {{ fromValue.toFixed(2) }}</p>
      <div class="exchange-arrow">
        <ChangeIcon :width="30" :height="30" />
      </div>
      <p class="value-to">{{ toLabel }} {{ toValue.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import ChangeIcon from '@/assets/icons/ChangeIcon.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ClassRoomExchange',
  components: {
    ChangeIcon,
  },
  props: {
    fromLabel: {
      type: String,
      required: true,
    },
    fromValue: {
      type: Number,
      required: true,
    },
    toLabel: {
      type: String,
      required: true,
    },
    toValue: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped>
.exchange-container {
  padding: 1rem;
}

.exchange-title {
  border-bottom: 1px solid;
  width: fit-content;
  padding-bottom: 0.25rem;
  margin-bottom: 0.5rem;
}

.exchange-values {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.value-from,
.value-to {
  white-space: nowrap;
}

.exchange-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
</style>
