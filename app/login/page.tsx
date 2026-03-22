'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/types'

const ROLES: { role: Role; icon: string; label: string; sub: string; color: string }[] = [
  { role: 'student',  icon: '🎓', label: 'Student',  sub: 'View my attendance', color: '#06b6d4' },
  { role: 'lecturer', icon: '🧑‍🏫', label: 'Lecturer', sub: 'Manage classes',     color: '#f59e0b' },
  { role: 'admin',    icon: '🛡️',  label: 'Admin',    sub: 'Full control',       color: '#a78bfa' },
]

const REDIRECT: Record<Role, string> = {
  student: '/student',
  lecturer: '/lecturer',
  admin: '/admin',
}

export default function LoginPage() {
  const [selected, setSelected] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()

  const selectedMeta = ROLES.find(r => r.role === selected)

  const handleLogin = async () => {
    if (!selected) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    login(selected)
    router.push(REDIRECT[selected])
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.06]"
             style={{ background: '#06b6d4', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.05]"
             style={{ background: '#a78bfa', filter: 'blur(80px)' }} />
      </div>
      
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(#1e2535 1px, transparent 1px), linear-gradient(90deg, #1e2535 1px, transparent 1px)',
             backgroundSize: '48px 48px',
           }} /> */}

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px]  p-8 md:p-10 animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          {/* <div className="w-14 h-14 rounded-2xl bg-student flex items-center justify-center text-2xl mx-auto mb-4
                          shadow-[0_8px_24px_rgba(6,182,212,0.3)]">
            📡
          </div> */}
          <h1 className="text-[22px] text-black font-extrabold tracking-tight">A-Edu</h1>
          <p className="text-[12px] text-muted mt-1">Smart Attendance Management System</p>
        </div>

        {/* Role picker */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {ROLES.map(r => (
            <button
              key={r.role}
              onClick={() => setSelected(r.role)}
              className={cn(
                'border rounded-btn p-3 text-center transition-all',
                selected === r.role
                  ? 'border-current'
                  : 'border-border1 hover:border-border2 hover:shadow-[2px_2px_0px_0px_#000]'
              )}
              style={selected === r.role ? { borderColor: r.color, background: `${r.color}18` } : {}}
            >
              <div className="text-xl mb-1">{r.icon}</div>
              <div className="text-[12px] text-black font-bold">{r.label}</div>
              <div className="text-[10.5px] text-muted">{r.sub}</div>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
              Email / Student ID
            </label>
            <input
              type="text"
              defaultValue="demo@university.edu"
              className="w-full bg-transparent border border-border2 rounded-btn px-3 py-2.5 text-sm text-black
                         outline-none transition-colors focus:border-student placeholder:text-muted"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••"
              className="w-full bg-transparent border border-border2 rounded-btn px-3 py-2.5 text-sm text-black
                         outline-none transition-colors focus:border-student"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            className="w-full py-3 rounded-btn text-sm shadow-[2px_2px_0px_0px_#000] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: selectedMeta ? `linear-gradient(135deg, ${selectedMeta.color}, ${selectedMeta.color}cc)` : '#1e2535',
              color: selected ? '#000' : '#64748b',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </div>

        <p className="text-center text-[12px] text-muted mt-5">
          Demo: select a role above then sign in
        </p>
      </div>
    </div>
  )
}
