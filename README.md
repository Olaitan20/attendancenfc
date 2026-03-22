# AttendNFC — Next.js Frontend

Full multi-role attendance tracking dashboard built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

## Roles
| Role | Entry URL | Accent Color |
|------|-----------|--------------|
| Student  | `/student`  | Cyan `#06b6d4`   |
| Lecturer | `/lecturer` | Amber `#f59e0b`  |
| Admin    | `/admin`    | Violet `#a78bfa` |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:3000
```

Login page is at `/login`. Pick a role and click **Sign In**.

---

## Project Structure

```
attendnfc/
├── app/
│   ├── layout.tsx              ← Root layout (fonts, metadata)
│   ├── page.tsx                ← Redirects → /login
│   ├── globals.css
│   ├── login/
│   │   └── page.tsx            ← Login with role picker
│   ├── student/
│   │   ├── layout.tsx          ← Route guard (student only)
│   │   ├── page.tsx            ← Home dashboard
│   │   ├── schedule/page.tsx   ← Today's timetable
│   │   ├── attendance/page.tsx ← Per-course stats + rings
│   │   ├── history/page.tsx    ← Filterable tap history
│   │   └── notifications/page.tsx
│   ├── lecturer/
│   │   ├── layout.tsx          ← Route guard (lecturer only)
│   │   ├── page.tsx            ← Live class + tap feed
│   │   ├── students/page.tsx   ← Student breakdown table
│   │   ├── mark/page.tsx       ← Manual attendance grid
│   │   ├── reports/page.tsx    ← Per-course reports + CSV export
│   │   └── notifications/page.tsx
│   └── admin/
│       ├── layout.tsx          ← Route guard (admin only)
│       ├── page.tsx            ← System overview
│       ├── students/page.tsx   ← Full student roster
│       ├── lecturers/page.tsx  ← Lecturer cards
│       ├── cards/page.tsx      ← NFC reader status + card table
│       ├── alerts/page.tsx     ← System alerts
│       └── settings/page.tsx   ← Config + toggles
│
├── components/
│   ├── ui/
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── NotificationPanel.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RingProgress.tsx
│   │   ├── StatCard.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── DashboardShell.tsx  ← Main layout wrapper (sidebar + topbar)
│   │   ├── PageHeader.tsx
│   │   ├── Sidebar.tsx         ← Responsive: fixed desktop / drawer mobile
│   │   └── Topbar.tsx
│   ├── student/
│   │   ├── AttendanceHistoryList.tsx
│   │   ├── CourseRingGrid.tsx
│   │   └── ScheduleTimeline.tsx
│   ├── lecturer/
│   │   ├── LiveFeed.tsx
│   │   ├── MarkGrid.tsx
│   │   └── StudentTable.tsx
│   └── admin/
│       ├── LecturerCard.tsx
│       ├── NFCReaderCard.tsx
│       └── StudentRoster.tsx
│
├── lib/
│   ├── mock-data.ts            ← All demo data (swap with API calls)
│   ├── types.ts                ← Shared TypeScript interfaces
│   └── utils.ts                ← cn(), initials(), pctColor()…
│
├── store/
│   └── authStore.ts            ← Zustand auth store (persisted)
│
├── hooks/
│   └── useToast.ts
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Connecting to the Flask Backend

Replace mock data in `lib/mock-data.ts` with `fetch()` calls. Example:

```ts
// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export async function getAttendanceSummary(date: string) {
  const res = await fetch(`${BASE}/api/attendance/summary?date=${date}`)
  return res.json()
}

export async function recordTap(cardUid: string) {
  const res = await fetch(`${BASE}/api/tap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_uid: cardUid }),
  })
  return res.json()
}
```

Add to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Mobile Responsiveness

Every page is fully responsive:
- **Desktop (lg+):** Fixed 240px sidebar + main content area
- **Mobile (<lg):** Topbar hamburger → full-screen drawer sidebar with overlay
- All grids collapse: `grid-cols-4 → grid-cols-2` on tablet, `grid-cols-1` on mobile
- Tables scroll horizontally on small screens
- Topbar hides date on very small screens

---

## Customising for a School

1. Update institution name in `app/admin/settings/page.tsx`
2. Add real courses to `lib/mock-data.ts → COURSES`
3. Change the minimum attendance threshold (default 75%)
4. For multi-school SaaS: add a `schoolId` field to `User` in `lib/types.ts`
