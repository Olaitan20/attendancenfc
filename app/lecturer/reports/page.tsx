'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { Card, CardHead, CardBody } from '@/components/ui/Card'
import { COURSES } from '@/lib/mock-data'
import { useToast } from '@/hooks/useToast'

const REPORT_STATS: Record<string, { held: number; avgPresent: number; avgRate: number; atRisk: number }> = {
  CSC301: { held: 22, avgPresent: 26, avgRate: 87, atRisk: 2 },
  MTH201: { held: 20, avgPresent: 22, avgRate: 73, atRisk: 4 },
  CSC305: { held: 18, avgPresent: 19, avgRate: 65, atRisk: 5 },
  ENG201: { held: 16, avgPresent: 27, avgRate: 94, atRisk: 1 },
  CSC311: { held: 21, avgPresent: 24, avgRate: 80, atRisk: 3 },
}

export default function ReportsPage() {
  const { toast, showToast } = useToast()

  return (
    <DashboardShell title="Reports & Export" toast={toast}>
      <PageHeader
        title="Reports & Export"
        sub="Per-course attendance summaries"
        actions={
          <Button variant="ghost" size="sm" onClick={() => showToast('Bulk export started…')}>
            ⬇ Export All CSV
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COURSES.map(c => {
          const s = REPORT_STATS[c.id]
          return (
            <Card key={c.id} accentBorder={c.color}>
              <CardHead>
                <div>
                  <p className="text-[13.5px] font-bold">{c.name}</p>
                  <p className="text-[11.5px] text-muted">{c.id} · {c.lecturer}</p>
                </div>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => showToast(`CSV exported for ${c.id}!`)}
                >
                  ⬇ CSV
                </Button>
              </CardHead>
              <CardBody>
                {/* 4-stat mini grid */}
                <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                  {[
                    { label: 'Classes Held', value: s.held,       color: c.color   },
                    { label: 'Avg Present',  value: s.avgPresent, color: '#10b981' },
                    { label: 'Avg Rate',     value: `${s.avgRate}%`, color: '#e2e8f5' },
                    { label: 'At Risk',      value: s.atRisk,     color: '#f43f5e' },
                  ].map(st => (
                    <div key={st.label} className="bg-surface2 rounded-btn p-2">
                      <p className="text-lg font-extrabold" style={{ color: st.color }}>{st.value}</p>
                      <p className="text-[10px] text-muted leading-tight">{st.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted">Average Attendance Rate</span>
                  <span className="font-bold" style={{ color: c.color }}>{s.avgRate}%</span>
                </div>
                <ProgressBar pct={s.avgRate} color={c.color} height={5} />
              </CardBody>
            </Card>
          )
        })}
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}
