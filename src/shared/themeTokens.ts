/**
 * themeTokens.ts — Theme colors as plain JS objects.
 *
 * Web: CSS variables in index.css are the source of truth for rendering,
 *      but these objects mirror them exactly and can be used in JS logic
 *      or via `useThemeTokens()` in components.
 *
 * React Native migration: CSS variables don't exist in RN.
 *      Replace inline `style={{ color: 'var(--text-primary)' }}` with
 *      `style={{ color: tokens.textPrimary }}` using this module.
 *      `useThemeTokens()` works identically — zero component changes needed.
 */

import type { Theme } from './ThemeContext'

export interface ThemeTokens {
  // Backgrounds
  bgPrimary: string
  bgSecondary: string
  bgCard: string
  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string
  // Border
  border: string
  // Accent
  accent: string
  accentHover: string
  accentLight: string
  // Nav
  navBg: string
  navText: string
  // Buttons
  btnBg: string
  btnText: string
  // Inputs
  inputBg: string
  inputBorder: string
  // Semantic accents
  highlight: string
  gold: string
  water: string
  tropical: string
  // FAB
  fabBg: string
  fabText: string
  // Transaction — income
  txIncomeBg: string
  txIncomeBorder: string
  txIncomeText: string
  txIncomeLabel: string
  // Transaction — expense
  txExpenseBg: string
  txExpenseBorder: string
  txExpenseText: string
  txExpenseLabel: string
  // Transaction — balance positive
  txBalancePosBg: string
  txBalancePosBorder: string
  txBalancePosText: string
  txBalancePosLabel: string
  // Transaction — balance negative
  txBalanceNegBg: string
  txBalanceNegBorder: string
  txBalanceNegText: string
  txBalanceNegLabel: string
}

// ─── Theme definitions (keep in sync with index.css) ─────────────────────────

const SPAZIO: ThemeTokens = {
  bgPrimary: '#0b0d17',
  bgSecondary: '#141829',
  bgCard: '#1a1f35',
  textPrimary: '#e8eaf6',
  textSecondary: '#9fa8da',
  textMuted: '#5c6bc0',
  border: '#283060',
  accent: '#7c4dff',
  accentHover: '#651fff',
  accentLight: '#1a1040',
  navBg: '#0d1025',
  navText: '#e8eaf6',
  btnBg: '#1a1f35',
  btnText: '#e8eaf6',
  inputBg: '#141829',
  inputBorder: '#3949ab',
  highlight: '#00e5ff',
  gold: '#ffd740',
  water: '#18ffff',
  tropical: '#ff6e40',
  fabBg: '#7c4dff',
  fabText: '#ffffff',
  txIncomeBg: '#0a2e1a',
  txIncomeBorder: '#15572f',
  txIncomeText: '#00E676',
  txIncomeLabel: '#66BB6A',
  txExpenseBg: '#2e0a0a',
  txExpenseBorder: '#571515',
  txExpenseText: '#FC3D21',
  txExpenseLabel: '#ef5350',
  txBalancePosBg: '#1a1040',
  txBalancePosBorder: '#2a1d5e',
  txBalancePosText: '#b388ff',
  txBalancePosLabel: '#9575cd',
  txBalanceNegBg: '#2e1a0a',
  txBalanceNegBorder: '#573515',
  txBalanceNegText: '#FF6633',
  txBalanceNegLabel: '#FF8A65',
}

const MISSION: ThemeTokens = {
  bgPrimary: '#0d1323',
  bgSecondary: '#111827',
  bgCard: '#141c2e',
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#4a5568',
  border: 'rgba(255,255,255,0.10)',
  accent: '#ff9800',
  accentHover: '#f57c00',
  accentLight: 'rgba(255,152,0,0.14)',
  navBg: 'rgba(10,14,26,0.92)',
  navText: '#e2e8f0',
  btnBg: 'rgba(255,255,255,0.06)',
  btnText: '#e2e8f0',
  inputBg: 'rgba(255,255,255,0.06)',
  inputBorder: 'rgba(255,255,255,0.13)',
  highlight: '#00bcd4',
  gold: '#ffd740',
  water: '#29b6f6',
  tropical: '#ff9800',
  fabBg: '#ff9800',
  fabText: '#0d1323',
  txIncomeBg: 'rgba(46,204,113,0.07)',
  txIncomeBorder: 'rgba(46,204,113,0.22)',
  txIncomeText: '#2ecc71',
  txIncomeLabel: '#27ae60',
  txExpenseBg: 'rgba(231,76,60,0.07)',
  txExpenseBorder: 'rgba(231,76,60,0.22)',
  txExpenseText: '#e74c3c',
  txExpenseLabel: '#c0392b',
  txBalancePosBg: 'rgba(255,152,0,0.07)',
  txBalancePosBorder: 'rgba(255,152,0,0.22)',
  txBalancePosText: '#ff9800',
  txBalancePosLabel: '#e67e22',
  txBalanceNegBg: 'rgba(231,76,60,0.07)',
  txBalanceNegBorder: 'rgba(231,76,60,0.22)',
  txBalanceNegText: '#e74c3c',
  txBalanceNegLabel: '#c0392b',
}

const NASA: ThemeTokens = {
  bgPrimary: '#f5f5f5',
  bgSecondary: '#e8e8e8',
  bgCard: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#8a8a8a',
  border: '#d0d0d0',
  accent: '#FC3D21',
  accentHover: '#e0321a',
  accentLight: '#fff0ed',
  navBg: '#ffffff',
  navText: '#1a1a1a',
  btnBg: '#ffffff',
  btnText: '#1a1a1a',
  inputBg: '#ffffff',
  inputBorder: '#d0d0d0',
  highlight: '#FC3D21',
  gold: '#FF6633',
  water: '#0B3D91',
  tropical: '#FC3D21',
  fabBg: '#FC3D21',
  fabText: '#ffffff',
  txIncomeBg: '#e8f5e9',
  txIncomeBorder: '#c8e6c9',
  txIncomeText: '#2e7d32',
  txIncomeLabel: '#388e3c',
  txExpenseBg: '#ffebee',
  txExpenseBorder: '#ffcdd2',
  txExpenseText: '#c62828',
  txExpenseLabel: '#d32f2f',
  txBalancePosBg: '#e8eaf6',
  txBalancePosBorder: '#c5cae9',
  txBalancePosText: '#3949ab',
  txBalancePosLabel: '#5c6bc0',
  txBalanceNegBg: '#fff3e0',
  txBalanceNegBorder: '#ffe0b2',
  txBalanceNegText: '#e65100',
  txBalanceNegLabel: '#ef6c00',
}

const THEME_MAP: Record<Theme, ThemeTokens> = {
  spazio: SPAZIO,
  mission: MISSION,
  nasa: NASA,
}

/** Returns the full token set for a given theme name. */
export function getThemeTokens(theme: Theme): ThemeTokens {
  return THEME_MAP[theme]
}
