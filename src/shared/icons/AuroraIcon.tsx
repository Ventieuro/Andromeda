import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function AuroraIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M2 6.5Q6 2.5 10 5.5Q14 8.5 18 5.5Q20 4 22 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="1" />
      <path d="M2 10.5Q6 6.5 10 9.5Q14 12.5 18 9.5Q20 8 22 8.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M2 14.5Q6 10.5 10 13.5Q14 16.5 18 13.5Q20 12 22 12.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
      <circle cx="4" cy="20" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="13" cy="21" r="0.7" fill="currentColor" opacity="0.55" />
      <circle cx="21" cy="19" r="0.9" fill="currentColor" opacity="0.65" />
    </svg>
  )
}
