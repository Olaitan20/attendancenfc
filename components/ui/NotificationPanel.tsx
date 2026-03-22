'use client'
import { useEffect, useRef } from 'react'
import type { Notification } from '@/lib/types'

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
  notifications: Notification[]
}

export default function NotificationPanel({ open, onClose, notifications }: NotificationPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute top-14 right-4 w-80 bg-surface border border-border2 rounded-card shadow-2xl z-[200] overflow-hidden animate-fade-up"
    >
      <div className="px-4 py-3 border-b border-border1 flex items-center justify-between">
        <span className="text-sm font-bold">Notifications</span>
        <span className="text-[11px] text-muted cursor-pointer hover:text-txt" onClick={onClose}>dismiss</span>
      </div>
      {notifications.map((n, i) => (
        <div key={i} className="flex gap-2.5 px-4 py-3 border-b border-border1 last:border-0 hover:bg-surface2 cursor-pointer transition-colors">
          <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: n.color }} />
          <div>
            <p className={`text-[12.5px] leading-snug ${n.read ? 'font-normal' : 'font-semibold'}`}>{n.msg}</p>
            <p className="text-[11px] text-muted font-mono mt-0.5">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
