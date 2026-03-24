'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'student' | 'lecturer' | 'admin'

export interface AuthUser {
  id: number
  name: string
  email: string
  matric_number: string
  role: Role
  class_group: string
  card_uid: string
  courses: { id: number; code: string; name: string }[]
  initials: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null          // simple user id stored as "token" for now
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  logout: () => void
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user:            { ...user, initials: getInitials(user.name) },
          token:           String(user.id),
          isAuthenticated: true,
        }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'attendnfc-auth' }
  )
)