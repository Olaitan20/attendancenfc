'use client'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { initials, pctColor, pctBadge } from '@/lib/utils'
import type { Student } from '@/lib/types'

interface Props {
  students: Student[]
  onDelete?: (s: Student) => void
}

export default function StudentRoster({ students, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Name', 'Student ID', 'Class', 'Overall %', 'Card UID', 'Status', ''].map(h => (
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
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                         style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
                      {initials(s.name)}
                    </div>
                    <span className="text-[13px] font-semibold whitespace-nowrap">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted whitespace-nowrap">{s.id}</td>
                <td className="px-4 py-3 text-[13px] whitespace-nowrap">{s.classGroup}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 min-w-[110px]">
                    <ProgressBar pct={s.pct} color={color} height={4} className="w-14 flex-shrink-0" />
                    <span className="text-xs font-bold" style={{ color }}>{s.pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11px]" style={{ color: '#06b6d4' }}>{s.cardUid}</td>
                <td className="px-4 py-3">
                  <Badge variant={pctBadge(s.pct)}>{s.pct >= 75 ? 'Good' : 'At Risk'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Button variant="danger" size="xs" onClick={() => onDelete?.(s)}>Remove</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
