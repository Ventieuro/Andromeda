import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function SupernovaIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <circle cx="12" cy="12" r="2.8" fill="currentColor" opacity="0.95" />
      <circle cx="12" cy="12" r="5.2" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path d="M12 1.8L13.6 7.2L12 9.4L10.4 7.2L12 1.8Z" fill="currentColor" opacity="0.85" />
      <path d="M22.2 12L16.8 13.6L14.6 12L16.8 10.4L22.2 12Z" fill="currentColor" opacity="0.85" />
      <path d="M12 22.2L10.4 16.8L12 14.6L13.6 16.8L12 22.2Z" fill="currentColor" opacity="0.85" />
      <path d="M1.8 12L7.2 10.4L9.4 12L7.2 13.6L1.8 12Z" fill="currentColor" opacity="0.85" />
      <path d="M19.1 4.9L16.2 8.3L13.7 8.8L14.2 6.3L17.6 3.4Z" fill="currentColor" opacity="0.6" />
      <path d="M20.6 17.6L15.6 16.9L14.2 14.8L16.3 13.4L21.3 14.1Z" fill="currentColor" opacity="0.6" />
      <path d="M4.9 19.1L8.3 16.2L8.8 13.7L6.3 14.2L3.4 17.6Z" fill="currentColor" opacity="0.6" />
      <path d="M6.4 3.4L7.1 8.4L9.2 9.8L10.6 7.7L9.9 2.7Z" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
