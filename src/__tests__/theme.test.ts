import { describe, it, expect, beforeEach } from 'vitest'

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to spazio theme in localStorage', () => {
    expect(localStorage.getItem('andromeda-theme')).toBeNull()
  })

  it('stores and reads spazio theme', () => {
    localStorage.setItem('andromeda-theme', 'spazio')
    expect(localStorage.getItem('andromeda-theme')).toBe('spazio')
  })

  it('data-theme attribute defaults correctly', () => {
    document.documentElement.setAttribute('data-theme', 'spazio')
    expect(document.documentElement.getAttribute('data-theme')).toBe('spazio')
  })
})
