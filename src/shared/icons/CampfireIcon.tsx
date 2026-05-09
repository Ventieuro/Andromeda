import type { CSSProperties } from 'react'

interface Props { size?: number; style?: CSSProperties; className?: string }

export default function CampfireIcon({ size = 20, style, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M12 4C9.4 6.6 9 8.1 9 9.8C9 11.8 10.5 13.3 12.5 13.3C14.5 13.3 16 11.8 16 9.8C16 8 15.2 6.5 12 4Z" fill="currentColor" />
      <path d="M12.2 7.2C11.2 8.2 11 9 11 9.9C11 10.9 11.8 11.7 12.8 11.7C13.8 11.7 14.6 10.9 14.6 9.9C14.6 9.1 14.2 8.2 12.2 7.2Z" fill="white" opacity="0.75" />
      <rect x="6.1" y="16" width="7.8" height="1.9" rx="0.95" transform="rotate(28 6.1 16)" fill="currentColor" opacity="0.95" />
      <rect x="10.1" y="19.7" width="7.8" height="1.9" rx="0.95" transform="rotate(-28 10.1 19.7)" fill="currentColor" opacity="0.85" />
      <circle cx="6.6" cy="17" r="0.65" fill="currentColor" opacity="0.75" />
      <circle cx="17.4" cy="17" r="0.65" fill="currentColor" opacity="0.75" />
      <rect x="8.5" y="15" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
