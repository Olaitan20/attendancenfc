'use client'
import RingProgress from '@/components/ui/RingProgress'
import { COURSE_ATTENDANCE } from '@/lib/mock-data'

export default function CourseRingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
      {COURSE_ATTENDANCE.map(ca => (
        <div
          key={ca.id}
          className="bg-surface border border-border1 rounded-card p-4 text-center hover:border-border2 transition-all hover:-translate-y-0.5"
        >
          <div className="flex justify-center">
            <RingProgress pct={ca.pct} color={ca.color} size={72} />
          </div>
          <p className="text-xs font-bold mt-3 truncate">{ca.name}</p>
          <p className="text-[10.5px] text-muted font-mono">{ca.id}</p>
          <p className="text-[11px] text-muted mt-1">{ca.attended}/{ca.total} classes</p>
        </div>
      ))}
    </div>
  )
}
