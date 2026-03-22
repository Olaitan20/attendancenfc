import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import type { Lecturer } from '@/lib/types'

interface Props { lecturer: Lecturer }

export default function LecturerCard({ lecturer: l }: Props) {
  const initials = l.name.split(' ').slice(-1)[0].slice(0, 2).toUpperCase()
  return (
    <div className="bg-surface border border-border1 rounded-card overflow-hidden"
         style={{ borderTop: '3px solid #f59e0b' }}>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0"
               style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold truncate">{l.name}</p>
            <p className="text-[12px] text-muted truncate">{l.dept}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {l.courses.map(c => (
            <Badge key={c} variant="lecturer">{c}</Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-muted">Punctuality</span>
          <span className="font-bold text-ok">{l.pct}%</span>
        </div>
        <ProgressBar pct={l.pct} color="#f59e0b" height={4} />
      </div>
    </div>
  )
}
