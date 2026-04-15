'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHead } from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { getCourses, createCourse, deleteCourse, updateCourse, getLecturers, getCourseStudents } from '@/lib/api'
import { useToast } from '@/hooks/useToast'

interface Course {
  id: number; code: string; name: string
  lecturer_id: number; lecturer: string; lecturer_name: string
  day: string; time: string; room: string; enrolled_count: number
}
interface Lecturer { id: number; name: string }
interface Student  { id: number; name: string; matric_number: string; card_uid: string }

const emptyForm = { code:'', name:'', lecturer_id:'', day:'', time:'', room:'' }
const COLORS = ['#06b6d4','#f59e0b','#a78bfa','#10b981','#f97316','#3b82f6']

export default function AdminCoursesPage() {
  const [courses,   setCourses]   = useState<Course[]>([])
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [form,      setForm]      = useState(emptyForm)
  const [viewCourse, setViewCourse] = useState<Course | null>(null)
  const [students,  setStudents]  = useState<Student[]>([])
  const { toast, showToast }      = useToast()

  const load = useCallback(async () => {
    try {
      const [c, l] = await Promise.all([getCourses(), getLecturers()])
      setCourses(Array.isArray(c) ? c : [])
      setLecturers(Array.isArray(l) ? l : [])
    } catch { showToast('Could not load data') }
    finally { setLoading(false) }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditCourse(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit   = (c: Course) => {
    setEditCourse(c)
    setForm({ code: c.code, name: c.name, lecturer_id: String(c.lecturer_id ?? ''), day: c.day ?? '', time: c.time ?? '', room: c.room ?? '' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.code || !form.name) { showToast('Course code and name are required'); return }
    const payload = { ...form, lecturer_id: form.lecturer_id ? Number(form.lecturer_id) : null }
    if (editCourse) {
      const r = await updateCourse(editCourse.id, payload)
      if (r.success) { showToast('✅ Course updated'); load(); setModalOpen(false) }
      else showToast(`❌ ${r.message}`)
    } else {
      const r = await createCourse(payload as any)
      if (r.success) { showToast(`✅ ${r.message}`); load(); setModalOpen(false) }
      else showToast(`❌ ${r.message}`)
    }
  }

  const handleDelete = async (c: Course) => {
    if (!confirm(`Delete ${c.code}? Students will be unenrolled.`)) return
    const r = await deleteCourse(c.id)
    if (r.success) { showToast(`🗑️ ${c.code} deleted`); load() }
  }

  const viewStudents = async (c: Course) => {
    setViewCourse(c)
    const s = await getCourseStudents(c.id)
    setStudents(Array.isArray(s) ? s : [])
  }

  const filtered = courses.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.lecturer_name ?? c.lecturer ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardShell title="Courses" toast={toast}>
      <PageHeader
        title="Course Management"
        sub={`${courses.length} courses · manage lecturers and enrollments`}
        actions={<Button variant="accent" size="sm" onClick={openCreate}>+ Add Course</Button>}
      />

      <div className="mb-5 w-full sm:w-64">
        <Input icon="🔍" placeholder="Search courses…" value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted animate-pulse">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const color = COLORS[i % COLORS.length]
            const lec   = c.lecturer_name ?? c.lecturer ?? 'Unassigned'
            return (
              <div key={c.id} className="bg-surface border border-border1 rounded-card overflow-hidden hover:border-border2 transition-all"
                   style={{ borderTop: `3px solid ${color}` }}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-mono text-[12px] font-bold" style={{ color }}>{c.code}</p>
                      <p className="text-[14px] font-bold mt-0.5">{c.name}</p>
                    </div>
                    <span className="text-[11px] font-mono text-muted bg-surface2 border border-border1 rounded-full px-2 py-0.5 flex-shrink-0">
                      {c.enrolled_count} students
                    </span>
                  </div>

                  <div className="p-2.5 bg-surface2 rounded-btn mb-3">
                    <p className="text-[11px] text-muted mb-0.5">Lecturer</p>
                    <p className="text-[13px] font-semibold">{lec}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11.5px] text-muted mb-4">
                    {c.day  && <span>📅 {c.day}</span>}
                    {c.time && <span>⏰ {c.time}</span>}
                    {c.room && <span>📍 {c.room}</span>}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="xs" onClick={() => viewStudents(c)} className="flex-1">
                      👥 Students
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => openEdit(c)}>✏️ Edit</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(c)}>🗑️</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCourse ? `Edit ${editCourse.code}` : 'Add New Course'}
        confirmLabel={editCourse ? 'Save Changes' : 'Create Course'}
        onConfirm={handleSave}
      >
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Course Code" placeholder="e.g. CSC301"
              value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              className="font-mono" disabled={!!editCourse} />
            <Input label="Course Name" placeholder="e.g. Data Structures"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wide mb-1.5">
              Assign Lecturer
            </label>
            <Select value={form.lecturer_id} onChange={e => setForm(f => ({ ...f, lecturer_id: e.target.value }))}>
              <option value="">— No lecturer assigned —</option>
              {lecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Day(s)" placeholder="Mon/Wed" value={form.day}
              onChange={e => setForm(f => ({ ...f, day: e.target.value }))} />
            <Input label="Time" placeholder="8:00 AM" value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            <Input label="Room" placeholder="Lab 2" value={form.room}
              onChange={e => setForm(f => ({ ...f, room: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* Students in course modal */}
      <Modal
        open={!!viewCourse}
        onClose={() => setViewCourse(null)}
        title={`Students in ${viewCourse?.code ?? ''} — ${viewCourse?.name ?? ''}`}
      >
        {students.length === 0 ? (
          <p className="text-center text-muted text-sm py-6">No students enrolled yet.</p>
        ) : (
          <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
            {students.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 bg-surface2 rounded-btn">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                     style={{ background:'rgba(6,182,212,.15)', color:'#06b6d4' }}>
                  {s.name.split(' ').map((w: string) => w[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{s.name}</p>
                  <p className="text-[11px] text-muted font-mono">{s.matric_number ?? '—'}</p>
                </div>
                <span className="font-mono text-[11px] text-student">{s.card_uid}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}