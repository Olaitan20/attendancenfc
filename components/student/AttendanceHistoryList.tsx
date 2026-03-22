import Badge from '@/components/ui/Badge'
import { Card, CardHead } from '@/components/ui/Card'
import type { AttendanceRecord } from '@/lib/types'

const statusVariant: Record<string, 'ok' | 'danger' | 'warn'> = {
  present: 'ok',
  absent: 'danger',
  late: 'warn',
}
const statusBar: Record<string, string> = {
  present: '#10b981',
  absent: '#f43f5e',
  late: '#f97316',
}

interface Props {
  records: AttendanceRecord[]
}

export default function AttendanceHistoryList({ records }: Props) {
  return (
    <Card>
      <CardHead>
        <p className="text-[13.5px] font-bold">Tap History</p>
        <span className="text-[11px] font-mono text-muted2 bg-surface2 border border-border2 rounded-full px-2.5 py-0.5">
          {records.length} records
        </span>
      </CardHead>
      <div>
        {records.map(h => (
          <div key={h.id} className="flex items-center gap-3 px-5 py-3 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors">
            {/* date block */}
            <div className="w-12 flex-shrink-0 text-center">
              <p className="text-lg font-extrabold leading-none">{h.day}</p>
              <p className="text-[10px] font-mono text-muted">{h.month}</p>
            </div>
            {/* colour stripe */}
            <div className="w-0.5 h-9 rounded-full flex-shrink-0" style={{ background: statusBar[h.status] }} />
            {/* info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate">{h.course}</p>
              <p className="text-[11.5px] text-muted">{h.time}</p>
            </div>
            <Badge variant={statusVariant[h.status]}>{h.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
