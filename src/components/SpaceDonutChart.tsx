import { useRef, useEffect, useCallback, useState } from 'react'
import { DASHBOARD } from '../shared/labels'
import { getRandomRevealedPlanet } from '../shared/storage'
import { haptic } from '../shared/platform'
import MiniPlanet from './MiniPlanet'

const LEGEND_LIMIT = 5

// ─── Types ───────────────────────────────────────────────
interface SliceData {
  category: string
  canonicalKey: string
  amount: number
  percent: number
  color: string
  type: 'entrata' | 'uscita'
  importantRatio?: number
}

interface SpaceDonutChartProps {
  slices: SliceData[]
  totalIncome: number
  totalExpenses: number
  size?: number
  hideIncome?: boolean
  onCategoryClick?: (canonicalKey: string) => void
  savingsGoal?: number
  missionSaved?: number
}

// ─── Helpers ─────────────────────────────────────────────
function formatEuro(amount: number) {
  return amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

// ─── Star field ──────────────────────────────────────────
interface Star {
  x: number
  y: number
  r: number
  phase: number
  speed: number
}

function createStars(w: number, h: number, count: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.8 + 0.3,
    })
  }
  return stars
}

function drawStars(ctx: CanvasRenderingContext2D, stars: Star[], time: number) {
  for (const s of stars) {
    const alpha = 0.3 + 0.5 * Math.sin(time * s.speed + s.phase)
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fill()
  }
}

// ─── Important needle ────────────────────────────────────
// ─── Important needle (disabled — kept for reference) ────────────────────────
// function drawImportantNeedle(...) { ... }

// ─── Savings goal flag ────────────────────────────────────
function drawSavingsGoalFlag(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  outerR: number,
  totalIncome: number,
  _actualSavings: number,
  savingsGoal: number,
  time: number,
) {
  if (savingsGoal <= 0) return
  // Same sweep calculation as the old arc
  const goalSweep = totalIncome > 0
    ? Math.min((savingsGoal / totalIncome) * Math.PI * 2, Math.PI)
    : Math.PI / 3
  if (goalSweep < 0.05) return

  const met = _actualSavings >= savingsGoal
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.5)
  const [r, g, b] = met ? [0, 170, 255] : [239, 68, 68] // cyan = met, red = not met
  const alpha = 0.8 + 0.2 * pulse

  // Flag plants at the outer end of the arc (counter-clockwise end from top)
  const flagAngle = -Math.PI / 2 - goalSweep

  // Radial unit vector (outward from center)
  const radX = Math.cos(flagAngle)
  const radY = Math.sin(flagAngle)
  // Clockwise tangential (perpendicular to radial)
  const cwX = -Math.sin(flagAngle)
  const cwY = Math.cos(flagAngle)

  const baseR = outerR + 1
  const poleLen = 7

  const bx = cx + baseR * radX
  const by = cy + baseR * radY
  const tx = bx + poleLen * radX
  const ty = by + poleLen * radY

  // Rectangular flag fabric — wave on the far edge only
  const wave = Math.sin(time * 5) * 0.8
  const flagW = 7    // width along CW tangential direction
  const flagH = 5    // height along radial (outward)

  // Four corners of the rectangle (top-left = pole tip, going CW)
  // top-left  = tx, ty
  // top-right = tx + cwX*flagW, ty + cwY*flagW  (+ slight wave)
  // bot-right = top-right + radX*flagH (further out radially)
  // bot-left  = tx + radX*flagH
  const p0x = tx
  const p0y = ty
  const p1x = tx + cwX * (flagW + wave)
  const p1y = ty + cwY * (flagW + wave)
  const p2x = p1x + radX * flagH
  const p2y = p1y + radY * flagH
  const p3x = tx + radX * flagH
  const p3y = ty + radY * flagH

  // Dashed arc from top (-π/2) to flag angle — outside the donut, neon blue
  const dashArcR = outerR + 5
  ctx.beginPath()
  ctx.arc(cx, cy, dashArcR, flagAngle, -Math.PI / 2)
  ctx.strokeStyle = `rgba(${r},${g},${b},0.75)`
  ctx.lineWidth = 2.5
  ctx.setLineDash([5, 4])
  ctx.stroke()
  ctx.setLineDash([])

  // Small tick at the start point (top of donut = 12 o'clock)
  const tickStartX = cx + (outerR + 1) * Math.cos(-Math.PI / 2)
  const tickStartY = cy + (outerR + 1) * Math.sin(-Math.PI / 2)
  const tickEndX = cx + (dashArcR + 3) * Math.cos(-Math.PI / 2)
  const tickEndY = cy + (dashArcR + 3) * Math.sin(-Math.PI / 2)
  ctx.beginPath()
  ctx.moveTo(tickStartX, tickStartY)
  ctx.lineTo(tickEndX, tickEndY)
  ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`
  ctx.lineWidth = 2
  ctx.stroke()

  // Glow at base
  const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 10)
  glow.addColorStop(0, `rgba(${r},${g},${b},${0.35 * pulse})`)
  glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.beginPath()
  ctx.arc(bx, by, 10, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  // Pole
  ctx.beginPath()
  ctx.moveTo(bx, by)
  ctx.lineTo(tx, ty)
  ctx.strokeStyle = `rgba(220,220,255,${alpha})`
  ctx.lineWidth = 1.5
  ctx.setLineDash([])
  ctx.stroke()

  // Flag fabric
  ctx.beginPath()
  ctx.moveTo(p0x, p0y)
  ctx.lineTo(p1x, p1y)
  ctx.lineTo(p2x, p2y)
  ctx.lineTo(p3x, p3y)
  ctx.closePath()
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
  ctx.fill()
  ctx.strokeStyle = `rgba(255,255,255,0.25)`
  ctx.lineWidth = 0.5
  ctx.stroke()

  // Base dot
  ctx.beginPath()
  ctx.arc(bx, by, 2, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(220,220,255,${alpha})`
  ctx.fill()
}

// ─── Donut drawing ───────────────────────────────────────
function drawDonut(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  slices: SliceData[],
  time: number,
) {
  let startAngle = -Math.PI / 2 // top

  for (const slice of slices) {
    const sweep = (slice.percent / 100) * Math.PI * 2
    const endAngle = startAngle + sweep

    // Main slice fill
    ctx.beginPath()
    ctx.arc(cx, cy, outerR, startAngle, endAngle)
    ctx.arc(cx, cy, innerR, endAngle, startAngle, true)
    ctx.closePath()
    ctx.fillStyle = slice.color
    ctx.fill()

    // Glowing outer edge — new path with only the arc (no radial lines)
    const { r, g, b } = hexToRgb(slice.color)
    const glowAlpha = 0.4 + 0.2 * Math.sin(time * 1.5)
    ctx.beginPath()
    ctx.arc(cx, cy, outerR, startAngle, endAngle)
    ctx.strokeStyle = `rgba(${r},${g},${b},${glowAlpha})`
    ctx.lineWidth = 2
    ctx.stroke()

    // Bright outer border
    ctx.beginPath()
    ctx.arc(cx, cy, outerR, startAngle, endAngle)
    ctx.strokeStyle = `rgba(255,255,255,0.12)`
    ctx.lineWidth = 1
    ctx.stroke()

    startAngle = endAngle
  }

  // Second pass: important needles disabled (info kept in legend only)
  // startAngle = -Math.PI / 2
  // for (const slice of slices) {
  //   const sweep = (slice.percent / 100) * Math.PI * 2
  //   const ratio = slice.importantRatio ?? 0
  //   if (ratio > 0) {
  //     drawImportantNeedle(ctx, cx, cy, outerR, startAngle, sweep, ratio, time)
  //   }
  //   startAngle += sweep
  // }
}

// ─── Planet drawing (3D projected) ──────────────────────
function drawPlanet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  orbitR: number,
  angle: number,
  inclination: number,
  planetR: number,
  color: string,
  direction: number,
) {
  const cosI = Math.cos(inclination)
  const sinI = Math.sin(inclination)
  const px = cx + orbitR * Math.cos(angle)
  const py = cy + orbitR * Math.sin(angle) * cosI
  const z = orbitR * Math.sin(angle) * sinI
  // Perspective: closer = slightly bigger, farther = slightly smaller
  const perspScale = 1 + (z / (orbitR * 1.5)) * 0.2
  const effectiveR = planetR * Math.max(0.6, perspScale)

  // Glow
  const { r, g, b } = hexToRgb(color)
  const grad = ctx.createRadialGradient(px, py, 0, px, py, effectiveR * 3)
  grad.addColorStop(0, `rgba(${r},${g},${b},0.35)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.beginPath()
  ctx.arc(px, py, effectiveR * 3, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Planet body gradient
  const bodyGrad = ctx.createRadialGradient(
    px - effectiveR * 0.3,
    py - effectiveR * 0.3,
    0,
    px,
    py,
    effectiveR,
  )
  bodyGrad.addColorStop(0, `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},1)`)
  bodyGrad.addColorStop(1, color)
  ctx.beginPath()
  ctx.arc(px, py, effectiveR, 0, Math.PI * 2)
  ctx.fillStyle = bodyGrad
  ctx.fill()

  // Crescent shadow
  ctx.beginPath()
  ctx.arc(px + effectiveR * 0.25 * direction, py + effectiveR * 0.15, effectiveR * 0.85, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.globalCompositeOperation = 'source-atop'
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  // Trail
  const trailLen = 8
  for (let t = 1; t <= trailLen; t++) {
    const ta = angle - t * 0.04 * direction
    const tx = cx + orbitR * Math.cos(ta)
    const ty = cy + orbitR * Math.sin(ta) * cosI
    const alpha = 0.15 * (1 - t / trailLen)
    ctx.beginPath()
    ctx.arc(tx, ty, effectiveR * (1 - t / trailLen * 0.5), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
    ctx.fill()
  }
}

// ─── Orbit rings (3D ellipses) ───────────────────────────
function drawOrbits(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radii: number[],
  inclinations: number[],
) {
  ctx.setLineDash([4, 6])
  ctx.lineWidth = 0.7
  for (let i = 0; i < radii.length; i++) {
    const rX = radii[i]
    const rY = rX * Math.abs(Math.cos(inclinations[i]))
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.ellipse(cx, cy, rX, rY, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.setLineDash([])
}

// ─── Center text ─────────────────────────────────────────
const HIDDEN = '••••'

function drawCenter(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerR: number,
  totalIncome: number,
  totalExpenses: number,
  hideIncome = false,
) {
  // Dark bg circle
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR)
  grad.addColorStop(0, '#0f1225')
  grad.addColorStop(1, '#080b18')
  ctx.beginPath()
  ctx.arc(cx, cy, innerR - 2, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Subtle border
  ctx.beginPath()
  ctx.arc(cx, cy, innerR - 2, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Labels
  ctx.textAlign = 'center'

  ctx.font = 'bold 9px system-ui, sans-serif'
  ctx.fillStyle = '#22c55e'
  ctx.fillText(DASHBOARD.entrate.toUpperCase(), cx, cy - 22)

  ctx.font = 'bold 14px system-ui, sans-serif'
  ctx.fillStyle = '#e8eaf6'
  ctx.fillText(hideIncome ? HIDDEN : formatEuro(totalIncome), cx, cy - 8)

  ctx.font = 'bold 9px system-ui, sans-serif'
  ctx.fillStyle = '#ef4444'
  ctx.fillText(DASHBOARD.uscite.toUpperCase(), cx, cy + 8)

  ctx.font = 'bold 14px system-ui, sans-serif'
  ctx.fillStyle = '#e8eaf6'
  ctx.fillText(formatEuro(totalExpenses), cx, cy + 23)
}

// ─── Component ───────────────────────────────────────────
function SpaceDonutChart({ slices, totalIncome, totalExpenses, size = 320, hideIncome = false, onCategoryClick, savingsGoal = 0, missionSaved = 0 }: SpaceDonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animRef = useRef<number>(0)
  const [tappedSlice, setTappedSlice] = useState<SliceData | null>(null)
  const [legendExpanded, setLegendExpanded] = useState(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = size
    const H = size
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    if (starsRef.current.length === 0) {
      starsRef.current = createStars(W, H, 80)
    }

    const cx = W / 2
    const cy = H / 2
    const scale = W / 320
    const outerR = 84 * scale
    const innerR = 60 * scale

    // Planet orbit config — keep planets inside canvas, prevent inter-orbit overlap
    // Cap planets to top 8 by amount
    const PLANET_LIMIT = 8
    const planetSlices = slices.length > PLANET_LIMIT
      ? [...slices].sort((a, b) => b.amount - a.amount).slice(0, PLANET_LIMIT)
      : slices

    const orbitBase = outerR + 12
    const orbitStep = 10
    const orbitRadii = planetSlices.map((_, i) => orbitBase + i * orbitStep)
    // 3D inclinations — strong tilts so orbits cross through the donut
    const TILT_BASE = [0.78, -0.65, 0.92, -0.72, 0.58, -0.85, 0.68, -0.55]
    const inclinations = planetSlices.map((_, i) => TILT_BASE[i % TILT_BASE.length])
    // Slower speeds + larger step between planets → reduces convergence over time
    const planetSpeeds = planetSlices.map((_, i) => (i % 2 === 0 ? 1 : -1) * (0.15 + i * 0.07))
    const maxPercent = Math.max(...planetSlices.map((s) => s.percent))
    const minPercent = Math.min(...planetSlices.map((s) => s.percent))
    const planetRadius = (pct: number) => {
      if (maxPercent === minPercent) return 7
      return 4 + ((pct - minPercent) / (maxPercent - minPercent)) * 6
    }

    const c = ctx // narrowed non-null reference
    let startTime: number | null = null

    function frame(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000

      c.clearRect(0, 0, W, H)

      // Background
      c.fillStyle = '#080b18'
      c.fillRect(0, 0, W, H)

      // Stars
      drawStars(c, starsRef.current, elapsed)

      // Orbit rings (3D ellipses)
      drawOrbits(c, cx, cy, orbitRadii, inclinations)

      // Compute planet states with Z depth
      const planetStates = planetSlices.map((slice, i) => {
        const baseAngle = -Math.PI / 2 + (i * Math.PI * 2) / planetSlices.length
        const angle = baseAngle + elapsed * planetSpeeds[i]
        const dir = planetSpeeds[i] >= 0 ? 1 : -1
        const z = orbitRadii[i] * Math.sin(angle) * Math.sin(inclinations[i])
        return { slice, i, angle, dir, z }
      })

      // Planets behind the donut (z < 0)
      planetStates
        .filter(s => s.z < 0)
        .sort((a, b) => a.z - b.z)
        .forEach(({ slice, i, angle, dir }) =>
          drawPlanet(c, cx, cy, orbitRadii[i], angle, inclinations[i], planetRadius(slice.percent), slice.color, dir)
        )

      // Donut
      drawDonut(c, cx, cy, outerR, innerR, slices, elapsed)

      // Savings goal flag
      if (savingsGoal > 0) {
        drawSavingsGoalFlag(c, cx, cy, outerR, totalIncome, totalIncome - totalExpenses + missionSaved, savingsGoal, elapsed)
      }

      // Planets in front of the donut (z >= 0)
      planetStates
        .filter(s => s.z >= 0)
        .sort((a, b) => a.z - b.z)
        .forEach(({ slice, i, angle, dir }) =>
          drawPlanet(c, cx, cy, orbitRadii[i], angle, inclinations[i], planetRadius(slice.percent), slice.color, dir)
        )

      // Center text (always on top)
      drawCenter(c, cx, cy, innerR, totalIncome, totalExpenses, hideIncome)

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(animRef.current)
  }, [slices, totalIncome, totalExpenses, size, hideIncome, savingsGoal, missionSaved])

  useEffect(() => {
    const cleanup = draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      cleanup?.()
    }
  }, [draw])

  // ─── Canvas hit test ──────────────────────────────────
  function hitTestCanvas(x: number, y: number, toggle = false) {
    if (slices.length === 0) return
    const scale = size / 320
    const outerR = 100 * scale
    const innerR = 58 * scale
    const cx = size / 2
    const cy = size / 2
    const dx = x - cx
    const dy = y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < innerR - 8 || dist > outerR + 16) {
      setTappedSlice(null)
      return
    }
    let angle = Math.atan2(dy, dx) + Math.PI / 2
    if (angle < 0) angle += Math.PI * 2
    let cumAngle = 0
    for (const slice of slices) {
      const sweep = (slice.percent / 100) * Math.PI * 2
      if (angle <= cumAngle + sweep) {
        if (toggle) {
          setTappedSlice((prev) =>
            prev?.canonicalKey === slice.canonicalKey && prev?.category === slice.category ? null : slice
          )
        } else {
          // drag mode: always set (no toggle)
          setTappedSlice(slice)
        }
        return
      }
      cumAngle += sweep
    }
    setTappedSlice(null)
  }

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressActiveRef = useRef(false)
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null)

  // ─── Vibrazione al cambio fetta ───────────────────────────────────
  useEffect(() => {
    if (tappedSlice) haptic(8)
  }, [tappedSlice])

  // ─── Native touch events — long press per attivare, scroll libero ────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || slices.length === 0) return

    function getXY(touch: Touch): { x: number; y: number } {
      const rect = canvas!.getBoundingClientRect()
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }

    function isOnDonut(x: number, y: number): boolean {
      const scale = size / 320
      const outerR = 100 * scale
      const innerR = 58 * scale
      const cx = size / 2; const cy = size / 2
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      return dist >= innerR - 8 && dist <= outerR + 16
    }

    function clearLongPress() {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return
      const { x, y } = getXY(e.touches[0])
      longPressActiveRef.current = false
      touchStartPosRef.current = { x, y }
      clearLongPress()
      if (!isOnDonut(x, y)) return
      longPressTimerRef.current = setTimeout(() => {
        longPressActiveRef.current = true
        haptic(20)
        hitTestCanvas(x, y, true)
      }, 400)
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 1) return
      const { x, y } = getXY(e.touches[0])
      const start = touchStartPosRef.current
      // Se si sposta > 10px prima del long press, annulla (è uno scroll)
      if (!longPressActiveRef.current && start) {
        const moved = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2)
        if (moved > 10) clearLongPress()
        return
      }
      // Long press attivo: blocca scroll e aggiorna fetta
      e.preventDefault()
      hitTestCanvas(x, y, false)
    }

    function onTouchEnd() {
      clearLongPress()
      longPressActiveRef.current = false
      touchStartPosRef.current = null
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('touchcancel', onTouchEnd)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('touchcancel', onTouchEnd)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slices, size])

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Canvas con tooltip overlay */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          className="rounded-xl"
          style={{ width: size, height: size, cursor: slices.length > 0 ? 'pointer' : 'default', touchAction: 'auto' }}
          onClick={(e: React.MouseEvent<HTMLCanvasElement>) => {
            const rect = canvasRef.current!.getBoundingClientRect()
            hitTestCanvas(e.clientX - rect.left, e.clientY - rect.top, true)
          }}
        />

        {/* Hint tocca la torta — visibile solo finché l'utente non ha mai tappato */}
        {slices.length > 0 && !tappedSlice && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              letterSpacing: '0.03em',
            }}
          >
            👆 tocca una fetta
          </div>
        )}

        {/* Tooltip fetta selezionata */}
        {tappedSlice && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(8,11,24,0.92)',
              border: `1px solid ${tappedSlice.color}`,
              borderRadius: '12px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              minWidth: '160px',
              maxWidth: `${size - 24}px`,
              boxShadow: `0 0 16px ${tappedSlice.color}44`,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: tappedSlice.color, flexShrink: 0, boxShadow: `0 0 6px ${tappedSlice.color}` }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: '#e8eaf6', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tappedSlice.category}
              </div>
              <div style={{ color: tappedSlice.color, fontSize: '12px', marginTop: '1px' }}>
                {formatEuro(tappedSlice.amount)} · {tappedSlice.percent.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="flex-1 space-y-1 w-full">
        {(['entrata', 'uscita'] as const).map((group) => {
          const groupSlices = slices.filter((s) => s.type === group)
          if (groupSlices.length === 0) return null
          const showAccordion = group === 'uscita' && groupSlices.length > LEGEND_LIMIT
          const displaySlices = showAccordion && !legendExpanded
            ? groupSlices.slice(0, LEGEND_LIMIT)
            : groupSlices
          return (
            <div key={group}>
              <h3
                className="text-xs font-semibold uppercase tracking-wide mb-1 mt-2"
                style={{ color: group === 'entrata' ? '#22c55e' : '#ef4444' }}
              >
                {group === 'entrata' ? DASHBOARD.entrate : DASHBOARD.uscite}
              </h3>
              {displaySlices.map((s) => (
                <div
                  key={s.canonicalKey || s.category}
                  className="flex items-center gap-3 py-1"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: tappedSlice?.canonicalKey === s.canonicalKey && tappedSlice?.category === s.category
                      ? `${s.color}14` : 'transparent',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <MiniPlanet color={s.color} size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {onCategoryClick && s.canonicalKey ? (
                        <button
                          className="block text-sm font-medium truncate text-left"
                          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                          onClick={() => onCategoryClick(s.canonicalKey)}
                        >
                          {s.category} ›
                        </button>
                      ) : (
                        <span className="block text-sm font-medium truncate" style={{ color: 'var(--text-primary)', minWidth: 0 }}>
                          {s.category}
                        </span>
                      )}
                      {s.importantRatio != null && s.importantRatio > 0 && (
                        <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700, background: 'rgba(245,158,11,0.15)', borderRadius: '4px', padding: '1px 5px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          ⭐{s.importantRatio < 1 ? ` ${Math.round(s.importantRatio * 100)}%` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatEuro(s.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0" style={{ minWidth: '110px' }}>
                    <span className="text-sm font-bold tabular-nums" style={{ color: s.color }}>
                      {s.percent.toFixed(1)}%
                    </span>
                    {s.type === 'uscita' && s.canonicalKey && (() => {
                      const planet = getRandomRevealedPlanet()
                      if (!planet) return null
                      return (
                        <span className="text-[10px] text-right" style={{ color: 'var(--text-muted)', opacity: 0.8, lineHeight: 1.3 }}>
                          🪐 {planet.alias} · {planet.source}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              ))}
              {showAccordion && (
                <button
                  onClick={() => setLegendExpanded((v) => !v)}
                  className="w-full py-1.5 text-xs font-medium transition"
                  style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {legendExpanded ? DASHBOARD.legendaNascondi : DASHBOARD.legendaMostraTutte(groupSlices.length)}
                </button>
              )}
            </div>
          )
        })}
        {savingsGoal > 0 && totalIncome > 0 && (() => {
          const actualSavings = totalIncome - totalExpenses
          const met = actualSavings >= savingsGoal
          const flagColor = met ? '#00aaff' : '#ef4444'
          return (
            <div className="flex items-center gap-3 py-1 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
              <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <line x1="2" y1="1" x2="2" y2="15" stroke={flagColor} strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="2" y="1" width="10" height="7" rx="1" fill={flagColor} opacity="0.9"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium" style={{ color: flagColor }}>
                  {DASHBOARD.obiettivoRisparmio}
                </span>
                <span className="text-xs" style={{ color: flagColor }}>
                  {formatEuro(actualSavings)} / {formatEuro(savingsGoal)}
                </span>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default SpaceDonutChart
