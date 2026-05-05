# Guida Migrazione React Native / App Nativa

## Perché migrare

La PWA attuale funziona bene ma ha limitazioni su iOS/Android:

| Funzionalità | PWA | App Nativa |
|---|---|---|
| Vibrazione | ✅ Android, ❌ iOS | ✅ entrambi |
| Notifiche push background | parziale | ✅ |
| Icona + splash screen | quasi uguale | ✅ perfetto |
| Camera avanzata | limitata | ✅ |
| Widget / Siri / Shortcuts | ❌ | ✅ |
| Distribuzione | GitHub Pages (gratis) | vedi costi sotto |

---

## Costi distribuzione

### Android
| Metodo | Costo |
|---|---|
| Google Play Store | $25 una tantum |
| APK diretto (sideload) | **gratis** — installi il file `.apk` direttamente sul telefono |

### iOS
| Metodo | Costo | Note |
|---|---|---|
| App Store | $99/anno | Distribuzione pubblica |
| TestFlight | gratis* | *Richiede comunque $99/anno per il certificato |
| AltStore / Sideloadly | gratis | L'app scade ogni 7 giorni, l'utente deve reinstallare manualmente |
| Enterprise Certificate | $299/anno | Solo aziende con DUNS number |

> ⚠️ Apple non lascia scampo: per distribuire un'app iOS in modo stabile **devi pagare $99/anno**.
> Per la sola vibrazione non vale la spesa. Valuta quando aggiungi funzionalità che richiedono davvero il nativo.

---

## Framework consigliato: Capacitor

Capacitor wrappa la PWA React esistente dentro una WebView nativa.

**Vantaggi:**
- Codebase React identico al 95%
- Accesso alle API native via plugin
- Setup 1-2 giorni, non una riscrittura

**Rispetto a React Native:**
- React Native = più performante ma riscrittura completa dei componenti
- Capacitor = quasi zero refactor, performance leggermente inferiore

---

## Predisposizioni già fatte nel codice

### `src/shared/platform.ts`
Abstraction layer per API native. **Al momento della migrazione: sostituisci solo questo file.**

| Funzione | Web (attuale) | React Native / Capacitor |
|---|---|---|
| `haptic(ms)` | `navigator.vibrate()` | `Haptics.impactAsync()` / `@capacitor/haptics` |
| `reloadApp()` | `window.location.reload()` | `Updates.reloadAsync()` / `App.reload()` |
| `shareText(title, text)` | `navigator.share()` | `Share.share()` |
| `copyToClipboard(text)` | `navigator.clipboard` | `Clipboard.setString()` |
| `openURL(url)` | `window.open()` | `Linking.openURL()` |

### `src/shared/themeTokens.ts`
Tutti i colori dei 3 temi come oggetti JS (`ThemeTokens` interface).

CSS variables **non esistono in React Native**. Con questo file:
```tsx
// Oggi (web) — entrambi funzionano:
style={{ color: 'var(--text-primary)' }}   // CSS var
style={{ color: tokens.textPrimary }}       // token JS ← usa questo

// In RN — solo i token JS, zero altre modifiche al componente
const tokens = useThemeTokens()
style={{ color: tokens.textPrimary }}
```

### `src/shared/storage.ts`
Già l'unico punto di accesso a localStorage — pronto per essere rimpiazzato con AsyncStorage.

---

## Lista completa cose da fare per React Native

### 1. Setup (1 giorno)
- `npx create-expo-app AstroCoin --template blank-typescript`
- Copia `src/shared/` intero (logica già pronta)
- Installa: `expo-haptics`, `expo-updates`, `@react-native-async-storage/async-storage`

### 2. `platform.ts` — sostituisci implementazione (1 ora)
Vedi tabella sopra. Un file, tutto risolto.

### 3. `storage.ts` — sostituisci localStorage con AsyncStorage (2-4 ore)
- Ogni `localStorage.getItem/setItem` → `AsyncStorage.getItem/setItem` (async)
- Tutte le funzioni diventano `async/await`
- Tutti i chiamanti vanno aggiornati — **questa è la parte più impattante**

### 4. `ThemeContext` / `labels.ts` — nessuna modifica ✅

### 5. Componenti UI — riscrivi (~70% del lavoro, 1-2 settimane)
- `<div>` → `<View>`
- `<span>` / `<p>` → `<Text>`
- `<button>` → `<TouchableOpacity>` o `<Pressable>`
- Tailwind CSS → `StyleSheet.create()` oppure **NativeWind** (porta Tailwind su RN, dimezza il lavoro)
- CSS variables → `useThemeTokens()` (già predisposto)

### 6. Canvas (`SpaceDonutChart`, `CometChart`) — da riscrivere (~3 giorni)
- Canvas 2D non esiste in React Native
- Porta a `react-native-skia` (consigliato) o `react-native-svg`
- La logica di calcolo fette/angoli è riusabile al 100%

### 7. Router — sostituisci
- React Router DOM → `expo-router` o `react-navigation`
- Struttura route simile, sintassi diversa

### 8. PWA-specific — rimuovi/sostituisci
- `InstallPrompt.tsx` → non necessario in app nativa
- Service Worker → gestito da Expo/EAS automaticamente
- `autoBackup.ts` → porta a `expo-file-system` + `expo-sharing`

### 9. Scanner (`ReceiptScanner`) — verifica
- `tesseract.js` non funziona in React Native
- Alternativa: `expo-camera` + Google Vision API (cloud OCR) o `react-native-mlkit`

---

## Stima totale

| Approccio | Tempo | Costo annuo |
|---|---|---|
| Capacitor + APK Android diretto | 1-2 giorni | $0 |
| Capacitor + Google Play | 1-2 giorni + setup store | $25 una tantum |
| Capacitor + App Store iOS | 1-2 giorni + review Apple | $99/anno |
| React Native (Expo) completo | 2-4 settimane | come sopra |

**Scorciatoia:** usa **NativeWind v4** per mantenere Tailwind in RN → dimezza il tempo del punto 5.
