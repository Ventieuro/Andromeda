import { useState } from 'react'
import type { Transaction, SavingsGoal } from '../shared/types'
import { DASHBOARD, normalizeCategoryKey, translateCategory } from '../shared/labels'
import SolarSystemChart from './SolarSystemChart'
import SpaceDonutChart from './SpaceDonutChart'
import CometChart from './CometChart'
import { useAmounts } from '../shared/AmountsContext'
import { loadGoals } from '../shared/storage'

// ─── Calcolo rata mensile corrente per un goal ───────────
function currentMonthlyAmount(g: SavingsGoal): number {
  if (g.targetDate && g.targetAmount !== undefined) {
    const now = new Date()
    const target = new Date(g.targetDate + 'T00:00:00')
    const months = Math.max(0,
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
    )
    if (months > 0) return Math.max(0, (g.targetAmount - g.savedAmount) / months)
    return 0
  }
  return g.monthlyAmount ?? 0
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
  periodEnd?: string   // ISO yyyy-mm-dd — filtra goal creati dopo questa data
  onCategoryClick?: (canonicalKey: string) => void
  onViewChange?: (view: 'pie' | 'solar' | 'comet') => void
}

function buildSlices(transactions: Transaction[]): Slice[] {
  const incomeTx = transactions.filter((t) => t.type === 'entrata')
  const expenseTx = transactions.filter((t) => t.type === 'uscita')
  if (incomeTx.length === 0 && expenseTx.length === 0) return []

  const totalIncome = incomeTx.reduce((s, t) => s + t.amount, 0)
  const totalExpenses = expenseTx.reduce((s, t) => s + t.amount, 0)

  // Base = income (or expenses if they exceed income)
  const base = Math.max(totalIncome, totalExpenses) || 1

  // Expense slices — each is a portion of the income circle
  const byExpense = new Map<string, number>()
  const importantByCategory = new Map<string, number>()
  for (const tx of expenseTx) {
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

  // Savings slice — the green remainder (income − expenses)
  const savings = totalIncome - totalExpenses
  const savingsSlices: Slice[] = savings > 0 ? [{
    canonicalKey: '', // non-clickable
    category: DASHBOARD.risparmiLabel,
    amount: savings,
    percent: Math.round((savings / base) * 1000) / 10,
    color: '#22c55e',
    type: 'entrata' as const,
  }] : []

  // Expenses first, savings (green) last so it ends the circle
  return [...expenseSlices, ...savingsSlices]
}

function ExpensePieChart({ transactions, periodEnd, onCategoryClick, onViewChange }: ExpensePieChartProps) {
  const rawSlices = buildSlices(transactions)
  const totalIncome = transactions.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
  const [view, setView] = useState<'pie' | 'solar' | 'comet'>('pie')
  const [sortMode, setSortMode] = useState<'amount' | 'important'>('amount')
  const { amountsVisible } = useAmounts()
  const totalMonthlyGoal = loadGoals()
    .filter((g) => !periodEnd || g.createdAt.slice(0, 10) <= periodEnd)
    .reduce((s, g) => s + currentMonthlyAmount(g), 0)

  const hasAnyImportant = rawSlices.some((s) => (s.importantRatio ?? 0) > 0)

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

      {/* Sort toggle — solo se ci sono spese importanti e vista pertinente */}
      {slices.length > 0 && hasAnyImportant && view !== 'comet' && (
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
            ⭐ {DASHBOARD.ordinaPerImportante}
          </button>
        </div>
      )}

      {slices.length === 0 && totalMonthlyGoal === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
          {DASHBOARD.nessunGrafico}
        </p>
      ) : slices.length === 0 ? (
        // Nessuna transazione ma ci sono obiettivi: mostra donut vuoto con arco obiettivo
        <SpaceDonutChart slices={[]} totalIncome={0} totalExpenses={0} size={280} hideIncome={!amountsVisible} savingsGoal={totalMonthlyGoal} />
      ) : view === 'comet' ? (
        <CometChart />
      ) : view === 'solar' ? (
        <SolarSystemChart transactions={transactions} onCategoryClick={onCategoryClick} sortMode={sortMode} />
      ) : (
        <SpaceDonutChart slices={slices} totalIncome={totalIncome} totalExpenses={totalExpenses} size={280} hideIncome={!amountsVisible} onCategoryClick={onCategoryClick} savingsGoal={totalMonthlyGoal} />
      )}
    </div>
  )
}

export default ExpensePieChart
