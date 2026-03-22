'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import NotificationPanel from '@/components/ui/NotificationPanel'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import type { Role } from '@/lib/types'

const ROLE_COLOR: Record<Role, string> = {
  student: '#06b6d4',
  lecturer: '#f59e0b',
  admin: '#a78bfa',
}

interface TopbarProps {
  title: string
  onMenuClick: () => void
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)
  if (!user) return null

  const color = ROLE_COLOR[user.role]
  const notifs = NOTIFICATIONS[user.role] ?? []
  const unread = notifs.filter(n => !n.read).length

  return (
    <header className="h-14 border-b border-border1 bg-surface flex items-center justify-between px-4 md:px-7 sticky top-0 z-40 relative">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* hamburger — mobile only */}
        <button
          className="lg:hidden text-muted hover:text-txt transition-colors p-1 rounded-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3"  width="20" height="2" rx="1"/>
            <rect y="9"  width="20" height="2" rx="1"/>
            <rect y="15" width="20" height="2" rx="1"/>
          </svg>
        </button>
        <div>
          <h1 className="text-[15px] font-bold">{title}</h1>
          <p className="text-[11px] text-muted font-mono hidden sm:block">{formatDate()}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 bg-surface2 border border-border2 rounded-btn flex items-center justify-center text-base hover:bg-surface3 transition-colors"
          onClick={() => setNotifOpen(v => !v)}
        >
          🔔
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full border border-surface" />
          )}
        </button>

        {/* Avatar chip */}
        <div
          className="flex items-center gap-2 bg-surface2 border border-border2 rounded-full pl-1 pr-3 py-1 cursor-pointer hover:bg-surface3 transition-colors"
          onClick={logout}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-bg"
            style={{ background: color }}
          >
            {user.initials}
          </div>
          <span className="text-[12.5px] font-semibold hidden sm:block">{user.name}</span>
        </div>
      </div>

      {/* Notification dropdown */}
      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifs}
      />
    </header>
  )
}
