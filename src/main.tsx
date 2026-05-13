import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from './shared/ThemeContext'
import { DialogProvider } from './shared/DialogContext'
import { AmountsProvider } from './shared/AmountsContext'
import { ToastProvider } from './shared/ToastContext'
import { initPersistentStorage, migrateCategoryKeys } from './shared/storage'
import { performAutoBackup } from './shared/autoBackup'
import App from './App'
import './index.css'

// Aggiornamento automatico SW: reload quando il nuovo SW prende controllo
function setupSWUpdateListener() {
  if (!('serviceWorker' in navigator)) return

  // Ogni volta che un nuovo SW prende il controllo → reload per attivare la nuova versione
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

// ─── Fix iOS Safari black screen + SW update check al ritorno in foreground ───
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    performAutoBackup()
  }
  if (document.visibilityState === 'visible') {
    // Repaint fix per iOS Safari (Note Rapide / viewport change)
    document.body.style.display = 'none'
    // Trigger reflow — accesso a offsetHeight è intenzionale
    void document.body.offsetHeight
    document.body.style.display = ''
    // Controlla aggiornamenti SW al ritorno in foreground
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.update())
      })
    }
  }
})

// Stesso fix per il caso BFCache (tasto Indietro del browser)
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.body.style.display = 'none'
    void document.body.offsetHeight
    document.body.style.display = ''
  }
})

async function bootstrap() {
  // Setup listener per aggiornamenti SW
  setupSWUpdateListener()

  // Migrazione one-time: porta i dati esistenti su IndexedDB e mantiene fallback sicuro.
  await initPersistentStorage()

  // Migrazione one-time: normalizza categorie salvate in lingua diversa dall'italiano
  migrateCategoryKeys()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HashRouter>
        <ThemeProvider>
          <AmountsProvider>
            <DialogProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </DialogProvider>
          </AmountsProvider>
        </ThemeProvider>
      </HashRouter>
    </StrictMode>,
  )
}

void bootstrap()
