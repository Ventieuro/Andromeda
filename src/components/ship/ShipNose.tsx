// Ogiva — sbloccata al 55%

import type { ShipSkin } from './types'

interface ShipNoseProps { color: string; anim: boolean; skin?: ShipSkin }

export default function ShipNose({ color, anim, skin = 0 }: ShipNoseProps) {
  switch (skin) {
    // ── Skin 1: aggiungi qui la tua variante ──────────────────
    // case 1: return (
    //   <g id="ship-nose" className={anim ? 'mc-unlock' : ''}>...</g>
    // )

    // ── Skin 0: default ───────────────────────────────────────
    default: return (
      <g id="ship-nose" className={anim ? 'mc-unlock' : ''}>
        <path d="M100 38 Q82 68 78 95 Q100 88 122 95 Q118 68 100 38 Z" fill={color} stroke="#ffffff20" strokeWidth="1"/>
        <path d="M100 50 Q92 72 90 90" stroke="#ffffff25" strokeWidth="2" fill="none"/>
      </g>
    )
  }
}
