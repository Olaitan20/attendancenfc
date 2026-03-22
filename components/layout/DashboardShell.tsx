'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Toast from '@/components/ui/Toast'

interface DashboardShellProps {
  title: string
  children: React.ReactNode
  toast?: { msg: string; visible: boolean }
}

export default function DashboardShell({ title, children, toast }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex bg-bg min-h-screen text-txt font-sans">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* main — offset by sidebar on desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-7 animate-fade-up">
          {children}
        </main>
      </div>

      {toast && <Toast msg={toast.msg} visible={toast.visible} />}
    </div>
  )
}
