'use client'

interface ToastProps {
  msg: string
  visible: boolean
}

export default function Toast({ msg, visible }: ToastProps) {
  if (!visible) return null
  return (
    <div className="fixed bottom-6 right-6 bg-surface2 border border-border2 rounded-card px-4 py-3 text-sm font-medium shadow-2xl z-[999] animate-fade-up max-w-xs">
      {msg}
    </div>
  )
}
