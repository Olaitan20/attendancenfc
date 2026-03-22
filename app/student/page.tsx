'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import { Card, CardHead } from '@/components/ui/Card'
import ScheduleTimeline from '@/components/student/ScheduleTimeline'
import { NOTIFICATIONS, COURSE_ATTENDANCE } from '@/lib/mock-data'

const overall = Math.round(
  COURSE_ATTENDANCE.reduce((s, c) => s + c.pct, 0) / COURSE_ATTENDANCE.length
)

export default function StudentHome() {
  const notifs = NOTIFICATIONS.student
  const atRisk = COURSE_ATTENDANCE.filter(c => c.pct < 75).length

  return (
    <DashboardShell title="Dashboard">
      <PageHeader title="Good morning, Ade 👋" sub="Friday, March 20 · Week 10 of 16" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon="📊" value={`${overall}%`} label="Overall Attendance"
          color="#06b6d4" pct={overall} sub="Across 5 courses" />
        <StatCard icon="🔥" value="7"  label="Day Streak"    color="#10b981" sub="Keep it up! 🏆" />
        <StatCard icon="📚" value="5"  label="Active Courses" color="#3b82f6" sub="This semester" />
        <StatCard icon="⚠️" value={atRisk} label="Below Threshold" color="#f97316"
          sub={atRisk > 0 ? 'MTH201 — 72%' : 'All good!'} />
      </div>

      {/* Schedule + Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ScheduleTimeline />

        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Recent Notifications</p>
          </CardHead>
          <div>
            {notifs.map((n, i) => (
              <div key={i} className="flex gap-2.5 px-5 py-3.5 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors cursor-pointer">
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: n.color }} />
                <div>
                  <p className={`text-[12.5px] leading-snug ${n.read ? 'font-normal text-muted2' : 'font-semibold'}`}>
                    {n.msg}
                  </p>
                  <p className="text-[11px] text-muted font-mono mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
