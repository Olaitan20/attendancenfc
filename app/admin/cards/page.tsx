'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import NFCReaderCard from '@/components/admin/NFCReaderCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHead } from '@/components/ui/Card'
import { getAllUsers, deleteUser, registerCard, getCourses } from '@/lib/api'
import { NFC_READERS } from '@/lib/mock-data'
import { useToast } from '@/hooks/useToast'
import { RiSearchLine } from 'react-icons/ri'

interface ApiUser {
  id: number
  card_uid: string
  name: string
  matric_number: string
  role: string
  class_group: string
  created_at: string
  courses: ApiCourse[]
}

interface ApiCourse {
  id: number
  code: string
  name: string
}

const emptyForm = {
  card_uid:      '',
  name:          '',
  matric_number: '',
  role:          'student',
  class_group:   '',
  email:         '',
  phone:         '',
  course_ids:    [] as number[],
}

export default function AdminCardsPage() {
  const [users, setUsers]         = useState<ApiUser[]>([])
  const [courses, setCourses]     = useState<ApiCourse[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const { toast, showToast }      = useToast()

  const loadData = useCallback(async () => {
    try {
      const [userData, courseData] = await Promise.all([getAllUsers(), getCourses()])
      setUsers(Array.isArray(userData) ? userData : [])
      setCourses(Array.isArray(courseData) ? courseData : [])
    } catch {
      showToast('Could not connect to Flask server')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadData() }, [loadData])

  const filtered = users.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.card_uid.toLowerCase().includes(search.toLowerCase()) ||
    (u.matric_number ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const toggleCourse = (id: number) => {
    setForm(f => ({
      ...f,
      course_ids: f.course_ids.includes(id)
        ? f.course_ids.filter(c => c !== id)
        : [...f.course_ids, id],
    }))
  }

  const handleRegister = async () => {
    if (!form.card_uid.trim() || !form.name.trim()) {
      showToast('Card UID and Name are required')
      return
    }
    setSubmitting(true)
    try {
      const result = await registerCard(form)
      if (result.success) {
        showToast(`${result.message}`)
        setForm(emptyForm)
        setModalOpen(false)
        loadData()
      } else {
        showToast(`${result.message}`)
      }
    } catch {
      showToast('Failed to register card')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (user: ApiUser) => {
    try {
      await deleteUser(user.id)
      showToast(`${user.name} removed`)
      loadData()
    } catch {
      showToast('Failed to remove user')
    }
  }

  return (
    <DashboardShell title="NFC Cards" toast={toast}>
      <PageHeader
        title="NFC Cards"
        sub="Manage registered cards and reader status"
        actions={
          <Button variant="accent" size="sm" onClick={() => setModalOpen(true)}>
            + Enroll New Card
          </Button>
        }
      />

      {/* Reader status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {NFC_READERS.map(r => <NFCReaderCard key={r.uid} reader={r} />)}
      </div>

      {/* Search */}
      <div className="mb-4 w-full sm:w-64">
        <Input icon={<RiSearchLine />} placeholder="Search name, UID, matric…" value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">Registered Cards</p>
          <Badge variant="admin">{filtered.length} cards</Badge>
        </CardHead>

        {loading ? (
          <div className="px-5 py-10 text-center text-muted text-sm animate-pulse">
            Loading from database…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted text-sm">
            No cards registered yet. Click &quot;+ Enroll New Card&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Name', 'Matric No.', 'Card UID', 'Role', 'Courses', 'Registered', ''].map(h => (
                    <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-semibold whitespace-nowrap">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-lecturer">
                      {u.matric_number || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-student tracking-widest">
                      {u.card_uid}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="muted">{u.role}</Badge>
                    </td>
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
                    <td className="px-4 py-3 font-mono text-[11px] text-muted whitespace-nowrap">
                      {u.created_at?.split(' ')[0] ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="danger" size="xs" onClick={() => handleRemove(u)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Enroll modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setForm(emptyForm) }}
        title="Enroll New NFC Card"
        confirmLabel={submitting ? 'Registering…' : 'Register Card'}
        onConfirm={handleRegister}
      >
        <div className="flex flex-col gap-3.5">
          {/* Card UID */}
          <Input
            label="Card UID  (tap card on reader → copy UID from reader terminal)"
            placeholder="e.g. 04369D73110189"
            value={form.card_uid}
            onChange={e => setForm(f => ({ ...f, card_uid: e.target.value.toUpperCase() }))}
            className="font-mono tracking-widest text-student"
          />

          {/* Name + Matric */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              placeholder="e.g. Ade Bello"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Matric Number"
              placeholder="e.g. CSC/21/001"
              value={form.matric_number}
              onChange={e => setForm(f => ({ ...f, matric_number: e.target.value }))}
              className="font-mono"
            />
          </div>

          {/* Role + Class */}
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="staff">Staff</option>
            </Select>
            <Input
              label="Class / Level"
              placeholder="e.g. CSC 300L"
              value={form.class_group}
              onChange={e => setForm(f => ({ ...f, class_group: e.target.value }))}
            />
          </div>

          {/* Courses */}
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wide mb-2">
              Courses Enrolled In
            </label>
            {courses.length === 0 ? (
              <p className="text-[12px] text-muted">
                No courses yet — add courses first via the terminal or API.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {courses.map(c => {
                  const selected = form.course_ids.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCourse(c.id)}
                      className={`text-left px-3 py-2 rounded-btn border text-[12px] transition-all ${
                        selected
                          ? 'border-student bg-student/10 text-student font-semibold'
                          : 'border-border2 bg-surface2 text-muted2 hover:border-border2'
                      }`}
                    >
                      <p className="font-mono font-bold">{c.code}</p>
                      <p className="text-[11px] truncate">{c.name}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email (optional)"
              type="email"
              placeholder="student@uni.edu"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="08012345678"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}