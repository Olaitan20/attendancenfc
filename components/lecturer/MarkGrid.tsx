'use client'
import { initials, cn } from '@/lib/utils'
import type { Student, MarkStatus } from '@/lib/types'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri'

interface Props {
  students: Student[]
  markState: Record<string, MarkStatus>
  onToggle: (id: string) => void
}

export default function MarkGrid({ students, markState, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-4">
      {students.map(s => {
        const st = markState[s.id]
        return (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            className={cn(
              'flex items-center gap-2.5 p-3 rounded-btn border-[1.5px] text-left transition-all',
              st === 'present' && 'border-ok bg-ok/5',
              st === 'absent'  && 'border-danger bg-danger/5',
              !st              && 'border-border1 bg-surface2 hover:border-border2'
            )}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: st === 'present' ? 'rgba(16,185,129,0.2)' : st === 'absent' ? 'rgba(244,63,94,0.2)' : 'var(--surface3)',
                color: st === 'present' ? '#10b981' : st === 'absent' ? '#f43f5e' : '#64748b',
              }}
            >
              {initials(s.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold truncate">{s.name}</p>
              <p className="text-[10.5px] text-muted font-mono">{s.id}</p>
            </div>
            <span className="text-base flex-shrink-0">
              {st === 'present' ? <RiCheckboxCircleLine /> : st === 'absent' ? <RiCloseCircleLine /> : <RiCheckboxBlankCircleLine />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
