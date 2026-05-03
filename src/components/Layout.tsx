import { Outlet, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import BottomNav from './BottomNav'
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
        <button
          onClick={toggleAmounts}
          className="w-9 h-9 flex items-center justify-center rounded-full transition hover:opacity-80 active:scale-90"
          style={{ color: 'var(--nav-text)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label={amountsVisible ? LAYOUT.nascondiImporti : LAYOUT.mostraImporti}
          title={amountsVisible ? LAYOUT.nascondiImporti : LAYOUT.mostraImporti}
        >
          {amountsVisible ? (
            <Eye size={22} aria-hidden="true" />
          ) : (
            <EyeOff size={22} aria-hidden="true" />
          )}
        </button>
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
