export type Role = 'student' | 'lecturer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  initials: string
  classGroup?: string
  department?: string
}

export interface Course {
  id: string
  name: string
  lecturer: string
  time: string
  day: string
  room: string
  color: string
}

export interface Student {
  id: string
  name: string
  classGroup: string
  cardUid: string
  pct: number
}

export interface Lecturer {
  id: string
  name: string
  dept: string
  courses: string[]
  pct: number
}

export interface AttendanceRecord {
  id: string
  day: string
  month: string
  course: string
  time: string
  status: 'present' | 'absent' | 'late'
}

export interface ScheduleItem {
  time: string
  course: string
  code: string
  room: string
  lecturer: string
  done: boolean
  current?: boolean
}

export interface CourseAttendance {
  id: string
  name: string
  pct: number
  attended: number
  total: number
  color: string
}

export interface LiveTap {
  name: string
  classGroup: string
  time: string
  type: 'check_in' | 'check_out'
}

export interface Notification {
  msg: string
  time: string
  color: string
  read: boolean
}

export type MarkStatus = 'present' | 'absent' | null

export interface NFCReader {
  name: string
  location: string
  status: 'online' | 'offline'
  lastSeen: string
  uid?: string
}
