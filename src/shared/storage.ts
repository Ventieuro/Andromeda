import type { Transaction, AppSettings, ProductEntry, SavingsGoal } from './types'
import { normalizeCategoryKey, getAllPlanets } from './labels'
import type { PlanetRarity } from './labels'

const STORAGE_KEY = 'andromeda-transactions'
const SETTINGS_KEY = 'andromeda-settings'
const CUSTOM_CAT_KEY = 'andromeda-custom-categories'
const CUSTOM_ICONS_KEY = 'andromeda-custom-icons'
const NOTIFICATIONS_KEY = 'andromeda-notifications'
const PRODUCTS_KEY = 'andromeda-products'
const GOALS_KEY = 'andromeda-goals'
const PLANET_LOG_KEY = 'andromeda-planet-log'

const QR_TRANSFER_PREFIX = 'andromeda-xfer-session-'
const QR_TRANSFER_READY_KEY = 'andromeda-xfer-ready-payload'

const INDEXED_DB_NAME = 'andromeda-db'
const INDEXED_DB_VERSION = 1
const INDEXED_DB_STORE = 'kv'

const MANAGED_KEYS = [
  STORAGE_KEY,
  SETTINGS_KEY,
  CUSTOM_CAT_KEY,
  CUSTOM_ICONS_KEY,
  NOTIFICATIONS_KEY,
  PRODUCTS_KEY,
  GOALS_KEY,
] as const

type ManagedKey = (typeof MANAGED_KEYS)[number]

interface KVRecord {
  key: ManagedKey
  value: string
}

const storageCache = new Map<ManagedKey, string | null>()
let storageEngine: 'localStorage' | 'indexeddb' = 'localStorage'
let indexedDbReady = false

function openAndromedaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) {
        db.createObjectStore(INDEXED_DB_STORE, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function idbGet(db: IDBDatabase, key: ManagedKey): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE, 'readonly')
    const store = tx.objectStore(INDEXED_DB_STORE)
    const req = store.get(key)
    req.onsuccess = () => {
      const record = req.result as KVRecord | undefined
      resolve(record?.value ?? null)
    }
    req.onerror = () => reject(req.error)
  })
}

function idbSet(db: IDBDatabase, key: ManagedKey, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE, 'readwrite')
    const store = tx.objectStore(INDEXED_DB_STORE)
    store.put({ key, value } satisfies KVRecord)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function initPersistentStorage(): Promise<void> {
  if (indexedDbReady) return

  if (typeof indexedDB === 'undefined') {
    storageEngine = 'localStorage'
    for (const key of MANAGED_KEYS) {
      storageCache.set(key, localStorage.getItem(key))
    }
    indexedDbReady = true
    return
  }

  try {
    const db = await openAndromedaDb()

    for (const key of MANAGED_KEYS) {
      const fromDb = await idbGet(db, key)
      if (fromDb !== null) {
        storageCache.set(key, fromDb)
        continue
      }

      const fromLocal = localStorage.getItem(key)
      if (fromLocal !== null) {
        await idbSet(db, key, fromLocal)
        localStorage.removeItem(key)
        storageCache.set(key, fromLocal)
      } else {
        storageCache.set(key, null)
      }
    }

    db.close()
    storageEngine = 'indexeddb'
  } catch {
    storageEngine = 'localStorage'
    for (const key of MANAGED_KEYS) {
      storageCache.set(key, localStorage.getItem(key))
    }
  }

  indexedDbReady = true
}

/** Resetta la cache in-memory. Usato nei test per isolare i test tra loro. */
export function clearStorageCache() {
  storageCache.clear()
  indexedDbReady = false
  storageEngine = 'localStorage'
}

/** Cancella tutti i dati utente (transazioni, missioni, prodotti, categorie custom).
 *  Non tocca impostazioni, tema, lingua o PIN. */
export function clearAllUserData() {
  setManagedItem(STORAGE_KEY, '[]')
  setManagedItem(GOALS_KEY, '[]')
  setManagedItem(PRODUCTS_KEY, '[]')
  setManagedItem(CUSTOM_CAT_KEY, '{}')
  setManagedItem(CUSTOM_ICONS_KEY, '{}')
  // rimuovi customizzazioni navicella (prefix andromeda-mc-*)
  const toRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith('andromeda-mc-')) toRemove.push(k)
  }
  for (const k of toRemove) localStorage.removeItem(k)
}

function getManagedItem(key: ManagedKey): string | null {
  if (storageCache.has(key)) return storageCache.get(key) ?? null
  const fallback = localStorage.getItem(key)
  storageCache.set(key, fallback)
  return fallback
}

function setManagedItem(key: ManagedKey, value: string) {
  storageCache.set(key, value)
  if (storageEngine === 'indexeddb' && typeof indexedDB !== 'undefined') {
    void openAndromedaDb()
      .then((db) => idbSet(db, key, value).finally(() => db.close()))
      .catch(() => {
        localStorage.setItem(key, value)
      })
    return
  }
  localStorage.setItem(key, value)
}

function isIsoDateTime(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function normalizeTransaction(tx: Transaction): Transaction {
  const fallbackTs = `${tx.date}T00:00:00.000Z`
  const createdAt = isIsoDateTime(tx.createdAt) ? tx.createdAt : fallbackTs
  const updatedAt = isIsoDateTime(tx.updatedAt) ? tx.updatedAt : createdAt
  return {
    ...tx,
    syncId: typeof tx.syncId === 'string' && tx.syncId ? tx.syncId : tx.id,
    createdAt,
    updatedAt,
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = getManagedItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidTransaction).map(normalizeTransaction)
  } catch {
    return []
  }
}

function isValidTransaction(data: unknown): data is Transaction {
  if (typeof data !== 'object' || data === null) return false
  const t = data as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    (t.syncId === undefined || typeof t.syncId === 'string') &&
    (t.createdAt === undefined || isIsoDateTime(t.createdAt)) &&
    (t.updatedAt === undefined || isIsoDateTime(t.updatedAt)) &&
    (t.type === 'entrata' || t.type === 'uscita') &&
    typeof t.description === 'string' &&
    typeof t.amount === 'number' && t.amount > 0 &&
    typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) &&
    typeof t.recurring === 'boolean' &&
    typeof t.recurringMonths === 'number' &&
    (t.recurringGroupId === undefined || typeof t.recurringGroupId === 'string') &&
    typeof t.category === 'string' &&
    (t.isReceipt === undefined || typeof t.isReceipt === 'boolean') &&
    (t.receiptItems === undefined || isValidReceiptItems(t.receiptItems))
  )
}

function isValidReceiptItems(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false
    const row = item as Record<string, unknown>
    return typeof row.name === 'string' && typeof row.price === 'number' && Number.isFinite(row.price)
  })
}

export function saveTransactions(transactions: Transaction[]) {
  setManagedItem(STORAGE_KEY, JSON.stringify(transactions.map(normalizeTransaction)))
}

/**
 * Migrazione una-tantum: normalizza le categorie dei movimenti esistenti
 * alla chiave canonica italiana (fix per categorie create in lingua diversa).
 */
// Mapping per categorie rinominate tra versioni
const RENAMED_CATEGORIES: Record<string, string> = {
  Quotidiano: 'Spesa',
  Daily: 'Spesa',
  Diario: 'Spesa',
  Abbigliamento: 'Altro',
  Clothing: 'Altro',
  Ropa: 'Altro',
}

export function migrateCategoryKeys() {
  const all = loadTransactions()
  let changed = false
  const migrated = all.map((tx) => {
    // Prima applica eventuali rinominazioni
    const renamed = RENAMED_CATEGORIES[tx.category]
    if (renamed) {
      changed = true
      return { ...tx, category: renamed }
    }
    const canonical = normalizeCategoryKey(tx.category, tx.type)
    if (canonical !== tx.category) {
      changed = true
      return { ...tx, category: canonical }
    }
    return tx
  })
  if (changed) saveTransactions(migrated)
}

export function addTransaction(tx: Transaction) {
  const all = loadTransactions()
  all.push(normalizeTransaction({
    ...tx,
    updatedAt: new Date().toISOString(),
  }))
  saveTransactions(all)
}

export function deleteTransaction(id: string) {
  const all = loadTransactions().filter((t) => t.id !== id)
  saveTransactions(all)
}

export function deleteTransactionsByGroupId(groupId: string) {
  const all = loadTransactions().filter((t) => t.recurringGroupId !== groupId)
  saveTransactions(all)
}

export function updateTransactionsByGroupId(
  groupId: string,
  patch: Pick<Transaction, 'type' | 'description' | 'amount' | 'category' | 'important' | 'recurring' | 'recurringMonths'>,
) {
  const all = loadTransactions().map((t) => {
    if (t.recurringGroupId !== groupId) return t
    return normalizeTransaction({ ...t, ...patch, updatedAt: new Date().toISOString() })
  })
  saveTransactions(all)
}

export function updateImportantByCategory(
  category: string,
  type: Transaction['type'],
  description: string,
  important: boolean,
) {
  const all = loadTransactions().map((t) => {
    if (t.category !== category || t.type !== type || t.description !== description || !t.recurring) return t
    return normalizeTransaction({ ...t, important, updatedAt: new Date().toISOString() })
  })
  saveTransactions(all)
}

export function updateTransaction(updated: Transaction) {
  const all = loadTransactions().map((t) => {
    if (t.id !== updated.id) return t
    return normalizeTransaction({
      ...updated,
      syncId: t.syncId ?? updated.syncId ?? updated.id,
      createdAt: t.createdAt ?? updated.createdAt,
      updatedAt: new Date().toISOString(),
    })
  })
  saveTransactions(all)
}

function toLocalIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getTransactionsInPeriod(
  transactions: Transaction[],
  start: Date,
  end: Date,
): Transaction[] {
  const s = toLocalIso(start)
  const e = toLocalIso(end)
  return transactions.filter((t) => t.date >= s && t.date <= e)
}

export function loadSettings(): AppSettings {
  try {
    const raw = getManagedItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { payDay: 27, userName: '' }
  } catch {
    return { payDay: 27, userName: '' }
  }
}

export function saveSettings(settings: AppSettings) {
  setManagedItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function generateId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// ─── Catalogo Prodotti ───────────────────────────────────

/** Normalizza il nome di un prodotto per il confronto fuzzy */
export function normalizeProductName(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(kg|gr|ml|cl|lt?|pz|nr|x|\d+[\.,]?\d*g?)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Restituisce il punteggio di somiglianza (0-1) tra due nomi normalizzati */
function tokenOverlap(a: string, b: string): number {
  const ta = new Set(a.split(' ').filter((t) => t.length > 1))
  const tb = new Set(b.split(' ').filter((t) => t.length > 1))
  if (ta.size === 0 || tb.size === 0) return 0
  let common = 0
  for (const tok of ta) if (tb.has(tok)) common++
  return common / Math.min(ta.size, tb.size)
}

export function loadProducts(): ProductEntry[] {
  try {
    const raw = getManagedItem(PRODUCTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as ProductEntry[]
  } catch {
    return []
  }
}

export function saveProducts(products: ProductEntry[]) {
  setManagedItem(PRODUCTS_KEY, JSON.stringify(products))
}

// ─── Obiettivi di Risparmio ──────────────────────────────

export function loadGoals(): SavingsGoal[] {
  try {
    const raw = getManagedItem(GOALS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as SavingsGoal[]
  } catch {
    return []
  }
}

export function saveGoals(goals: SavingsGoal[]) {
  setManagedItem(GOALS_KEY, JSON.stringify(goals))
}

export function addGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>): SavingsGoal {
  const now = new Date().toISOString()
  const full: SavingsGoal = { ...goal, id: generateId(), createdAt: now, updatedAt: now }
  saveGoals([...loadGoals(), full])
  return full
}

export function updateGoal(updated: SavingsGoal) {
  const goals = loadGoals().map((g) =>
    g.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : g
  )
  saveGoals(goals)
}

export function deleteGoal(id: string) {
  saveGoals(loadGoals().filter((g) => g.id !== id))
}

/**
 * Cerca un prodotto corrispondente al nome OCR.
 * Restituisce il prodotto se la somiglianza è ≥ 0.6, altrimenti null.
 */
export function findMatchingProduct(name: string): ProductEntry | null {
  const products = loadProducts()
  const norm = normalizeProductName(name)
  let bestMatch: ProductEntry | null = null
  let bestScore = 0.59 // soglia minima

  for (const p of products) {
    // Controlla il nome canonico
    const score = tokenOverlap(norm, normalizeProductName(p.name))
    if (score > bestScore) { bestScore = score; bestMatch = p }
    // Controlla anche gli alias
    for (const alias of p.aliases) {
      const aliasScore = tokenOverlap(norm, normalizeProductName(alias))
      if (aliasScore > bestScore) { bestScore = aliasScore; bestMatch = p }
    }
  }

  return bestMatch
}

/**
 * Aggiunge o aggiorna un prodotto nel catalogo dopo l'importazione di uno scontrino.
 * Se esiste un match fuzzy, aggiunge l'alias e inserisce il nuovo prezzo nella history.
 * Altrimenti crea una nuova voce.
 */
export function upsertProductFromReceipt(
  name: string,
  price: number,
  date: string,
  category?: string,
  meta?: { grossPrice?: number; discountAmount?: number; discountType?: string },
) {
  if (!name.trim() || !Number.isFinite(price) || price <= 0) return
  const products = loadProducts()
  const norm = normalizeProductName(name)
  let found: ProductEntry | undefined

  // Cerca match fuzzy
  let bestScore = 0.59
  for (const p of products) {
    const score = tokenOverlap(norm, normalizeProductName(p.name))
    if (score > bestScore) { bestScore = score; found = p }
    for (const alias of p.aliases) {
      const s = tokenOverlap(norm, normalizeProductName(alias))
      if (s > bestScore) { bestScore = s; found = p }
    }
  }

  if (found) {
    // Aggiorna prodotto esistente
    if (!found.aliases.includes(name) && name !== found.name) {
      found.aliases.push(name)
    }
    found.priceHistory.push({
      price,
      date,
      grossPrice: meta?.grossPrice,
      discountAmount: meta?.discountAmount,
      discountType: meta?.discountType,
    })
    // Mantieni max 50 voci nella history
    if (found.priceHistory.length > 50) {
      found.priceHistory = found.priceHistory.slice(-50)
    }
    found.lastSeen = date
    if (category) found.category = category
    saveProducts(products)
  } else {
    // Crea nuova voce
    const newProduct: ProductEntry = {
      id: generateId(),
      name: name.trim(),
      aliases: [],
      priceHistory: [{
        price,
        date,
        grossPrice: meta?.grossPrice,
        discountAmount: meta?.discountAmount,
        discountType: meta?.discountType,
      }],
      category,
      lastSeen: date,
    }
    products.push(newProduct)
    saveProducts(products)
  }
}

export function deleteProduct(id: string) {
  saveProducts(loadProducts().filter((p) => p.id !== id))
}

export function updateProductName(id: string, newName: string) {
  const products = loadProducts().map((p) =>
    p.id === id ? { ...p, name: newName.trim() } : p,
  )
  saveProducts(products)
}


const PIN_KEY = 'andromeda-pin'
const PIN_SESSION_KEY = 'andromeda-unlocked'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function loadPin(): string | null {
  try {
    const pin = localStorage.getItem(PIN_KEY)
    // Migration: old plain-text PINs are not 64-char hex (SHA-256) → force reset
    if (pin && !/^[0-9a-f]{64}$/.test(pin)) {
      localStorage.removeItem(PIN_KEY)
      return null
    }
    return pin
  } catch {
    return null
  }
}

export async function savePin(pin: string) {
  const hash = await sha256(pin)
  localStorage.setItem(PIN_KEY, hash)
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = loadPin()
  if (!stored) return false
  const hash = await sha256(pin)
  // Constant-time comparison
  if (hash.length !== stored.length) return false
  let result = 0
  for (let i = 0; i < hash.length; i++) {
    result |= hash.charCodeAt(i) ^ stored.charCodeAt(i)
  }
  return result === 0
}

export function isUnlocked(): boolean {
  try {
    const ts = sessionStorage.getItem(PIN_SESSION_KEY)
    if (!ts) return false
    if (Date.now() - Number(ts) > SESSION_TIMEOUT_MS) {
      sessionStorage.removeItem(PIN_SESSION_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function setUnlocked() {
  sessionStorage.setItem(PIN_SESSION_KEY, Date.now().toString())
}

// ─── WebAuthn Biometric ───────────────────────────────────
const BIOMETRIC_KEY = 'andromeda-biometric-credential'

export function isBiometricCredentialSaved(): boolean {
  return !!localStorage.getItem(BIOMETRIC_KEY)
}

export function removeBiometricCredential(): void {
  localStorage.removeItem(BIOMETRIC_KEY)
}

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) return false
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

export async function registerBiometric(): Promise<boolean> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const userId = crypto.getRandomValues(new Uint8Array(16))

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Andromeda', id: window.location.hostname },
        user: { id: userId, name: 'andromeda-user', displayName: 'Andromeda' },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256
          { type: 'public-key', alg: -257 },  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    }) as PublicKeyCredential | null

    if (!credential) return false

    const rawId = new Uint8Array(credential.rawId)
    const credentialId = btoa(String.fromCharCode(...rawId))
    localStorage.setItem(BIOMETRIC_KEY, credentialId)
    return true
  } catch {
    return false
  }
}

export async function verifyBiometric(): Promise<boolean> {
  try {
    const stored = localStorage.getItem(BIOMETRIC_KEY)
    if (!stored) return false

    const binary = atob(stored)
    const credentialId = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      credentialId[i] = binary.charCodeAt(i)
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ type: 'public-key', id: credentialId }],
        userVerification: 'required',
        timeout: 60000,
      },
    })
    return !!assertion
  } catch {
    return false
  }
}

// ─── Categorie Custom ────────────────────────────────────

export interface CustomCategories {
  entrata: string[]
  uscita: string[]
}

export function loadCustomCategories(): CustomCategories {
  try {
    const raw = getManagedItem(CUSTOM_CAT_KEY)
    return raw ? JSON.parse(raw) : { entrata: [], uscita: [] }
  } catch {
    return { entrata: [], uscita: [] }
  }
}

export function saveCustomCategories(cats: CustomCategories) {
  setManagedItem(CUSTOM_CAT_KEY, JSON.stringify(cats))
}

export function addCustomCategory(type: 'entrata' | 'uscita', name: string) {
  const cats = loadCustomCategories()
  const trimmed = name.trim()
  if (!trimmed || cats[type].includes(trimmed)) return
  cats[type].push(trimmed)
  saveCustomCategories(cats)
}

export function deleteCustomCategory(type: 'entrata' | 'uscita', name: string) {
  const cats = loadCustomCategories()
  cats[type] = cats[type].filter((c) => c !== name)
  saveCustomCategories(cats)
}

export function renameCustomCategory(type: 'entrata' | 'uscita', oldName: string, newName: string) {
  const trimmed = newName.trim()
  if (!trimmed || oldName === trimmed) return
  const cats = loadCustomCategories()
  const idx = cats[type].indexOf(oldName)
  if (idx === -1) return
  cats[type][idx] = trimmed
  saveCustomCategories(cats)
  // Update icon
  const icons = loadCustomIcons()
  if (icons[oldName]) {
    icons[trimmed] = icons[oldName]
    delete icons[oldName]
    setManagedItem(CUSTOM_ICONS_KEY, JSON.stringify(icons))
  }
  // Update transactions
  const txs = loadTransactions()
  let changed = false
  for (const tx of txs) {
    if (tx.category === oldName) {
      tx.category = trimmed
      changed = true
    }
  }
  if (changed) saveTransactions(txs)
}

// ─── Custom Category Icons ──────────────────────────────

export function loadCustomIcons(): Record<string, string> {
  try {
    const raw = getManagedItem(CUSTOM_ICONS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveCustomIcon(categoryName: string, icon: string) {
  const icons = loadCustomIcons()
  icons[categoryName] = icon
  setManagedItem(CUSTOM_ICONS_KEY, JSON.stringify(icons))
}

export function deleteCustomIcon(categoryName: string) {
  const icons = loadCustomIcons()
  delete icons[categoryName]
  setManagedItem(CUSTOM_ICONS_KEY, JSON.stringify(icons))
}

// ─── Notification Settings ──────────────────────────────

export interface NotificationSettings {
  enabled: boolean
  time: string // HH:MM
}

export function loadNotificationSettings(): NotificationSettings {
  try {
    const raw = getManagedItem(NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : { enabled: false, time: '21:30' }
  } catch {
    return { enabled: false, time: '21:30' }
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  setManagedItem(NOTIFICATIONS_KEY, JSON.stringify(settings))
}

// ─── Planet Discovery Log ────────────────────────────────
//
// RULES — do not change without updating all four priorities below:
//
// 1. Each (category, year, month) tuple gets exactly one planet, stored in
//    andromeda-planet-log. Once assigned it never changes (deterministic).
//
// 2. Within the same month, no two categories may share the same planet alias.
//    → candidates exclude aliases already assigned to other categories this month.
//
// 3. Per-category discovery cycle: candidates prefer planets not yet discovered
//    in that category across all months (collector progression).
//    → when all planets in the category have been discovered, the cycle resets
//      (they can reappear), but monthly uniqueness still applies.
//
// 4. Planet is chosen via weighted RNG seeded on (year, month, categoryKey):
//    same inputs always yield the same pick — fully deterministic.
//    Weights by rarity: common 50 · uncommon 30 · rare 15 · epic 4 · legendary 1.
//
// Fallback chain (in order):
//   P1 — not discovered in category AND not used this month  (ideal)
//   P2 — cycle reset (all discovered), but still avoid month conflicts
//   P3 — all planets already used this month → ignore month constraint
//   P4 — full list (absolute last resort)

export interface PlanetLogEntry {
  category: string
  alias: string
  rarity: PlanetRarity
  year: number
  month: number // 0-indexed
}

const RARITY_WEIGHT: Record<PlanetRarity, number> = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
  mythic: 0.5,
}

function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 4294967296
  }
}

function strHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) >>> 0
  return h
}

export function loadPlanetLog(): PlanetLogEntry[] {
  try {
    const raw = localStorage.getItem(PLANET_LOG_KEY)
    return raw ? (JSON.parse(raw) as PlanetLogEntry[]) : []
  } catch {
    return []
  }
}

function savePlanetLog(log: PlanetLogEntry[]) {
  try {
    localStorage.setItem(PLANET_LOG_KEY, JSON.stringify(log))
  } catch { /* noop */ }
}

export function resolveMonthPlanet(
  categoryKey: string,
  year: number,
  month: number,
): { alias: string; source: string; lore: string; rarity: PlanetRarity } | null {
  const allPlanets = getAllPlanets()
  if (allPlanets.length === 0) return null

  const log = loadPlanetLog()

  // Already assigned for this (category, year, month)?
  const existing = log.find((e) => e.category === categoryKey && e.year === year && e.month === month)
  if (existing) {
    return allPlanets.find((p) => p.alias === existing.alias) ?? null
  }

  // Aliases already discovered globally (across all categories/months)
  const discoveredGlobally = new Set(log.map((e) => e.alias))
  // Aliases used this month (any category)
  const usedThisMonth = new Set(
    log.filter((e) => e.year === year && e.month === month).map((e) => e.alias)
  )

  // P1: not discovered globally AND not used this month
  let candidates = allPlanets.filter((p) => !discoveredGlobally.has(p.alias) && !usedThisMonth.has(p.alias))

  // P2: not used this month (cycle reset — all discovered globally)
  if (candidates.length === 0) {
    candidates = allPlanets.filter((p) => !usedThisMonth.has(p.alias))
  }

  // P3: ignore month constraint (every planet used this month somewhere)
  if (candidates.length === 0) {
    candidates = allPlanets.filter((p) => !discoveredGlobally.has(p.alias))
  }

  // P4: all discovered → absolute fallback
  if (candidates.length === 0) candidates = allPlanets

  // Weighted pick using seeded RNG
  const seed = (year * 12 + month) * 65537 + strHash(categoryKey)
  const rand = seededRandom(seed)
  const totalWeight = candidates.reduce((s, p) => s + RARITY_WEIGHT[p.rarity], 0)
  let pick = rand() * totalWeight
  let chosen = candidates[candidates.length - 1]
  for (const p of candidates) {
    pick -= RARITY_WEIGHT[p.rarity]
    if (pick <= 0) { chosen = p; break }
  }

  // Save to log
  savePlanetLog([...log, { category: categoryKey, alias: chosen.alias, rarity: chosen.rarity, year, month }])
  return chosen
}

// Read-only: returns assigned planet for (category, year, month) if already in log, no side effect
export function getLoggedPlanet(
  categoryKey: string,
  year: number,
  month: number,
): { alias: string; source: string; lore: string; rarity: PlanetRarity } | null {
  const log = loadPlanetLog()
  const entry = log.find((e) => e.category === categoryKey && e.year === year && e.month === month)
  if (!entry) return null
  return getAllPlanets().find((p) => p.alias === entry.alias) ?? null
}

// ─── Export / Import JSON ────────────────────────────────

export interface AppBackup {
  version: 1 | 2
  exportedAt: string  // ISO timestamp
  transactions: Transaction[]
  settings: AppSettings
  customCategories: CustomCategories
  customIcons: Record<string, string>
  notificationSettings: NotificationSettings
  // v2+
  products?: ProductEntry[]
  goals?: SavingsGoal[]
  missionCardData?: Record<string, string>
  theme?: string
  lang?: string
}

// ─── Crypto helpers ──────────────────────────────────────

export interface EncryptedBackup {
  enc: 1
  salt: string  // base64
  iv: string    // base64
  data: string  // base64 AES-GCM ciphertext
}

interface QrTransferSession {
  total: number
  chunks: Record<number, string>
}

interface ImportOptions {
  mode?: 'replace' | 'merge'
}

const TRANSFER_CODE_PREFIX = 'HX1.'

function bufToBase64(buf: ArrayBuffer | Uint8Array<ArrayBuffer>): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBuf(b64: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(base64Url: string): string {
  const padded = base64Url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(base64Url.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptJson(json: string, password: string): Promise<EncryptedBackup> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(json),
  )
  return { enc: 1, salt: bufToBase64(salt), iv: bufToBase64(iv), data: bufToBase64(ciphertext) }
}

async function decryptJson(payload: EncryptedBackup, password: string): Promise<string | null> {
  try {
    const key = await deriveKey(password, base64ToBuf(payload.salt))
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBuf(payload.iv) },
      key,
      base64ToBuf(payload.data),
    )
    return new TextDecoder().decode(plaintext)
  } catch {
    return null
  }
}

// ─── Apply backup ─────────────────────────────────────────

function mergeTransactions(existing: Transaction[], incoming: Transaction[]): Transaction[] {
  const merged = new Map<string, Transaction>()
  for (const tx of existing.map(normalizeTransaction)) {
    merged.set(tx.syncId ?? tx.id, tx)
  }

  for (const tx of incoming.map(normalizeTransaction)) {
    const key = tx.syncId ?? tx.id
    const current = merged.get(key)
    if (!current) {
      merged.set(key, tx)
      continue
    }
    const currentUpdated = Date.parse(current.updatedAt ?? current.createdAt ?? `${current.date}T00:00:00.000Z`)
    const nextUpdated = Date.parse(tx.updatedAt ?? tx.createdAt ?? `${tx.date}T00:00:00.000Z`)
    if (nextUpdated >= currentUpdated) {
      merged.set(key, tx)
    }
  }

  return Array.from(merged.values())
}

function applyBackup(data: Partial<AppBackup>, options: ImportOptions = {}): 'ok' | 'invalid' {
  if (data.version !== 1 && data.version !== 2) return 'invalid'
  if (!Array.isArray(data.transactions)) return 'invalid'
  const incomingTransactions = data.transactions.filter(isValidTransaction)
  if (options.mode === 'merge') {
    saveTransactions(mergeTransactions(loadTransactions(), incomingTransactions))
  } else {
    saveTransactions(incomingTransactions)
  }

  if (data.settings && typeof data.settings === 'object') {
    saveSettings(data.settings as AppSettings)
  }

  if (data.customCategories && typeof data.customCategories === 'object') {
    if (options.mode === 'merge') {
      const local = loadCustomCategories()
      const next = data.customCategories as CustomCategories
      saveCustomCategories({
        entrata: Array.from(new Set([...local.entrata, ...next.entrata])),
        uscita: Array.from(new Set([...local.uscita, ...next.uscita])),
      })
    } else {
      saveCustomCategories(data.customCategories as CustomCategories)
    }
  }

  if (data.customIcons && typeof data.customIcons === 'object') {
    if (options.mode === 'merge') {
      const local = loadCustomIcons()
      setManagedItem(CUSTOM_ICONS_KEY, JSON.stringify({ ...local, ...(data.customIcons as Record<string, string>) }))
    } else {
      setManagedItem(CUSTOM_ICONS_KEY, JSON.stringify(data.customIcons))
    }
  }

  if (data.notificationSettings && typeof data.notificationSettings === 'object') {
    saveNotificationSettings(data.notificationSettings as NotificationSettings)
  }

  if (typeof data.theme === 'string' && data.theme) {
    const t = data.theme === 'spazio' ? 'nebula' : data.theme // migrate legacy
    localStorage.setItem('andromeda-theme', t)
  }

  if (typeof data.lang === 'string' && data.lang) {
    localStorage.setItem('andromeda-lang', data.lang)
  }

  if (Array.isArray(data.products)) {
    if (options.mode === 'merge') {
      const local = loadProducts()
      const existingIds = new Set(local.map((p) => p.id))
      saveProducts([...local, ...data.products.filter((p) => !existingIds.has(p.id))])
    } else {
      saveProducts(data.products)
    }
  }

  if (Array.isArray(data.goals)) {
    if (options.mode === 'merge') {
      const local = loadGoals()
      const existingIds = new Set(local.map((g) => g.id))
      saveGoals([...local, ...data.goals.filter((g) => !existingIds.has(g.id))])
    } else {
      saveGoals(data.goals)
    }
  }

  if (data.missionCardData && typeof data.missionCardData === 'object') {
    for (const [key, value] of Object.entries(data.missionCardData)) {
      if (key.startsWith('andromeda-mc-colors-') || key.startsWith('andromeda-mc-launched-') || key.startsWith('andromeda-mc-confirmed-')) {
        localStorage.setItem(key, value)
      }
    }
  }

  return 'ok'
}

/** Scarica tutti i dati come file .json cifrato con AES-256-GCM */
export async function exportAllData(password: string): Promise<void> {
  const missionCardData: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith('andromeda-mc-colors-') || key.startsWith('andromeda-mc-launched-') || key.startsWith('andromeda-mc-confirmed-'))) {
      missionCardData[key] = localStorage.getItem(key) ?? ''
    }
  }
  const backup: AppBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    transactions: loadTransactions(),
    settings: loadSettings(),
    customCategories: loadCustomCategories(),
    customIcons: loadCustomIcons(),
    notificationSettings: loadNotificationSettings(),
    products: loadProducts(),
    goals: loadGoals(),
    missionCardData,
    theme: localStorage.getItem('andromeda-theme') ?? undefined,
    lang: localStorage.getItem('andromeda-lang') ?? undefined,
  }
  const encrypted = await encryptJson(JSON.stringify(backup), password)
  const blob = new Blob([JSON.stringify(encrypted)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `andromeda-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Importa un backup da file .json (cifrato o plain legacy).
 * @returns 'ok' | 'invalid' | 'needs-password' | 'wrong-password'
 */
export async function importAllData(
  jsonString: string,
  password?: string,
  options: ImportOptions = {},
): Promise<'ok' | 'invalid' | 'needs-password' | 'wrong-password'> {
  try {
    const raw = JSON.parse(jsonString) as Record<string, unknown>

    // Encrypted format
    if (raw.enc === 1) {
      if (!password) return 'needs-password'
      const decrypted = await decryptJson(raw as unknown as EncryptedBackup, password)
      if (decrypted === null) return 'wrong-password'
      return applyBackup(JSON.parse(decrypted) as Partial<AppBackup>, options)
    }

    // Plain legacy format
    return applyBackup(raw as Partial<AppBackup>, options)
  } catch {
    return 'invalid'
  }
}

// ─── QR Transfer (PC -> telefono) ───────────────────────

export async function buildQrTransferLinks(password: string): Promise<string[]> {
  const missionCardData: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith('andromeda-mc-colors-') || key.startsWith('andromeda-mc-launched-') || key.startsWith('andromeda-mc-confirmed-'))) {
      missionCardData[key] = localStorage.getItem(key) ?? ''
    }
  }
  const backup: AppBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    transactions: loadTransactions(),
    settings: loadSettings(),
    customCategories: loadCustomCategories(),
    customIcons: loadCustomIcons(),
    notificationSettings: loadNotificationSettings(),
    products: loadProducts(),
    goals: loadGoals(),
    missionCardData,
    theme: localStorage.getItem('andromeda-theme') ?? undefined,
    lang: localStorage.getItem('andromeda-lang') ?? undefined,
  }

  const encrypted = await encryptJson(JSON.stringify(backup), password)
  const payload = toBase64Url(JSON.stringify(encrypted))

  const sessionId = generateId()
  const chunkSize = 700
  const chunks: string[] = []
  for (let i = 0; i < payload.length; i += chunkSize) {
    chunks.push(payload.slice(i, i + chunkSize))
  }

  const total = chunks.length
  const baseUrl = `${window.location.origin}${window.location.pathname}`
  return chunks.map((chunk, i) => {
    const token = `1.${sessionId}.${i + 1}.${total}.${chunk}`
    return `${baseUrl}?xfer=${encodeURIComponent(token)}`
  })
}

export async function buildTransferCode(password: string): Promise<string> {
  const missionCardData: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith('andromeda-mc-colors-') || key.startsWith('andromeda-mc-launched-') || key.startsWith('andromeda-mc-confirmed-'))) {
      missionCardData[key] = localStorage.getItem(key) ?? ''
    }
  }
  const backup: AppBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    transactions: loadTransactions(),
    settings: loadSettings(),
    customCategories: loadCustomCategories(),
    customIcons: loadCustomIcons(),
    notificationSettings: loadNotificationSettings(),
    products: loadProducts(),
    goals: loadGoals(),
    missionCardData,
    theme: localStorage.getItem('andromeda-theme') ?? undefined,
    lang: localStorage.getItem('andromeda-lang') ?? undefined,
  }

  const encrypted = await encryptJson(JSON.stringify(backup), password)
  return `${TRANSFER_CODE_PREFIX}${toBase64Url(JSON.stringify(encrypted))}`
}

export async function importTransferCode(
  code: string,
  password?: string,
  options: ImportOptions = {},
): Promise<'ok' | 'invalid' | 'needs-password' | 'wrong-password'> {
  try {
    const compact = code.trim().replace(/\s+/g, '')
    const raw = compact.startsWith(TRANSFER_CODE_PREFIX)
      ? compact.slice(TRANSFER_CODE_PREFIX.length)
      : compact

    if (!raw) return 'invalid'
    const payload = fromBase64Url(raw)
    return importAllData(payload, password, options)
  } catch {
    return 'invalid'
  }
}

export function ingestQrTransferToken(raw: string): 'ignored' | 'partial' | 'ready' | 'invalid' {
  if (!raw) return 'ignored'

  const parts = raw.split('.')
  if (parts.length < 5) return 'invalid'

  const [version, sessionId, indexRaw, totalRaw, ...chunkParts] = parts
  const index = Number(indexRaw)
  const total = Number(totalRaw)
  const chunk = chunkParts.join('.')

  if (version !== '1' || !sessionId || !Number.isInteger(index) || !Number.isInteger(total) || !chunk) {
    return 'invalid'
  }

  const key = `${QR_TRANSFER_PREFIX}${sessionId}`
  let session: QrTransferSession = { total, chunks: {} }

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored) as QrTransferSession
      if (parsed.total === total && parsed.chunks && typeof parsed.chunks === 'object') {
        session = parsed
      }
    }
  } catch {
    return 'invalid'
  }

  session.chunks[index] = chunk
  localStorage.setItem(key, JSON.stringify(session))

  const collected = Object.keys(session.chunks).length
  if (collected < total) return 'partial'

  let joined = ''
  for (let i = 1; i <= total; i++) {
    const part = session.chunks[i]
    if (!part) return 'partial'
    joined += part
  }

  try {
    const payload = fromBase64Url(joined)
    localStorage.setItem(QR_TRANSFER_READY_KEY, payload)
    localStorage.removeItem(key)
    return 'ready'
  } catch {
    return 'invalid'
  }
}

// Backward-compatible helper for hash links generated in previous version.
export function ingestQrTransferHash(hash: string): 'ignored' | 'partial' | 'ready' | 'invalid' {
  if (!hash.startsWith('#xfer=')) return 'ignored'
  return ingestQrTransferToken(hash.slice(6))
}

export function getPendingQrTransferPayload(): string | null {
  try {
    return localStorage.getItem(QR_TRANSFER_READY_KEY)
  } catch {
    return null
  }
}

export function clearPendingQrTransferPayload() {
  try {
    localStorage.removeItem(QR_TRANSFER_READY_KEY)
  } catch {
    // noop
  }
}
