'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import LiveFeed from '@/components/lecturer/LiveFeed'
import Badge from '@/components/ui/Badge'
import { Card, CardHead } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { COURSES } from '@/lib/mock-data'
import { getAttendanceLog, getTodaySummary, getAllUsers } from '@/lib/api'
import { initials } from '@/lib/utils'

interface AttendanceRecord {
  name: string
  class_group: string
  timestamp: string
  event_type: 'check_in' | 'check_out'
  card_uid: string
}

interface Summary {
  total_users: number
  checked_in: number
  checked_out: number
  absent: number
}

interface ApiUser {
  id: number
  name: string
  card_uid: string
  class_group: string
}

export default function LecturerLivePage() {
  const [feed, setFeed]         = useState<AttendanceRecord[]>([])
  const [summary, setSummary]   = useState<Summary>({ total_users: 0, checked_in: 0, checked_out: 0, absent: 0 })
  const [allUsers, setAllUsers] = useState<ApiUser[]>([])

  const refresh = useCallback(async () => {
    try {
      const [log, sum, users] = await Promise.all([
        getAttendanceLog({ limit: 20 }),
        getTodaySummary(),
        getAllUsers(),
      ])
      setFeed(Array.isArray(log) ? log : [])
      setSummary(sum)
      setAllUsers(Array.isArray(users) ? users : [])
    } catch {
      // Flask not running yet — silently retry
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 3000) // poll every 3 seconds
    return () => clearInterval(interval)
  }, [refresh])

  // Who hasn't tapped today
  const checkedInNames = new Set(feed.filter(r => r.event_type === 'check_in').map(r => r.name))
  const absent = allUsers.filter(u => !checkedInNames.has(u.name))

  const pct = summary.total_users > 0
    ? Math.round((summary.checked_in / summary.total_users) * 100)
    : 0

  return (
    <DashboardShell title="Live Class">
      <PageHeader
        title="Live Class"
        sub="Real-time attendance feed"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Select defaultValue="CSC301" className="w-52">
              {COURSES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </Select>
            <Badge variant="ok">● Live</Badge>
          </div>
        }
      />

      {/* Stats — real numbers from Flask */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon="✅" value={summary.checked_in}  label="Checked In"      color="#10b981" pct={pct} />
        <StatCard icon="❌" value={summary.absent}       label="Absent"          color="#f43f5e" />
        <StatCard icon="📊" value={`${pct}%`}           label="Attendance Rate" color="#f59e0b" pct={pct} />
        <StatCard icon="👤" value={summary.total_users} label="Total Enrolled"  color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Live feed — real taps from Flask */}
        <LiveFeed taps={feed} />

        {/* Absent list */}
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Absent Students</p>
            <Badge variant="danger">{absent.length}</Badge>
          </CardHead>
          <div className="p-3 flex flex-col gap-2 max-h-80 overflow-y-auto">
            {absent.length === 0 ? (
              <p className="text-center text-muted text-sm py-6">Everyone has checked in 🎉</p>
            ) : absent.map(s => (
              <div key={s.id}
                className="flex items-center gap-2.5 p-2.5 bg-danger/[0.04] border border-danger/15 rounded-btn">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                     style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>
                  {initials(s.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{s.name}</p>
                  <p className="text-[11px] text-muted font-mono">{s.card_uid}</p>
                </div>
                <Badge variant="danger">absent</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}