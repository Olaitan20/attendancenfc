'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardHead } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import { getAttendanceLog } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { RiSearchLine } from 'react-icons/ri'

interface TapRecord {
  id: number
  name: string
  timestamp: string
  event_type: 'check_in' | 'check_out'
  course_code?: string
  course_name?: string
}

export default function HistoryPage() {
  const { user }            = useAuthStore()
  const [log, setLog]       = useState<TapRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await getAttendanceLog({ limit: 500 })
      const all  = Array.isArray(data) ? data : []
      const mine = user ? all.filter((r: TapRecord) => r.name === user.name) : all
      setLog(mine)
    } catch {}
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { load() }, [load])

  const filtered = log.filter(r => {
    const matchSearch = !search || (r.course_code ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !status ||
      (status === 'check_in'  && r.event_type === 'check_in') ||
      (status === 'check_out' && r.event_type === 'check_out')
    return matchSearch && matchStatus
  })

  return (
    <DashboardShell title="History">
      <PageHeader title="Attendance History" sub="All your card taps" />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-52">
          <Input icon={<RiSearchLine />} placeholder="Search course…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-36">
          <Select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Events</option>
            <option value="check_in">Check In</option>
            <option value="check_out">Check Out</option>
          </Select>
        </div>
      </div>

      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">Tap History</p>
          <span className="text-[11px] font-mono text-muted2 bg-surface2 border border-border2 rounded-full px-2.5 py-0.5">
            {filtered.length} records
          </span>
        </CardHead>

        {loading ? (
          <div className="px-5 py-10 text-center text-muted text-sm animate-pulse">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted text-sm">No records found.</div>
        ) : filtered.map((r, i) => {
          const isIn  = r.event_type === 'check_in'
          const date  = r.timestamp?.split(' ')[0] ?? ''
          const time  = r.timestamp?.split(' ')[1]?.slice(0,5) ?? ''
          const day   = date ? new Date(date).getDate().toString().padStart(2,'0') : '—'
          const month = date ? new Date(date).toLocaleString('en', { month:'short' }).toUpperCase() : '—'

          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors">
              <div className="w-12 flex-shrink-0 text-center">
                <p className="text-lg font-extrabold leading-none">{day}</p>
                <p className="text-[10px] font-mono text-muted">{month}</p>
              </div>
              <div className="w-0.5 h-9 rounded-full flex-shrink-0"
                   style={{ background: isIn ? '#10b981' : '#f97316' }} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">{r.course_code ?? 'General'}</p>
                <p className="text-[11.5px] text-muted">{r.course_name ?? ''} · {time}</p>
              </div>
              <Badge variant={isIn ? 'ok' : 'warn'}>{isIn ? 'check in' : 'check out'}</Badge>
            </div>
          )
        })}
      </Card>
    </DashboardShell>
  )
}