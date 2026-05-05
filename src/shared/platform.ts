/**
 * platform.ts — Abstraction layer for platform-specific APIs.
 *
 * Web implementation lives here.
 * React Native migration: replace this file with a RN-specific version
 * (e.g. using @capacitor/haptics, Linking, react-native, etc.).
 * All other source files import from here — no direct platform API calls.
 */

// ─── Haptic feedback ─────────────────────────────────────────────────────────

/** Short haptic pulse. Duration in ms (ignored on platforms without fine control). */
export function haptic(durationMs = 8): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(durationMs)
  }
  // React Native: Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  // Capacitor:    Haptics.impact({ style: ImpactStyle.Light })
}

// ─── App lifecycle ───────────────────────────────────────────────────────────

/** Reload / restart the app. */
export function reloadApp(): void {
  window.location.reload()
  // React Native: Updates.reloadAsync() (expo-updates) or RN restart module
}

// ─── Share ───────────────────────────────────────────────────────────────────

/** Native share sheet. Returns false if not supported. */
export async function shareText(title: string, text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({ title, text })
    return true
  }
  return false
  // React Native: Share.share({ title, message: text })
}

// ─── Clipboard ───────────────────────────────────────────────────────────────

/** Copy text to clipboard. Returns true on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
  // React Native: Clipboard.setString(text) from '@react-native-clipboard/clipboard'
}

// ─── Linking / URLs ──────────────────────────────────────────────────────────

/** Open an external URL. */
export function openURL(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
  // React Native: Linking.openURL(url)
}
