// Ali — sbloccate al 35%

import type { ShipSkin } from './types'

interface ShipWingsProps { color: string; anim: boolean; skin?: ShipSkin }

export default function ShipWings({ color, anim, skin = 0 }: ShipWingsProps) {
  switch (skin) {
    // ── Skin 1: aggiungi qui la tua variante ──────────────────
    // case 1: return (
    //   <g id="ship-wings" className={anim ? 'mc-unlock' : ''}>...</g>
    // )

    // ── Skin 0: default ───────────────────────────────────────
    default: return (
      <g id="ship-wings" className={anim ? 'mc-unlock' : ''}>
        <path d="M70 140 L30 170 L45 155 L70 158 Z"    fill={color} stroke="#ffffff20" strokeWidth="1"/>
        <line x1="70"  y1="140" x2="36"  y2="165" stroke="#ffffff20" strokeWidth="1"/>
        <path d="M130 140 L170 170 L155 155 L130 158 Z" fill={color} stroke="#ffffff20" strokeWidth="1"/>
        <line x1="130" y1="140" x2="164" y2="165" stroke="#ffffff20" strokeWidth="1"/>
      </g>
    )
  }
}
