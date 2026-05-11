// ─── Outer Wilds — Traveler Theme Instruments ────────────
// Mappa alias pianeta → file audio e metadati strumento.
// Ignorato: new traveler (DLC).

export interface OWInstrument {
  icon: string   // emoji da mostrare sul bottone
  label: string  // nome strumento (tooltip)
  src: string    // percorso file audio (relativo alla base Vite)
}

const BASE = import.meta.env.BASE_URL // '/Andromeda/' in dev+prod

function ow(filename: string, icon: string, label: string): OWInstrument {
  return { icon, label, src: `${BASE}${encodeURIComponent(filename)}` }
}

export const OW_INSTRUMENTS: Record<string, OWInstrument> = {
  'Timber Hearth':  ow('OW TravelerTheme whistling.mp3', '💨', 'Fischio'),
  'Ember Twin':     ow('OW TravelerTheme drums.mp3',     '🥁', 'Percussioni'),
  "Giant's Deep":   ow('OW TravelerTheme flute.mp3',     '🪈', 'Flauto'),
  'Brittle Hollow': ow('OW TravelerTheme banjo.mp3',     '🪕', 'Banjo'),
  'Dark Bramble':   ow('OW TravelerTheme harmonica.mp3', '🪗', 'Fisarmonica'),
  'Quantum Moon':   ow('OW TravelerTheme piano.mp3',     '🎹', 'Pianoforte'),
}
