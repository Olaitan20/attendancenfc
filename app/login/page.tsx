'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { RiArrowRightLine } from 'react-icons/ri'

const ROLES = [
  { label: 'Student',  role: 'student',  redirect: '/student'  },
  { label: 'Lecturer', role: 'lecturer', redirect: '/lecturer' },
  { label: 'Admin',    role: 'admin',    redirect: '/admin'    },
]

export default function LoginPage() {
  const [selected, setSelected] = useState('student')
  const { setUser }             = useAuthStore()
  const router                  = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const picked = ROLES.find(r => r.role === selected)!
    setUser({
      role:       picked.role,
      name:       `Test ${picked.label}`,
      identifier: 'TEST/00/000',
    })
    router.push(picked.redirect)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-surface border border-border2 p-8 shadow-[0_2px_4px_rgba(0,0,0,0.5)]">

        <div className="text-center mb-8">
          <h1 className="text-[22px] font-extrabold tracking-tight">A Edu</h1>
          <p className="text-[12px] text-muted mt-1">Dev mode — pick a role</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
              Login as
            </label>
            <div className="flex gap-2">
              {ROLES.map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelected(r.role)}
                  className={`flex-1 py-2.5 text-sm font-bold border transition-all rounded-btn
                    ${selected === r.role
                      ? 'bg-student text-bg border-student'
                      : 'bg-surface2 text-muted border-border2 hover:border-student'
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-btn text-sm font-bold bg-student text-bg
                       hover:brightness-110 transition-all mt-2 inline-flex items-center justify-center gap-1"
          >
            Enter as {ROLES.find(r => r.role === selected)?.label} <RiArrowRightLine />
          </button>
        </form>

        <div className="mt-6 p-3 bg-surface2 border border-border1 rounded-btn">
          <p className="text-[11.5px] text-muted leading-relaxed">
            <strong className="text-muted2">Auth is disabled.</strong> Select any role above to enter that dashboard directly.
          </p>
        </div>
      </div>
    </div>
  )
}