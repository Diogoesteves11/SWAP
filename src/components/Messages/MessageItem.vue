<template>
  <div class="message-item" :class="{ selected }" @click="$emit('select', message.id)">
    <!-- sender and id -->
    <div class="text-color" :class="{ 'font-bold': selected }">
      {{ senderName }}
    </div>
    <div class="text-color" :class="{ 'font-bold': selected }">
      {{ message.senderId }}
    </div>

    <!-- main cell -->
    <div class="message-cell">
      <div class="message-title" :class="{ 'font-bold': selected }">
        {{ message.subject }}
      </div>

      <div v-if="isTextMessage(message)" class="subtext">
        {{ message.content }}
      </div>

      <div v-else-if="isShiftMessage(message)" class="turno">
        <span class="font-bold">{{ oldShiftName }}</span>
        <!-- SwapIcon is colored once answered -->
        <SwapIcon
          class="icon"
          v-bind="answered ? { style: { color: statusColor } } : { style: { color: '#80becc' } }"
        />
        <span class="font-bold">{{ newShiftName }}</span>

        <div v-if="!isStudent" class="icon-selec">
          <CheckIcon
            class="icon"
            :class="{ disabled: answered }"
            v-bind="answered ? { style: { color: statusColor } } : { style: { color: '#80becc' } }"
            @click.stop="onApprove"
          />
          <XIcon
            class="icon"
            :class="{ disabled: answered }"
            v-bind="answered ? { style: { color: statusColor } } : { style: { color: '#80becc' } }"
            @click.stop="onReject"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import SwapIcon from '@/assets/icons/SwapIcon.vue'
import CheckIcon from '@/assets/icons/CheckIcon.vue'
import XIcon from '@/assets/icons/XIcon.vue'
import { getShiftNameById } from '@/utils/shiftTranslation'
import { isStudentId } from '@/utils/studentUtils'
import { useUserName } from '@/composables/useUserName'
import type { Message, TextMessage, ShiftMessage } from '@/types/Messages'

export default defineComponent({
  name: 'MessageItem',
  components: { SwapIcon, CheckIcon, XIcon },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  emits: ['select', 'approve', 'reject'],
  setup(props, { emit }) {
    const senderName = useUserName(() => props.message.senderId)

    function isTextMessage(msg: Message): msg is TextMessage {
      return msg.type === 'text'
    }
    function isShiftMessage(msg: Message): msg is ShiftMessage {
      return msg.type === 'shift'
    }

    const oldShiftName = computed(() => {
      if (!isShiftMessage(props.message)) return ''
      return getShiftNameById(props.message.oldShiftId) ?? `#${props.message.oldShiftId}`
    })
    const newShiftName = computed(() => {
      if (!isShiftMessage(props.message)) return ''
      return getShiftNameById(props.message.newShiftId) ?? `#${props.message.newShiftId}`
    })

    // for shift messages only
    const answered = computed(() => {
      if (!isShiftMessage(props.message)) return false
      return props.message.accepted !== null
    })
    const statusColor = computed(() => {
      if (!isShiftMessage(props.message) || props.message.accepted === null) {
        return ''
      }
      return props.message.accepted ? '#C5EDC5' : '#FFA4A4'
    })

    const isStudent = computed(() => isStudentId(Number(props.userId)))

    function onApprove() {
      if (!answered.value) {
        emit('approve', (props.message as ShiftMessage).id)
      }
    }
    function onReject() {
      if (!answered.value) {
        emit('reject', (props.message as ShiftMessage).id)
      }
    }

    return {
      senderName,
      isTextMessage,
      isShiftMessage,
      isStudent,
      answered,
      statusColor,
      onApprove,
      onReject,
      oldShiftName,
      newShiftName,
    }
  },
})
</script>

<style scoped>
.message-item {
  display: contents;
  cursor: pointer;
}
.selected .text-color,
.selected .message-cell > div {
  font-weight: 500;
}
.text-color {
  color: #80becc;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.message-cell {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.message-title {
  color: #80becc;
}
.subtext {
  color: #000;
  margin-top: 2px;
}
.turno {
  display: flex;
  align-items: center;
  gap: 5px;
}
.icon {
  width: 25px;
  height: 20px;
  transition: transform 0.2s;
  cursor: pointer;
}
/* disabled state blocks clicks & dims icon */
.icon.disabled {
  pointer-events: none;
  opacity: 0.4;
}
.icon-selec {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
</style>
