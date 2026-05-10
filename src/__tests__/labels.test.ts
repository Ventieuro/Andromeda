import { describe, it, expect, beforeEach } from 'vitest'
import { setLocale, getLocale, LAYOUT, DASHBOARD, MASCOT, FORM, CATEGORIES, NOT_FOUND } from '../shared/labels'

describe('labels.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    setLocale('it')
  })

  describe('setLocale / getLocale', () => {
    it('defaults to it', () => {
      expect(getLocale()).toBe('it')
    })

    it('switches to en', () => {
      setLocale('en')
      expect(getLocale()).toBe('en')
    })

    it('switches to es', () => {
      setLocale('es')
      expect(getLocale()).toBe('es')
    })
  })

  describe('LAYOUT labels', () => {
    it('returns Italian by default', () => {
      expect(LAYOUT.appName).toContain('Andromeda')
    })

    it('returns English when locale is en', () => {
      setLocale('en')
      expect(LAYOUT.appName).toContain('Andromeda')
    })
  })

  describe('DASHBOARD labels', () => {
    it('returns Italian strings', () => {
      expect(DASHBOARD.entrate).toBe('Entrate')
      expect(DASHBOARD.uscite).toBe('Uscite')
    })

    it('returns English strings', () => {
      setLocale('en')
      expect(DASHBOARD.entrate).toBe('Income')
      expect(DASHBOARD.uscite).toBe('Expenses')
    })

    it('returns Spanish strings', () => {
      setLocale('es')
      expect(DASHBOARD.entrate).toBe('Ingresos')
      expect(DASHBOARD.uscite).toBe('Gastos')
    })
  })

  describe('MASCOTTE labels', () => {
    it('returns mascot messages as strings', () => {
      expect(typeof MASCOT.messaggi.vuoto).toBe('string')
      expect(typeof MASCOT.messaggi.ottimo).toBe('string')
      expect(typeof MASCOT.messaggi.pari).toBe('string')
    })

    it('returns parametric functions', () => {
      expect(typeof MASCOT.messaggi.bene).toBe('function')
      const msg = MASCOT.messaggi.bene('€100')
      expect(msg).toContain('€100')
    })
  })

  describe('FORM labels', () => {
    it('has all required form labels', () => {
      expect(FORM.labelQuanto).toBeTruthy()
      expect(FORM.labelPerCosa).toBeTruthy()
      expect(FORM.labelCategoria).toBeTruthy()
      expect(FORM.labelQuando).toBeTruthy()
      expect(FORM.submitEntrata).toBeTruthy()
      expect(FORM.submitUscita).toBeTruthy()
    })
  })

  describe('CATEGORIE', () => {
    it('returns arrays for entrata and uscita', () => {
      expect(Array.isArray(CATEGORIES.entrata)).toBe(true)
      expect(Array.isArray(CATEGORIES.uscita)).toBe(true)
      expect(CATEGORIES.entrata.length).toBeGreaterThan(0)
      expect(CATEGORIES.uscita.length).toBeGreaterThan(0)
    })

    it('changes language for categories', () => {
      setLocale('en')
      expect(CATEGORIES.entrata).toContain('Salary')
    })
  })

  describe('NOT_FOUND labels', () => {
    it('returns 404 message', () => {
      expect(NOT_FOUND.messaggio).toBeTruthy()
      expect(NOT_FOUND.tornaHome).toBeTruthy()
    })
  })
})
