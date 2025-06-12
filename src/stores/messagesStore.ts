import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message, TextMessage, ShiftMessage } from '@/types/Messages'

/** Minimal shape to create a new text message */
type NewTextMessage = Omit<TextMessage, 'id'>

export const useMessagesStore = defineStore('messages', () => {
  // ─── State ──────────────────────────────────────────────────────────────
  const messages = ref<Message[]>([])
  const pendingApprovals = ref<number[]>([])
  const pendingRejections = ref<number[]>([])
  const pendingNew = ref<NewTextMessage[]>([])
  const pendingNewShifts = ref<Omit<ShiftMessage, 'id' | 'accepted' | 'type'>[]>([])

  // ─── Fetch ──────────────────────────────────────────────────────────────
  async function fetchMessages() {
    try {
      const res = await fetch('http://localhost:3000/messages')
      if (!res.ok) throw new Error(`Messages fetch failed: ${res.status}`)
      messages.value = await res.json()
    } catch (err) {
      console.error('Error loading messages:', err)
      messages.value = []
    }
  }

  function clearMessages() {
    messages.value = []
    pendingApprovals.value.length = 0
    pendingRejections.value.length = 0
    pendingNew.value.length = 0
  }

  // ─── Helpers ────────────────────────────────────────────────────────────
  const getMessageById = (id: number) => messages.value.find((m) => m.id === id)

  // ─── Actions ────────────────────────────────────────────────────────────

  /** Mark a shift‐message approved locally & queue for sync */
  function approveShift(messageId: number) {
    const msg = getMessageById(messageId) as ShiftMessage | undefined
    if (msg && msg.type === 'shift') {
      msg.accepted = true
      // remove from reject queue if present
      pendingRejections.value = pendingRejections.value.filter((id) => id !== messageId)
      if (!pendingApprovals.value.includes(messageId)) {
        pendingApprovals.value.push(messageId)
      }
    }
  }

  /** Mark a shift‐message rejected locally & queue for sync */
  function rejectShift(messageId: number) {
    const msg = getMessageById(messageId) as ShiftMessage | undefined
    if (msg && msg.type === 'shift') {
      msg.accepted = false
      pendingApprovals.value = pendingApprovals.value.filter((id) => id !== messageId)
      if (!pendingRejections.value.includes(messageId)) {
        pendingRejections.value.push(messageId)
      }
    }
  }

  /**
   * Stage a new text message for send.
   * We'll assign a temporary negative ID locally.
   */
  function newMessage(payload: NewTextMessage) {
    const tempId = Date.now() * -1
    const newMsg: TextMessage = {
      ...payload,
      type: 'text',
      id: tempId,
    }
    messages.value.unshift(newMsg)
    pendingNew.value.push(payload)
  }

  function newShiftMessage(payload: Omit<ShiftMessage, 'id' | 'accepted' | 'type'>) {
    const tempId = Date.now() * -1
    const newMsg: ShiftMessage = {
      ...payload,
      type: 'shift',
      id: tempId,
      accepted: null,
    }
    messages.value.unshift(newMsg)
    pendingNewShifts.value.push(payload)
  }

  /**
   * Sync all staged changes with the backend:
   *  • PATCH shift messages for approvals/rejections
   *  • POST new text messages
   * Afterwards, re‐fetch messages to get real IDs & clear queues.
   */
  async function syncChanges(): Promise<number[]> {
    // 1) handle rejects
    for (const mid of pendingRejections.value) {
      await fetch(`http://localhost:3000/messages/${mid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: false }),
      })
    }
    // 2) handle approves
    for (const mid of pendingApprovals.value) {
      await fetch(`http://localhost:3000/messages/${mid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true }),
      })
    }
    // 3) handle new messages
    const createdIds: number[] = []
    for (const payload of pendingNew.value) {
      // build a full TextMessage-ish body
      const body = {
        ...payload,
        type: 'text',
      }
      const res = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Failed to POST new message: ${res.status}`)
      const created: TextMessage = await res.json()
      createdIds.push(created.id) // capture the real id
    }
    for (const payload of pendingNewShifts.value) {
      const res = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type: 'shift', accepted: null }),
      })
      if (!res.ok) throw new Error(`Failed to POST shift message: ${res.status}`)
      const created: ShiftMessage = await res.json()
      createdIds.push(created.id)
    }
    // 4) clear and reload
    pendingApprovals.value.length = 0
    pendingRejections.value.length = 0
    pendingNew.value.length = 0
    pendingNewShifts.value.length = 0
    await fetchMessages()

    return createdIds
  }

  return {
    // state
    messages,
    pendingApprovals,
    pendingRejections,
    pendingNew,
    pendingNewShifts,
    // actions
    fetchMessages,
    clearMessages,
    approveShift,
    rejectShift,
    newMessage,
    newShiftMessage,
    syncChanges,
    // getters
    getMessageById,
  }
})
