const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

const H: HeadersInit = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
}

// Auth
export async function loginUser(identifier: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, { method:'POST', headers:H, body: JSON.stringify({ identifier, password }) })
  return res.json()
}
export async function changePassword(identifier: string, oldPassword: string, newPassword: string) {
  const res = await fetch(`${BASE}/api/auth/change-password`, { method:'POST', headers:H, body: JSON.stringify({ identifier, old_password: oldPassword, new_password: newPassword }) })
  return res.json()
}
export async function adminSetPassword(userId: number, newPassword: string) {
  const res = await fetch(`${BASE}/api/auth/set-password`, { method:'POST', headers:H, body: JSON.stringify({ user_id: userId, new_password: newPassword }) })
  return res.json()
}

// Lecturers
export async function getLecturers() {
  const res = await fetch(`${BASE}/api/lecturers`, { headers: H })
  return res.json()
}

// Courses
export async function getCourses() {
  const res = await fetch(`${BASE}/api/courses`, { headers: H })
  return res.json()
}
export async function createCourse(data: { code:string; name:string; lecturer_id?:number; lecturer?:string; day?:string; time?:string; room?:string }) {
  const res = await fetch(`${BASE}/api/courses`, { method:'POST', headers:H, body: JSON.stringify(data) })
  return res.json()
}
export async function updateCourse(id: number, data: object) {
  const res = await fetch(`${BASE}/api/courses/${id}`, { method:'PUT', headers:H, body: JSON.stringify(data) })
  return res.json()
}
export async function deleteCourse(id: number) {
  const res = await fetch(`${BASE}/api/courses/${id}`, { method:'DELETE', headers:H })
  return res.json()
}
export async function getCourseStudents(courseId: number) {
  const res = await fetch(`${BASE}/api/courses/${courseId}/students`, { headers: H })
  return res.json()
}
export async function getLecturerCourses(lecturerId: number) {
  const res = await fetch(`${BASE}/api/courses/lecturer/${lecturerId}`, { headers: H })
  return res.json()
}

// Enrollment
export async function enrollInCourse(userId: number, courseId: number) {
  const res = await fetch(`${BASE}/api/enroll`, { method:'POST', headers:H, body: JSON.stringify({ user_id: userId, course_id: courseId }) })
  return res.json()
}
export async function unenrollFromCourse(userId: number, courseId: number) {
  const res = await fetch(`${BASE}/api/enroll`, { method:'DELETE', headers:H, body: JSON.stringify({ user_id: userId, course_id: courseId }) })
  return res.json()
}
export async function setUserCourses(userId: number, courseIds: number[]) {
  const res = await fetch(`${BASE}/api/users/${userId}/courses`, { method:'PUT', headers:H, body: JSON.stringify({ course_ids: courseIds }) })
  return res.json()
}

// Users
export async function getAllUsers() {
  const res = await fetch(`${BASE}/api/users`, { headers: H })
  return res.json()
}
export async function registerCard(data: { card_uid:string; name:string; matric_number?:string; role:string; class_group?:string; email?:string; phone?:string; password?:string; course_ids?:number[] }) {
  const res = await fetch(`${BASE}/api/users`, { method:'POST', headers:H, body: JSON.stringify(data) })
  return res.json()
}
export async function deleteUser(id: number) {
  const res = await fetch(`${BASE}/api/users/${id}`, { method:'DELETE', headers:H })
  return res.json()
}

// Attendance
export async function getTodaySummary(courseId?: number) {
  const q = courseId ? `?course_id=${courseId}` : ''
  const res = await fetch(`${BASE}/api/attendance/summary${q}`, { headers: H })
  return res.json()
}
export async function getAttendanceLog(options?: { date?:string; course_id?:number; limit?:number }) {
  const p = new URLSearchParams()
  if (options?.date)      p.set('date',      options.date)
  if (options?.course_id) p.set('course_id', String(options.course_id))
  if (options?.limit)     p.set('limit',     String(options.limit))
  const q = p.toString() ? `?${p.toString()}` : ''
  const res = await fetch(`${BASE}/api/attendance${q}`, { headers: H })
  return res.json()
}
export async function recordTap(cardUid: string, courseId?: number) {
  const res = await fetch(`${BASE}/api/tap`, { method:'POST', headers:H, body: JSON.stringify({ card_uid: cardUid, course_id: courseId }) })
  return res.json()
}
export async function clearAttendance(date?: string) {
  const q = date ? `?date=${date}` : ''
  const res = await fetch(`${BASE}/api/attendance/clear${q}`, { method:'DELETE', headers:H })
  return res.json()
}