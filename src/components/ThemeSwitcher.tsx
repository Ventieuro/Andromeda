import { useTheme } from '../shared/ThemeContext'

const THEME_META: Record<string, { icon: string; label: string; bg: string; text: string; border: string }> = {
  nebula:  { icon: '🌌', label: 'Nebula',  bg: '#0b0d17', text: '#b388ff', border: '#7c4dff' },
  mission: { icon: '🚀', label: 'Mission', bg: '#0d1323', text: '#ff9800', border: '#ff9800' },
  nasa:    { icon: '☀️', label: 'NASA',    bg: '#f5f5f5', text: '#FC3D21', border: '#FC3D21' },
  aurora:  { icon: '�', label: 'Aurora',  bg: '#071a14', text: '#00e5b0', border: '#00e5b0' },
  luna:    { icon: '🌙', label: 'Luna',    bg: '#eef0f6', text: '#6366f1', border: '#6366f1' },
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
        <span>{meta.icon}</span>
        <span className="hidden sm:inline">{meta.label}</span>
      </span>
    </div>
  )
}

export default ThemeSwitcher
