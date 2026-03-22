'use client'
import { useState } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StudentTable from '@/components/lecturer/StudentTable'
import Modal from '@/components/ui/Modal'
import RingProgress from '@/components/ui/RingProgress'
import Toast from '@/components/ui/Toast'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHead } from '@/components/ui/Card'
import { STUDENTS, COURSES, COURSE_ATTENDANCE } from '@/lib/mock-data'
import { pctColor } from '@/lib/utils'
import type { Student } from '@/lib/types'
import { useToast } from '@/hooks/useToast'

export default function LecturerStudentsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)
  const { toast, showToast } = useToast()

  const filtered = STUDENTS.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardShell title="Students" toast={toast}>
      <PageHeader title="Student Breakdown" sub="Per-student attendance across all your classes" />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-56">
          <Input icon="🔍" placeholder="Search students…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-52">
          <Select>
            {COURSES.map(c => <option key={c.id}>{c.id} — {c.name}</option>)}
          </Select>
        </div>
      </div>

      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">All Students — CSC301</p>
          <span className="text-[11px] font-mono text-muted2 bg-surface2 border border-border2 rounded-full px-2.5 py-0.5">
            {filtered.length} enrolled
          </span>
        </CardHead>
        <StudentTable students={filtered} onView={s => setSelected(s)} />
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`${selected?.name ?? ''} — Attendance Detail`}
        confirmLabel="Export PDF"
        onConfirm={() => showToast('PDF export coming soon!')}
      >
        {selected && (
          <div>
            <div className="flex justify-center mb-4">
              <RingProgress pct={selected.pct} color={pctColor(selected.pct)} size={100} />
            </div>
            <p className="text-center text-[12px] text-muted mb-5">Overall Attendance</p>
            <div className="grid grid-cols-2 gap-2.5">
              {COURSE_ATTENDANCE.map(ca => (
                <div key={ca.id} className="p-3 bg-surface2 rounded-btn border border-border1">
                  <p className="text-[12px] font-bold truncate">{ca.name}</p>
                  <p className="text-[10.5px] text-muted font-mono">{ca.id}</p>
                  <p className="text-[18px] font-extrabold mt-1.5" style={{ color: ca.color }}>
                    {ca.pct}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}
