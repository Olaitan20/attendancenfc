'use client'
import { useEffect, useState, useCallback } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import PageHeader from '@/components/layout/PageHeader'
import NFCReaderCard from '@/components/admin/NFCReaderCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Toast from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'
import { Card, CardHead } from '@/components/ui/Card'
import { getAllUsers, deleteUser } from '@/lib/api'
import { NFC_READERS } from '@/lib/mock-data'
import { useToast } from '@/hooks/useToast'

interface ApiUser {
  id: number
  card_uid: string
  name: string
  role: string
  class_group: string
  created_at: string
}

export default function AdminCardsPage() {
  const [search, setSearch]  = useState('')
  const { toast, showToast } = useToast()
  const [users, setUsers]    = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = useCallback(async () => {
    try {
      const data = await getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      showToast('❌ Could not connect to Flask server')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadUsers() }, [loadUsers])

  const filtered = users.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.card_uid.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardShell title="NFC Cards" toast={toast}>
      <PageHeader
        title="NFC Cards"
        sub="Manage registered cards and reader status"
        actions={
          <Button variant="accent" size="sm" onClick={() => showToast('Tap a card on the reader to enroll')}>
            + Enroll New Card
          </Button>
        }
      />

      {/* Reader status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {NFC_READERS.map(r => <NFCReaderCard key={r.uid} reader={r} />)}
      </div>

      {/* Card table */}
      <div className="mb-4">
        <div className="w-full sm:w-56">
          <Input icon="🔍" placeholder="Search name or UID…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHead>
          <p className="text-[13.5px] font-bold">Registered Cards</p>
          <Badge variant="admin">{filtered.length} cards</Badge>
        </CardHead>

        {loading ? (
          <div className="px-5 py-10 text-center text-muted text-sm animate-pulse">
            Loading from database…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted text-sm">
            No cards registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Card Holder', 'Card UID', 'Role', 'Enrolled', ''].map(h => (
                    <th key={h} className="text-[10.5px] font-bold text-muted uppercase tracking-wider px-4 py-3 text-left bg-white/[0.02] border-b border-border1 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border1 last:border-0 hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-semibold">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-student">{s.card_uid}</td>
                    <td className="px-4 py-3"><Badge variant="muted">{s.role}</Badge></td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted">{s.created_at?.split(' ')[0] ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Button variant="danger" size="xs"
                        onClick={async () => {
                          await deleteUser(s.id)
                          showToast(`🗑️ ${s.name} removed`)
                          loadUsers()
                        }}>
                        Deactivate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Toast msg={toast.msg} visible={toast.visible} />
    </DashboardShell>
  )
}