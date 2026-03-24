'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { loginUser } from '@/lib/api'
import { RiRadarLine, RiArrowRightLine } from 'react-icons/ri'

const REDIRECT: Record<string, string> = {
  student:  '/student',
  lecturer: '/lecturer',
  admin:    '/admin',
  staff:    '/lecturer',
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const { setUser }                 = useAuthStore()
  const router                      = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your ID and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(identifier.trim(), password.trim())
      if (res.success && res.user) {
        setUser(res.user)
        router.push(REDIRECT[res.user.role] ?? '/student')
      } else {
        setError(res.message ?? 'Invalid credentials.')
      }
    } catch {
      setError('Could not connect to server. Make sure Flask is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.06]"
             style={{ background: '#06b6d4', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.05]"
             style={{ background: '#a78bfa', filter: 'blur(80px)' }} />
      </div> */}
      {/* <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(#1e2535 1px, transparent 1px), linear-gradient(90deg, #1e2535 1px, transparent 1px)',
             backgroundSize: '48px 48px',
           }} /> */}

      {/* Card */}
      <div className="relative z-10 w-full max-w-[400px] bg-surface border border-border2  p-8 shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          {/* <div className="w-14 h-14 rounded-2xl bg-student flex items-center justify-center text-2xl mx-auto mb-4
                          shadow-[0_8px_24px_rgba(6,182,212,0.3)]">
            <RiRadarLine />
          </div> */}
          <h1 className="text-[22px] font-extrabold tracking-tight">A Edu</h1>
          <p className="text-[12px] text-muted mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
              Matric Number / Email / Card UID
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="e.g. CSC/21/001"
              className="w-full bg-surface2 border border-border2 rounded-btn px-3 py-2.5 text-sm text-txt
                         outline-none transition-colors focus:border-student placeholder:text-muted font-mono"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Default: your matric number"
              className="w-full bg-surface2 border border-border2 rounded-btn px-3 py-2.5 text-sm text-txt
                         outline-none transition-colors focus:border-student placeholder:text-muted"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="px-3 py-2.5 text-[12.5px] text-[#ff0000] ">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-btn text-sm font-bold bg-student text-bg transition-all
                       hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in…' : <span className="inline-flex items-center gap-1">Sign In <RiArrowRightLine /></span>}
          </button>
        </form>

        {/* Hint */}
        <div className="mt-6 p-3 bg-surface2 border border-border1 rounded-btn">
          <p className="text-[11.5px] text-muted leading-relaxed">
            <strong className="text-muted2">Default password</strong> is your matric number.<br />
            Admins can reset passwords from the registration panel.
          </p>
        </div>
      </div>
    </div>
  )
}