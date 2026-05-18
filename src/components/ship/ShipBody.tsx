// Fusoliera — sbloccata al 15%

import type { ShipSkin } from './types'

interface ShipBodyProps { color: string; anim: boolean; skin?: ShipSkin }

export default function ShipBody({ color, anim, skin = 0 }: ShipBodyProps) {
  switch (skin) {
    // ── Skin 1: aggiungi qui la tua variante ──────────────────
    // case 1: return (
    //   <g id="ship-body" className={anim ? 'mc-unlock' : ''}>...</g>
    // )

    // ── Skin 0: default ───────────────────────────────────────
    default: return (
      <g id="ship-body" className={anim ? 'mc-unlock' : ''}>
        <rect x="70" y="115" width="60" height="50" rx="16" fill={color} stroke="#ffffff20" strokeWidth="1"/>
        <line x1="72"  y1="132" x2="128" y2="132" stroke="#ffffff22" strokeWidth="1"/>
        <line x1="72"  y1="148" x2="128" y2="148" stroke="#ffffff22" strokeWidth="1"/>
        <line x1="88"  y1="115" x2="88"  y2="165" stroke="#ffffff15" strokeWidth="1"/>
        <line x1="112" y1="115" x2="112" y2="165" stroke="#ffffff15" strokeWidth="1"/>
        <circle cx="76"  cy="138" r="4" fill="#ff4444" className="mc-blink-r"/>
        <circle cx="124" cy="138" r="4" fill="#44ff88" className="mc-blink-g"/>
        <rect x="78" y="120" width="20" height="8" rx="4" fill="#ffffff12"/>
      </g>
    )
  }
}
