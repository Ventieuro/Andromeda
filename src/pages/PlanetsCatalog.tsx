import { useState, useCallback } from 'react'
import { PageHeader } from '../components/ui'
import { getAllPlanets, SETTINGS } from '../shared/labels'
import type { PlanetRarity } from '../shared/labels'
import { loadPlanetLog } from '../shared/storage'
import PlanetCard from '../components/PlanetCard'

const RARITY_ORDER: Record<PlanetRarity, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5,
}

function buildPlanetSets() {
  const log = loadPlanetLog()
  const discoveredSet = new Set(log.map((e) => e.alias))
  // revealed: true or undefined (legacy) → treat as revealed
  const revealedSet = new Set(log.filter((e) => e.revealed === true).map((e) => e.alias))
  const allPlanets = getAllPlanets().sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])
  const discoveredCount = allPlanets.filter((p) => discoveredSet.has(p.alias)).length
  return { allPlanets, discoveredSet, revealedSet, discoveredCount }
}

function PlanetsCatalog() {
  const [data, setData] = useState(() => buildPlanetSets())

  const handleReveal = useCallback(() => {
    setData(buildPlanetSets())
  }, [])

  const { allPlanets, discoveredSet, revealedSet, discoveredCount } = data

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
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', gridAutoRows: '130px' }}
      >
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

export default PlanetsCatalog

