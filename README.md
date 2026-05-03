# 🚀 Hermes

App personale per la gestione delle finanze personali a tema spaziale, costruita con React e pensata per il mobile.

## Funzionalità

### 💰 Finanze
- **Dashboard** — saldo, entrate/uscite del periodo, riepilogo rapido
- **Movimenti** — lista transazioni filtrabile per mese, ricerca, elimina
- **Transazioni ricorrenti** — gestione automatica multi-mese con propagazione serie
- **Importazione Money+** — importa storico da file CSV di Money+

### 📊 Grafici
- **Torta categorie** — distribuzione spese per categoria
- **Sistema Solare** — spese come pianeti in orbita proporzionale
- **Grafico Cometa** — andamento mensile entrate/uscite nell'anno

### 🎯 Missioni (Savings Goals)
- **Missioni di risparmio** — obiettivi con progresso percentuale
- **Astronave assemblabile** — rocket SVG sbloccato pezzo per pezzo al raggiungimento delle soglie
- **Color picker** — personalizzazione colore di ogni pezzo sbloccato
- **Animazione lancio** — ignizione, fumo, fuoco, rotazione e liftoff al 100%

### 🛒 Catalogo Prodotti
- **Lista prodotti preferiti** — prezzi di riferimento, storico acquisti
- **Associazione categoria** — ogni prodotto categorizzato con icona

### 📷 Scanner Scontrino
- **OCR via fotocamera** — scansiona uno scontrino e importa automaticamente gli articoli
- **Parser intelligente** — estrae voci, prezzi e totale dal testo OCR
- **Tesseract.js v7** — riconoscimento testo lato client, nessun dato inviato a server

### 🔐 Sicurezza
- **Blocco PIN** — 4 cifre, hashing SHA-256, sessione 30 minuti
- **Biometrico** — impronta/face ID via WebAuthn (platform authenticator)
- **Crittografia backup** — AES-256-GCM con password

### 💾 Dati & Backup
- **Storage locale** — IndexedDB (+ fallback localStorage), nessun backend
- **Backup automatico** — pianificato, verso cartella o download
- **Export/Import JSON** — backup cifrato con password
- **Trasferimento QR** — sposta tutti i dati da PC a telefono senza cloud
- **Backup completo** — include transazioni, impostazioni, categorie, prodotti, missioni

### 🌍 Personalizzazione
- **Multilingua** — Italiano, English, Español
- **3 temi** — Spazio (dark), Mission (dark-accent), NASA (light)
- **Categorie personalizzate** — aggiunta, rinomina, eliminazione con icone custom
- **Mascotte astronauta** — messaggi motivazionali con metafore spaziali

### 📱 App
- **PWA offline-first** — installabile su Android/iOS, funziona senza connessione
- **Notifiche** — promemoria pagamenti/transazioni
- **What's New** — modale changelog aggiornamento automatico
- **Responsive** — ottimizzata per mobile, utilizzabile da desktop

## Tech Stack

| | Tecnologia |
|---|---|
| ⚛️ | React 19 + TypeScript 5.7 (strict) |
| ⚡ | Vite 6 |
| 🎨 | Tailwind CSS 4 |
| 🧭 | React Router DOM 7 |
| 💾 | IndexedDB (+ fallback localStorage) |
| 🔍 | Tesseract.js v7 (OCR) |
| 📦 | Workbox PWA |

## Quick Start

```bash
# Installazione dipendenze
npm install

# Dev server (accessibile in rete locale)
npm run dev -- --host

# Build di produzione
npm run build

# Deploy su GitHub Pages
npm run deploy
```

## Struttura Progetto

```
src/
├── app/            → Feature flags
├── components/     → Componenti riusabili
│   └── ui/         → Componenti UI primitivi (Button, Card, Modal…)
├── pages/          → Pagine (Dashboard, Movimenti, Categories, Settings…)
└── shared/         → Logica condivisa (labels, storage, types, theme…)
```

Vedi [STRUCTURE.md](STRUCTURE.md) per la struttura completa.

## Licenza

Progetto personale — uso privato.
