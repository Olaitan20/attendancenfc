'use client'
import { useEffect, useState, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import ProgressBar from '@/components/ui/ProgressBar'
import { Card, CardHead } from '@/components/ui/Card'
import { getTodaySummary, getAttendanceLog, getCourses } from '@/lib/api'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { RiCheckboxCircleLine, RiCloseCircleLine, RiLoginCircleLine, RiLogoutCircleRLine, RiUserStarLine } from 'react-icons/ri'

interface Summary {
  total_users: number
  checked_in: number
  checked_out: number
  absent: number
}
interface Course { id: number; code: string; name: string; color?: string }
interface TapRecord { name: string; timestamp: string; event_type: string; course_code?: string }

const COURSE_COLORS = ['#06b6d4','#f59e0b','#a78bfa','#10b981','#f97316','#3b82f6']

export default function AdminOverviewPage() {
  const [summary, setSummary]   = useState<Summary>({ total_users:0, checked_in:0, checked_out:0, absent:0 })
  const [courses, setCourses]   = useState<Course[]>([])
  const [feed, setFeed]         = useState<TapRecord[]>([])
  const alerts = NOTIFICATIONS.admin

  const load = useCallback(async () => {
    try {
      const [sum, courseData, log] = await Promise.all([
        getTodaySummary(),
        getCourses(),
        getAttendanceLog({ limit: 50 }),
      ])
      setSummary(sum)
      setCourses(Array.isArray(courseData) ? courseData : [])
      setFeed(Array.isArray(log) ? log : [])
    } catch {}
  }, [])

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t) }, [load])

  const pct = summary.total_users > 0 ? Math.round(summary.checked_in / summary.total_users * 100) : 0

  // per-course attendance counts from today's log
  const courseStats = courses.map((c, i) => {
    const count = feed.filter(r => r.course_code === c.code && r.event_type === 'check_in').length
    const rate  = summary.total_users > 0 ? Math.round(count / summary.total_users * 100) : 0
    return { ...c, color: COURSE_COLORS[i % COURSE_COLORS.length], count, rate }
  })

  return (
    <DashboardShell title="Overview">
      <PageHeader title="System Overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<RiUserStarLine />} value={summary.total_users} label="Total Registered"  color="#a78bfa" />
        <StatCard icon={<RiCheckboxCircleLine />} value={summary.checked_in}  label="Checked In Today"  color="#10b981" pct={pct} />
        <StatCard icon={<RiLogoutCircleRLine />} value={summary.checked_out} label="Checked Out"       color="#f97316" />
        <StatCard icon={<RiCloseCircleLine />} value={summary.absent}      label="Absent Today"      color="#f43f5e" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Today&apos;s Attendance — All Courses</p>
          </CardHead>
          <div className="px-5 pb-5 pt-3 flex flex-col gap-4">
            {courseStats.length === 0 ? (
              <p className="text-muted text-sm py-4 text-center">No courses added yet</p>
            ) : courseStats.map(c => (
              <div key={c.id}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="font-semibold">{c.name}</span>
                  <span className="font-mono text-muted">{c.count} checked in</span>
                </div>
                <ProgressBar pct={c.rate} color={c.color} height={7} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Recent Taps</p>
          </CardHead>
          <div className="max-h-80 overflow-y-auto">
            {feed.length === 0 ? (
              <p className="text-muted text-sm py-8 text-center">No taps yet today</p>
            ) : feed.slice(0,10).map((r, i) => (
              <div key={i} className="flex gap-2.5 px-5 py-3 border-b border-border1 last:border-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ background: r.event_type === 'check_in' ? '#10b981' : '#f97316' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{r.name}</p>
                  <p className="text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      {r.course_code ?? 'No course'} · {r.event_type === 'check_in' ? <RiLoginCircleLine /> : <RiLogoutCircleRLine />}
                      {r.event_type === 'check_in' ? 'Check In' : 'Check Out'}
                    </span>
                  </p>
                </div>
                <span className="font-mono text-[11px] text-muted flex-shrink-0">
                  {r.timestamp?.split(' ')[1]?.slice(0,5)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}