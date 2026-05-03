# MissionCard — Animation Reference

> Guida alle animazioni di `src/components/MissionCard.tsx`.
> Aggiornare questo file ad ogni modifica di timing o keyframe.

---

## Fasi di lancio (`launchPhase`)

```
idle → ready → countdown → ignition → travel
```

| Fase | Trigger | Durata |
|------|---------|--------|
| `idle` | pct < 100 | indefinita |
| `ready` | pct ≥ 100 | fino al click LANCIA |
| `countdown` | click LANCIA | 10s (1s/tick) |
| `ignition` | countdown = 0 | 7.3s (poi → travel) |
| `travel` | fine ignition | indefinita |

---

## Timeline `ignition` (t=0 al countdown=0)

```
t=0s    → launchPhase='ignition'
           • Fiamme appaiono lentamente (mc-flame-appear, 0.85s)
           • Fuoco colpisce terreno (mc-ground-fire, 0.65s)
           • Fumo inizia a salire (mc-smoke-*, loop 1.1-1.3s)
           • Bracci pad iniziano ad aprirsi (0.4s delay + 0.8s durata)
           • Testo "IGNITION" nel SVG + sotto SVG (arancione)
           • CSS transition su stelle+nave applicata (delay 3s → non parte ancora)

t=1s    → liftOff=true  (setTimeout JS 1000ms)
           • Testo "LIFT OFF" sostituisce "IGNITION" (giallo)
           • Fiamme diventano grandi (bigFlames=true)
           • Pad+terreno+fuoco+fumo iniziano a scorrere giù (mc-pad-down, 2.5s)
           • CSS transition rotation ancora in attesa del suo delay

t=3s    → Rotazione stelle+nave INIZIA (CSS transition delay scaduto)
           • transform: rotate(0deg) → rotate(90deg) in 3s
           • easing: cubic-bezier(0.3, 0, 0.1, 1)  — parte lenta, finisce rapida
           • stelle e nave usano STESSO delay/durata → sincronizzate

t=6s    → Rotazione COMPLETA (3s delay + 3s durata)

t=7.3s  → launchPhase='travel'
           • liftOff=false
           • Pad nascosto, stelle+nave restano a 90° (inline style, no transition)
           • localStorage: astrocoin-mc-launched-{name}='true'
```

---

## Keyframes CSS (`STYLES` const)

### Fiamme

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-flame-a` | `flicker` | 0.5s | ∞ | scaleY 1→1.4, idle/travel |
| `.mc-flame-b` | `flickerB` | 0.7s | ∞ | scaleY 1.1→0.8, idle/travel |
| `.mc-flame-big` | `flickerBig` | 0.22s | ∞ | scaleY 1.6→2.2→1.9, ignition liftOff |
| `.mc-flame-appear` | `flameAppear` | 0.85s | una volta | scaleY 0.05→1, primo secondo ignition |

**Logica bigFlames**: `bigFlames = inLaunchSequence && liftOff` → fiamme grandi solo dopo il LIFT OFF (t=1s).
**Logica igniting**: `igniting = inLaunchSequence && !liftOff` → gruppo fiamme wrappato in `mc-flame-appear` solo nel primo secondo.

### Terreno / Fumo (solo durante `ignition`, dentro il gruppo pad)

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-ground-fire` | `groundFireBurst` | 0.65s | una volta | scale 0.05→1.2→1, fuoco al suolo |
| `.mc-smoke-l` | `smokeRiseL` | 1.3s | ∞ | translate(-38,-28)+scale 2.2, fumo sinistra |
| `.mc-smoke-r` | `smokeRiseR` | 1.3s | ∞ | translate(+38,-28)+scale 2.2, delay 0.18s |
| `.mc-smoke-c` | `smokeRiseC` | 1.1s | ∞ | scale 2.8, fumo centrale, delay 0.45s |
| `.mc-smoke-l2` | `smokeRiseL` | 1.3s | ∞ | fumo sinistra largo, delay 0.65s |
| `.mc-smoke-r2` | `smokeRiseR` | 1.3s | ∞ | fumo destra largo, delay 0.80s |

> ⚠️ Fire+smoke sono DENTRO `<g className="mc-pad-down">` → scendono con il terreno al liftOff.

### Pad / Struttura

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-pad-down` | `padSlideDown` | 2.5s | una volta | translateY 0→300px + opacity→0 |
| `.mc-pad-arm-l` | `padArmsOpen` | 0.8s | una volta | translateX 0→-28px, delay 0.4s |
| `.mc-pad-arm-r` | `padArmsOpenR` | 0.8s | una volta | translateX 0→+28px, delay 0.4s |
| `.mc-blink-pad` | `blinkPad` | 1s | ∞ | luci rosse torri |
| `.mc-blink-pad-b` | `blinkPad` | 1s | ∞ | luci rosse, delay 0.5s |

### Stelle

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-star-down` | `starScrollDown` | 1.8s | ∞ | translateY 0→210px |
| `.mc-star-down2` | `starScrollDown` | 2.6s | ∞ | delay 0.4s |
| `.mc-star-down3` | `starScrollDown` | 4.0s | ∞ | delay 1.0s |

Stelle attive durante `inLaunchSequence || inTravel`. Il container stelle ruota 90° con CSS `transition` (→ scroll verticale diventa orizzontale nella vista travel).

### Nave (rotazione)

La rotazione è gestita con **inline style + CSS transition** (no classe), per evitare recompositing.

```
idle:        rotate(0deg),  no transition
ignition:    rotate(90deg), transition: transform 3s 3s cubic-bezier(0.3,0,0.1,1)
travel:      rotate(90deg), no transition  ← stesso valore → zero flicker
```

- `transformOrigin: '100px 105px'` — coordinate SVG fisse (no fill-box, evita pulsazione da fiamme)
- Stelle e nave usano **stesso origin + stesso timing** → sempre sincronizzate

### Nave (floating in travel)

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-ship-float` | `spaceFloat` | 3.5s | ∞ | translateX 0↔-5px, nave in travel |

### Cockpit / Pezzi

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-blink-r` | `blink` | 1.1s | ∞ | luce rossa cockpit |
| `.mc-blink-g` | `blinkG` | 1.4s | ∞ | luce verde cockpit, delay 0.3s |
| `.mc-unlock` | `unlockPop` | 0.5s | una volta | scale 0→1.15→1, sblocco pezzo |
| `.mc-flash` | `flashRing` | 0.6s | una volta | cerchio espansione, r 4→60, opacity→0 |

### Countdown / Bottone

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-countdown` | `countdownPulse` | 0.9s | ∞ | scale 1→1.18, pulsazione numero |
| `.mc-btn-glow` | `btnGlow` | 1.2s | ∞ | box-shadow glow arancione, bottone LANCIA |

### Testi overlay SVG

| Classe | Keyframe | Durata | Loop | Note |
|--------|----------|--------|------|------|
| `.mc-text-ignite` | `textFadeIn` | 0.45s | una volta | "IGNITION", t=0s–1s |
| `.mc-text-liftoff` | `textFadeIn` | 0.40s | una volta | "LIFT OFF", t=1s+ |

---

## Variabili di stato rilevanti

| Variabile | Tipo | Scopo |
|-----------|------|-------|
| `launchPhase` | `'idle'\|'ready'\|'countdown'\|'ignition'\|'travel'` | macchina a stati principale |
| `liftOff` | `boolean` | true 1s dopo ignition (pad scende, fiamme grandi) |
| `countdown` | `number` | 10→0, decrementa ogni secondo |

## Refs timeout

| Ref | Scopo |
|-----|-------|
| `cdInterval` | setInterval countdown 1s/tick |
| `ignTimeout` | setTimeout 7300ms → travel |
| `liftOffTimeout` | setTimeout 1000ms → liftOff=true |
| `flashTimeout` | setTimeout 700ms → newlyUnlocked=null |

---

## Come modificare i timing

**Anticipare la rotazione** → abbassare il delay CSS (`3s`) nelle inline style di stelle e nave. Ricordarsi di aggiustare anche `ignTimeout` di conseguenza (deve essere > delay+durata = 3+3=6s).

**Ritardare il liftOff** → aumentare `liftOffTimeout` (default 1000ms).

**Allungare la rotazione** → aumentare la durata CSS (`3s`) nelle inline style. Aggiornare `ignTimeout`.

**Più fumo** → aggiungere altre ellissi dentro il blocco `{inLaunchSequence && ...}` nel gruppo pad.

**Ritmo fiamme** → modificare i valori in `flickerBig` keyframe (attualmente 0.22s, molto rapido per effetto realistico).
