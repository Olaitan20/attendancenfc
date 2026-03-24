'use client'
import { useEffect, useState, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import RingProgress from '@/components/ui/RingProgress'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { Card, CardHead } from '@/components/ui/Card'
import { getAttendanceLog, getCourses } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { pctColor, pctBadge } from '@/lib/utils'

interface Course { id: number; code: string; name: string }
interface TapRecord { name: string; event_type: string; course_code?: string }

export default function AttendancePage() {
  const { user }            = useAuthStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [log, setLog]       = useState<TapRecord[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [logData, courseData] = await Promise.all([
        getAttendanceLog({ limit: 500 }),
        getCourses(),
      ])
      const all  = Array.isArray(logData) ? logData : []
      const mine = user ? all.filter((r: TapRecord) => r.name === user.name) : all
      setLog(mine)
      setCourses(Array.isArray(courseData) ? courseData : [])
    } catch {}
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { load() }, [load])

  const TOTAL_CLASSES = 20 // approximate denominator

  const courseStats = courses.map((c, i) => {
    const attended = log.filter(r => r.event_type === 'check_in' && r.course_code === c.code).length
    const pct      = Math.min(100, Math.round((attended / TOTAL_CLASSES) * 100))
    const colors   = ['#06b6d4','#f59e0b','#a78bfa','#10b981','#f97316','#3b82f6']
    return { ...c, attended, total: TOTAL_CLASSES, pct, color: colors[i % colors.length] }
  })

  const overall = courseStats.length > 0
    ? Math.round(courseStats.reduce((s, c) => s + c.pct, 0) / courseStats.length)
    : 0

  return (
    <DashboardShell title="Attendance Stats">
      <PageHeader title="Attendance Stats" sub="Your attendance breakdown by course" />

      {loading ? (
        <div className="py-16 text-center text-muted animate-pulse">Loading…</div>
      ) : (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface border border-border1 rounded-card p-4 text-center">
              <p className="text-2xl font-extrabold" style={{ color: pctColor(overall) }}>{overall}%</p>
              <p className="text-[11.5px] text-muted mt-1">Overall Average</p>
            </div>
            <div className="bg-surface border border-border1 rounded-card p-4 text-center">
              <p className="text-2xl font-extrabold text-ok">{courseStats.filter(c => c.pct >= 75).length}</p>
              <p className="text-[11.5px] text-muted mt-1">Good Standing</p>
            </div>
            <div className="bg-surface border border-border1 rounded-card p-4 text-center">
              <p className="text-2xl font-extrabold text-danger">{courseStats.filter(c => c.pct < 75).length}</p>
              <p className="text-[11.5px] text-muted mt-1">At Risk</p>
            </div>
          </div>

          {/* Ring grid */}
          {courseStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {courseStats.map(ca => (
                <div key={ca.id} className="bg-surface border border-border1 rounded-card p-4 text-center hover:border-border2 transition-all hover:-translate-y-0.5">
                  <div className="flex justify-center">
                    <RingProgress pct={ca.pct} color={ca.color} size={72} />
                  </div>
                  <p className="text-xs font-bold mt-3 truncate">{ca.name}</p>
                  <p className="text-[10.5px] text-muted font-mono">{ca.code}</p>
                  <p className="text-[11px] text-muted mt-1">{ca.attended}/{ca.total}</p>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          <Card>
            <CardHead><p className="text-[13.5px] font-bold">Per Course Breakdown</p></CardHead>
            {courseStats.length === 0 ? (
              <div className="px-5 py-10 text-center text-muted text-sm">
                No courses or attendance records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Course','Attended','Total','Percentage','Status'].map(h => (
                        <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courseStats.map(ca => (
                      <tr key={ca.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-[13px] font-semibold">{ca.name}</p>
                          <p className="text-[11px] text-muted font-mono">{ca.code}</p>
                        </td>
                        <td className="px-4 py-3 text-[13px] font-semibold">{ca.attended}</td>
                        <td className="px-4 py-3 text-[13px] text-muted">{ca.total}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5 min-w-[160px]">
                            <ProgressBar pct={ca.pct} color={pctColor(ca.pct)} height={5} className="w-24 flex-shrink-0" />
                            <span className="text-[13px] font-bold" style={{ color: pctColor(ca.pct) }}>{ca.pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={pctBadge(ca.pct)}>{ca.pct >= 75 ? 'Good Standing' : 'At Risk'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </DashboardShell>
  )
}