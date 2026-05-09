/**
 * ReceiptScanner — Scanner OCR di scontrini fiscali italiani.
 *
 * Funzionalità:
 *  - Fotocamera con barre guida verticali per allineamento scontrino
 *  - Upload/scatto di più foto con merge OCR automatico
 *  - Risultati parziali visibili in tempo reale durante l'analisi
 *  - Tabella completamente editabile: modifica, elimina, aggiungi righe
 *  - Barra progresso somma → totale; badge "Approvato" al raggiungimento
 *  - Categoria unica selezionabile per tutti gli articoli importati
 */

import { useReducer, useRef, useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js'
import { processImage, parseReceiptText, type ReceiptItem } from '../shared/receiptUtils'
import { addTransaction, generateId, findMatchingProduct, upsertProductFromReceipt } from '../shared/storage'
import type { ProductEntry } from '../shared/types'
import { OCR, getCanonicalCategories } from '../shared/labels'
import { getCategoryIcon } from '../shared/categoryIcons'
import { useToast } from '../shared/ToastContext'

import ReceiptTable from './ReceiptTable'
import ReceiptProgress from './ReceiptProgress'

// ─── Stato con useReducer ─────────────────────────────────

type Fase = 'input' | 'camera' | 'elaborazione' | 'risultati'

interface ScanState {
  fase: Fase
  foto: File[]
  progress: number
  fotoCorrente: number
  articoli: ReceiptItem[]
  totale: number | null
  totaleValido: boolean
  categoriaSelezionata: string
  descrizione: string
  errore: string | null
}

type ScanAction =
  | { type: 'AGGIUNGI_FOTO'; files: File[] }
  | { type: 'RIMUOVI_FOTO'; index: number }
  | { type: 'APRI_CAMERA' }
  | { type: 'CHIUDI_CAMERA' }
  | { type: 'AVVIA_ELABORAZIONE' }
  | { type: 'AGGIORNA_PROGRESS'; progress: number; fotoCorrente: number }
  | { type: 'AGGIORNA_PARZIALE'; articoli: ReceiptItem[]; totale: number | null; totaleValido: boolean }
  | { type: 'SET_RISULTATI'; articoli: ReceiptItem[]; totale: number | null; totaleValido: boolean }
  | { type: 'SET_ERRORE'; errore: string }
  | { type: 'MODIFICA_NOME'; id: string; valore: string }
  | { type: 'MODIFICA_PREZZO'; id: string; valore: string }
  | { type: 'MODIFICA_SCONTO_IMPORTO'; id: string; valore: string }
  | { type: 'MODIFICA_SCONTO_TIPO'; id: string; valore: string }
  | { type: 'RIMUOVI_ARTICOLO'; id: string }
  | { type: 'SPOSTA_ARTICOLO'; fromIndex: number; toIndex: number }
  | { type: 'AGGIUNGI_ARTICOLO_MANUALE' }
  | { type: 'SET_CATEGORIA'; categoria: string }
  | { type: 'MODIFICA_TOTALE'; valore: string }
  | { type: 'SET_DESCRIZIONE'; descrizione: string }
  | { type: 'RESET' }

const STATO_INIZIALE: ScanState = {
  fase: 'input',
  foto: [],
  progress: 0,
  fotoCorrente: 0,
  articoli: [],
  totale: null,
  totaleValido: false,
  categoriaSelezionata: 'Spesa',
  descrizione: 'Scontrino',
  errore: null,
}

function scanReducer(state: ScanState, action: ScanAction): ScanState {
  switch (action.type) {
    case 'AGGIUNGI_FOTO':
      return { ...state, foto: [...state.foto, ...action.files], errore: null }

    case 'RIMUOVI_FOTO':
      return { ...state, foto: state.foto.filter((_, i) => i !== action.index) }

    case 'APRI_CAMERA':
      return { ...state, fase: 'camera' }

    case 'CHIUDI_CAMERA':
      return { ...state, fase: 'input' }

    case 'AVVIA_ELABORAZIONE':
      return { ...state, fase: 'elaborazione', progress: 0, fotoCorrente: 0, articoli: [], totale: null, totaleValido: false, errore: null }

    case 'AGGIORNA_PROGRESS':
      return { ...state, progress: action.progress, fotoCorrente: action.fotoCorrente }

    case 'AGGIORNA_PARZIALE':
      return { ...state, articoli: action.articoli, totale: action.totale, totaleValido: action.totaleValido }

    case 'SET_RISULTATI':
      return {
        ...state,
        fase: 'risultati',
        articoli: action.articoli,
        totale: action.totale,
        totaleValido: action.totaleValido,
      }

    case 'SET_ERRORE':
      return { ...state, fase: 'input', errore: action.errore }

    case 'MODIFICA_NOME':
      return {
        ...state,
        articoli: state.articoli.map((a) =>
          a.id === action.id ? { ...a, name: action.valore } : a,
        ),
      }

    case 'MODIFICA_PREZZO': {
      const price = parseFloat(action.valore.replace(',', '.'))
      return {
        ...state,
        articoli: state.articoli.map((a) =>
          // L'utente ha verificato il prezzo → azzera l'incertezza
          a.id === action.id ? { ...a, price: isNaN(price) ? a.price : price, confidence: 'ok' } : a,
        ),
      }
    }

    case 'RIMUOVI_ARTICOLO':
      return { ...state, articoli: state.articoli.filter((a) => a.id !== action.id) }

    case 'SPOSTA_ARTICOLO': {
      if (action.fromIndex === action.toIndex) return state
      const next = [...state.articoli]
      const [moved] = next.splice(action.fromIndex, 1)
      if (!moved) return state
      next.splice(action.toIndex, 0, moved)
      return { ...state, articoli: next }
    }

    case 'AGGIUNGI_ARTICOLO_MANUALE':
      return { ...state, articoli: [...state.articoli, { id: crypto.randomUUID(), name: '', price: 0 }] }

    case 'MODIFICA_TOTALE': {
      const newTotale = parseFloat(action.valore.replace(',', '.'))
      if (isNaN(newTotale) || newTotale <= 0) return state
      return { ...state, totale: newTotale }
    }

    case 'SET_CATEGORIA':
      return { ...state, categoriaSelezionata: action.categoria }

    case 'MODIFICA_SCONTO_IMPORTO': {
      const amount = parseFloat(action.valore.replace(',', '.'))
      return {
        ...state,
        articoli: state.articoli.map((a) => {
          if (a.id !== action.id) return a
          if (isNaN(amount)) return { ...a, discountAmount: undefined }
          // Calcola il grossPrice dal prezzo e sconto attuali
          const currentGrossPrice = a.grossPrice ?? (a.price + (a.discountAmount ?? 0))
          // Calcola il nuovo prezzo netto: lordo - nuovo sconto
          const newPrice = parseFloat((currentGrossPrice - amount).toFixed(2))
          return { ...a, discountAmount: amount, price: newPrice, grossPrice: currentGrossPrice }
        }),
      }
    }

    case 'MODIFICA_SCONTO_TIPO':
      return {
        ...state,
        articoli: state.articoli.map((a) =>
          a.id === action.id ? { ...a, discountType: action.valore || undefined } : a,
        ),
      }

    case 'SET_DESCRIZIONE':
      return { ...state, descrizione: action.descrizione }

    case 'RESET':
      return STATO_INIZIALE

    default:
      return state
  }
}

// ─── Helpers ────────────────────────────────────────────

function formatEuro(n: number) {
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

// ─── Componente principale ───────────────────────────────

interface ReceiptScannerProps {
  onClose: () => void
  /** Chiamata dopo che le transazioni sono state create */
  onDone: () => void
}

function ReceiptScanner({ onClose, onDone }: ReceiptScannerProps) {
  const { showToast } = useToast()
  const [state, dispatch] = useReducer(scanReducer, STATO_INIZIALE)
  const [fotoLightbox, setFotoLightbox] = useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false)
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null)
  const captureLockRef = useRef(false)
  // Match prodotti nel catalogo per ogni articolo (calcolati quando si entra in fase 'risultati')
  const [catalogMatches, setCatalogMatches] = useState<Map<string, ProductEntry>>(new Map())
  // Cache URL oggetti per file: creazione sincrona → zero render extra
  const urlCacheRef = useRef<Map<File, string>>(new Map())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const lightboxTouchStartXRef = useRef<number | null>(null)
  const lightboxTouchStartYRef = useRef<number | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const categorieUscita = getCanonicalCategories('uscita')

  // ── Somma corrente degli articoli ──────────────────
  const sommaArticoli = parseFloat(
    state.articoli.reduce((acc, a) => acc + a.price, 0).toFixed(2),
  )
  const progressoPerc = state.totale ? Math.min(100, Math.round((sommaArticoli / state.totale) * 100)) : 0
  const approvatoScontrino = state.totale !== null && Math.abs(sommaArticoli - state.totale) <= 0.02

  // Articoli con prezzo incerto (segnalati dal parser OCR)
  const uncertainCount = state.articoli.filter((a) => a.confidence === 'uncertain').length

  // ── Setup camera quando la fase diventa 'camera' ──────
  useEffect(() => {
    if (state.fase !== 'camera') return
    navigator.mediaDevices?.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
    }).then(stream => {
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {/* autoplay policy */})
      }
    }).catch(() => {
      dispatch({ type: 'CHIUDI_CAMERA' })
    })
  }, [state.fase])

  // ── Cleanup stream all'unmount ─────────────────────
  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  // ── Match catalogo prodotti quando entro in risultati ──
  useEffect(() => {
    if (state.fase !== 'risultati') return
    const matches = new Map<string, ProductEntry>()
    for (const item of state.articoli) {
      const match = findMatchingProduct(item.name)
      if (match) matches.set(item.id, match)
    }
    setCatalogMatches(matches)
  }, [state.fase, state.articoli])

  // ── Revoca URL per file rimossi ───────────────────
  useEffect(() => {
    const cache = urlCacheRef.current
    for (const [file, url] of cache) {
      if (!state.foto.includes(file)) {
        URL.revokeObjectURL(url)
        cache.delete(file)
      }
    }
  }, [state.foto])

  /** Restituisce URL stabile per una foto (la crea solo la prima volta) */
  function getFotoUrl(file: File): string {
    if (!urlCacheRef.current.has(file)) {
      urlCacheRef.current.set(file, URL.createObjectURL(file))
    }
    return urlCacheRef.current.get(file)!
  }

  // ── Apri fotocamera (o fallback al file picker) ──────
  function aprireCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      fileInputRef.current?.click()
      return
    }
    dispatch({ type: 'APRI_CAMERA' })
  }

  function chiudiCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    captureLockRef.current = false
    setIsCapturingPhoto(false)
    dispatch({ type: 'CHIUDI_CAMERA' })
  }

  function scattaFoto() {
    if (captureLockRef.current) return
    captureLockRef.current = true
    setIsCapturingPhoto(true)

    const video = videoRef.current
    if (!video) {
      captureLockRef.current = false
      setIsCapturingPhoto(false)
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      captureLockRef.current = false
      setIsCapturingPhoto(false)
      return
    }

    ctx.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) {
        captureLockRef.current = false
        setIsCapturingPhoto(false)
        return
      }

      const file = new File([blob], `scontrino-${Date.now()}.jpg`, { type: 'image/jpeg' })
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      dispatch({ type: 'AGGIUNGI_FOTO', files: [file] })
      dispatch({ type: 'CHIUDI_CAMERA' })
      captureLockRef.current = false
      setIsCapturingPhoto(false)
    }, 'image/jpeg', 0.92)
  }

  // ── Gestione input file ──────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) dispatch({ type: 'AGGIUNGI_FOTO', files })
    e.target.value = '' // Permette di selezionare di nuovo lo stesso file
  }

  // Ref per passare l'indice foto corrente al logger (stabile durante tutto l'OCR)
  const ocrPhotoRef = useRef({ index: 0, total: 1 })

  // ── Avvia OCR su tutte le foto ───────────────────────
  async function handleAnalizza() {
    if (state.foto.length === 0) return
    dispatch({ type: 'AVVIA_ELABORAZIONE' })

    try {
      let testoCompleto = ''
      const n = state.foto.length
      ocrPhotoRef.current = { index: 0, total: n }

      let isFallback = false
      const worker = await createWorker('ita+eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text' && !isFallback) {
            const { index, total } = ocrPhotoRef.current
            const overall = Math.round(((index + m.progress) / total) * 100)
            dispatch({ type: 'AGGIORNA_PROGRESS', progress: overall, fotoCorrente: index })
          }
        },
      })

      for (let i = 0; i < n; i++) {
        ocrPhotoRef.current = { index: i, total: n }
        isFallback = false

        const { data: { text } } = await worker.recognize(state.foto[i])
        let textBest = text

        // Fallback: seconda passata solo se la prima e chiaramente incompleta.
        const firstParse = parseReceiptText(text)
        const shouldFallback = firstParse.items.length < 4 || firstParse.total === null
        if (shouldFallback) {
          isFallback = true
          const processed = await processImage(state.foto[i])
          const { data: { text: textProcessed } } = await worker.recognize(processed)

          const secondParse = parseReceiptText(textProcessed)
          const firstScore = firstParse.items.length + (firstParse.total !== null ? 2 : 0) + (firstParse.isValid ? 4 : 0)
          const secondScore = secondParse.items.length + (secondParse.total !== null ? 2 : 0) + (secondParse.isValid ? 4 : 0)

          // Evita merge dei testi: sceglie solo la passata migliore per non duplicare righe.
          if (secondScore > firstScore) {
            textBest = textProcessed
          }
        }

        // Concatena il miglior testo per foto
        testoCompleto += '\n' + textBest

        const p = Math.round(((i + 1) / n) * 100)
        dispatch({ type: 'AGGIORNA_PROGRESS', progress: p, fotoCorrente: i })
      }

      await worker.terminate()

      const { items, total, isValid } = parseReceiptText(testoCompleto)
      dispatch({ type: 'SET_RISULTATI', articoli: items, totale: total, totaleValido: isValid })
    } catch {
      dispatch({ type: 'SET_ERRORE', errore: OCR.errore })
    }
  }

  // ── Crea un'unica transazione con il totale ──────────
  function handleCreaTotale() {
    const detailItems = state.articoli
      .map((item) => ({
        name: item.name.trim(),
        price: item.price,
        grossPrice: item.grossPrice,
        discountAmount: item.discountAmount,
        discountType: item.discountType,
      }))
      .filter((item) => item.name.length > 0 && Number.isFinite(item.price))

    addTransaction({
      id: generateId(),
      type: 'uscita',
      description: state.descrizione.trim() || 'Scontrino',
      amount: state.totale ?? sommaArticoli,
      date: today,
      category: state.categoriaSelezionata,
      recurring: false,
      recurringMonths: 0,
      isReceipt: true,
      receiptItems: detailItems,
    })

    // Aggiorna catalogo prodotti per suggerimenti OCR futuri
    for (const item of detailItems) {
      upsertProductFromReceipt(item.name, item.price, today, state.categoriaSelezionata, {
        grossPrice: item.grossPrice,
        discountAmount: item.discountAmount,
        discountType: item.discountType,
      })
    }

    showToast('✓ Movimento inserito', 'success', 2500)
    onDone()
    onClose()
  }

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────
  // LIGHTBOX foto
  // ─────────────────────────────────────────────────────
  if (fotoLightbox !== null && state.foto[fotoLightbox]) {
    const fotoCount = state.foto.length
    const goToPrevFoto = () => setFotoLightbox((prev) => {
      if (prev === null || fotoCount === 0) return prev
      return (prev - 1 + fotoCount) % fotoCount
    })
    const goToNextFoto = () => setFotoLightbox((prev) => {
      if (prev === null || fotoCount === 0) return prev
      return (prev + 1) % fotoCount
    })
    const file = state.foto[fotoLightbox]
    const objectUrl = getFotoUrl(file)
    return (
      <div
        onClick={() => setFotoLightbox(null)}
        onTouchStart={(e) => {
          const touch = e.touches[0]
          if (!touch) return
          lightboxTouchStartXRef.current = touch.clientX
          lightboxTouchStartYRef.current = touch.clientY
        }}
        onTouchEnd={(e) => {
          const startX = lightboxTouchStartXRef.current
          const startY = lightboxTouchStartYRef.current
          lightboxTouchStartXRef.current = null
          lightboxTouchStartYRef.current = null
          if (startX === null || startY === null) return
          const touch = e.changedTouches[0]
          if (!touch) return
          const deltaX = touch.clientX - startX
          const deltaY = touch.clientY - startY
          const minSwipeX = 50
          const maxSwipeY = 80
          if (Math.abs(deltaY) > maxSwipeY) return
          if (deltaX >= minSwipeX) {
            goToPrevFoto()
          } else if (deltaX <= -minSwipeX) {
            goToNextFoto()
          }
        }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9300,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Immagine */}
        <img
          src={objectUrl}
          alt={`Foto ${fotoLightbox + 1}`}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '100%', maxHeight: 'calc(100dvh - 80px)', objectFit: 'contain', borderRadius: '8px' }}
        />
        {fotoCount > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ marginTop: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 600 }}
          >
            {fotoLightbox + 1} / {fotoCount} · scorri per cambiare foto
          </div>
        )}
        {/* Toolbar */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <a
            href={objectUrl}
            download={file.name || `scontrino-${fotoLightbox + 1}.jpg`}
            style={{
              padding: '10px 24px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}
          >
            ⬇ Scarica
          </a>
          <button
            onClick={() => setFotoLightbox(null)}
            style={{
              padding: '10px 24px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            ✕ Chiudi
          </button>
        </div>
      </div>
    )
  }

  // ── FASE: CAMERA ─────────────────────────────────
  if (state.fase === 'camera') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9200, background: '#000', display: 'flex', flexDirection: 'column' }}>

        {/* Live preview + overlay guida */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Overlay con barre verticali e zone scure */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', pointerEvents: 'none' }}>
            <div style={{ flex: '0 0 14%', background: 'rgba(0,0,0,0.52)' }} />
            <div style={{ width: '2px', flexShrink: 0, background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 10px rgba(255,255,255,0.7)' }} />
            {/* Centro: area scontrino con angolini */}
            <div style={{ flex: 1, position: 'relative' }}>
              {([{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }] as const).map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', ...pos, width: '22px', height: '22px',
                  borderTop: ('top' in pos) ? '3px solid #fff' : 'none',
                  borderBottom: ('bottom' in pos) ? '3px solid #fff' : 'none',
                  borderLeft: ('left' in pos) ? '3px solid #fff' : 'none',
                  borderRight: ('right' in pos) ? '3px solid #fff' : 'none',
                }} />
              ))}
            </div>
            <div style={{ width: '2px', flexShrink: 0, background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 10px rgba(255,255,255,0.7)' }} />
            <div style={{ flex: '0 0 14%', background: 'rgba(0,0,0,0.52)' }} />
          </div>

          {/* Testo guida */}
          <div style={{
            position: 'absolute',
            top: 'max(16px, env(safe-area-inset-top, 16px))',
            left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)', borderRadius: '20px',
            padding: '6px 18px', color: '#fff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {OCR.guidaAllineamento}
          </div>
        </div>

        {/* Controlli fotocamera */}
        <div style={{
          background: '#111', padding: '20px 40px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={chiudiCamera}
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 600, padding: '10px 20px', borderRadius: '12px' }}>
            {OCR.chiudiCamera}
          </button>
          {/* Pulsante scatto */}
          <button
            onClick={scattaFoto}
            disabled={isCapturingPhoto}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: isCapturingPhoto ? 'rgba(255,255,255,0.6)' : '#fff',
              border: '5px solid rgba(255,255,255,0.35)',
              cursor: isCapturingPhoto ? 'wait' : 'pointer',
              outline: 'none',
              boxShadow: '0 0 0 4px rgba(255,255,255,0.2)',
              opacity: isCapturingPhoto ? 0.75 : 1,
              position: 'relative',
            }}
            aria-label={OCR.scatta}
            aria-busy={isCapturingPhoto}
          >
            {isCapturingPhoto && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#111',
                }}
              >
                ...
              </span>
            )}
          </button>
          <div style={{ width: '60px' }} />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9100,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: '520px',
          maxHeight: '90dvh', overflowY: 'auto',
          borderRadius: '22px',
          backgroundColor: 'var(--bg-card)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Header ──────────────────────────────────── */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {OCR.titolo}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition"
            style={{ color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">

          {/* ── FASE: INPUT ──────────────────────────── */}
          {(state.fase === 'input') && (
            <>
              {/* Griglia anteprime foto */}
              {state.foto.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {state.foto.map((file, idx) => {
                    const objectUrl = getFotoUrl(file)
                    return (
                    <div key={idx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img
                        src={objectUrl}
                        alt={`Foto ${idx + 1}`}
                        onClick={() => setFotoLightbox(idx)}
                        style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }}
                      />
                      {/* Rimuovi */}
                      <button
                        onClick={() => dispatch({ type: 'RIMUOVI_FOTO', index: idx })}
                        style={{
                          position: 'absolute', top: '4px', right: '4px',
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.6)', color: '#fff',
                          border: 'none', cursor: 'pointer', fontSize: '11px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        aria-label={OCR.rimuoviFoto}
                      >✕</button>
                      {/* Scarica */}
                      <a
                        href={objectUrl}
                        download={file.name || `scontrino-${idx + 1}.jpg`}
                        style={{
                          position: 'absolute', bottom: '4px', right: '4px',
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.6)', color: '#fff',
                          fontSize: '11px', textDecoration: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        aria-label="Scarica foto"
                        title="Scarica foto"
                      >⬇</a>
                    </div>
                    )
                  })}
                </div>
              )}

              {/* Input file nascosto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Pulsanti camera + carica file */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={aprireCamera}
                  className="py-3 rounded-xl font-bold text-sm transition active:scale-95"
                  style={{ background: 'var(--accent)', color: 'var(--fab-text)', border: 'none', cursor: 'pointer' }}
                >
                  📷 {OCR.scatta}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3 rounded-xl font-semibold text-sm transition active:scale-95"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  🖼️ {state.foto.length > 0 ? OCR.nuovaFoto : OCR.aggiungi}
                </button>
              </div>

              {/* Errore */}
              {state.errore && (
                <p className="text-sm text-center" style={{ color: '#ef4444' }}>{state.errore}</p>
              )}

              {/* Pulsante analizza */}
              <button
                onClick={handleAnalizza}
                disabled={state.foto.length === 0}
                className="w-full py-3 rounded-xl font-bold text-sm transition active:scale-95"
                style={{
                  background: state.foto.length > 0 ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: state.foto.length > 0 ? 'var(--fab-text)' : 'var(--text-muted)',
                  cursor: state.foto.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: state.foto.length > 0 ? 1 : 0.5,
                }}
              >
                {OCR.analizza}
              </button>
            </>
          )}

          {/* ── FASE: ELABORAZIONE ───────────────────── */}
          {state.fase === 'elaborazione' && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                  {OCR.elaborazione}
                  {state.foto.length > 1 && ` · ${OCR.fotoLabel(state.fotoCorrente + 1, state.foto.length)}`}
                </p>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '3px', background: 'var(--accent)', width: `${state.progress}%`, transition: 'width 0.3s ease' }} />
                </div>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>{state.progress}%</p>
              </div>

              {/* Risultati parziali in tempo reale */}
              {state.articoli.length > 0 && (
                <>
                  <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {OCR.parzialeMentre}
                  </p>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', padding: '8px 12px', background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>{OCR.colonnaArticolo}</span>
                      <span style={{ textAlign: 'right' }}>{OCR.colonnaPrezzo}</span>
                    </div>
                    {state.articoli.map((item, idx) => (
                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', padding: '5px 12px', borderBottom: idx < state.articoli.length - 1 ? '1px solid var(--border)' : 'none', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name || '—'}</span>
                        <span style={{ textAlign: 'right', color: 'var(--text-primary)', fontWeight: 600 }}>{formatEuro(item.price)}</span>
                      </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', padding: '7px 12px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      <span>Totale</span>
                      <span style={{ textAlign: 'right' }}>{formatEuro(sommaArticoli)}</span>
                    </div>
                  </div>
                  {state.totale !== null && (
                    <p className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>
                      {OCR.totaleRilevato}: <strong style={{ color: 'var(--text-primary)' }}>{formatEuro(state.totale)}</strong>
                    </p>
                  )}
                </>
              )}
            </>
          )}

          {/* ── FASE: RISULTATI ──────────────────────── */}
          {state.fase === 'risultati' && (
            <>
              {/* Striscia foto originali */}
              {state.foto.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {state.foto.map((file, idx) => {
                    const objectUrl = getFotoUrl(file)
                    return (
                      <div key={idx} style={{ position: 'relative', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', width: '72px', height: '72px' }}>
                        <img
                          src={objectUrl}
                          alt={`Foto ${idx + 1}`}
                          onClick={() => setFotoLightbox(idx)}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }}
                        />
                        <a
                          href={objectUrl}
                          download={file.name || `scontrino-${idx + 1}.jpg`}
                          style={{
                            position: 'absolute', bottom: '3px', right: '3px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)', color: '#fff',
                            fontSize: '10px', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          title="Scarica foto"
                        >⬇</a>
                      </div>
                    )
                  })}
                </div>
              )}

                <ReceiptProgress
                  sommaArticoli={sommaArticoli}
                  totale={state.totale}
                  approvato={approvatoScontrino}
                  percentuale={progressoPerc}
                  uncertainCount={uncertainCount}
                />

              {/* Tabella articoli editabile */}
              {state.articoli.length > 0 && (
                <ReceiptTable
                  articoli={state.articoli}
                  draggedIndex={draggedIndex}
                  editingDiscountId={editingDiscountId}
                  catalogMatches={catalogMatches}
                  containerRef={tableContainerRef}
                  sommaArticoli={sommaArticoli}
                  totale={state.totale}
                  approvatoScontrino={approvatoScontrino}
                  onDragStart={setDraggedIndex}
                  onDragOver={(_, e) => {
                    e.preventDefault()
                    if (tableContainerRef.current) {
                      const rect = tableContainerRef.current.getBoundingClientRect()
                      const scrollThreshold = 60
                      const scrollSpeed = 5
                      if (e.clientY - rect.top < scrollThreshold) {
                        tableContainerRef.current.scrollTop -= scrollSpeed
                      } else if (rect.bottom - e.clientY < scrollThreshold) {
                        tableContainerRef.current.scrollTop += scrollSpeed
                      }
                    }
                  }}
                  onDrop={(idx) => {
                    if (draggedIndex === null) return
                    dispatch({ type: 'SPOSTA_ARTICOLO', fromIndex: draggedIndex, toIndex: idx })
                    setDraggedIndex(null)
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  onModifyName={(id, value) => dispatch({ type: 'MODIFICA_NOME', id, valore: value })}
                  onModifyPrice={(id, value) => dispatch({ type: 'MODIFICA_PREZZO', id, valore: value })}
                  onModifyDiscountAmount={(id, value) => dispatch({ type: 'MODIFICA_SCONTO_IMPORTO', id, valore: value })}
                  onModifyDiscountType={(id, value) => dispatch({ type: 'MODIFICA_SCONTO_TIPO', id, valore: value })}
                  onEditDiscount={setEditingDiscountId}
                  onCloseEditDiscount={() => setEditingDiscountId(null)}
                  onRemove={(id) => dispatch({ type: 'RIMUOVI_ARTICOLO', id })}
                  onModifyTotale={(value) => dispatch({ type: 'MODIFICA_TOTALE', valore: value })}
                />
              )}

              {/* Aggiungi riga manuale */}
              <button
                onClick={() => dispatch({ type: 'AGGIUNGI_ARTICOLO_MANUALE' })}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                {OCR.aggiungiManuale}
              </button>

              {/* Selezione categoria */}
              {state.articoli.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                    {OCR.categoriaLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categorieUscita.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => dispatch({ type: 'SET_CATEGORIA', categoria: cat })}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition"
                        style={{
                          background: state.categoriaSelezionata === cat
                            ? 'var(--accent)'
                            : 'var(--bg-secondary)',
                          color: state.categoriaSelezionata === cat
                            ? 'var(--fab-text)'
                            : 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <span>{getCategoryIcon(cat)}</span>
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Campo descrizione personalizzata */}
              {state.articoli.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                    Nome Transazione
                  </p>
                  <input
                    type="text"
                    value={state.descrizione}
                    onChange={(e) => dispatch({ type: 'SET_DESCRIZIONE', descrizione: e.target.value })}
                    placeholder="es: Scontrino gigante 2, Spesa Carrefour..."
                    style={{
                      width: '100%',
                      fontSize: '13px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      outline: 'none',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              )}

              {/* Pulsanti azione */}
              {state.articoli.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleCreaTotale}
                    className="py-3 rounded-xl text-sm font-bold transition active:scale-95"
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--fab-text)',
                    }}
                  >
                    {OCR.creaTotale}
                  </button>
                </div>
              )}

              {/* Bottone riprova */}
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="w-full py-2 text-sm transition"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {OCR.tornaIndietro}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default ReceiptScanner
