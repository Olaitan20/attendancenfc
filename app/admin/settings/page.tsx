'use client'
import { useState } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'
import { Card, CardHead, CardBody } from '@/components/ui/Card'
import { useToast } from '@/hooks/useToast'

const TOGGLE_SETTINGS = [
  { key: 'email',   label: 'Email alerts for at-risk students',  defaultOn: true  },
  { key: 'sms',     label: 'SMS to parents when student absent',  defaultOn: false },
  { key: 'daily',   label: 'Daily summary report',               defaultOn: true  },
  { key: 'reader',  label: 'Reader offline alerts',              defaultOn: true  },
]

export default function AdminSettingsPage() {
  const { toast, showToast } = useToast()
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    () => Object.fromEntries(TOGGLE_SETTINGS.map(s => [s.key, s.defaultOn]))
  )

  return (
    <DashboardShell title="Settings" toast={toast}>
      <PageHeader title="Settings" sub="System-wide configuration" />

      <div className="max-w-xl flex flex-col gap-4">
        {/* Institution config */}
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Institution</p>
          </CardHead>
          <CardBody className="flex flex-col gap-4">
            <Input label="School / Institution Name"   defaultValue="University of Lagos — CS Dept" />
            <Input label="Minimum Attendance Threshold (%)" type="number" defaultValue="75" />
            <Input label="Current Semester / Term"     defaultValue="2024/2025 First Semester" />
            <Input label="Academic Year"               defaultValue="2024/2025" />
            <Button variant="accent"
              onClick={() => showToast('Settings saved!')}>
              Save Changes
            </Button>
          </CardBody>
        </Card>

        {/* Notification toggles */}
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold">Notifications</p>
          </CardHead>
          <CardBody className="p-0">
            {TOGGLE_SETTINGS.map((s, i) => (
              <div key={s.key}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < TOGGLE_SETTINGS.length - 1 ? 'border-b border-border1' : ''
                }`}>
                <span className="text-[13px]">{s.label}</span>
                <button
                  onClick={() => {
                    setToggles(prev => ({ ...prev, [s.key]: !prev[s.key] }))
                    showToast('Setting updated')
                  }}
                  className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
                  style={{ background: toggles[s.key] ? '#06b6d4' : '#1a2030', border: '1px solid #2a3348' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                    style={{ left: toggles[s.key] ? '20px' : '2px' }}
                  />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHead>
            <p className="text-[13.5px] font-bold text-danger">Danger Zone</p>
          </CardHead>
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[13px] font-semibold">Reset All Attendance Data</p>
                <p className="text-[11.5px] text-muted">This cannot be undone.</p>
              </div>
              <Button variant="danger" size="sm"
                onClick={() => showToast('Action disabled in demo mode')}>
                Reset Data
              </Button>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[13px] font-semibold">Export Full Database Backup</p>
                <p className="text-[11.5px] text-muted">Downloads a complete SQL dump.</p>
              </div>
              <Button variant="ghost" size="sm"
                onClick={() => showToast('Backup download started…')}>
                Export Backup
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}
