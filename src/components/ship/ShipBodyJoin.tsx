// Raccordo corpo-naso — colore del body, sempre sopra il naso nel rendering

import type { ShipSkin } from './types'

interface ShipBodyJoinProps { color: string; unlocked: boolean; skin?: ShipSkin }

export default function ShipBodyJoin({ color, unlocked, skin = 0 }: ShipBodyJoinProps) {
  switch (skin) {
    // ── Skin 1: aggiungi qui la tua variante ──────────────────
    // case 1: return unlocked
    //   ? <rect .../>  // forma alternativa sbloccata
    //   : <rect .../>  // forma alternativa bloccata (ghost)

    // ── Skin 0: default ───────────────────────────────────────
    default: return unlocked
      ? <rect x="70" y="88" width="60" height="30" rx="14" fill={color}/>
      : <rect x="70" y="88" width="60" height="30" rx="14" fill="#8899cc" opacity="0.08" stroke="#8899cc" strokeWidth="1" strokeDasharray="4 4"/>
  }
}
