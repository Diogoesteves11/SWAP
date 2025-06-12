import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Turn } from '@/components/Popups/ChangeTurnPopup.vue'
import type { RoomInfo } from '@/components/Popups/ShiftDetailsUpdatePopup.vue'
import type { RoomSmallInfo } from '@/components/Popups/ClassRoomExchangePopup.vue'
import type { StudentProfile } from '@/components/Popups/StudentProfilePopup.vue'
import type { Exchange } from '@/components/Popups/ConfirmClassRoomExchangePopup.vue'

export type PopupPropsMap = {
  'change-turn-popup': {
    turns: Turn[]
  }
  'confirm-divided-message-popup': {
    upperText: string
    bottomText: string
    chainPop?: number
  }
  'shift-details-update-popup': {
    title: string
    subtitle?: string
    shifts: RoomInfo[]
    chainPop?: number
  }
  'confirm-class-room-exchange-popup': {
    exchange: Exchange
    chainPop?: number
  }
  'class-room-exchange-popup': {
    title: string
    subtitle?: string
    shift: string
    currentBuilding: string
    currentCode: string
    studentCount: {
      current: number
      total: number
    }
    availableRooms: RoomSmallInfo[]
  }
  'confirm-popup': {
    message?: string
    chainPop?: number
  }
  'student-profile-popup': {
    student: StudentProfile
  }
}

export type PopupEventsMap = {
  'change-turn-popup': {
    join: (arg0: Turn) => void
    joinfull: (arg0: Turn) => void
  }
  'confirm-divided-message-popup': {
    confirmed: () => void
  }
  'shift-details-update-popup': {
    classgear: (arg0: RoomInfo) => void
  }
  'confirm-class-room-exchange-popup': {
    confirmed: () => void
  }
  'class-room-exchange-popup': {
    swap: (arg0: RoomSmallInfo) => void
  }
  'confirm-popup': {
    confirmed: () => void
  }
  'student-profile-popup': {
    contact: (arg0: StudentProfile) => void
  }
}

export type PopupName = keyof PopupPropsMap

interface PopupData<N extends PopupName = PopupName> {
  name: N
  props: PopupPropsMap[N]
  events?: Partial<PopupEventsMap[N]>
}

export const usePopupManager = defineStore('popupManager', () => {
  const popups = ref<PopupData[]>([])

  function open<N extends PopupName>(
    name: N,
    props: PopupPropsMap[N],
    events?: Partial<PopupEventsMap[N]>,
  ) {
    popups.value.push({ name, props, events })
  }

  function close(name: PopupName) {
    popups.value = popups.value.filter((p) => p.name !== name)
  }

  function closeCount(count: number) {
    popups.value.splice(-count, count)
  }

  function closeTop() {
    popups.value.pop()
  }

  function closeAll() {
    popups.value.length = 0
  }

  return {
    popups,
    open,
    close,
    closeCount,
    closeAll,
    closeTop,
  }
})
