import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function NasaIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <line x1="12" y1="1.5" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1.5" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="12" x2="22.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.4" y1="4.4" x2="6.8" y2="6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17.2" y1="17.2" x2="19.6" y2="19.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="19.6" y1="4.4" x2="17.2" y2="6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6.8" y1="17.2" x2="4.4" y2="19.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
