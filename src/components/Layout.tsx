import { Outlet, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import BottomNav from './BottomNav'
import ResearchButton from './ResearchButton'
import { LAYOUT } from '../shared/labels'
import { useAmounts } from '../shared/AmountsContext'

function Layout() {
  const { amountsVisible, toggleAmounts } = useAmounts()

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <header
        className="px-4 py-3 md:px-8 flex items-center gap-4 md:gap-8 transition-colors duration-300"
        style={{ backgroundColor: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', color: 'var(--nav-text)' }}
      >
        <Link to="/" className="text-lg md:text-xl font-bold no-underline" style={{ color: 'var(--nav-text)' }}>
          {LAYOUT.appName}
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          {!amountsVisible && (
            <span className="text-xs font-semibold" style={{ color: 'rgba(239,68,68,0.9)' }}>
              {LAYOUT.importiNascosti}
            </span>
          )}
          <button
            onClick={toggleAmounts}
            className="flex items-center justify-center hover:bg-white/20 active:scale-95"
            style={{
              width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
              background: amountsVisible ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.25)',
              cursor: 'pointer', color: 'var(--nav-text)', transition: 'background 0.2s', flexShrink: 0,
            }}
            aria-label={amountsVisible ? LAYOUT.nascondiImporti : LAYOUT.mostraImporti}
            title={amountsVisible ? LAYOUT.nascondiImporti : LAYOUT.mostraImporti}
          >
            {amountsVisible ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
          </button>
        </div>
        <ResearchButton />
      </header>

      <main className="flex-1 px-4 py-6 md:px-8 pb-28 md:pb-28">
        <div className="max-w-5xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default Layout
