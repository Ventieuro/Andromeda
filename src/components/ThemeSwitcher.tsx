import { useTheme } from '../shared/ThemeContext'
import { NebulaIcon, MissionIcon, NasaIcon, AuroraIcon, LunaIcon, SupernovaIcon } from '../shared/icons'
import type { ComponentType } from 'react'

const THEME_META: Record<string, { Icon: ComponentType<{ size?: number }>; label: string; bg: string; text: string; border: string }> = {
  nebula:  { Icon: NebulaIcon,  label: 'Nebula',  bg: '#0b0d17', text: '#b388ff', border: '#7c4dff' },
  mission: { Icon: MissionIcon, label: 'Campfire', bg: '#0d1323', text: '#ff9800', border: '#ff9800' },
  nasa:    { Icon: NasaIcon,    label: 'Orbiter', bg: '#f4f6fc', text: '#FC3D21', border: '#FC3D21' },
  aurora:  { Icon: AuroraIcon,  label: 'Aurora',  bg: '#080c1a', text: '#00e5b0', border: '#00e5b0' },
  luna:    { Icon: LunaIcon,    label: 'Luna',    bg: '#eef0f8', text: '#4a55a8', border: '#7c85c8' },
  supernova: { Icon: SupernovaIcon, label: 'Supernova', bg: '#070707', text: '#ff4d4d', border: '#ff2b2b' },
}

function ThemeSwitcher() {
  const { theme } = useTheme()
  const meta = THEME_META[theme] ?? THEME_META.mission
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-9 px-3 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-md"
        style={{
          backgroundColor: meta.bg,
          color: meta.text,
          border: `2px solid ${meta.border}`,
          boxShadow: `0 0 8px ${meta.border}50`,
        }}
      >
        <meta.Icon size={16} />
        <span className="hidden sm:inline">{meta.label}</span>
      </span>
    </div>
  )
}

export default ThemeSwitcher
