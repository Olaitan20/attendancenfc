import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function pctColor(pct: number): string {
  if (pct >= 75) return '#10b981'
  if (pct >= 60) return '#f97316'
  return '#f43f5e'
}

export function pctBadge(pct: number): 'ok' | 'warn' | 'danger' {
  if (pct >= 75) return 'ok'
  if (pct >= 60) return 'warn'
  return 'danger'
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}
