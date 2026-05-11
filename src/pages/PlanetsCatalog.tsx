import { useState, useCallback, useRef, useEffect } from 'react'
import { PageHeader } from '../components/ui'
import { getAllPlanets, SETTINGS } from '../shared/labels'
import type { PlanetRarity } from '../shared/labels'
import { loadPlanetLog } from '../shared/storage'
import PlanetCard from '../components/PlanetCard'
import { OW_INSTRUMENTS } from '../shared/owInstruments'

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

const HINT_KEY = 'andromeda-pianeti-hint-dismissed'

function PlanetsCatalog() {
  const [data, setData] = useState(() => buildPlanetSets())
  const audioMapRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const initializedRef = useRef(false)
  const [playing, setPlaying] = useState<Set<string>>(new Set())
  const [showHint, setShowHint] = useState(() => localStorage.getItem(HINT_KEY) !== '1')

  // Ferma tutto al dismount
  useEffect(() => {
    return () => {
      audioMapRef.current.forEach((audio) => { audio.pause(); audio.currentTime = 0 })
    }
  }, [])

  const handleReveal = useCallback(() => {
    setData(buildPlanetSets())
  }, [])

  function dismissHint() {
    localStorage.setItem(HINT_KEY, '1')
    setShowHint(false)
  }

  // Al primo toggle: avvia TUTTI i track insieme (muted) per tenerli in sync.
  // I successivi toggle sono solo mute/unmute.
  function toggleInstrument(alias: string) {
    if (!OW_INSTRUMENTS[alias]) return

    if (!initializedRef.current) {
      initializedRef.current = true
      // Crea e avvia tutti i track contemporaneamente, tutti mutati
      Object.entries(OW_INSTRUMENTS).forEach(([key, instr]) => {
        const audio = new Audio(instr.src)
        audio.loop = true
        audio.muted = true
        audioMapRef.current.set(key, audio)
        audio.play().catch(() => {})
      })
    }

    setPlaying((prev) => {
      const next = new Set(prev)
      const audio = audioMapRef.current.get(alias)
      if (!audio) return prev
      if (next.has(alias)) {
        audio.muted = true
        next.delete(alias)
      } else {
        audio.muted = false
        next.add(alias)
      }
      // Se non rimane nessuno attivo: ferma tutto e resetta
      if (next.size === 0) {
        audioMapRef.current.forEach((a) => { a.pause(); a.currentTime = 0 })
        audioMapRef.current.clear()
        initializedRef.current = false
      }
      return next
    })
  }

  const { allPlanets, discoveredSet, revealedSet, discoveredCount } = data

  return (
    <div style={{ minHeight: '100%', paddingBottom: '80px' }}>
      <PageHeader title={SETTINGS.pianetiVoce} fallbackPath="/settings" />

      <div className="px-4 py-2 text-center">
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {SETTINGS.pianetiSbloccatiCount(discoveredCount, allPlanets.length)}
        </p>
      </div>

      {/* ── Hint banner ── */}
      {showHint && (
        <div
          className="mx-4 mb-3 rounded-2xl px-4 py-3 flex items-start gap-3"
          style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', opacity: 0.95 }}
        >
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.4 }}>🪐</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
              {SETTINGS.pianetiHintTitolo}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {SETTINGS.pianetiHintBody}
            </p>
          </div>
          <button
            onClick={dismissHint}
            aria-label="Chiudi suggerimento"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1, padding: '2px 0 0', flexShrink: 0 }}
          >✕</button>
        </div>
      )}

      {/* ── Planet grid (3 columns) ── */}
      <div
        className="px-3"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', gridAutoRows: '130px' }}
      >
        {allPlanets.map((planet) => {
          const isDiscovered = discoveredSet.has(planet.alias)
          const isRevealed = revealedSet.has(planet.alias)
          const owInstr = OW_INSTRUMENTS[planet.alias]
          const showInstrument = isDiscovered && isRevealed && !!owInstr
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
              instrumentIcon={showInstrument ? owInstr.icon : undefined}
              instrumentLabel={showInstrument ? owInstr.label : undefined}
              isPlaying={playing.has(planet.alias)}
              onToggleInstrument={showInstrument ? () => toggleInstrument(planet.alias) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PlanetsCatalog

