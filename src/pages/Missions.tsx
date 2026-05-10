import { useState, useEffect } from 'react'
import type { SavingsGoal } from '../shared/types'
import { loadGoals, addGoal, updateGoal, deleteGoal } from '../shared/storage'
import { MISSIONS } from '../shared/labels'
import { useDialog } from '../shared/DialogContext'
import { Button, Input, SectionHeader, FAB } from '../components/ui'
import MissionCard from '../components/MissionCard'

// ─── Helpers ─────────────────────────────────────────────

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

/** Mesi interi rimanenti dalla data odierna a targetDate */
function monthsUntil(targetDate: string): number {
  const now = new Date()
  const target = new Date(targetDate + 'T00:00:00')
  const diff =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth())
  return Math.max(0, diff)
}

function calcMonthly(targetAmount: number, savedAmount: number, months: number): number {
  if (months <= 0) return 0
  return Math.max(0, (targetAmount - savedAmount) / months)
}

// ─── Goal Form ───────────────────────────────────────────

type Mode = 'mensile' | 'data'

interface GoalFormProps {
  initial?: SavingsGoal
  onSave: (data: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const EMOJIS = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💻', '🎮', '🩺', '🎁', '🏋️', '🏦']

function GoalForm({ initial, onSave, onCancel }: GoalFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🎯')
  const [mode, setMode] = useState<Mode>(() => {
    if (initial?.targetDate) return 'data'
    return 'mensile'
  })
  const [monthlyAmount, setMonthlyAmount] = useState(
    initial?.monthlyAmount ? String(initial.monthlyAmount) : ''
  )
  const [targetAmount, setTargetAmount] = useState(
    initial?.targetAmount ? String(initial.targetAmount) : ''
  )
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? '')
  const [savedAmount, setSavedAmount] = useState(
    initial?.savedAmount ? String(initial.savedAmount) : '0'
  )

  const today = new Date().toISOString().slice(0, 10)

  const months = targetDate ? monthsUntil(targetDate) : 0
  const previewMonthly =
    mode === 'data' && Number(targetAmount) > 0 && months > 0
      ? calcMonthly(Number(targetAmount), Number(savedAmount) || 0, months)
      : null

  const isValid =
    name.trim().length > 0 &&
    (mode === 'mensile'
      ? Number(monthlyAmount) > 0
      : Number(targetAmount) > 0 && targetDate > today)

  function handleSave() {
    if (!isValid) return
    onSave({
      name: name.trim(),
      emoji,
      targetAmount: Number(targetAmount) || undefined,
      targetDate: mode === 'data' ? targetDate : undefined,
      monthlyAmount: mode === 'mensile' ? Number(monthlyAmount) : previewMonthly ?? undefined,
      savedAmount: Number(savedAmount) || 0,
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        style={{
          width: '100%', maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--bg-card)', borderRadius: '24px 24px 0 0',
          padding: '24px 20px 40px',
          border: '1px solid var(--border)',
        }}
      >
        <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {initial ? MISSIONS.modifica : MISSIONS.aggiungi}
        </h2>

        {/* Emoji picker */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {MISSIONS.emoji}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: '22px', width: '44px', height: '44px',
                  borderRadius: '12px', border: '2px solid',
                  borderColor: emoji === e ? 'var(--accent)' : 'var(--border)',
                  background: emoji === e ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Nome */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {MISSIONS.nome}
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={MISSIONS.nome}
          />
        </div>

        {/* Già risparmiato */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {MISSIONS.giaRisparmiato}
          </div>
          <Input
            type="number"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Modalità */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {MISSIONS.modalita}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              selected={mode === 'mensile'}
              onClick={() => setMode('mensile')}
            >
              💰 {MISSIONS.modMensile}
            </Button>
            <Button
              variant="secondary"
              selected={mode === 'data'}
              onClick={() => setMode('data')}
            >
              📅 {MISSIONS.modData}
            </Button>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '12px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
            {mode === 'mensile' ? MISSIONS.hintMensile : MISSIONS.hintData}
          </p>
        </div>

        {/* Campi per modalità mensile */}
        {mode === 'mensile' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {MISSIONS.importoMensile}
              </div>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                placeholder="es. 200"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {MISSIONS.importoTotale} {MISSIONS.opzionale}
              </div>
              <Input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="es. 5000"
              />
            </div>
          </>
        )}

        {/* Campi per modalità data */}
        {mode === 'data' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {MISSIONS.importoTotale}
              </div>
              <Input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="es. 5000"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {MISSIONS.dataObiet}
              </div>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={today}
              />
            </div>
            {previewMonthly !== null && (
              <div style={{
                padding: '12px 16px', borderRadius: '12px',
                background: 'var(--accent-light)', marginBottom: '20px',
                border: '1px solid var(--accent)',
              }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '14px' }}>
                  {MISSIONS.mensileCalc(formatEuro(previewMonthly))} × {months} {MISSIONS.mesiPlurali(months)}
                </span>
              </div>
            )}
          </>
        )}

        {/* Bottoni */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" fullWidth onClick={onCancel}>{MISSIONS.annulla}</Button>
          <Button variant="primary" fullWidth onClick={handleSave} disabled={!isValid}>{MISSIONS.salva}</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────

function Missions() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const { showConfirm } = useDialog()

  function refresh() {
    setGoals(loadGoals())
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleSave(data: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingGoal) {
      updateGoal({ ...editingGoal, ...data })
    } else {
      addGoal(data)
    }
    setShowForm(false)
    setEditingGoal(null)
    refresh()
  }

  async function handleDelete(goal: SavingsGoal) {
    const ok = await showConfirm({
      message: MISSIONS.eliminaConferma(goal.name),
      confirmLabel: MISSIONS.elimina,
      cancelLabel: MISSIONS.annulla,
    })
    if (ok) {
      deleteGoal(goal.id)
      refresh()
    }
  }

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 8px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
          🎯 {MISSIONS.titolo}
        </h1>
        {goals.length === 0 && (
          <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
            {MISSIONS.suggerimento}
          </p>
        )}
      </div>

      <div style={{ padding: '0 16px' }}>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🎯</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{MISSIONS.nessunObiettivo}</p>
          </div>
        ) : (
          <>
            <SectionHeader>{MISSIONS.titolo}</SectionHeader>
            {[...goals].reverse().map((g) => (
              <MissionCard
                key={g.id}
                id={g.id}
                name={g.name}
                icon={g.emoji}
                current={g.savedAmount}
                target={g.targetAmount ?? 0}
                monthlyRate={g.monthlyAmount}
                onEdit={() => { setEditingGoal(g); setShowForm(true) }}
                onDelete={() => handleDelete(g)}
              />
            ))}
          </>
        )}
      </div>

      {/* FAB */}
      <FAB
        onClick={() => { setEditingGoal(null); setShowForm(true) }}
        ariaLabel={MISSIONS.aggiungi}
        style={{ bottom: '96px', backgroundColor: '#00D4FF', color: '#080b18' }}
      >
        +
      </FAB>

      {/* Form modal */}
      {showForm && (
        <GoalForm
          initial={editingGoal ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingGoal(null) }}
        />
      )}
    </div>
  )
}

export default Missions

