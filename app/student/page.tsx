'use client'
import { useEffect, useState, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import { Card, CardHead } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import { getAttendanceLog, getTodaySummary } from '@/lib/api'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { RiBarChartBoxLine, RiBook2Line, RiCalendarCheckLine, RiCheckboxCircleLine, RiLoginCircleLine, RiLogoutCircleRLine } from 'react-icons/ri'

interface TapRecord {
  name: string
  timestamp: string
  event_type: 'check_in' | 'check_out'
  course_code?: string
  course_name?: string
}

export default function StudentHome() {
  const { user }                  = useAuthStore()
  const [log, setLog]             = useState<TapRecord[]>([])
  const [summary, setSummary]     = useState({ total_users:0, checked_in:0, checked_out:0, absent:0 })
  const [loading, setLoading]     = useState(true)
  const notifs                    = NOTIFICATIONS.student

  const load = useCallback(async () => {
    try {
      const [logData, sumData] = await Promise.all([
        getAttendanceLog({ limit: 100 }),
        getTodaySummary(),
      ])
      const all = Array.isArray(logData) ? logData : []
      // filter to only this student's records
      const mine = user ? all.filter((r: TapRecord) => r.name === user.name) : all
      setLog(mine)
      setSummary(sumData)
    } catch {}
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { load() }, [load])

  const myCheckIns   = log.filter(r => r.event_type === 'check_in').length
  const totalClasses = Math.max(myCheckIns, 1)
  const pct          = Math.min(100, Math.round((myCheckIns / Math.max(totalClasses, 20)) * 100))
  const todayChecked = log.some(r => {
    const today = new Date().toISOString().split('T')[0]
    return r.timestamp?.startsWith(today) && r.event_type === 'check_in'
  })

  return (
    <DashboardShell title="Dashboard">
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] ?? 'Student'}`}
        sub={new Date().toLocaleDateString('en-NG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<RiBarChartBoxLine />} value={`${pct}%`}      label="Overall Attendance" color="#06b6d4" pct={pct} />
        <StatCard icon={<RiCheckboxCircleLine />} value={myCheckIns}      label="Total Check-ins"    color="#10b981" />
        <StatCard icon={<RiCalendarCheckLine />} value={todayChecked ? 'Yes' : 'No'} label="Checked In Today" color={todayChecked ? '#10b981' : '#f43f5e'} />
        <StatCard icon={<RiBook2Line />} value={summary.total_users} label="Total Students" color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">My Recent Taps</p>
          </CardHead>
          {loading ? (
            <div className="px-5 py-8 text-center text-muted text-sm animate-pulse">Loading…</div>
          ) : log.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted text-sm">No attendance records yet.</div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {log.slice(0, 10).map((r, i) => {
                const isIn = r.event_type === 'check_in'
                const time = r.timestamp?.split(' ')[1]?.slice(0, 5) ?? ''
                const date = r.timestamp?.split(' ')[0] ?? ''
                return (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                         style={{ background: isIn ? '#10b981' : '#f97316' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold">{r.course_code ?? 'General'}</p>
                      <p className="text-[11.5px] text-muted">{r.course_name ?? ''}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-mono">{time}</p>
                      <p className="text-[11px] text-muted font-mono">{date}</p>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: isIn ? '#10b981' : '#f97316' }}>
                      <span className="inline-flex items-center gap-1">
                        {isIn ? <RiLoginCircleLine /> : <RiLogoutCircleRLine />}
                        {isIn ? 'In' : 'Out'}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Notifications</p>
          </CardHead>
          {notifs.map((n, i) => (
            <div key={i} className="flex gap-2.5 px-5 py-3.5 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: n.color }} />
              <div>
                <p className={`text-[12.5px] leading-snug ${n.read ? 'font-normal text-muted2' : 'font-semibold'}`}>{n.msg}</p>
                <p className="text-[11px] text-muted font-mono mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </DashboardShell>
  )
}