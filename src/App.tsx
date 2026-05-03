import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PinLock from './components/PinLock'
import WhatsNew from './components/WhatsNew'
import InstallPrompt from './components/InstallPrompt'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import SettingsPage, {
  LinguaSection,
  NotificheSection,
  SicurezzaSection,
  SpazioLocaleSection,
  EsportaSection,
  BackupSection,
} from './pages/SettingsPage'
import Movimenti from './pages/Movimenti'
import Missions from './pages/Missions'
import NotFound from './pages/NotFound'
import { isUnlocked } from './shared/storage'
import { useNotificationScheduler } from './shared/useNotifications'

function App() {
  const [unlocked, setUnlocked] = useState(isUnlocked())
  useNotificationScheduler()

  if (!unlocked) {
    return <PinLock onUnlocked={() => setUnlocked(true)} />
  }

  return (
    <>
      <WhatsNew />
      <InstallPrompt />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movimenti" element={<Movimenti />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/lingua" element={<LinguaSection />} />
          <Route path="/settings/notifiche" element={<NotificheSection />} />
          <Route path="/settings/sicurezza" element={<SicurezzaSection />} />
          <Route path="/settings/spazio" element={<SpazioLocaleSection />} />
          <Route path="/settings/esporta" element={<EsportaSection />} />
          <Route path="/settings/backup" element={<BackupSection />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
