import { useRef, useEffect, useState, useMemo } from 'react'
import type { Transaction } from '../shared/types'
import { getTransactionsInPeriod } from '../shared/storage'
import { DASHBOARD } from '../shared/labels'
import { useAmounts } from '../shared/AmountsContext'

// ─── Stelle fisse generate una sola volta ────────────────

// ─── Stelle fisse generate una sola volta ────────────────
const STARS = Array.from({ length: 70 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.2 + 0.3,
  offset: Math.random() * Math.PI * 2,
}))

// ─── Dati fake per sviluppo locale (rimossi in produzione) ─
const FAKE_MONTHS = [
  { income: 1800, expenses: 1720 },
  { income: 2200, expenses: 1860 },
  { income: 1600, expenses: 1720 },
  { income: 2100, expenses: 1890 },
  { income: 2400, expenses: 1920 },
  { income: 1900, expenses: 2100 },
  { income: 2500, expenses: 1880 },
  { income: 2000, expenses: 1850 },
  { income: 2300, expenses: 1910 },
  { income: 1800, expenses: 1890 },
  { income: 2600, expenses: 2060 },
  { income: 2100, expenses: 1790 },
]
const DEV_FAKE_DATA: { label: string; income: number; expenses: number; savings: number }[] = Array.from({ length: 12 }, (_, i) => {
  const d = new Date()
  d.setMonth(d.getMonth() - 11 + i)
  const { income, expenses } = FAKE_MONTHS[i]
  return {
    label: d.toLocaleDateString('it-IT', { month: 'short' }),
    income,
    expenses,
    savings: income - expenses,
  }
})

const PADDING = { top: 40, right: 20, bottom: 36, left: 62 }
const ANIM_DURATION = 2200
const BG = '#080b18'

type CometMode = 'cumulative' | 'monthly'

export interface MonthDetail {
  index: number
  label: string
  income: number
  expenses: number
  savings: number
}

export interface CometChartProps {
  allTransactions: Transaction[]
  payDay: number
  onMonthSelect?: (detail: MonthDetail | null) => void
  selectedMonthIndex?: number | null
  onTotalsChange?: (totals: { income: number; expenses: number; savings: number } | null) => void
}

// ─── Helpers ─────────────────────────────────────────────

function getPeriodDates(payDay: number, offset: number): { start: Date; end: Date } {
  const today = new Date()
  const baseMonth = today.getDate() >= payDay ? today.getMonth() : today.getMonth() - 1
  const start = new Date(today.getFullYear(), baseMonth + offset, payDay)
  const end = new Date(start.getFullYear(), start.getMonth() + 1, payDay - 1)
  return { start, end }
}

function formatEuroCompact(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1000) return `${sign}€${(abs / 1000).toFixed(1)}k`
  return `${sign}€${Math.round(abs)}`
}

function calcTotalLength(pts: { x: number; y: number }[]) {
  let len = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    len += Math.sqrt(dx * dx + dy * dy)
  }
  return len
}

function drawPartialLine(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
  drawLen: number,
  color: string,
  lineWidth: number,
) {
  if (pts.length < 2 || drawLen <= 0) return
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  let accumulated = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    const segLen = Math.sqrt(dx * dx + dy * dy)
    if (accumulated + segLen <= drawLen) {
      ctx.lineTo(pts[i].x, pts[i].y)
      accumulated += segLen
    } else {
      const t = (drawLen - accumulated) / segLen
      ctx.lineTo(pts[i - 1].x + dx * t, pts[i - 1].y + dy * t)
      break
    }
  }
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.stroke()
}

function getPositionAtLength(
  pts: { x: number; y: number }[],
  drawLen: number,
): { x: number; y: number } | null {
  if (pts.length < 2 || drawLen <= 0) return null
  let accumulated = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    const segLen = Math.sqrt(dx * dx + dy * dy)
    if (accumulated + segLen >= drawLen) {
      const t = (drawLen - accumulated) / segLen
      return { x: pts[i - 1].x + dx * t, y: pts[i - 1].y + dy * t }
    }
    accumulated += segLen
  }
  return pts[pts.length - 1]
}

function getVisibleCount(pts: { x: number; y: number }[], drawLen: number): number {
  if (pts.length < 2) return pts.length
  let accumulated = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    accumulated += Math.sqrt(dx * dx + dy * dy)
    if (accumulated > drawLen) return i
  }
  return pts.length
}

function fillArea(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
  zeroY: number,
  above: boolean,
) {
  if (pts.length < 2) return
  const clampFn = above
    ? (y: number) => Math.min(y, zeroY)
    : (y: number) => Math.max(y, zeroY)
  ctx.beginPath()
  ctx.moveTo(pts[0].x, zeroY)
  for (const p of pts) ctx.lineTo(p.x, clampFn(p.y))
  ctx.lineTo(pts[pts.length - 1].x, zeroY)
  ctx.closePath()
  ctx.fill()
}

function tooltipRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// ─── Componente ───────────────────────────────────────────

export default function CometChart({ allTransactions, payDay, onMonthSelect, selectedMonthIndex, onTotalsChange }: CometChartProps) {
  const [mode, setMode] = useState<CometMode>('monthly')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const animStartRef = useRef<number | null>(null)
  const animDoneRef = useRef(false)
  const rafRef = useRef(0)
  const { amountsVisible } = useAmounts()

  // ─── Dati mensili ─────────────────────────────────────
  const monthlyData = useMemo(() => {
    if (import.meta.env.DEV) return DEV_FAKE_DATA
    const result: { label: string; income: number; expenses: number; savings: number }[] = []
    for (let offset = -11; offset <= 0; offset++) {
      const { start, end } = getPeriodDates(payDay, offset)
      const tx = getTransactionsInPeriod(allTransactions, start, end)
      const income = tx.filter((t) => t.type === 'entrata').reduce((s, t) => s + t.amount, 0)
      const expenses = tx.filter((t) => t.type === 'uscita').reduce((s, t) => s + t.amount, 0)
      const label = start.toLocaleDateString('it-IT', { month: 'short' })
      result.push({ label, income, expenses, savings: income - expenses })
    }
    return result
  }, [allTransactions, payDay])

  const values = useMemo(() => {
    if (mode === 'cumulative') {
      let acc = 0
      return monthlyData.map((d) => { acc += d.savings; return acc })
    }
    return monthlyData.map((d) => d.savings)
  }, [monthlyData, mode])

  const labels = useMemo(() => monthlyData.map((d) => d.label), [monthlyData])
  const hasData = values.some((v) => v !== 0)

  // Emetti i totali cumulativi al padre
  useEffect(() => {
    if (mode === 'cumulative') {
      const income = monthlyData.reduce((s, d) => s + d.income, 0)
      const expenses = monthlyData.reduce((s, d) => s + d.expenses, 0)
      onTotalsChange?.({ income, expenses, savings: income - expenses })
    } else {
      onTotalsChange?.(null)
    }
  }, [mode, monthlyData]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset animazione al cambio modalità
  useEffect(() => {
    animStartRef.current = null
    animDoneRef.current = false
  }, [mode, values])

  // ─── Canvas draw loop ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = window.devicePixelRatio || 1
    let w = 0, h = 0

    function resize() {
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    resize()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function getMetrics() {
      const minV = Math.min(...values, 0)
      const maxV = Math.max(...values, 0)
      const pad = (maxV - minV) * 0.12 || 50
      const lo = minV - pad
      const hi = maxV + pad
      const range = hi - lo || 1
      const plotW = w - PADDING.left - PADDING.right
      const plotH = h - PADDING.top - PADDING.bottom
      const n = values.length

      const points = values.map((v, i) => ({
        x: PADDING.left + (i / Math.max(n - 1, 1)) * plotW,
        y: PADDING.top + plotH - ((v - lo) / range) * plotH,
        value: v,
        label: labels[i],
      }))

      const zeroY = PADDING.top + plotH - ((0 - lo) / range) * plotH

      const rawStep = (hi - lo) / 4
      const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(rawStep) || 1)))
      const step = Math.ceil(rawStep / magnitude) * magnitude || 1
      const gridStart = Math.ceil(lo / step) * step
      const gridLines: number[] = []
      for (let v = gridStart; v <= hi + step * 0.5; v += step) {
        if (gridLines.length > 7) break
        gridLines.push(v)
      }

      return { points, zeroY, gridLines, lo, hi, range, plotW, plotH }
    }

    function draw(time: number) {
      if (!ctx) return
      ctx.save()
      ctx.scale(dpr, dpr)

      if (animStartRef.current === null) animStartRef.current = time
      const elapsed = time - animStartRef.current
      const progress = Math.min(elapsed / ANIM_DURATION, 1)
      if (progress >= 1) animDoneRef.current = true

      const m = getMetrics()

      // Sfondo
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, w, h)

      // Stelle
      for (const s of STARS) {
        const alpha = 0.35 + 0.45 * ((Math.sin(time * 0.0008 + s.offset) + 1) / 2)
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${alpha.toFixed(2)})`
        ctx.fill()
      }

      // Zero line
      if (m.zeroY >= PADDING.top - 2 && m.zeroY <= h - PADDING.bottom + 2) {
        ctx.setLineDash([4, 6])
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(120,150,220,0.28)'
        ctx.beginPath()
        ctx.moveTo(PADDING.left, m.zeroY)
        ctx.lineTo(w - PADDING.right, m.zeroY)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Griglia orizzontale
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#4a6080'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      for (const gv of m.gridLines) {
        if (Math.abs(gv) < 0.01) continue
        const gy = PADDING.top + (h - PADDING.top - PADDING.bottom) - ((gv - m.lo) / m.range) * (h - PADDING.top - PADDING.bottom)
        if (gy < PADDING.top - 4 || gy > h - PADDING.bottom + 4) continue
        ctx.setLineDash([2, 5])
        ctx.lineWidth = 0.8
        ctx.strokeStyle = 'rgba(50,80,140,0.16)'
        ctx.beginPath()
        ctx.moveTo(PADDING.left, gy)
        ctx.lineTo(w - PADDING.right, gy)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillText(amountsVisible ? formatEuroCompact(gv) : '••••', PADDING.left - 4, gy)
      }

      // Etichette mesi
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#4a6080'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      for (const p of m.points) {
        ctx.fillText(p.label, p.x, h - PADDING.bottom + 6)
      }

      const totalLen = calcTotalLength(m.points)
      const drawLen = totalLen * progress
      const visibleCount = getVisibleCount(m.points, drawLen)

      // Fill area
      if (visibleCount >= 2) {
        const visPts = m.points.slice(0, visibleCount)
        const gradG = ctx.createLinearGradient(0, PADDING.top, 0, m.zeroY)
        gradG.addColorStop(0, 'rgba(56,189,248,0.28)')
        gradG.addColorStop(1, 'rgba(56,189,248,0.04)')
        ctx.fillStyle = gradG
        fillArea(ctx, visPts, m.zeroY, true)

        const gradR = ctx.createLinearGradient(0, m.zeroY, 0, h - PADDING.bottom)
        gradR.addColorStop(0, 'rgba(239,68,68,0.04)')
        gradR.addColorStop(1, 'rgba(239,68,68,0.28)')
        ctx.fillStyle = gradR
        fillArea(ctx, visPts, m.zeroY, false)
      }

      // Scia glow
      drawPartialLine(ctx, m.points, drawLen, 'rgba(100,200,255,0.06)', 14)

      // Linea principale
      const lastVal = values[Math.max(visibleCount - 1, 0)] ?? 0
      drawPartialLine(ctx, m.points, drawLen, lastVal >= 0 ? '#38bdf8' : '#f87171', 2.5)

      // Cometa (durante animazione)
      if (!animDoneRef.current) {
        const pos = getPositionAtLength(m.points, drawLen)
        if (pos) {
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(160,230,255,0.25)'
          ctx.fill()
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
        }
      }

      // Punti dati
      for (let i = 0; i < visibleCount; i++) {
        const p = m.points[i]
        const isHovered = hover === i && animDoneRef.current
        const dotColor = p.value >= 0 ? '#38bdf8' : '#f87171'

        if (isHovered) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
          ctx.fillStyle = dotColor
          ctx.fill()
          const txt = `${p.label}: ${amountsVisible ? formatEuroCompact(p.value) : '••••'}`
          ctx.font = 'bold 10px sans-serif'
          const tw = ctx.measureText(txt).width + 14
          const bx = Math.max(PADDING.left, Math.min(p.x - tw / 2, w - PADDING.right - tw))
          const by = p.y > PADDING.top + 30 ? p.y - 28 : p.y + 12
          ctx.fillStyle = 'rgba(8,14,30,0.92)'
          tooltipRect(ctx, bx, by, tw, 20, 4)
          ctx.fill()
          ctx.fillStyle = dotColor
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(txt, bx + 7, by + 10)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = dotColor
          ctx.fill()
        }
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [hover, selectedMonthIndex, values, labels, amountsVisible])

  // ─── Hover / Touch ────────────────────────────────────
  function findClosestIdx(clientX: number, rect: DOMRect): number | null {
    if (!animDoneRef.current || values.length < 2) return null
    const plotW = rect.width - PADDING.left - PADDING.right
    let closest: number | null = null
    let minDist = 28
    for (let i = 0; i < values.length; i++) {
      const px = PADDING.left + (i / (values.length - 1)) * plotW
      const dx = Math.abs(px - (clientX - rect.left))
      if (dx < minDist) { minDist = dx; closest = i }
    }
    return closest
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) setHover(findClosestIdx(e.clientX, rect))
  }

  function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    if (e.touches.length === 0) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) setHover(findClosestIdx(e.touches[0].clientX, rect))
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const idx = findClosestIdx(e.clientX, rect)
    if (idx === null) return
    const d = monthlyData[idx]
    if (selectedMonthIndex === idx) { onMonthSelect?.(null); return }
    onMonthSelect?.({ index: idx, label: d.label, income: d.income, expenses: d.expenses, savings: d.savings })
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLCanvasElement>) {
    setHover(null)
    if (e.changedTouches.length === 0) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const idx = findClosestIdx(e.changedTouches[0].clientX, rect)
    if (idx === null) return
    const d = monthlyData[idx]
    if (selectedMonthIndex === idx) { onMonthSelect?.(null); return }
    onMonthSelect?.({ index: idx, label: d.label, income: d.income, expenses: d.expenses, savings: d.savings })
  }

  // ─── Render ───────────────────────────────────────────
  return (
    <div style={{ width: '100%' }}>
      {/* Toggle modalità */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        {(['monthly', 'cumulative'] as CometMode[]).map((m) => {
          const active = mode === m
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                backgroundColor: active ? 'var(--accent-light)' : 'var(--bg-secondary)',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                borderColor: active ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {m === 'monthly' ? `📊 ${DASHBOARD.cometaMensile}` : `📈 ${DASHBOARD.cometaCumulativo}`}
            </button>
          )
        })}
      </div>

      {!hasData ? (
        <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{DASHBOARD.nessunGrafico}</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{ width: '100%', height: 260, borderRadius: 12, overflow: 'hidden', background: BG }}
        >
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHover(null)}
            onClick={handleClick}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ display: 'block', touchAction: 'none', cursor: 'pointer' }}
          />
        </div>
      )}

    </div>
  )
}
