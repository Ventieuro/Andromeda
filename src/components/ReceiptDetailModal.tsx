import type { Transaction } from '../shared/types'
import { Modal } from './ui'
import { RECEIPT_DETAIL } from '../shared/labels'

interface ReceiptDetailModalProps {
  transaction: Transaction
  onClose: () => void
}

function formatEuro(value: number) {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function ReceiptDetailModal({ transaction, onClose }: ReceiptDetailModalProps) {
  const items = transaction.receiptItems ?? []

  return (
    <Modal onClose={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '88dvh',
          overflowY: 'auto',
          borderRadius: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {RECEIPT_DETAIL.titolo}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            aria-label={RECEIPT_DETAIL.chiudi}
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {RECEIPT_DETAIL.nessunDettaglio}
            </p>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  {RECEIPT_DETAIL.colonnaArticolo}
                </span>
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  {RECEIPT_DETAIL.colonnaPrezzo}
                </span>
              </div>

              {items.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '8px',
                    padding: '10px 12px',
                    borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatEuro(item.price)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '12px',
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {RECEIPT_DETAIL.totale}
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatEuro(transaction.amount)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReceiptDetailModal
