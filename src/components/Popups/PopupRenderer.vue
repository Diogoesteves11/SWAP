<template>
  <Teleport to="body">
    <div v-for="(popup, index) in popupManager.popups" :key="index">
      <component
        :is="popupComponents[popup.name]"
        v-bind="popup.props"
        v-on="popup.events"
        @close="(count = 1) => popupManager.closeCount(count)"
      />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { usePopupManager } from '@/stores/popupManager'
import ConfirmPopup from './ConfirmPopup.vue'
import ConfirmClassRoomExchangePopup from './ConfirmClassRoomExchangePopup.vue'
import ShiftDetailsUpdatePopup from './ShiftDetailsUpdatePopup.vue'
import ClassRoomExchangePopup from './ClassRoomExchangePopup.vue'
import ConfirmDividedMessagePopup from './ConfirmDividedMessagePopup.vue'
import ChangeTurnPopup from './ChangeTurnPopup.vue'
import StudentProfilePopup from './StudentProfilePopup.vue'

const popupManager = usePopupManager()

const popupComponents = {
  'confirm-popup': ConfirmPopup,
  'shift-details-update-popup': ShiftDetailsUpdatePopup,
  'class-room-exchange-popup': ClassRoomExchangePopup,
  'confirm-class-room-exchange-popup': ConfirmClassRoomExchangePopup,
  'confirm-divided-message-popup': ConfirmDividedMessagePopup,
  'change-turn-popup': ChangeTurnPopup,
  'student-profile-popup': StudentProfilePopup,
}
</script>
