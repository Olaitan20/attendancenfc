'use client'
import { useEffect, useRef, useState } from 'react'

interface RingProps {
  pct: number
  color: string
  size?: number
  strokeWidth?: number
  label?: string
}

export default function RingProgress({ pct, color, size = 80, strokeWidth = 6, label }: RingProps) {
  const r = (size / 2) - strokeWidth / 2 - 1
  const circ = 2 * Math.PI * r
  const [fill, setFill] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setFill(circ * (pct / 100)), 50)
    return () => clearTimeout(id)
  }, [pct, circ])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a2030" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-extrabold leading-none text-txt" style={{ fontSize: size * 0.22 }}>
          {pct}<span style={{ fontSize: size * 0.13 }}>%</span>
        </div>
        {label && <div className="text-muted font-medium" style={{ fontSize: size * 0.11 }}>{label}</div>}
      </div>
    </div>
  )
}
