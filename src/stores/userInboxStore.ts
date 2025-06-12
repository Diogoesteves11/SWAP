// src/stores/userInboxStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInbox } from '@/types/Messages'

export const useUserInboxStore = defineStore('userInbox', () => {
  // this is both the record PK and your user’s ID
  const id = ref<number | null>(null)
  const inbox = ref<number[]>([])
  const sent = ref<number[]>([])
  const bin = ref<number[]>([])

  /**
   * Load the inbox pointers for this user ID (which is also the record ID).
   */
  async function fetchInbox(userId: number) {
    try {
      const res = await fetch(`http://localhost:3000/userInbox/${userId}`)
      if (!res.ok) throw new Error(`Inbox fetch failed: ${res.status}`)
      const entry: UserInbox = await res.json()

      id.value = entry.id
      // filter out any nulls that snuck in
      inbox.value = entry.inbox.filter((x): x is number => x != null)
      sent.value = entry.sent
      bin.value = entry.bin
    } catch (e) {
      console.error('Error loading userInbox:', e)
      id.value = null
      inbox.value = []
      sent.value = []
      bin.value = []
    }
  }

  function markAsSent(messageId: number) {
    inbox.value = inbox.value.filter((i) => i !== messageId)
    sent.value.push(messageId)
  }

  function moveToBin(messageId: number) {
    inbox.value = inbox.value.filter((i) => i !== messageId)
    sent.value = sent.value.filter((i) => i !== messageId)
    bin.value.push(messageId)
  }

  function restoreFromBin(messageId: number) {
    bin.value = bin.value.filter((i) => i !== messageId)
    inbox.value.push(messageId)
  }

  function clearInbox() {
    id.value = null
    inbox.value = []
    sent.value = []
    bin.value = []
  }

  /**
   * Persist local inbox/sent/bin arrays back to the server.
   */
  async function syncChanges() {
    if (id.value == null) {
      throw new Error('No userInbox ID loaded to sync')
    }
    const payload = {
      inbox: inbox.value,
      sent: sent.value,
      bin: bin.value,
    }
    const res = await fetch(`http://localhost:3000/userInbox/${id.value}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error(`Failed to sync userInbox: ${res.status}`)
    }
  }

  return {
    id,
    inbox,
    sent,
    bin,
    fetchInbox,
    markAsSent,
    moveToBin,
    restoreFromBin,
    clearInbox,
    syncChanges,
  }
})
