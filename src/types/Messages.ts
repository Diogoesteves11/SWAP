export interface TextMessage {
  type: 'text'
  id: number
  senderId: number
  receiverId: number
  subject: string
  content: string
}

export interface ShiftMessage {
  type: 'shift'
  id: number
  senderId: number
  subject: string
  receiverId: number
  oldShiftId: number
  newShiftId: number
  accepted: boolean | null
}

export interface UserInbox {
  id: number
  inbox: number[] // array of id
  sent: number[]
  bin: number[]
}

export type Message = TextMessage | ShiftMessage
