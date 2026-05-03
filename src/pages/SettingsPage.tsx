import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { useTheme } from '../shared/ThemeContext'
import MoneyPlusImporter from '../components/MoneyPlusImporter'
import {
  loadNotificationSettings,
  saveNotificationSettings,
  exportAllData,
  importAllData,
  loadPin,
  isBiometricAvailable,
  isBiometricCredentialSaved,
  registerBiometric,
  removeBiometricCredential,
} from '../shared/storage'
import {
  loadAutoBackupSettings,
  saveAutoBackupSettings,
  pickFolder,
  triggerDownloadBackup,
  isFSASupported,
  type AutoBackupSettings,
} from '../shared/autoBackup'
import {
  SETTINGS, NOTIFICHE, AUTO_BACKUP, PIN, LAYOUT,
  getLocale, setLocale, type Locale,
} from '../shared/labels'
import { FEATURES } from '../app/features'
import { useDialog } from '../shared/DialogContext'

// ─── Storage Constant ─────────────────────────────────────
const LS_LIMIT = 50 * 1024 * 1024
function fmtMB(b: number) { return `${(b / (1024 * 1024)).toFixed(2)} MB` }

// ─── Shared UI ───────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
      {children}
    </h3>
  )
}

function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/settings')}
      className="flex items-center gap-1.5 text-sm font-medium mb-5 transition hover:opacity-70"
      style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {SETTINGS.impostazioni}
    </button>
  )
}

// ─── Lingua & Tema Section ────────────────────────────────
export function LinguaSection() {
  const { theme, setTheme } = useTheme()
  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.lingua} />
      <div className="px-4 space-y-6">
        <BackButton />

        <div>
          <SectionLabel>{SETTINGS.tema}</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {([
              { t: 'spazio', emoji: '🌑', label: SETTINGS.darkMode },
              { t: 'nasa', emoji: '☀️', label: SETTINGS.lightMode },
              { t: 'mission', emoji: '🚀', label: 'Mission' },
            ] as { t: Parameters<typeof setTheme>[0]; emoji: string; label: string }[]).map(({ t, emoji, label }) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`py-2.5 px-2 rounded-xl text-sm font-medium transition ${theme === t ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: theme === t ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  color: theme === t ? 'var(--accent)' : 'var(--text-secondary)',
                  '--tw-ring-color': 'var(--accent)',
                } as React.CSSProperties}
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>{SETTINGS.lingua}</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {([
              { locale: 'it', flag: '🇮🇹', label: 'Italiano' },
              { locale: 'en', flag: '🇬🇧', label: 'English' },
              { locale: 'es', flag: '🇪🇸', label: 'Español' },
            ] as { locale: Locale; flag: string; label: string }[]).map(({ locale, flag, label }) => {
              const active = getLocale() === locale
              return (
                <button
                  key={locale}
                  onClick={() => { setLocale(locale); window.location.reload() }}
                  className={`py-2 px-1 rounded-xl text-xs font-medium transition ${active ? 'ring-2' : ''}`}
                  style={{
                    backgroundColor: active ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    '--tw-ring-color': 'var(--accent)',
                  } as React.CSSProperties}
                >
                  {flag} {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Notifiche Section ────────────────────────────────────
export function NotificheSection() {
  const [notif, setNotif] = useState(loadNotificationSettings)

  function toggle() {
    if (!notif.enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          const u = { ...notif, enabled: true }
          setNotif(u); saveNotificationSettings(u)
        }
      })
    } else {
      const u = { ...notif, enabled: !notif.enabled }
      setNotif(u); saveNotificationSettings(u)
    }
  }

  function setTime(time: string) {
    const u = { ...notif, time }; setNotif(u); saveNotificationSettings(u)
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.notifiche} />
      <div className="px-4 space-y-4">
        <BackButton />

        <div className="flex items-center justify-between rounded-xl p-3.5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{SETTINGS.promemoria}</span>
          <div onClick={toggle} className="w-11 h-6 rounded-full transition relative cursor-pointer" style={{ backgroundColor: notif.enabled ? 'var(--accent)' : 'var(--bg-secondary)', border: '1px solid var(--border)' }} role="switch" aria-checked={notif.enabled}>
            <div className="w-4 h-4 rounded-full absolute top-0.5 transition-transform" style={{ backgroundColor: '#fff', transform: notif.enabled ? 'translateX(22px)' : 'translateX(3px)' }} />
          </div>
        </div>

        {notif.enabled && (
          <div className="space-y-3">
            <button
              onClick={() => {
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                  navigator.serviceWorker.ready.then((reg) => reg.showNotification('🚀 Hermes', { body: NOTIFICHE.messaggioPromemoria, icon: '/Hermes/pwa-192x192.svg' }))
                } else if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('🚀 Hermes', { body: NOTIFICHE.messaggioPromemoria })
                }
              }}
              className="w-full py-2 rounded-xl text-xs font-medium transition active:scale-95"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {SETTINGS.testNotifica}
            </button>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{SETTINGS.orarioPromemoria}</p>
            <div className="flex gap-2 flex-wrap">
              {['19:00', '21:30'].map((time) => (
                <button key={time} onClick={() => setTime(time)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${notif.time === time ? 'ring-2' : ''}`} style={{ backgroundColor: notif.time === time ? 'var(--accent-light)' : 'var(--bg-secondary)', color: notif.time === time ? 'var(--accent)' : 'var(--text-secondary)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}>
                  🕐 {time}
                </button>
              ))}
              <input type="time" value={notif.time} onChange={(e) => setTime(e.target.value)} className="px-2 py-1 rounded-lg text-xs focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sicurezza Section ────────────────────────────────────
export function SicurezzaSection() {
  const [biometricSupported, setBiometricSupported] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(isBiometricCredentialSaved)
  const [biometricError, setBiometricError] = useState('')
  const pinIsSet = !!loadPin()

  useEffect(() => { isBiometricAvailable().then(setBiometricSupported) }, [])

  async function toggleBiometric() {
    setBiometricError('')
    if (biometricEnabled) {
      removeBiometricCredential(); setBiometricEnabled(false)
    } else {
      const ok = await registerBiometric()
      if (ok) setBiometricEnabled(true)
      else setBiometricError(PIN.biometriaFallitoReg)
    }
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.sicurezza} />
      <div className="px-4 space-y-4">
        <BackButton />

        {pinIsSet && biometricSupported ? (
          <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{PIN.abilitaBiometria}</span>
                {biometricEnabled && <p className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>{PIN.biometriaAttiva}</p>}
              </div>
              <div onClick={toggleBiometric} className="w-11 h-6 rounded-full transition relative cursor-pointer" style={{ backgroundColor: biometricEnabled ? 'var(--accent)' : 'var(--bg-secondary)', border: '1px solid var(--border)' }} role="switch" aria-checked={biometricEnabled}>
                <div className="w-4 h-4 rounded-full absolute top-0.5 transition-transform" style={{ backgroundColor: '#fff', transform: biometricEnabled ? 'translateX(22px)' : 'translateX(3px)' }} />
              </div>
            </div>
            {biometricError && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{biometricError}</p>}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {!pinIsSet
              ? "Imposta un PIN dall'app per abilitare le opzioni di sicurezza."
              : 'Biometria non disponibile su questo dispositivo.'}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Spazio Locale Section ────────────────────────────────
export function SpazioLocaleSection() {
  const [usedBytes, setUsedBytes] = useState(0)

  useEffect(() => {
    async function calc() {
      try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const req = indexedDB.open('hermes-db', 1)
          req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error)
        })
        const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
          const tx = db.transaction('kv', 'readonly')
          const req = tx.objectStore('kv').getAllKeys()
          req.onsuccess = () => resolve(req.result as IDBValidKey[]); req.onerror = () => reject(req.error)
        })
        let total = 0
        for (const key of keys) {
          const val = await new Promise<string | null>((resolve, reject) => {
            const tx = db.transaction('kv', 'readonly')
            const req = tx.objectStore('kv').get(key)
            req.onsuccess = () => resolve(req.result ? JSON.stringify(req.result) : null); req.onerror = () => reject(req.error)
          })
          if (val) total += (typeof key === 'string' ? key.length : 10) + val.length
        }
        db.close(); setUsedBytes(total)
      } catch {
        let total = 0
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i); if (!k) continue
          total += k.length + (localStorage.getItem(k) ?? '').length
        }
        setUsedBytes(total)
      }
    }
    calc()
  }, [])

  const pct = Math.min(100, parseFloat(((usedBytes / LS_LIMIT) * 100).toFixed(1)))
  const high = pct >= 70

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.spazioLocaleTitolo} />
      <div className="px-4 space-y-4">
        <BackButton />
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: high ? '#f59e0b' : 'var(--accent)', transition: 'width 0.35s ease' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            {SETTINGS.spazioLocaleDettaglio(fmtMB(usedBytes), fmtMB(LS_LIMIT), pct)}
          </p>
          {high && <p className="text-xs mt-2" style={{ color: '#f59e0b' }}>{SETTINGS.spazioLocaleWarning}</p>}
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>{SETTINGS.spazioLocaleNota}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Esporta Dati Section ─────────────────────────────────
export function EsportaSection() {
  const { showConfirm, showPrompt } = useDialog()
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'invalid' | 'wrong-password'>('idle')
  const [showMoneyPlus, setShowMoneyPlus] = useState(false)

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const ok = await showConfirm({ title: SETTINGS.importaDati, message: SETTINGS.importaConferma, confirmLabel: SETTINGS.importaDati, cancelLabel: '✕ Annulla' })
      if (!ok) { e.target.value = ''; return }
      const content = ev.target?.result as string
      const probe = await importAllData(content, undefined, { mode: 'merge' })
      if (probe === 'needs-password') {
        const pwd = await showPrompt({ title: SETTINGS.passwordImporta, message: SETTINGS.passwordImporta, inputType: 'password', confirmLabel: 'OK' })
        if (!pwd) return
        const result = await importAllData(content, pwd, { mode: 'merge' })
        setImportStatus(result === 'needs-password' ? 'invalid' : result)
      } else {
        setImportStatus(probe)
      }
      setTimeout(() => setImportStatus('idle'), 3000)
    }
    reader.readAsText(file); e.target.value = ''
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.esportaVoce} />
      <div className="px-4 flex flex-col gap-2">
        <BackButton />
        {FEATURES.exportImportJson ? (
          <>
            <button
              onClick={async () => {
                const pwd = await showPrompt({ title: SETTINGS.passwordEsporta, message: SETTINGS.passwordEsporta, inputType: 'password', confirmLabel: SETTINGS.esportaDati })
                if (!pwd) return; await exportAllData(pwd)
              }}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition active:scale-95"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              {SETTINGS.esportaDati}
            </button>
            <label
              className="w-full py-2.5 rounded-xl text-sm font-medium transition active:scale-95 text-center cursor-pointer block"
              style={{ backgroundColor: 'var(--bg-secondary)', color: importStatus === 'ok' ? 'var(--accent)' : importStatus !== 'idle' ? '#ef4444' : 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              {importStatus === 'ok' ? SETTINGS.importaOk : importStatus === 'invalid' ? SETTINGS.importaErrore : importStatus === 'wrong-password' ? SETTINGS.passwordErrata : SETTINGS.importaDati}
              <input type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={() => setShowMoneyPlus(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition active:scale-95"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              📦 Importa da MoneyPlus
            </button>
          </>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Funzione non disponibile.</p>
        )}
      </div>
      {showMoneyPlus && <MoneyPlusImporter onDone={() => setShowMoneyPlus(false)} />}
    </div>
  )
}

// ─── Backup Section ───────────────────────────────────────
export function BackupSection() {
  const [autoBackup, setAutoBackup] = useState<AutoBackupSettings>(loadAutoBackupSettings)

  function update(patch: Partial<AutoBackupSettings>) {
    const u = { ...autoBackup, ...patch }; setAutoBackup(u); saveAutoBackupSettings(u)
  }

  async function handlePickFolder() {
    const name = await pickFolder(); if (name) update({ dest: 'folder', folderName: name })
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.backupVoce} />
      <div className="px-4 space-y-3">
        <BackButton />

        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{AUTO_BACKUP.passwordLabel}</p>
          <input type="password" className="w-full px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} placeholder={AUTO_BACKUP.passwordPlaceholder} value={autoBackup.password ?? ''} onChange={(e) => update({ password: e.target.value || null })} />
        </div>

        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{AUTO_BACKUP.destinazione}</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => update({ dest: 'download' })} className={`py-2 rounded-xl text-xs font-medium transition ${autoBackup.dest === 'download' ? 'ring-2' : ''}`} style={{ backgroundColor: autoBackup.dest === 'download' ? 'var(--accent-light)' : 'var(--bg-secondary)', color: autoBackup.dest === 'download' ? 'var(--accent)' : 'var(--text-secondary)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}>
              📥 {AUTO_BACKUP.download}
            </button>
            <button onClick={() => { if (!isFSASupported()) return; update({ dest: 'folder' }) }} disabled={!isFSASupported()} className={`py-2 rounded-xl text-xs font-medium transition disabled:opacity-40 ${autoBackup.dest === 'folder' ? 'ring-2' : ''}`} style={{ backgroundColor: autoBackup.dest === 'folder' ? 'var(--accent-light)' : 'var(--bg-secondary)', color: autoBackup.dest === 'folder' ? 'var(--accent)' : 'var(--text-secondary)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}>
              📁 {AUTO_BACKUP.cartella}
            </button>
          </div>
          {!isFSASupported() && <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{AUTO_BACKUP.nonSupportato}</p>}
        </div>

        {autoBackup.dest === 'folder' && isFSASupported() && (
          <button onClick={handlePickFolder} className="w-full py-2 rounded-xl text-sm font-medium transition active:scale-95" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            {autoBackup.folderName ? AUTO_BACKUP.cartellaScelta(autoBackup.folderName) : AUTO_BACKUP.sceglicartella}
          </button>
        )}

        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {AUTO_BACKUP.ultimoBackup}{' '}{autoBackup.lastBackup ? new Date(autoBackup.lastBackup).toLocaleString() : AUTO_BACKUP.mai}
        </p>

        <button
          onClick={async () => { await triggerDownloadBackup(autoBackup.password ?? null); update({ lastBackup: new Date().toISOString() }) }}
          className="w-full py-2 rounded-xl text-sm font-medium transition active:scale-95"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        >
          {AUTO_BACKUP.backupOra}
        </button>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{AUTO_BACKUP.nota}</p>
      </div>
    </div>
  )
}

// ─── Settings Menu Row ────────────────────────────────────
function SettingsRow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition active:scale-[0.98]"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
    >
      <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{icon}</span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────
function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader title={SETTINGS.impostazioni} />

      <div className="px-4 flex flex-col gap-2">
        <SettingsRow icon="🗂️" label={LAYOUT.navCategories}          onClick={() => navigate('/categories')} />
        <SettingsRow icon="🌍" label={SETTINGS.lingua}               onClick={() => navigate('/settings/lingua')} />
        <SettingsRow icon="🔔" label={SETTINGS.notifiche}            onClick={() => navigate('/settings/notifiche')} />
        <SettingsRow icon="🔒" label={SETTINGS.sicurezza}            onClick={() => navigate('/settings/sicurezza')} />
        <SettingsRow icon="💾" label={SETTINGS.spazioLocaleTitolo}   onClick={() => navigate('/settings/spazio')} />
        <SettingsRow icon="📤" label={SETTINGS.esportaVoce}          onClick={() => navigate('/settings/esporta')} />
        <SettingsRow icon="🗄️" label={SETTINGS.backupVoce}           onClick={() => navigate('/settings/backup')} />
      </div>

      <div className="px-4 py-8 text-center">
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {SETTINGS.versione} {__APP_VERSION__}
        </p>
      </div>
    </div>
  )
}

export default SettingsPage

