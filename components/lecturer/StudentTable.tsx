'use client'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { initials, pctColor, pctBadge } from '@/lib/utils'
import type { Student } from '@/lib/types'

interface Props {
  students: Student[]
  onView?: (s: Student) => void
}

export default function StudentTable({ students, onView }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Student', 'ID', 'Attendance %', 'Status', ''].map(h => (
              <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const color = pctColor(s.pct)
            return (
              <tr key={s.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
                    >
                      {initials(s.name)}
                    </div>
                    <span className="text-[13px] font-semibold whitespace-nowrap">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11.5px] text-muted whitespace-nowrap">{s.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-[130px]">
                    <ProgressBar pct={s.pct} color={color} height={4} className="w-20 flex-shrink-0" />
                    <span className="text-[13px] font-bold whitespace-nowrap" style={{ color }}>{s.pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={pctBadge(s.pct)}>{s.pct >= 75 ? 'Good' : 'At Risk'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="xs" onClick={() => onView?.(s)}>View</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
