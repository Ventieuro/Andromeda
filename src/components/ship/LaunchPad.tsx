// Rampa di lancio — viewBox 0 0 200 200
// showOpenArms: true durante la sequenza di lancio (le braccia si aprono)

const COL_RUNGS_Y = [60, 74, 88, 102, 116, 130, 144]  // y dei blocchetti sulle colonne
const RUNG_Y      = [68, 82, 96, 110, 124, 138, 152]   // y dei traversini orizzontali

interface LaunchPadProps { showOpenArms?: boolean }

export default function LaunchPad({ showOpenArms = false }: LaunchPadProps) {
  return (
    <g>
      {/* ── Gambe di supporto ── */}
      <path d="M38 165 L22 192"   stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M60 165 L46 192"   stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M140 165 L154 192" stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M162 165 L178 192" stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>

      {/* ── Piattaforma base ── */}
      <rect x="28" y="163" width="144" height="14" rx="5" fill="#1e2a45"/>
      <rect x="28" y="163" width="144" height="5"  rx="5" fill="#2a3a6a" opacity="0.45"/>
      {[35, 165].map((cx) => [167, 174].map((cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="#2a3a6a"/>
      )))}

      {/* ── Colonna sinistra ── */}
      <rect x="32" y="52" width="11" height="113" rx="3" fill="#1e2a45"/>
      <line x1="37" y1="52" x2="37" y2="163" stroke="#2a3a5a" strokeWidth="0.8" strokeDasharray="3 5"/>
      {COL_RUNGS_Y.map((y) => (
        <rect key={y} x="31" y={y} width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      ))}

      {/* ── Colonna destra ── */}
      <rect x="157" y="52" width="11" height="113" rx="3" fill="#1e2a45"/>
      <line x1="163" y1="52" x2="163" y2="163" stroke="#2a3a5a" strokeWidth="0.8" strokeDasharray="3 5"/>
      {COL_RUNGS_Y.map((y) => (
        <rect key={y} x="156" y={y} width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      ))}

      {/* ── Traversini orizzontali ── */}
      {RUNG_Y.map((y) => (
        <line key={y} x1="43" y1={y} x2="157" y2={y} stroke="#2a3a6a" strokeWidth="1.5"/>
      ))}

      {/* ── Bracci (si aprono al lancio) ── */}
      <g className={showOpenArms ? 'mc-pad-arm-l' : ''}>
        <path d="M43 52 Q62 36 100 30" stroke="#1e2a45" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <circle cx="43" cy="52" r="6" fill="#1e2a45"/>
        <circle cx="43" cy="52" r="3" fill="#2a3a6a"/>
      </g>
      <g className={showOpenArms ? 'mc-pad-arm-r' : ''}>
        <path d="M168 52 Q138 36 100 30" stroke="#1e2a45" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <circle cx="168" cy="52" r="6" fill="#1e2a45"/>
        <circle cx="168" cy="52" r="3" fill="#2a3a6a"/>
      </g>

      {/* ── Luci lampeggianti in cima ── */}
      <circle cx="37"  cy="47" r="5" fill="#ff2222" className="mc-blink-pad"/>
      <circle cx="37"  cy="47" r="3" fill="#ff8888" className="mc-blink-pad"/>
      <circle cx="163" cy="47" r="5" fill="#ff2222" className="mc-blink-pad-b"/>
      <circle cx="163" cy="47" r="3" fill="#ff8888" className="mc-blink-pad-b"/>

      {/* ── Bagliore a terra durante il lancio ── */}
      {showOpenArms && (
        <ellipse cx="100" cy="175" rx="50" ry="12" fill="#ff6600" opacity="0.35"/>
      )}
    </g>
  )
}
