<template>
  <PopupRenderer />
  <AdminTemplate
    :filters="scheduleStore.filters"
    :events="scheduleStore.filteredEvents"
    :students="studentStore.students"
    :uc-options="ucOptions"
    :uc-disabled="!scheduleStore.filters.courseSem"
    @update:semester="updateSemester"
    @update:uc="updateCourse"
    @clear="scheduleStore.resetFilters"
    @edit-student="onEditStudent"
    @select="onEventClick"
    @select-student="onStudentClick"
  />
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useClassroomStore } from '@/stores/classroomStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useStudentStore } from '@/stores/studentStore'
import { useCourseStore } from '@/stores/courseStore'
import { useTeacherStore } from '@/stores/teacherStore'
import AdminTemplate from '@/components/templates/AdminTemplate.vue'
import PopupRenderer from '@/components/Popups/PopupRenderer.vue'
import { usePopupManager } from '@/stores/popupManager'
import type { ScheduleEvent } from '@/types/ScheduleTypes'
import type { RoomInfo } from '@/components/Popups/ShiftDetailsUpdatePopup.vue'
import type { RoomSmallInfo } from '@/components/Popups/ClassRoomExchangePopup.vue'
import type { Student } from '@/types/Student'
import type { StudentProfile } from '@/components/Popups/StudentProfilePopup.vue'
import { calculateStudentSemester } from '@/utils/studentUtils'
import { useMessagesStore } from '@/stores/messagesStore'
import { useUserInboxStore } from '@/stores/userInboxStore'

const router = useRouter()

const classroomStore = useClassroomStore()
const scheduleStore = useScheduleStore()
const studentStore = useStudentStore()
const courseStore = useCourseStore()
const teacherStore = useTeacherStore()
const messagesStore = useMessagesStore()
const inboxStore = useUserInboxStore()

const popupManager = usePopupManager()

onMounted(async () => {
  await Promise.all([
    messagesStore.fetchMessages(),
    classroomStore.fetchClassrooms(),
    courseStore.fetchCourses(),
    studentStore.fetchStudents(),
    teacherStore.fetchTeachers(),
    scheduleStore.fetchEvents(),
  ])
})

// only courses in the currently selected semester:
const ucOptions = computed(() =>
  courseStore.courses
    .filter((c) => c.semester === scheduleStore.filters.courseSem)
    .map((c) => ({ value: c.id, label: `${c.abbreviation}` })),
)

function onEditStudent(studentId: number) {
  router.push({ name: 'edit', params: { studentId } })
}

function updateSemester(val: string) {
  scheduleStore.resetFilters()
  scheduleStore.setFilter('courseSem', Number(val))
}

function updateCourse(val: string) {
  scheduleStore.setFilter('courseId', Number(val))
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

function onStudentClick(student: Student) {
  const sem = calculateStudentSemester(student.enrolled, courseStore.courses)
  popupManager.open(
    'student-profile-popup',
    {
      student: {
        name: student.name,
        number: String(student.id),
        status: student.specialStatus,
        semester: sem,
      },
    },
    {
      contact: (std: StudentProfile) => {
        console.log(std)
        router.push({
          name: 'new-message',
          params: { userId: '1021' },
          query: { recipient: student.email },
        })
      },
    },
  )
}
</script>
