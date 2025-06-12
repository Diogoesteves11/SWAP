<template>
  <div class="card">
    <div class="header">
      <div class="avatar">
        <UserIcon />
      </div>
      <div class="info">
        <div class="name">{{ senderName }}</div>
        <div class="id">{{ message.senderId }}</div>
      </div>
    </div>

    <div class="content">
      <!-- Always show the subject -->
      <div class="title">{{ message.subject }}</div>

      <!-- Text message body -->
      <div v-if="isText(message)" class="message">
        {{ (message as TextMessage).content }}
      </div>

      <!-- Shift message details -->
      <div v-else-if="isShift(message)" class="shift-details">
        <span class="font-bold">{{ oldShiftName }}</span>

        <!-- color SwapIcon only when answered -->
        <SwapIcon
          class="swap-icon"
          v-bind="answered ? { style: { color: statusColor } } : { style: { color: '#80becc' } }"
        />

        <span class="font-bold">{{ newShiftName }}</span>
      </div>
    </div>

    <div class="actions">
      <!-- left side: trash or restore -->
      <template v-if="inBin">
        <RestoreIcon class="trash" @click="$emit('restore', message.id)" />
      </template>
      <template v-else>
        <TrashIcon class="trash" @click="$emit('delete', message.id)" />
      </template>

      <!-- right side: reply or approve/reject -->
      <div class="actions-end">
        <template v-if="isText(message)">
          <ReplyButton class="button" @click="$emit('reply', message.id)" />
        </template>
        <template v-else-if="isShift(message) && !isStudent">
          <CheckIcon
            class="icon"
            :class="{ disabled: answered }"
            v-bind="answered ? { style: { color: statusColor } } : { style: { color: '#80BECC' } }"
            :iconColor="answered ? statusColor : '#80BECC'"
            @click.stop="onApprove"
          />
          <XIcon
            class="icon"
            :class="{ disabled: answered }"
            v-bind="answered ? { style: { color: statusColor } } : { style: { color: '#80BECC' } }"
            :iconColor="answered ? statusColor : '#80BECC'"
            @click.stop="onReject"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import UserIcon from '@/assets/icons/UserIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import RestoreIcon from '@/assets/icons/RestoreIcon.vue'
import ReplyButton from '@/components/Buttons/ReplyButton.vue'
import SwapIcon from '@/assets/icons/SwapIcon.vue'
import CheckIcon from '@/assets/icons/CheckIcon.vue'
import XIcon from '@/assets/icons/XIcon.vue'
import { getShiftNameById } from '@/utils/shiftTranslation'
import { isStudentId } from '@/utils/studentUtils'
import { useUserName } from '@/composables/useUserName'
import type { Message, TextMessage, ShiftMessage } from '@/types/Messages'

export default defineComponent({
  name: 'MessagePreview',
  components: {
    UserIcon,
    TrashIcon,
    RestoreIcon,
    ReplyButton,
    SwapIcon,
    CheckIcon,
    XIcon,
  },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    inBin: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  emits: ['reply', 'approve', 'reject', 'delete', 'restore'],
  setup(props, { emit }) {
    const senderName = useUserName(() => props.message.senderId)

    function isText(msg: Message): msg is TextMessage {
      return msg.type === 'text'
    }
    function isShift(msg: Message): msg is ShiftMessage {
      return msg.type === 'shift'
    }

    const oldShiftName = computed(() => {
      if (!isShift(props.message)) return ''
      return getShiftNameById(props.message.oldShiftId) ?? `#${props.message.oldShiftId}`
    })
    const newShiftName = computed(() => {
      if (!isShift(props.message)) return ''
      return getShiftNameById(props.message.newShiftId) ?? `#${props.message.newShiftId}`
    })

    // shift‐message answered status & color
    const answered = computed(() => isShift(props.message) && props.message.accepted !== null)
    const statusColor = computed(() => {
      if (!isShift(props.message) || props.message.accepted === null) return ''
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
      isText,
      isShift,
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
.card {
  width: 50%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 40px;
  align-self: flex-start;
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  background: #d5eaf0;
  border-radius: 50%;
  padding: 10px;
  display: flex;
}
.avatar svg {
  width: 35px;
  height: 35px;
  color: white;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.name {
  color: #80becc;
  font-weight: bold;
  font-size: 16px;
}
.id {
  color: #aed6df;
  font-size: 14px;
}

.content {
  width: 100%;
  text-align: left;
}
.title {
  color: #80becc;
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 5px;
}
.message {
  color: black;
  font-size: 16px;
  line-height: 1.4;
}
.shift-details p {
  margin: 4px 0;
}

.shift-details {
  display: flex;
  align-items: center;
  gap: 5px;
}

.actions {
  display: flex;
  align-items: center;
}

/* trash & restore share the same look */
.trash {
  color: #80becc;
  width: 20px;
  height: 20px;
  transition:
    transform 0.2s,
    color 0.2s;
}
.trash:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.actions-end {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.button:hover {
  transform: scale(0.9);
}

.icon {
  width: 25px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}
.icon.disabled {
  pointer-events: none;
  opacity: 0.4;
}
.icon:hover:not(.disabled) {
  transform: scale(1.2);
}
</style>
