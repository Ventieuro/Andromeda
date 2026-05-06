import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function LunaIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* crescent moon — full circle minus a smaller offset circle via clip */}
      <path
        d="M12 3a9 9 0 1 0 9 9A7 7 0 0 1 12 3Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* crater details */}
      <circle cx="9" cy="10" r="1.2" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
      <circle cx="13.5" cy="15" r="0.8" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
      {/* stars */}
      <circle cx="20" cy="5" r="0.7" fill="currentColor" opacity="0.7" />
      <circle cx="22" cy="10" r="0.5" fill="currentColor" opacity="0.5" />
      <circle cx="19" cy="2" r="0.5" fill="currentColor" opacity="0.55" />
    </svg>
  )
}
