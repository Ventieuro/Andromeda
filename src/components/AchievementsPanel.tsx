import { useMemo, useState } from 'react'
import type { Transaction, SavingsGoal } from '../shared/types'
import { claimAchievementPlanet, claimBonusPlanet, loadAchievementRecord, isPlanetRevealed } from '../shared/storage'
import { getAllPlanets } from '../shared/labels'
import type { PlanetRarity } from '../shared/labels'
import { ACHIEVEMENTS } from '../shared/labels'
import { Button } from './ui'

// ─── Achievement definitions ─────────────────────────────

interface AchievementDef {
  id: string
  icon: string
  title: string
  desc: string
  check: (ctx: AchievementContext) => boolean
}

interface AchievementContext {
  expenses: Transaction[]
  periodFrom: string
  totalIncome: number
  totalExpenses: number
  goals: SavingsGoal[]
}

function buildAchievements(): AchievementDef[] {
  return [
    {
      id: 'explorer',
      icon: '🚀',
      title: ACHIEVEMENTS.explorerTitle,
      desc: ACHIEVEMENTS.explorerDesc,
      check: (ctx) => ctx.expenses.length >= 5,
    },
    {
      id: 'analyst',
      icon: '📷',
      title: ACHIEVEMENTS.analystTitle,
      desc: ACHIEVEMENTS.analystDesc,
      check: (ctx) => ctx.expenses.some((tx) => tx.isReceipt),
    },
    {
      id: 'saver',
      icon: '🎯',
      title: ACHIEVEMENTS.saverTitle,
      desc: ACHIEVEMENTS.saverDesc,
      check: (ctx) => ctx.expenses.some((tx) => tx.type === 'uscita' && !!tx.goalId),
    },
    {
      id: 'diversified',
      icon: '🗂️',
      title: ACHIEVEMENTS.diverseTitle,
      desc: ACHIEVEMENTS.diverseDesc,
      check: (ctx) => new Set(ctx.expenses.map((tx) => tx.category)).size >= 4,
    },
    {
      id: 'punctual',
      icon: '💰',
      title: ACHIEVEMENTS.punctualTitle,
      desc: ACHIEVEMENTS.punctualDesc,
      check: (ctx) => {
        const from = new Date(ctx.periodFrom + 'T00:00:00')
        const earlyEnd = new Date(from)
        earlyEnd.setDate(earlyEnd.getDate() + 6)
        const earlyStr = earlyEnd.toISOString().slice(0, 10)
        return ctx.expenses.filter((tx) => tx.date >= ctx.periodFrom && tx.date <= earlyStr).length >= 3
      },
    },
  ]
}

// ─── Rarity colors ───────────────────────────────────────

const RARITY_COLOR: Record<PlanetRarity, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
  mythic: '#ec4899',
}

// ─── Planet chip ─────────────────────────────────────────

function PlanetChip({ alias, rarity, source }: { alias: string; rarity: PlanetRarity; source?: string }) {
  const color = RARITY_COLOR[rarity]
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: '20px',
      background: `${color}18`, border: `1px solid ${color}55`,
    }}>
      <span style={{ fontSize: '14px' }}>🪐</span>
      <span style={{ fontSize: '12px', fontWeight: 700, color }}>{alias}</span>
      {source && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>· {source}</span>}
    </div>
  )
}

function PlanetChipByAlias({ alias }: { alias: string }) {
  const planet = getAllPlanets().find((p) => p.alias === alias)
  if (!planet) return <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🪐 {alias}</span>
  return <PlanetChip alias={planet.alias} rarity={planet.rarity} source={planet.source} />
}

// ─── Props ───────────────────────────────────────────────

interface AchievementsPanelProps {
  periodTx: Transaction[]
  periodFrom: string
  totalIncome: number
  totalExpenses: number
  goals: SavingsGoal[]
  year: number
  month: number
  onGoToPlanets?: () => void
}

// ─── Component ───────────────────────────────────────────

export default function AchievementsPanel({
  periodTx,
  periodFrom,
  totalIncome,
  totalExpenses,
  goals,
  year,
  month,
  onGoToPlanets,
}: AchievementsPanelProps) {
  const [record, setRecord] = useState(() => loadAchievementRecord(year, month))

  const achievements = useMemo(buildAchievements, [])

  const ctx: AchievementContext = useMemo(() => ({
    expenses: periodTx.filter((tx) => tx.type === 'uscita'),
    periodFrom,
    totalIncome,
    totalExpenses,
    goals,
  }), [periodTx, periodFrom, totalIncome, totalExpenses, goals])

  const results = useMemo(
    () => achievements.map((a) => ({ ...a, done: a.check(ctx) })),
    [achievements, ctx],
  )
  const doneCount = results.filter((r) => r.done).length
  const allDone = doneCount === 5

  function handleClaim(id: string) {
    claimAchievementPlanet(id, year, month)
    setRecord(loadAchievementRecord(year, month))
  }

  function handleBonus() {
    claimBonusPlanet(year, month)
    setRecord(loadAchievementRecord(year, month))
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            🔭 {ACHIEVEMENTS.titolo}
          </h2>
          <span style={{
            fontSize: '12px', fontWeight: 700,
            color: allDone ? '#22c55e' : 'var(--text-muted)',
            background: allDone ? 'rgba(34,197,94,0.12)' : 'var(--bg-secondary)',
            borderRadius: '20px', padding: '3px 10px',
            border: `1px solid ${allDone ? '#22c55e44' : 'var(--border)'}`,
          }}>
            {ACHIEVEMENTS.progressoLabel(doneCount)}
          </span>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          {ACHIEVEMENTS.sottotitolo}
        </p>
      </div>

      {/* Achievement rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {results.map((a) => {
          const claimedAlias = record.claimed[a.id]
          return (
            <div
              key={a.id}
              style={{
                padding: '12px 14px', borderRadius: '14px',
                background: a.done ? 'rgba(34,197,94,0.07)' : 'var(--bg-secondary)',
                border: `1px solid ${a.done ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px', flexShrink: 0, opacity: a.done ? 1 : 0.5 }}>
                  {a.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0, fontSize: '14px', fontWeight: 600,
                    color: a.done ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}>
                    {a.title}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {a.desc}
                  </p>
                </div>
                {/* Custom checkbox */}
                <div style={{
                  flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: a.done
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    : 'var(--bg-primary)',
                  border: a.done ? '2px solid #22c55e' : '2px solid var(--border)',
                  boxShadow: a.done ? '0 0 8px rgba(34,197,94,0.4)' : 'none',
                  transition: 'all 0.25s',
                }}>
                  {a.done && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Per-achievement reward */}
              {a.done && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  {claimedAlias ? (
                    isPlanetRevealed(claimedAlias) ? (
                      <PlanetChipByAlias alias={claimedAlias} />
                    ) : (
                      onGoToPlanets ? (
                        <button
                          onClick={onGoToPlanets}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                            fontSize: '12px', color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
                        >
                          🔒 Pianeta assegnato — scoprilo in &ldquo;Pianeti&rdquo; ›
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          🔒 Pianeta assegnato — scoprilo nel catalogo
                        </span>
                      )
                    )
                  ) : (
                    <button
                      onClick={() => handleClaim(a.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', borderRadius: '20px', border: 'none',
                        background: 'var(--accent)', color: 'white',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        transition: 'opacity 0.15s, transform 0.1s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {ACHIEVEMENTS.riscuotiSingolo}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bonus — all 5 done */}
      {allDone && (
        <div style={{
          marginTop: '16px', padding: '16px', borderRadius: '16px', textAlign: 'center',
          background: record.bonusClaimed
            ? 'rgba(245,158,11,0.08)'
            : 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(236,72,153,0.12) 100%)',
          border: `1px solid ${record.bonusClaimed ? 'rgba(245,158,11,0.4)' : 'rgba(245,158,11,0.5)'}`,
        }}>
          <p style={{ margin: '0 0 6px', fontSize: '20px' }}>🌟</p>
          {record.bonusClaimed ? (
            <>
              <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>
                {ACHIEVEMENTS.bonusPianeta}
              </p>
              {record.bonusAlias && (
                isPlanetRevealed(record.bonusAlias) ? (
                  <PlanetChipByAlias alias={record.bonusAlias} />
                ) : (
                  onGoToPlanets ? (
                    <button
                      onClick={onGoToPlanets}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        fontSize: '12px', color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      🔒 Pianeta bonus assegnato — scoprilo in &ldquo;Pianeti&rdquo; ›
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      🔒 Pianeta bonus assegnato — scoprilo nel catalogo
                    </span>
                  )
                )
              )}
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>
                {ACHIEVEMENTS.completate}
              </p>
              <Button variant="primary" onClick={handleBonus}>
                {ACHIEVEMENTS.riscuotiBonus}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Reset hint */}
      <p style={{ margin: '12px 0 0', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
        🔄 {ACHIEVEMENTS.reset}
      </p>
    </div>
  )
}
