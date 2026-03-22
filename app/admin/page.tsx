'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import ProgressBar from '@/components/ui/ProgressBar'
import { Card, CardHead } from '@/components/ui/Card'
import { STUDENTS, LECTURERS, COURSES, NOTIFICATIONS, NFC_READERS } from '@/lib/mock-data'

const COURSE_TODAY = [
  { id: 'CSC301', name: 'Data Structures',   pct: 87, color: '#06b6d4' },
  { id: 'MTH201', name: 'Linear Algebra',    pct: 74, color: '#f59e0b' },
  { id: 'CSC305', name: 'Operating Systems', pct: 62, color: '#a78bfa' },
  { id: 'ENG201', name: 'Tech Writing',      pct: 93, color: '#10b981' },
  { id: 'CSC311', name: 'Software Eng.',     pct: 80, color: '#f97316' },
]

const atRisk  = STUDENTS.filter(s => s.pct < 75).length
const online  = NFC_READERS.filter(r => r.status === 'online').length

export default function AdminOverviewPage() {
  const alerts = NOTIFICATIONS.admin

  return (
    <DashboardShell title="Overview">
      <PageHeader title="System Overview" sub="University of Lagos — Computer Science Department" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon="🎓" value={STUDENTS.length}  label="Total Students"    color="#a78bfa" sub="+3 this week" />
        <StatCard icon="🧑‍🏫" value={LECTURERS.length} label="Lecturers"         color="#f59e0b" sub={`${COURSES.length} courses active`} />
        <StatCard icon="📡" value={`${online}/${NFC_READERS.length}`} label="Readers Online" color="#10b981"
          sub={NFC_READERS.find(r => r.status === 'offline') ? '1 offline — Gate B' : 'All online'} />
        <StatCard icon="⚠️" value={atRisk} label="At-Risk Students" color="#f43f5e" sub="Below 75% threshold" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Today's attendance bars */}
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Today&apos;s Attendance — All Courses</p>
          </CardHead>
          <div className="px-5 pb-5 pt-3 flex flex-col gap-4">
            {COURSE_TODAY.map(c => (
              <div key={c.id}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="font-semibold">{c.name}</span>
                  <span className="font-mono text-muted">{c.pct}%</span>
                </div>
                <ProgressBar pct={c.pct} color={c.color} height={7} />
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">System Alerts</p>
            <span className="bg-danger/10 text-danger text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {alerts.filter(a => !a.read).length} new
            </span>
          </CardHead>
          <div>
            {alerts.map((a, i) => (
              <div key={i} className="flex gap-2.5 px-5 py-3.5 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors cursor-pointer">
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: a.color }} />
                <div>
                  <p className={`text-[13px] leading-snug ${a.read ? 'text-muted2' : 'font-semibold'}`}>{a.msg}</p>
                  <p className="text-[11px] text-muted font-mono mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
