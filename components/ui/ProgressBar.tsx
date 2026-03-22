'use client'
import { useEffect, useState } from 'react'

interface ProgressBarProps {
  pct: number
  color?: string
  height?: number
  className?: string
  animated?: boolean
}

export default function ProgressBar({ pct, color = '#06b6d4', height = 5, className = '', animated = true }: ProgressBarProps) {
  const [width, setWidth] = useState(animated ? 0 : pct)
  useEffect(() => {
    if (animated) {
      const id = setTimeout(() => setWidth(pct), 80)
      return () => clearTimeout(id)
    }
  }, [pct, animated])

  return (
    <div className={`bg-surface3 rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${width}%`, background: color, transition: animated ? 'width 0.8s cubic-bezier(.4,0,.2,1)' : 'none' }}
      />
    </div>
  )
}
