import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function CampfireIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M12 4C9.4 6.6 9 8.1 9 9.8C9 11.8 10.5 13.3 12.5 13.3C14.5 13.3 16 11.8 16 9.8C16 8 15.2 6.5 12 4Z" fill="currentColor" />
      <path d="M12.2 7.2C11.2 8.2 11 9 11 9.9C11 10.9 11.8 11.7 12.8 11.7C13.8 11.7 14.6 10.9 14.6 9.9C14.6 9.1 14.2 8.2 12.2 7.2Z" fill="white" opacity="0.75" />
      <path d="M6 16.2L9.2 19.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 16.2L14.8 19.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="8.7" y="15" width="6.6" height="2" rx="1" fill="currentColor" opacity="0.9" />
    </svg>
  )
}
