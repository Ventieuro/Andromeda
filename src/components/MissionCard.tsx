import { useState, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────

interface MissionCardProps {
  id: string
  name: string
  icon: string
  current: number
  target: number
  monthlyRate?: number
  onAddSaving?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

type PieceKey = 'engine' | 'body' | 'wings' | 'nose' | 'cockpit'

interface PieceColors {
  engine: string
  body: string
  wings: string
  nose: string
  cockpit: string
}

// ─── Constants ───────────────────────────────────────────

const THRESHOLDS: Record<PieceKey, number> = {
  engine: 0,
  body: 15,
  wings: 35,
  nose: 55,
  cockpit: 75,
}

const PIECE_NAMES_IT: Record<PieceKey, string> = {
  engine: 'motore',
  body: 'corpo',
  wings: 'ali',
  nose: 'punta',
  cockpit: 'finestrino',
}

const PIECE_ORDER: PieceKey[] = ['engine', 'body', 'wings', 'nose', 'cockpit']

const COLORS = [
  '#E8C84A', '#ff6060', '#60d4ff', '#80ff80',
  '#ff80c0', '#c0a0ff', '#ff9940', '#ffffff',
]

const DEFAULT_COLORS: PieceColors = {
  engine: '#ff9940',
  body: '#c0a0ff',
  wings: '#60d4ff',
  nose: '#E8C84A',
  cockpit: '#80ff80',
}

// ─── Helpers ─────────────────────────────────────────────

function loadConfirmedPieces(id: string): Set<PieceKey> {
  try {
    const raw = localStorage.getItem(`astrocoin-mc-confirmed-${id}`)
    return raw ? new Set(JSON.parse(raw) as PieceKey[]) : new Set()
  } catch { return new Set() }
}

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function getNextUnlock(pct: number): string {
  if (pct === 0) return ''
  if (pct < 15) return '🔧 Prossimo: corpo navicella al 15%'
  if (pct < 35) return 'Prossimo: ali al 35%'
  if (pct < 55) return 'Prossimo: punta al 55%'
  if (pct < 75) return 'Prossimo: finestrino al 75%'
  if (pct < 100) return '🚀 Al 100% potrai lanciare la navicella!'
  return ''
}

// ─── CSS Animations ──────────────────────────────────────

const STYLES = `
@keyframes flicker {
  0%,100% { transform: scaleY(1); opacity: 0.9; }
  50%      { transform: scaleY(1.4); opacity: 0.5; }
}
@keyframes flickerB {
  0%,100% { transform: scaleY(1.1); opacity: 0.7; }
  50%      { transform: scaleY(0.8); opacity: 0.4; }
}
@keyframes flickerBig {
  0%,100% { transform: scaleY(1.6) scaleX(1); opacity: 1; }
  33%      { transform: scaleY(2.2) scaleX(1.15); opacity: 0.8; }
  66%      { transform: scaleY(1.9) scaleX(0.9); opacity: 0.9; }
}
@keyframes unlockPop {
  0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes flashRing {
  0%   { r: 4; opacity: 0.9; }
  100% { r: 60; opacity: 0; }
}
@keyframes blink {
  0%,100% { opacity: 0.9; }
  50%      { opacity: 0.15; }
}
@keyframes blinkG {
  0%,100% { opacity: 0.9; }
  50%      { opacity: 0.15; }
}
@keyframes blinkPad {
  0%,100% { opacity: 0.95; }
  50%      { opacity: 0.05; }
}
@keyframes padArmsOpen {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-28px); }
}
@keyframes padArmsOpenR {
  0%   { transform: translateX(0); }
  100% { transform: translateX(28px); }
}
@keyframes launchShip {
  0%    { transform: rotate(0deg); }
  25%   { transform: rotate(0deg); }
  80%   { transform: rotate(90deg); }
  100%  { transform: rotate(90deg); }
}
@keyframes padSlideDown {
  0%    { transform: translateY(0); opacity: 1; }
  100%  { transform: translateY(300px); opacity: 0; }
}
@keyframes starScrollDown {
  0%    { transform: translateY(0); }
  100%  { transform: translateY(210px); }
}
@keyframes spaceFloat {
  0%,100% { transform: translateX(0); }
  50%      { transform: translateX(-5px); }
}
@keyframes countdownPulse {
  0%,100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.18); opacity: 0.7; }
}
@keyframes btnGlow {
  0%,100% { box-shadow: 0 0 12px #ff4400aa; }
  50%      { box-shadow: 0 0 28px #ff6600ff, 0 0 8px #ff440088; }
}
.mc-flame-a      { animation: flicker 0.5s ease-in-out infinite; transform-origin: center top; }
.mc-flame-b      { animation: flickerB 0.7s ease-in-out infinite; transform-origin: center top; }
.mc-flame-big    { animation: flickerBig 0.22s ease-in-out infinite; transform-origin: center top; }
.mc-blink-r      { animation: blink 1.1s ease-in-out infinite; }
.mc-blink-g      { animation: blinkG 1.4s ease-in-out infinite 0.3s; }
.mc-unlock       { animation: unlockPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
.mc-flash        { animation: flashRing 0.6s ease-out forwards; }
.mc-blink-pad    { animation: blinkPad 1s ease-in-out infinite; }
.mc-blink-pad-b  { animation: blinkPad 1s ease-in-out infinite 0.5s; }
.mc-pad-arm-l    { animation: padArmsOpen 0.8s ease-out 0.4s forwards; transform-origin: right center; }
.mc-pad-arm-r    { animation: padArmsOpenR 0.8s ease-out 0.4s forwards; transform-origin: left center; }
.mc-ship-float   { animation: spaceFloat 3.5s ease-in-out infinite; }
.mc-pad-down     { animation: padSlideDown 2.5s ease-in forwards; }
.mc-star-down    { animation: starScrollDown 1.8s linear infinite; }
.mc-star-down2   { animation: starScrollDown 2.6s linear infinite 0.4s; }
.mc-star-down3   { animation: starScrollDown 4s linear infinite 1.0s; }
.mc-countdown    { animation: countdownPulse 0.9s ease-in-out infinite; }
.mc-btn-glow     { animation: btnGlow 1.2s ease-in-out infinite; }
@keyframes flameAppear {
  0%   { transform: scaleY(0.05) scaleX(0.3); opacity: 0; }
  35%  { opacity: 0.75; }
  100% { transform: scaleY(1) scaleX(1); opacity: 1; }
}
@keyframes groundFireBurst {
  0%   { transform: scale(0.05); opacity: 0; }
  20%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.55; }
}
@keyframes smokeRiseL {
  0%   { transform: translate(0,0) scale(0.2); opacity: 0; }
  18%  { opacity: 0.65; }
  100% { transform: translate(-38px,-28px) scale(2.2); opacity: 0; }
}
@keyframes smokeRiseR {
  0%   { transform: translate(0,0) scale(0.2); opacity: 0; }
  18%  { opacity: 0.65; }
  100% { transform: translate(38px,-28px) scale(2.2); opacity: 0; }
}
@keyframes smokeRiseC {
  0%   { transform: scale(0.15); opacity: 0; }
  25%  { opacity: 0.55; }
  100% { transform: scale(2.8); opacity: 0; }
}
@keyframes textFadeIn {
  0%   { opacity: 0; transform: scale(0.75); }
  60%  { transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}
.mc-flame-appear { animation: flameAppear 0.85s ease-out forwards; transform-origin: 100px 175px; }
.mc-ground-fire  { animation: groundFireBurst 0.65s ease-out forwards; transform-origin: 100px 175px; }
.mc-smoke-l      { animation: smokeRiseL 1.3s ease-out infinite; transform-origin: 72px 175px; }
.mc-smoke-r      { animation: smokeRiseR 1.3s ease-out infinite 0.18s; transform-origin: 128px 175px; }
.mc-smoke-c      { animation: smokeRiseC 1.1s ease-out infinite 0.45s; transform-origin: 100px 176px; }
.mc-smoke-l2     { animation: smokeRiseL 1.3s ease-out infinite 0.65s; transform-origin: 60px 175px; }
.mc-smoke-r2     { animation: smokeRiseR 1.3s ease-out infinite 0.8s; transform-origin: 140px 175px; }
.mc-text-ignite  { animation: textFadeIn 0.45s ease-out forwards; transform-origin: 100px 22px; }
.mc-text-liftoff { animation: textFadeIn 0.4s ease-out forwards; transform-origin: 100px 22px; }
`

// ─── Launch Pad ───────────────────────────────────────────
// showOpenArms: true durante la sequenza di lancio (le braccia si aprono)

interface LaunchPadProps { showOpenArms?: boolean }

function LaunchPad({ showOpenArms = false }: LaunchPadProps) {
  return (
    <g>
      {/* support legs */}
      <path d="M38 165 L22 192" stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M60 165 L46 192" stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M162 165 L178 192" stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M140 165 L154 192" stroke="#1e2a45" strokeWidth="5" strokeLinecap="round" fill="none"/>

      {/* base platform */}
      <rect x="28" y="163" width="144" height="14" rx="5" fill="#1e2a45"/>
      <rect x="28" y="163" width="144" height="5" rx="5" fill="#2a3a6a" opacity="0.45"/>
      <circle cx="35" cy="167" r="2.5" fill="#2a3a6a"/>
      <circle cx="165" cy="167" r="2.5" fill="#2a3a6a"/>
      <circle cx="35" cy="174" r="2.5" fill="#2a3a6a"/>
      <circle cx="165" cy="174" r="2.5" fill="#2a3a6a"/>

      {/* left column */}
      <rect x="32" y="52" width="11" height="113" rx="3" fill="#1e2a45"/>
      <line x1="37" y1="52" x2="37" y2="163" stroke="#2a3a5a" strokeWidth="0.8" strokeDasharray="3 5"/>
      <rect x="31" y="60" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="31" y="74" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="31" y="88" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="31" y="102" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="31" y="116" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="31" y="130" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="31" y="144" width="13" height="5" rx="1.5" fill="#2a3a6a"/>

      {/* right column */}
      <rect x="157" y="52" width="11" height="113" rx="3" fill="#1e2a45"/>
      <line x1="163" y1="52" x2="163" y2="163" stroke="#2a3a5a" strokeWidth="0.8" strokeDasharray="3 5"/>
      <rect x="156" y="60" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="156" y="74" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="156" y="88" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="156" y="102" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="156" y="116" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="156" y="130" width="13" height="5" rx="1.5" fill="#2a3a6a"/>
      <rect x="156" y="144" width="13" height="5" rx="1.5" fill="#2a3a6a"/>

      {/* horizontal rungs */}
      <line x1="43" y1="68" x2="157" y2="68" stroke="#2a3a6a" strokeWidth="1.5"/>
      <line x1="43" y1="82" x2="157" y2="82" stroke="#2a3a6a" strokeWidth="1.5"/>
      <line x1="43" y1="96" x2="157" y2="96" stroke="#2a3a6a" strokeWidth="1.5"/>
      <line x1="43" y1="110" x2="157" y2="110" stroke="#2a3a6a" strokeWidth="1.5"/>
      <line x1="43" y1="124" x2="157" y2="124" stroke="#2a3a6a" strokeWidth="1.5"/>
      <line x1="43" y1="138" x2="157" y2="138" stroke="#2a3a6a" strokeWidth="1.5"/>
      <line x1="43" y1="152" x2="157" y2="152" stroke="#2a3a6a" strokeWidth="1.5"/>

      {/* arm braces — open during launch */}
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

      {/* blinking red lights atop columns */}
      <circle cx="37" cy="47" r="5" fill="#ff2222" className="mc-blink-pad"/>
      <circle cx="37" cy="47" r="3" fill="#ff8888" className="mc-blink-pad"/>
      <circle cx="163" cy="47" r="5" fill="#ff2222" className="mc-blink-pad-b"/>
      <circle cx="163" cy="47" r="3" fill="#ff8888" className="mc-blink-pad-b"/>

      {/* ground glow during launch */}
      {showOpenArms && (
        <ellipse cx="100" cy="175" rx="50" ry="12" fill="#ff6600" opacity="0.35"/>
      )}
    </g>
  )
}

// ─── Spaceship SVG (sub-component) ───────────────────────

interface ShipProps {
  colors: PieceColors
  pct: number
  newlyUnlocked: PieceKey | null
  previewColor: string | null
  previewPiece: PieceKey | null
  showFlames?: boolean
  bigFlames?: boolean
  igniting?: boolean
}

function Spaceship({ colors, pct, newlyUnlocked, previewColor, previewPiece, showFlames = false, bigFlames = false, igniting = false }: ShipProps) {
  const isUnlocked = (piece: PieceKey) => pct >= THRESHOLDS[piece]

  function getColor(piece: PieceKey): string {
    if (previewPiece === piece && previewColor) return previewColor
    return colors[piece]
  }

  function ghostPiece(piece: PieceKey, children: React.ReactNode) {
    if (isUnlocked(piece)) return null
    return (
      <g opacity="0.15" style={{ pointerEvents: 'none' }}>
        <g fill="none" stroke="#8899cc" strokeWidth="1.5" strokeDasharray="4 4">
          {children}
        </g>
        <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#8899cc" fontSize="18" opacity="0.5">?</text>
      </g>
    )
  }

  const engineColor = getColor('engine')
  const bodyColor = getColor('body')
  const wingsColor = getColor('wings')
  const noseColor = getColor('nose')
  const cockpitColor = getColor('cockpit')

  const flameAClass = bigFlames ? 'mc-flame-big' : 'mc-flame-a'
  const flameBClass = bigFlames ? 'mc-flame-big' : 'mc-flame-b'

  return (
    <>
      {newlyUnlocked && (
        <circle cx="100" cy="110" r="4" fill="none" stroke="#fff" strokeWidth="2" className="mc-flash" />
      )}

      {/* ─── ENGINE ─── */}
      <g id="engine">
        <ellipse cx="100" cy="175" rx="22" ry="10" fill={engineColor} opacity="0.9" />
        <path d="M78 165 Q100 178 122 165 L116 155 Q100 162 84 155 Z" fill={engineColor} />
        <rect x="78" y="155" width="8" height="14" rx="4" fill={engineColor} opacity="0.8" />
        <rect x="114" y="155" width="8" height="14" rx="4" fill={engineColor} opacity="0.8" />
        {showFlames && (
          <g className={igniting ? 'mc-flame-appear' : ''}>
            <ellipse cx="90" cy="185" rx={bigFlames ? 10 : 6} ry={bigFlames ? 20 : 10} fill="#ff8800" className={flameAClass} style={{ transformOrigin: '90px 175px' }}/>
            <ellipse cx="110" cy="185" rx={bigFlames ? 9 : 5} ry={bigFlames ? 17 : 8} fill="#ffcc00" className={flameBClass} style={{ transformOrigin: '110px 175px' }}/>
            <ellipse cx="100" cy="183" rx={bigFlames ? 7 : 4} ry={bigFlames ? 15 : 7} fill="#fff5aa" className={flameAClass} style={{ transformOrigin: '100px 175px' }}/>
            <ellipse cx="100" cy="182" rx={bigFlames ? 26 : 14} ry={bigFlames ? 12 : 6} fill="#ff6600" opacity="0.25"/>
          </g>
        )}
      </g>

      {/* ─── BODY ─── */}
      {isUnlocked('body') ? (
        <g id="body" className={newlyUnlocked === 'body' ? 'mc-unlock' : ''}>
          <rect x="70" y="115" width="60" height="50" rx="16" fill={bodyColor} />
          <line x1="72" y1="132" x2="128" y2="132" stroke="#ffffff22" strokeWidth="1" />
          <line x1="72" y1="148" x2="128" y2="148" stroke="#ffffff22" strokeWidth="1" />
          <line x1="88" y1="115" x2="88" y2="165" stroke="#ffffff15" strokeWidth="1" />
          <line x1="112" y1="115" x2="112" y2="165" stroke="#ffffff15" strokeWidth="1" />
          <circle cx="76" cy="138" r="4" fill="#ff4444" className="mc-blink-r" />
          <circle cx="124" cy="138" r="4" fill="#44ff88" className="mc-blink-g" />
          <rect x="78" y="120" width="20" height="8" rx="4" fill="#ffffff12" />
        </g>
      ) : ghostPiece('body', <rect x="70" y="115" width="60" height="50" rx="16" />)}

      {/* ─── WINGS ─── */}
      {isUnlocked('wings') ? (
        <g id="wings" className={newlyUnlocked === 'wings' ? 'mc-unlock' : ''}>
          <path d="M70 140 L30 170 L45 155 L70 158 Z" fill={wingsColor} />
          <line x1="70" y1="140" x2="36" y2="165" stroke="#ffffff20" strokeWidth="1" />
          <path d="M130 140 L170 170 L155 155 L130 158 Z" fill={wingsColor} />
          <line x1="130" y1="140" x2="164" y2="165" stroke="#ffffff20" strokeWidth="1" />
        </g>
      ) : ghostPiece('wings', (
        <>
          <path d="M70 140 L30 170 L45 155 L70 158 Z" />
          <path d="M130 140 L170 170 L155 155 L130 158 Z" />
        </>
      ))}

      {/* ─── NOSE ─── */}
      {isUnlocked('nose') ? (
        <g id="nose" className={newlyUnlocked === 'nose' ? 'mc-unlock' : ''}>
          <path d="M100 38 Q82 68 78 95 Q100 88 122 95 Q118 68 100 38 Z" fill={noseColor} />
          <path d="M100 50 Q92 72 90 90" stroke="#ffffff25" strokeWidth="2" fill="none" />
        </g>
      ) : ghostPiece('nose', <path d="M100 38 Q82 68 78 95 Q100 88 122 95 Q118 68 100 38 Z" />)}

      {/* ─── BODY-NOSE JOIN ─── */}
      {isUnlocked('body') ? (
        <rect x="70" y="88" width="60" height="30" rx="14" fill={bodyColor} />
      ) : (
        <rect x="70" y="88" width="60" height="30" rx="14" fill="#8899cc" opacity="0.08" strokeDasharray="4 4" stroke="#8899cc" strokeWidth="1" />
      )}

      {/* ─── COCKPIT — always on top ─── */}
      {isUnlocked('cockpit') ? (
        <g id="cockpit" className={newlyUnlocked === 'cockpit' ? 'mc-unlock' : ''}>
          <circle cx="100" cy="112" r="21" fill={cockpitColor} stroke={cockpitColor} strokeWidth="1.5"/>
          <circle cx="100" cy="112" r="16" fill="#0f1530" />
          <circle cx="100" cy="112" r="16" fill={cockpitColor} opacity="0.18" />
          <ellipse cx="93" cy="105" rx="6" ry="5" fill="#ffffff" opacity="0.45" transform="rotate(-20 93 105)" />
          <ellipse cx="108" cy="116" rx="2.5" ry="2" fill="#ffffff" opacity="0.25" />
        </g>
      ) : ghostPiece('cockpit', <circle cx="100" cy="112" r="21" />)}
    </>
  )
}

// ─── Starfield data (two rows: base y + y-210 for seamless down-scroll) ─────────
// When star container rotates 90°, down-scroll appears as left-scroll on screen
type StarDot = [number, number, number, number] // [cx, cy, r, opacity]
const STARS_LAYER_A: StarDot[] = [
  [-5,28,1.5,.85],[42,78,.8,.6],[88,148,1.2,.75],[122,22,.7,.5],
  [168,92,1.0,.7],[202,168,.8,.55],[58,192,1.3,.8],[158,52,.6,.5],
  [100,108,.9,.65],[18,162,1.1,.8],[210,38,1.4,.6],[72,35,.7,.5],
  [-5,-182,1.5,.85],[42,-132,.8,.6],[88,-62,1.2,.75],[122,-188,.7,.5],
  [168,-118,1.0,.7],[202,-42,.8,.55],[58,-18,1.3,.8],[158,-158,.6,.5],
  [100,-102,.9,.65],[18,-48,1.1,.8],[210,-172,1.4,.6],[72,-175,.7,.5],
]
const STARS_LAYER_B: StarDot[] = [
  [22,52,.9,.5],[68,128,1.3,.65],[112,12,.7,.4],[152,82,1.0,.6],
  [195,158,.8,.5],[8,172,.6,.4],[92,98,.9,.55],[142,138,.7,.45],[188,32,1.1,.65],
  [-12,48,.8,.4],[35,198,.6,.5],[178,118,.9,.55],
  [22,-158,.9,.5],[68,-82,1.3,.65],[112,-198,.7,.4],[152,-128,1.0,.6],
  [195,-52,.8,.5],[8,-38,.6,.4],[92,-112,.9,.55],[142,-72,.7,.45],[188,-178,1.1,.65],
  [-12,-162,.8,.4],[35,-12,.6,.5],[178,-92,.9,.55],
]
const STARS_LAYER_C: StarDot[] = [
  [32,68,.6,.4],[78,158,1.0,.45],[118,45,.5,.3],[162,122,.7,.4],
  [5,108,.8,.45],[52,202,.6,.35],[108,78,.5,.3],[155,188,.8,.45],[198,62,.6,.35],
  [215,138,.5,.3],[28,135,.7,.4],[135,175,.5,.3],
  [32,-142,.6,.4],[78,-52,1.0,.45],[118,-165,.5,.3],[162,-88,.7,.4],
  [5,-102,.8,.45],[52,-8,.6,.35],[108,-132,.5,.3],[155,-22,.8,.45],[198,-148,.6,.35],
  [215,-72,.5,.3],[28,-75,.7,.4],[135,-35,.5,.3],
]

// ─── MissionCard ─────────────────────────────────────────

// Launch phases:
// 'idle'      → building (0-99%)
// 'ready'     → 100% reached, show LAUNCH button + countdown UI
// 'countdown' → user pressed LAUNCH, counting 10→0
// 'ignition'  → flames ignite, arms open, pad exits, ship rotates 90° (4s)
// 'travel'    → permanent space loop

export default function MissionCard({
  id,
  name,
  icon,
  current,
  target,
  monthlyRate,
  onAddSaving,
  onEdit,
  onDelete,
}: MissionCardProps) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0

  const [colors, setColors] = useState<PieceColors>(() => {
    try {
      const raw = localStorage.getItem(`astrocoin-mc-colors-${id}`)
      return raw ? (JSON.parse(raw) as PieceColors) : { ...DEFAULT_COLORS }
    } catch { return { ...DEFAULT_COLORS } }
  })
  const [confirmedPieces, setConfirmedPieces] = useState<Set<PieceKey>>(() => loadConfirmedPieces(id))
  const [pendingQueue, setPendingQueue] = useState<PieceKey[]>(() => {
    const confirmed = loadConfirmedPieces(id)
    return PIECE_ORDER.filter(piece => {
      const t = THRESHOLDS[piece]
      if (t === 0) return false
      return pct >= t && !confirmed.has(piece)
    })
  })
  const pendingPiece = pendingQueue[0] ?? null
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0])
  const [newlyUnlocked, setNewlyUnlocked] = useState<PieceKey | null>(null)
  const [launchPhase, setLaunchPhase] = useState<'idle' | 'ready' | 'countdown' | 'ignition' | 'travel'>(() => {
    try {
      if (localStorage.getItem(`astrocoin-mc-launched-${id}`) === 'true' && pct >= 100) return 'travel'
    } catch { return 'idle' }
    return pct >= 100 ? 'ready' : 'idle'
  })
  const [countdown, setCountdown] = useState(10)
  const [liftOff, setLiftOff] = useState(false)

  const prevPct = useRef<number>(pct)
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cdInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const ignTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const liftOffTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect newly unlocked pieces + 100% reached
  useEffect(() => {
    const prev = prevPct.current
    const toAdd: PieceKey[] = []
    for (const piece of PIECE_ORDER) {
      const t = THRESHOLDS[piece]
      if (t === 0) continue
      if (prev < t && pct >= t && !confirmedPieces.has(piece)) {
        toAdd.push(piece)
      }
    }
    if (toAdd.length > 0) {
      setPendingQueue(q => {
        const filtered = toAdd.filter(p => !q.includes(p))
        if (filtered.length === 0) return q
        if (q.length === 0) setSelectedColor(COLORS[0])
        return [...q, ...filtered]
      })
      setNewlyUnlocked(toAdd[0])
      if (flashTimeout.current) clearTimeout(flashTimeout.current)
      flashTimeout.current = setTimeout(() => setNewlyUnlocked(null), 700)
    }
    if (prev < 100 && pct >= 100 && launchPhase === 'idle') {
      setLaunchPhase('ready')
    }
    prevPct.current = pct
  }, [pct]) // eslint-disable-line react-hooks/exhaustive-deps

  // Start countdown when user presses LANCIO
  function startCountdown() {
    setLaunchPhase('countdown')
    setCountdown(10)
    let n = 10
    if (cdInterval.current) clearInterval(cdInterval.current)
    cdInterval.current = setInterval(() => {
      n -= 1
      setCountdown(n)
      if (n <= 0) {
        clearInterval(cdInterval.current!)
        cdInterval.current = null
        setLaunchPhase('ignition')
        setLiftOff(false)
        if (liftOffTimeout.current) clearTimeout(liftOffTimeout.current)
        liftOffTimeout.current = setTimeout(() => setLiftOff(true), 1000)
        if (ignTimeout.current) clearTimeout(ignTimeout.current)
        ignTimeout.current = setTimeout(() => {
          setLaunchPhase('travel')
          setLiftOff(false)
          try { localStorage.setItem(`astrocoin-mc-launched-${id}`, 'true') } catch { /* ignore */ }
        }, 7300)
      }
    }, 1000)
  }

  function confirmColor() {
    if (!pendingPiece) return
    const newColors = { ...colors, [pendingPiece]: selectedColor }
    setColors(newColors)
    try { localStorage.setItem(`astrocoin-mc-colors-${id}`, JSON.stringify(newColors)) } catch { setColors(newColors) }
    const newConfirmed = new Set([...confirmedPieces, pendingPiece])
    setConfirmedPieces(newConfirmed)
    try { localStorage.setItem(`astrocoin-mc-confirmed-${id}`, JSON.stringify([...newConfirmed])) } catch { /* ignore */ }
    const nextQueue = pendingQueue.slice(1)
    setPendingQueue(nextQueue)
    setSelectedColor(nextQueue[0] ? colors[nextQueue[0]] : COLORS[0])
  }

  // Inject CSS
  const styleEl = useRef<HTMLStyleElement | null>(null)
  useEffect(() => {
    if (!styleEl.current) {
      const el = document.createElement('style')
      el.textContent = STYLES
      document.head.appendChild(el)
      styleEl.current = el
    }
    return () => {
      if (styleEl.current) { styleEl.current.remove(); styleEl.current = null }
      if (flashTimeout.current) clearTimeout(flashTimeout.current)
      if (cdInterval.current) clearInterval(cdInterval.current)
      if (ignTimeout.current) clearTimeout(ignTimeout.current)
      if (liftOffTimeout.current) clearTimeout(liftOffTimeout.current)
    }
  }, [])

  const nextUnlock = getNextUnlock(pct)
  const inLaunchSequence = launchPhase === 'ignition'
  const inTravel = launchPhase === 'travel'

  // ── Render ──

  return (
    <div style={{
      background: '#131728',
      borderRadius: '16px',
      border: '0.5px solid #1e2540',
      padding: '16px',
      marginBottom: '14px',
      fontFamily: 'sans-serif',
      color: '#e0e6ff',
    }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px', marginRight: '8px' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '16px', flex: 1, color: '#e0e6ff' }}>{name}</span>
        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px', color: '#6070a0' }} aria-label="Modifica">✏️</button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px', color: '#6070a0' }} aria-label="Elimina">🗑️</button>
      </div>

      {/* ─── Main visual area — unified SVG (no flash, stars always visible) ─── */}
      <div style={{ width: '200px', height: '210px', margin: '0 auto 12px', overflow: 'hidden', borderRadius: '8px' }}>
        <svg viewBox="0 0 200 210" width="200" height="210" style={{ display: 'block' }}>

          {/* Space background — always */}
          <rect x="0" y="0" width="200" height="210" fill="#060a1a"/>

          {/* Stars: static build | rotate+scroll ignition | static 90°+scroll travel.
               Rotation is pure inline CSS transition — no class swap, no flicker. */}
          <g style={(inTravel
              ? { transform: 'rotate(90deg)', transformOrigin: '100px 105px' }
              : inLaunchSequence
              ? { transform: 'rotate(90deg)', transformOrigin: '100px 105px', transition: 'transform 3s 3s cubic-bezier(0.3,0,0.1,1)' }
              : { transform: 'rotate(0deg)', transformOrigin: '100px 105px' }
          )}>
            <g className={(inLaunchSequence || inTravel) ? 'mc-star-down' : ''}>
              {STARS_LAYER_A.map(([cx, cy, r, op], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity={op}/>)}
            </g>
            <g className={(inLaunchSequence || inTravel) ? 'mc-star-down2' : ''}>
              {STARS_LAYER_B.map(([cx, cy, r, op], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#aaccff" opacity={op}/>)}
            </g>
            <g className={(inLaunchSequence || inTravel) ? 'mc-star-down3' : ''}>
              {STARS_LAYER_C.map(([cx, cy, r, op], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity={op}/>)}
            </g>
          </g>

          {/* Pad + ground + fire + smoke — everything slides down on liftOff */}
          {!inTravel && (
            <g className={(inLaunchSequence && liftOff) ? 'mc-pad-down' : ''}>
              <LaunchPad showOpenArms={inLaunchSequence} />
              <rect x="0" y="177" width="200" height="33" fill="#0d1120"/>
              <line x1="0" y1="177" x2="200" y2="177" stroke="#1e2540" strokeWidth="1.5"/>
              {/* Ground fire + smoke — inside pad group so they slide down with the terrain */}
              {inLaunchSequence && (
                <g>
                  <ellipse cx="100" cy="176" rx="44" ry="7" fill="#ff5500" className="mc-ground-fire"/>
                  <ellipse cx="100" cy="175" rx="26" ry="4" fill="#ffaa00" className="mc-ground-fire"/>
                  <ellipse cx="72" cy="175" rx="13" ry="9" fill="#9aa4bb" className="mc-smoke-l"/>
                  <ellipse cx="128" cy="175" rx="13" ry="9" fill="#9aa4bb" className="mc-smoke-r"/>
                  <ellipse cx="100" cy="177" rx="11" ry="7" fill="#b0b8d0" className="mc-smoke-c"/>
                  <ellipse cx="58" cy="175" rx="9" ry="6" fill="#8899aa" className="mc-smoke-l2"/>
                  <ellipse cx="142" cy="175" rx="9" ry="6" fill="#8899aa" className="mc-smoke-r2"/>
                </g>
              )}
            </g>
          )}

          {/* Ghost silhouette when 0% and building */}
          {pct === 0 && (
            <g fill="none" stroke="#534AB7" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.18">
              <ellipse cx="100" cy="158" rx="22" ry="10"/>
              <rect x="78" y="116" width="44" height="44" rx="12"/>
              <rect x="78" y="90" width="44" height="28" rx="12"/>
              <path d="M78 136 L46 160 L60 148 L78 144 Z"/>
              <path d="M122 136 L154 160 L140 148 L122 144 Z"/>
              <path d="M100 32 Q88 56 85 88 Q100 83 115 88 Q112 56 100 32 Z"/>
              <circle cx="100" cy="108" r="18"/>
            </g>
          )}
          {pct === 0 && (
            <text x="100" y="114" textAnchor="middle" dominantBaseline="middle" fill="#534AB7" opacity="0.28" fontSize="22" fontFamily="sans-serif" fontWeight="700">?</text>
          )}

          {/* Spaceship: rotation via inline CSS transition only — ignition ends at 90°,
               travel keeps same 90° via inline style, no class swap, no wobble, no re-animation on refresh */}
          <g style={(inTravel
              ? { transform: 'rotate(90deg)', transformOrigin: '100px 105px' }
              : inLaunchSequence
              ? { transform: 'rotate(90deg)', transformOrigin: '100px 105px', transition: 'transform 3s 3s cubic-bezier(0.3,0,0.1,1)' }
              : { transform: 'rotate(0deg)', transformOrigin: '100px 105px' }
          )}>
            <g className={inTravel ? 'mc-ship-float' : ''}>
              <Spaceship
                colors={colors}
                pct={pct}
                newlyUnlocked={newlyUnlocked}
                previewColor={pendingPiece ? selectedColor : null}
                previewPiece={pendingPiece}
                showFlames={inLaunchSequence || inTravel}
                bigFlames={inLaunchSequence && liftOff}
                igniting={inLaunchSequence && !liftOff}
              />
            </g>
          </g>

          {/* Travel label */}
          {inTravel && (
            <text x="100" y="202" textAnchor="middle" fill="#534AB7" fontSize="7" fontFamily="monospace" letterSpacing="2" opacity="0.9">IN VIAGGIO NELLO SPAZIO</text>
          )}

          {/* IGNITION → LIFT OFF overlay */}
          {inLaunchSequence && !liftOff && (
            <text key="ign" x="100" y="22" textAnchor="middle" fill="#ff7722" fontSize="9" fontFamily="monospace" letterSpacing="4" fontWeight="700" opacity="0.95" className="mc-text-ignite">IGNITION</text>
          )}
          {inLaunchSequence && liftOff && (
            <text key="lft" x="100" y="22" textAnchor="middle" fill="#f5d060" fontSize="9" fontFamily="monospace" letterSpacing="4" fontWeight="700" opacity="0.95" className="mc-text-liftoff">LIFT OFF</text>
          )}

        </svg>
      </div>

      {/* ─── Progress bar ─── */}
      {!inTravel && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#8899cc' }}>
              {formatEuro(current)} di {formatEuro(target)}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: pct >= 100 ? '#22c55e' : '#7c9eff' }}>
              {pct}%
            </span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: '#1e2540', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px', width: `${pct}%`,
              background: pct >= 100
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #3b6fff, #7c9eff)',
              transition: 'width 0.5s ease',
            }}/>
          </div>
        </div>
      )}

      {inTravel && (
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>
            🚀 Missione completata — {formatEuro(current)}
          </span>
        </div>
      )}

      {/* ─── LAUNCH BUTTON (ready state) ─── */}
      {launchPhase === 'ready' && (
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', color: '#f5d060', marginBottom: '8px', fontWeight: 600 }}>
            🎉 Navicella pronta al lancio!
          </div>
          <button
            onClick={startCountdown}
            className="mc-btn-glow"
            style={{
              background: 'linear-gradient(135deg, #ff4400, #ff8800)',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontWeight: 700, fontSize: '15px',
              padding: '10px 32px', cursor: 'pointer',
              letterSpacing: '1px',
            }}
          >
            🚀 LANCIA
          </button>
        </div>
      )}

      {/* ─── COUNTDOWN ─── */}
      {launchPhase === 'countdown' && (
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', color: '#8899cc', marginBottom: '4px' }}>Lancio tra</div>
          <div
            className="mc-countdown"
            style={{ fontSize: '52px', fontWeight: 900, color: countdown <= 3 ? '#ff4400' : '#7c9eff', lineHeight: 1, fontFamily: 'monospace' }}
          >
            {countdown}
          </div>
        </div>
      )}

      {/* ─── IGNITION / LIFT OFF status ─── */}
      {launchPhase === 'ignition' && !liftOff && (
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', color: '#ff6600', fontWeight: 700, letterSpacing: '3px', fontFamily: 'monospace' }}>
            🔥 IGNITION
          </div>
        </div>
      )}
      {launchPhase === 'ignition' && liftOff && (
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', color: '#f5d060', fontWeight: 700, letterSpacing: '3px', fontFamily: 'monospace' }}>
            🚀 LIFT OFF
          </div>
        </div>
      )}

      {/* ─── Color Picker (unlock box) ─── */}
      {pendingPiece && (launchPhase === 'idle' || launchPhase === 'ready') && (
        <div style={{
          background: '#1a1f38', border: '1px solid #2a3060',
          borderRadius: '12px', padding: '14px', marginBottom: '12px',
        }}>
          {!confirmedPieces.has(pendingPiece)
            ? <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5d060', marginBottom: '4px' }}>★ Nuovo pezzo sbloccato!</div>
            : <div style={{ fontSize: '13px', fontWeight: 700, color: '#8899cc', marginBottom: '4px' }}>✎ Modifica colore</div>
          }
          <div style={{ fontSize: '12px', color: '#8899cc', marginBottom: '10px' }}>
            Scegli il colore {pendingPiece === 'wings' || pendingPiece === 'nose' ? 'delle' : 'del'} {PIECE_NAMES_IT[pendingPiece]}:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {COLORS.map((c) => (
              <div key={c} onClick={() => setSelectedColor(c)} style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: c, cursor: 'pointer',
                border: selectedColor === c ? '3px solid #ffffff' : '2px solid #2a3060',
                boxShadow: selectedColor === c ? `0 0 8px ${c}` : 'none',
                transition: 'all 0.15s',
              }}/>
            ))}
          </div>
          <button onClick={confirmColor} style={{
            background: 'linear-gradient(135deg, #3b6fff, #7c9eff)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontWeight: 600, fontSize: '13px',
            padding: '8px 18px', cursor: 'pointer', width: '100%',
          }}>
            ✓ Applica colore
          </button>
        </div>
      )}

      {/* ─── Next unlock hint ─── */}
      {nextUnlock && launchPhase === 'idle' && (
        <div style={{ fontSize: '12px', color: '#6070a0', marginBottom: '12px' }}>
          {nextUnlock}
        </div>
      )}

      {/* ─── Bottom actions ─── */}
      {!inTravel && launchPhase === 'idle' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {monthlyRate !== undefined && monthlyRate > 0 && (
            <span style={{
              fontSize: '12px', color: '#7c9eff',
              background: '#1a2040', border: '1px solid #2a3060',
              borderRadius: '20px', padding: '4px 10px',
            }}>
              {formatEuro(monthlyRate)}/mese
            </span>
          )}
          {onAddSaving && pct < 100 && (
            <button onClick={onAddSaving} style={{
              marginLeft: monthlyRate ? 'auto' : 0,
              background: 'linear-gradient(135deg, #3b6fff22, #7c9eff22)',
              border: '1px solid #3b6fff', borderRadius: '20px',
              color: '#7c9eff', fontSize: '12px', fontWeight: 600,
              padding: '5px 14px', cursor: 'pointer',
            }}>
              + Risparmio
            </button>
          )}
        </div>
      )}

      {/* ─── Color history ─── */}
      {!inTravel && (
        <div style={{
          marginTop: '14px', paddingTop: '12px',
          borderTop: '1px solid #1e2540',
          display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          {PIECE_ORDER.map((piece) => {
            const unlocked = pct >= THRESHOLDS[piece]
            const isActive = pendingPiece === piece
            return (
              <div key={piece} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {unlocked ? (
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: colors[piece],
                    boxShadow: isActive ? `0 0 0 2px #fff, 0 0 8px ${colors[piece]}` : `0 0 5px ${colors[piece]}`,
                    flexShrink: 0,
                  }}/>
                ) : (
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px dashed #3a4460', flexShrink: 0 }}/>
                )}
                <span style={{ fontSize: '11px', color: unlocked ? (isActive ? '#e0e6ff' : '#8899cc') : '#3a4460' }}>
                  {unlocked ? PIECE_NAMES_IT[piece] : '?'}
                </span>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
