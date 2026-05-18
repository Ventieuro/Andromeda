// Motore — parte bassa della navicella, sempre visibile
// Contiene anche le fiamme animate (showFlames)

import type { ShipSkin } from './types'

interface ShipEngineProps {
  color: string
  anim: boolean
  showFlames: boolean
  bigFlames: boolean
  igniting: boolean
  skin?: ShipSkin
}

export default function ShipEngine({ color, showFlames, bigFlames, igniting, skin = 0 }: ShipEngineProps) {
  const flameA = bigFlames ? 'mc-flame-big' : 'mc-flame-a'
  const flameB = bigFlames ? 'mc-flame-big' : 'mc-flame-b'
  switch (skin) {
    // ── Skin 1: aggiungi qui la tua variante ──────────────────
    // case 1: return (
    //   <g id="ship-engine">...</g>
    // )

    // ── Skin 0: default ───────────────────────────────────────
    default: return (
      <g id="ship-engine">
        <ellipse cx="100" cy="175" rx="22" ry="10" fill={color} stroke="#ffffff20" strokeWidth="1" opacity="0.9"/>
        <path d="M78 165 Q100 178 122 165 L116 155 Q100 162 84 155 Z" fill={color} stroke="#ffffff20" strokeWidth="1"/>
        <rect x="78"  y="155" width="8"  height="14" rx="4" fill={color} stroke="#ffffff20" strokeWidth="1" opacity="0.8"/>
        <rect x="114" y="155" width="8"  height="14" rx="4" fill={color} stroke="#ffffff20" strokeWidth="1" opacity="0.8"/>
        {showFlames && (
          <g className={igniting ? 'mc-flame-appear' : ''}>
            <ellipse cx="90"  cy="185" rx={bigFlames ? 10 : 6} ry={bigFlames ? 20 : 10} fill="#ff8800" className={flameA} style={{ transformOrigin: '90px 175px' }}/>
            <ellipse cx="110" cy="185" rx={bigFlames ?  9 : 5} ry={bigFlames ? 17 :  8} fill="#ffcc00" className={flameB} style={{ transformOrigin: '110px 175px' }}/>
            <ellipse cx="100" cy="183" rx={bigFlames ?  7 : 4} ry={bigFlames ? 15 :  7} fill="#fff5aa" className={flameA} style={{ transformOrigin: '100px 175px' }}/>
            <ellipse cx="100" cy="182" rx={bigFlames ? 26 : 14} ry={bigFlames ? 12 : 6} fill="#ff6600" opacity="0.25"/>
          </g>
        )}
      </g>
    )
  }
}
