'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import CourseRingGrid from '@/components/student/CourseRingGrid'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { Card, CardHead } from '@/components/ui/Card'
import { COURSE_ATTENDANCE } from '@/lib/mock-data'
import { pctColor, pctBadge } from '@/lib/utils'

export default function AttendancePage() {
  const overall = Math.round(
    COURSE_ATTENDANCE.reduce((s, c) => s + c.pct, 0) / COURSE_ATTENDANCE.length
  )

  return (
    <DashboardShell title="Attendance Stats">
      <PageHeader title="Attendance Stats" sub="Your attendance breakdown by course" />

      {/* Ring overview */}
      <CourseRingGrid />

      {/* Summary banner */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Overall Average', value: `${overall}%`, color: overall >= 75 ? '#10b981' : '#f97316' },
          { label: 'Courses in Good Standing', value: COURSE_ATTENDANCE.filter(c => c.pct >= 75).length, color: '#10b981' },
          { label: 'Courses At Risk',           value: COURSE_ATTENDANCE.filter(c => c.pct < 75).length,  color: '#f43f5e' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border1 rounded-card p-4 text-center">
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11.5px] text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Detailed table */}
      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">Per Course Breakdown</p>
        </CardHead>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Course', 'Attended', 'Total', 'Percentage', 'Status'].map(h => (
                  <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COURSE_ATTENDANCE.map(ca => {
                const color = pctColor(ca.pct)
                return (
                  <tr key={ca.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold">{ca.name}</p>
                      <p className="text-[11px] text-muted font-mono">{ca.id}</p>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold">{ca.attended}</td>
                    <td className="px-4 py-3 text-[13px] text-muted">{ca.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        <ProgressBar pct={ca.pct} color={color} height={5} className="w-24 flex-shrink-0" />
                        <span className="text-[13px] font-bold" style={{ color }}>{ca.pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={pctBadge(ca.pct)}>
                        {ca.pct >= 75 ? 'Good Standing' : 'At Risk'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  )
}
