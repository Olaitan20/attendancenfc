import { cn } from '@/lib/utils'
import { initials as getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-11 h-11 text-sm' }

export default function Avatar({ name, size = 'md', color = '#06b6d4', className }: AvatarProps) {
  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-bold text-bg flex-shrink-0', sizes[size], className)}
      style={{ background: color }}
    >
      {getInitials(name)}
    </div>
  )
}
