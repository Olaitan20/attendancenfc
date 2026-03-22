import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'student' | 'lecturer' | 'admin'
  | 'ok' | 'warn' | 'danger' | 'info' | 'muted'

const variantStyles: Record<BadgeVariant, string> = {
  student:  'bg-[#06b6d4]/10 text-[#06b6d4]',
  lecturer: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  admin:    'bg-[#a78bfa]/10 text-[#a78bfa]',
  ok:       'bg-[#10b981]/10 text-[#10b981]',
  warn:     'bg-[#f97316]/10 text-[#f97316]',
  danger:   'bg-[#f43f5e]/10 text-[#f43f5e]',
  info:     'bg-[#3b82f6]/10 text-[#3b82f6]',
  muted:    'bg-[#64748b]/10 text-[#8896b3]',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

export default function Badge({ variant = 'muted', children, dot = true, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono whitespace-nowrap',
      variantStyles[variant],
      className
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />}
      {children}
    </span>
  )
}
