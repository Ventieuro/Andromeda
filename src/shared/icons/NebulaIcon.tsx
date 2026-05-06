import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function NebulaIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1" opacity="0.35" transform="rotate(-30 12 12)" />
      <ellipse cx="12" cy="12" rx="5.5" ry="2" stroke="currentColor" strokeWidth="1.2" opacity="0.65" transform="rotate(-30 12 12)" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.95" />
      <circle cx="4.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.75" />
      <circle cx="19" cy="7.5" r="0.6" fill="currentColor" opacity="0.55" />
      <circle cx="6" cy="19" r="0.7" fill="currentColor" opacity="0.5" />
      <circle cx="20.5" cy="17.5" r="0.5" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
