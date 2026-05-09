import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function NasaIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <rect x="5" y="3" width="14" height="16" rx="6" fill="currentColor" opacity="0.2" />
      <rect x="6.5" y="4.5" width="11" height="11" rx="5.5" fill="currentColor" />
      <path d="M9 9.5C9 7.85 10.35 6.5 12 6.5H12.6C13.93 6.5 15 7.57 15 8.9V9.1C15 10.43 13.93 11.5 12.6 11.5H9V9.5Z" fill="white" opacity="0.88" />
      <rect x="8" y="16" width="8" height="3" rx="1.2" fill="currentColor" />
      <circle cx="10" cy="17.5" r="0.7" fill="white" opacity="0.85" />
      <circle cx="12" cy="17.5" r="0.7" fill="white" opacity="0.65" />
      <circle cx="14" cy="17.5" r="0.7" fill="white" opacity="0.45" />
    </svg>
  )
}
