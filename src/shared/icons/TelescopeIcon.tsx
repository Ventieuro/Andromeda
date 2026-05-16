import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function TelescopeIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className} aria-hidden="true">
      {/* tube principale */}
      <rect x="2" y="9" width="14" height="5" rx="2" fill="currentColor" opacity="0.9" transform="rotate(-30 9 11.5)" />
      {/* oculare */}
      <rect x="1" y="10.5" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.6" transform="rotate(-30 3.5 12)" />
      {/* obiettivo */}
      <circle cx="16.5" cy="7" r="2.5" fill="currentColor" opacity="0.85" />
      {/* treppiede - gamba sx */}
      <line x1="9" y1="15" x2="6" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* treppiede - gamba dx */}
      <line x1="11" y1="15" x2="14" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* stellina in alto a destra */}
      <circle cx="20" cy="4" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="7" r="0.6" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
