/**
 * themeIcons.tsx — SVG icons for each theme, used in Settings and ThemeSwitcher.
 * All icons use `currentColor` so they inherit the parent element's CSS color.
 */

import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  style?: CSSProperties
  className?: string
}

export function NebulaIcon({ size = 20, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* outer arm */}
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1" opacity="0.35" transform="rotate(-30 12 12)" />
      {/* inner arm */}
      <ellipse cx="12" cy="12" rx="5.5" ry="2" stroke="currentColor" strokeWidth="1.2" opacity="0.65" transform="rotate(-30 12 12)" />
      {/* core */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.95" />
      {/* background stars */}
      <circle cx="4.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.75" />
      <circle cx="19" cy="7.5" r="0.6" fill="currentColor" opacity="0.55" />
      <circle cx="6" cy="19" r="0.7" fill="currentColor" opacity="0.5" />
      <circle cx="20.5" cy="17.5" r="0.5" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function MissionIcon({ size = 20, style, className }: IconProps) {
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

export function NasaIcon({ size = 20, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* sun disk */}
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      {/* 8 rays */}
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

export function AuroraIcon({ size = 20, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* aurora curtain bands — 3 waves fading out */}
      <path d="M2 6.5Q6 2.5 10 5.5Q14 8.5 18 5.5Q20 4 22 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="1" />
      <path d="M2 10.5Q6 6.5 10 9.5Q14 12.5 18 9.5Q20 8 22 8.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M2 14.5Q6 10.5 10 13.5Q14 16.5 18 13.5Q20 12 22 12.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
      {/* stars on horizon */}
      <circle cx="4" cy="20" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="13" cy="21" r="0.7" fill="currentColor" opacity="0.55" />
      <circle cx="21" cy="19" r="0.9" fill="currentColor" opacity="0.65" />
    </svg>
  )
}
