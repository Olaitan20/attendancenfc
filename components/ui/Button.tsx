import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

type BtnVariant = 'accent' | 'ghost' | 'danger'
type BtnSize    = 'default' | 'sm' | 'xs'

const variants: Record<BtnVariant, string> = {
  accent: 'bg-student text-bg font-bold hover:brightness-110',
  ghost:  'bg-transparent text-muted2 border border-border2 hover:bg-surface2 hover:text-txt',
  danger: 'bg-danger/10 text-danger border border-danger/25 hover:bg-danger/20',
}
const sizes: Record<BtnSize, string> = {
  default: 'px-4 py-2 text-sm',
  sm:      'px-3 py-1.5 text-xs',
  xs:      'px-2.5 py-1 text-[11px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  accentColor?: string
}

export default function Button({ variant = 'ghost', size = 'default', className, accentColor, style, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 rounded-btn font-semibold font-sans transition-all',
        variants[variant], sizes[size], className
      )}
      style={accentColor && variant === 'accent' ? { background: accentColor, ...style } : style}
      {...props}
    />
  )
}
