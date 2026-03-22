import type {
  Course, Student, Lecturer, AttendanceRecord,
  ScheduleItem, CourseAttendance, LiveTap, Notification, NFCReader
} from './types'

export const COURSES: Course[] = [
  { id: 'CSC301', name: 'Data Structures',   lecturer: 'Dr. Afolabi',  time: '8:00 AM',  day: 'Mon/Wed/Fri', room: 'Lab 2',  color: '#06b6d4' },
  { id: 'MTH201', name: 'Linear Algebra',    lecturer: 'Prof. Okafor', time: '10:00 AM', day: 'Tue/Thu',     room: 'Hall B', color: '#f59e0b' },
  { id: 'CSC305', name: 'Operating Systems', lecturer: 'Dr. Eze',      time: '12:00 PM', day: 'Mon/Thu',     room: 'Lab 4',  color: '#a78bfa' },
  { id: 'ENG201', name: 'Tech Writing',      lecturer: 'Mrs. Bello',   time: '2:00 PM',  day: 'Wed/Fri',     room: 'Room 5', color: '#10b981' },
  { id: 'CSC311', name: 'Software Eng.',     lecturer: 'Dr. Afolabi',  time: '4:00 PM',  day: 'Tue/Thu',     room: 'Lab 1',  color: '#f97316' },
]

export const STUDENTS: Student[] = [
  { id: 'CSC/21/001', name: 'Ade Bello',        classGroup: 'CSC 300L', cardUid: '04A3B2C1', pct: 88 },
  { id: 'CSC/21/002', name: 'Temi Okafor',      classGroup: 'CSC 300L', cardUid: '04D4E5F6', pct: 72 },
  { id: 'CSC/21/003', name: 'Emeka Nwachukwu',  classGroup: 'CSC 300L', cardUid: '04G7H8I9', pct: 95 },
  { id: 'CSC/21/004', name: 'Amara Osei',       classGroup: 'CSC 300L', cardUid: '04J1K2L3', pct: 61 },
  { id: 'CSC/21/005', name: 'Kemi Adeyemi',     classGroup: 'CSC 300L', cardUid: '04M5N6O7', pct: 80 },
  { id: 'CSC/21/006', name: 'Chidi Okeke',      classGroup: 'CSC 300L', cardUid: '04P8Q9R1', pct: 45 },
  { id: 'CSC/21/007', name: 'Fatima Sule',      classGroup: 'CSC 300L', cardUid: '04S2T3U4', pct: 91 },
  { id: 'CSC/21/008', name: 'Daniel Ibe',       classGroup: 'CSC 300L', cardUid: '04V5W6X7', pct: 78 },
  { id: 'CSC/21/009', name: 'Grace Mensah',     classGroup: 'CSC 300L', cardUid: '04Y8Z9A1', pct: 55 },
  { id: 'CSC/21/010', name: 'Seun Adebayo',     classGroup: 'CSC 300L', cardUid: '04B2C3D4', pct: 83 },
  { id: 'CSC/21/011', name: 'Ngozi Ude',        classGroup: 'CSC 300L', cardUid: '04E5F6G7', pct: 70 },
  { id: 'CSC/21/012', name: 'Lekan Taiwo',      classGroup: 'CSC 300L', cardUid: '04H8I9J1', pct: 66 },
]

export const LECTURERS: Lecturer[] = [
  { id: 'LEC/001', name: 'Dr. Afolabi',  dept: 'Computer Science', courses: ['CSC301', 'CSC311'], pct: 96 },
  { id: 'LEC/002', name: 'Prof. Okafor', dept: 'Mathematics',      courses: ['MTH201'],           pct: 88 },
  { id: 'LEC/003', name: 'Dr. Eze',      dept: 'Computer Science', courses: ['CSC305'],            pct: 91 },
  { id: 'LEC/004', name: 'Mrs. Bello',   dept: 'English',          courses: ['ENG201'],            pct: 99 },
]

export const TODAY_SCHEDULE: ScheduleItem[] = [
  { time: '8:00',  course: 'Data Structures',   code: 'CSC301', room: 'Lab 2',  lecturer: 'Dr. Afolabi',  done: true },
  { time: '10:00', course: 'Linear Algebra',    code: 'MTH201', room: 'Hall B', lecturer: 'Prof. Okafor', done: false, current: true },
  { time: '12:00', course: 'Operating Systems', code: 'CSC305', room: 'Lab 4',  lecturer: 'Dr. Eze',      done: false },
  { time: '2:00',  course: 'Tech Writing',      code: 'ENG201', room: 'Room 5', lecturer: 'Mrs. Bello',   done: false },
]

export const COURSE_ATTENDANCE: CourseAttendance[] = [
  { id: 'CSC301', name: 'Data Structures',   pct: 88, attended: 21, total: 24, color: '#06b6d4' },
  { id: 'MTH201', name: 'Linear Algebra',    pct: 72, attended: 18, total: 25, color: '#f59e0b' },
  { id: 'CSC305', name: 'Operating Systems', pct: 65, attended: 13, total: 20, color: '#a78bfa' },
  { id: 'ENG201', name: 'Tech Writing',      pct: 94, attended: 17, total: 18, color: '#10b981' },
  { id: 'CSC311', name: 'Software Eng.',     pct: 80, attended: 20, total: 25, color: '#f97316' },
]

export const HISTORY: AttendanceRecord[] = [
  { id: '1', day: '20', month: 'MAR', course: 'CSC301', time: '8:03 AM',  status: 'present' },
  { id: '2', day: '19', month: 'MAR', course: 'MTH201', time: '10:01 AM', status: 'present' },
  { id: '3', day: '18', month: 'MAR', course: 'CSC305', time: '–',        status: 'absent'  },
  { id: '4', day: '17', month: 'MAR', course: 'ENG201', time: '2:05 PM',  status: 'present' },
  { id: '5', day: '17', month: 'MAR', course: 'CSC311', time: '4:02 PM',  status: 'late'    },
  { id: '6', day: '14', month: 'MAR', course: 'CSC301', time: '8:10 AM',  status: 'late'    },
  { id: '7', day: '13', month: 'MAR', course: 'MTH201', time: '10:00 AM', status: 'present' },
  { id: '8', day: '12', month: 'MAR', course: 'CSC305', time: '12:02 PM', status: 'present' },
]

export const LIVE_FEED: LiveTap[] = [
  { name: 'Ade Bello',       classGroup: 'CSC 300L', time: '8:03', type: 'check_in' },
  { name: 'Fatima Sule',     classGroup: 'CSC 300L', time: '8:05', type: 'check_in' },
  { name: 'Daniel Ibe',      classGroup: 'CSC 300L', time: '8:07', type: 'check_in' },
  { name: 'Seun Adebayo',    classGroup: 'CSC 300L', time: '8:08', type: 'check_in' },
  { name: 'Ngozi Ude',       classGroup: 'CSC 300L', time: '8:09', type: 'check_in' },
  { name: 'Emeka Nwachukwu', classGroup: 'CSC 300L', time: '8:11', type: 'check_in' },
]

export const NOTIFICATIONS: Record<string, Notification[]> = {
  student: [
    { msg: 'You were marked ABSENT for CSC305 — Operating Systems today.', time: '2h ago',  color: '#f43f5e', read: false },
    { msg: 'Attendance warning: MTH201 — you are at 72%. Minimum is 75%.', time: '1d ago',  color: '#f97316', read: false },
    { msg: 'Check-in confirmed for CSC301 today at 8:03 AM.',              time: 'Today',   color: '#10b981', read: true  },
    { msg: 'Upcoming: CSC311 class in 45 minutes — Room Lab 1.',           time: 'Today',   color: '#06b6d4', read: true  },
  ],
  lecturer: [
    { msg: 'CSC301: 18 / 30 students checked in so far.',                     time: 'Now',  color: '#10b981', read: false },
    { msg: 'CSC311: Only 40% attendance last Thursday. Consider follow-up.',  time: '2d ago', color: '#f97316', read: false },
    { msg: 'Report exported successfully for MTH201 — Week 10.',              time: '3d ago', color: '#06b6d4', read: true  },
  ],
  admin: [
    { msg: '6 students below 75% attendance threshold this week.',   time: 'Now',    color: '#f43f5e', read: false },
    { msg: 'NFC Reader offline at Gate B for 30 minutes.',           time: '1h ago', color: '#f97316', read: false },
    { msg: 'New registration: 12 NFC cards enrolled today.',         time: 'Today',  color: '#10b981', read: true  },
    { msg: 'Weekly report generated and ready to export.',           time: '1d ago', color: '#06b6d4', read: true  },
  ],
}

export const NFC_READERS: NFCReader[] = [
  { name: 'Gate A', location: 'Main Entrance',  status: 'online',  lastSeen: '2 min ago', uid: 'ACR122U-001' },
  { name: 'Gate B', location: 'Side Entrance',  status: 'offline', lastSeen: '1h ago',    uid: 'ACR122U-002' },
  { name: 'Lab 2',  location: 'CS Laboratory',  status: 'online',  lastSeen: '5 min ago', uid: 'ACR122U-003' },
]
