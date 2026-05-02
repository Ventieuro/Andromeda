export type TransactionType = 'entrata' | 'uscita'

export interface ReceiptDetailItem {
  name: string
  price: number
}

export interface ProductPriceEntry {
  price: number
  date: string // ISO yyyy-mm-dd
}

export interface ProductEntry {
  id: string
  name: string               // nome canonico (scelto dall'utente o dal primo OCR)
  aliases: string[]          // varianti OCR conosciute
  priceHistory: ProductPriceEntry[]
  category?: string
  lastSeen: string           // ISO yyyy-mm-dd ultima lettura
}

export interface Transaction {
  id: string
  syncId?: string
  createdAt?: string // ISO timestamp
  updatedAt?: string // ISO timestamp
  type: TransactionType
  description: string
  amount: number
  date: string // ISO yyyy-mm-dd
  recurring: boolean
  recurringMonths: number // 0 = non ricorrente, N = quanti mesi
  recurringGroupId?: string // ID condiviso fra le occorrenze della stessa serie
  category: string
  isReceipt?: boolean
  receiptItems?: ReceiptDetailItem[]
}

export interface AppSettings {
  payDay: number
  userName: string
}

// Le categorie sono ora in src/shared/labels.ts → CATEGORIE
import { CATEGORIE } from './labels'
export const CATEGORIES = CATEGORIE
