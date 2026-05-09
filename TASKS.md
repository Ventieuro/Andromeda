# AstroCoin — Task List

<!-- 
  ISTRUZIONI:
  - Scrivi qui i task che vuoi far eseguire a Copilot.
  - Usa il formato sotto per ogni task.
  - Copilot leggerà questo file e li eseguirà in ordine.
  - Dopo aver completato un task, verrà spostato nella sezione "Completati".

  FORMATO TASK:
  - [ ] Descrizione chiara del task
        Dettagli aggiuntivi o specifiche (opzionale)

  PRIORITÀ (opzionale):
  🔴 Alta  🟡 Media  🟢 Bassa

  ⚠️ REGOLA: Dopo OGNI sotto-task completato, eseguire `npm run build`
  per verificare che il codice compili senza errori.

  ⚠️ REGOLA: OGNI richiesta dell'utente deve essere registrata come task
  in questo file PRIMA di essere eseguita, e spostata in "Completati" dopo.
-->

## Da Fare

<!-- TASK-083 completato: vedi sezione Completati -->

### 🔜 TASK-054 — Promemoria gestione spazio dati (non implementare ora)
- [ ] Valutare strategia archiviazione storica (es. export annuale + pulizia dati vecchi)
- [ ] Definire soglia operativa (es. warning 70-80%) e flusso guidato utente
- [ ] Considerare eventuale migrazione a IndexedDB se la crescita dati continua

### 🔜 TASK-077 — Suggerimento: immagini scontrino locali (NON ESEGUIRE finché non richiesto) (02/05/2026)
- [ ] Valutare salvataggio opzionale immagini scontrino in IndexedDB come Blob compressi
- [ ] Definire retention (es. 30/60/90 giorni) e cleanup automatico
- [ ] Salvare sempre miniatura + metadata, originale opzionale per ridurre peso
- [ ] Progettare impatto su backup/sync/export prima di attivare in produzione

## Completati

### ✅ TASK-122 — Scanner scontrino: prezzo articolo con sconto in 3 righe (09/05/2026)
- [x] In revisione articolo con sconto: mostrati `Lordo`, `Sconto`, `Netto`
- [x] Campo `Netto` reso non modificabile per evitare doppie sottrazioni
- [x] Somma totale confermata sui prezzi netti (`item.price`)
- [x] Label OCR i18n aggiunte per le tre voci (IT/EN/ES)
- [x] Versione bump → `0.9.1`, deploy ✅

### ✅ TASK-121 — Grafico torta: scroll libero, interazione con long press (06/05/2026)
- [x] `SpaceDonutChart`: `touchstart` non chiama più `preventDefault()` → scroll libero
- [x] Long press 400ms sul donut attiva la selezione fetta + haptic 20ms
- [x] Spostamento >10px prima del long press = annulla timer (scroll prioritario)
- [x] `touchAction: 'auto'` sul canvas
- [x] Versione bump → `0.7.26`, deploy ✅

### ✅ TASK-120 — Color picker missioni: restyle bottoni con icona Target (06/05/2026)
- [x] Cerchi 48px con radial gradient e glow colorato
- [x] Icona `Target` (lucide-react) al centro di ogni bottone
- [x] Nome colore + hex code sotto ogni bottone
- [x] Colore `#60d4ff` → `#00D4FF` (Azzurro Fluo)
- [x] `COLOR_NAMES` map aggiunta per etichette in italiano
- [x] Versione bump → `0.7.25`, deploy ✅

### ✅ TASK-119 — Impostazioni: icone lucide-react al posto delle emoji (06/05/2026)
- [x] `SettingsRow`: prop `icon` da `string` a `React.ReactNode`, rimossa font-size emoji
- [x] Menu principale: Tag, Palette, Globe, Bell, Lock, HardDrive, ArrowUpDown, Archive
- [x] Dest. backup: Download, FolderOpen invece di 📥 📁
- [x] Tema section: Moon, Sun, Rocket invece di 🌑 ☀️ 🚀 (con `flex items-center gap-1.5`)
- [x] Versione bump → `0.7.24`, deploy ✅

### ✅ TASK-118 — Fix auto backup: download non automatico, toggle solo con cartella (06/05/2026)
- [x] `autoBackup.ts performAutoBackup`: skip se `dest !== 'folder'` (solo cartella fa auto backup)
- [x] `SettingsPage BackupSection`: toggle visibile solo quando `dest === 'folder' && isFSASupported()`
- [x] Nota informativa mostrata quando `dest === 'download'`
- [x] `AUTO_BACKUP.soloCartella` aggiunto a `labels.ts`
- [x] Versione bump → `0.7.23`, deploy ✅

### ✅ TASK-116 — Grafico: arco esterno pulsante azzurro (non raggiunto) invece di rosso (05/05/2026)
- [x] `SpaceDonutChart.drawSavingsGoalArc`: `baseColor` cambiato da `239,68,68` (rosso) a `96,165,250` (azzurro) quando obiettivo non raggiunto
- [x] Verde mantenuto quando obiettivo raggiunto
- [x] Versione bump → `0.7.21`, deploy ✅

### ✅ TASK-115 — Grafico: arco azzurro per risparmi obiettivo + verde per risparmi veri (05/05/2026)
- [x] `ExpensePieChart.buildSlices`: arco azzurro (`#60a5fa`) = tx con `goalId` del periodo
- [x] Verde (`#22c55e`) = `income - totalExpenses` (risparmio vero non ancora toccato)
- [x] Spese regolari = solo tx senza `goalId`, raggruppate per categoria
- [x] Label `DASHBOARD.missioniRisparmio` aggiunta a `labels.ts`
- [x] Versione bump → `0.7.20`, deploy ✅

### ✅ TASK-114 — Grafico: missioni aumentano il verde + cancellazione scalano il goal (06/05/2026)
- [x] `ExpensePieChart.buildSlices`: tx con `goalId` escluse dalle spese — non riducono il verde
- [x] Verde (Risparmi) = `income - regularExpenses` (missioni incluse nel risparmio)
- [x] `Dashboard.handleDelete`: se tx ha `goalId`, sottrae `amount` da `goal.savedAmount`
- [x] `Movimenti.handleDelete`: stessa logica; se elimina gruppo ricorrente, sottrae totale gruppo
- [x] `updateGoal` importato in Dashboard e Movimenti
- [x] Rimossa label `missioniLabel` da `labels.ts` (non più necessaria)
- [x] Versione bump → `0.7.19`, deploy ✅

### ✅ TASK-113 — UX missioni: mutua esclusione categoria/missione + display transazioni goal (06/05/2026)
- [x] `AddTransactionForm`: categoria e missione sono mutualmente esclusive (click su una azzera l'altra)
- [x] Missione picker spostato sotto `uscita` (non più sotto `entrata`)
- [x] Dimming opacity (0.45) sulla sezione inattiva (categoria o missione)
- [x] Pill missione attiva: sfondo `#1e3a6a`, testo `#7c9eff` (blu tema spazio)
- [x] `isValid`: accetta `category === ''` se `goalId !== ''`
- [x] Fallback descrizione: usa nome missione se description vuota e goalId set
- [x] `FORM.oDivider` aggiunto a `labels.ts`
- [x] `Movimenti.tsx`: righe con goalId mostrano emoji+nome missione, importo blu `#7c9eff`
- [x] `Dashboard.tsx`: righe recenti con goalId mostrano emoji+nome missione, importo blu `#7c9eff`
- [x] Fix JSX comment brace in AddTransactionForm.tsx
- [x] Versione bump → `0.7.18`, deploy ✅

### ✅ TASK-111 — Missions: ordine cronologico inverso + aggiornamento icone (05/05/2026)
- [x] `goals.map` → `[...goals].reverse().map` — missioni dalla più recente alla più vecchia
- [x] Icone: rimossi 🌴📱🎸, aggiunti 🎮🩺🎁
- [x] Versione bump → `0.7.16`, deploy ✅

### ✅ TASK-110 — Fix: chiave localStorage MissionCard basata su id invece di name (05/05/2026)
- [x] Aggiunto prop `id: string` a `MissionCardProps`
- [x] Tutte le chiavi localStorage (`mc-colors`, `mc-launched`, `mc-confirmed`) usano `id` invece di `name`
- [x] `Missions.tsx`: passa `id={g.id}` a `MissionCard`
- [x] Versione bump → `0.7.15`, deploy ✅

### ✅ TASK-109 — Fix: customizzazioni navicella perse dopo refresh (04/05/2026)
- [x] `loadConfirmedPieces(name)`: helper che legge `astrocoin-mc-confirmed-${name}` da localStorage
- [x] `confirmedPieces` inizializzato da localStorage al mount
- [x] `pendingQueue` inizializzato al mount con tutti i pezzi sbloccati ma non ancora confermati
- [x] `confirmColor`: salva `confirmedPieces` in localStorage (`astrocoin-mc-confirmed-*`)
- [x] `autoBackup.ts`: aggiunta chiave `astrocoin-mc-confirmed-*` al backup
- [x] Versione bump → `0.7.14`, deploy ✅

### ✅ TASK-108 — Fix: sblocco multiplo customizzazioni navicella (04/05/2026)
- [x] Rimosso `break` dal loop `useEffect` in `MissionCard.tsx` — ora tutte le soglie superate in un salto vengono accodate in `pendingQueue`
- [x] Animazione flash `newlyUnlocked` mostrata solo per il primo pezzo della batch
- [x] Versione bump → `0.7.13`, deploy ✅

### ✅ TASK-107 — Backup include missioni e prodotti (03/05/2026)
- [x] `autoBackup.ts`: `buildBackupContent()` include `products`, `goals`, `missionCardData`
- [x] `storage.ts`: `AppBackup` v1|2 con campi opzionali; `applyBackup()` ripristina i nuovi campi
- [x] `exportAllData`, `buildQrTransferLinks`, `buildTransferCode` aggiornati a version 2
- [x] Versione bump → `0.7.12`, deploy ✅

### ✅ TASK-098 — MissionCard: astronave SVG con assemblaggio progressivo (03/05/2026)
- [x] Creato `src/components/MissionCard.tsx` con astronave SVG cartoon (5 pezzi)
- [x] Soglie sblocco: motore 0%, corpo 15%, ali 35%, punta 55%, finestrino 75%
- [x] Pezzi bloccati → sagome tratteggiate con `?`; sblocco con animazione `unlockPop` + `flashRing`
- [x] Color picker al momento sblocco (8 colori, anteprima live, confirma salva)
- [x] Animazioni: fiamma propulsore `flicker`, luci `blink`, fluttuamento a 95%+ `float`
- [x] Storico colori in fondo alla card
- [x] `Missions.tsx`: `GoalCard` → `MissionCard`
- [x] Versione bump → `0.7.2`, deploy ✅

### ✅ TASK-097 — Migrazione icone → lucide-react (03/05/2026)
- [x] Installato `lucide-react`
- [x] `BottomNav.tsx`: rimossi 4 componenti SVG inline → `House`, `List`, `Target`, `Settings`
- [x] `Layout.tsx`: eye/eye-off SVG inline → `Eye`, `EyeOff`
- [x] `SettingsPage.tsx`: chevron SVG → `ChevronLeft` (BackButton) e `ChevronRight` (SettingsRow)
- [x] `Movimenti.tsx` + `ProductsCatalog.tsx`: funnel SVG inline → `ListFilter`
- [x] Versione bump → `0.7.1`, deploy ✅

### ✅ TASK-096 — Carryover shortfall + messaggi mascotte (03/05/2026)
- [x] `effectiveMonthlyGoal` in ExpensePieChart con accumulo shortfall 24 mesi
- [x] Nuovi prop `allTransactions`, `periodStart`, `payDay` in ExpensePieChart
- [x] Dashboard calcola `carryoverAmount` e passa a `getMascotMessage`
- [x] 4 nuovi messaggi mascotte con citazioni cinematografiche (Houston, Buzz, Yoda, Never give up)
- [x] Deploy ✅

### ✅ TASK-095 — Sezione Missioni: obiettivi di risparmio (03/05/2026)
- [x] `SavingsGoal` interface aggiunta in `types.ts`
- [x] CRUD (`loadGoals`, `saveGoals`, `addGoal`, `updateGoal`, `deleteGoal`) in `storage.ts`
- [x] Label `missioni` (IT/EN/ES) + export `MISSIONI` in `labels.ts`
- [x] `Missions.tsx` implementato con GoalForm + GoalCard + FAB
- [x] Modalità "mensile fisso" e "obiettivo entro data" con calcolo rata mensile automatico
- [x] Versione bump → `0.7.0`, deploy ✅

### ✅ TASK-094 — SpaceDonutChart: indicatore spese importanti + fix cascade (03/05/2026)
- [x] **Bug fix:** `updateTransactionsByGroupId` ora include `important` nel patch (storage.ts + form)
- [x] `SliceData` in SpaceDonutChart arricchita con `hasImportant?: boolean`
- [x] Funzione `drawImportantNeedle`: arco ambra esterno + ago tratteggiato dal centro + pallino tip
- [x] `buildSlices` in ExpensePieChart calcola `importantCategories` e popola `hasImportant`
- [x] Legenda donut: badge "⭐ importante" (ambra) per categorie con spese importanti
- [x] Build e test verificati ✅

### ✅ TASK-093 — SolarSystemChart: evidenziazione visiva spese importanti (03/05/2026)
- [x] `PlanetData` arricchita con `hasImportant: boolean`
- [x] `buildPlanets` rileva categorie con almeno una transazione `important`
- [x] Orbita punteggiata ambra pulsante (`drawImportantRing`) per categorie importanti
- [x] Anello ambra pulsante attorno al pianeta importante (`drawPlanet` + `important` flag)
- [x] Legenda: badge "⭐ importante" sotto l'importo per le categorie importanti
- [x] Label i18n `spesaImportante` aggiunta in IT/EN/ES
- [x] Build e test verificati ✅

### ✅ TASK-092 — Campo "Spesa importante" nel form transazione (03/05/2026)
- [x] Aggiunto campo `important?: boolean` a interfaccia `Transaction` in `types.ts`
- [x] Aggiunte label `labelImportante` e `tooltipImportante` (IT/EN/ES) in `labels.ts`
- [x] Aggiunto state `important` e checkbox UI nel form (visibile solo per uscite)
- [x] Campo salvato nella transazione sia in creazione che in modifica
- [x] Build e test verificati ✅

### ✅ TASK-089 — Camera scontrino: fix multi-click su scatto (02/05/2026)
- [x] Aggiunto lock anti-doppio-click durante `canvas.toBlob` nello scanner camera
- [x] Pulsante scatto disabilitato con feedback visivo (stato `wait`) durante cattura
- [x] Garantito 1 tap = 1 foto, evitando upload multipli involontari
- [x] Build e test verificati (`npx tsc -b`, `npm test`) ✅

### ✅ TASK-088 — Filtro ordinamento prodotti con icona (02/05/2026)
- [x] Aggiunta UI filtro ordinamento nella sezione Prodotti con icona funnel
- [x] Ordinamento supportato: Nome A-Z, Nome Z-A, Prezzo crescente, Prezzo decrescente
- [x] Label i18n aggiunte per tutte le opzioni filtro
- [x] Build e test verificati (`npx tsc -b`, `npm test`) ✅

### ✅ TASK-087 — Modifica scontrino: drag&drop + sconti persistenti (02/05/2026)
- [x] Riordino articoli scontrino in fase modifica tramite drag and drop
- [x] Visualizzazione sconto sotto prodotto con tipo sconto e importo
- [x] Parser aggiornato: salva metadati sconto (`grossPrice`, `discountAmount`, `discountType`)
- [x] Catalogo prodotti aggiorna e mostra prezzo netto/pieno + tipo sconto storico
- [x] Build e test verificati (`npx tsc -b`, `npm test`) ✅

### ✅ TASK-086 — Fix suite test locale (02/05/2026)
- [x] Aggiunto localStorage shim stabile in setup test per evitare ambienti incompleti
- [x] Resi i test OCR real opt-in tramite `RUN_OCR_REAL=1` (default skip)
- [x] Suite principale di test ora verde in locale

### ✅ TASK-085 — Sezione prodotti test negli expected OCR (02/05/2026)
- [x] Aggiunta sezione `expected.productsTest` in tutte le fixture `expected.json`
- [x] Sezione derivata automaticamente dagli item attesi (nome, occorrenze, latestPrice, prices)
- [x] Mantiene intatti i campi esistenti usati dai test OCR correnti

### ✅ TASK-084 — Nuova tab Prodotti con catalogo da scontrini (02/05/2026)
- [x] Aggiunta tab `Prodotti` dentro pagina Movimenti
- [x] Creato catalogo prodotti con ricerca, modifica nome, storico prezzi, alias OCR, eliminazione
- [x] Nuovo storage prodotti su IndexedDB (`hermes-products`) con funzioni load/save/update/delete
- [x] OCR ora confronta articoli con catalogo (match fuzzy) e mostra badge "prezzo noto" in revisione
- [x] Import scontrino aggiorna automaticamente il catalogo prodotti con price history
- [x] Build tecnica verificata ✅

### ✅ TASK-082 — OCR app: fix duplicati + velocita fallback (02/05/2026)
- [x] Rimosso merge testi tra passata originale e pre-processata (causava righe duplicate)
- [x] Fallback reso meno aggressivo: seconda passata solo se prima incompleta (pochi articoli o totale assente)
- [x] Selezione passata migliore via score, mantenendo un solo testo finale per foto
- [x] Build tecnica verificata ✅

### ✅ TASK-081 — OCR app robusto: fallback doppia passata (02/05/2026)
- [x] OCR in app allineato a config test (`createWorker('ita+eng')`)
- [x] Aggiunta seconda passata su immagine pre-processata quando la prima è incompleta/non valida
- [x] Merge automatico dei testi e scelta risultato migliore per recuperare righe mancanti (es. Coca Cola)
- [x] Build tecnica verificata ✅

### ✅ TASK-080 — Fix OCR app: allineamento lettura con test (02/05/2026)
- [x] Rimosso pre-processing obbligatorio in scanner app per OCR su file originali
- [x] Corretto mismatch dove in app mancava una riga (es. Coca Cola) presente nei test
- [x] Build tecnica verificata ✅

### ✅ TASK-079 — OCR scontrini: calcolo sconti nel totale (02/05/2026)
- [x] Parser aggiornato: riconosce righe sconto negative (es. BLUCARD -0,56)
- [x] Sconto applicato all'articolo precedente nel totale calcolato
- [x] Storage/receipt detail aggiornati per supportare importi negativi quando necessari
- [x] Verifica su `ScontrinoGigante1` ✅ (totale 7.46, articoli con sconto applicato)

### ✅ TASK-078 — Nuova sezione test OCR: ScontrinoGigante1 (02/05/2026)
- [x] Creata fixture `src/__tests__/fixtures/receipts/ScontrinoGigante1/expected.json`
- [x] Aggiunto blocco test dedicato in `src/__tests__/ocr_real.test.ts`
- [x] Configurato `stable: false` finché non viene inserita `foto_1.jpg`

### ✅ TASK-076 — Scontrino come transazione unica con dettaglio (02/05/2026)
- [x] Aggiunti campi `isReceipt` e `receiptItems` al modello transazione
- [x] Scanner scontrino aggiornato: import solo come spesa unica marcata `isReceipt: true`
- [x] Aggiunta azione `Dettaglio` per movimenti scontrino in Dashboard e Movimenti
- [x] Creato modal dettaglio con lista articoli e totale transazione
- [x] Build tecnica (`tsc -b && vite build`) ✅

### ✅ TASK-075 — Fix lightbox foto: blob URL → overlay inline (26/04/2026)
- [x] Rimosso `window.open(blob:...)` su tap foto — causava ERR_UPLOAD_FILE_CHANGED su mobile
- [x] Aggiunto `useState<number|null>` per lightbox index in `ReceiptScanner.tsx`
- [x] Overlay fullscreen con immagine + pulsante ⬇ Scarica + ✕ Chiudi (blob rimane nella stessa tab)
- [x] Build e deploy ✅

### ✅ TASK-074 — Fix parser: logiche per tipo scontrino "Documento Commerciale" (26/04/2026)
- [x] `receiptUtils.ts`: rilevamento `DOCUMENTO COMM` nel testo → flag `isDocCommerciale`
- [x] Righe moltiplicatore garbled (nome inizia con cifra) trattate come pending e skippate
- [x] Strip prefisso OCR singola lettera minuscola fusa con nome articolo (es. `i CAPPUCCINO` → `CAPPUCCINO`)
- [x] `totalKw` esteso con `PAGAMENTO ELETTRONICO`
- [x] `skipKw` esteso con `DI CUI` (filtra `di cui IVA`)
- [x] `ScontrinoCorto2/expected.json` aggiornato: itemCount 4, total 6.60, isValid true
- [x] Build e deploy ✅

### ✅ TASK-073 — PARSER_NOTES.md: documentazione regole parser OCR (26/04/2026)
- [x] Creato `src/__tests__/fixtures/receipts/PARSER_NOTES.md`
- [x] Documenta: struttura scontrini italiani, skipKw, problemi totale/data, OCR noise, filtri nome, confidence, sconti, tipi scontrino, fixture presenti, backlog

### ✅ TASK-072 — Fixture ScontrinoCorto2: bar Crema e Cioccolato (26/04/2026)
- [x] Creata `src/__tests__/fixtures/receipts/ScontrinoCorto2/` con foto reale e `expected.json`
- [x] Parser migliorato: strip `®©™`, strip percentuale IVA inline (`10,00%`), soglia minima nome alzata a 3 char
- [x] `ocr_real.test.ts`: aggiunto describe block ScontrinoCorto2
- [x] Build e deploy ✅

### ✅ TASK-071 — Fixture ScontrinoLungo2 + per-item assertions (26/04/2026)
- [x] Creata `src/__tests__/fixtures/receipts/ScontrinoLungo2/` (stessa ricevuta ScontrinoLungo1, 3 foto copertura parziale)
- [x] `ocr_real.test.ts`: aggiornato con `usedIdx` Set per gestire articoli duplicati; assertions per-item con `parserReadPrice`
- [x] Build e deploy ✅

### ✅ TASK-070 — Versione app in Settings (26/04/2026)
- [x] `vite.config.ts`: `define.__APP_VERSION__` iniettato da `package.json`
- [x] `vite-env.d.ts`: dichiarato `declare const __APP_VERSION__: string`
- [x] `Settings.tsx`: aggiunta riga versione in fondo
- [x] `labels.ts`: aggiunto `versione` in sezione SETTINGS
- [x] Build e deploy ✅

### ✅ TASK-069 — Photo view/download in ReceiptScanner (26/04/2026)
- [x] Fase input: griglia anteprime foto con tap=lightbox, ⬇=download, ✕=rimuovi
- [x] Fase risultati: striscia orizzontale scrollabile 72×72px con stesse azioni
- [x] Build e deploy ✅

### ✅ TASK-068 — Sistema confidence prezzi OCR (26/04/2026)
- [x] `receiptUtils.ts`: aggiunto `confidence: 'ok'|'uncertain'` e `uncertainReason` su `ReceiptItem`
- [x] Segnali: lettera IVA letta come `8` → `iva8`; nome con `!` → `linea_rumorosa`; qty×unit≠price → `moltiplicatore_errato`
- [x] `ReceiptScanner.tsx`: bordo arancio sui prezzi incerti, banner "N prezzi da verificare"
- [x] Editing prezzo → azzera `confidence` a `ok`
- [x] Label i18n: `prezziDaVerificare`, `prezzoIncerto`
- [x] Build e deploy ✅

### ✅ TASK-067 — Miglioramento parser OCR + test stabili (26/04/2026)
- Fix parser: `BANCOMAT|MASTERCARD|VISA` invece di `CARTA` come skipKw
- Fix parser: IVA class regex include `D`, `€`, OCR misread `8`→`B`
- Fix parser: prezzi 3 decimali arrotondati a 2
- Parser: righe moltiplicatore (`3×2,00`) → `qty`/`unitPrice` sull'articolo successivo
- Parser: estrazione data scontrino (`dd/mm/yyyy`, `yyyy-mm-dd`)
- `expected.json`: campo `stable` per distinguere test pronti da WIP
- `ocr_real.test.ts`: `stableIt()` — `stable:false` salta automaticamente
- `package.json`: `vitest run` aggiunto in build pipeline

### ✅ TASK-066 — Fixture scontrini per test OCR (26/04/2026)
- Creata `src/__tests__/fixtures/receipts/` con `synthetic/`, `ScontrinoLungo1/`, `ScontrinoCorto1/`
- `expected.json` per ogni scontrino con valori attesi completi
- Test sintetici `ocr.test.ts` (5 ✅) e reali `ocr_real.test.ts`

### ✅ TASK-065 — Deploy fix timezone + deduplicazione import MoneyPlus

### ✅ TASK-064 — Fix timezone getTransactionsInPeriod + deduplicazione import MoneyPlus
- Fix bug timezone: `getTransactionsInPeriod` confrontava timestamp UTC vs locale → transazioni nel giorno di fine periodo escluse
- `storage.ts`: rimpiazzato confronto `getTime()` con confronto stringhe `YYYY-MM-DD` locale
- `MoneyPlusImporter.tsx`: aggiunta deduplicazione — confronto `data|importo|tipo` con transazioni esistenti
  - Transazioni già importate pre-deselezionate con badge giallo "già importata"
  - Header mostra contatore duplicati (es. `3 trovate · 3 già importate`)

## In Corso

<!-- Nessun task in corso -->

### ✅ TASK-117 — SpaceDonutChart: arco azzurro per risparmi già versati agli obiettivi (13/05/2026)
- [x] Ripristinato arco rosso per mancato raggiungimento goal mensile (era stato cambiato in blu per errore in v0.7.21)
- [x] Aggiunto prop `missionSaved` a `SpaceDonutChartProps`
- [x] Aggiunta funzione `drawManualSavingsArc` (azzurro `96,165,250`, pulsante) a raggio `outerR+11`
- [x] Chiamata in frame loop se `missionSaved > 0`
- [x] Calcolato `missionTotal` in `ExpensePieChart` e passato come `missionSaved`
- [x] Versione bump → `0.7.22`, build ✅, deploy ✅

### ✅ TASK-112 — Mission picker in AddTransactionForm (13/05/2026)
- [x] Rimosso tasto `+ Risparmio` da `MissionCard` (prop `onAddSaving` + bottone render)
- [x] Rimosso `handleAddSavings` da `Missions.tsx` + `showPrompt` import
- [x] Aggiunto `goalId?: string` a `Transaction` in `types.ts`
- [x] Aggiunto mission picker in `AddTransactionForm` (stile pill, solo tipo `entrata`, goal non completati)
- [x] Su submit: se `goalId` impostato → `updateGoal` con `savedAmount + amount`
- [x] Aggiunte label `labelMissione` + `nessunaMessione` in `labels.ts`
- [x] Versione bump → `0.7.17`, build ✅, deploy ✅

### ✅ TASK-102 — MissionCard: stelle sempre visibili + transizione fluida + rotazione lenta (03/05/2026)
- [x] **Unico SVG unificato** — niente swap DOM, zero flash nero tra fasi
- [x] **Stelle sempre presenti** (anche durante costruzione): `#060a1a` sempre come sfondo
- [x] **Stelle ferme** in fase build, **scorrono verso il basso** durante lancio
- [x] **Container stelle ruota 90°** sincrono con la nave (`mc-stars-tilt` 2.2s) → le stelle scorrono a sinistra in fase travel
- [x] **Rotazione nave più lenta**: `launchShip` 4s (era 3.5s), curva `cubic-bezier(0.3,0,0.1,1)` più graduale
- [x] Versione bump → `0.7.6`, build ✅, deploy ✅

### ✅ TASK-101 — MissionCard: fix sequenza lancio cinematica (03/05/2026)
- [x] Terreno + rampa scivolano verso il basso durante l'ignition (illusione di decollo)
- [x] La navicella rimane centrata, poi ruota 90° in senso orario per diventare orizzontale
- [x] Dopo la rotazione la navicella sfuma (fade out) → SpaceTravel appare con fade in
- [x] Stelle SpaceTravel scorrono a SINISTRA (translateX) invece che verticalmente
- [x] Rimosso il pianeta dalla vista spazio
- [x] Navicella orizzontale centrata nella vista spazio (rotate 90° nel SVG)
- [x] Versione bump → `0.7.5`, build ✅, deploy ✅

### ✅ TASK-100 — MissionCard: sequenza lancio completa + viaggio nello spazio loop (03/05/2026)
- [x] Launch pad sempre visibile durante costruzione (0-99%)
- [x] Fantasma navicella + terreno/suolo nel SVG durante costruzione
- [x] 100%: pulsante LANCIA con glow arancione
- [x] Countdown 10→0: numero gigante pulsante, diventa rosso sotto 3
- [x] Fase ignition (2.8s): fiamme grandi + braccia rampa che si aprono lateralmente + glow a terra
- [x] Fase travel (loop ∞): vista spazio con stelle scrollanti, pianeta sullo sfondo, astronave inclinata 15° con ondeggiamento perpetuo e fiamme accese
- [x] Nessuna uscita dallo schermo — crossfade diretto a loop spazio
- [x] Versione bump → `0.7.4`, build ✅, deploy ✅

### ✅ TASK-099 — MissionCard: fix finestrino + fiamme progressive + animazione lancio + launch pad (03/05/2026)
- [x] `LaunchPad` SVG component: rampa di lancio con colonne, scalette, sagoma ghost dell'astronave, luci rosse lampeggianti, HUD "SISTEMA PRONTO"
- [x] Mostrata a pct===0 (invece dell'astronave); a pct>0 torna l'astronave con assemblaggio progressivo
- [x] Fiamme solo a pct≥95 (o durante il lancio), non più sempre attive
- [x] Cockpit più visibile: r=21 (era 18), glass r=16 (era 14), fill più chiaro `#0f1530`, stroke aggiunto; rendering order fix (body-nose join prima del cockpit)
- [x] Animazione lancio a pct=100: stelle che cadono + nave sale con `@keyframes launch`; dopo 1.6s → success state ("Navicella in orbita ✨")
- [x] Versione bump → `0.7.3`, build ✅, deploy ✅

## Completati

### ✅ TASK-091 — Ordinamento per inserimento nei filtri (prodotti + movimenti)
- [x] ProductsCatalog: aggiunto 'insertion' come opzione di ordinamento (default, ordina per lastSeen decrescente)
- [x] Movimenti: aggiunto select "Ordina per" con opzioni: inserimento (più recenti/antichi), data (più recenti/antichi), importo (crescente/decrescente)
- [x] Label i18n aggiunte in PRODOTTI (ordinaInserimento) e MOVIMENTI (ordinaInserimento, ordinaInserimentoAntichi, ordinaData, ordinaDataAntichi, ordinaImporto, ordinaImportoDesc)
- [x] ProductsCatalog: sortBy state esteso da 4 a 5 opzioni, default cambiato da 'name-asc' a 'insertion'
- [x] Movimenti: sortBy state aggiunto con 6 opzioni (insertion, insertion-asc, date-desc, date-asc, amount-asc, amount-desc)
- [x] UI: filtro ordinamento con icona funnel aggiunto anche in Movimenti (dopo filtri tipo/ricorrenti, prima filtro categoria)
- [x] Build e test verificati (`npm run build` ✅, `36 passed` `5 skipped`)

### ✅ TASK-090 — Modifica scontrino — sconto editabile + nome transazione personalizzato (02/05/2026)
- [x] Sconto editabile: aggiunti input per importo (€) e tipo sconto in colonna "Sconto" della tabella risultati
- [x] Actions reducer: `MODIFICA_SCONTO_IMPORTO` e `MODIFICA_SCONTO_TIPO` aggiornano metadati articolo
- [x] Nome transazione personalizzato: text input "Nome Transazione" in fase risultati con default "Scontrino"
- [x] State: aggiunto campo `descrizione` e action `SET_DESCRIZIONE` nel reducer
- [x] handleCreaTotale(): usa `state.descrizione` per creare transazione (fallback "Scontrino")
- [x] Build e test verificati (`npx tsc -b` ✅, `npm run build` ✅, `36 passed` `5 skipped`)

### ✅ TASK-089: Camera scontrino — fix multi-click su scatto
- [x] Installate dipendenze `fflate` e `sql.js` per unzip + SQLite WASM
- [x] Copiato `sql-wasm.wasm` in `/public/`
- [x] Creato `src/components/MoneyPlusImporter.tsx` con auto-detection schema DB
- [x] Aggiunto pulsante "📦 Importa da MoneyPlus" in Settings (sezione Esporta dati)
- [x] Build e deploy ✅

### ✅ TASK-062 — Fix: chiusura scanner scontrino solo con ✕ (26/04/2026)
- [x] Rimosso handler `onClick` backdrop in `ReceiptScanner.tsx`
- [x] Aggiornato handler `AddTransactionForm.tsx` per non chiudere se scanner aperto
- [x] Build e deploy ✅

### ✅ TASK-061 — Fix iOS Safari black screen (Quick Note overlay) (25/04/2026)
- [x] Aggiunto listener `visibilitychange` in `main.tsx` per forzare repaint
- [x] Aggiunto listener `pageshow` (BFCache) per coprire tasto Indietro Safari
- [x] Build e deploy ✅

### ✅ TASK-060 — Entrate nascoste di default (25/04/2026)
- [x] Modificato `AmountsContext.tsx`: default `false` invece di `true`
- [x] Build e deploy ✅

### ✅ TASK-059 — Nascondi entrate nel grafico a torta (25/04/2026)
- [x] Aggiunto prop `hideIncome` a `SpaceDonutChart.tsx`
- [x] `ExpensePieChart.tsx` legge `useAmounts` e passa `hideIncome={!amountsVisible}`
- [x] Build e deploy ✅

### ✅ TASK-056 — Test update: migliorata frase grafico spese (25/04/2026)
- [x] Aggiornata label dashboard da "Dove vanno i soldi" a una frase più naturale
- [x] Build e deploy eseguiti per testare la propagazione update ✅

### ✅ TASK-055 — Migrazione storage a IndexedDB con preservazione dati (25/04/2026)
- [x] Introdotto layer IndexedDB con fallback sicuro su localStorage
- [x] Implementata migrazione automatica one-shot dei dati esistenti da localStorage
- [x] Aggiornato bootstrap app per inizializzazione storage prima del render
- [x] Build check e aggiornamento changelog ✅

### ✅ TASK-053 — Indicatore uso localStorage in Settings (25/04/2026)
- [x] Aggiunto indicatore spazio localStorage usato in Settings
- [x] Mostrata percentuale con barra di avanzamento e warning sopra soglia
- [x] Aggiornate label i18n e verificata build ✅

### ✅ TASK-052 — Riordino TASKS dal più recente al più vecchio (25/04/2026)
- [x] Unificate le sezioni duplicate "Completati"
- [x] Riordinati i task completati in ordine decrescente (dal più recente al primo)
- [x] Verifica struttura file ✅

### ✅ TASK-051 — Deploy novita correnti (25/04/2026)
- [x] Eseguito deploy della versione aggiornata su GitHub Pages
- [x] Verificato esito pubblicazione ✅

### ✅ TASK-050 — Deploy fix Safari e aggiornamenti form (25/04/2026)
- [x] Eseguito deploy dell'ultima versione su GitHub Pages
- [x] Verificato esito della pubblicazione ✅

### ✅ TASK-049 — Fix Safari iPhone per submit vicino alla toolbar (25/04/2026)
- [x] Aumentata safe-area e padding inferiore del modale aggiunta movimento
- [x] Alzato visivamente il bottone submit dalla toolbar Safari
- [x] Verifica build ✅

### ✅ TASK-048 — Deploy aggiornamento UI form (25/04/2026)
- [x] Eseguito deploy dell'ultima versione su GitHub Pages
- [x] Verificato esito publish ✅

### ✅ TASK-047 — Restyling scelta scontrino/manuale con segmented control (25/04/2026)
- [x] Sostituiti i due pulsanti iniziali con un segmented control piu chiaro
- [x] Aggiunto un pannello contestuale per la modalita scontrino con CTA dedicata
- [x] Build check e verifica runtime dello scanner dal nuovo layout ✅

### ✅ TASK-046 — Riposiziona scelta scontrino/manuale in cima al form (25/04/2026)
- [x] Spostata la scelta "Inserisci tramite scontrino / Inserisci manualmente" in alto nella modale
- [x] Lasciata sotto l'intera sezione normale con toggle Entrata/Uscita e resto del form
- [x] Build check e verifica runtime del trigger scanner ✅

### ✅ TASK-045 — Sposta inserimento scontrino dentro Nuova uscita (25/04/2026)
- [x] Rimosso il pulsante fotocamera dall'header Movimenti in Dashboard
- [x] Aggiunta nel form "Nuova uscita" la sezione con due opzioni: "Inserisci tramite scontrino" e "Inserisci manualmente"
- [x] Collegato il pulsante scontrino all'apertura dello scanner OCR senza alterare il flusso di import
- [x] Build check ✅

### ✅ TASK-044 — OCR Scanner Scontrini (25/04/2026)
- [x] Installato `tesseract.js` (v7, lato client)
- [x] Creato `src/shared/receiptUtils.ts` con `processImage()` (canvas) e `parseReceiptText()`
- [x] Creato `src/components/ReceiptScanner.tsx` con gestione stato `useReducer`
- [x] Multi-foto: merge testo OCR di più immagini
- [x] Parsing regex scontrini italiani: articoli + TOTALE
- [x] Validazione somma articoli vs totale rilevato
- [x] Tabella risultati editabile (modifica nome/prezzo, rimuovi riga)
- [x] Selezione categoria uscita
- [x] Due modalità import: "Crea N transazioni" o "Spesa unica"
- [x] Pulsante "📷 Scontrino" in Dashboard (accanto header Movimenti)
- [x] Label i18n in `labels.ts` sezione `ocr` (IT/EN/ES)
- [x] **Enhancement**: Fotocamera live con barre guida verticali (`getUserMedia`)
- [x] **Enhancement**: Risultati parziali in tempo reale durante OCR
- [x] **Enhancement**: Barra progresso somma → totale (verde se approvato)
- [x] **Enhancement**: Pulsante "Aggiungi riga manuale" nella fase risultati
- [x] **Enhancement**: Nuovi label i18n (`guidaAllineamento`, `chiudiCamera`, `aggiungiManuale`, `approvatoScontrino`, `parzialeMentre`)
- [x] Build check ✅

### ✅ TASK-043b — Transazioni ricorrenti: cascade edit/delete + fix input (25/04/2026)
- [x] Aggiunto campo `recurringGroupId` in `Transaction` (`types.ts`)
- [x] Aggiunte funzioni `deleteTransactionsByGroupId` e `updateTransactionsByGroupId` (`storage.ts`)
- [x] Le nuove serie ricorrenti ottengono un `recurringGroupId` condiviso
- [x] Dialog "Solo questa / Tutte le collegate" su elimina (Dashboard + Movimenti)
- [x] Dialog "Solo questa / Aggiorna tutte" su modifica (AddTransactionForm)
- [x] Fix input "per quanti mesi": stato stringa + `type="text"` per eliminare zeri iniziali
- [x] Label i18n aggiornate (sezioni `form`, `dashboard`, `movimenti`)
- [x] Build check ✅

### ✅ TASK-043 — Fix parti nere nel donut chart (24/04/2026)
- [x] `ctx.stroke()` era chiamato sul path completo (archi + linee radiali)
- [x] Separato path del glow: solo arco esterno, nessuna linea laterale
- [x] Rimosso anche il sistema gap lines precedente
- [x] Build check ✅

### ✅ TASK-042 — Fix grafico donut: logica entrate→risparmi (24/04/2026)
- [x] Donut mostra le uscite per categoria + slice verde = risparmi
- [x] Il cerchio intero = entrate totali; le spese lo erodono
- [x] Se spese ≥ entrate, nessuna slice verde
- [x] Percentuali con 1 decimale (`toFixed(1)`)
- [x] Build check ✅

### ✅ TASK-041 — Backup automatico alla chiusura app (24/04/2026)
- [x] Creato `src/shared/autoBackup.ts` con logica backup (download / cartella FSA)
- [x] Aggiunta sezione "Backup automatico" in `Settings.tsx`
- [x] Toggle attiva/disattiva, scelta destinazione (download o cartella locale)
- [x] Listener `visibilitychange` + `pagehide` in `Layout.tsx`
- [x] Filename con solo data (sovrascrive stesso file nello stesso giorno)
- [x] Label i18n in `labels.ts` sezione `autoBackup`
- [x] Build check ✅

### ✅ TASK-040 — Filtro date Dal/Al in Movimenti (24/04/2026)
- [x] Aggiunte label `dalLabel` e `alLabel` in `labels.ts` sezione `movimenti` (IT/EN/ES)
- [x] Aggiunto blocco date picker (Dal / Al) in `Movimenti.tsx` sotto la search bar
- [x] Banner filtro semplificato: mostra solo filtro categoria (da navigazione), non le date
- [x] Pulsante ✕ inline per cancellare il range date
- [x] Il chip "Periodo corrente" compila i campi Dal/Al come shortcut
- [x] Build check passato

### ✅ TASK-039 — Header navigazione unificato (24/04/2026)
- [x] Creato componente `PageHeader` in `src/components/ui/PageHeader.tsx`
- [x] Esportato da `src/components/ui/index.ts`
- [x] `Categories.tsx`: rimosso `<Link>` testuale, sostituito con `<PageHeader>`
- [x] `Movimenti.tsx`: rimosso `<h1>` manuale, sostituito con `<PageHeader>`
- [x] `SettingsPage.tsx`: rimosso `useNavigate`, aggiunto `<PageHeader>`
- [x] `Settings.tsx`: rimosso header interno con ✕ dalla modal mode
- [x] Build check ✅

### ✅ TASK-038 — Popup custom al posto dei dialog nativi (24/04/2026)
- [x] Creato `src/shared/DialogContext.tsx` con `DialogProvider` e `useDialog` hook
- [x] `DialogProvider` aggiunto in `main.tsx` nello stack dei provider
- [x] Sostituito `window.confirm` in `Dashboard.tsx` (elimina transazione)
- [x] Sostituito `confirm` in `Categories.tsx` (elimina categoria)
- [x] Sostituiti `window.confirm` e `window.prompt` (×3) in `Settings.tsx` (importa, sync, esporta)
- [x] Build check ✅

### ✅ TASK-037 — Rimozione notch e riallineamento dock (24/04/2026)
- [x] Rimossa notch sopra il bottone `+`
- [x] Riposizionato `+` sospeso sopra la barra come versione precedente
- [x] Spostate le icone piu in basso nella dock per ridurre spazio vuoto
- [x] Build check
- [x] Deploy GitHub Pages

### ✅ TASK-036 — Fix resa visiva dock (24/04/2026)
- [x] Ridotta larghezza della barra per evitare effetto "blocco" troppo grande
- [x] Notch centrale ridimensionata e meno invasiva
- [x] Riallineate le voci della nav con spazio centrale dedicato al `+`
- [x] Tasto `+` ridimensionato e glow/pulse meno aggressivi
- [x] Build check
- [x] Deploy GitHub Pages

### ✅ TASK-035 — Rifiniture dock: pulse, notch, icone vector (24/04/2026)
- [x] Animazione pulse morbida del tasto `+`
- [x] Notch centrale resa piu marcata e coerente con tema Hermes
- [x] Sostituite emoji con icone vettoriali per Home, Categorie, Impostazioni
- [x] Build check
- [x] Deploy GitHub Pages

### ✅ TASK-034 — Bottom dock stile Satispay adattata Hermes (24/04/2026)
- [x] Restyling BottomNav con design dock floating (glass + glow)
- [x] Inserito tasto `+` centrale orbit-style integrato nella barra
- [x] Collegato il `+` all'apertura del form in Dashboard via evento globale
- [x] Rimosso FAB duplicato dalla Dashboard
- [x] Aggiunte label i18n per voci barra (`layout.nav*`)
- [x] Build check
- [x] Deploy GitHub Pages

### ✅ TASK-033 — Ripristino tasto + sopra barra bassa (23/04/2026)
- [x] Corretto posizionamento FAB nella Dashboard (`bottom-24`)
- [x] Aumentato z-index FAB (`z-50`) per evitare overlay della bottom bar
- [x] Build check
- [x] Deploy GitHub Pages

### ✅ TASK-032 — Barra in basso visibile anche su desktop (23/04/2026)
- [x] Rimossa regola responsive che nascondeva la BottomNav (`md:hidden`)
- [x] Aggiunto `z-40` alla barra per visibilità stabile
- [x] Aumentato padding bottom del contenuto anche su desktop (`md:pb-24`)
- [x] Build check

### ✅ TASK-031 — Deploy su GitHub Pages (23/04/2026)
- [x] Eseguito deploy con script `npm run deploy`
- [x] Build produzione completata durante il deploy
- [x] Pubblicazione completata (`gh-pages`)

### ✅ TASK-030 — Bottom Navigation (menu in basso) (23/04/2026)
- [x] Creato componente BottomNav con Home, Categorie, Impostazioni
- [x] Riposizionato Settings come modal dal BottomNav
- [x] Modificato Layout per integrare il BottomNav
- [x] Aggiunto padding al main content per evitare sovrapposizioni
- [x] Aggiunta label `impostazioni` in labels.ts
- [x] Build check

### ✅ TASK-029 — Modalita 100% manuale (Drive predisposto) (23/04/2026)
- [x] `features.ts` — disattivata sezione Locale/Drive in UI (`codeTransfer: false`)
- [x] Conservata integrazione Drive nel codice per riattivazione futura
- [x] Build check

### ✅ TASK-028 — Modalità Locale/Drive (sostituisce transfer code) (23/04/2026)
- [x] Strategia dati: locale di default, Drive opzionale
- [x] Integrazione Google Drive file cifrato (no DB)
- [x] Rimossa UI transfer code dalla sezione Sync
- [x] Aggiunta UI "Connetti Drive", "Sync ora", "Disconnetti"
- [x] Conservato merge automatico con i dati locali
- [x] Aggiornati `TASKS.md`, `CHANGELOG.md` e build check

### ✅ TASK-027 — Trasferimento con codice (Applica/Ricevi) (23/04/2026)
- [x] `storage.ts` — generazione codice cifrato e import da codice
- [x] `Settings.tsx` — UI "Genera codice", "Ricevi" e "Applica"
- [x] `features.ts` — QR disattivato di default, code-transfer attivo
- [x] `labels.ts` — label dedicate al flusso codice
- [x] Build check

### ✅ TASK-026 — Fix QR scan 404 + URL parser robusto (23/04/2026)
- [x] `storage.ts` — generazione link QR con `?xfer=` (non hash)
- [x] `storage.ts` — parser token compatibile con formato vecchio e nuovo
- [x] `App.tsx` — ingest da hash/query/path + pulizia URL post-scan
- [x] Build check

### ✅ TASK-025 — Import PC → telefono via QR con merge dati (22/04/2026)
- [x] Strategia sync transazioni con metadati (`syncId`, `createdAt`, `updatedAt`)
- [x] Merge sicuro su import (`mode: 'merge'`) senza sostituzione completa
- [x] Flusso QR chunked (`#xfer=...`) per superare il limite di payload del singolo QR
- [x] UI Settings: generazione QR, navigazione chunk, import merge lato telefono
- [x] Cifratura mantenuta (AES-GCM + password) anche nel trasferimento QR
- [x] Aggiornati `TASKS.md`, `CHANGELOG.md` e build check

### ✅ TASK-024 — Cambio lingua nei Settings (22/04/2026)
- [x] `labels.ts` — label `lingua` nella sezione settings (IT/EN/ES)
- [x] `Settings.tsx` — sezione lingua con 3 bottoni (🇮🇹 🇬🇧 🇪🇸), reload su cambio
- [x] Build check

### ✅ TASK-023 — Regola aggiornamento CHANGELOG (22/04/2026)
- [x] `copilot-instructions.md` — sezione "Regole Obbligatorie a Fine Task"
- [x] `CHANGELOG.md` — voci TASK-020 e TASK-021 aggiunte
- [x] `CHANGELOG.md` — voce TASK-022 e TASK-023 aggiunte

### ✅ TASK-022 — Cifratura AES-GCM backup export/import (22/04/2026)
- [x] `storage.ts` — `exportAllData(password)` async con AES-GCM + PBKDF2
- [x] `storage.ts` — `importAllData(json, password?)` async, gestisce formato cifrato e plain
- [x] `labels.ts` — label password prompt (IT/EN/ES)
- [x] `Settings.tsx` — handler async, prompt password, nuovo stato `wrong-password`
- [x] Build check

### ✅ TASK-021 — Nuova icona app (moneta + orbita) (22/04/2026)
- [x] `public/pwa-192x192.svg` — icona 192×192 con moneta dorata + orbita
- [x] `public/pwa-512x512.svg` — icona 512×512 scalata
- [x] `index.html` — favicon aggiornato
- [x] Build check

### ✅ TASK-020 — Export/Import JSON + feature flag (22/04/2026)
- [x] `src/app/features.ts` — configurazione globale feature flags
- [x] `storage.ts` — `exportAllData()` e `importAllData()` 
- [x] `labels.ts` — label sezione sincronizzazione (IT/EN/ES)
- [x] `Settings.tsx` — sezione Export/Import JSON gated da `FEATURES.exportImportJson`
- [x] Build check

### ✅ TASK-019 — Componenti UI riusabili + regola check (19/04/2026)
- [x] Creata cartella `src/components/ui/` con barrel export
- [x] Card: contenitore con bordo/sfondo tema (padding sm/md/lg)
- [x] Button: 4 varianti (primary/secondary/danger/ghost), selected, disabled, fullWidth
- [x] Input: campo con stile tema (size sm/md/lg, type text/number/date/password/time)
- [x] IconButton: bottone icona (size sm/md/lg, shape circle/square)
- [x] SectionHeader: titolo sezione uppercase muted
- [x] Modal: overlay modale con click-outside-to-close (position center/bottom)
- [x] FAB: floating action button con stile tema
- [x] Regola aggiunta a copilot-instructions.md: "controllare ui/ prima di creare elementi"
- [x] 31 test passati + build check OK

### ✅ TASK-018 — Transazioni modificabili + audit sicurezza (19/04/2026)
- [x] `updateTransaction()` in storage.ts
- [x] AddTransactionForm accetta `editTransaction` prop per pre-popolare i campi
- [x] Bottone ✏️ su ogni movimento in Dashboard
- [x] Labels modifica (IT/EN/ES)
- [x] PIN hashato con SHA-256 + confronto constant-time
- [x] `generateId()` con `crypto.getRandomValues()` (CSPRNG)
- [x] Validazione schema su `loadTransactions()` (filtra dati corrotti)
- [x] Sessione PIN con timeout 30 minuti
- [x] 31 test passati (3 nuovi: updateTransaction + validazione)

### ✅ TASK-017 — Fix grafiche donut + sistema solare (19/04/2026)
- [x] Donut snellito (outerR 130→100, innerR 75→58) per evitare overflow pianeti
- [x] Orbite calcolate dinamicamente con cap al bordo canvas
- [x] Ombra crescent e scia corrette per pianeti in senso antiorario (param direction)
- [x] Sistema solare: stesse fix ombra/scia + maggiore distanza sole-pianeti
- [x] Build check passato + deployato

### ✅ TASK-016 — Legenda grafici con pianeti animati su canvas (19/04/2026)
- [x] Creato componente MiniPlanet: mini canvas animato con glow pulsante, gradiente, crescent shadow
- [x] Integrato in SpaceDonutChart e SolarSystemChart (sostituisce pallino HTML)
- [x] Changelog v1.7.0 aggiornato con rename + grafici + iOS
- [x] Build check passato

### ✅ TASK-015 — Rinomina app da AstroCoin a Hermes (19/04/2026)
- [x] Rinominati tutti i riferimenti in src/ (labels, storage keys, changelog, notifications, PWA)
- [x] Aggiornati vite.config.ts (base, manifest, scope, start_url → /Hermes/)
- [x] Aggiornati index.html, package.json
- [x] Aggiornati test (labels, storage, theme)
- [x] 28 test passati + build check OK
- [x] Nota: serve rinominare repo GitHub da AstroCoin a Hermes

### ✅ TASK-014 — Solar System chart animato su canvas (19/04/2026)
- [x] Riscritto SolarSystemChart: da SVG/HTML statico a canvas con requestAnimationFrame
- [x] Sfondo cosmico (#080b18) con 80 stelle scintillanti
- [x] Sole centrale con gradiente radiale, glow pulsante e testo totale
- [x] Pianeti orbitanti: gradiente, alone di luce, ombra crescent, trail di scia
- [x] Orbite tratteggiate con opacità animata
- [x] Emoji categoria + percentuale su ogni pianeta
- [x] Legenda laterale con pallino glow, stile coerente con SpaceDonutChart
- [x] Build check passato + deployato

### ✅ TASK-013 — Donut chart spaziale animato su canvas (19/04/2026)
- [x] Componente SpaceDonutChart: canvas con requestAnimationFrame
- [x] Sfondo scuro con 80 stelle scintillanti animate
- [x] Fette donut con bordo luminoso pulsante + gap lines
- [x] Pianeti orbitanti per ogni fetta: gradiente, alone di luce, lunetta trail, velocità diverse
- [x] Anelli orbitali tratteggiati
- [x] Centro con etichette Entrate/Uscite + importi
- [x] Legenda laterale con pallino glow, nome, importo, percentuale colorata
- [x] Integrato in ExpensePieChart come vista "Torta" (sostituisce vecchio CSS donut)
- [x] Build check passato + deployato

### ✅ TASK-012 — Grafico Sistema Solare + toggle vista (19/04/2026)
- [x] Creato componente SolarSystemChart: categorie come pianeti orbitanti, sole = totale spese
- [x] Dimensione pianeta proporzionale alla percentuale, emoji + % su ogni pianeta
- [x] Orbite tratteggiate, sfondo stellato, animazione glow
- [x] Legenda laterale con icone, importi e percentuali
- [x] Toggle 🥧 Torta / 🪐 Sistema solare in ExpensePieChart
- [x] Labels i18n (vistaTorta, vistaSolare, categorieLabel)
- [x] Build check passato + deployato

### ✅ TASK-011 — Supporto installazione PWA su iOS (19/04/2026)
- [x] Rilevamento iOS (iPad/iPhone/iPod) in InstallPrompt
- [x] Banner istruzioni "tocca ⬆️ poi Aggiungi alla schermata Home" su Safari iOS
- [x] Nasconde pulsante Installa su iOS (non supportato), mostra solo istruzioni
- [x] Controllo standalone mode: banner non appare se già installata
- [x] Label i18n iosMessage (IT/EN/ES)
- [x] Build check passato + deployato

### ✅ TASK-010 — PWA con notifiche push (19/04/2026)
- [x] Installato vite-plugin-pwa + configurato manifest (nome, colori, display standalone)
- [x] Icone PWA SVG 192x192 e 512x512 con tema spaziale
- [x] Service Worker con Workbox: precache 14 risorse + runtime cache font
- [x] Notifiche via SW (showNotification) per funzionare in background
- [x] Componente InstallPrompt con banner "Installa AstroCoin"
- [x] Labels i18n per PWA (IT/EN/ES)
- [x] Changelog v1.6.0 aggiornato
- [x] Build check passato

### ✅ TASK-009 — Notifica "Novità" dopo ogni deploy (19/04/2026)
- [x] Creato `src/shared/changelog.ts` con array versioni + novità multilingua (IT/EN/ES)
- [x] Creato componente `WhatsNew.tsx`: modale con lista novità, salva versione vista in localStorage
- [x] Integrato in App.tsx: appare automaticamente dopo il PIN se la versione è nuova
- [x] Per aggiungere novità ai prossimi deploy: aggiungere entry in cima a `CHANGELOG` e aggiornare `CURRENT_VERSION`
- [x] Build check passato

### ✅ TASK-008 — Restyling colori movimenti in dark mode (19/04/2026)
- [x] Sostituite classi Tailwind hardcoded con CSS variables per card riepilogo e lista movimenti
- [x] Palette NASA-inspired: verde brillante entrate, arancione NASA uscite, viola/arancione risparmi
- [x] Colori adattivi in entrambi i temi (spazio dark + NASA light)
- [x] Build check passato

### ✅ TASK-007 — Notifiche promemoria spese giornaliere (19/04/2026)
- [x] NotificationSettings interface + loadNotificationSettings/saveNotificationSettings in storage.ts
- [x] Sezione Notifiche nel Settings: toggle on/off + preset orari (19:00, 21:30) + input custom
- [x] Hook useNotificationScheduler con check ogni 30s + Notification API browser
- [x] Labels i18n per notifiche (IT/EN/ES)
- [x] Build check passato

### ✅ TASK-006 — Menu Settings con tema e gestione categorie (19/04/2026)
- [x] Componente Settings.tsx con dropdown ⚙️ nell'header
- [x] Sezione Tema: toggle Dark (Spazio) / Light (NASA)
- [x] Tema NASA Light creato in index.css (bianco, nero, arancione NASA #FC3D21)
- [x] ThemeContext aggiornato: Theme = 'spazio' | 'nasa'
- [x] Sezione Categorie con link a /categories
- [x] Rimosso vecchio ThemeSwitcher + link categorie dall'header
- [x] Build check passato

### ✅ TASK-005 — Gestione categorie completa (19/04/2026)
- [x] Form creazione categorie nella pagina /categories (nome + tipo + emoji picker)
- [x] Emoji picker con 32 icone selezionabili
- [x] Custom icons: loadCustomIcons/saveCustomIcon/deleteCustomIcon in storage.ts
- [x] categoryIcons.ts aggiornato per supportare icone custom
- [x] Rinomina categoria custom (renameCustomCategory: aggiorna lista + icone + transazioni)
- [x] Eliminazione con conferma + pulizia icona
- [x] Labels i18n per nuove funzionalità gestione categorie
- [x] Build check passato

### ✅ TASK-004 — Categorie custom + descrizione opzionale (19/04/2026)
- [x] Descrizione "Per cosa?" resa opzionale (fallback al nome categoria)
- [x] Rimosso auto-fill descrizione
- [x] Bottone "+ Nuova categoria" nel form con opzione "Salva per il futuro"
- [x] Categorie custom salvate in localStorage (`astrocoin-custom-categories`)
- [x] Pagina `/categories` per gestire (visualizzare/eliminare) le categorie custom
- [x] Link nell'header per navigare alla gestione categorie
- [x] Build + test passati

### ✅ TASK-003 — Icone emoji per categorie transazioni (19/04/2026)
- [x] 14 categorie uscita + 5 entrata aggiornate in labels.ts (IT/EN/ES)
- [x] `categoryIcons.ts` creato con mappa categoria → emoji
- [x] Icone visibili nel form (selettore categoria)
- [x] Icone visibili nella lista movimenti in Dashboard
- [x] Build + test passati

### ✅ TASK-002 — Setup unit test e test base (19/04/2026)
- [x] Vitest + Testing Library + jsdom installati
- [x] 3 file test: storage (11), labels (14), theme (3) — 28 test totali
- [x] Script `test` e `test:watch` in package.json
- [x] Build + test passati

### ✅ TASK-001 — Refactor form transazione e UX categoria (19/04/2026)
- [x] Categoria spostata sopra "Per cosa?"
- [x] Auto-fill descrizione alla selezione categoria
- [x] Descrizione liberamente editabile
- [x] Build check passato

### ✅ TASK-000 — Creazione progetto (19/04/2026)
- [x] Scaffolding React 19 + TypeScript 5.7 + Vite 6
- [x] Tailwind CSS 4, React Router DOM 7
- [x] Struttura cartelle: components/, pages/, shared/
- [x] Layout base, Dashboard, Home, NotFound
- [x] Sistema i18n (labels.ts) con IT/EN/ES
- [x] ThemeContext + tema spazio (dark)
- [x] localStorage per persistenza dati (storage.ts)
- [x] Modello Transaction + AppSettings
- [x] Form AddTransactionForm + lista movimenti
- [x] Componente Mascot con messaggi dinamici
- [x] Deploy su GitHub Pages

