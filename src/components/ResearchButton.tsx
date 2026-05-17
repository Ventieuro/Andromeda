import { useState, useCallback, useEffect } from 'react'
import type { SavingsGoal } from '../shared/types'
import { loadTransactions, loadSettings, getTransactionsInPeriod, loadAchievementRecord, loadGoals, loadPlanetLog } from '../shared/storage'
import { ACHIEVEMENTS, getAllPlanets, SETTINGS } from '../shared/labels'
import type { PlanetRarity } from '../shared/labels'
import { Modal } from './ui'
import AchievementsPanel from './AchievementsPanel'
import PlanetCard from './PlanetCard'
import { TelescopeIcon } from '../shared/icons'
import { useLocation } from 'react-router-dom'

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
  const location = useLocation()

  // Chiudi il popup quando si naviga verso un'altra pagina
  useEffect(() => {
    setOpen(false)
    setTab('ricerche')
  }, [location.pathname])

  // Compute period data for AchievementsPanel
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
  const goals = loadGoals()
  const badgeCount = computeBadge(goals)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={ACHIEVEMENTS.titolo}
        title={ACHIEVEMENTS.titolo}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--nav-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '50%',
          transition: 'opacity 0.2s',
        }}
        className="hover:opacity-70 active:scale-90"
      >
        <TelescopeIcon size={22} />
        {badgeCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
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
              <AchievementsPanel
                periodTx={periodTx}
                periodFrom={periodFrom}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                goals={goals}
                year={periodYear}
                month={periodMonth}
                onGoToPlanets={() => setTab('pianeti')}
              />
            ) : (
              <PlanetsMini />
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
