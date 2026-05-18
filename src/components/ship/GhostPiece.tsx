// Wrapper tratteggiato per i pezzi non ancora sbloccati
const GHOST: React.CSSProperties = { pointerEvents: 'none' }
const GHOST_STROKE = { fill: 'none' as const, stroke: '#8899cc', strokeWidth: 1.5, strokeDasharray: '4 4' }

export default function GhostPiece({ children }: { children: React.ReactNode }) {
  return (
    <g opacity="0.15" style={GHOST}>
      <g {...GHOST_STROKE}>{children}</g>
      <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#8899cc" fontSize="18" opacity="0.5">?</text>
    </g>
  )
}
