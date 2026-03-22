'use client'
import { useEffect } from 'react'
import Button from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  confirmLabel?: string
  onConfirm?: () => void
}

export default function Modal({ open, onClose, title, children, confirmLabel = 'OK', onConfirm }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface border border-border2 rounded-[16px] w-full max-w-md p-7 animate-fade-up">
        <h3 className="text-[17px] font-extrabold mb-5">{title}</h3>
        <div>{children}</div>
        <div className="flex gap-2.5 justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {onConfirm && (
            <Button variant="accent" onClick={() => { onConfirm(); onClose() }}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
