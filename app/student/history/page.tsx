'use client'
import { useState } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import AttendanceHistoryList from '@/components/student/AttendanceHistoryList'
import { Input, Select } from '@/components/ui/Input'
import { HISTORY, COURSES } from '@/lib/mock-data'

export default function HistoryPage() {
  const [search, setSearch]   = useState('')
  const [course, setCourse]   = useState('')
  const [status, setStatus]   = useState('')

  const filtered = HISTORY.filter(h => {
    const matchSearch = !search || h.course.toLowerCase().includes(search.toLowerCase())
    const matchCourse = !course || h.course === course
    const matchStatus = !status || h.status === status
    return matchSearch && matchCourse && matchStatus
  })

  return (
    <DashboardShell title="History">
      <PageHeader title="Attendance History" sub="Full record of all your class taps" />

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="w-full sm:w-52">
          <Input icon="🔍" placeholder="Search course…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-40">
          <Select value={course} onChange={e => setCourse(e.target.value)}>
            <option value="">All Courses</option>
            {COURSES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
          </Select>
        </div>
        <div className="w-36">
          <Select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </Select>
        </div>
      </div>

      <AttendanceHistoryList records={filtered} />
    </DashboardShell>
  )
}
