import { Trash2, GripVertical } from 'lucide-react'
import type { ProductEntry } from '../shared/types'
import type { ReceiptItem } from '../shared/receiptUtils'
import { OCR, PRODUCTS } from '../shared/labels'

interface ReceiptItemRowProps {
  item: ReceiptItem
  index: number
  isDragging: boolean
  isEditing: boolean
  catalogMatch: ProductEntry | undefined
  onDragStart: (index: number) => void
  onDragEnd: () => void
  onModifyName: (id: string, value: string) => void
  onModifyPrice: (id: string, value: string) => void
  onModifyDiscountAmount: (id: string, value: string) => void
  onModifyDiscountType: (id: string, value: string) => void
  onEditDiscount: (id: string) => void
  onCloseEditDiscount: () => void
  onRemove: (id: string) => void
}

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function formatDiscountLine(item: ReceiptItem): string | null {
  if (!item.discountType || !item.discountAmount || item.discountAmount <= 0) return null
  return `${item.discountType} -${formatEuro(item.discountAmount)}`
}

function getGrossPrice(item: ReceiptItem): number {
  if (typeof item.grossPrice === 'number') return item.grossPrice
  if (item.discountAmount && item.discountAmount > 0) {
    return parseFloat((item.price + item.discountAmount).toFixed(2))
  }
  return item.price
}

function ReceiptItemRow({
  item,
  index,
  isDragging,
  isEditing,
  catalogMatch,
  onDragStart,
  onDragEnd,
  onModifyName,
  onModifyPrice,
  onModifyDiscountAmount,
  onModifyDiscountType,
  onEditDiscount,
  onCloseEditDiscount,
  onRemove,
}: ReceiptItemRowProps) {
  const knownPrice = catalogMatch?.priceHistory[catalogMatch.priceHistory.length - 1]?.price ?? null
  const priceDiffers = knownPrice !== null && Math.abs(knownPrice - item.price) > 0.01
  const discountLine = formatDiscountLine(item)
  const hasDiscount = !!item.discountAmount && item.discountAmount > 0
  const grossPrice = getGrossPrice(item)

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      className="grid items-start"
      style={{
        gridTemplateColumns: '24px 1fr 80px 32px',
        padding: '5px 8px 5px 2px',
        borderBottom: `1px solid var(--border)`,
        gap: '3px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          color: isDragging ? 'var(--accent)' : 'var(--text-muted)',
          cursor: 'grab',
          transition: 'color 0.2s',
          userSelect: 'none',
        }}
      >
        <GripVertical size={16} strokeWidth={1.5} />
      </div>

      {/* Nome articolo + badge prezzo noto */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onModifyName(item.id, e.target.value)}
          style={{
            fontSize: '13px',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            borderRadius: '8px',
            padding: '4px 8px',
            outline: 'none',
            color: 'var(--text-primary)',
            width: '100%',
            minWidth: 0,
          }}
        />
        {catalogMatch && knownPrice !== null && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '6px',
              background: priceDiffers ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.12)',
              color: priceDiffers ? '#d97706' : '#16a34a',
              border: `1px solid ${priceDiffers ? 'rgba(251,191,36,0.4)' : 'rgba(34,197,94,0.3)'}`,
              display: 'inline-block',
              alignSelf: 'flex-start',
            }}
          >
            {PRODUCTS.prezzoNotoLabel(formatEuro(knownPrice))}
            {priceDiffers ? ' ⚠️' : ''}
          </span>
        )}
        {isEditing ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', paddingLeft: '6px', marginTop: '2px' }}>
            <input
              autoFocus
              type="text"
              inputMode="decimal"
              placeholder="€"
              defaultValue={item.discountAmount ? item.discountAmount.toFixed(2).replace('.', ',') : ''}
              onBlur={(e) => onModifyDiscountAmount(item.id, e.target.value)}
              style={{
                fontSize: '11px',
                width: '44px',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '6px',
                padding: '2px 4px',
                outline: 'none',
                color: 'var(--text-primary)',
                textAlign: 'right',
              }}
            />
            <input
              type="text"
              placeholder="tipo (es: 30%, BLUCARD)"
              defaultValue={item.discountType || ''}
              onBlur={(e) => onModifyDiscountType(item.id, e.target.value)}
              style={{
                fontSize: '11px',
                flex: 1,
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '6px',
                padding: '2px 4px',
                outline: 'none',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onMouseDown={(e) => {
                e.preventDefault()
                onCloseEditDiscount()
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--text-muted)',
                padding: '2px 3px',
                flexShrink: 0,
              }}
              aria-label="Chiudi modifica sconto"
            >
              ✕
            </button>
          </div>
        ) : discountLine ? (
          <span
            onClick={() => onEditDiscount(item.id)}
            style={{
              fontSize: '10px',
              color: '#d97706',
              paddingLeft: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Tocca per modificare lo sconto"
          >
            {discountLine}
            <span style={{ fontSize: '9px', opacity: 0.6 }}>✎</span>
          </span>
        ) : (
          <button
            onClick={() => onEditDiscount(item.id)}
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              paddingLeft: '6px',
              textAlign: 'left',
              opacity: 0.6,
            }}
          >
            + sconto
          </button>
        )}
      </div>

      {/* Prezzo */}
      {hasDiscount ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{OCR.prezzoTotaleArticolo}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {formatEuro(grossPrice)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '9px', color: '#d97706' }}>{OCR.scontoArticolo}</span>
            <span style={{ fontSize: '10px', color: '#d97706', fontWeight: 700 }}>
              -{formatEuro(item.discountAmount ?? 0)}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right' }}>
              {OCR.prezzoScontatoArticolo}
            </span>
            <input
              type="text"
              readOnly
              value={item.price.toFixed(2).replace('.', ',')}
              title={OCR.prezzoScontatoArticolo}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textAlign: 'right',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '4px 6px',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                cursor: 'default',
              }}
            />
          </div>
        </div>
      ) : (
        <input
          type="text"
          inputMode="decimal"
          key={item.id}
          defaultValue={item.price.toFixed(2).replace('.', ',')}
          onBlur={(e) => onModifyPrice(item.id, e.target.value)}
          title={item.confidence === 'uncertain' ? OCR.prezzoIncerto : undefined}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'right',
            background: 'var(--input-bg)',
            border: item.confidence === 'uncertain' ? '1px solid #f59e0b' : '1px solid var(--input-border)',
            borderRadius: '8px',
            padding: '4px 6px',
            outline: 'none',
            color: item.confidence === 'uncertain' ? '#d97706' : 'var(--text-primary)',
            width: '100%',
          }}
        />
      )}

      {/* Elimina riga */}
      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Rimuovi articolo"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default ReceiptItemRow
