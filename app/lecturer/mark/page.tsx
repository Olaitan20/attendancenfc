'use client'
import { useState } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import MarkGrid from '@/components/lecturer/MarkGrid'
import Button from '@/components/ui/Button'
import { Card, CardHead } from '@/components/ui/Card'
import { Select, Input } from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import { STUDENTS, COURSES } from '@/lib/mock-data'
import { useToast } from '@/hooks/useToast'
import type { MarkStatus } from '@/lib/types'
import { RiCheckboxCircleLine, RiCloseCircleLine, RiRefreshLine } from 'react-icons/ri'

export default function MarkAttendancePage() {
  const [markState, setMarkState] = useState<Record<string, MarkStatus>>(
    () => Object.fromEntries(STUDENTS.map(s => [s.id, null]))
  )
  const { toast, showToast } = useToast()

  const toggle = (id: string) => {
    setMarkState(prev => {
      const cur = prev[id]
      return { ...prev, [id]: cur === 'present' ? 'absent' : cur === 'absent' ? null : 'present' }
    })
  }

  const markAll = (status: MarkStatus) => {
    setMarkState(Object.fromEntries(STUDENTS.map(s => [s.id, status])))
  }

  const submit = () => {
    const p = Object.values(markState).filter(v => v === 'present').length
    const a = Object.values(markState).filter(v => v === 'absent').length
    if (p + a === 0) { showToast('Please mark at least one student'); return }
    showToast(`Submitted: ${p} present · ${a} absent`)
  }

  const marked  = Object.values(markState).filter(Boolean).length
  const present = Object.values(markState).filter(v => v === 'present').length
  const absent  = Object.values(markState).filter(v => v === 'absent').length

  return (
    <DashboardShell title="Mark Attendance" toast={toast}>
      <PageHeader
        title="Mark Attendance"
        sub="Manually record attendance for a class session"
        actions={
          <Button variant="accent" onClick={submit}>
            <span className="inline-flex items-center gap-1"><RiCheckboxCircleLine /> Submit Attendance</span>
          </Button>
        }
      />

      {/* Selectors row */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-52">
          <Select>
            {COURSES.map(c => <option key={c.id}>{c.id} — {c.name}</option>)}
          </Select>
        </div>
        <div className="w-44">
          <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <Button variant="ghost" size="sm" onClick={() => markAll('present')}>
          <span className="inline-flex items-center gap-1"><RiCheckboxCircleLine /> All Present</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => markAll('absent')}>
          <span className="inline-flex items-center gap-1"><RiCloseCircleLine /> All Absent</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => markAll(null)}>
          <span className="inline-flex items-center gap-1"><RiRefreshLine /> Reset</span>
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Marked',  value: marked,  color: '#3b82f6' },
          { label: 'Present', value: present, color: '#10b981' },
          { label: 'Absent',  value: absent,  color: '#f43f5e' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border1 rounded-card p-4 text-center">
            <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11.5px] text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">Students — CSC301</p>
          <span className="text-[11px] font-mono text-muted2 bg-surface2 border border-border2 rounded-full px-2.5 py-0.5">
            {marked} / {STUDENTS.length} marked
          </span>
        </CardHead>
        <MarkGrid students={STUDENTS} markState={markState} onToggle={toggle} />
      </Card>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}
