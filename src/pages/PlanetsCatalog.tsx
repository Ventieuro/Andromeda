import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui'
import { getPlanetCatalog, normalizeCategoryKey, SETTINGS } from '../shared/labels'
import { getCategoryIcon } from '../shared/categoryIcons'
import { getTransactionsInPeriod, loadSettings, loadTransactions } from '../shared/storage'

const MOCK_UNLOCKED_KEYS = ['Cibo', 'Spesa', 'Trasporti', 'Bollette', 'Svago', 'Comunicazioni']

function getCurrentPeriod(payDay: number): { start: Date; end: Date } {
  const now = new Date()
  const baseMonth = now.getDate() >= payDay ? now.getMonth() : now.getMonth() - 1
  const start = new Date(now.getFullYear(), baseMonth, payDay)
  const end = new Date(start.getFullYear(), start.getMonth() + 1, payDay - 1)
  return { start, end }
}

function PlanetsCatalog() {
  const [onlyUnlocked, setOnlyUnlocked] = useState(true)
  const [useMockData, setUseMockData] = useState(true)
  const planets = getPlanetCatalog('uscita')

  const unlockedSet = useMemo(() => {
    if (useMockData) return new Set(MOCK_UNLOCKED_KEYS)

    const all = loadTransactions()
    const { payDay } = loadSettings()
    const { start, end } = getCurrentPeriod(payDay)
    const periodTx = getTransactionsInPeriod(all, start, end)

    const keys = periodTx
      .filter((t) => t.type === 'uscita')
      .map((t) => normalizeCategoryKey(t.category, 'uscita'))

    return new Set(keys)
  }, [useMockData])

  const visiblePlanets = useMemo(
    () => (onlyUnlocked ? planets.filter((p) => unlockedSet.has(p.categoryKey)) : planets),
    [onlyUnlocked, planets, unlockedSet],
  )

  const unlockedCount = planets.filter((p) => unlockedSet.has(p.categoryKey)).length

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.pianetiVoce} fallbackPath="/settings" />

      <div className="px-4 py-3 space-y-2.5">
        <div className="rounded-xl p-3 space-y-2" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {SETTINGS.pianetiSbloccatiCount(unlockedCount, planets.length)}
          </p>
          <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={onlyUnlocked} onChange={(e) => setOnlyUnlocked(e.target.checked)} />
            {SETTINGS.pianetiSoloSbloccati}
          </label>
          <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={useMockData} onChange={(e) => setUseMockData(e.target.checked)} />
            {SETTINGS.pianetiUsaMock}
          </label>
          {useMockData && (
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {SETTINGS.pianetiMockNota}
            </p>
          )}
        </div>

        {visiblePlanets.length === 0 && (
          <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{SETTINGS.pianetiNessuno}</p>
          </div>
        )}

        {visiblePlanets.map((planet) => {
          const isUnlocked = unlockedSet.has(planet.categoryKey)
          return (
          <div
            key={planet.categoryKey}
            className="rounded-xl p-3"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {getCategoryIcon(planet.categoryKey)} {planet.categoryLabel}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  {planet.alias}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: isUnlocked ? 'rgba(34,197,94,0.14)' : 'var(--bg-secondary)',
                    color: isUnlocked ? '#22c55e' : 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {isUnlocked ? SETTINGS.pianetiStatoSbloccato : SETTINGS.pianetiStatoBloccato}
                </span>
              </div>
            </div>

            <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
              {planet.lore}
            </p>

            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
              Fonte: {planet.source}
            </p>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlanetsCatalog
