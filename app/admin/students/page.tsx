'use client'
import { useState } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import StudentRoster from '@/components/admin/StudentRoster'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHead } from '@/components/ui/Card'
import { getAllUsers } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import type { Student } from '@/lib/types'

export default async function AdminStudentsPage() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('')
  const { toast, showToast } = useToast()
  const students = await getAllUsers()

  const filtered = students.filter(s => {
    const matchQ = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.includes(search) || s.cardUid.toLowerCase().includes(search.toLowerCase())
    const matchF = !filter
      || (filter === 'good'    && s.pct >= 75)
      || (filter === 'at-risk' && s.pct < 75)
    return matchQ && matchF
  })

  const handleDelete = (s: Student) => showToast(`${s.name} removed (demo)`)

  return (
    <DashboardShell title="All Students" toast={toast}>
      <PageHeader
        title="All Students"
        sub={`${STUDENTS.length} registered students`}
        actions={
          <Button variant="accent" size="sm"
            onClick={() => showToast('NFC card enrollment — connect reader first')}>
            + Add Student
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-56">
          <Input icon="🔍" placeholder="Search name, ID, card…" value={search}
            onChange={e => setSearch(e.target.value)} />
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
        <StudentRoster students={filtered} onDelete={handleDelete} />
      </Card>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}
