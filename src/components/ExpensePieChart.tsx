import { useState } from 'react'
import type { Transaction, SavingsGoal } from '../shared/types'
import { DASHBOARD, normalizeCategoryKey, translateCategory } from '../shared/labels'
import SolarSystemChart from './SolarSystemChart'
import SpaceDonutChart from './SpaceDonutChart'
import CometChart from './CometChart'
import type { MonthDetail } from './CometChart'
import { useAmounts } from '../shared/AmountsContext'
import { loadGoals, getTransactionsInPeriod } from '../shared/storage'

// ─── Periodo a partire da payDay ─────────────────────
function getPeriodDates(payDay: number, offset: number): { start: Date; end: Date } {
  const today = new Date()
  const baseMonth = today.getDate() >= payDay ? today.getMonth() : today.getMonth() - 1
  const start = new Date(today.getFullYear(), baseMonth + offset, payDay)
  const end = new Date(start.getFullYear(), start.getMonth() + 1, payDay - 1)
  return { start, end }
}

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ─── Calcolo rata mensile con carryover shortfall ─────────
function effectiveMonthlyGoal(
  goals: ReturnType<typeof loadGoals>,
  allTx: Transaction[],
  payDay: number,
  currentPeriodStart: Date,
): number {
  let total = 0
  for (const g of goals) {
    // Base rata mensile
    let base: number
    if (g.targetDate && g.targetAmount !== undefined) {
      const now = new Date()
      const target = new Date(g.targetDate + 'T00:00:00')
      const months = Math.max(0,
        (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
      )
      base = months > 0 ? Math.max(0, (g.targetAmount - g.savedAmount) / months) : 0
    } else {
      base = g.monthlyAmount ?? 0
    }
    if (base <= 0) { total += 0; continue }

    // Accumula shortfall dai periodi passati da quando è stato creato il goal
    const goalCreated = g.createdAt.slice(0, 10)
    let shortfall = 0
    // Risali di 24 mesi al massimo per trovare i periodi passati
    for (let offset = -24; offset < 0; offset++) {
      const { start, end } = getPeriodDates(payDay, offset)
      // Salta periodi prima della creazione del goal
      if (toIso(end) < goalCreated) continue
      // Salta il periodo corrente e futuri
      if (toIso(start) >= toIso(currentPeriodStart)) break
      const periodTx = getTransactionsInPeriod(allTx, start, end)
      const inc = periodTx.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
      const exp = periodTx.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
      const saved = inc - exp
      shortfall += Math.max(0, base - saved)
    }
    total += base + shortfall
  }
  return total
}

// ─── Colori per le categorie di uscita ───────────────────
const EXPENSE_COLORS = [
  '#ef4444', // rosso
  '#f97316', // arancione
  '#eab308', // giallo
  '#06b6d4', // ciano
  '#3b82f6', // blu
  '#8b5cf6', // viola
  '#ec4899', // rosa
  '#f43f5e', // rosa-rosso
]

interface Slice {
  category: string
  canonicalKey: string
  amount: number
  percent: number
  color: string
  type: 'entrata' | 'uscita'
  importantRatio?: number
}

interface ExpensePieChartProps {
  transactions: Transaction[]
  allTransactions?: Transaction[]
  periodEnd?: string
  periodStart?: Date
  payDay?: number
  onCategoryClick?: (canonicalKey: string) => void
  onViewChange?: (view: 'pie' | 'solar' | 'comet') => void
  onMonthSelect?: (detail: MonthDetail | null) => void
  selectedMonthIndex?: number | null
  onTotalsChange?: (totals: { income: number; expenses: number; savings: number } | null) => void
}

const GOAL_COLORS = ['#7c9eff', '#5b8dee', '#4a7cdc', '#a78bfa', '#818cf8', '#60a5fa', '#38bdf8', '#34d399']

function buildSlices(transactions: Transaction[], goals: SavingsGoal[] = []): Slice[] {
  const incomeTx = transactions.filter((t) => t.type === 'entrata')
  const expenseTx = transactions.filter((t) => t.type === 'uscita')
  if (incomeTx.length === 0 && expenseTx.length === 0) return []

  const totalIncome = incomeTx.reduce((s, t) => s + t.amount, 0)

  // Separate mission tx (already manually saved to a goal) from regular expenses
  const missionTx = expenseTx.filter((t) => t.goalId)
  const regularTx = expenseTx.filter((t) => !t.goalId)
  const regularExpenses = regularTx.reduce((s, t) => s + t.amount, 0)
  const missionTotal = missionTx.reduce((s, t) => s + t.amount, 0)
  const totalExpenses = regularExpenses + missionTotal

  const base = Math.max(totalIncome, totalExpenses) || 1

  // Expense slices — regular expenses only, grouped by category
  const byExpense = new Map<string, number>()
  const importantByCategory = new Map<string, number>()
  for (const tx of regularTx) {
    const key = normalizeCategoryKey(tx.category, 'uscita')
    byExpense.set(key, (byExpense.get(key) ?? 0) + tx.amount)
    if (tx.important) importantByCategory.set(key, (importantByCategory.get(key) ?? 0) + tx.amount)
  }

  const expenseSlices: Slice[] = [...byExpense.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([canonicalKey, amount], i) => ({
      canonicalKey,
      category: translateCategory(canonicalKey, 'uscita'),
      amount,
      percent: Math.round((amount / base) * 1000) / 10,
      color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
      type: 'uscita' as const,
      importantRatio: Math.min(1, (importantByCategory.get(canonicalKey) ?? 0) / amount),
    }))

  // Goal slices — grouped by goalId, shown in blue shades
  const byGoal = new Map<string, number>()
  for (const tx of missionTx) {
    if (tx.goalId) byGoal.set(tx.goalId, (byGoal.get(tx.goalId) ?? 0) + tx.amount)
  }
  const goalSlices: Slice[] = [...byGoal.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([goalId, amount], i) => {
      const goal = goals.find(g => g.id === goalId)
      return {
        canonicalKey: `goal:${goalId}`,
        category: goal ? `${goal.emoji} ${goal.name}` : '🎯 Obiettivo',
        amount,
        percent: Math.round((amount / base) * 1000) / 10,
        color: GOAL_COLORS[i % GOAL_COLORS.length],
        type: 'uscita' as const,
      }
    })

  // Green slice — savings = income minus ALL expenses (goal tx already shown as own slices)
  const totalSavings = totalIncome - regularExpenses - missionTotal
  const savingsSlices: Slice[] = totalSavings > 0 ? [{
    canonicalKey: '',
    category: DASHBOARD.risparmiLabel,
    amount: totalSavings,
    percent: Math.round((totalSavings / base) * 1000) / 10,
    color: '#22c55e',
    type: 'entrata' as const,
  }] : []

  return [...expenseSlices, ...goalSlices, ...savingsSlices]
}

function ExpensePieChart({ transactions, allTransactions, periodEnd, periodStart, payDay = 27, onCategoryClick, onViewChange, onMonthSelect, selectedMonthIndex, onTotalsChange }: ExpensePieChartProps) {
  const allGoals = loadGoals()
  const rawSlices = buildSlices(transactions, allGoals)
  const missionTotal = transactions.filter((t) => t.type === 'uscita' && t.goalId).reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
  const [view, setView] = useState<'pie' | 'solar' | 'comet'>('pie')
  const [sortMode, _setSortMode] = useState<'amount' | 'important'>('amount')
  const { amountsVisible } = useAmounts()

  const activeGoals = loadGoals().filter((g) => !periodEnd || g.createdAt.slice(0, 10) <= periodEnd)
  const rawMonthlyGoal = periodStart && allTransactions
    ? effectiveMonthlyGoal(activeGoals, allTransactions, payDay, periodStart)
    : activeGoals.reduce((s, g) => {
        if (g.targetDate && g.targetAmount !== undefined) {
          const now = new Date()
          const target = new Date(g.targetDate + 'T00:00:00')
          const months = Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()))
          return s + (months > 0 ? Math.max(0, (g.targetAmount - g.savedAmount) / months) : 0)
        }
        return s + (g.monthlyAmount ?? 0)
      }, 0)
  // Tx versate a un goal con "conta questo mese" spostano già la bandiera in avanti
  const deductNowTotal = transactions
    .filter((t) => t.type === 'uscita' && t.goalId && t.goalDeductNow)
    .reduce((s, t) => s + t.amount, 0)
  const totalMonthlyGoal = Math.max(0, rawMonthlyGoal - deductNowTotal)

  const slices = sortMode === 'important'
    ? [
        // expense slices: important first (by ratio desc), then by amount desc; savings always last
        ...rawSlices
          .filter((s) => s.type === 'uscita')
          .sort((a, b) => (b.importantRatio ?? 0) - (a.importantRatio ?? 0) || b.amount - a.amount),
        ...rawSlices.filter((s) => s.type === 'entrata'),
      ]
    : rawSlices

  function changeView(v: 'pie' | 'solar' | 'comet') {
    setView(v)
    onViewChange?.(v)
  }

  return (
    <div
      className="rounded-2xl p-4 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          {DASHBOARD.graficoSpese}
        </h2>

        {/* Toggle Torta / Sistema Solare */}
        {slices.length > 0 && (
          <div
            className="flex rounded-lg p-0.5 text-xs"
            style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
          >
            <button
              onClick={() => changeView('pie')}
              className="px-2.5 py-1 rounded-md transition-all font-medium"
              style={{
                backgroundColor: view === 'pie' ? 'var(--accent)' : 'transparent',
                color: view === 'pie' ? '#fff' : 'var(--text-muted)',
              }}
            >
              🔭 {DASHBOARD.vistaTorta}
            </button>
            <button
              onClick={() => changeView('solar')}
              className="px-2.5 py-1 rounded-md transition-all font-medium"
              style={{
                backgroundColor: view === 'solar' ? 'var(--accent)' : 'transparent',
                color: view === 'solar' ? '#fff' : 'var(--text-muted)',
              }}
            >
              🪐 {DASHBOARD.vistaSolare}
            </button>
            <button
              onClick={() => changeView('comet')}
              className="px-2.5 py-1 rounded-md transition-all font-medium"
              style={{
                backgroundColor: view === 'comet' ? 'var(--accent)' : 'transparent',
                color: view === 'comet' ? '#fff' : 'var(--text-muted)',
              }}
            >
              ☄️ {DASHBOARD.vistaCometa}
            </button>
          </div>
        )}
      </div>

      {/* Sort toggle — important sort disabled, keeping only amount sort */}
      {/* {slices.length > 0 && hasAnyImportant && view !== 'comet' && (
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setSortMode('amount')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: sortMode === 'amount' ? 'var(--accent-light)' : 'var(--bg-secondary)',
              color: sortMode === 'amount' ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${sortMode === 'amount' ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            📊 {DASHBOARD.ordinaPerImporto}
          </button>
          <button
            onClick={() => setSortMode('important')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: sortMode === 'important' ? 'rgba(251,191,36,0.15)' : 'var(--bg-secondary)',
              color: sortMode === 'important' ? '#f59e0b' : 'var(--text-muted)',
              border: `1px solid ${sortMode === 'important' ? 'rgba(251,191,36,0.6)' : 'var(--border)'}`,
            }}
          >
            <Star size={12} fill={sortMode === 'important' ? '#f59e0b' : 'none'} stroke={sortMode === 'important' ? '#f59e0b' : 'currentColor'} /> {DASHBOARD.ordinaPerImportante}
          </button>
      )} */}

      {slices.length === 0 && totalMonthlyGoal === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
          {DASHBOARD.nessunGrafico}
        </p>
      ) : slices.length === 0 ? (
        // Nessuna transazione ma ci sono obiettivi: mostra donut vuoto con arco obiettivo
        <SpaceDonutChart slices={[]} totalIncome={0} totalExpenses={0} size={250} hideIncome={!amountsVisible} savingsGoal={totalMonthlyGoal} missionSaved={0} />
      ) : view === 'comet' ? (
        <CometChart allTransactions={allTransactions ?? transactions} payDay={payDay} onMonthSelect={onMonthSelect} selectedMonthIndex={selectedMonthIndex} onTotalsChange={onTotalsChange} />
      ) : view === 'solar' ? (
        <SolarSystemChart transactions={transactions} onCategoryClick={onCategoryClick} sortMode={sortMode} />
      ) : (
        <SpaceDonutChart slices={slices} totalIncome={totalIncome} totalExpenses={totalExpenses} size={250} hideIncome={!amountsVisible} onCategoryClick={onCategoryClick} savingsGoal={totalMonthlyGoal} missionSaved={missionTotal} />
      )}
    </div>
  )
}

export default ExpensePieChart
