import { useState } from 'react'
import MiniPlanet from './MiniPlanet'
import { Button } from './ui'
import { SETTINGS } from '../shared/labels'
import type { PlanetRarity, PlanetMedium } from '../shared/labels'

// ─── Medium config ────────────────────────────────────────
const MEDIUM_CONFIG: Record<PlanetMedium, { icon: string; label: string }> = {
  videogame: { icon: '🎮', label: 'Videogioco' },
  book:      { icon: '📖', label: 'Libro' },
  film:      { icon: '🎬', label: 'Film' },
  series:    { icon: '📺', label: 'Serie TV' },
  tabletop:  { icon: '🎲', label: 'Gioco da tavolo' },
  realworld: { icon: '🌍', label: 'Reale' },
}

// ─── Rarity config ───────────────────────────────────────
const RARITY_CONFIG: Record<PlanetRarity, { color: string; bg: string; border: string; label: () => string }> = {
  common:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.35)', label: () => SETTINGS.pianetiRaritaCommon },
  uncommon:  { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',   label: () => SETTINGS.pianetiRaritaUncommon },
  rare:      { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)',  label: () => SETTINGS.pianetiRaritaRare },
  epic:      { color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.35)',  label: () => SETTINGS.pianetiRaritaEpic },
  legendary: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.5)',   label: () => SETTINGS.pianetiRaritaLegendary },
  mythic:    { color: '#f0abfc', bg: 'rgba(240,171,252,0.15)', border: 'rgba(240,171,252,0.6)',   label: () => SETTINGS.pianetiRaritaMythic },
}

// Stable color per category (deterministic hash)
function categoryColor(key: string): string {
  const PALETTE = ['#ef4444','#f97316','#eab308','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#22c55e','#14b8a6','#f43f5e','#a855f7','#fb923c','#84cc16','#38bdf8','#e879f9']
  let h = 0
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

interface PlanetCardProps {
  categoryKey: string
  categoryLabel: string
  alias?: string       // undefined = locked
  source?: string
  medium?: PlanetMedium
  lore?: string
  rarity?: PlanetRarity
}

function RarityBadge({ rarity }: { rarity: PlanetRarity }) {
  const cfg = RARITY_CONFIG[rarity]
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label()}
    </span>
  )
}

function PlanetCard({ categoryKey, alias, source, medium, lore, rarity }: PlanetCardProps) {
  const [open, setOpen] = useState(false)
  const isUnlocked = !!alias
  const color = categoryColor(categoryKey)
  const rarityBorder = rarity ? RARITY_CONFIG[rarity].border : 'var(--border)'
  const rarityGlow = rarity && isUnlocked ? `0 0 12px ${RARITY_CONFIG[rarity].color}44` : 'none'

  return (
    <>
      {/* ── Card ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-1.5 rounded-2xl p-2.5 w-full transition-all active:scale-95"
        style={{
          backgroundColor: isUnlocked ? 'var(--bg-card)' : 'var(--bg-secondary)',
          border: `1px solid ${isUnlocked ? rarityBorder : 'var(--border)'}`,
          boxShadow: rarityGlow,
          cursor: 'pointer',
          minHeight: '110px',
          justifyContent: 'center',
        }}
      >
        {/* Planet visual */}
        {isUnlocked ? (
          <MiniPlanet color={color} size={40} />
        ) : (
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: 18, opacity: 0.5 }}>?</span>
          </div>
        )}

        {/* Name + source */}
        {isUnlocked ? (
          <>
            <p className="text-[11px] font-bold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>
              {alias}
            </p>
            {source && (
              <p className="text-[9px] text-center leading-tight" style={{ color: 'var(--text-muted)' }}>
                {source}
              </p>
            )}
          </>
        ) : null}

        {/* Rarity badge */}
        {rarity && <RarityBadge rarity={rarity} />}
      </button>

      {/* ── Detail popup ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-4 rounded-2xl p-6 w-full max-w-xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${isUnlocked ? rarityBorder : 'var(--border)'}`,
              boxShadow: isUnlocked ? `0 0 32px ${RARITY_CONFIG[rarity!]?.color}44` : 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isUnlocked ? (
              <>
                <MiniPlanet color={color} size={80} />
                <p className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>{alias}</p>
                {rarity && <RarityBadge rarity={rarity} />}
                {source && (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {medium ? MEDIUM_CONFIG[medium].icon : '🎬'} {source}{medium ? ` · ${MEDIUM_CONFIG[medium].label}` : ''}
                  </p>
                )}
                {lore && (
                  <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {lore}
                  </p>
                )}
              </>
            ) : (
              <>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
                >
                  <span style={{ fontSize: 36, color: 'var(--text-muted)', opacity: 0.4 }}>?</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>???</p>
                {rarity && <RarityBadge rarity={rarity} />}
                <p className="text-sm text-center" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  Pianeta non ancora scoperto.
                </p>
              </>
            )}
            <Button variant="primary" fullWidth onClick={() => setOpen(false)}>Chiudi</Button>
          </div>
        </div>
      )}
    </>
  )
}

export default PlanetCard
