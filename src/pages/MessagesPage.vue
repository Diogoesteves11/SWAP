<template>
  <MessagesTemplate
    :userId="userId"
    :messages="messages"
    :inbox="inbox"
    :sent="sent"
    :bin="bin"
    :selected-id="selectedId"
    :selected-message="selectedMessage"
    @select="handleSelect"
    @approve="handleApprove"
    @reject="handleReject"
    @delete="handleDelete"
    @restore="handleRestore"
    @reply="handleReply"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessagesStore } from '@/stores/messagesStore'
import { useUserInboxStore } from '@/stores/userInboxStore'
import MessagesTemplate from '@/components/templates/MessagesTemplate.vue'
import { getEmailById } from '@/utils/emailTranslation'
import { useAllocationStore } from '@/stores/allocationStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import type { ShiftMessage } from '@/types/Messages'

const route = useRoute()
const router = useRouter()

const userId = Number(route.params.userId)
const messagesStore = useMessagesStore()
const inboxStore = useUserInboxStore()
const allocationStore = useAllocationStore()
const scheduleStore = useScheduleStore()

const selectedId = ref<number | null>(null)

onMounted(async () => {
  await Promise.all([
    messagesStore.fetchMessages(),
    inboxStore.fetchInbox(userId),
    scheduleStore.fetchEvents(),
  ])
})

const messages = computed(() => messagesStore.messages)
const inbox = computed(() => inboxStore.inbox)
const sent = computed(() => inboxStore.sent)
const bin = computed(() => inboxStore.bin)

const selectedMessage = computed(() => {
  return messages.value.find((m) => m.id === selectedId.value) || null
})

function handleSelect(id: number) {
  selectedId.value = id
}

async function handleApprove(id: number) {
  // 1) approve the message + move out of inbox
  messagesStore.approveShift(id)
  inboxStore.markAsSent(id)
  await messagesStore.syncChanges()
  await inboxStore.syncChanges()

  // 2) update in-memory allocations
  const msg = messagesStore.getMessageById(id) as ShiftMessage
  const oldShiftId = msg.oldShiftId
  const newShiftId = msg.newShiftId

  const ev = scheduleStore.events.find((e) => e.shifts.some((s) => s.shiftId === newShiftId))
  if (ev) {
    // mark the new assignment
    allocationStore.upsertAllocation({
      courseId: ev.courseId,
      shiftId: newShiftId,
      changedFrom: false,
      changedTo: true,
    })

    // mark the old assignment for deletion
    if (oldShiftId >= 0) {
      allocationStore.upsertAllocation({
        courseId: ev.courseId,
        shiftId: oldShiftId, // ← real old shift ID
        changedFrom: true,
        changedTo: false,
      })
    }
  }

  // 3) tell the store which student to sync
  allocationStore.currentStudentId = Number(msg.senderId)

  // 4) persist to the backend
  await allocationStore.syncAllocations()
}

function handleReject(id: number) {
  messagesStore.rejectShift(id)
  inboxStore.markAsSent(id)

  messagesStore.syncChanges()
  inboxStore.syncChanges()
}

function handleDelete(id: number) {
  inboxStore.moveToBin(id)
  inboxStore.syncChanges()
}

function handleRestore(id: number) {
  inboxStore.restoreFromBin(id)
  inboxStore.syncChanges()
}

async function handleReply(id: number) {
  // 1) grab the original message
  const msg = messagesStore.getMessageById(id)
  if (!msg) return

  // 2) translate senderId → email
  const senderEmail = await getEmailById(msg.senderId)
  if (!senderEmail) {
    alert('Não consegui encontrar o email do remetente')
    return
  }

  // 3) navigate to NewMessagePage with query params
  router.push({
    path: `/messages/${msg.receiverId}/new-message`,
    query: {
      recipient: senderEmail,
      subject: `[RE] ${msg.subject}`,
    },
  })
}
</script>
