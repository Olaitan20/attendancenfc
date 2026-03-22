'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import LecturerCard from '@/components/admin/LecturerCard'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { LECTURERS } from '@/lib/mock-data'
import { useToast } from '@/hooks/useToast'

export default function AdminLecturersPage() {
  const { toast, showToast } = useToast()

  return (
    <DashboardShell title="Lecturers" toast={toast}>
      <PageHeader
        title="Lecturers"
        sub={`${LECTURERS.length} active faculty members`}
        actions={
          <Button variant="accent" size="sm" onClick={() => showToast('Add lecturer form coming soon!')}>
            + Add Lecturer
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {LECTURERS.map(l => <LecturerCard key={l.id} lecturer={l} />)}
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}
