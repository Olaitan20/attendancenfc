'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Toast from '@/components/ui/Toast'
import ProgressBar from '@/components/ui/ProgressBar'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHead } from '@/components/ui/Card'
import { getAllUsers, deleteUser, getAttendanceLog } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import { initials, pctColor } from '@/lib/utils'
import { RiSearchLine } from 'react-icons/ri'

interface ApiUser {
  id: number
  name: string
  matric_number: string
  card_uid: string
  role: string
  class_group: string
  created_at: string
  courses: { id: number; code: string; name: string }[]
}

export default function AdminStudentsPage() {
  const [users, setUsers]       = useState<ApiUser[]>([])
  const [attendance, setAtt]    = useState<Record<string, number>>({})
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('')
  const { toast, showToast }    = useToast()

  const load = useCallback(async () => {
    try {
      const [userData, logData] = await Promise.all([
        getAllUsers(),
        getAttendanceLog({ limit: 500 }),
      ])
      const users = Array.isArray(userData) ? userData : []
      setUsers(users)

      // calculate attendance % per user from log
      const log = Array.isArray(logData) ? logData : []
      const totals: Record<string, number> = {}
      log.forEach((r: { name: string; event_type: string }) => {
        if (r.event_type === 'check_in') {
          totals[r.name] = (totals[r.name] ?? 0) + 1
        }
      })
      // turn into % out of last 20 possible classes (approximate)
      const pcts: Record<string, number> = {}
      users.forEach((u: ApiUser) => {
        const count = totals[u.name] ?? 0
        pcts[u.name] = Math.min(100, Math.round((count / Math.max(1, 20)) * 100))
      })
      setAtt(pcts)
    } catch {
      showToast('Could not connect to Flask server')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const students = users.filter(u => u.role === 'student')

  const filtered = students.filter(u => {
    const matchQ = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.matric_number ?? '').toLowerCase().includes(search.toLowerCase()) ||
      u.card_uid.toLowerCase().includes(search.toLowerCase())
    const pct = attendance[u.name] ?? 0
    const matchF = !filter ||
      (filter === 'good' && pct >= 75) ||
      (filter === 'at-risk' && pct < 75)
    return matchQ && matchF
  })

  const handleDelete = async (u: ApiUser) => {
    try {
      await deleteUser(u.id)
      showToast(`${u.name} removed`)
      load()
    } catch {
      showToast('Failed to remove')
    }
  }

  return (
    <DashboardShell title="All Students" toast={toast}>
      <PageHeader
        title="All Students"
        sub={`${students.length} registered students`}
      />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-56">
          <Input icon={<RiSearchLine />} placeholder="Search name, matric, UID…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-36">
          <Select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="good">Good Standing</option>
            <option value="at-risk">At Risk</option>
          </Select>
        </div>
      </div>

      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">Student Roster</p>
          <span className="text-[11px] font-mono text-adm bg-adm/10 rounded-full px-2.5 py-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {filtered.length} students
          </span>
        </CardHead>

        {loading ? (
          <div className="px-5 py-10 text-center text-muted text-sm animate-pulse">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted text-sm">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Name','Matric No.','Courses','Attendance','Card UID','Status',''].map(h => (
                    <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const pct   = attendance[u.name] ?? 0
                  const color = pctColor(pct)
                  return (
                    <tr key={u.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                               style={{ background:'rgba(167,139,250,0.15)', color:'#a78bfa' }}>
                            {initials(u.name)}
                          </div>
                          <span className="text-[13px] font-semibold whitespace-nowrap">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11.5px] text-lecturer">{u.matric_number || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.courses?.length > 0
                            ? u.courses.map(c => (
                                <span key={c.id} className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-student/10 text-student">
                                  {c.code}
                                </span>
                              ))
                            : <span className="text-muted text-[12px]">—</span>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[110px]">
                          <ProgressBar pct={pct} color={color} height={4} className="w-16 flex-shrink-0" />
                          <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-student">{u.card_uid}</td>
                      <td className="px-4 py-3">
                        <Badge variant={pct >= 75 ? 'ok' : 'danger'}>{pct >= 75 ? 'Good' : 'At Risk'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="danger" size="xs" onClick={() => handleDelete(u)}>Remove</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}