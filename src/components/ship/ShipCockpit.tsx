// Oblò / cockpit — sbloccato al 75%, sempre renderizzato sopra tutto

import type { ShipSkin } from './types'

interface ShipCockpitProps { color: string; anim: boolean; skin?: ShipSkin }

export default function ShipCockpit({ color, anim, skin = 0 }: ShipCockpitProps) {
  switch (skin) {
    // ── Skin 1: aggiungi qui la tua variante ──────────────────
    // case 1: return (
    //   <g id="ship-cockpit" className={anim ? 'mc-unlock' : ''}>...</g>
    // )

    // ── Skin 0: default ───────────────────────────────────────
    default: return (
      <g id="ship-cockpit" className={anim ? 'mc-unlock' : ''}>
        <circle cx="100" cy="112" r="21" fill={color} stroke="#ffffff25" strokeWidth="1.5"/>
        <circle cx="100" cy="112" r="16" fill="#0f1530"/>
        <circle cx="100" cy="112" r="16" fill={color} opacity="0.18"/>
        <ellipse cx="93"  cy="105" rx="6"   ry="5" fill="#ffffff" opacity="0.45" transform="rotate(-20 93 105)"/>
        <ellipse cx="108" cy="116" rx="2.5" ry="2" fill="#ffffff" opacity="0.25"/>
      </g>
    )
  }
}
