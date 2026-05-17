export type TransactionType = 'entrata' | 'uscita'

export interface ReceiptDetailItem {
  name: string
  price: number
  grossPrice?: number
  discountAmount?: number
  discountType?: string
}

export interface ProductPriceEntry {
  price: number
  date: string // ISO yyyy-mm-dd
  grossPrice?: number
  discountAmount?: number
  discountType?: string
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
  important?: boolean
  isReceipt?: boolean
  receiptItems?: ReceiptDetailItem[]
  goalId?: string
  goalDeductNow?: boolean  // true = sottrai dalla bandiera obiettivo questo mese
}

export interface AppSettings {
  payDay: number
  userName: string
}

export interface SavingsGoal {
  id: string
  name: string
  emoji: string
  /** Totale da raggiungere (opzionale) */
  targetAmount?: number
  /** Data obiettivo ISO yyyy-mm-dd (opzionale) */
  targetDate?: string
  /** Risparmio mensile fisso impostato dall'utente */
  monthlyAmount?: number
  /** Quanto già messo da parte */
  savedAmount: number
  createdAt: string
  updatedAt: string
}


// Le categorie sono ora in src/shared/labels.ts → CATEGORIES
export { CATEGORIES } from './labels'
