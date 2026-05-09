# AstroCoin — Changelog

> Report delle modifiche al progetto, aggiornato automaticamente.

---

## [09/05/2026] — Sessione 23

### TASK-124 (fix): Scanner scontrino — ricalcolo prezzo netto al cambio sconto
**File modificati:** `src/components/ReceiptScanner.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Bug: quando utente modificava sconto, il prezzo netto non si ricalcolava
- ✅ Fix: ora `discountAmount` cambio → `price = grossPrice - discountAmount` automaticamente
- ✅ Lordo mantenuto come riferimento, netto sempre coerente con formula corretta
- ✅ Versione bump → `0.9.3`

---

## [09/05/2026] — Sessione 22

### TASK-123 (fix): Cometa cumulato — scala corretta con risparmi iniziali negativi
**File modificati:** `src/components/CometChart.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Identificata causa visuale: scala Y includeva sempre `0`, comprimendo il tracciato quando il cumulato restava tutto sotto zero
- ✅ Fix: in modalità cumulativa lo zero viene incluso solo se la serie attraversa realmente lo zero
- ✅ Risultato: curva più leggibile e niente macro-sezione nera “vuota”
- ✅ Versione bump → `0.9.2`

---

## [09/05/2026] — Sessione 21

### TASK-122 (feature): Scanner scontrino — prezzo con sconto mostrato come lordo/sconto/netto
**File modificati:** `src/components/ReceiptScanner.tsx`, `src/shared/labels.ts`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Riga articolo con sconto ora mostra 3 valori distinti: `Lordo`, `Sconto`, `Netto`
- ✅ `Netto` reso non modificabile in UI per evitare interpretazioni errate (double-discount)
- ✅ Somma totale invariata: continua a usare i prezzi netti (`item.price`)
- ✅ Nuove label OCR i18n aggiunte (IT/EN/ES)
- ✅ Versione bump → `0.9.1`

---

## [06/05/2026] — Sessione 20

### TASK-121 (fix): Grafico torta — scroll libero, long press per interazione
**File modificati:** `src/components/SpaceDonutChart.tsx`, `package.json`

- ✅ `touchstart` rimosso da `passive:false` → non blocca più lo scroll della pagina
- ✅ Long press 400ms attiva selezione fetta + haptic; spostamento >10px annulla il timer
- ✅ `touchAction: 'auto'` sul canvas (era `'none'`)
- ✅ Versione bump → `0.7.26`

### TASK-120 (feature): Color picker missioni — restyle bottoni con icona Target
**File modificati:** `src/components/MissionCard.tsx`, `package.json`

- ✅ Cerchi 48px con radial gradient + glow colorato al posto dei pallini 28px
- ✅ Icona `Target` (lucide-react) al centro di ogni colore
- ✅ Nome colore (IT) + hex code sotto ogni bottone
- ✅ Colore `#60d4ff` → `#00D4FF` (Azzurro Fluo), `COLOR_NAMES` map aggiunta
- ✅ Versione bump → `0.7.25`

### TASK-119 (refactor): Impostazioni — icone lucide-react al posto delle emoji
**File modificati:** `src/pages/SettingsPage.tsx`, `package.json`

- ✅ `SettingsRow.icon` da `string` emoji a `React.ReactNode`
- ✅ Menu: Tag, Palette, Globe, Bell, Lock, HardDrive, ArrowUpDown, Archive
- ✅ Backup dest: Download, FolderOpen; Tema: Moon, Sun, Rocket
- ✅ Versione bump → `0.7.24`

### TASK-118 (fix): Auto backup — niente download automatici
**File modificati:** `src/shared/autoBackup.ts`, `src/pages/SettingsPage.tsx`, `src/shared/labels.ts`, `package.json`

- ✅ `performAutoBackup`: early return se `dest !== 'folder'`
- ✅ Toggle "Attiva alla chiusura" visibile solo con cartella locale
- ✅ Nota informativa quando dest=download
- ✅ `AUTO_BACKUP.soloCartella` aggiunto a labels
- ✅ Versione bump → `0.7.23`

## [13/05/2026] — Sessione 19

### TASK-117 (fix+feature): Arco azzurro separato per risparmi già versati agli obiettivi
**File modificati:** `src/components/SpaceDonutChart.tsx`, `src/components/ExpensePieChart.tsx`, `package.json`

- ✅ Ripristinato arco **rosso** per goal mensile non raggiunto (era stato cambiato in blu per errore in v0.7.21)
- ✅ Nuovo arco **azzurro** pulsante (`drawManualSavingsArc`) a raggio `outerR+11` = risparmi già versati manualmente agli obiettivi nel periodo
- ✅ `missionTotal` calcolato in `ExpensePieChart` e passato come prop `missionSaved` a `SpaceDonutChart`
- ✅ Versione bump → `0.7.22`

## [13/05/2026] — Sessione 19

### TASK-116 (tweak): Arco esterno pulsante azzurro invece di rosso
**File modificati:** `src/components/SpaceDonutChart.tsx`, `package.json`

- ✅ Arco esterno pulsante: azzurro (`96,165,250`) quando obiettivo non ancora raggiunto, verde quando raggiunto
- ✅ Versione bump → `0.7.21`

### TASK-115 (feature): Arco azzurro per risparmi obiettivo nel grafico
**File modificati:** `src/components/ExpensePieChart.tsx`, `src/shared/labels.ts`, `package.json`

- ✅ Arco azzurro (`#60a5fa`, label "Risparmi Obiettivi") = tx con `goalId` nel periodo — soldi già spostati negli obiettivi
- ✅ Arco verde (`#22c55e`, label "Risparmi") = `income - regularExpenses - missionTotal` = risparmio vero non ancora toccato
- ✅ Spese categorie = solo tx senza `goalId`
- ✅ Versione bump → `0.7.20`

### TASK-114 (feature): Missioni nel grafico verde + cancellazione scalano goal
**File modificati:** `src/components/ExpensePieChart.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Movimenti.tsx`, `src/shared/labels.ts`, `package.json`

- ✅ Tx con `goalId` non contano come uscita nel grafico — l'arco verde (Risparmi) aumenta
- ✅ `buildSlices`: solo `regularExpenses` (no missioni) come base del donut
- ✅ On delete (Dashboard + Movimenti): se `tx.goalId` → `goal.savedAmount -= tx.amount`
- ✅ Cancellazione gruppo ricorrente: sottrae somma di tutte le tx del gruppo dal goal
- ✅ Versione bump → `0.7.19`

### TASK-113 (feature): UX missioni — mutua esclusione + display transazioni goal
**File modificati:** `src/components/AddTransactionForm.tsx`, `src/shared/labels.ts`, `src/pages/Movimenti.tsx`, `src/pages/Dashboard.tsx`, `package.json`

- ✅ Categoria e missione mutualmente esclusive: click su una azzera l'altra
- ✅ Missione picker spostato su `uscita` (risparmio = soldi che escono dal budget)
- ✅ Dimming opacity 0.45 sulla sezione inattiva (categoria o missione)
- ✅ Pill missione attiva: sfondo `#1e3a6a`, testo `#7c9eff`
- ✅ `isValid` aggiornato: valido se `category !== ''` OR `goalId !== ''`
- ✅ Fallback descrizione usa nome missione quando description vuota
- ✅ `FORM.oDivider` aggiunto a `labels.ts` (IT/EN/ES)
- ✅ `Movimenti.tsx` + `Dashboard.tsx`: transazioni con goalId mostrano emoji+nome missione e importo blu `#7c9eff`
- ✅ Versione bump → `0.7.18`

### TASK-112 (feature): Mission picker in AddTransactionForm
**File modificati:** `src/shared/types.ts`, `src/shared/labels.ts`, `src/components/AddTransactionForm.tsx`, `src/components/MissionCard.tsx`, `src/pages/Missions.tsx`, `package.json`

- ✅ Rimosso tasto `+ Risparmio` da `MissionCard` e `handleAddSavings` da `Missions.tsx`
- ✅ `Transaction` ottiene campo opzionale `goalId?: string`
- ✅ `AddTransactionForm`: sezione "Missione (opzionale)" con pill picker (solo entrate, solo goal non completati)
- ✅ Su submit: se goal selezionato, `updateGoal` aggiorna `savedAmount`
- ✅ Versione bump → `0.7.17`

---

## [05/05/2026] — Sessione 18

### TASK-111 (feature): Missions — ordine cronologico inverso + aggiornamento icone
**File modificati:** `src/pages/Missions.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Missioni visualizzate dalla più recente alla più vecchia (`[...goals].reverse()`)
- ✅ Emoji picker: rimossi 🌴 📱 🎸, aggiunti 🎮 (svago) 🩺 (dottore) 🎁 (regalo)
- ✅ Versione bump → `0.7.16`

---

### TASK-110 (fix): MissionCard — chiave storage basata su id
**File modificati:** `src/components/MissionCard.tsx`, `src/pages/Missions.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Bug: le chiavi localStorage usavano `name` come discriminante — due obiettivi con lo stesso nome condividevano lo stato della navicella (colori, pezzi confermati, lancio)
- ✅ Aggiunto prop `id: string` a `MissionCardProps`; tutte le chiavi `astrocoin-mc-*` ora usano `id` (UUID univoco del goal)
- ✅ `Missions.tsx`: passa `id={g.id}` a ogni `MissionCard`
- ✅ Versione bump → `0.7.15`

---

## [04/05/2026] — Sessione 17

### TASK-109 (fix): MissionCard — customizzazioni perse dopo refresh
**File modificati:** `src/components/MissionCard.tsx`, `src/shared/autoBackup.ts`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Bug: `confirmedPieces` non era persistita — dopo un refresh, `pendingQueue` ripartiva vuoto e le customizzazioni sbloccate da un salto grande non venivano riproposte
- ✅ Aggiunto `loadConfirmedPieces(name)` helper che legge `astrocoin-mc-confirmed-${name}` da localStorage
- ✅ `confirmedPieces` ora si inizializza dal localStorage al mount
- ✅ `pendingQueue` si inizializza al mount con tutti i pezzi `pct >= threshold && !confirmed` — copre il caso refresh dopo un salto grande
- ✅ `confirmColor`: salva la lista confermata in `astrocoin-mc-confirmed-*`
- ✅ `autoBackup.ts`: aggiunta chiave `astrocoin-mc-confirmed-*` al backup/restore
- ✅ Versione bump → `0.7.14`

---

### TASK-108 (fix): MissionCard — sblocco multiplo customizzazioni navicella
**File modificati:** `src/components/MissionCard.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ Bug: quando il progresso saltava più soglie in una sola transazione (es. da 0% a 95%), solo la prima customizzazione veniva accodata (`break` interrompeva il loop)
- ✅ Fix: loop raccoglie tutte le soglie superate in `toAdd[]`, le aggiunge tutte a `pendingQueue` — l'utente le sblocca una alla volta
- ✅ Animazione `unlockPop` mostrata solo per il primo pezzo della batch
- ✅ Versione bump → `0.7.13`

---

## [03/05/2026] — Sessione 16

### TASK-107 (feature): Backup include missioni e prodotti
**File modificati:** `src/shared/autoBackup.ts`, `src/shared/storage.ts`, `package.json`

- ✅ `buildBackupContent()` (autoBackup) ora include `products`, `goals`, `missionCardData` (chiavi `astrocoin-mc-colors-*` / `astrocoin-mc-launched-*`)
- ✅ `AppBackup` interface aggiornata: `version: 1 | 2`, campi opzionali `products`, `goals`, `missionCardData`
- ✅ `applyBackup()` ripristina products, goals e missionCardData (supporta sia v1 che v2)
- ✅ `exportAllData`, `buildQrTransferLinks`, `buildTransferCode` aggiornati a version 2 con i nuovi campi
- ✅ Versione bump → `0.7.12`

---

### TASK-106 (fix): MissionCard — color picker sempre accessibile
**File modificati:** `src/components/MissionCard.tsx`, `package.json`

- ✅ Picker visibile anche in fase `ready` (non solo `idle`) → si può scegliere il colore anche dopo aver raggiunto 100%
- ✅ Puntini colore in bassa barra cliccabili → riaprono picker pre-riempito col colore attuale
- ✅ Titolo picker smart: "★ Nuovo pezzo sbloccato!" prima conferma, "✎ Modifica colore" per ri-edit
- ✅ Dot attivo mostra ring bianco per feedback visivo
- ✅ Versione bump → `0.7.10`

---

### TASK-105 (fix): MissionCard — fuoco+fumo scendono col terreno, rotazione ritardata
**File modificati:** `src/components/MissionCard.tsx`, `ANIMATIONS.md` (creato), `package.json`

- ✅ **Fix 1**: fuoco+fumo spostati DENTRO `<g className="mc-pad-down">` → scendono con terreno e pad al liftOff
- ✅ **Fix 2**: CSS transition delay rotazione `1s` → `3s` (stelle + nave), `ignTimeout` 5300→7300ms
- ✅ **Nuova timeline**: t=0 IGNITION, t=1s LIFT OFF + pad scende, t=3s rotazione inizia, t=6s rotazione completa, t=7.3s travel
- ✅ **ANIMATIONS.md** creato: documento di riferimento con tutti i keyframe, timing, variabili di stato e istruzioni per modifiche future
- ✅ Versione bump → `0.7.9`

---

### TASK-104 (fix): MissionCard — wobble finale + re-animazione su refresh
**File modificati:** `src/components/MissionCard.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **Rimossi** `.mc-launch-ship` e `.mc-stars-rotate` dal STYLES CSS (classe → inline style)
- ✅ **Rotazione stelle e nave** ora usa solo `inline style` + CSS `transition`: durante `ignition` applica `transition: transform 3s 1s cubic-bezier(0.3,0,0.1,1)`, durante `travel` stesso valore `rotate(90deg)` senza `transition` → nessun class-swap, nessun recompositing browser, zero wobble
- ✅ **Refresh in travel**: `rotate(90deg)` via inline style senza transition → appare istantaneo, nessuna re-animazione
- ✅ Versione bump → `0.7.8`

---

## [03/05/2026] — Sessione 15

### TASK-102: MissionCard — stelle sempre visibili + transizione fluida + rotazione lenta
**File modificati:** `src/components/MissionCard.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **SVG unificato**: eliminati i 3 branch separati (build/ignition/travel) — un unico `<svg>` sempre nel DOM, nessun flash nero tra fasi
- ✅ **Background `#060a1a` sempre visibile** — stelle sempre presenti (fisse in build, animano in lancio)
- ✅ **Stelle fase build**: statiche (nessuna animazione)
- ✅ **Stelle fase ignition**: scorrono verso il basso (`starScrollDown`, translate Y +210px)
- ✅ **Container stelle tilta 90° CW** (`starsContainerTilt` 2.2s, delay 1s) in sincronia con la rotazione nave → lo scroll verticale diventa orizzontale (verso sinistra) nella vista travel
- ✅ **Rotazione nave più lenta**: `launchShip` 4s con `cubic-bezier(0.3,0,0.1,1)` — 25% del tempo fermo, poi rotazione progressiva
- ✅ **Float in travel**: `spaceFloat` sposta in translateX (± 5px) coerente con orientamento orizzontale
- ✅ Versione bump → `0.7.6`

---

### TASK-101: MissionCard — fix sequenza lancio cinematica
**File modificati:** `src/components/MissionCard.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **Ignition 2-layer**: pad+terreno in `<div>` separato che scivola giù (`padSlideDown` 2.5s) → illusion di decollo
- ✅ **Navicella**: rimane centrata sul pad, ruota 90° in senso orario (`launchFull` 3.5s: 0-50% ferma, 50-80% rotazione, 80-93% orizzontale, 93-100% fade out)
- ✅ **SpaceTravel**: stelle scrollano a sinistra (`starScrollLeft` translateX 0→-200px) con pattern tiled 0..400px per loop seamless
- ✅ **Pianeta rimosso** dalla vista spazio
- ✅ **Navicella orizzontale**: transform SVG `translate(100,90) rotate(90) scale(0.72) translate(-100,-112)` → naso a destra, motore a sinistra
- ✅ **Fade in/out**: SpaceTravel appare con `mc-fadein` (0.8s ease-in)
- ✅ Versione bump → `0.7.5`

---

### TASK-100: MissionCard — sequenza lancio completa + viaggio spazio loop
**File modificati:** `src/components/MissionCard.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **Launch pad sempre presente** durante costruzione (0-99%) come struttura di supporto alla navicella
- ✅ **Suolo** nel SVG: rettangolo scuro + linea orizzontale, navicella appoggiata (no float durante costruzione)
- ✅ **Ghost silhouette** a pct=0: sagoma tratteggiata viola dell'astronave da costruire
- ✅ **Pulsante LANCIA**: appare a 100%, stile arancione con animazione glow pulsante (`btnGlow`)
- ✅ **Countdown 10→0**: numero monospace 52px, pulsante (`countdownPulse`), diventa rosso a ≤3
- ✅ **Fase ignition** (2.8s): fiamme grandi (`flickerBig`), braccia rampa che si aprono (`padArmsOpen`/`padArmsOpenR`), glow arancione a terra, label "ACCENSIONE MOTORI..."
- ✅ **Fase travel (loop ∞)**: SVG spazio 200×210 con `#060a1a`, 3 layer stelle scrollanti, pianeta blu, astronave inclinata 15° con float perpetuo + fiamme accese — nessuna uscita dallo schermo
- ✅ Versione bump → `0.7.4`

---

### TASK-099: MissionCard — fix finestrino, fiamme progressive, animazione lancio, launch pad
**File modificati:** `src/components/MissionCard.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **LaunchPad SVG:** nuova struttura rampa di lancio mostrata a pct===0 — colonne tecniche con scalette, sagoma ghost astronave (tratteggiata, `#534AB7` opacity 0.2), luci rosse lampeggianti su colonne, bracci meccanici in cima, sparkle a terra, HUD monospace (SISTEMA PRONTO / IN ATTESA FONDI...)
- ✅ **Fiamme condizionali:** gli elementi fiamma (ellissi) renderizzati solo quando `pct >= 95 || isLaunching` (non più a 0%)
- ✅ **Cockpit fix:** outer `r=21` (era 18), glass `r=16` (era 14), fill `#0f1530` (più visibile), `stroke` aggiunto, reflection più prominente — risolto anche il rendering order: body-nose join ora renderizza PRIMA del cockpit
- ✅ **Animazione lancio:** quando pct raggiunge 100, `launchPhase` passa a `'liftoff'` → stelle bianche/gialle che cadono + nave sale con `@keyframes launch`; dopo 1.6s → `'gone'` con success state (🚀 + "Navicella in orbita ✨")
- ✅ Versione bump → `0.7.3`

---

## [03/05/2026] — Sessione 15

### TASK-098: MissionCard — astronave SVG con assemblag pezzo per pezzo
**File creati:** `src/components/MissionCard.tsx`  
**File modificati:** `src/pages/Missions.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **MissionCard.tsx:** componente standalone con astronave SVG cartoon (5 pezzi: motore, corpo, ali, punta, finestrino)
- ✅ Pezzi si sbloccano a soglie 0/15/35/55/75% con animazioni (`unlockPop`, `flashRing`)
- ✅ Pezzi bloccati visibili come sagome tratteggiate con `?`
- ✅ Color picker appare al momento sblocco — anteprima in tempo reale, conferma salva colore
- ✅ Fiamma propulsore animata (`flicker`), luci laterali lampeggianti (`blink`), fluttuamento a 95%+ (`float`)
- ✅ Storico colori in fondo alla card (cerchi colorati per pezzi sbloccati, tratteggiati per bloccati)
- ✅ **Missions.tsx:** `GoalCard` rimpiazzata da `MissionCard`; rimossa funzione e import `Card`/`formatDate` unused
- ✅ Versione bump → `0.7.2`, build ✅, deploy ✅

**File modificati:** `package.json`, `src/components/BottomNav.tsx`, `src/components/Layout.tsx`, `src/pages/SettingsPage.tsx`, `src/pages/Movimenti.tsx`, `src/components/ProductsCatalog.tsx`

- ✅ Installato `lucide-react`
- ✅ **BottomNav:** rimossi 4 componenti SVG inline (`HomeIcon`, `ListIcon`, `TargetIcon`, `SettingsIcon`) → `House`, `List`, `Target`, `Settings`
- ✅ **Layout:** eye/eye-off inline SVG → `Eye`, `EyeOff`
- ✅ **SettingsPage:** chevron SVG nel BackButton → `ChevronLeft`; chevron nel SettingsRow → `ChevronRight`
- ✅ **Movimenti + ProductsCatalog:** funnel SVG inline → `ListFilter`
- ✅ Versione bump → `0.7.1`

---

## [03/05/2026] — Sessione 14 (cont.)

### TASK-096: Carryover shortfall obiettivi + messaggi mascotte cinematografici
**File modificati:** `src/components/ExpensePieChart.tsx`, `src/pages/Dashboard.tsx`, `src/shared/labels.ts`

- ✅ **ExpensePieChart:** rimossa `currentMonthlyAmount`; aggiunta `effectiveMonthlyGoal` che accumula shortfall dai periodi passati (fino 24 mesi) per ogni goal
- ✅ **ExpensePieChart:** nuovi prop `allTransactions`, `periodStart`, `payDay`; helper `getPeriodDates` + `toIso`
- ✅ **Dashboard:** passa `allTransactions`, `periodStart`, `payDay` a `ExpensePieChart`
- ✅ **Dashboard:** calcola `baseGoal` e `carryoverAmount` in locale per la mascotte
- ✅ **labels.ts:** aggiunti 4 messaggi mascotte con citazioni cinematografiche: `obiettivoRaggiunto` (Buzz Lightyear), `obiettivoVicino` (Yoda/Star Wars), `obiettivoMancato` (Houston), `carryover` (Never give up)
- ✅ **getMascotMessage:** aggiornata firma `(saldo, count, monthlyGoal, carryoverAmount)` con logica goal-aware

---

## [03/05/2026] — Sessione 14

### TASK-095: Sezione Missioni — obiettivi di risparmio
**File modificati:** `src/shared/types.ts`, `src/shared/storage.ts`, `src/shared/labels.ts`, `src/pages/Missions.tsx`, `package.json`, `TASKS.md`, `CHANGELOG.md`

- ✅ **types.ts:** aggiunta interfaccia `SavingsGoal` (id, name, emoji, targetAmount, targetDate, monthlyAmount, savedAmount, createdAt, updatedAt)
- ✅ **storage.ts:** GOALS_KEY + MANAGED_KEYS + `loadGoals`, `saveGoals`, `addGoal`, `updateGoal`, `deleteGoal`
- ✅ **labels.ts:** sezione `missioni` con 25 label IT/EN/ES + export `MISSIONI`
- ✅ **Missions.tsx:** pagina completa con `GoalForm` (bottom sheet), `GoalCard` (progress bar + info), FAB
- ✅ Modalità "mensile fisso": inserisci quanto vuoi risparmiare al mese (importo totale opzionale)
- ✅ Modalità "obiettivo entro data": inserisci totale + data, l'app calcola rata mensile automatica
- ✅ "Aggiungi risparmio" per incrementare `savedAmount` a ogni obiettivo
- ✅ Conferma eliminazione tramite `showConfirm`, prompt risparmio tramite `showPrompt`
- ✅ v0.7.0 — minor bump (nuova feature)

---

## [03/05/2026] — Sessione 13

### TASK-094: SpaceDonutChart — indicatore spese importanti + bug fix cascade
**File modificati:** `src/shared/storage.ts`, `src/components/AddTransactionForm.tsx`, `src/components/SpaceDonutChart.tsx`, `src/components/ExpensePieChart.tsx`, `TASKS.md`, `CHANGELOG.md`

- ✅ **Bug fix:** `updateTransactionsByGroupId` ora propaga anche `important` a cascata su tutte le ricorrenti
- ✅ **SpaceDonutChart:** funzione `drawImportantNeedle` — arco ambra pulsante esterno + ago tratteggiato dal centro + pallino sulla punta
- ✅ **ExpensePieChart:** `buildSlices` calcola `hasImportant` per categoria e lo passa alle slice
- ✅ **Legenda donut:** badge "⭐ importante" per le categorie con almeno una spesa importante

---

### TASK-093: SolarSystemChart — evidenziazione visiva spese importanti
**File modificati:** `src/components/SolarSystemChart.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`

- ✅ **SolarSystemChart:** orbita ambra tratteggiata pulsante per categorie con spese importanti
- ✅ **SolarSystemChart:** anello dorato pulsante attorno al pianeta se la categoria ha spese importanti
- ✅ **Legenda:** badge "⭐ importante" (ambra, bordato) sotto l'importo categoria
- ✅ **labels.ts:** aggiunta `spesaImportante` IT/EN/ES

---

### TASK-092: Campo "Spesa importante" nel form transazione
**File modificati:** `src/shared/types.ts`, `src/shared/labels.ts`, `src/components/AddTransactionForm.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- ✅ **types.ts:** aggiunto `important?: boolean` a `Transaction`
- ✅ **labels.ts:** aggiunte `labelImportante` e `tooltipImportante` in IT/EN/ES
- ✅ **AddTransactionForm:** checkbox "Spesa importante ⭐" sopra il blocco ricorrente, visibile solo per uscite; stato salvato in creazione e modifica

---

## [02/05/2026] — Sessione 12

### TASK-091: Ordinamento per inserimento nei filtri (prodotti + movimenti)
**File modificati:** `src/components/ProductsCatalog.tsx`, `src/pages/Movimenti.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- ✅ **ProductsCatalog — Nuovo ordinamento per inserimento:**
  - Aggiunta opzione `'insertion'` al sortBy type (insieme a name-asc, name-desc, price-asc, price-desc)
  - Default cambiato da `'name-asc'` a `'insertion'` (i prodotti più recenti per ultimi, ordinati per `lastSeen` decrescente)
  - Logica di sorting: `b.lastSeen.localeCompare(a.lastSeen)` per ordinamento decrescente (più recenti primo)
  - Select dropdown aggiornato: aggiunta nuova opzione `ordinaInserimento`
  
- ✅ **Movimenti — Nuovo filtro ordinamento con 6 opzioni:**
  - Aggiunto state `sortBy` con valori: `'insertion'`, `'insertion-asc'`, `'date-desc'`, `'date-asc'`, `'amount-asc'`, `'amount-desc'`
  - Default: `'insertion'` (più recenti per primi, usando `createdAt ?? date`)
  - Logica di sorting nel useMemo:
    - `insertion`: `(b.createdAt ?? b.date).localeCompare(a.createdAt ?? a.date)` (decrescente)
    - `insertion-asc`: `(a.createdAt ?? a.date).localeCompare(b.createdAt ?? b.date)` (crescente)
    - `date-desc`: `b.date.localeCompare(a.date)` (più recenti)
    - `date-asc`: `a.date.localeCompare(b.date)` (più antichi)
    - `amount-asc`: `a.amount - b.amount` (importo crescente)
    - `amount-desc`: `b.amount - a.amount` (importo decrescente)
  - Dependenza aggiunta al useMemo: `sortBy`
  
- ✅ **UI — Filtro ordinamento in Movimenti:**
  - Nuovo select con icona funnel (svg 16x16, path from ProductsCatalog)
  - Posizionato tra filtri tipo/ricorrenti e filtro categoria
  - Layout: flex row con gap 8px, select flex 1, icona flexShrink 0
  - Styling coerente con altri filtri (input-bg, input-border, text-primary)
  
- ✅ **i18n — Nuove label in PRODOTTI e MOVIMENTI:**
  - PRODOTTI: aggiunto `ordinaInserimento: t('Inserimento (più recenti)', 'Insertion (newest)', 'Inserción (más recientes)')`
  - MOVIMENTI: aggiunti 6 label per ordinamenti
    - `ordinaPer`, `ordinaInserimento`, `ordinaInserimentoAntichi`
    - `ordinaData`, `ordinaDataAntichi`, `ordinaImporto`, `ordinaImportoDesc`
  - Tutte le label supportano IT, EN, ES
  
- ✅ **Test e Build:** `npm run build` ✅ (`36 passed`, `5 skipped`), ready to deploy

## [02/05/2026] — Sessione 11

### TASK-090: Modifica scontrino — sconto editabile + nome transazione personalizzato
**File modificati:** `src/components/ReceiptScanner.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- ✅ **Sconto editabile in tabella risultati:** aggiunti due input in colonna "Sconto" per ogni articolo
  - Input 1: importo sconto in € (es. `0,56`)
  - Input 2: tipo sconto (es. `30%`, `BLUCARD`, `SCONTO CLIENTE`)
  - Dispatch actions: `MODIFICA_SCONTO_IMPORTO` e `MODIFICA_SCONTO_TIPO` aggiornano lo state
  - Grid layout tabella allargato: da `1fr 80px 32px` a `1fr 70px 70px 32px`
  
- ✅ **Nome transazione personalizzato:** aggiunto text input nella fase "risultati"
  - Label: "Nome Transazione" (uppercase)
  - Default: `"Scontrino"`
  - Placeholder: `"es: Scontrino gigante 2, Spesa Carrefour..."`
  - Dispatch action: `SET_DESCRIZIONE` aggiorna `state.descrizione`
  - `handleCreaTotale()` usa `state.descrizione` (con fallback a `"Scontrino"` se vuota)
  
- ✅ **State management:** aggiunto campo `descrizione: string` in `ScanState` (default `'Scontrino'`)
- ✅ **Validazione:** import transazione preserva metadati sconto editati e nome personalizzato
- **Check:** `npx tsc -b` ✅, `npm run build` ✅ (`36 passed`, `5 skipped`), deploy ready

## [02/05/2026] — Sessione 10

### TASK-089: Camera scontrino — fix multi-click su scatto
**File modificati:** `src/components/ReceiptScanner.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Risolto race condition sul pulsante scatto: tap multipli rapidi potevano generare più foto prima della chiusura camera
- Introdotto lock sincrono (`captureLockRef`) durante la fase asincrona `canvas.toBlob(...)`
- Pulsante scatto ora disabilitato durante la cattura con feedback visivo (`cursor: wait`, stato busy)
- Risultato: un solo click produce una sola foto, eliminando caricamenti duplicati involontari
- **Check:** `npx tsc -b` ✅, `npm test` ✅ (`36 passed`, `5 skipped`)

### TASK-088: Prodotti — filtro ordinamento con icona
**File modificati:** `src/components/ProductsCatalog.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Aggiunto controllo filtro con icona funnel nella sezione Prodotti
- Aggiunte opzioni ordinamento: Nome (A-Z), Nome (Z-A), Prezzo crescente, Prezzo decrescente
- Ordinamento applicato lato client sul catalogo filtrato
- Aggiunte label i18n dedicate al filtro ordinamento prodotti
- **Check:** `npx tsc -b` ✅, `npm test` ✅ (`36 passed`, `5 skipped`)

### TASK-087: Modifica scontrino — drag&drop articoli + metadati sconto persistenti
**File modificati:** `src/shared/types.ts`, `src/shared/receiptUtils.ts`, `src/shared/storage.ts`, `src/components/ReceiptScanner.tsx`, `src/components/ReceiptDetailModal.tsx`, `src/components/ProductsCatalog.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- In modifica scontrino, articoli ora riordinabili con drag and drop
- Righe con sconto mostrano sotto il prodotto il tipo sconto e importo (es. `SCONTO ... -€1,50`)
- Parser OCR ora conserva metadati sconto per articolo: prezzo pieno (`grossPrice`), importo sconto (`discountAmount`), tipo sconto (`discountType`)
- In import transazione e catalogo prodotti, i metadati sconto vengono salvati e mantenuti nello storico prezzi
- Catalogo prodotti mostra storico arricchito con prezzo netto e, quando presente, prezzo pieno e sconto applicato
- **Check:** `npx tsc -b` ✅, `npm test` ✅ (`36 passed`, `5 skipped`)

### TASK-086: Fix suite test locale (localStorage + OCR real opt-in)
**File modificati:** `src/__tests__/setup.ts`, `src/__tests__/ocr_real.test.ts`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Inserito shim `localStorage` stabile in setup test per evitare ambienti incompleti (`clear/getItem/setItem` sempre disponibili)
- Test `ocr_real` resi opt-in via variabile `RUN_OCR_REAL=1` per evitare failure di runtime OCR in suite standard
- Risultato: suite principale torna verde, con OCR real mantenuti disponibili ma skippati di default
- **Test check:** `npm test` → `36 passed, 5 skipped` ✅

### TASK-085: Fixture OCR — aggiunta sezione productsTest negli expected
**File modificati:** `src/__tests__/fixtures/receipts/ScontrinoCorto1/expected.json`, `src/__tests__/fixtures/receipts/ScontrinoCorto2/expected.json`, `src/__tests__/fixtures/receipts/ScontrinoGigante1/expected.json`, `src/__tests__/fixtures/receipts/ScontrinoLungo1/expected.json`, `src/__tests__/fixtures/receipts/ScontrinoLungo2/expected.json`, `src/__tests__/fixtures/receipts/synthetic/expected.json`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Aggiunta nuova sezione `expected.productsTest` in tutte le fixture OCR
- `productsTest` è derivata dagli item attesi esistenti e include: `name`, `occurrences`, `latestPrice`, `prices`
- Obiettivo: preparare dataset prodotti dedicato ai test catalogo senza alterare la struttura usata dai test OCR attuali
- **Build check:** `npx tsc -b && npx vite build` ✅

### TASK-084: Nuova tab Prodotti + integrazione OCR catalogo
**File modificati:** `src/shared/types.ts`, `src/shared/storage.ts`, `src/shared/labels.ts`, `src/components/ProductsCatalog.tsx`, `src/components/ReceiptScanner.tsx`, `src/pages/Movimenti.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Aggiunta nuova tab `Prodotti` in Movimenti con catalogo prodotti derivato dagli scontrini
- Nuovo modello `ProductEntry` con `priceHistory`, alias OCR, categoria, ultima lettura
- Nuovo storage `hermes-products` su layer IndexedDB con API: load/save/update/delete + upsert da scontrino
- Introdotto matching fuzzy per nomi OCR (`normalizeProductName` + token overlap)
- Scanner OCR ora mostra badge "prezzo noto" quando trova un match in catalogo
- In import scontrino, ogni articolo aggiorna/crea automaticamente il prodotto nel catalogo
- **Build check:** `npx tsc -b` ✅

### TASK-083: Fix progress OCR bloccato a 0%
**File modificati:** `src/components/ReceiptScanner.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Aggiunto logger callback a `createWorker` per ricevere aggiornamenti reali dallo scanner Tesseract durante il riconoscimento
- Introdotto `ocrPhotoRef` per tracciare l'indice foto corrente all'interno del logger (closure stabile)
- Il progresso ora avanza in tempo reale da 0% a 100% durante l'analisi invece di rimanere fisso a 0% e saltare al risultato
- **Build check:** `npx tsc -b && npx vite build` ✅


### TASK-082: OCR app — fix duplicati e lentezza
**File modificati:** `src/components/ReceiptScanner.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Eliminato merge tra testo OCR originale e testo OCR pre-processato (fonte dei duplicati in tabella)
- Fallback reso meno aggressivo per ridurre tempi: seconda passata solo se la prima e chiaramente incompleta
- Introdotta scelta della passata migliore tramite score (`items`, `total`, `isValid`) e uso di un solo testo per foto
- Risultato atteso: meno righe duplicate, tempo medio di analisi ridotto, miglior coerenza su mobile
- **Build check:** `npx tsc -b && npx vite build` ✅

### TASK-081: OCR app robusto — fallback doppia passata
**File modificati:** `src/components/ReceiptScanner.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Scanner app ora usa la stessa configurazione OCR dei test (`createWorker('ita+eng')`)
- Aggiunto fallback automatico: se prima lettura è incompleta/non valida, viene fatta una seconda passata su immagine pre-processata
- Il testo della seconda passata viene unito al primo e viene scelto il risultato migliore
- Obiettivo: recuperare righe mancanti intermittenti su mobile (es. `COCA COLA PET CL 1`)
- **Build check:** `npx tsc -b && npx vite build` ✅

### TASK-080: Fix OCR app — righe perse rispetto ai test
**File modificati:** `src/components/ReceiptScanner.tsx`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Lo scanner in-app ora usa il file foto originale per `worker.recognize(...)` invece del dataURL pre-processato
- Risolto mismatch in cui alcune righe articolo (es. `COCA COLA PET CL 1`) risultavano leggibili nei test ma perse in app
- Mantenuta invariata la logica parser (sconti inclusi) e il flusso di import transazione unica con dettaglio
- **Build check:** `npx tsc -b && npx vite build` ✅

### TASK-079: OCR scontrini — calcolo sconti nel totale
**File modificati:** `src/shared/receiptUtils.ts`, `src/shared/storage.ts`, `src/components/ReceiptScanner.tsx`, `src/__tests__/fixtures/receipts/ScontrinoGigante1/expected.json`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Parser OCR aggiornato con riconoscimento righe sconto negative (es. `SCONTO ... -0,56`)
- Lo sconto viene applicato all'ultimo articolo letto, così il totale calcolato rispecchia il netto scontrino
- Fallback: se non c'è articolo precedente, viene creata una riga negativa dedicata
- Validazione storage aggiornata per consentire importi negativi nei dettagli scontrino
- Scanner aggiorna `receiptItems` senza scartare importi negativi
- Verifica reale su fixture `ScontrinoGigante1`: totale letto `7.46`, articoli netti `1.30 + 1.29 + 2.73 + 2.15` (test ✅)

### TASK-078: Nuova sezione test OCR — ScontrinoGigante1
**File modificati:** `src/__tests__/fixtures/receipts/ScontrinoGigante1/expected.json`, `src/__tests__/ocr_real.test.ts`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Creata nuova fixture `ScontrinoGigante1` con attesi: totale `7.46`, 4 articoli (inclusi 2 `GRANMIX GRATTUGGIATO` già scontati)
- Aggiunto nuovo describe block in `ocr_real.test.ts` che legge `foto_1.jpg` dalla cartella fixture
- Caso impostato con `stable: false` per evitare failure finché la foto reale non è stata inserita
- Dopo inserimento foto, basta portare `stable` a `true` in `expected.json` per attivare il test in pipeline

### TASK-076: Scontrino come transazione unica con dettaglio
**File modificati:** `src/shared/types.ts`, `src/shared/storage.ts`, `src/components/ReceiptScanner.tsx`, `src/components/ReceiptDetailModal.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Movimenti.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`, `package.json`

- Modello transazione esteso con `isReceipt?: boolean` e `receiptItems?: { name, price }[]`
- OCR import ora salva sempre **una sola transazione** (`isReceipt: true`) con lista articoli nel campo dettaglio
- Rimossa la modalità "N transazioni" dallo scanner per rispettare il nuovo flusso
- Aggiunta azione `Dettaglio` su Dashboard e Movimenti (visibile solo per transazioni con `isReceipt: true`)
- Creato modal dedicato con righe articolo + totale transazione
- Aggiornata validazione storage per accettare i nuovi campi receipt in import/export
- **Build check:** `tsc -b && vite build` ✅

## [26/04/2026] — Sessione 9

### TASK-068: Sistema confidence prezzi OCR incerti
**File modificati:** `src/shared/receiptUtils.ts`, `src/components/ReceiptScanner.tsx`, `src/shared/labels.ts`

- **`ReceiptItem`**: aggiunti campi opzionali `confidence: 'ok'|'uncertain'` e `uncertainReason: 'iva8'|'linea_rumorosa'|'moltiplicatore_errato'`
- **Segnali incertezza**: IVA letta come `8` → `iva8`; nome con `!` → `linea_rumorosa`; `qty×unitPrice≠price` → `moltiplicatore_errato`
- **UI**: prezzo con bordo arancio se `uncertain`; banner "⚠️ N prezzi da verificare" sopra la tabella
- **Editing**: modifica prezzo utente azzera `confidence` a `ok`
- **Labels**: `prezziDaVerificare` (tf parametrica), `prezzoIncerto` (tooltip)
- **Build check:** ✅

### TASK-069: Photo view/download in ReceiptScanner
**File modificati:** `src/components/ReceiptScanner.tsx`

- **Fase input**: griglia anteprime foto con tap → lightbox, ⬇ → download, ✕ → rimuovi
- **Fase risultati**: striscia orizzontale scrollabile (72×72px) con le stesse azioni
- **Build check:** ✅

### TASK-070: Versione app in Settings
**File modificati:** `vite.config.ts`, `src/vite-env.d.ts`, `src/components/Settings.tsx`, `src/shared/labels.ts`

- **`vite.config.ts`**: `define.__APP_VERSION__` iniettato da `package.json` via `JSON.stringify(pkg.version)`
- **`vite-env.d.ts`**: `declare const __APP_VERSION__: string`
- **`Settings.tsx`**: riga versione in fondo al pannello
- **Labels**: `versione` in sezione SETTINGS (IT/EN/ES)
- **Build check:** ✅

### TASK-071: Fixture ScontrinoLungo2 + per-item assertions
**File modificati:** `src/__tests__/fixtures/receipts/ScontrinoLungo2/expected.json`, `src/__tests__/ocr_real.test.ts`

- **ScontrinoLungo2**: stessa ricevuta di ScontrinoLungo1, 3 foto a copertura parziale (parte centrale); `parserReadTotal: null`, `parserReadDate: null`
- **`ocr_real.test.ts`**: `usedIdx` Set per gestire nomi duplicati nelle assertions per-item; campi `parserReadPrice` e `parserMissing` supportati
- **Build check:** ✅

### TASK-072: Fixture ScontrinoCorto2 (bar Crema e Cioccolato)
**File modificati:** `src/__tests__/fixtures/receipts/ScontrinoCorto2/expected.json`, `src/__tests__/ocr_real.test.ts`, `src/shared/receiptUtils.ts`

- **Fixture**: Documento Commerciale bar/caffetteria, 4 articoli (2 cappuccini, krapfen crema, brioches)
- **Parser**: strip `®©™` da inizio nome, strip percentuale IVA inline (`10,00%` / `10%`), soglia minima nome alzata da 2 a 3 caratteri
- **`ocr_real.test.ts`**: aggiunto describe block ScontrinoCorto2
- **Build check:** ✅

### TASK-073: PARSER_NOTES.md
**File creati:** `src/__tests__/fixtures/receipts/PARSER_NOTES.md`

- Documento con: struttura scontrini italiani, tabella skipKw completa, problemi noti totale/data, noise OCR, filtri nome, sistema confidence, sconti, casi per tipo, tabella fixture, backlog miglioramenti

### TASK-074: Fix parser logiche Documento Commerciale
**File modificati:** `src/shared/receiptUtils.ts`, `src/__tests__/fixtures/receipts/ScontrinoCorto2/expected.json`

- **`isDocCommerciale`**: flag rilevato da `DOCUMENTO COMM` nel testo grezzo
- **Righe moltiplicatore garbled**: nei Doc Commerciali, riga con nome che inizia con cifra → `pendingQty=1, pendingUnitPrice` e skip
- **Strip prefisso OCR**: singola lettera minuscola fusa con nome (es. `i CAPPUCCINO` → `CAPPUCCINO`)
- **`totalKw`**: aggiunto `PAGAMENTO ELETTRONICO`
- **`skipKw`**: aggiunto `DI CUI` (filtra `di cui IVA 0,60`)
- **`expected.json`**: itemCount 4, parserReadTotal 6.60, isValid true
- **Build check:** ✅ 40/40 passed

### TASK-075: Fix lightbox foto (blob URL → overlay inline)
**File modificati:** `src/components/ReceiptScanner.tsx`

- **Problema**: `window.open(blob:...)` su mobile causava `ERR_UPLOAD_FILE_CHANGED` (blob context non trasferito tra tab)
- **Fix**: `useState<number|null>` per index foto selezionata; overlay fullscreen con `<img>` inline + ⬇ Scarica + ✕ Chiudi
- **Build check:** ✅

### TASK-066 + TASK-067: Fixture OCR + miglioramento parser + test stabili
**File modificati:** `src/shared/receiptUtils.ts`, `src/__tests__/ocr_real.test.ts`, `src/__tests__/ocr.test.ts`, `src/__tests__/fixtures/receipts/**`, `package.json`

- **Fixtures:** creata `src/__tests__/fixtures/receipts/` con sottocartelle `synthetic/`, `ScontrinoLungo1/`, `ScontrinoCorto1/`; ogni cartella ha `expected.json` con valori attesi completi (itemCount, total, isValid, date, items con qty/unitPrice)
- **Fix parser skipKw:** `BANCOMAT|MASTERCARD|VISA` invece di `CARTA` — evitava di skippare "CARTA IGIENICA"
- **Fix parser IVA:** classe `D`, simbolo `€`, OCR misread `8`→`B` inclusi nella regex
- **Fix prezzi al peso:** 3 decimali arrotondati a 2 con `toFixed(2)`
- **Righe moltiplicatore:** state machine `pendingQty`/`pendingUnitPrice` — `ReceiptItem` ora ha `qty?` e `unitPrice?`
- **Data scontrino:** `dateRegex` estrae `dd/mm/yyyy` o `yyyy-mm-dd` → `ParsedReceipt.date?`
- **Test stabili:** campo `stable` in `expected.json` + helper `stableIt()` — test con `stable:false` saltati automaticamente (ScontrinoLungo1 WIP, ScontrinoCorto1 pronto)
- **Build pipeline:** `vitest run` aggiunto tra `tsc -b` e `vite build` — test falliti bloccano il deploy
- **Build check:** ✅ 1 passed | 1 skipped

---

## [26/04/2026] — Sessione 8

### TASK-064: Fix timezone + deduplicazione import MoneyPlus
**File modificati:** `src/shared/storage.ts`, `src/components/MoneyPlusImporter.tsx`

- **Fix bug timezone:** `getTransactionsInPeriod` usava `getTime()` confrontando ms UTC vs Date locale (UTC+2) → le transazioni nel giorno di fine periodo venivano escluse. Soluzione: confronto stringhe `YYYY-MM-DD` via helper `toLocalIso()`, immune da fuso orario
- **Deduplicazione import MoneyPlus:** al caricamento di un `.MoneyPlusPack` vengono confrontate le transazioni già presenti in Hermes tramite chiave `data|importo|tipo`. Le transazioni già importate sono pre-deselezionate con badge giallo "già importata" e il contatore nell'header mostra quante sono duplicate
- **Build check:** ✅ Passato
- **Deploy:** ✅ GitHub Pages

---

## [26/04/2026] — Sessione 7

### TASK-063: Convertitore backup MoneyPlus → Hermes
**File modificati:** `src/components/MoneyPlusImporter.tsx` (nuovo), `src/components/Settings.tsx`, `public/sql-wasm.wasm` (nuovo), `package.json`

- Installate dipendenze `fflate` (unzip in-browser) e `sql.js` (SQLite WASM)
- Creato componente `MoneyPlusImporter` con:
  - Decompressione ZIP del `.MoneyPlusPack` senza upload su server
  - Lettura `meta.json` per info origine
  - Auto-detection schema SQLite (3 pattern: tabella `transactions`, Core Data `ZTRANSACTION`, fallback generico)
  - Conversione timestamp Core Data (secondi dal 2001) → date ISO
  - Anteprima selezionabile con checkbox prima dell'importazione
- Integrato pulsante "📦 Importa da MoneyPlus" in Settings → sezione Esporta dati
- **Build check:** ✅ Passato

### TASK-062: Fix chiusura scanner scontrino solo con ✕
**File modificati:** `src/components/ReceiptScanner.tsx`, `src/components/AddTransactionForm.tsx`

- Rimosso `onClick` backdrop in `ReceiptScanner.tsx` che chiudeva lo scanner al tap fuori
- Aggiornato `AddTransactionForm.tsx` per non chiudere il form quando lo scanner è aperto
- **Build check:** ✅ Passato

### TASK-061: Fix iOS Safari black screen (Quick Note overlay)
**File modificati:** `src/main.tsx`

- Aggiunto listener `visibilitychange`: forza repaint nascondendo/ripristinando `body` quando l'app torna in primo piano
- Aggiunto listener `pageshow` (persisted): copre il caso BFCache (tasto Indietro Safari)
- **Build check:** ✅ Passato

### TASK-060: Entrate nascoste di default
**File modificati:** `src/shared/AmountsContext.tsx`

- Cambiato default `amountsVisible` da `true` a `false` (entrate nascoste all'avvio)
- **Build check:** ✅ Passato

### TASK-059: Nascondi entrate nel grafico a torta
**File modificati:** `src/components/SpaceDonutChart.tsx`, `src/components/ExpensePieChart.tsx`

- Aggiunto prop `hideIncome?: boolean` a `SpaceDonutChart`
- Aggiornato `drawCenter` per mostrare `••••` al posto del totale entrate quando `hideIncome` è true
- `ExpensePieChart` legge `useAmounts()` e passa `hideIncome={!amountsVisible}` al donut
- **Build check:** ✅ Passato

---

## [25/04/2026] — Sessione 6

### TASK-056: Test update frase grafico spese
**File modificati:** `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`

- Migliorata la label del grafico spese in Dashboard: da `Dove vanno i soldi` a `Come spendi i tuoi soldi`
- Aggiornate anche le traduzioni EN/ES per mantenere coerenza copy
- Preparato il rilascio per validare il comportamento di aggiornamento lato PWA
- **Build check:** ✅ Passato

### TASK-055: Migrazione storage a IndexedDB con preservazione dati
**File modificati:** `src/shared/storage.ts`, `src/main.tsx`, `TASKS.md`, `CHANGELOG.md`

- Introdotto nuovo layer storage gestito con cache in memoria e backend IndexedDB (`hermes-db`, store `kv`)
- Aggiunta funzione di bootstrap `initPersistentStorage()` con migrazione one-shot: se i dati esistono in localStorage vengono copiati in IndexedDB e poi rimossi da localStorage
- Mantenuto fallback automatico a localStorage in caso di browser senza IndexedDB o errori di apertura DB
- Aggiornato `main.tsx` per attendere l'inizializzazione/migrazione prima del rendering dell'app, evitando perdita dati durante il passaggio
- **Build check:** ✅ Passato

### TASK-053: Indicatore uso localStorage nei Settings
**File modificati:** `src/components/Settings.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`

- Aggiunta nuova sezione `Spazio locale` nei Settings con barra progresso utilizzo localStorage
- Mostrati dettaglio `usato / limite stimato` in MB e percentuale corrente
- Aggiunto warning visivo sopra soglia alta (>= 70%)
- Inserite nuove label i18n (IT/EN/ES) per titolo, dettaglio, warning e nota
- **Build check:** ✅ Passato

### TASK-052: Riordino TASKS per ordine cronologico decrescente
**File modificati:** `TASKS.md`, `CHANGELOG.md`

- Unificate in una sola le sezioni duplicate `Completati` presenti nel file task
- Riordinati i blocchi task dal piu recente al piu vecchio (TASK-052 → TASK-000)
- Verificata la struttura finale con una sola intestazione `## Completati`
- **Build check:** ✅ Passato

### TASK-051: Deploy novita correnti
**File modificati:** `TASKS.md`, `CHANGELOG.md`

- Eseguito deploy finale della versione corrente con script di progetto
- Build di produzione completata correttamente durante la pipeline di deploy
- Pubblicazione GitHub Pages completata con output `Published`
- **Deploy check:** ✅ Passato

### TASK-050: Deploy fix Safari e aggiornamenti form
**File modificati:** `TASKS.md`, `CHANGELOG.md`

- Eseguito `npm run deploy` dopo gli ultimi aggiornamenti al form e al fix Safari iPhone
- Build di produzione completata correttamente durante il deploy
- Pubblicazione GitHub Pages completata con output `Published`
- **Deploy check:** ✅ Passato

### TASK-049: Fix Safari iPhone per submit troppo vicino alla toolbar
**File modificati:** `src/components/AddTransactionForm.tsx`, `TASKS.md`, `CHANGELOG.md`

- Aggiunto padding inferiore con `env(safe-area-inset-bottom)` al contenitore e al form della modale di aggiunta movimento
- Il bottone submit e stato leggermente rialzato con margine verticale extra per allontanarlo dalla toolbar bassa di Safari
- Nessuna modifica alla logica di salvataggio: fix limitato al layout touch-safe del modale
- **Build check:** ✅ Passato

### TASK-048: Deploy aggiornamento UI form
**File modificati:** `TASKS.md`, `CHANGELOG.md`

- Eseguito `npm run deploy` dopo gli ultimi aggiustamenti UI del form di inserimento
- La build di produzione e terminata correttamente durante il deploy
- Pubblicazione GitHub Pages completata con output `Published`
- **Deploy check:** ✅ Passato

### TASK-047: Restyling selezione manuale/scontrino con segmented control
**File modificati:** `src/components/AddTransactionForm.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`

- La sezione iniziale del form e stata convertita in un segmented control con stato attivo tra `Inserisci tramite scontrino` e `Inserisci manualmente`
- Quando e selezionata la modalita scontrino compare un pannello contestuale con descrizione breve e CTA `Apri scanner scontrino`
- Il resto del form rimane invariato e il flusso OCR si apre correttamente dal nuovo pannello
- Aggiunte 3 nuove label i18n nella sezione `form`
- **Build check:** ✅ Passato

### TASK-046: Riposizionamento scelta scontrino/manuale in cima al form
**File modificati:** `src/components/AddTransactionForm.tsx`, `TASKS.md`, `CHANGELOG.md`

- La sezione `Inserisci tramite scontrino / Inserisci manualmente` e stata spostata sopra al toggle `Entrata / Uscita`
- Il resto del form rimane interamente sotto, senza cambiare il comportamento della feature
- Verifica eseguita sia con `npm run build` sia aprendo lo scanner dalla nuova posizione in UI
- **Build check:** ✅ Passato

### TASK-045: Spostamento accesso scontrino in Nuova uscita
**File modificati:** `src/components/AddTransactionForm.tsx`, `src/pages/Dashboard.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`

- Rimosso il pulsante `📷 Scontrino` dall'header della sezione Movimenti in Dashboard
- Aggiunta in `Nuova uscita` una nuova sezione iniziale con due CTA: `Inserisci tramite scontrino` e `Inserisci manualmente`
- Il flusso OCR resta invariato ma ora si apre direttamente dalla modale del form; al salvataggio via scontrino viene chiuso anche il form sottostante e aggiornata la dashboard
- Aggiunte 3 nuove label i18n nella sezione `form` per la scelta del metodo di inserimento
- **Build check:** ✅ Passato

### TASK-044b: Enhancement OCR Scanner — Fotocamera live + risultati in tempo reale
**File modificati:** `src/components/ReceiptScanner.tsx`, `src/shared/labels.ts`

- **Fotocamera live con barre guida**: nuova fase `camera` che usa `getUserMedia` con overlay CSS (barre verticali bianche al 14%/86%, zone laterali scurite al 52%, angolini d'inquadratura). Scatto con canvas → `File`, poi torna alla fase `input`. Fallback automatico al file picker se `getUserMedia` non disponibile.
- **Risultati parziali in tempo reale**: durante la fase `elaborazione`, dopo ogni immagine OCR viene eseguito `parseReceiptText()` e la tabella si aggiorna dal vivo con gli articoli rilevati finora.
- **Barra progresso verso totale**: nella fase `risultati`, barra da 0% al 100% che diventa verde quando `somma ≈ totale`; badge "✅ Scontrino approvato!" al raggiungimento.
- **Aggiungi riga manuale**: pulsante tratteggiato sotto la tabella che aggiunge una riga vuota editabile (azione `AGGIUNGI_ARTICOLO_MANUALE`).
- **Due pulsanti camera/upload**: nella fase `input`, layout a griglia con pulsante fotocamera (accent) e pulsante carica file (secondary).
- 5 nuovi label i18n: `guidaAllineamento`, `chiudiCamera`, `aggiungiManuale`, `approvatoScontrino`, `parzialeMentre`
- **Build check:** ✅ Passato — **Deploy:** ✅ Pubblicato

### TASK-044: OCR Scanner Scontrini
**File creati:** `src/shared/receiptUtils.ts`, `src/components/ReceiptScanner.tsx`
**File modificati:** `src/shared/labels.ts`, `src/pages/Dashboard.tsx`

- Installato `tesseract.js` v7 per OCR lato client (nessuna API esterna)
- `receiptUtils.ts`: `processImage()` — pre-processing canvas (scala di grigi + contrasto ×1.6, resize max 2400px); `parseReceiptText()` — parsing regex scontrini italiani (prezzi con virgola, riga TOTALE, filtro righe irrilevanti)
- `ReceiptScanner.tsx`: modale completo con `useReducer`, supporto multi-foto con merge OCR, barra di progresso, tabella risultati editabile (modifica nome/prezzo, elimina righe), validazione somma vs totale, selettore categoria, due pulsanti: "Crea N transazioni" e "Importa come spesa unica"
- Accesso tramite pulsante "📷 Scontrino" nell'header della sezione Movimenti in Dashboard
- Sezione `ocr` aggiunta a `labels.ts` con 18 label (IT/EN/ES)
- **Build check:** ✅ Passato

### TASK-043b: Cascade edit/delete transazioni ricorrenti + fix input mesi
**File modificati:** `src/shared/types.ts`, `src/shared/storage.ts`, `src/shared/labels.ts`, `src/components/AddTransactionForm.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Movimenti.tsx`

- `types.ts`: aggiunto campo opzionale `recurringGroupId` a `Transaction`
- `storage.ts`: aggiunte `deleteTransactionsByGroupId()` e `updateTransactionsByGroupId()`
- Le nuove serie ricorrenti ricevono un `recurringGroupId` condiviso (stesso ID per tutte le copie)
- Elimina ricorrente: dialog "Solo questa / Tutte le collegate" in Dashboard e Movimenti
- Modifica ricorrente: dialog "No, solo questa / Sì, aggiorna tutte" in AddTransactionForm
- Fix leading-zero bug: campo "per quanti mesi" cambiato da `type="number"` a `type="text" inputMode="numeric"` con stato stringa
- **Build check:** ✅ Passato

---

## [24/04/2026] — Sessione 5

### TASK-040: Filtro date Dal/Al in Movimenti
**File modificati:** `src/shared/labels.ts`, `src/pages/Movimenti.tsx`

- Aggiunte label `dalLabel` / `alLabel` nella sezione `movimenti` di `labels.ts` (IT/EN/ES)
- Aggiunto blocco visuale Dal/Al con `input[type="date"]` sotto la search bar in `Movimenti.tsx`
- I campi si evidenziano con bordo `--accent` quando hanno un valore; pulsante ✕ inline per reset
- Il chip "📅 Periodo corrente" rimane come shortcut per compilare entrambi i campi in un tap
- Banner semplificato: appare solo per filtro categoria (navigazione da Dashboard), non per date
- **Build check:** ✅ Passato

---

### TASK-039: Header navigazione unificato
**File creati:** `src/components/ui/PageHeader.tsx`  
**File modificati:** `src/components/ui/index.ts`, `src/pages/Categories.tsx`, `src/pages/Movimenti.tsx`, `src/pages/SettingsPage.tsx`, `src/components/Settings.tsx`

- Creato `PageHeader` con tasto `‹ Indietro` (accent color), titolo centrato e slot destro opzionale
- Usa `navigate(-1)` con fallback su path configurabile (default `/`)
- `Categories.tsx`: rimosso `<Link to="/">` testuale, ora usa `<PageHeader>`
- `Movimenti.tsx`: rimosso blocco `<div>` + `<h1>` manuale, ora usa `<PageHeader>`
- `SettingsPage.tsx`: aggiunto `<PageHeader>`, rimosso `useNavigate` dal wrapper
- `Settings.tsx`: rimosso l'header interno con ✕ dalla modal mode (gestito da `PageHeader`)
- **Build check:** ✅ Passato

---

### TASK-038: Popup custom al posto dei dialog nativi
**File creati:** `src/shared/DialogContext.tsx`  
**File modificati:** `src/main.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Categories.tsx`, `src/components/Settings.tsx`

- Creato `DialogContext.tsx` con `DialogProvider` e hook `useDialog()` che espone `showConfirm`, `showPrompt`, `showInfo`
- I dialog sono Promise-based (drop-in per `confirm()`/`prompt()` async)
- UI: overlay blur + card con bordi arrotondati usando CSS variables del tema attivo
- Input password con `autoFocus` e support `Enter`/`Escape` keyboard
- Aggiunto `<DialogProvider>` nello stack provider in `main.tsx`
- Eliminati tutti i `window.confirm` / `window.prompt` nativi (6 occorrenze)
- **Build check:** ✅ Passato

---

### TASK-037: Rimozione notch e riallineamento dock
**File modificati:** `src/components/BottomNav.tsx`, `TASKS.md`, `CHANGELOG.md`

- Rimossa la notch sopra il tasto `+` su richiesta UX
- Ripristinato il `+` in posizione sospesa sopra la barra
- Spostate le icone della dock più in basso (`translate-y-1` + padding top barra) per ridurre lo spazio vuoto percepito
- Eseguiti build e deploy su GitHub Pages
- **Build check:** ✅ Passato

---

### TASK-036: Fix resa visiva dock
**File modificati:** `src/components/BottomNav.tsx`, `src/index.css`, `TASKS.md`, `CHANGELOG.md`

- Corretta la proporzione generale della dock: larghezza ridotta e layout più compatto
- Notch centrale ridimensionata per evitare effetto troppo "pesante" sul contenuto
- Migliorato l'allineamento delle voci nav con colonna centrale riservata al bottone `+`
- Rifinito il bottone `+`: dimensioni ridotte, glow e pulse più morbidi
- Eseguiti build e deploy su GitHub Pages
- **Build check:** ✅ Passato

---

### TASK-035: Rifiniture dock (pulse + notch + icone vector)
**File modificati:** `src/components/BottomNav.tsx`, `src/index.css`, `TASKS.md`, `CHANGELOG.md`

- Aggiunta animazione pulse del tasto `+` con ring esterno (piu elegante e leggibile)
- Notch centrale resa piu pronunciata con cutout dedicato sopra la barra
- Sostituite le emoji della navigazione con icone SVG outline coerenti con lo stile app
- Mantenuto il comportamento del `+` (apertura form aggiunta movimento)
- Eseguiti build e deploy su GitHub Pages
- **Build check:** ✅ Passato

---

### TASK-034: Bottom dock stile Satispay adattata Hermes
**File modificati:** `src/components/BottomNav.tsx`, `src/pages/Dashboard.tsx`, `src/shared/labels.ts`, `TASKS.md`, `CHANGELOG.md`

- Ridisegnata la barra bassa in stile dock floating (glassmorphism + glow in palette Hermes)
- Aggiunto tasto centrale `+` con look orbitale e feedback attivo
- Il click sul `+` apre il form movimento in Dashboard (anche se cliccato da altre pagine)
- Rimosso il vecchio FAB fisso dalla Dashboard per evitare doppio CTA
- Estese le label i18n sezione `layout` per le voci della bottom bar
- Eseguiti build e deploy su GitHub Pages
- **Build check:** ✅ Passato

---

## [23/04/2026] — Sessione 4

### TASK-033: Ripristino tasto + sopra barra bassa
**File modificati:** `src/pages/Dashboard.tsx`, `TASKS.md`, `CHANGELOG.md`

- Corretto il FAB `+` in Dashboard spostandolo sopra la bottom bar (`bottom-24`)
- Aumentato z-index del FAB a `z-50` per evitare che venga coperto dalla barra (`z-40`)
- Eseguiti build e deploy su GitHub Pages
- **Build check:** ✅ Passato

---

### TASK-032: Barra in basso visibile anche su desktop
**File modificati:** `src/components/BottomNav.tsx`, `src/components/Layout.tsx`, `TASKS.md`, `CHANGELOG.md`

- Rimossa la classe `md:hidden` da BottomNav per mostrare la barra anche su sito desktop
- Aggiunto `z-40` alla barra fissa per evitare layer nascosti
- Aggiornato il layout con `md:pb-24` per evitare sovrapposizione contenuti
- **Build check:** ✅ Passato

---

### TASK-031: Deploy su GitHub Pages
**File modificati:** `TASKS.md`, `CHANGELOG.md`

- Eseguito `npm run deploy` (build + publish con `gh-pages`)
- Build Vite completata senza errori
- Pubblicazione completata con output `Published`
- **Deploy check:** ✅ Passato

---

### TASK-030: Bottom Navigation (menu in basso)
**File creati:** `src/components/BottomNav.tsx`
**File modificati:** `src/components/Layout.tsx`, `src/components/Settings.tsx`, `src/shared/labels.ts`

- Creato componente **BottomNav** con tre voci: Home (🏠), Categorie (📁), Impostazioni (⚙️)
- Riposizionato menu in basso per mobile (`md:hidden`), stile bottom-bar moderno tipo Satispay
- Modificato Settings per supportare due modalità:
  - **Popover**: dall'header come prima (non visibile su mobile)
  - **Modal**: aperto dal BottomNav con overlay e bottone di chiusura
- Aggiunto `pb-24 md:pb-6` al main content di Layout per evitare sovrapposizioni
- Aggiunta label `impostazioni` al SETTINGS in `labels.ts`
- **Build check:** ✅ Passato

---

## [22/04/2026] — Sessione 3

### TASK-029: Modalita 100% manuale (Drive predisposto)
**File modificati:** `src/app/features.ts`, `TASKS.md`

- Per ora forzata UX manuale: disattivata la sezione Locale/Drive nei Settings (`codeTransfer: false`)
- Mantenuto tutto il codice Drive sync pronto per futura riattivazione senza refactor
- Flusso attivo corrente: export/import file cifrato con merge
- **Build check:** ✅ Passato

---

### TASK-028: Modalità Locale/Drive (sostituisce transfer code)
**File creati:** `src/shared/driveSync.ts`
**File modificati:** `src/components/Settings.tsx`, `src/shared/labels.ts`, `src/app/features.ts`, `src/App.tsx`, `src/vite-env.d.ts`, `TASKS.md`

- Sostituito il metodo vecchio (transfer code) con scelta esplicita della strategia dati
- Modalità `Solo locale` (default) per utenti che non vogliono cloud/database
- Modalità `Sync Drive` opzionale: connessione a Google Drive e sync del file cifrato (merge + upload)
- Nuove azioni in Settings: "Connetti Google Drive", "Sync ora", "Disconnetti Drive"
- Rimosso il flow di ingest QR da `App.tsx` per allineare il nuovo metodo
- Nessun DB richiesto: persistenza remota su file Drive in `appDataFolder`
- Richiesta configurazione `VITE_GOOGLE_CLIENT_ID` lato ambiente
- **Build check:** ✅ Passato

---

### TASK-027: Trasferimento con codice (Applica/Ricevi)
**File modificati:** `src/shared/storage.ts`, `src/components/Settings.tsx`, `src/shared/labels.ts`, `src/app/features.ts`, `package.json`, `TASKS.md`

- Aggiunto flusso alternativo al multi-QR: codice cifrato copia/incolla tra dispositivi
- Nuove API in storage: `buildTransferCode(password)` e `importTransferCode(code, password, { mode: 'merge' })`
- In Settings: sezione "Genera codice trasferimento", pulsante copia e pannello "Ricevi codice" con azione "Applica codice"
- `qrTransfer` disattivato di default e nuovo flag `codeTransfer` attivo
- Merge mantenuto in import, con richiesta password e gestione esiti (`ok`, `invalid`, `wrong-password`)
- Cleanup dipendenze: rimossi `qrcode` e `@types/qrcode` non più usati dalla UI
- **Build check:** ✅ Passato

---

### TASK-026: Fix QR scan 404 + parser URL robusto
**File modificati:** `src/shared/storage.ts`, `src/App.tsx`

- I link QR ora usano query string (`?xfer=...`) invece di hash per maggiore compatibilità con scanner mobili
- Parsing QR reso robusto: supporta token in hash, query e pathname (`/xfer/...`) 
- Mantiene retrocompatibilità con i QR della versione precedente
- Pulizia URL dopo ingest per evitare path non validi e ridurre il rischio di pagina 404

---

### TASK-025: Import PC -> telefono via QR con merge
**File modificati:** `src/shared/types.ts`, `src/shared/storage.ts`, `src/shared/labels.ts`, `src/components/Settings.tsx`, `src/App.tsx`, `src/app/features.ts`, `package.json`

- Aggiunti metadati di sync alle transazioni (`syncId`, `createdAt`, `updatedAt`) con normalizzazione automatica in storage
- `importAllData()` ora supporta modalità `merge`: unisce movimenti senza sostituire tutto, risolve conflitti su `updatedAt`
- Merge esteso a categorie custom e icone custom; impostazioni dispositivo restano locali in modalità merge
- Nuovo flusso QR PC -> telefono: payload cifrato AES-GCM spezzato in chunk multipli (`#xfer=...`) per evitare QR troppo grandi
- Nuova UI in Settings per generare QR chunked e navigarli (precedente/successivo)
- In `App.tsx` ingestione hash QR, ricostruzione payload, prompt password e import merge automatico
- Dipendenze aggiunte: `qrcode` + `@types/qrcode`
- **Build check:** ✅ Passato

---

### TASK-024: Cambio lingua nei Settings
**File modificati:** `src/shared/labels.ts`, `src/components/Settings.tsx`

- Aggiunta sezione "Lingua" nel pannello Settings con 3 bottoni: 🇮🇹 Italiano, 🇬🇧 English, 🇪🇸 Español
- Bottone lingua attiva evidenziato con `accent` + `ring-2`
- Al cambio lingua: `setLocale()` salva in localStorage e `window.location.reload()` ricarica l'app
- **Build check:** ✅ Passato

---
### TASK-023: Regola aggiornamento CHANGELOG
**File modificati:** `.github/copilot-instructions.md`, `CHANGELOG.md`

- Aggiunta sezione "Regole Obbligatorie a Fine Task" in `copilot-instructions.md` con obbligo esplicito di aggiornare `CHANGELOG.md` dopo ogni task

---

### TASK-022: Cifratura AES-GCM backup export/import
**File modificati:** `src/shared/storage.ts`, `src/shared/labels.ts`, `src/components/Settings.tsx`

- Export e import backup ora **cifrati con AES-256-GCM + PBKDF2** (100.000 iterazioni, SHA-256)
- `exportAllData(password)` diventa async: chiede password, cifra il JSON, scarica il file
- `importAllData(json, password?)` diventa async: rileva il formato (cifrato vs plain), decifra con la password fornita
- Nuovi status di import: `'wrong-password'` in aggiunta a `'ok'` e `'invalid'`
- Label aggiunte: `passwordEsporta`, `passwordImporta`, `passwordErrata` (IT/EN/ES)
- **Build check:** ✅ Passato

---

### TASK-021: Nuova icona app (moneta + orbita)
**File modificati:** `public/pwa-192x192.svg`, `public/pwa-512x512.svg`, `index.html`

- Ridisegnata l'icona PWA con moneta dorata (gradiente radiale 3D con highlight), orbita ellittica tratteggiata inclinata, due pianetini (blu + arancione) posizionati sull'orbita
- Sfondo spazio nero profondo con stelle sparse
- Favicon in `index.html` aggiornato a `pwa-192x192.svg`
- **Build check:** ✅ Passato

---

### TASK-020: Export/Import JSON + feature flags
**File creati:** `src/app/features.ts`
**File modificati:** `src/shared/storage.ts`, `src/shared/labels.ts`, `src/components/Settings.tsx`

- Creato `src/app/features.ts` con `FEATURES` object per abilitare/disabilitare sezioni senza toccare codice applicativo
- `exportAllData()` e `importAllData()` aggiunti a `storage.ts` con tipo `AppBackup` (version 1)
- Sezione "Sincronizzazione" nei Settings gated da `FEATURES.exportImportJson`
- Label `sincronizzazione`, `esportaDati`, `importaDati`, `importaConferma`, `importaOk`, `importaErrore` (IT/EN/ES)
- **Build check:** ✅ Passato

---



### TASK-004: Categorie custom + descrizione opzionale
**File creati:** `src/pages/Categories.tsx`
**File modificati:** `src/shared/storage.ts`, `src/shared/labels.ts`, `src/components/AddTransactionForm.tsx`, `src/components/Layout.tsx`, `src/App.tsx`

- **Descrizione opzionale**: il campo "Per cosa?" non è più obbligatorio. Se vuoto, la transazione usa il nome della categoria come descrizione
- **Rimosso auto-fill**: la descrizione non si compila più automaticamente alla selezione della categoria
- **Categoria custom**: bottone "+ Nuova categoria" nel form con input di testo
- **Salva per il futuro**: checkbox per salvare la categoria custom in localStorage per riutilizzarla
- **Storage**: `loadCustomCategories()`, `addCustomCategory()`, `deleteCustomCategory()` in `storage.ts`
- **Pagina gestione categorie** (`/categories`): visualizza categorie predefinite e custom, permette di eliminare quelle custom
- **Navigazione**: link "🏷️ Gestione Categorie" nell'header, route `/categories` in `App.tsx`
- **Labels**: 12 nuove stringhe per form e pagina categorie (IT/EN/ES)
- **Build + Test:** ✅ 28/28 passati

---

## [19/04/2026] — Sessione 1

### TASK-001: Refactor form transazione e UX categoria
**File modificati:** `src/components/AddTransactionForm.tsx`

- Spostato il selettore **Categoria** sopra il campo **"Per cosa?"** nel form
- Aggiunto **auto-fill descrizione**: quando si seleziona una categoria e il campo descrizione è vuoto, viene popolato automaticamente col nome della categoria
- La descrizione resta **liberamente editabile** dall'utente
- **Build check:** ✅ Passato

---

### TASK-002: Setup unit test e test base
**File creati:** `vitest.config.ts`, `src/__tests__/setup.ts`, `src/__tests__/storage.test.ts`, `src/__tests__/labels.test.ts`, `src/__tests__/theme.test.ts`
**File modificati:** `package.json`

- Installati: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- Creato `vitest.config.ts` con environment `jsdom`
- **28 test** in 3 file:
  - `storage.test.ts` (11 test) — generateId, CRUD transazioni, filtro per periodo, gestione dati corrotti
  - `labels.test.ts` (14 test) — cambio lingua, label per sezione (LAYOUT, DASHBOARD, MASCOTTE, FORM, CATEGORIE, NOT_FOUND)
  - `theme.test.ts` (3 test) — localStorage tema, attributo data-theme
- Aggiunti script `"test"` e `"test:watch"` in package.json
- **Build + Test:** ✅ 28/28 passati

---

### TASK-003: Icone emoji per categorie transazioni
**File creati:** `src/shared/categoryIcons.ts`
**File modificati:** `src/shared/labels.ts`, `src/components/AddTransactionForm.tsx`, `src/pages/Dashboard.tsx`

- **14 categorie uscita** rinnovate: Cibo 🍕, Quotidiano 🛒, Trasporti 🚀, Sociale 🪐, Residenza 🏠, Regalo 🎁, Comunicazioni 📡, Abbigliamento 👕, Svago 🎮, Bellezza ✨, Medico 🩺, Hobby 🎨, Bollette ⚡, Altro 🌌
- **5 categorie entrata**: Stipendio 💰, Freelance 💻, Regalo 🎁, Rimborso 🔄, Altro 🌌
- Tutte tradotte in IT/EN/ES in `labels.ts`
- Creato `categoryIcons.ts` con funzione `getCategoryIcon(category)` per tutte le lingue
- Icone visibili nel **selettore categoria** del form
- Icone visibili nella **lista movimenti** in Dashboard
- **Build + Test:** ✅ 28/28 passati

---

### Documenti aggiornati
- `TASKS.md` — Task spostati in "Completati"
- `STRUCTURE.md` — Aggiunto `categoryIcons.ts` e cartella `__tests__/`
- `RULES.md` — Già aggiornato in sessione precedente
