<template>
  <ConfirmPopup
    :title="exchange.title"
    :chainPop="chainPop"
    :onConfirm="onConfirm"
    @close="(cp: number) => onClose(cp)"
  >
    <template #content>
      <ClassRoomExchange
        :fromLabel="exchange.fromBuilding"
        :fromValue="exchange.fromCode"
        :toLabel="exchange.toBuilding"
        :toValue="exchange.toCode"
      />
    </template>
  </ConfirmPopup>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ConfirmPopup from './ConfirmPopup.vue'
import ClassRoomExchange from './ClassRoomExchange.vue'

export interface Exchange {
  title: string
  fromBuilding: string
  fromCode: number
  toBuilding: string
  toCode: number
}

export default defineComponent({
  name: 'ConfirmClassRoomExchangePopup',
  components: {
    ConfirmPopup,
    ClassRoomExchange,
  },
  props: {
    exchange: {
      type: Object as PropType<Exchange>,
      required: true,
    },
    chainPop: {
      type: Number,
      default: 1,
    },
  },
  emits: ['confirmed', 'close'],
  methods: {
    onClose(cp: number) {
      this.$emit('close', cp)
    },
    onConfirm() {
      this.$emit('confirmed')
    },
  },
})
</script>
