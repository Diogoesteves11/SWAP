<template>
  <PopupRenderer />
  <EditTemplate
    :filters="scheduleStore.filters"
    :events="enrolledEvents"
    :uc-options="ucOptions"
    :uc-disabled="!scheduleStore.filters.courseSem"
    :allocations="allocationStore.allocations"
    @update:semester="(val) => scheduleStore.setFilter('courseSem', Number(val))"
    @update:uc="(val) => scheduleStore.setFilter('courseId', Number(val))"
    @clear="scheduleStore.resetFilters"
    @go-back="goBack"
    @apply="onSave"
    @term-changed="(cid, name) => handleShiftChange(cid, name, 'T')"
    @pl-changed="(cid, name) => handleShiftChange(cid, name, 'PL')"
    @select="onEventClick"
  />
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useStudentStore } from '@/stores/studentStore'
import { useCourseStore } from '@/stores/courseStore'
import { useAllocationStore } from '@/stores/allocationStore'
import EditTemplate from '@/components/templates/EditTemplate.vue'
import PopupRenderer from '@/components/Popups/PopupRenderer.vue'
import { usePopupManager } from '@/stores/popupManager'
import type { ScheduleEvent } from '@/types/ScheduleTypes'
import type { RoomInfo } from '@/components/Popups/ShiftDetailsUpdatePopup.vue'
import { useClassroomStore } from '@/stores/classroomStore'
import { useTeacherStore } from '@/stores/teacherStore'
import type { RoomSmallInfo } from '@/components/Popups/ClassRoomExchangePopup.vue'
import { useMessagesStore } from '@/stores/messagesStore'
import { useUserInboxStore } from '@/stores/userInboxStore'

const router = useRouter()

// grab studentId from the URL
const route = useRoute()
const studentId = Number(route.params.studentId)

const scheduleStore = useScheduleStore()
const studentStore = useStudentStore()
const courseStore = useCourseStore()
const allocationStore = useAllocationStore()
const classroomStore = useClassroomStore()
const teacherStore = useTeacherStore()
const messagesStore = useMessagesStore()
const inboxStore = useUserInboxStore()

const popupManager = usePopupManager()

onMounted(async () => {
  scheduleStore.resetFilters()
  allocationStore.clearAllocations()

  await studentStore.fetchStudents()

  await Promise.all([
    messagesStore.fetchMessages(),
    courseStore.fetchCourses(),
    scheduleStore.fetchEvents(),
    allocationStore.fetchAllocations(studentId),
  ])
})

// reactive “current student”
const student = computed(() => studentStore.getStudentById(studentId) || { enrolled: [] })

// the enrolled course IDs
const enrolledCourseIds = computed<number[]>(() => student.value.enrolled)

// combine filters & enrolled list: if no filter, show all enrolled
const enrolledEvents = computed(() => {
  // start from full list of events the student is in
  let evts = scheduleStore.events.filter((e) => enrolledCourseIds.value.includes(e.courseId))

  const { courseSem, courseId } = scheduleStore.filters
  // if neither filter set, return all enrolled
  if (courseSem == null && courseId == null) {
    return evts
  }

  // otherwise apply semester filter first
  if (courseSem != null) {
    evts = evts.filter((e) => e.courseSemester === courseSem)
  }
  // then apply course filter
  if (courseId != null) {
    evts = evts.filter((e) => e.courseId === courseId)
  }
  return evts
})

// UC dropdown: all enrolled courses, or only those in the selected semester
const ucOptions = computed(() => {
  const selSem = scheduleStore.filters.courseSem
  return courseStore.courses
    .filter((c) => enrolledCourseIds.value.includes(c.id))
    .filter((c) => (selSem == null ? true : c.semester === selSem))
    .map((c) => ({ value: c.id, label: c.abbreviation }))
})

function goBack() {
  router.push('/admin')
}

// Generic handler for both term and PL:
function handleShiftChange(courseId: number, shiftName: string, prefix: 'T' | 'PL') {
  // find the new shiftId by name & prefix
  const evs = scheduleStore.events.filter((e) => e.courseId === courseId)
  const newShiftDetail = evs
    .flatMap((e) => e.shifts)
    .find((s) => s.name === shiftName && s.name.startsWith(prefix))
  if (!newShiftDetail) return
  const newShiftId = newShiftDetail.shiftId

  // helper to get a shift’s name from its id
  const getName = (shiftId: number) =>
    evs.flatMap((e) => e.shifts).find((s) => s.shiftId === shiftId)?.name

  // First, look for the allocation you previously flagged changedTo *and* that matches this prefix*
  let oldAlloc = allocationStore.allocations.find((a) => {
    if (a.courseId !== courseId || a.shiftId == null || !a.changedTo) return false
    const name = getName(a.shiftId)
    return name?.startsWith(prefix)
  })

  // If none found (first swap), fallback to "the allocation matching prefix"
  if (!oldAlloc) {
    oldAlloc = allocationStore.allocations.find((a) => {
      if (a.courseId !== courseId || a.shiftId == null) return false
      const name = getName(a.shiftId)
      return name?.startsWith(prefix)
    })
  }

  // If we found an old one, mark it changedFrom (blue)
  if (oldAlloc) {
    allocationStore.upsertAllocation({
      courseId,
      shiftId: oldAlloc.shiftId!,
      changedFrom: true,
      changedTo: false,
    })
  }

  // Mark the newly-picked shift changedTo (yellow)
  allocationStore.upsertAllocation({
    courseId,
    shiftId: newShiftId,
    changedFrom: false,
    changedTo: true,
  })
}

async function onSave() {
  popupManager.open(
    'confirm-popup',
    {
      message: 'Tem a certeza que quer\naplicar as alterações?',
      chainPop: 1,
    },
    {
      confirmed: async () => {
        scheduleStore.resetFilters()
        await allocationStore.syncAllocations()
        allocationStore.clearAllocations()
        await allocationStore.fetchAllocations(studentId)
      },
    },
  )
}

function onEventClick(event: ScheduleEvent) {
  // first, map each shift to a RoomInfo
  const shifts: RoomInfo[] = event.shifts.map((s) => {
    const room = classroomStore.getClassroomById(Number(s.classroomId))!
    const teacher = teacherStore.getTeacherById(Number(s.teacherId))!
    return {
      shift: s.name,
      building: room.buildingId,
      code: room.name,
      professor: teacher.name,
      studentCount: { current: s.numStudents, total: room.capacity },
    }
  })

  popupManager.open(
    'shift-details-update-popup',
    {
      title: event.courseAbbreviation,
      subtitle: 'Detalhes Turno',
      shifts,
    },
    {
      classgear: (roomItem: RoomInfo) => {
        popupManager.open(
          'class-room-exchange-popup',
          {
            title: event.courseAbbreviation,
            subtitle: 'Troca de Sala',
            shift: roomItem.shift,
            currentBuilding: roomItem.building,
            currentCode: roomItem.code,
            studentCount: roomItem.studentCount,
            availableRooms: classroomStore.classrooms.map((room) => ({
              building: room.buildingId,
              code: room.name,
              capacity: room.capacity,
            })),
          },
          {
            swap: async (sRoomItem: RoomSmallInfo) => {
              const shiftToUpdate = event.shifts.find((s) => s.name === roomItem.shift)
              if (!shiftToUpdate) return

              try {
                // 1) actualizar localmente (UI)
                const newClassroom = classroomStore.classrooms.find(
                  (c) => c.name === sRoomItem.code && c.buildingId === sRoomItem.building,
                )
                if (newClassroom) {
                  shiftToUpdate.classroomId = newClassroom.id
                }

                // 2) preparar dados da mensagem
                const directorId = 1021
                const teacherId = shiftToUpdate.teacherId
                const courseAbbr = event.courseAbbreviation
                const oldBuilding = roomItem.building
                const oldRoomName = roomItem.code
                const newBuilding = sRoomItem.building
                const newRoomName = sRoomItem.code

                const subject = `[${courseAbbr}] Troca de Sala`
                const content = `${shiftToUpdate.name}: ${oldBuilding} ${oldRoomName} ⇒ ${newBuilding} ${newRoomName}`

                // 3) criar e enviar a “text message”
                messagesStore.newMessage({
                  type: 'text',
                  senderId: directorId,
                  receiverId: teacherId,
                  subject,
                  content,
                })
                // 4) sincronizar mensagens e obter o ID real
                const [msgId] = await messagesStore.syncChanges()

                // 5) actualizar caixas de entrada/enviados
                // 5a) director “sent”
                await inboxStore.fetchInbox(directorId)
                inboxStore.sent.push(msgId)
                await inboxStore.syncChanges()

                // 5b) teacher “inbox”
                await inboxStore.fetchInbox(teacherId)
                inboxStore.inbox.push(msgId)
                await inboxStore.syncChanges()

                // 6) actualizar a API da sala
                await fetch(`http://localhost:3000/shifts/${shiftToUpdate.shiftId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ classroomId: shiftToUpdate.classroomId }),
                })

                popupManager.open(
                  'confirm-popup',
                  {
                    message: `Troca efetuada com sucesso!\nO professor foi avisado.`,
                    chainPop: 3,
                  },
                  {
                    confirmed: () => {
                      console.log('Acknowledged')
                    },
                  },
                )
              } catch (err) {
                console.error('Erro ao trocar sala:', err)
              }
            },
          },
        )
      },
    },
  )
}
</script>
