const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

const HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginUser(identifier: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ identifier, password }),
  })
  return res.json()
}

export async function changePassword(identifier: string, oldPassword: string, newPassword: string) {
  const res = await fetch(`${BASE}/api/auth/change-password`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ identifier, old_password: oldPassword, new_password: newPassword }),
  })
  return res.json()
}

export async function adminSetPassword(userId: number, newPassword: string) {
  const res = await fetch(`${BASE}/api/auth/set-password`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ user_id: userId, new_password: newPassword }),
  })
  return res.json()
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function getCourses() {
  const res = await fetch(`${BASE}/api/courses`, { headers: HEADERS })
  return res.json()
}

export async function createCourse(data: {
  code: string; name: string; lecturer?: string
  day?: string; time?: string; room?: string
}) {
  const res = await fetch(`${BASE}/api/courses`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteCourse(id: number) {
  const res = await fetch(`${BASE}/api/courses/${id}`, { method: 'DELETE', headers: HEADERS })
  return res.json()
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const res = await fetch(`${BASE}/api/users`, { headers: HEADERS })
  return res.json()
}

export async function registerCard(data: {
  card_uid: string; name: string; matric_number?: string
  role: string; class_group?: string; email?: string
  phone?: string; password?: string; course_ids?: number[]
}) {
  const res = await fetch(`${BASE}/api/users`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateUserCourses(userId: number, courseIds: number[]) {
  const res = await fetch(`${BASE}/api/users/${userId}/courses`, {
    method: 'PUT', headers: HEADERS, body: JSON.stringify({ course_ids: courseIds }),
  })
  return res.json()
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE}/api/users/${id}`, { method: 'DELETE', headers: HEADERS })
  return res.json()
}

// ── Attendance ────────────────────────────────────────────────────────────────

export async function getTodaySummary(courseId?: number) {
  const query = courseId ? `?course_id=${courseId}` : ''
  const res = await fetch(`${BASE}/api/attendance/summary${query}`, { headers: HEADERS })
  return res.json()
}

export async function getAttendanceLog(options?: {
  date?: string; course_id?: number; limit?: number
}) {
  const params = new URLSearchParams()
  if (options?.date)      params.set('date',      options.date)
  if (options?.course_id) params.set('course_id', String(options.course_id))
  if (options?.limit)     params.set('limit',     String(options.limit))
  const query = params.toString() ? `?${params.toString()}` : ''
  const res = await fetch(`${BASE}/api/attendance${query}`, { headers: HEADERS })
  return res.json()
}

export async function recordTap(cardUid: string, courseId?: number) {
  const res = await fetch(`${BASE}/api/tap`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ card_uid: cardUid, course_id: courseId }),
  })
  return res.json()
}

export async function clearAttendance(date?: string) {
  const query = date ? `?date=${date}` : ''
  const res = await fetch(`${BASE}/api/attendance/clear${query}`, {
    method: 'DELETE', headers: HEADERS,
  })
  return res.json()
}

export async function getClasses() {
  const res = await fetch(`${BASE}/api/classes`, { headers: HEADERS })
  return res.json()
}