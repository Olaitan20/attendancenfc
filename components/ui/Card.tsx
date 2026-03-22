import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  accentBorder?: string
}
export function Card({ children, className, accentBorder }: CardProps) {
  return (
    <div
      className={cn('bg-surface border border-border1 rounded-card overflow-hidden', className)}
      style={accentBorder ? { borderTop: `3px solid ${accentBorder}` } : {}}
    >
      {children}
    </div>
  )
}

interface CardHeadProps {
  children: React.ReactNode
  className?: string
}
export function CardHead({ children, className }: CardHeadProps) {
  return (
    <div className={cn('px-5 py-4 border-b border-border1 flex items-center justify-between gap-3', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>
}
