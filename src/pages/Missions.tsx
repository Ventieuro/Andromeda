import { LAYOUT } from '../shared/labels'

function Missions() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center"
      style={{ color: 'var(--text-primary)' }}
    >
      <span style={{ fontSize: '56px', lineHeight: 1 }}>🎯</span>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {LAYOUT.navMissioni}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '280px' }}>
        In arrivo: imposta i tuoi obiettivi di risparmio mensile e monitora i progressi.
      </p>
    </div>
  )
}

export default Missions
