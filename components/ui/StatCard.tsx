import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  value: string | number
  label: string
  sub?: string
  color?: string
  pct?: number
}

export default function StatCard({ icon, value, label, sub, color = '#06b6d4', pct }: StatCardProps) {
  return (
    <div className="bg-surface border border-border1 rounded-card p-5 relative overflow-hidden transition-transform hover:-translate-y-px">
      {/* glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] pointer-events-none"
           style={{ background: color }} />
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg mb-3.5"
           style={{ background: `${color}20` }}>
        {icon}
      </div>
      <div className="text-[28px] font-extrabold leading-none tracking-tight" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-muted font-medium mt-1">{label}</div>
      {sub && <div className="text-[11px] text-muted2 mt-2">{sub}</div>}
      {pct !== undefined && (
        <div className="h-1 bg-surface3 rounded-full mt-3 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
        </div>
      )}
    </div>
  )
}
