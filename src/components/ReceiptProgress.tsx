import { OCR } from '../shared/labels'

interface ReceiptProgressProps {
  itemsSum: number
  total: number | null
  isApproved: boolean
  percentage: number
  uncertainCount: number
}

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function ReceiptProgress({
  itemsSum,
  total,
  isApproved,
  percentage,
  uncertainCount,
}: ReceiptProgressProps) {
  return (
    <>
      {/* Barra progresso somma → totale */}
      {total !== null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            <span>{formatEuro(itemsSum)}</span>
            <span>
              {OCR.totaleRilevato}:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{formatEuro(total)}</strong>
            </span>
          </div>
          <div style={{ height: '10px', borderRadius: '5px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: '5px',
                background: isApproved ? '#22c55e' : 'var(--accent)',
                width: `${percentage}%`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 700,
              textAlign: 'center',
              color: isApproved ? '#16a34a' : 'var(--text-muted)',
            }}
          >
            {isApproved ? OCR.approvatoScontrino : OCR.sommaNonValida}
          </p>
        </div>
      ) : (
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {OCR.nessunTotale}
        </p>
      )}

      {/* Banner prezzi da verificare */}
      {uncertainCount > 0 && (
        <p
          className="text-xs text-center font-semibold py-1 rounded-lg"
          style={{
            color: '#d97706',
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.3)',
          }}
        >
          {OCR.prezziDaVerificare(uncertainCount)}
        </p>
      )}
    </>
  )
}

export default ReceiptProgress
