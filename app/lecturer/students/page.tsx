'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardHead } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import Modal from '@/components/ui/Modal'
import RingProgress from '@/components/ui/RingProgress'
import Toast from '@/components/ui/Toast'
import { Input, Select } from '@/components/ui/Input'
import { getAllUsers, getAttendanceLog, getCourses } from '@/lib/api'
import { initials, pctColor } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { RiSearchLine } from 'react-icons/ri'

interface ApiUser { id: number; name: string; matric_number: string; card_uid: string; courses: { id: number; code: string }[] }
interface Course   { id: number; code: string; name: string }
interface TapRecord { name: string; event_type: string }

export default function LecturerStudentsPage() {
  const [users, setUsers]     = useState<ApiUser[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [log, setLog]         = useState<TapRecord[]>([])
  const [selected, setSelected] = useState<ApiUser | null>(null)
  const [search, setSearch]   = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const { toast, showToast }  = useToast()

  const load = useCallback(async () => {
    try {
      const [userData, courseData, logData] = await Promise.all([
        getAllUsers(),
        getCourses(),
        getAttendanceLog({ limit: 500 }),
      ])
      setUsers(Array.isArray(userData) ? userData.filter((u: ApiUser & { role: string }) => u.role === 'student') : [])
      setCourses(Array.isArray(courseData) ? courseData : [])
      setLog(Array.isArray(logData) ? logData : [])
    } catch {
      showToast('Could not connect to Flask server')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const TOTAL = 20
  const getPct = (name: string) => {
    const count = log.filter(r => r.name === name && r.event_type === 'check_in').length
    return Math.min(100, Math.round((count / TOTAL) * 100))
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.matric_number ?? '').toLowerCase().includes(search.toLowerCase())
    const matchCourse = !courseFilter ||
      u.courses?.some(c => String(c.id) === courseFilter)
    return matchSearch && matchCourse
  })

  return (
    <DashboardShell title="Students" toast={toast}>
      <PageHeader title="Student Breakdown" />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-56">
          <Input icon={<RiSearchLine />} placeholder="Search students…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-52">
          <Select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
            <option value="">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </Select>
        </div>
      </div>

      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">All Students</p>
          <span className="text-[11px] font-mono text-muted2 bg-surface2 border border-border2 rounded-full px-2.5 py-0.5">
            {filtered.length} enrolled
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
                  {['Student','Matric No.','Courses','Attendance %','Status',''].map(h => (
                    <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const pct   = getPct(u.name)
                  const color = pctColor(pct)
                  return (
                    <tr key={u.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                               style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b' }}>
                            {initials(u.name)}
                          </div>
                          <span className="text-[13px] font-semibold whitespace-nowrap">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11.5px] text-lecturer">{u.matric_number || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.courses?.map(c => (
                            <span key={c.id} className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-student/10 text-student">{c.code}</span>
                          )) ?? '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-[130px]">
                          <ProgressBar pct={pct} color={color} height={4} className="w-20 flex-shrink-0" />
                          <span className="text-[13px] font-bold" style={{ color }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={pct >= 75 ? 'ok' : 'danger'}>{pct >= 75 ? 'Good' : 'At Risk'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="xs" onClick={() => setSelected(u)}>View</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`${selected?.name ?? ''} — Detail`}
      >
        {selected && (
          <div>
            <div className="flex justify-center mb-3">
              <RingProgress pct={getPct(selected.name)} color={pctColor(getPct(selected.name))} size={100} />
            </div>
            <p className="text-center text-[12px] text-muted mb-4">Overall Attendance</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Matric Number</span>
                <span className="font-mono font-semibold">{selected.matric_number || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Card UID</span>
                <span className="font-mono text-student">{selected.card_uid}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Check-ins</span>
                <span className="font-semibold">
                  {log.filter(r => r.name === selected.name && r.event_type === 'check_in').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
} 