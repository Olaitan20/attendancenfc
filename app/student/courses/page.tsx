'use client'
import { useEffect, useState, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardHead } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Toast from '@/components/ui/Toast'
import { Input, Select } from '@/components/ui/Input'
import { getCourses, enrollInCourse, unenrollFromCourse, getLecturerCourses } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'

interface Course {
  id: number
  code: string
  name: string
  lecturer: string
  lecturer_name: string
  lecturer_id: number
  day: string
  time: string
  room: string
  enrolled_count: number
}

interface EnrolledCourse extends Course {
  enrolled: boolean
}

const COLORS = ['#06b6d4','#f59e0b','#a78bfa','#10b981','#f97316','#3b82f6','#ec4899']

export default function StudentCoursesPage() {
  const { user }            = useAuthStore()
  const [courses, setCourses]   = useState<EnrolledCourse[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const { toast, showToast }    = useToast()

  const load = useCallback(async () => {
    if (!user) return
    try {
      const all = await getCourses()
      const myIds = new Set((user.courses ?? []).map((c: { id: number }) => c.id))
      setCourses(
        (Array.isArray(all) ? all : []).map((c: Course, i: number) => ({
          ...c,
          color: COLORS[i % COLORS.length],
          enrolled: myIds.has(c.id),
        }))
      )
    } catch {
      showToast('Could not load courses')
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => { load() }, [load])

  const handleToggle = async (course: EnrolledCourse) => {
    if (!user) return
    try {
      if (course.enrolled) {
        const r = await unenrollFromCourse(user.id, course.id)
        if (r.success) {
          showToast(`Unenrolled from ${course.code}`)
          setCourses(cs => cs.map(c => c.id === course.id ? { ...c, enrolled: false, enrolled_count: c.enrolled_count - 1 } : c))
        } else {
          showToast(`❌ ${r.message}`)
        }
      } else {
        const r = await enrollInCourse(user.id, course.id)
        if (r.success) {
          showToast(`✅ Enrolled in ${course.code}`)
          setCourses(cs => cs.map(c => c.id === course.id ? { ...c, enrolled: true, enrolled_count: c.enrolled_count + 1 } : c))
        } else {
          showToast(`❌ ${r.message}`)
        }
      }
    } catch {
      showToast('❌ Action failed')
    }
  }

  const filtered = courses.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.lecturer_name ?? c.lecturer ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'enrolled' ? c.enrolled :
      filter === 'available'? !c.enrolled : true
    return matchSearch && matchFilter
  })

  const enrolledCount = courses.filter(c => c.enrolled).length

  return (
    <DashboardShell title="My Courses" toast={toast}>
      <PageHeader
        title="Course Registration"
        sub="Enroll in your courses for this semester"
        actions={
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Enrolled in</span>
            <span className="font-bold text-student">{enrolledCount}</span>
            <span className="text-muted">course{enrolledCount !== 1 ? 's' : ''}</span>
          </div>
        }
      />

      {/* Summary of enrolled courses */}
      {enrolledCount > 0 && (
        <div className="mb-5 p-4 bg-student/5 border border-student/20 rounded-card">
          <p className="text-[12px] font-bold text-student mb-2">Your Enrolled Courses</p>
          <div className="flex flex-wrap gap-2">
            {courses.filter(c => c.enrolled).map(c => (
              <div key={c.id} className="flex items-center gap-2 bg-surface2 border border-border2 rounded-btn px-3 py-1.5">
                <span className="font-mono text-[12px] font-bold text-student">{c.code}</span>
                <span className="text-[12px] text-muted">{c.name}</span>
                <span className="text-[11px] text-muted2">· {c.lecturer_name ?? c.lecturer ?? 'TBA'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-60">
          <Input icon="🔍" placeholder="Search course or lecturer…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-40">
          <Select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Courses</option>
            <option value="enrolled">Enrolled</option>
            <option value="available">Not Enrolled</option>
          </Select>
        </div>
      </div>

      {/* Course cards */}
      {loading ? (
        <div className="py-16 text-center text-muted animate-pulse">Loading courses…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const color = COLORS[i % COLORS.length]
            const lec   = c.lecturer_name ?? c.lecturer ?? 'TBA'
            return (
              <div
                key={c.id}
                className="bg-surface border border-border1 rounded-card overflow-hidden hover:border-border2 transition-all"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-mono text-[12px] font-bold" style={{ color }}>{c.code}</p>
                      <p className="text-[14px] font-bold mt-0.5">{c.name}</p>
                    </div>
                    {c.enrolled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: `${color}15`, color }}>
                        ✓ Enrolled
                      </span>
                    )}
                  </div>

                  {/* Lecturer */}
                  <div className="flex items-center gap-2 mb-4 p-2.5 bg-surface2 rounded-btn">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                         style={{ background: `${color}20`, color }}>
                      {lec.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold truncate">{lec}</p>
                      <p className="text-[10.5px] text-muted">Lecturer</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-[11.5px]">
                    {c.day && (
                      <div className="flex items-center gap-1.5 text-muted">
                        <span>📅</span> <span>{c.day}</span>
                      </div>
                    )}
                    {c.time && (
                      <div className="flex items-center gap-1.5 text-muted">
                        <span>⏰</span> <span>{c.time}</span>
                      </div>
                    )}
                    {c.room && (
                      <div className="flex items-center gap-1.5 text-muted">
                        <span>📍</span> <span>{c.room}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-muted">
                      <span>👥</span> <span>{c.enrolled_count} enrolled</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleToggle(c)}
                    className="w-full py-2.5 rounded-btn text-[13px] font-bold transition-all"
                    style={c.enrolled
                      ? { background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.25)' }
                      : { background: color, color: '#000' }
                    }
                  >
                    {c.enrolled ? '− Drop Course' : '+ Enroll Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}