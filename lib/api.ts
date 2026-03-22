const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

// Bypass ngrok browser warning when tunnelling
const HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
}

export async function getTodaySummary() {
  const res = await fetch(`${BASE}/api/attendance/summary`, { headers: HEADERS })
  return res.json()
}

export async function getAttendanceLog(options?: {
  date?: string
  limit?: number
}) {
  const params = new URLSearchParams()
  if (options?.date)  params.set('date',  options.date)
  if (options?.limit) params.set('limit', String(options.limit))

  const query = params.toString() ? `?${params.toString()}` : ''
  const res = await fetch(`${BASE}/api/attendance${query}`, { headers: HEADERS })
  return res.json()
}

export async function recordTap(cardUid: string) {
  const res = await fetch(`${BASE}/api/tap`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ card_uid: cardUid }),
  })
  return res.json()
}

export async function registerCard(data: {
  card_uid: string
  name: string
  role: string
  class_group?: string
  email?: string
  phone?: string
}) {
  const res = await fetch(`${BASE}/api/users`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function getAllUsers() {
  const res = await fetch(`${BASE}/api/users`, { headers: HEADERS })
  return res.json()
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  })
  return res.json()
}