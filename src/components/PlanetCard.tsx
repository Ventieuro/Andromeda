import { useState } from 'react'
import MiniPlanet from './MiniPlanet'
import { Button } from './ui'
import { SETTINGS } from '../shared/labels'
import type { PlanetRarity, PlanetMedium } from '../shared/labels'
import { revealPlanet } from '../shared/storage'

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
  mythic:    { color: '#f0abfc', bg: 'rgba(240,171,252,0.15)', border: 'rgba(240,171,252,0.6)',  label: () => SETTINGS.pianetiRaritaMythic },
}

// ─── Animation classes per rarity ─────────────────────────
const RARITY_UNREVEALED_CLASS: Record<PlanetRarity, string> = {
  common:    'planet-card-unrevealed-common',
  uncommon:  'planet-card-unrevealed-uncommon',
  rare:      'planet-card-unrevealed-rare',
  epic:      'planet-card-unrevealed-epic',
  legendary: 'planet-card-unrevealed-legendary',
  mythic:    'planet-card-unrevealed-mythic',
}
const RARITY_BURST_CLASS: Record<PlanetRarity, string> = {
  common:    '',
  uncommon:  '',
  rare:      'planet-card-reveal-rare',
  epic:      'planet-card-reveal-epic',
  legendary: 'planet-card-reveal-legendary',
  mythic:    'planet-card-reveal-mythic',
}
const RARITY_FLIP_CLASS: Record<PlanetRarity, string> = {
  common:    '',
  uncommon:  '',
  rare:      '',
  epic:      'planet-flip-epic',
  legendary: 'planet-flip-legendary',
  mythic:    'planet-flip-mythic',
}

function categoryColor(key: string): string {
  const PALETTE = ['#ef4444','#f97316','#eab308','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#22c55e','#14b8a6','#f43f5e','#a855f7','#fb923c','#84cc16','#38bdf8','#e879f9']
  let h = 0
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

interface PlanetCardProps {
  categoryKey: string
  categoryLabel: string
  alias?: string         // undefined = locked (not yet discovered)
  source?: string
  medium?: PlanetMedium
  lore?: string
  rarity?: PlanetRarity
  revealed?: boolean     // false = discovered but not yet flipped
  onReveal?: () => void  // called after flip completes
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

function PlanetCard({ categoryKey, alias, source, medium, lore, rarity, revealed = true, onReveal }: PlanetCardProps) {
  const [open, setOpen] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDone, setFlipDone] = useState(false)
  const isUnlocked = !!alias
  const color = categoryColor(categoryKey)
  const rarityBorder = rarity ? RARITY_CONFIG[rarity].border : 'var(--border)'
  const rarityColor = rarity ? RARITY_CONFIG[rarity].color : 'var(--accent)'
  const rarityGlow = rarity ? `0 0 12px ${RARITY_CONFIG[rarity].color}44` : 'none'

  // ── Locked: not yet discovered ──
  if (!isUnlocked) {
    return (
      <div
        className="flex flex-col items-center gap-1.5 rounded-2xl p-2.5 w-full"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', minHeight: '110px', justifyContent: 'center' }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: 18, opacity: 0.3 }}>?</span>
        </div>
        {rarity && <RarityBadge rarity={rarity} />}
      </div>
    )
  }

  // ── Unrevealed or currently flipping ──
  if (!revealed || isFlipping || flipDone) {
    function handleClick() {
      if (flipDone) {
        // flip done → open detail
        setOpen(true)
        return
      }
      if (isFlipping) return
      // start flip
      setIsFlipping(true)
      setTimeout(() => {
        if (alias) revealPlanet(alias)
        setFlipDone(true)
        onReveal?.()
      }, 560)
    }

    return (
      <>
        <div className="planet-card-scene" style={{ minHeight: '110px', cursor: 'pointer' }} onClick={handleClick}>
          <div className={`planet-card-inner ${isFlipping || flipDone ? 'flipped' : ''} ${rarity ? RARITY_FLIP_CLASS[rarity] : ''}`} style={{ minHeight: '110px' }}>
            {/* Front: mystery */}
            <div
              className={`planet-card-face ${!isFlipping && !flipDone && rarity ? RARITY_UNREVEALED_CLASS[rarity] : ''}`}
              style={{ backgroundColor: 'var(--bg-secondary)', border: `2px solid ${rarityColor}`, ['--rarity-color' as string]: rarityColor }}
            >
              <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, backgroundColor: `${rarityColor}22`, border: `1px solid ${rarityColor}66` }}>
                <span style={{ color: rarityColor, fontSize: 20, fontWeight: 700 }}>?</span>
              </div>
              <p className="text-[11px] font-bold" style={{ color: rarityColor }}>???</p>
              {rarity && <RarityBadge rarity={rarity} />}
              {!isFlipping && !flipDone && (
                <p className="text-[9px] text-center" style={{ color: 'var(--text-muted)', lineHeight: 1.2 }}>Tocca per rivelare</p>
              )}
            </div>
            {/* Back: revealed planet */}
            <div className={`planet-card-face planet-card-back ${flipDone && rarity ? RARITY_BURST_CLASS[rarity] : ''}`} style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${rarityBorder}`, boxShadow: rarityGlow, ['--rarity-color' as string]: rarityColor }}>
              <MiniPlanet color={color} size={40} />
              <p className="text-[11px] font-bold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>{alias}</p>
              {source && <p className="text-[9px] text-center leading-tight" style={{ color: 'var(--text-muted)' }}>{source}</p>}
              {rarity && <RarityBadge rarity={rarity} />}
            </div>
          </div>
        </div>

        {/* Detail modal (available once flip is done) */}
        {open && flipDone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setOpen(false)}>
            <div
              className="flex flex-col items-center gap-4 rounded-2xl p-6 w-full max-w-xs"
              style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${rarityBorder}`, boxShadow: `0 0 32px ${rarityColor}44` }}
              onClick={(e) => e.stopPropagation()}
            >
              <MiniPlanet color={color} size={80} />
              <p className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>{alias}</p>
              {rarity && <RarityBadge rarity={rarity} />}
              {source && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {medium ? MEDIUM_CONFIG[medium].icon : '🎬'} {source}{medium ? ` · ${MEDIUM_CONFIG[medium].label}` : ''}
                </p>
              )}
              {lore && <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{lore}</p>}
              <Button variant="primary" fullWidth onClick={() => setOpen(false)}>Chiudi</Button>
            </div>
          </div>
        )}
      </>
    )
  }

  // ── Revealed: normal planet card ──
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-1.5 rounded-2xl p-2.5 w-full transition-all active:scale-95"
        style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${rarityBorder}`, boxShadow: rarityGlow, cursor: 'pointer', minHeight: '110px', justifyContent: 'center' }}
      >
        <MiniPlanet color={color} size={40} />
        <p className="text-[11px] font-bold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>{alias}</p>
        {source && <p className="text-[9px] text-center leading-tight" style={{ color: 'var(--text-muted)' }}>{source}</p>}
        {rarity && <RarityBadge rarity={rarity} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setOpen(false)}>
          <div
            className="flex flex-col items-center gap-4 rounded-2xl p-6 w-full max-w-xs"
            style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${rarityBorder}`, boxShadow: `0 0 32px ${rarityColor}44` }}
            onClick={(e) => e.stopPropagation()}
          >
            <MiniPlanet color={color} size={80} />
            <p className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>{alias}</p>
            {rarity && <RarityBadge rarity={rarity} />}
            {source && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {medium ? MEDIUM_CONFIG[medium].icon : '🎬'} {source}{medium ? ` · ${MEDIUM_CONFIG[medium].label}` : ''}
              </p>
            )}
            {lore && <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{lore}</p>}
            <Button variant="primary" fullWidth onClick={() => setOpen(false)}>Chiudi</Button>
          </div>
        </div>
      )}
    </>
  )
}

export default PlanetCard


