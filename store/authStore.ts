'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '@/lib/types'

const DEMO_USERS: Record<Role, User> = {
  student: {
    id: 'CSC/21/001',
    name: 'Ade Bello',
    email: 'ade.bello@student.edu',
    role: 'student',
    initials: 'AB',
    classGroup: 'CSC 300L',
  },
  lecturer: {
    id: 'LEC/001',
    name: 'Dr. Afolabi',
    email: 'afolabi@university.edu',
    role: 'lecturer',
    initials: 'DA',
    department: 'Computer Science',
  },
  admin: {
    id: 'ADM/001',
    name: 'Admin',
    email: 'admin@university.edu',
    role: 'admin',
    initials: 'SA',
  },
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role: Role) =>
        set({ user: DEMO_USERS[role], isAuthenticated: true }),
      logout: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    { name: 'attendnfc-auth' }
  )
)
