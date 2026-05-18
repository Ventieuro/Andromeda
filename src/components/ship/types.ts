// Identificatore skin per ogni pezzo: 0 = default, 1+ = skin alternative
export type ShipSkin = number

// Mappa skin per pezzo — passata a <Spaceship skins={...} />
export type ShipSkins = Partial<Record<'engine' | 'body' | 'wings' | 'nose' | 'cockpit', ShipSkin>>
