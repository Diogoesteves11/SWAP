<template>
  <PopupRenderer />
  <div v-if="!isLoading">
    <StudentTemplate
      :filters="scheduleStore.filters"
      :events="enrolledEvents"
      :uc-options="ucOptions"
      :uc-disabled="!scheduleStore.filters.courseSem"
      :allocations="allocationStore.allocations"
      @update:semester="(val) => scheduleStore.setFilter('courseSem', Number(val))"
      @update:uc="(val) => scheduleStore.setFilter('courseId', Number(val))"
      @clear="scheduleStore.resetFilters"
      @changeSchedule="handleScheduleChange"
      @change-request="onChangeRequest"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useStudentStore } from '@/stores/studentStore'
import { useCourseStore } from '@/stores/courseStore'
import { useAllocationStore } from '@/stores/allocationStore'
import StudentTemplate from '@/components/templates/StudentTemplate.vue'
import PopupRenderer from '@/components/Popups/PopupRenderer.vue'
import { usePopupManager } from '@/stores/popupManager'
import { useMessagesStore } from '@/stores/messagesStore'
import { useUserInboxStore } from '@/stores/userInboxStore'
import type { Turn } from '@/components/Popups/ChangeTurnPopup.vue'
import type { ScheduleEvent } from '@/types/ScheduleTypes'
import { useClassroomStore } from '@/stores/classroomStore'

// grab studentId from the URL
const route = useRoute()
const router = useRouter()
const studentId = Number(route.params.studentId)

const scheduleStore = useScheduleStore()
const studentStore = useStudentStore()
const courseStore = useCourseStore()
const allocationStore = useAllocationStore()
const classroomStore = useClassroomStore()

const popup = usePopupManager()
const messages = useMessagesStore()
const inboxStore = useUserInboxStore()
const ADMIN_ID = 1021

const isLoading = ref(true)
onMounted(async () => {
  try {
    scheduleStore.resetFilters()
    allocationStore.clearAllocations()

    await studentStore.fetchStudents()

    await Promise.all([
      classroomStore.fetchClassrooms(),
      messages.fetchMessages(),
      courseStore.fetchCourses(),
      scheduleStore.fetchEvents(),
      allocationStore.fetchAllocations(studentId),
    ])

    const student = studentStore.getStudentById(studentId)
    if (!student) {
      router.replace({ name: 'NotFound' })
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
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
  const selSem = Number(scheduleStore.filters.courseSem)
  const validSem = !isNaN(selSem)

  const enrolledIds = enrolledCourseIds.value.map(Number)
  return courseStore.courses
    .filter((c) => enrolledIds.includes(Number(c.id)))
    .filter((c) => (validSem ? Number(c.semester) === selSem : true))
    .map((c) => ({ value: Number(c.id), label: c.abbreviation }))
})

const handleScheduleChange = () => {
  scheduleStore.resetFilters()
}

// 1) Group events by courseId for local lookups
const eventsByCourse = computed(() => {
  const m = new Map<number, ScheduleEvent[]>()
  scheduleStore.events.forEach((e) => {
    if (!m.has(e.courseId)) m.set(e.courseId, [])
    m.get(e.courseId)!.push(e)
  })
  return m
})

// 2) Which shift is currently assigned? we reuse logic from EditTemplate
function selectedShiftForCourse(courseId: number, prefix: 'T' | 'PL'): string {
  const allocs = allocationStore.allocations.filter(
    (a) => a.courseId === courseId && a.shiftId != null,
  )
  const evs = eventsByCourse.value.get(courseId) || []
  for (const a of allocs) {
    for (const ev of evs) {
      const s = ev.shifts.find((s) => s.shiftId === a.shiftId && s.name.startsWith(prefix))
      if (s) return s.name
    }
  }
  return ''
}
const selectedTermForCourse = (cid: number) => selectedShiftForCourse(cid, 'T')
const selectedPlForCourse = (cid: number) => selectedShiftForCourse(cid, 'PL')

// 3) Build the Turn[] for a given course
function turnsForCourse(courseId: number, currentName: string): Turn[] {
  const evs = eventsByCourse.value.get(courseId) || []
  return evs
    .flatMap((ev) => ev.shifts)
    .map((s) => {
      const room = classroomStore.getClassroomById(s.classroomId)
      return {
        name: s.name,
        current: s.name === currentName,
        students: s.numStudents,
        capacity: room?.capacity ?? 0,
      }
    })
}

// 4) Reverse‐lookup a shiftId from its courseId + name
function lookupShiftId(courseId: number, shiftName: string): number | null {
  const evs = eventsByCourse.value.get(courseId) || []
  for (const ev of evs) {
    const s = ev.shifts.find((s) => s.name === shiftName)
    if (s) return s.shiftId
  }
  return null
}

/**
 * Called when the user clicks “T” or “PL” in a ShiftList.
 * @param courseId – which course
 * @param kind     – 'T' or 'PL'
 */
async function onChangeRequest(courseId: number, kind: 'T' | 'PL') {
  const currentName = kind === 'T' ? selectedTermForCourse(courseId) : selectedPlForCourse(courseId)

  // only show the ones of the clicked kind, and flag exactly the one that matches currentName
  const turns = turnsForCourse(courseId, currentName).filter((t) => t.name.startsWith(kind))

  popup.open(
    'change-turn-popup',
    { turns },
    {
      join: (turn: Turn) => handleJoin(turn, courseId, currentName),
      joinfull: (turn: Turn) => {
        popup.open(
          'confirm-divided-message-popup',
          {
            upperText: 'Troca de Turno',
            bottomText: 'Este turno está cheio, quer continuar?',
            chainPop: 2,
          },
          {
            confirmed: () => handleJoin(turn, courseId, currentName),
          },
        )
      },
    },
  )
}

/** Shared logic for actually sending the shift‐type message */
async function handleJoin(turn: Turn, courseId: number, oldName: string) {
  const directorId = ADMIN_ID

  // resolve old/new shiftId
  const oldShiftId = oldName === 'N/A' ? -1 : lookupShiftId(courseId, oldName)!
  const newShiftId = lookupShiftId(courseId, turn.name)
  if (newShiftId == null) return

  const evs = eventsByCourse.value.get(courseId) || []
  const courseAbbr = evs.length ? evs[0].courseAbbreviation : ''

  // stage the shift message using the new helper:
  messages.newShiftMessage({
    senderId: studentId,
    receiverId: directorId,
    subject: `[${courseAbbr}] Pedido de Troca`, // or whatever subject
    oldShiftId,
    newShiftId,
  })

  // sync & grab its real ID
  const [messageId] = await messages.syncChanges()
  console.log(messageId)
  // update the student’s “sent”
  await inboxStore.fetchInbox(studentId)
  inboxStore.sent.push(messageId)
  await inboxStore.syncChanges()

  // update the director’s “inbox”
  await inboxStore.fetchInbox(directorId)
  inboxStore.inbox.push(messageId)
  await inboxStore.syncChanges()
}
</script>
