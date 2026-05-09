import type { DragEvent, RefObject } from 'react'
import type { ProductEntry } from '../shared/types'
import type { ReceiptItem } from '../shared/receiptUtils'
import { OCR } from '../shared/labels'
import ReceiptItemRow from './ReceiptItemRow'

interface ReceiptTableProps {
  items: ReceiptItem[]
  draggedIndex: number | null
  editingDiscountId: string | null
  catalogMatches: Map<string, ProductEntry>
  containerRef: RefObject<HTMLDivElement | null>
  itemsSum: number
  total: number | null
  isReceiptApproved: boolean
  onDragStart: (index: number) => void
  onDragOver: (index: number, e: DragEvent) => void
  onDrop: (index: number) => void
  onDragEnd: () => void
  onModifyName: (id: string, value: string) => void
  onModifyPrice: (id: string, value: string) => void
  onModifyDiscountAmount: (id: string, value: string) => void
  onModifyDiscountType: (id: string, value: string) => void
  onEditDiscount: (id: string) => void
  onCloseEditDiscount: () => void
  onRemove: (id: string) => void
  onModifyTotal: (value: string) => void
}

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function ReceiptTable({
  items,
  draggedIndex,
  editingDiscountId,
  catalogMatches,
  containerRef,
  itemsSum,
  total,
  isReceiptApproved,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onModifyName,
  onModifyPrice,
  onModifyDiscountAmount,
  onModifyDiscountType,
  onEditDiscount,
  onCloseEditDiscount,
  onRemove,
  onModifyTotal,
}: ReceiptTableProps) {
  if (items.length === 0) return null

  return (
    <div
      ref={containerRef}
      style={{
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      {/* Intestazione */}
      <div
        className="grid text-xs font-semibold uppercase"
        style={{
          gridTemplateColumns: '24px 1fr 80px 32px',
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span />
        <span>{OCR.colonnaArticolo}</span>
        <span style={{ textAlign: 'right' }}>{OCR.colonnaPrezzo}</span>
        <span />
      </div>

      {/* Righe articoli */}
      {items.map((item, idx) => {
        const catalogMatch = catalogMatches.get(item.id)
        return (
          <div
            key={item.id}
            onDragOver={(e) => onDragOver(idx, e)}
            onDrop={() => onDrop(idx)}
          >
            <ReceiptItemRow
              item={item}
              index={idx}
              isDragging={draggedIndex === idx}
              isEditing={editingDiscountId === item.id}
              catalogMatch={catalogMatch}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onModifyName={onModifyName}
              onModifyPrice={onModifyPrice}
              onModifyDiscountAmount={onModifyDiscountAmount}
              onModifyDiscountType={onModifyDiscountType}
              onEditDiscount={onEditDiscount}
              onCloseEditDiscount={onCloseEditDiscount}
              onRemove={onRemove}
            />
          </div>
        )
      })}

      <div
        className="grid items-center font-bold"
        style={{
          gridTemplateColumns: '1fr 80px 32px',
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          fontSize: '13px',
          color: 'var(--text-primary)',
        }}
      >
        <span>{total !== null && !isReceiptApproved ? OCR.totaleCalcolato : 'Totale'}</span>
        <span style={{ textAlign: 'right' }}>{formatEuro(itemsSum)}</span>
        <span />
      </div>

      {total !== null && !isReceiptApproved && (
        <div
          className="grid items-center font-bold"
          style={{
            gridTemplateColumns: '1fr 70px 70px 32px',
            padding: '6px 12px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            fontSize: '13px',
            color: '#ef4444',
          }}
        >
          <span>{OCR.totaleRilevato}</span>
          <input
            type="text"
            inputMode="decimal"
            key={total}
            defaultValue={total.toFixed(2).replace('.', ',')}
            onBlur={(e) => onModifyTotal(e.target.value)}
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textAlign: 'right',
              background: 'var(--input-bg)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '4px 6px',
              color: '#ef4444',
              outline: 'none',
              width: '100%',
            }}
          />
          <span />
          <span />
        </div>
      )}
    </div>
  )
}

export default ReceiptTable
