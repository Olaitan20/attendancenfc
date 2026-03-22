'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardHead } from '@/components/ui/Card'
import { NOTIFICATIONS } from '@/lib/mock-data'

export default function AdminAlertsPage() {
  const alerts = NOTIFICATIONS.admin
  const unread = alerts.filter(a => !a.read)
  const earlier = alerts.filter(a => a.read)

  return (
    <DashboardShell title="Alerts">
      <PageHeader title="System Alerts" sub={`${unread.length} new alerts`} />

      <div className="max-w-2xl flex flex-col gap-4">
        {unread.length > 0 && (
          <Card>
            <CardHead>
              <p className="text-[13.5px] font-bold">New</p>
              <span className="w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                {unread.length}
              </span>
            </CardHead>
            {unread.map((a, i) => (
              <div key={i} className="flex gap-3 px-5 py-4 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: a.color }} />
                <div>
                  <p className="text-[13.5px] font-semibold leading-snug">{a.msg}</p>
                  <p className="text-[11px] text-muted font-mono mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </Card>
        )}
        {earlier.length > 0 && (
          <Card>
            <CardHead><p className="text-[13.5px] font-bold text-muted">Earlier</p></CardHead>
            {earlier.map((a, i) => (
              <div key={i} className="flex gap-3 px-5 py-4 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 opacity-40" style={{ background: a.color }} />
                <div>
                  <p className="text-[13px] text-muted2 leading-snug">{a.msg}</p>
                  <p className="text-[11px] text-muted font-mono mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
