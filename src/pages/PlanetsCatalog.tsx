import { useMemo } from 'react'
import { PageHeader } from '../components/ui'
import { getAllPlanets, SETTINGS } from '../shared/labels'
import type { PlanetRarity } from '../shared/labels'
import { loadPlanetLog } from '../shared/storage'
import PlanetCard from '../components/PlanetCard'

const RARITY_ORDER: Record<PlanetRarity, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5,
}

function PlanetsCatalog() {
  const { allPlanets, discoveredSet, discoveredCount } = useMemo(() => {
    const log = loadPlanetLog()
    const discoveredSet = new Set(log.map((e) => e.alias))
    const allPlanets = getAllPlanets().sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])
    const discoveredCount = allPlanets.filter((p) =>
      discoveredSet.has(p.alias)
    ).length
    return { allPlanets, discoveredSet, discoveredCount }
  }, [])

  return (
    <div style={{ minHeight: '100%', paddingBottom: '80px' }}>
      <PageHeader title={SETTINGS.pianetiVoce} fallbackPath="/settings" />

      <div className="px-4 py-2 text-center">
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {SETTINGS.pianetiSbloccatiCount(discoveredCount, allPlanets.length)}
        </p>
      </div>

      {/* ── Planet grid (3 columns) ── */}
      <div
        className="px-3"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}
      >
        {allPlanets.map((planet) => {
          const isDiscovered = discoveredSet.has(planet.alias)
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
            />
          )
        })}
      </div>
    </div>
  )
}

export default PlanetsCatalog
