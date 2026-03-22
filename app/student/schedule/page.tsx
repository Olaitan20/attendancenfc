'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import ScheduleTimeline from '@/components/student/ScheduleTimeline'
import { Card, CardHead } from '@/components/ui/Card'
import { COURSES } from '@/lib/mock-data'

const DAY_COLORS: Record<string, string> = {
  'Mon/Wed/Fri': '#06b6d4',
  'Tue/Thu':     '#f59e0b',
  'Mon/Thu':     '#a78bfa',
  'Wed/Fri':     '#10b981',
}

export default function SchedulePage() {
  return (
    <DashboardShell title="My Schedule">
      <PageHeader title="My Schedule" sub="All registered courses this semester" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ScheduleTimeline />

        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">All Courses</p>
            <span className="text-[11px] font-mono text-muted2 bg-surface2 border border-border2 rounded-full px-2.5 py-0.5">
              {COURSES.length} courses
            </span>
          </CardHead>
          <div className="p-4 flex flex-col gap-2.5">
            {COURSES.map(c => (
              <div key={c.id}
                className="flex items-center gap-3 p-3 bg-surface2 border border-border1 rounded-btn hover:border-border2 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold truncate">{c.name}</p>
                  <p className="text-[11.5px] text-muted">{c.id} · {c.lecturer}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[12px] font-mono">{c.time}</p>
                  <p className="text-[11px] text-muted"
                     style={{ color: DAY_COLORS[c.day] ?? c.color }}>
                    {c.day}
                  </p>
                  <p className="text-[10.5px] text-muted">{c.room}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
