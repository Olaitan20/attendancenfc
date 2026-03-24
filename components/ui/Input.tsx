import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
}

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-bold text-muted uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full bg-surface2 border border-border2 rounded-btn text-txt font-sans text-sm',
            'px-3 py-2.5 outline-none transition-colors',
            'focus:border-student placeholder:text-muted',
            icon && 'pl-8',
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-bold text-muted uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-surface2 border border-border2 rounded-btn text-txt font-sans text-sm',
          'px-3 py-2.5 outline-none transition-colors cursor-pointer',
          'focus:border-student',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
