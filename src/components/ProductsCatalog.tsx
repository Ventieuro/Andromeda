/**
 * ProductsCatalog — catalogo prodotti costruito dagli scontrini OCR.
 *
 * Mostra tutti i prodotti salvati con storico prezzi.
 * Permette ricerca, modifica nome, eliminazione.
 */

import { useState, useMemo } from 'react'
import type { ProductEntry } from '../shared/types'
import { loadProducts, saveProducts, deleteProduct, updateProductName } from '../shared/storage'
import { PRODOTTI } from '../shared/labels'
import { useDialog } from '../shared/DialogContext'

// ─── Helpers ─────────────────────────────────────────────

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
}

function latestPrice(p: ProductEntry): number | null {
  if (p.priceHistory.length === 0) return null
  return p.priceHistory[p.priceHistory.length - 1].price
}

function priceVariation(p: ProductEntry): { pct: number; dir: 1 | -1 | 0 } | null {
  if (p.priceHistory.length < 2) return null
  const last = p.priceHistory[p.priceHistory.length - 1].price
  const prev = p.priceHistory[p.priceHistory.length - 2].price
  if (prev === 0) return null
  const pct = Math.round(((last - prev) / prev) * 100)
  return { pct: Math.abs(pct), dir: last > prev ? 1 : last < prev ? -1 : 0 }
}

// ─── Componente ──────────────────────────────────────────

function ProductsCatalog() {
  const { showConfirm } = useDialog()
  const [products, setProducts] = useState<ProductEntry[]>(() => loadProducts())
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function reload() {
    setProducts(loadProducts())
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.aliases.some((a) => a.toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name, 'it'))
  }, [products, search])

  async function handleDelete(p: ProductEntry) {
    const ok = await showConfirm({
      message: PRODOTTI.eliminaConferma(p.name),
      confirmLabel: PRODOTTI.elimina,
      cancelLabel: PRODOTTI.annulla,
    })
    if (!ok) return
    deleteProduct(p.id)
    reload()
  }

  function startEdit(p: ProductEntry) {
    setEditingId(p.id)
    setEditingName(p.name)
  }

  function saveEdit(p: ProductEntry) {
    if (editingName.trim() && editingName.trim() !== p.name) {
      updateProductName(p.id, editingName)
      reload()
    }
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  // ── Rimuovi alias ────────────────────────────────────
  function removeAlias(productId: string, alias: string) {
    const all = loadProducts().map((p) =>
      p.id === productId ? { ...p, aliases: p.aliases.filter((a) => a !== alias) } : p,
    )
    saveProducts(all)
    reload()
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '40px', margin: '0 0 16px' }}>🏷️</p>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
          {PRODOTTI.nessunProdotto}
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 16px', paddingBottom: '24px' }}>

      {/* ─── Search ─── */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="search"
          placeholder={PRODOTTI.cerca}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '11px 16px',
            borderRadius: '14px',
            border: '1px solid var(--input-border)',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            outline: 'none',
          }}
        />
      </div>

      {/* ─── Contatore ─── */}
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {filtered.length} / {products.length}
      </p>

      {/* ─── Lista prodotti ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((p) => {
          const latest = latestPrice(p)
          const variation = priceVariation(p)
          const isExpanded = expandedId === p.id
          const isEditing = editingId === p.id

          return (
            <div
              key={p.id}
              style={{
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              {/* ── Riga principale ── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>🏷️</span>

                {/* Nome / editor */}
                <div style={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(p)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--accent)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {PRODOTTI.visto}: {formatDate(p.lastSeen)} · {PRODOTTI.occorrenze(p.priceHistory.length)}
                      </p>
                    </>
                  )}
                </div>

                {/* Prezzo + variazione */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {latest !== null && (
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatEuro(latest)}
                    </span>
                  )}
                  {variation && variation.dir !== 0 && (
                    <p style={{
                      margin: '2px 0 0',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: variation.dir === 1 ? 'var(--tx-expense-text)' : 'var(--tx-income-text)',
                    }}>
                      {variation.dir === 1 ? '▲' : '▼'} {variation.pct}%
                    </p>
                  )}
                </div>

                {/* Chevron */}
                <span style={{ fontSize: '16px', color: 'var(--text-muted)', flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}>
                  ▾
                </span>
              </div>

              {/* ── Dettaglio espandibile ── */}
              {isExpanded && (
                <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>

                  {/* Azioni */}
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', marginBottom: '12px' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(p)}
                          style={actionBtnStyle('accent')}
                        >
                          {PRODOTTI.salva}
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={actionBtnStyle('ghost')}
                        >
                          {PRODOTTI.annulla}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          style={actionBtnStyle('ghost')}
                        >
                          ✏️ {PRODOTTI.modifica}
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          style={actionBtnStyle('danger')}
                        >
                          🗑️ {PRODOTTI.elimina}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Storico prezzi */}
                  {p.priceHistory.length > 0 && (
                    <>
                      <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {PRODOTTI.storia}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                        {[...p.priceHistory].reverse().map((entry, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: idx === 0 ? 'var(--accent-light)' : 'var(--bg-secondary)',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ color: 'var(--text-muted)' }}>{formatDate(entry.date)}</span>
                            <span style={{ fontWeight: idx === 0 ? 700 : 400, color: idx === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
                              {formatEuro(entry.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Alias OCR */}
                  {p.aliases.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {PRODOTTI.variantiOcr}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {p.aliases.map((alias) => (
                          <span
                            key={alias}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-secondary)',
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {alias}
                            <button
                              onClick={() => removeAlias(p.id, alias)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--text-muted)', padding: '0 2px', lineHeight: 1 }}
                              aria-label={PRODOTTI.rimuoviAliasAria(alias)}
                            >✕</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function actionBtnStyle(variant: 'accent' | 'ghost' | 'danger'): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '7px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  }
  if (variant === 'accent') return { ...base, background: 'var(--accent)', color: 'var(--fab-text, #fff)' }
  if (variant === 'danger') return { ...base, background: 'rgba(220,53,69,0.12)', color: '#dc3545' }
  return { ...base, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }
}

export default ProductsCatalog
