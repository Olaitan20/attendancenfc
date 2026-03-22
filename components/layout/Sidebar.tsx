'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/types'

interface NavItem {
  href: string
  icon: string
  label: string
  badge?: number
}
interface NavSection {
  title: string
  items: NavItem[]
}

const NAV: Record<Role, NavSection[]> = {
  student: [
    { title: 'Main', items: [
      { href: '/student',              icon: '🏠', label: 'Home' },
      { href: '/student/schedule',     icon: '📅', label: 'My Schedule' },
      { href: '/student/attendance',   icon: '📊', label: 'Attendance Stats' },
      { href: '/student/history',      icon: '📋', label: 'History' },
    ]},
    { title: 'Account', items: [
      { href: '/student/notifications', icon: '🔔', label: 'Notifications', badge: 2 },
    ]},
  ],
  lecturer: [
    { title: 'Teaching', items: [
      { href: '/lecturer',              icon: '📡', label: 'Live Class' },
      { href: '/lecturer/students',     icon: '👥', label: 'Students' },
      { href: '/lecturer/mark',         icon: '✏️',  label: 'Mark Attendance' },
      { href: '/lecturer/reports',      icon: '📈', label: 'Reports & Export' },
    ]},
    { title: 'Account', items: [
      { href: '/lecturer/notifications', icon: '🔔', label: 'Notifications', badge: 2 },
    ]},
  ],
  admin: [
    { title: 'System', items: [
      { href: '/admin',              icon: '🏠', label: 'Overview' },
      { href: '/admin/students',     icon: '🎓', label: 'All Students' },
      { href: '/admin/lecturers',    icon: '🧑‍🏫', label: 'Lecturers' },
      { href: '/admin/cards',        icon: '💳', label: 'NFC Cards' },
    ]},
    { title: 'Config', items: [
      { href: '/admin/alerts',    icon: '🔔', label: 'Alerts', badge: 2 },
      { href: '/admin/settings',  icon: '⚙️',  label: 'Settings' },
    ]},
  ],
}

const ROLE_META: Record<Role, { color: string; label: string }> = {
  student:  { color: '#06b6d4', label: 'Student Portal' },
  lecturer: { color: '#f59e0b', label: 'Lecturer Portal' },
  admin:    { color: '#a78bfa', label: 'Super Admin' },
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  if (!user) return null

  const nav = NAV[user.role]
  const meta = ROLE_META[user.role]

  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border1 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] text-bg font-bold flex-shrink-0"
             style={{ background: meta.color }}>
          📡
        </div>
        <div>
          <div className="text-[15px] font-extrabold tracking-tight">AttendNFC</div>
          <div className="text-[10px] font-mono font-medium uppercase tracking-widest" style={{ color: meta.color }}>
            {meta.label}
          </div>
        </div>
        {/* mobile close */}
        <button className="ml-auto lg:hidden text-muted hover:text-txt" onClick={onMobileClose}>✕</button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map(section => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest px-2.5 py-2 mt-3 first:mt-0">
              {section.title}
            </p>
            {section.items.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-btn text-[13.5px] font-medium transition-all relative mb-0.5',
                    active
                      ? 'text-txt'
                      : 'text-muted hover:bg-surface2 hover:text-txt'
                  )}
                  style={active ? { background: `${meta.color}18`, color: meta.color } : {}}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 rounded-r"
                      style={{ background: meta.color }}
                    />
                  )}
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border1 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-bg flex-shrink-0"
             style={{ background: meta.color }}>
          {user.initials}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold truncate">{user.name}</p>
          <p className="text-[11px] text-muted truncate">{meta.label}</p>
        </div>
        <button
          onClick={logout}
          className="ml-auto text-muted hover:text-danger transition-colors text-sm"
          title="Log out"
        >
          ⏻
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface border-r border-border1 fixed top-0 left-0 bottom-0 z-50">
        {inner}
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-72 max-w-[85vw] bg-surface border-r border-border1 flex flex-col z-10 animate-slide-in">
            {inner}
          </aside>
        </div>
      )}
    </>
  )
}
