import type { NFCReader } from '@/lib/types'

interface Props { reader: NFCReader }

export default function NFCReaderCard({ reader: r }: Props) {
  const isOnline = r.status === 'online'
  return (
    <div
      className="bg-surface border border-border1 rounded-card p-5 flex items-center gap-4"
      style={{ borderLeft: `3px solid ${isOnline ? '#10b981' : '#f43f5e'}` }}
    >
      <div className="text-3xl flex-shrink-0">{isOnline ? '📡' : '⚠️'}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[14px] font-bold">{r.name}</p>
          <span
            className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full"
            style={{
              background: isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              color: isOnline ? '#10b981' : '#f43f5e',
            }}
          >
            {r.status}
          </span>
        </div>
        <p className="text-[12px] text-muted mt-0.5">{r.location}</p>
        <p className="text-[11px] text-muted font-mono mt-1">
          {r.uid} · Last seen: {r.lastSeen}
        </p>
      </div>
    </div>
  )
}
