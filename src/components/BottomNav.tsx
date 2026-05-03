import { Link, useLocation, useNavigate } from 'react-router-dom'
import { House, List, Target, Settings } from 'lucide-react'
import { LAYOUT, DASHBOARD } from '../shared/labels'

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  function handleAddClick() {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => window.dispatchEvent(new Event('hermes:add-transaction')), 120)
      return
    }
    window.dispatchEvent(new Event('hermes:add-transaction'))
  }

  return (
    <>
      {/* ─── Bottom tab bar: always fixed, inline styles only (no Tailwind conflicts) ─── */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'color-mix(in srgb, var(--nav-bg) 97%, transparent)',
          borderTop: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'var(--nav-text)',
          /* overflow: visible so the + can poke above the border */
        }}
        aria-label="Navigazione principale"
      >
        {/* Wrapper: 5 equal flex slots — 4 nav items + 1 spacer centrale */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingTop: '10px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>

          {/* Home */}
          <Link
            to="/"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              padding: '4px 0', textDecoration: 'none',
              color: isActive('/') ? 'var(--accent)' : 'var(--nav-text)',
              transition: 'color 0.2s',
            }}
            title={LAYOUT.navHome}
          >
            <div style={{ width: '44px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', backgroundColor: isActive('/') ? 'color-mix(in srgb, var(--accent-light) 60%, transparent)' : 'transparent' }}>
              <House size={22} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>{LAYOUT.navHome}</span>
          </Link>

          {/* Movimenti */}
          <Link
            to="/movimenti"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              padding: '4px 0', textDecoration: 'none',
              color: isActive('/movimenti') ? 'var(--accent)' : 'var(--nav-text)',
              transition: 'color 0.2s',
            }}
            title={LAYOUT.navMovimenti}
          >
            <div style={{ width: '44px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', backgroundColor: isActive('/movimenti') ? 'color-mix(in srgb, var(--accent-light) 60%, transparent)' : 'transparent' }}>
              <List size={22} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>{LAYOUT.navMovimenti}</span>
          </Link>

          {/* Spacer for + button slot */}
          <div style={{ flex: 1, flexShrink: 0 }} aria-hidden="true" />

          {/* Missioni */}
          <Link
            to="/missions"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              padding: '4px 0', textDecoration: 'none',
              color: isActive('/missions') ? 'var(--accent)' : 'var(--nav-text)',
              transition: 'color 0.2s',
            }}
            title={LAYOUT.navMissioni}
          >
            <div style={{ width: '44px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', backgroundColor: isActive('/missions') ? 'color-mix(in srgb, var(--accent-light) 60%, transparent)' : 'transparent' }}>
              <Target size={22} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>{LAYOUT.navMissioni}</span>
          </Link>

          {/* Impostazioni */}
          <Link
            to="/settings"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              padding: '4px 0', textDecoration: 'none',
              color: location.pathname.startsWith('/settings') ? 'var(--accent)' : 'var(--nav-text)',
              transition: 'color 0.2s',
            }}
            title={LAYOUT.navSettings}
          >
            <div style={{ width: '44px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', backgroundColor: location.pathname.startsWith('/settings') ? 'color-mix(in srgb, var(--accent-light) 60%, transparent)' : 'transparent' }}>
              <Settings size={22} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>{LAYOUT.navSettings}</span>
          </Link>

          {/* + centrale: absolute, centred, pokes 22px above the bar top edge */}
          <button
            onClick={handleAddClick}
            style={{
              position: 'absolute',
              top: '-22px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid color-mix(in srgb, var(--bg-primary) 100%, transparent)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '30px', lineHeight: 1, fontWeight: 300,
              background: 'var(--fab-bg)',
              color: 'var(--fab-text)',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--fab-bg) 55%, transparent)',
              transition: 'transform 0.12s, box-shadow 0.12s',
              zIndex: 10,
            }}
            onPointerDown={e => { e.currentTarget.style.transform = 'translateX(-50%) scale(0.90)' }}
            onPointerUp={e => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)' }}
            onPointerLeave={e => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)' }}
            aria-label={DASHBOARD.aggiungiMovimento}
            title={LAYOUT.navAdd}
          >
            +
          </button>
        </div>
      </nav>
    </>
  )
}

export default BottomNav
