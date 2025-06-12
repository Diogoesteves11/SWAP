<template>
  <NewMessageTemplate
    :userId="senderId"
    :initial-recipient="props.initialRecipient"
    :initial-subject="props.initialSubject"
    @send-new="handleSend"
  />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useMessagesStore } from '@/stores/messagesStore'
import { useUserInboxStore } from '@/stores/userInboxStore'
import { getIdByEmail } from '@/utils/emailTranslation'
import NewMessageTemplate from '@/components/templates/NewMessageTemplate.vue'

const route = useRoute()
const router = useRouter()
const messagesStore = useMessagesStore()
const inboxStore = useUserInboxStore()

const props = defineProps<{
  initialRecipient: string
  initialSubject: string
}>()

// static senderId for now
const senderId = Number(route.params.userId)

/**
 * Called when the template emits send-new:
 * { recipient, subject, content }
 */
async function handleSend({
  recipient,
  subject,
  content,
}: {
  recipient: string
  subject: string
  content: string
}) {
  const receiverId = await getIdByEmail(recipient)
  if (receiverId == null) {
    alert('Destinatário não encontrado')
    return
  }

  // 1) stage
  messagesStore.newMessage({
    type: 'text',
    senderId: senderId,
    receiverId: receiverId,
    subject: subject,
    content: content,
  })

  // 2) sync once & grab the real ID
  const [newId] = await messagesStore.syncChanges()
  if (!newId) {
    console.error('No newId returned after sync!')
    return
  }

  // 3) update sender’s sent
  await inboxStore.fetchInbox(senderId)
  console.log('before push, sender.sent =', inboxStore.sent)
  inboxStore.sent.push(newId)
  console.log('after push, sender.sent =', inboxStore.sent)
  await inboxStore.syncChanges()

  // 4) update recipient’s inbox
  await inboxStore.fetchInbox(receiverId)
  console.log('before push, receiver.inbox =', inboxStore.inbox)
  inboxStore.inbox.push(newId)
  console.log('after push, receiver.inbox =', inboxStore.inbox)
  await inboxStore.syncChanges()

  // 5) go back
  router.push(`/messages/${senderId}`)
}
</script>
