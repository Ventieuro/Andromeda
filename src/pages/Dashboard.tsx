import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import Mascot from '../components/Mascot'
import AddTransactionForm from '../components/AddTransactionForm'
import ReceiptDetailModal from '../components/ReceiptDetailModal'
import { loadTransactions, getTransactionsInPeriod, deleteTransaction, deleteTransactionsByGroupId, loadSettings, saveSettings, loadGoals, updateGoal } from '../shared/storage'
import type { Transaction } from '../shared/types'
import type { MonthDetail } from '../components/CometChart'
import ExpensePieChart from '../components/ExpensePieChart'
import { DASHBOARD, MASCOTTE, translateCategory } from '../shared/labels'
import { getCategoryIcon } from '../shared/categoryIcons'
import { useDialog } from '../shared/DialogContext'
import { useAmounts } from '../shared/AmountsContext'

const HIDDEN = '••••'

function getPeriod(payDay: number, offset: number) {
  const today = new Date()
  const baseMonth = today.getDate() >= payDay ? today.getMonth() : today.getMonth() - 1

  const start = new Date(today.getFullYear(), baseMonth + offset, payDay)
  const end = new Date(start.getFullYear(), start.getMonth() + 1, payDay - 1)

  return { start, end }
}

function formatRange(start: Date, end: Date) {
  const fmt = (d: Date) =>
    d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
  return `${fmt(start)} — ${fmt(end)}`
}

function formatMonth(start: Date) {
  return start.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
}

function formatEuro(amount: number) {
  return amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

function getMascotMessage(
  saldo: number,
  count: number,
  monthlyGoal: number,
  carryover: number,
  consecutiveNegative: number,
  wasNegative: boolean,
): { mood: 'happy' | 'sad' | 'neutral' | 'excited'; message: string } {
  if (count === 0) return { mood: 'neutral', message: MASCOTTE.messaggi.vuoto }

  // Easter egg Bowie — 3+ mesi consecutivi in rosso
  if (consecutiveNegative >= 3) {
    return { mood: 'sad', message: MASCOTTE.messaggi.majorTom }
  }
  // Rientro positivo dopo periodo negativo
  if (wasNegative && saldo > 0) {
    return { mood: 'excited', message: MASCOTTE.messaggi.majorTomRientro }
  }

  // Con obiettivo di risparmio attivo
  if (monthlyGoal > 0) {
    const shortfall = monthlyGoal - saldo
    if (saldo >= monthlyGoal) {
      return { mood: 'excited', message: MASCOTTE.messaggi.obiettivoRaggiunto }
    }
    if (shortfall > 0 && shortfall <= monthlyGoal * 0.2) {
      return { mood: 'happy', message: MASCOTTE.messaggi.obiettivoVicino(formatEuro(shortfall)) }
    }
    if (carryover > 0) {
      return { mood: 'neutral', message: MASCOTTE.messaggi.carryover(formatEuro(carryover)) }
    }
    if (saldo > 0) {
      return { mood: 'neutral', message: MASCOTTE.messaggi.obiettivoMancato(formatEuro(shortfall)) }
    }
  }

  // Senza obiettivo o fallback
  if (saldo > 500) return { mood: 'excited', message: MASCOTTE.messaggi.ottimo }
  if (saldo > 0) return { mood: 'happy', message: MASCOTTE.messaggi.bene(formatEuro(saldo)) }
  if (saldo === 0) return { mood: 'neutral', message: MASCOTTE.messaggi.pari }
  return { mood: 'sad', message: MASCOTTE.messaggi.rosso(formatEuro(Math.abs(saldo))) }
}

function Dashboard() {
  const settings = loadSettings()
  const { showConfirm } = useDialog()
  const { amountsVisible } = useAmounts()
  const navigate = useNavigate()
  const [payDay, setPayDay] = useState(settings.payDay)
  const [monthOffset, setMonthOffset] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [receiptDetailTx, setReceiptDetailTx] = useState<Transaction | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [chartView, setChartView] = useState<'pie' | 'solar' | 'comet'>('pie')
  const [selectedMonth, setSelectedMonth] = useState<MonthDetail | null>(null)
  const [cometTotals, setCometTotals] = useState<{ income: number; expenses: number; savings: number } | null>(null)

  // Reset mese selezionato quando si cambia vista o periodo
  useEffect(() => {
    setSelectedMonth(null)
  }, [chartView, monthOffset])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    const handleAddTransaction = () => setShowForm(true)
    window.addEventListener('andromeda:add-transaction', handleAddTransaction)
    return () => window.removeEventListener('andromeda:add-transaction', handleAddTransaction)
  }, [])

  const { start, end } = getPeriod(payDay, monthOffset)
  const isCurrentPeriod = monthOffset === 0

  const allTx = loadTransactions()
  const goals = loadGoals()
  void refreshKey // trigger re-render on data change
  const periodTx = getTransactionsInPeriod(allTx, start, end)

  const entrate = periodTx.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
  const uscite = periodTx.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
  const saldo = entrate - uscite

  // Calcola obiettivo mensile con carryover per la mascotte
  const periodEndIso = end.toISOString().slice(0, 10)
  const activeGoals = loadGoals().filter((g) => g.createdAt.slice(0, 10) <= periodEndIso)
  const baseGoal = activeGoals.reduce((s, g) => {
    if (g.targetDate && g.targetAmount !== undefined) {
      const now = new Date()
      const target = new Date(g.targetDate + 'T00:00:00')
      const months = Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()))
      return s + (months > 0 ? Math.max(0, (g.targetAmount - g.savedAmount) / months) : 0)
    }
    return s + (g.monthlyAmount ?? 0)
  }, 0)
  const carryoverAmount = activeGoals.reduce((total, g) => {
    const base = g.monthlyAmount ?? (g.targetDate && g.targetAmount ? Math.max(0, (g.targetAmount - g.savedAmount) / Math.max(1, (() => { const now = new Date(); const t = new Date(g.targetDate! + 'T00:00:00'); return Math.max(0, (t.getFullYear() - now.getFullYear()) * 12 + (t.getMonth() - now.getMonth())) })())): 0)
    let co = 0
    for (let offset = -24; offset < 0; offset++) {
      const { start: ps, end: pe } = getPeriod(payDay, offset)
      if (pe.toISOString().slice(0, 10) < g.createdAt.slice(0, 10)) continue
      if (ps.toISOString().slice(0, 10) >= start.toISOString().slice(0, 10)) break
      const ptx = getTransactionsInPeriod(allTx, ps, pe)
      const saved = ptx.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0) - ptx.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
      co += Math.max(0, base - saved)
    }
    return total + co
  }, 0)

  const mascot = getMascotMessage(saldo, periodTx.length, baseGoal, carryoverAmount, (() => {
    let count = 0
    for (let o = -1; o >= -6; o--) {
      const { start: ps, end: pe } = getPeriod(payDay, o)
      const ptx = getTransactionsInPeriod(allTx, ps, pe)
      const s = ptx.filter(t => t.type === 'entrata').reduce((a, t) => a + t.amount, 0)
             - ptx.filter(t => t.type === 'uscita').reduce((a, t) => a + t.amount, 0)
      if (s < 0) count++; else break
    }
    return count
  })(), (() => {
    const { start: ps, end: pe } = getPeriod(payDay, -1)
    const ptx = getTransactionsInPeriod(allTx, ps, pe)
    const s = ptx.filter(t => t.type === 'entrata').reduce((a, t) => a + t.amount, 0)
           - ptx.filter(t => t.type === 'uscita').reduce((a, t) => a + t.amount, 0)
    return s < 0
  })())

  function handlePayDayChange(day: number) {
    setPayDay(day)
    setMonthOffset(0)
    saveSettings({ ...settings, payDay: day })
  }

  async function handleDelete(tx: Transaction) {
    const ok = await showConfirm({
      title: DASHBOARD.eliminaLabel,
      message: DASHBOARD.eliminaConferma(tx.description),
      confirmLabel: DASHBOARD.eliminaLabel,
      cancelLabel: '❌ Annulla',
    })
    if (!ok) return
    if (tx.recurringGroupId) {
      const deleteAll = await showConfirm({
        message: DASHBOARD.eliminaRicorrenteScope,
        confirmLabel: DASHBOARD.eliminaTutte,
        cancelLabel: DASHBOARD.eliminaSoloQuesta,
      })
      if (deleteAll) {
        if (tx.goalId) {
          const groupTotal = loadTransactions()
            .filter(t => t.recurringGroupId === tx.recurringGroupId && t.goalId === tx.goalId)
            .reduce((s, t) => s + t.amount, 0)
          const goal = loadGoals().find(g => g.id === tx.goalId)
          if (goal) updateGoal({ ...goal, savedAmount: Math.max(0, goal.savedAmount - groupTotal) })
        }
        deleteTransactionsByGroupId(tx.recurringGroupId)
      } else {
        if (tx.goalId) {
          const goal = loadGoals().find(g => g.id === tx.goalId)
          if (goal) updateGoal({ ...goal, savedAmount: Math.max(0, goal.savedAmount - tx.amount) })
        }
        deleteTransaction(tx.id)
      }
    } else {
      if (tx.goalId) {
        const goal = loadGoals().find(g => g.id === tx.goalId)
        if (goal) updateGoal({ ...goal, savedAmount: Math.max(0, goal.savedAmount - tx.amount) })
      }
      deleteTransaction(tx.id)
    }
    refresh()
  }

  function handleCategoryClick(canonicalKey: string) {
    const from = start.toISOString().slice(0, 10)
    const to = end.toISOString().slice(0, 10)
    navigate(`/movimenti?category=${encodeURIComponent(canonicalKey)}&from=${from}&to=${to}`)
  }

  // Solo uscite, ordinate per data decrescente
  const sortedTx = [...periodTx].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div style={{ paddingBottom: '96px' }}>

      {/* ── 0. Messaggio mascotte ─────────────────────────── */}
      <div style={{ padding: '16px 16px 0' }}>
        <Mascot mood={mascot.mood} message={mascot.message} />
      </div>

      {/* ── 1. Navigazione periodo ─────────────────────────── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 0',
        }}
      >
        <button
          onClick={() => setMonthOffset(monthOffset - 1)}
          style={{
            width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '14px',
          }}
          aria-label={DASHBOARD.periodoPrecedente}
        >◀</button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
            {formatMonth(start)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            {formatRange(start, end)}
          </p>
        </div>

        <button
          onClick={() => setMonthOffset(monthOffset + 1)}
          style={{
            width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '14px',
          }}
          aria-label={DASHBOARD.periodoSuccessivo}
        >▶</button>
      </div>

      {/* Stipendio + Oggi inline sotto nav */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <label htmlFor="payday">{DASHBOARD.stipendioIl}</label>
            <select
              id="payday"
              value={payDay}
              onChange={(e) => handlePayDayChange(Number(e.target.value))}
              style={{
                background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                color: 'var(--text-primary)', borderRadius: '8px', padding: '3px 8px',
                fontSize: '13px', outline: 'none',
              }}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {!isCurrentPeriod && (
            <button
              onClick={() => setMonthOffset(0)}
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
            >{DASHBOARD.oggi}</button>
          )}
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {DASHBOARD.stipendioHint}
        </p>
      </div>

      {/* ── 2. Grafico grande ─────────────────────────────── */}
      <div style={{ padding: '12px 16px 0' }}>
        <ExpensePieChart
          transactions={periodTx}
          allTransactions={allTx}
          periodEnd={end.toISOString().slice(0, 10)}
          periodStart={start}
          payDay={payDay}
          onCategoryClick={handleCategoryClick}
          onViewChange={setChartView}
          onMonthSelect={setSelectedMonth}
          selectedMonthIndex={selectedMonth?.index ?? null}
          onTotalsChange={setCometTotals}
        />
      </div>

      {/* ── 3. Riepilogo Entrate / Uscite / Risparmi ─────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', padding: '12px 16px 0' }}>
        {selectedMonth && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '-2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-muted)' }}>
              📅 {selectedMonth.label}
            </span>
            <button
              onClick={() => setSelectedMonth(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', padding: '0 2px' }}
              aria-label="Torna al mese corrente"
            >✕ torna al periodo</button>
          </div>
        )}
        {(() => {
          const displayIncome  = selectedMonth?.income   ?? cometTotals?.income   ?? entrate
          const displayExpense = selectedMonth?.expenses ?? cometTotals?.expenses ?? uscite
          const displaySaldo   = selectedMonth?.savings  ?? cometTotals?.savings  ?? saldo
          return (<>
            <div style={{
              borderRadius: '16px', padding: '12px 8px', textAlign: 'center',
              background: 'var(--tx-income-bg)', border: '1px solid var(--tx-income-border)',
              boxShadow: '0 0 14px color-mix(in srgb, var(--tx-income-border) 90%, transparent)',
            }}>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tx-income-label)' }}>{DASHBOARD.entrate}</p>
              <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 800, color: 'var(--tx-income-text)', lineHeight: 1.2 }}>{amountsVisible ? formatEuro(displayIncome) : HIDDEN}</p>
            </div>

            <div style={{
              borderRadius: '16px', padding: '12px 8px', textAlign: 'center',
              background: 'var(--tx-expense-bg)', border: '1px solid var(--tx-expense-border)',
              boxShadow: '0 0 14px color-mix(in srgb, var(--tx-expense-border) 90%, transparent)',
            }}>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tx-expense-label)' }}>{DASHBOARD.uscite}</p>
              <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 800, color: 'var(--tx-expense-text)', lineHeight: 1.2 }}>{formatEuro(displayExpense)}</p>
            </div>

            <div style={{
              borderRadius: '16px', padding: '12px 8px', textAlign: 'center',
              background: displaySaldo >= 0 ? 'var(--tx-balance-pos-bg)' : 'var(--tx-balance-neg-bg)',
              border: `1px solid ${displaySaldo >= 0 ? 'var(--tx-balance-pos-border)' : 'var(--tx-balance-neg-border)'}`,
              boxShadow: `0 0 14px color-mix(in srgb, ${displaySaldo >= 0 ? 'var(--tx-balance-pos-border)' : 'var(--tx-balance-neg-border)'} 90%, transparent)`,
            }}>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: displaySaldo >= 0 ? 'var(--tx-balance-pos-label)' : 'var(--tx-balance-neg-label)' }}>{DASHBOARD.risparmi}</p>
              <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 800, color: displaySaldo >= 0 ? 'var(--tx-balance-pos-text)' : 'var(--tx-balance-neg-text)', lineHeight: 1.2 }}>{formatEuro(displaySaldo)}</p>
            </div>
          </>)
        })()}
      </div>

      {/* ── 4. Messaggio mascotte (spostato in cima) ───────────────── */}

      {/* ── 5. Ultimi movimenti (solo uscite, nascosto in Annuale) ─── */}
      {chartView !== 'comet' && <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            {DASHBOARD.movimenti}
          </h2>
        </div>

        {sortedTx.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: '32px' }}>{DASHBOARD.nessunoMovimentoEmoji}</p>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {DASHBOARD.nessunoMovimento}<br />{DASHBOARD.nessunoMovimentoSuggerimento}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedTx.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px', borderRadius: '14px',
                  background: tx.type === 'entrata' ? 'var(--tx-income-bg)' : 'var(--tx-expense-bg)',
                  border: `1px solid ${tx.type === 'entrata' ? 'var(--tx-income-border)' : 'var(--tx-expense-border)'}`,
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>
                  {tx.goalId ? (goals.find(g => g.id === tx.goalId)?.emoji ?? '🚀') : getCategoryIcon(tx.category)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tx.description}{tx.recurring && ' 🔄'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {tx.goalId
                      ? `🚀 ${goals.find(g => g.id === tx.goalId)?.name ?? 'Missione'}`
                      : translateCategory(tx.category)} · {formatDay(tx.date)}
                  </p>
                </div>
                {tx.isReceipt && (
                  <button
                    onClick={() => setReceiptDetailTx(tx)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      padding: '4px 8px',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                    }}
                    aria-label={DASHBOARD.dettaglioScontrino}
                  >
                    {DASHBOARD.dettaglioScontrino}
                  </button>
                )}
                <span style={{ fontSize: '14px', fontWeight: 700, flexShrink: 0, color: tx.goalId ? '#7c9eff' : (tx.type === 'entrata' ? 'var(--tx-income-text)' : 'var(--tx-expense-text)') }}>
                  {tx.type === 'entrata'
                    ? (!amountsVisible ? HIDDEN : `+${formatEuro(tx.amount)}`)
                    : `-${formatEuro(tx.amount)}`}
                </span>
                <button onClick={() => setEditingTx(tx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }} aria-label="Modifica"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(tx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }} aria-label={DASHBOARD.eliminaLabel}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>}

      {/* ── Modali ────────────────────────────────────────── */}
      {showForm && (
        <AddTransactionForm onClose={() => setShowForm(false)} onSaved={refresh} />
      )}
      {editingTx && (
        <AddTransactionForm onClose={() => setEditingTx(null)} onSaved={refresh} editTransaction={editingTx} />
      )}
      {receiptDetailTx && (
        <ReceiptDetailModal transaction={receiptDetailTx} onClose={() => setReceiptDetailTx(null)} />
      )}
    </div>
  )
}

export default Dashboard
