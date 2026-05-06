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

const NEBULA: ThemeTokens = {
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
  bgPrimary: '#f4f6fc',
  bgSecondary: '#e8ecf7',
  bgCard: '#ffffff',
  textPrimary: '#080d1f',
  textSecondary: '#1e305a',
  textMuted: '#5a6888',
  border: '#c8d0e8',
  accent: '#FC3D21',
  accentHover: '#d93010',
  accentLight: 'rgba(252,61,33,0.08)',
  navBg: '#080d1f',
  navText: '#ffffff',
  btnBg: '#ffffff',
  btnText: '#080d1f',
  inputBg: '#ffffff',
  inputBorder: '#b8c2de',
  highlight: '#FC3D21',
  gold: '#e87c20',
  water: '#0B3D91',
  tropical: '#0B3D91',
  fabBg: '#FC3D21',
  fabText: '#ffffff',
  txIncomeBg: '#e8f5e9',
  txIncomeBorder: '#a5d6a7',
  txIncomeText: '#1b5e20',
  txIncomeLabel: '#2e7d32',
  txExpenseBg: '#fff0ed',
  txExpenseBorder: '#ffccbc',
  txExpenseText: '#b71c1c',
  txExpenseLabel: '#c62828',
  txBalancePosBg: '#e3f2fd',
  txBalancePosBorder: '#90caf9',
  txBalancePosText: '#0B3D91',
  txBalancePosLabel: '#1565c0',
  txBalanceNegBg: '#fff8e1',
  txBalanceNegBorder: '#ffe082',
  txBalanceNegText: '#e65100',
  txBalanceNegLabel: '#ef6c00',
}

const AURORA: ThemeTokens = {
  bgPrimary: '#080c1a',
  bgSecondary: '#0d1228',
  bgCard: '#101630',
  textPrimary: '#e0f0ff',
  textSecondary: '#7eb8d4',
  textMuted: '#4a6a80',
  border: 'rgba(100,200,255,0.12)',
  accent: '#00e5b0',
  accentHover: '#00c99a',
  accentLight: 'rgba(0,229,176,0.12)',
  navBg: 'rgba(5,8,20,0.94)',
  navText: '#e0f0ff',
  btnBg: 'rgba(100,150,255,0.07)',
  btnText: '#e0f0ff',
  inputBg: 'rgba(100,150,255,0.06)',
  inputBorder: 'rgba(100,150,255,0.20)',
  highlight: '#00e5b0',
  gold: '#ffd740',
  water: '#40a9ff',
  tropical: '#c77dff',
  fabBg: '#00e5b0',
  fabText: '#080c1a',
  txIncomeBg: 'rgba(0,229,176,0.07)',
  txIncomeBorder: 'rgba(0,229,176,0.22)',
  txIncomeText: '#00e5b0',
  txIncomeLabel: '#00c99a',
  txExpenseBg: 'rgba(199,125,255,0.07)',
  txExpenseBorder: 'rgba(199,125,255,0.22)',
  txExpenseText: '#c77dff',
  txExpenseLabel: '#a855f7',
  txBalancePosBg: 'rgba(64,169,255,0.07)',
  txBalancePosBorder: 'rgba(64,169,255,0.22)',
  txBalancePosText: '#40a9ff',
  txBalancePosLabel: '#2196f3',
  txBalanceNegBg: 'rgba(199,125,255,0.07)',
  txBalanceNegBorder: 'rgba(199,125,255,0.22)',
  txBalanceNegText: '#c77dff',
  txBalanceNegLabel: '#a855f7',
}

const LUNA: ThemeTokens = {
  bgPrimary: '#eef0f8',
  bgSecondary: '#e4e7f4',
  bgCard: '#f8f9fe',
  textPrimary: '#0e1233',
  textSecondary: '#3a4172',
  textMuted: '#7c84aa',
  border: '#d2d6ed',
  accent: '#7c85c8',
  accentHover: '#636cb5',
  accentLight: 'rgba(124,133,200,0.12)',
  navBg: '#0e1233',
  navText: '#eef0f8',
  btnBg: '#f8f9fe',
  btnText: '#0e1233',
  inputBg: '#f8f9fe',
  inputBorder: '#c8ccdf',
  highlight: '#7c85c8',
  gold: '#b8a060',
  water: '#5588bb',
  tropical: '#7c85c8',
  fabBg: '#0e1233',
  fabText: '#eef0f8',
  txIncomeBg: '#edf7f0',
  txIncomeBorder: '#b8dcc4',
  txIncomeText: '#1d5c32',
  txIncomeLabel: '#2d7a48',
  txExpenseBg: '#f7edf0',
  txExpenseBorder: '#d8b8c0',
  txExpenseText: '#7a1d2d',
  txExpenseLabel: '#9c2e40',
  txBalancePosBg: 'rgba(124,133,200,0.08)',
  txBalancePosBorder: 'rgba(124,133,200,0.25)',
  txBalancePosText: '#4a55a8',
  txBalancePosLabel: '#636cb5',
  txBalanceNegBg: 'rgba(160,120,80,0.08)',
  txBalanceNegBorder: 'rgba(160,120,80,0.22)',
  txBalanceNegText: '#8a5c20',
  txBalanceNegLabel: '#a87030',
}

const THEME_MAP: Record<Theme, ThemeTokens> = {
  nebula: NEBULA,
  mission: MISSION,
  nasa: NASA,
  aurora: AURORA,
  luna: LUNA,
}

/** Returns the full token set for a given theme name. */
export function getThemeTokens(theme: Theme): ThemeTokens {
  return THEME_MAP[theme]
}
