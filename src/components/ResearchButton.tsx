import { useState, useCallback, useEffect } from 'react'
import type { SavingsGoal } from '../shared/types'
import { loadTransactions, loadSettings, getTransactionsInPeriod, loadAchievementRecord, loadGoals, loadPlanetLog } from '../shared/storage'
import { ACHIEVEMENTS, getAllPlanets, SETTINGS } from '../shared/labels'
import type { PlanetRarity } from '../shared/labels'
import { Modal } from './ui'
import AchievementsPanel from './AchievementsPanel'
import PlanetCard from './PlanetCard'
import { TelescopeIcon } from '../shared/icons'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const MONTH_NAMES = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']

function computePeriodFromOffset(offset: number, now: Date, payDay: number) {
  const baseYear = now.getDate() >= payDay
    ? now.getFullYear()
    : now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const baseMonth = now.getDate() >= payDay
    ? now.getMonth()
    : now.getMonth() === 0 ? 11 : now.getMonth() - 1
  let year = baseYear
  let month = baseMonth - offset
  while (month < 0) { month += 12; year -= 1 }
  const start = new Date(year, month, payDay)
  const end = new Date(year, month + 1, payDay - 1)
  const from = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
  return { year, month, start, end, from }
}

// ─── Mini planet catalog ──────────────────────────────────

const RARITY_ORDER: Record<PlanetRarity, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5,
}

function buildPlanetSets() {
  const log = loadPlanetLog()
  const discoveredSet = new Set(log.map((e) => e.alias))
  const revealedSet = new Set(log.filter((e) => e.revealed === true).map((e) => e.alias))
  const allPlanets = getAllPlanets().sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])
  const discoveredCount = allPlanets.filter((p) => discoveredSet.has(p.alias)).length
  return { allPlanets, discoveredSet, revealedSet, discoveredCount }
}

function PlanetsMini() {
  const [data, setData] = useState(() => buildPlanetSets())
  const handleReveal = useCallback(() => setData(buildPlanetSets()), [])
  const { allPlanets, discoveredSet, revealedSet, discoveredCount } = data

  return (
    <div>
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
        {SETTINGS.pianetiSbloccatiCount(discoveredCount, allPlanets.length)}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', gridAutoRows: '130px' }}>
        {allPlanets.map((planet) => {
          const isDiscovered = discoveredSet.has(planet.alias)
          const isRevealed = revealedSet.has(planet.alias)
          return (
            <PlanetCard
              key={planet.alias}
              categoryKey={planet.alias}
              categoryLabel={planet.alias}
              alias={isDiscovered ? planet.alias : undefined}
              source={isDiscovered ? planet.source : undefined}
              medium={isDiscovered ? planet.medium : undefined}
              lore={isDiscovered ? planet.lore : undefined}
              rarity={planet.rarity}
              revealed={!isDiscovered ? undefined : isRevealed}
              onReveal={handleReveal}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Badge count computation ──────────────────────────────

function computeBadge(goals: SavingsGoal[]): number {
  const now = new Date()
  const { payDay = 27 } = loadSettings()
  const periodYear = now.getDate() >= payDay
    ? now.getFullYear()
    : now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const periodMonth = now.getDate() >= payDay
    ? now.getMonth()
    : now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const periodStart = new Date(periodYear, periodMonth, payDay)
  const periodEnd = new Date(periodYear, periodMonth + 1, payDay - 1)
  const periodFrom = `${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}-${String(periodStart.getDate()).padStart(2, '0')}`

  const allTx = loadTransactions()
  const periodTx = getTransactionsInPeriod(allTx, periodStart, periodEnd)
  const totalIncome = periodTx.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = periodTx.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
  const expenses = periodTx.filter((t) => t.type === 'uscita')

  const earlyEnd = new Date(periodStart)
  earlyEnd.setDate(earlyEnd.getDate() + 6)
  const earlyStr = earlyEnd.toISOString().slice(0, 10)

  const done = [
    expenses.length >= 5,
    expenses.some((tx) => tx.isReceipt),
    (() => {
      const saved = totalIncome - totalExpenses
      const goal = goals.find((g) => g.targetAmount && g.targetAmount > 0)
      return !!goal && !!goal.targetAmount && saved >= goal.targetAmount * 0.5
    })(),
    new Set(expenses.map((tx) => tx.category)).size >= 4,
    expenses.filter((tx) => tx.date >= periodFrom && tx.date <= earlyStr).length >= 3,
  ]

  const ids = ['explorer', 'analyst', 'saver', 'diversified', 'punctual']
  const record = loadAchievementRecord(periodYear, periodMonth)

  const unclaimed = ids.filter((id, i) => done[i] && !record.claimed[id]).length
  const bonusReady = done.every(Boolean) && !record.bonusClaimed ? 1 : 0
  return unclaimed + bonusReady
}

// ─── Component ───────────────────────────────────────────

export default function ResearchButton() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'ricerche' | 'pianeti'>('ricerche')
  const [periodOffset, setPeriodOffset] = useState(0)
  const location = useLocation()

  // Chiudi il popup quando si naviga verso un'altra pagina
  useEffect(() => {
    setOpen(false)
    setTab('ricerche')
    setPeriodOffset(0)
  }, [location.pathname])

  const now = new Date()
  const { payDay = 27 } = loadSettings()
  const { year: periodYear, month: periodMonth, start: periodStart, end: periodEnd, from: periodFrom } =
    computePeriodFromOffset(periodOffset, now, payDay)
  const allTx = loadTransactions()

  // Max navigable offset = period of earliest transaction
  const maxOffset = (() => {
    if (allTx.length === 0) return 0
    const minDate = [...allTx].sort((a, b) => a.date.localeCompare(b.date))[0].date
    const d = new Date(minDate + 'T00:00:00')
    const minYear = d.getDate() >= payDay ? d.getFullYear() : (d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear())
    const minMonth = d.getDate() >= payDay ? d.getMonth() : (d.getMonth() === 0 ? 11 : d.getMonth() - 1)
    const { year: baseYear, month: baseMonth } = computePeriodFromOffset(0, now, payDay)
    return Math.max(0, (baseYear - minYear) * 12 + (baseMonth - minMonth))
  })()

  const periodTx = getTransactionsInPeriod(allTx, periodStart, periodEnd)
  const totalIncome = periodTx.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = periodTx.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
  const goals = loadGoals()
  // Badge uses only current period
  const badgeCount = computeBadge(goals)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={ACHIEVEMENTS.titolo}
        title={ACHIEVEMENTS.titolo}
        style={{
          position: 'relative', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', color: 'var(--nav-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '50%',
          transition: 'background 0.2s', flexShrink: 0,
        }}
        className="hover:bg-white/20 active:scale-95"
      >
        <TelescopeIcon size={18} />
        {badgeCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#f59e0b', color: '#000', borderRadius: '50%',
            width: '16px', height: '16px', fontSize: '9px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, border: '2px solid var(--nav-bg)',
            pointerEvents: 'none',
          }}>
            {badgeCount}
          </span>
        )}
      </button>

      {open && (
        <Modal onClose={() => { setOpen(false); setTab('ricerche') }} position="bottom">
          <div
            style={{
              width: '100%', maxHeight: '85vh', overflowY: 'auto',
              background: 'var(--bg-card)', borderRadius: '24px 24px 0 0',
              padding: '20px 16px 20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border)', margin: '0 auto 12px' }} />

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['ricerche', 'pianeti'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: '12px', border: 'none',
                    cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                    transition: 'all 0.15s',
                    background: tab === t ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: tab === t ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {t === 'ricerche' ? '🔭 Ricerche' : '🪐 Pianeti'}
                </button>
              ))}
            </div>

            {tab === 'ricerche' ? (
              <>
                {/* Period navigator — visible only if there are past periods */}
                {maxOffset > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <button
                    onClick={() => setPeriodOffset((o) => Math.min(o + 1, maxOffset))}
                    disabled={periodOffset >= maxOffset}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: periodOffset >= maxOffset ? 'default' : 'pointer', color: periodOffset >= maxOffset ? 'var(--text-muted)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', opacity: periodOffset >= maxOffset ? 0.4 : 1 }}
                    className="active:scale-95"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {periodOffset === 0
                      ? '📅 Periodo attuale'
                      : `${MONTH_NAMES[periodMonth]} ${periodYear}`}
                  </span>
                  <button
                    onClick={() => setPeriodOffset((o) => Math.max(0, o - 1))}
                    disabled={periodOffset === 0}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: periodOffset === 0 ? 'default' : 'pointer', color: periodOffset === 0 ? 'var(--text-muted)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', opacity: periodOffset === 0 ? 0.4 : 1 }}
                    className="active:scale-95"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                )}
                <AchievementsPanel
                  key={`${periodYear}-${periodMonth}`}
                  periodTx={periodTx}
                  periodFrom={periodFrom}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  goals={goals}
                  year={periodYear}
                  month={periodMonth}
                  onGoToPlanets={() => setTab('pianeti')}
                />
              </>
            ) : (
              <PlanetsMini />
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
