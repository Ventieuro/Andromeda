import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function MissionIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* rocket body */}
      <path d="M12 3C12 3 17 7.5 17 13L12 15.5L7 13C7 7.5 12 3 12 3Z" fill="currentColor" opacity="0.9" />
      {/* fins */}
      <path d="M7 13L5 18L12 15.5L19 18L17 13" fill="currentColor" opacity="0.5" />
      {/* porthole */}
      <circle cx="12" cy="10" r="2" stroke="white" strokeWidth="1" opacity="0.45" />
      {/* flame */}
      <path d="M10.5 17.5Q12 21.5 13.5 17.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
    </svg>
  )
}
