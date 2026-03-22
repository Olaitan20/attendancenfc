import { Card, CardHead } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { initials } from '@/lib/utils'

// Shape coming from Flask /api/attendance
interface AttendanceRecord {
  name: string
  class_group: string
  timestamp: string
  event_type: 'check_in' | 'check_out'
  card_uid: string
}

interface Props { taps: AttendanceRecord[] }

export default function LiveFeed({ taps }: Props) {
  return (
    <Card>
      <CardHead>
        <div>
          <p className="text-[13.5px] font-bold">Live Tap Feed</p>
          <p className="text-[11.5px] text-muted">Auto-refreshes every 3 seconds</p>
        </div>
        <Badge variant="ok">● Live</Badge>
      </CardHead>
      <ul className="max-h-80 overflow-y-auto">
        {taps.length === 0 ? (
          <li className="px-5 py-10 text-center text-muted text-sm">
            Waiting for card taps…
          </li>
        ) : taps.map((tap, i) => {
          const isIn   = tap.event_type === 'check_in'
          const color  = isIn ? '#10b981' : '#f97316'
          const bgRgba = isIn ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)'
          // timestamp is "YYYY-MM-DD HH:MM:SS" — grab just HH:MM
          const time   = tap.timestamp?.split(' ')[1]?.slice(0, 5) ?? ''

          return (
            <li
              key={i}
              className="flex items-center gap-3 px-5 py-3 border-b border-border1 last:border-0 hover:bg-surface2/40 transition-colors animate-slide-in"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: bgRgba, color }}
              >
                {initials(tap.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{tap.name}</p>
                <p className="text-[11.5px] text-muted">
                  {tap.class_group || 'No class'} · {isIn ? '✅ Check In' : '👋 Check Out'}
                </p>
              </div>
              <span className="font-mono text-[11px] text-muted flex-shrink-0">{time}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}