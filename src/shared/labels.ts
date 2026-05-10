/**
 * Sistema i18n dell'app.
 * ✅ Sistema di auto-update ATTIVO — test #2 del sistema di notifica
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AGGIUNGERE UNA NUOVA LABEL:                                   ║
 * ║                                                                 ║
 * ║  1. Trova la sezione giusta (layout, dashboard, ecc.)           ║
 * ║  2. Aggiungi UNA riga:                                          ║
 * ║                                                                 ║
 * ║     nomeLabel: t('Italiano', 'English', 'Español'),             ║
 * ║                                                                 ║
 * ║  Per funzioni con parametri:                                    ║
 * ║     saluto: tf(                                                 ║
 * ║       (nome: string) => `Ciao ${nome}!`,                       ║
 * ║       (nome: string) => `Hello ${nome}!`,                      ║
 * ║       (nome: string) => `¡Hola ${nome}!`,                      ║
 * ║     ),                                                          ║
 * ║                                                                 ║
 * ║  Per array:                                                     ║
 * ║     frutti: ta(['Mela','Pera'], ['Apple','Pear'], ['Manzana','Pera']), ║
 * ║                                                                 ║
 * ║  Fatto! Non serve toccare nient'altro.                          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─── Lingue disponibili ──────────────────────────────────
export type Locale = 'it' | 'en' | 'es'

// ─── Helper: scrivi it + en + es sulla stessa riga ───────
type I18n<V> = Record<Locale, V>
function t(it: string, en: string, es: string): I18n<string> { return { it, en, es } }
function tf<A extends unknown[]>(it: (...a: A) => string, en: (...a: A) => string, es: (...a: A) => string): I18n<(...a: A) => string> { return { it, en, es } }
function ta(it: readonly string[], en: readonly string[], es: readonly string[]): I18n<readonly string[]> { return { it, en, es } }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                    TUTTE LE LABEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STRINGS = {

  // ── Layout ─────────────────────────────────────────────
  layout: {
    appName:       t('🚀 Andromeda',  '🚀 Andromeda',     '🚀 Andromeda'),
    footerText:    t('Andromeda',     'Andromeda',        'Andromeda'),
    navHome:        t('Home',         'Home',          'Inicio'),
    navCategories:  t('Categorie',    'Categories',    'Categorias'),
    navMovimenti:   t('Movimenti',    'Transactions',  'Movimientos'),
    navSettings:    t('Configurazioni', 'Settings',      'Configuración'),
    navMissioni:    t('Missioni',     'Missions',      'Misiones'),
    navAdd:         t('Aggiungi',     'Add',           'Agregar'),
    nascondiImporti: t('Nascondi importi', 'Hide amounts', 'Ocultar importes'),
    mostraImporti:   t('Mostra importi',   'Show amounts',  'Mostrar importes'),
    importiNascosti: t('importi nascosti', 'amounts hidden', 'importes ocultos'),
  },

  // ── Temi ───────────────────────────────────────────────
  temi: {
    nebula:  t('Nebula',   'Nebula',   'Nebulosa'),
    nasa:    t('Orbiter',  'Orbiter',  'Orbiter'),
    mission: t('Campfire', 'Campfire', 'Campfire'),
    aurora:  t('Aurora',   'Aurora',   'Aurora'),
    luna:    t('Luna',     'Moon',     'Luna'),
    supernova: t('Supernova', 'Supernova', 'Supernova'),
  },

  // ── Dashboard ──────────────────────────────────────────
  dashboard: {
    periodoPrecedente:            t('Periodo precedente',                             'Previous period',                        'Período anterior'),
    periodoSuccessivo:            t('Periodo successivo',                              'Next period',                            'Período siguiente'),
    stipendioIl:                  t('📅 Stipendio il:',                                '📅 Pay day:',                             '📅 Día de pago:'),
    stipendioHint:                t('Il giorno in cui ricevi lo stipendio. Determina l\'inizio e la fine di ogni periodo mensile nei grafici.', 'The day you receive your salary. It sets the start and end of each monthly period in the charts.', 'El día en que recibes tu salario. Determina el inicio y fin de cada período mensual en los gráficos.'),    oggi:                         t('🌍 Oggi',                                         '🌍 Today',                                '🌍 Hoy'),
    entrate:                      t('Entrate',                                         'Income',                                 'Ingresos'),
    uscite:                       t('Uscite',                                          'Expenses',                               'Gastos'),
    risparmi:                     t('Risparmi',                                        'Savings',                                'Ahorros'),
    movimenti:                    t('Movimenti',                                       'Transactions',                           'Movimientos'),
    nessunoMovimentoEmoji:        t('🪐',                                              '🪐',                                      '🪐'),
    nessunoMovimento:             t('Nessun movimento in questo periodo.',              'No transactions in this period.',         'No hay movimientos en este período.'),
    nessunoMovimentoSuggerimento: t('Premi il bottone qui sotto per aggiungerne uno!', 'Tap the button below to add one!',       '¡Pulsa el botón de abajo para añadir uno!'),
    eliminaLabel:                 t('Elimina',                                         'Delete',                                 'Eliminar'),
    eliminaConferma: tf(
      (desc: string) => `Vuoi eliminare "${desc}"?`,
      (desc: string) => `Delete "${desc}"?`,
      (desc: string) => `¿Eliminar "${desc}"?`,
    ),
    eliminaRicorrenteScope:       t('Eliminare solo questa o tutte le collegate?',      'Delete just this one or all linked?',    '¿Eliminar solo esta o todas?'),
    eliminaTutte:                 t('Tutte le collegate',                               'All linked',                             'Todas'),
    eliminaSoloQuesta:            t('Solo questa',                                      'Just this one',                          'Solo esta'),
    dettaglioScontrino:           t('Dettaglio',                                        'Details',                                'Detalle'),
    aggiungiMovimento:            t('Aggiungi movimento',                              'Add transaction',                        'Añadir movimiento'),
    graficoSpese:                 t('Il tuo universo finanziario',                    'Your financial universe',                'Tu universo financiero'),
    nessunGrafico:                t('Nessuna uscita in questo periodo.',               'No expenses in this period.',            'No hay gastos en este período.'),
    risparmiLabel:                t('Saldo',                                           'Balance',                                'Saldo'),
    missioniRisparmio:            t('Risparmi Obiettivi',                              'Goal Savings',                           'Ahorros Objetivos'),
    obiettivoRisparmio:           t('Obiettivo risparmio',                             'Savings goal',                           'Meta de ahorro'),
    legendaMostraTutte: tf(
      (n: number) => `Mostra tutte le categorie (${n}) ▼`,
      (n: number) => `Show all categories (${n}) ▼`,
      (n: number) => `Mostrar todas las categorías (${n}) ▼`,
    ),
    legendaNascondi:              t('Comprimi ▲',                                      'Collapse ▲',                             'Comprimir ▲'),
    categorieLabel:               t('Categorie',                                       'Categories',                             'Categorías'),
    spesaImportante:              t('importante',                                      'important',                              'importante'),
    ordinaPerImporto:             t('Dal più grande',                                  'Largest first',                          'Mayor primero'),
    ordinaPerImportante:          t('Importanti prima',                                'Important first',                        'Importantes primero'),
    vistaTorta:                   t('Riepilogo',                                       'Overview',                               'Resumen'),
    vistaSolare:                  t('Spese',                                           'Expenses',                               'Gastos'),
    vistaCometa:                  t('Annuale',                                         'Yearly',                                 'Anual'),
    cometaCumulativo:             t('Totale accumulato',                               'Total accumulated',                      'Total acumulado'),
    cometaMensile:                t('Per mese',                                        'Per month',                              'Por mes'),
  },

  // ── Mascotte ───────────────────────────────────────────
  mascotte: {
    ariaLabel: t('astronauta', 'astronaut', 'astronauta'),
    messaggi: {
      vuoto:  t('Houston, nessun movimento rilevato! Lancia la tua prima transazione 🛸',
                'Houston, no transactions detected! Launch your first one 🛸',
                '¡Houston, sin movimientos! Lanza tu primera transacción 🛸'),
      ottimo: t('Missione risparmio: successo totale! Continua così, astronauta! 🌟',
                'Savings mission: total success! Keep it up, astronaut! 🌟',
                '¡Misión ahorro: éxito total! ¡Sigue así, astronauta! 🌟'),
      bene: tf(
        (saldo: string) => `Ottimo pilota! Hai messo in orbita ${saldo} questo mese 🪐`,
        (saldo: string) => `Great pilot! You put ${saldo} into orbit this month 🪐`,
        (saldo: string) => `¡Gran piloto! Pusiste ${saldo} en órbita este mes 🪐`,
      ),
      pari:   t('Stazione spaziale in equilibrio. Proviamo a spingere verso le stelle? ⭐',
                'Space station balanced. Shall we push toward the stars? ⭐',
                'Estación espacial en equilibrio. ¿Intentamos llegar a las estrellas? ⭐'),
      rosso: tf(
        (importo: string) => `Allerta! Sei in rosso di ${importo}... Rientro d'emergenza! 🆘`,
        (importo: string) => `Alert! You're ${importo} in the red... Emergency landing! 🆘`,
        (importo: string) => `¡Alerta! Estás en rojo por ${importo}... ¡Aterrizaje de emergencia! 🆘`,
      ),
      majorTom: t(
        'Ground Control to Major Tom... stiamo perdendo il segnale 📡',
        'Ground Control to Major Tom... we are losing your signal 📡',
        'Ground Control to Major Tom... estamos perdiendo tu señal 📡',
      ),
      majorTomRientro: t(
        'Major Tom ha riacquistato la rotta! Benvenuto di nuovo nello spazio positivo 🚀',
        'Major Tom is back on track! Welcome back to positive space 🚀',
        '¡Major Tom ha recuperado la ruta! Bienvenido de nuevo al espacio positivo 🚀',
      ),
      obiettivoRaggiunto: t(
        '"Alla velocità della luce!" 🚀 Obiettivo mese centrato — missione compiuta!',
        '"To infinity and beyond!" 🚀 Monthly goal hit — mission accomplished!',
        '"¡Al infinito y más allá!" 🚀 ¡Objetivo del mes cumplido — misión completada!',
      ),
      obiettivoVicino: tf(
        (mancante: string) => `"Forza, Luke!" Mancano solo ${mancante} all'obiettivo 💪`,
        (mancante: string) => `"Use the Force!" Just ${mancante} to reach your goal 💪`,
        (mancante: string) => `"¡Usa la Fuerza!" Solo ${mancante} para tu objetivo 💪`,
      ),
      obiettivoMancato: tf(
        (importo: string) => `"Houston, abbiamo un problema." Mancano ${importo} all'obiettivo questo mese 📡`,
        (importo: string) => `"Houston, we have a problem." You're ${importo} short of your goal 📡`,
        (importo: string) => `"Houston, tenemos un problema." Te faltan ${importo} para tu objetivo 📡`,
      ),
      carryover: tf(
        (importo: string) => `"Non arrenderti mai!" Recupero da mesi precedenti: +${importo} sull'obiettivo 🔁`,
        (importo: string) => `"Never give up!" Catchup from past months: +${importo} on your goal 🔁`,
        (importo: string) => `"¡Nunca te rindas!" Recuperación de meses anteriores: +${importo} 🔁`,
      ),
    },
  },

  // ── Form Transazione ───────────────────────────────────
  form: {
    titoloEntrata:          t('💚 Nuova entrata',                   '💚 New income',                  '💚 Nuevo ingreso'),
    titoloUscita:           t('🔴 Nuova uscita',                    '🔴 New expense',                 '🔴 Nuevo gasto'),
    toggleEntrata:          t('➕ Entrata',                          '➕ Income',                       '➕ Ingreso'),
    toggleUscita:           t('➖ Uscita',                           '➖ Expense',                      '➖ Gasto'),
    labelQuanto:            t('Quanto?',                             'How much?',                      '¿Cuánto?'),
    placeholderImporto:     t('0,00',                                '0.00',                           '0,00'),
    simboloValuta:          t('€',                                   '€',                              '€'),
    labelPerCosa:           t('Per cosa?',                           'What for?',                      '¿Para qué?'),
    placeholderDescrizione: t('es. Spesa al supermercato',           'e.g. Grocery shopping',          'ej. Compra en el supermercado'),
    labelCategoria:         t('Categoria',                           'Category',                       'Categoría'),
    labelQuando:            t('Quando?',                             'When?',                          '¿Cuándo?'),
    labelRicorrente:        t('Si ripete ogni mese? 🌀',             'Repeats every month? 🌀',        '¿Se repite cada mes? 🌀'),
    messaggioRicorrente:    t('Per quanti mesi vuoi che si ripeta?', 'For how many months?',           '¿Durante cuántos meses?'),
    ricorrentePreview:      tf(
      (n: number) => `Verranno create ${n} copie della transazione (una per mese).`,
      (n: number) => `${n} copies of this transaction will be created (one per month).`,
      (n: number) => `Se crearán ${n} copias de la transacción (una por mes).`,
    ),
    unitaMesi:              t('mesi',                                'months',                         'meses'),
    submitEntrata:          t('✅ Aggiungi entrata',                  '✅ Add income',                   '✅ Añadir ingreso'),
    submitUscita:           t('✅ Aggiungi uscita',                   '✅ Add expense',                  '✅ Añadir gasto'),
    modificaEntrata:        t('✏️ Salva modifiche',                   '✏️ Save changes',                 '✏️ Guardar cambios'),
    modificaUscita:         t('✏️ Salva modifiche',                   '✏️ Save changes',                 '✏️ Guardar cambios'),
    titoloModificaEntrata:  t('✏️ Modifica entrata',                  '✏️ Edit income',                  '✏️ Editar ingreso'),
    titoloModificaUscita:   t('✏️ Modifica uscita',                   '✏️ Edit expense',                 '✏️ Editar gasto'),
    nuovaCategoria:         t('+ Nuova categoria',                   '+ New category',                 '+ Nueva categoría'),
    placeholderNuovaCat:    t('Nome categoria',                      'Category name',                  'Nombre categoría'),
    aggiungiCategoria:      t('Aggiungi',                             'Add',                            'Añadir'),
    salvaPerFuturo:         t('Salva per il futuro',                  'Save for future',                'Guardar para el futuro'),
    labelPerCosaOpzionale:  t('Per cosa? (opzionale)',                'What for? (optional)',            '¿Para qué? (opcional)'),
    labelMetodoInserimento: t('Come vuoi inserire questa uscita?',    'How do you want to add this expense?', '¿Cómo quieres añadir este gasto?'),
    inserisciTramiteScontrino: t('Inserisci tramite scontrino',       'Add via receipt',                'Añadir mediante ticket'),
    inserisciManualmente:   t('Inserisci manualmente',                'Add manually',                   'Añadir manualmente'),
    scontrinoTitolo:        t('Compila da scontrino',                 'Fill from receipt',              'Completar desde ticket'),
    scontrinoDescrizione:   t('Scatta o carica una foto dello scontrino (serve accesso alla fotocamera). Andromeda legge gli articoli e prepara automaticamente le uscite.', 'Take or upload a photo of your receipt (camera access required). Andromeda reads the items and prepares the expenses automatically.', 'Saca o sube una foto del ticket (se necesita acceso a la cámara). Andromeda lee los artículos y prepara los gastos automáticamente.'),
    apriScannerNelForm:     t('Apri scanner scontrino',               'Open receipt scanner',           'Abrir escáner de ticket'),
    modificaRicorrenteScope: t('Aggiornare anche le altre occorrenze collegate?', 'Update the other linked occurrences too?', '¿Actualizar también las demás ocurrencias?'),
    modificaRicorrenteScopeNoGroup: t('Questa spesa è ricorrente ma non ha un gruppo collegato. Aggiornare tutte le spese ricorrenti della stessa categoria?', 'This expense is recurring but has no linked group. Update all recurring expenses in the same category?', '¿Esta transacción no tiene grupo. ¿Actualizar todas las recurrentes de la misma categoría?'),
    modificaTutte:           t('Sì, aggiorna tutte',                  'Yes, update all',                 'Sí, actualizar todas'),
    modificaSoloQuesta:      t('No, solo questa',                     'No, just this one',               'No, solo esta'),
    labelImportante:         t('Spesa importante ⭐',                  'Important expense ⭐',             'Gasto importante ⭐'),
    tooltipImportante:       t('Spese che devi sostenere per forza (affitto, bollette, abbonamenti…)', 'Expenses you must cover (rent, bills, subscriptions…)', 'Gastos que debes cubrir (alquiler, facturas, suscripciones…)'),
    labelMissione:           t('Missione (opzionale)',                'Mission (optional)',              'Misión (opcional)'),
    nessunaMessione:         t('Nessuna missione',                    'No mission',                     'Sin misión'),
    oDivider:                t('oppure associa a una missione',       'or link to a mission',           'o asocia a una misión'),
  },

  // ── Categorie ──────────────────────────────────────────
  categorie: {
    entrata: ta(
      ['Stipendio', 'Freelance', 'Regalo', 'Rimborso', 'Altro'],
      ['Salary',    'Freelance', 'Gift',   'Refund',   'Other'],
      ['Salario',   'Freelance', 'Regalo', 'Reembolso','Otro'],
    ),
    uscita: ta(
      ['Cibo', 'Spesa',   'Trasporti', 'Sociale', 'Residenza', 'Regalo', 'Comunicazioni', 'Svago', 'Bellezza', 'Medico', 'Hobby', 'Bollette', 'Finanziamento', 'Multe', 'Altro'],
      ['Food', 'Shopping', 'Transport', 'Social',  'Housing',   'Gift',   'Communications','Entertainment','Beauty','Medical','Hobby','Bills',   'Financing',      'Fines', 'Other'],
      ['Comida','Compras',  'Transporte','Social',  'Vivienda',  'Regalo', 'Comunicaciones','Ocio',         'Belleza','Médico','Hobby','Facturas','Financiamiento',  'Multas','Otro'],
    ),
  },

  // ── Pagina 404 ─────────────────────────────────────────
  notFound: {
    messaggio: t('Pagina non trovata.', 'Page not found.',  'Página no encontrada.'),
    tornaHome: t('Torna alla Home',     'Back to Home',     'Volver al inicio'),
  },

  // ── PIN Lock ────────────────────────────────────────────
  pin: {
    titolo:          t('Accesso protetto',              'Protected access',              'Acceso protegido'),
    inserisciPin:    t('Inserisci il PIN',               'Enter your PIN',                'Introduce el PIN'),
    creaPin:         t('Crea un PIN di 4 cifre',         'Create a 4-digit PIN',          'Crea un PIN de 4 dígitos'),
    confermaPin:     t('Conferma il PIN',                'Confirm your PIN',              'Confirma el PIN'),
    pinErrato:       t('PIN errato, riprova.',           'Wrong PIN, try again.',         'PIN incorrecto, inténtalo de nuevo.'),
    pinNonCoincide:  t('I PIN non coincidono, riprova.', 'PINs don\'t match, try again.', 'Los PIN no coinciden, inténtalo de nuevo.'),
    sblocca:         t('Sblocca',                        'Unlock',                        'Desbloquear'),
    conferma:        t('Conferma',                       'Confirm',                       'Confirmar'),
    benvenuto:       t('Bentornato',                      'Welcome back',                  'Bienvenido de nuevo'),
    benvenutoNome:   tf(
      (nome: string) => `Bentornato, ${nome}`,
      (nome: string) => `Welcome back, ${nome}`,
      (nome: string) => `Bienvenido, ${nome}`,
    ),
    primoAccesso:         t('Prima di iniziare, imposta il tuo PIN di sicurezza', 'Before you start, set your security PIN', 'Antes de empezar, configura tu PIN de seguridad'),
    biometriaAvvia:       t('🔐 Sblocca con biometria',                          '🔐 Unlock with biometrics',                  '🔐 Desbloquear con biometría'),
    biometriaFallita:     t('Biometria non riuscita, inserisci il PIN',           'Biometrics failed, enter your PIN',          'Biometría fallida, introduce el PIN'),
    abilitaBiometria:     t('Face ID / Impronta digitale',                        'Face ID / Fingerprint',                      'Face ID / Huella dactilar'),
    disabilitaBiometria:  t('Disabilita biometria',                               'Disable biometrics',                         'Desactivar biometría'),
    biometriaAttiva:      t('✓ Attiva',                                           '✓ Active',                                   '✓ Activa'),
    biometriaTitolo:      t('Sicurezza',                                          'Security',                                   'Seguridad'),
    biometriaFallitoReg:  t('Registrazione fallita. Riprova.',                    'Registration failed. Try again.',            'Registro fallido. Inténtalo de nuevo.'),
    usaPin:               t('Usa PIN',                                            'Use PIN',                                    'Usar PIN'),
    cambiaPinTitolo:      t('Cambia PIN',                                         'Change PIN',                                 'Cambiar PIN'),
    pinAttuale:           t('PIN attuale',                                        'Current PIN',                                'PIN actual'),
    nuovoPin:             t('Nuovo PIN',                                          'New PIN',                                    'Nuevo PIN'),
    confermaNuovoPin:     t('Conferma nuovo PIN',                                 'Confirm new PIN',                            'Confirmar nuevo PIN'),
    cambiaPinAzione:      t('Aggiorna PIN',                                       'Update PIN',                                 'Actualizar PIN'),
    cambioPinFormato:     t('Il PIN deve avere 4 cifre.',                         'PIN must be 4 digits.',                      'El PIN debe tener 4 dígitos.'),
    cambioPinSuccesso:    t('PIN aggiornato con successo.',                       'PIN updated successfully.',                  'PIN actualizado correctamente.'),
    impostaPinPrima:      t('Imposta un PIN dall\'app per abilitare le opzioni di sicurezza.', 'Set a PIN in the app to enable security options.', 'Configura un PIN en la app para habilitar opciones de seguridad.'),
    biometriaNonDisp:     t('Biometria non disponibile su questo dispositivo.',    'Biometrics not available on this device.',   'Biometría no disponible en este dispositivo.'),
  },

  // ── Home ───────────────────────────────────────────────
  home: {
    altMascotte:  t('Astronauta mascotte di Andromeda',                   'Astronaut mascot of Andromeda',             'Astronauta mascota de Andromeda'),
    titolo:       t('Andromeda',                                            'Andromeda',                                 'Andromeda'),
    sottotitolo:  t('Tieni sotto controllo entrate, uscite e risparmi', 'Keep track of income, expenses and savings', 'Controla tus ingresos, gastos y ahorros'),
    vaiDashboard: t('Vai alla Dashboard',                               'Go to Dashboard',                        'Ir al Panel'),
  },

  // ── Gestione Categorie ─────────────────────────────────
  gestioneCategorie: {
    titolo:           t('Gestione Categorie',         'Manage Categories',           'Gestión de Categorías'),
    categorieEntrata: t('Categorie Entrata',          'Income Categories',           'Categorías de Ingreso'),
    categorieUscita:  t('Categorie Uscita',           'Expense Categories',          'Categorías de Gasto'),
    predefinite:      t('Predefinite',                'Default',                     'Predeterminadas'),
    personalizzate:   t('Personalizzate',             'Custom',                      'Personalizadas'),
    nessuna:          t('Nessuna categoria custom.',  'No custom categories.',       'Sin categorías personalizadas.'),
    confermaElimina: tf(
      (nome: string) => `Eliminare la categoria "${nome}"?`,
      (nome: string) => `Delete category "${nome}"?`,
      (nome: string) => `¿Eliminar la categoría "${nome}"?`,
    ),
    tornaIndietro:    t('← Dashboard',                '← Dashboard',                '← Panel'),
    nuovaCategoria:   t('Nuova Categoria',             'New Category',                'Nueva Categoría'),
    placeholderNome:  t('Nome categoria',              'Category name',               'Nombre categoría'),
    aggiungi:         t('Aggiungi',                    'Add',                         'Añadir'),
    scegliIcona:      t('Scegli icona',                'Choose icon',                 'Elegir icono'),
    rinomina:         t('Rinomina',                    'Rename',                      'Renombrar'),
    salva:            t('Salva',                       'Save',                        'Guardar'),
    annulla:          t('Annulla',                     'Cancel',                      'Cancelar'),
  },

  // ── Movimenti ──────────────────────────────────────────
  movimenti: {
    titolo:           t('Movimenti',                    'Transactions',                'Movimientos'),
    cercaPlaceholder: t('Cerca...',                     'Search...',                   'Buscar...'),
    filtroTutti:      t('Tutti',                        'All',                         'Todos'),
    filtroEntrate:    t('Entrate',                      'Income',                      'Ingresos'),
    filtroUscite:     t('Uscite',                       'Expenses',                    'Gastos'),
    filtroRicorrenti: t('Ricorrenti',                   'Recurring',                   'Recurrentes'),
    filtroPeriodo:    t('Periodo corrente',             'Current period',              'Período actual'),
    ordinaPer:        t('Ordina per',                   'Sort by',                     'Ordenar por'),
    ordinaInserimento: t('Inserimento (più recenti)',    'Insertion (newest)',          'Inserción (más recientes)'),
    ordinaInserimentoAntichi: t('Inserimento (più antichi)', 'Insertion (oldest)',       'Inserción (más antiguos)'),
    ordinaData:       t('Data (più recenti)',           'Date (newest)',               'Fecha (más recientes)'),
    ordinaDataAntichi: t('Data (più antichi)',          'Date (oldest)',               'Fecha (más antiguos)'),
    ordinaImporto:    t('Importo (crescente)',          'Amount (low to high)',        'Importe (ascendente)'),
    ordinaImportoDesc: t('Importo (decrescente)',       'Amount (high to low)',        'Importe (descendente)'),
    dalLabel:         t('Dal',                          'From',                        'Desde'),
    alLabel:          t('Al',                           'To',                          'Hasta'),
    nessuno:          t('Nessun movimento trovato.',    'No transactions found.',      'No se encontraron movimientos.'),
    eliminaLabel:     t('Elimina',                      'Delete',                      'Eliminar'),
    eliminaConferma: tf(
      (desc: string) => `Vuoi eliminare "${desc}"?`,
      (desc: string) => `Delete "${desc}"?`,
      (desc: string) => `¿Eliminar "${desc}"?`,
    ),
    eliminaRicorrenteScope: t('Eliminare solo questa o tutte le collegate?', 'Delete just this one or all linked?', '¿Eliminar solo esta o todas?'),
    eliminaTutte:    t('Tutte le collegate',           'All linked',                  'Todas'),
    eliminaSoloQuesta: t('Solo questa',                'Just this one',               'Solo esta'),
    dettaglioScontrino: t('Dettaglio',                 'Details',                     'Detalle'),
  },

  // ── Dettaglio Scontrino ──────────────────────────────
  receiptDetail: {
    titolo:         t('Dettaglio scontrino',             'Receipt details',             'Detalle del ticket'),
    colonnaArticolo: t('Articolo',                       'Item',                        'Artículo'),
    colonnaPrezzo:  t('Prezzo',                          'Price',                       'Precio'),
    totale:         t('Totale transazione',              'Transaction total',           'Total de la transacción'),
    nessunDettaglio: t('Nessun articolo salvato per questo scontrino.', 'No items saved for this receipt.', 'No hay artículos guardados para este ticket.'),
    chiudi:         t('Chiudi',                          'Close',                       'Cerrar'),
  },

  // ── Catalogo Prodotti ────────────────────────────────
  prodotti: {
    titolo:          t('Prodotti',                        'Products',                    'Productos'),
    tabMovimenti:    t('Movimenti',                       'Transactions',                'Movimientos'),
    tabProdotti:     t('Prodotti',                        'Products',                    'Productos'),
    tabProdottiHint: t('Articoli importati dagli scontrini', 'Items imported from receipts', 'Artículos importados desde tickets'),
    cerca:           t('Cerca prodotto…',                 'Search product…',             'Buscar producto…'),
    nessunProdotto:  t('Nessun prodotto ancora.\nI prodotti vengono aggiunti automaticamente quando importi uno scontrino.', 'No products yet.\nProducts are added automatically when you import a receipt.', 'Ningún producto aún.\nLos productos se añaden automáticamente al importar un ticket.'),
    ultimoPrezzo:    t('Ultimo prezzo',                   'Latest price',                'Último precio'),
    prezzoNoto:      t('Prezzo noto',                     'Known price',                 'Precio conocido'),
    prezzoNotoLabel: tf(
      (p: string) => `Noto: ${p}`,
      (p: string) => `Known: ${p}`,
      (p: string) => `Conocido: ${p}`,
    ),
    elimina:         t('Elimina',                         'Delete',                      'Eliminar'),
    eliminaConferma: tf(
      (n: string) => `Eliminare "${n}" dal catalogo?`,
      (n: string) => `Delete "${n}" from catalog?`,
      (n: string) => `¿Eliminar "${n}" del catálogo?`,
    ),
    storia:          t('Storico prezzi',                  'Price history',               'Historial de precios'),
    visto:           t('Visto',                           'Last seen',                   'Visto'),
    occorrenze:      tf(
      (n: number) => `${n} vol${n === 1 ? 'ta' : 'te'}`,
      (n: number) => `${n} time${n === 1 ? '' : 's'}`,
      (n: number) => `${n} vez${n === 1 ? '' : 'es'}`,
    ),
    modifica:        t('Modifica nome',                   'Edit name',                   'Editar nombre'),
    salva:           t('Salva',                           'Save',                        'Guardar'),
    annulla:         t('Annulla',                         'Cancel',                      'Cancelar'),
    variantiOcr:     t('Varianti OCR',                    'OCR aliases',                 'Variantes OCR'),
    rimuoviAliasAria: tf(
      (alias: string) => `Rimuovi alias ${alias}`,
      (alias: string) => `Remove alias ${alias}`,
      (alias: string) => `Eliminar alias ${alias}`,
    ),
    prezzoVariato: tf(
      (old: string, nuovo: string) => `Prezzo cambiato: ${old} → ${nuovo}`,
      (old: string, nuovo: string) => `Price changed: ${old} → ${nuovo}`,
      (old: string, nuovo: string) => `Precio cambiado: ${old} → ${nuovo}`,
    ),
    ordinaPer:         t('Ordina per',                      'Sort by',                     'Ordenar por'),
    ordinaInserimento: t('Inserimento (più recenti)',       'Insertion (newest)',          'Inserción (más recientes)'),
    ordinaNomeAsc:     t('Nome (A-Z)',                      'Name (A-Z)',                  'Nombre (A-Z)'),
    ordinaNomeDesc:    t('Nome (Z-A)',                      'Name (Z-A)',                  'Nombre (Z-A)'),
    ordinaPrezzoAsc:   t('Prezzo (crescente)',              'Price (low to high)',         'Precio (ascendente)'),
    ordinaPrezzoDesc:  t('Prezzo (decrescente)',            'Price (high to low)',         'Precio (descendente)'),
  },

  // ── Missioni ───────────────────────────────────────────
  missioni: {
    titolo:           t('Missioni',                         'Missions',                    'Misiones'),
    nessunObiettivo:  t('Nessun obiettivo ancora.',         'No goals yet.',               'Ningún objetivo aún.'),
    aggiungi:         t('Nuovo obiettivo',                  'New goal',                    'Nuevo objetivo'),
    modifica:         t('Modifica',                         'Edit',                        'Editar'),
    elimina:          t('Elimina',                          'Delete',                      'Eliminar'),
    eliminaConferma:  tf(
      (n: string) => `Eliminare l'obiettivo "${n}"?`,
      (n: string) => `Delete goal "${n}"?`,
      (n: string) => `¿Eliminar el objetivo "${n}"?`,
    ),
    salva:            t('Salva',                            'Save',                        'Guardar'),
    annulla:          t('Annulla',                          'Cancel',                      'Cancelar'),
    nome:             t('Nome obiettivo',                   'Goal name',                   'Nombre del objetivo'),
    emoji:            t('Emoji',                            'Emoji',                       'Emoji'),
    modalita:         t('Modalità',                         'Mode',                        'Modo'),
    modMensile:       t('Risparmio mensile fisso',          'Fixed monthly saving',        'Ahorro mensual fijo'),
    modData:          t('Raggiungi entro una data',         'Reach by a date',             'Alcanzar antes de una fecha'),
    hintMensile:      t('Metti da parte una cifra fissa ogni mese, senza una scadenza precisa.', 'Set aside a fixed amount each month, without a specific deadline.', 'Reserva una cantidad fija cada mes, sin una fecha límite concreta.'),
    hintData:         t('Vuoi comprare qualcosa entro una data? Inserisci quanto ti serve e ti dico quanto risparmiare al mese.', 'Want to buy something by a date? Enter the total and I\'ll tell you how much to save per month.', '¿Quieres comprar algo antes de una fecha? Ingresa el total y te diré cuánto ahorrar al mes.'),
    importoMensile:   t('Importo al mese (€)',              'Monthly amount (€)',          'Importe mensual (€)'),
    importoTotale:    t('Importo totale (€)',               'Total amount (€)',            'Importe total (€)'),
    dataObiet:        t('Data obiettivo',                   'Target date',                 'Fecha objetivo'),
    giaRisparmiato:   t('Già risparmiato (€)',              'Already saved (€)',           'Ya ahorrado (€)'),
    aggiungiRisparmio: t('+ Aggiungi risparmio',            '+ Add savings',               '+ Añadir ahorro'),
    aggiornaSaved:    t('Importo da aggiungere (€)',        'Amount to add (€)',           'Importe a añadir (€)'),
    progressoLabel:   tf(
      (a: string, t: string) => `${a} di ${t}`,
      (a: string, t: string) => `${a} of ${t}`,
      (a: string, t: string) => `${a} de ${t}`,
    ),
    mensileCalc:      tf(
      (a: string) => `${a}/mese`,
      (a: string) => `${a}/mo`,
      (a: string) => `${a}/mes`,
    ),
    mesiMancanti:     tf(
      (n: number) => `${n} mes${n === 1 ? 'e' : 'i'} al traguardo`,
      (n: number) => `${n} month${n === 1 ? '' : 's'} to go`,
      (n: number) => `${n} mes${n === 1 ? '' : 'es'} restante${n === 1 ? '' : 's'}`,
    ),
    completato:       t('🎉 Obiettivo raggiunto!',          '🎉 Goal reached!',            '🎉 ¡Objetivo alcanzado!'),
    scaduto:          t('⚠️ Data superata',                 '⚠️ Date passed',              '⚠️ Fecha superada'),
    entro:            tf(
      (d: string) => `Entro il ${d}`,
      (d: string) => `By ${d}`,
      (d: string) => `Antes del ${d}`,
    ),
    suggerimento:     t('Gli obiettivi di risparmio ti aiutano a pianificare le spese future.', 'Savings goals help you plan future expenses.', 'Los objetivos de ahorro te ayudan a planificar gastos futuros.'),
    opzionale:          t('(opzionale)', '(optional)', '(opcional)'),
    mesiPlurali:        tf(
      (n: number) => n === 1 ? 'mese' : 'mesi',
      (n: number) => n === 1 ? 'month' : 'months',
      (n: number) => n === 1 ? 'mes' : 'meses',
    ),
    pezziNomi: {
      engine:  t('motore',     'engine',  'motor'),
      body:    t('corpo',      'body',    'cuerpo'),
      wings:   t('ali',        'wings',   'alas'),
      nose:    t('punta',      'nose',    'punta'),
      cockpit: t('finestrino', 'cockpit', 'cabina'),
    },
    navicellaPrima:     t('🔧 Aggiungi transazioni per iniziare a costruire la tua navicella', '🔧 Add transactions to start building your spacecraft', '🔧 Añade transacciones para empezar a construir tu nave'),
    prossimo15:         t('🔧 Prossimo: corpo navicella al 15%', '🔧 Next: spacecraft body at 15%', '🔧 Siguiente: cuerpo de nave al 15%'),
    prossimo35:         t('Prossimo: ali al 35%', 'Next: wings at 35%', 'Siguiente: alas al 35%'),
    prossimo55:         t('Prossimo: punta al 55%', 'Next: nose at 55%', 'Siguiente: punta al 55%'),
    prossimo75:         t('Prossimo: finestrino al 75%', 'Next: cockpit at 75%', 'Siguiente: cabina al 75%'),
    prossimo100:        t('🚀 Al 100% potrai lanciare la navicella!', '🚀 At 100% you can launch the spacecraft!', '🚀 ¡Al 100% podrás lanzar la nave!'),
    inViaggio:          t('IN VIAGGIO NELLO SPAZIO', 'TRAVELING THROUGH SPACE', 'VIAJANDO POR EL ESPACIO'),
    missioneCompletata: tf(
      (a: string) => `🚀 Missione completata — ${a}`,
      (a: string) => `🚀 Mission complete — ${a}`,
      (a: string) => `🚀 Misión completada — ${a}`,
    ),
    navicellaPronta:    t('🎉 Navicella pronta al lancio!', '🎉 Spacecraft ready for launch!', '🎉 ¡Nave lista para el lanzamiento!'),
    lanciaBtn:          t('🚀 LANCIA', '🚀 LAUNCH', '🚀 LANZAR'),
    lancioTra:          t('Lancio tra', 'Launch in', 'Lanzamiento en'),
    nuovoPezzo:         t('★ Nuovo pezzo sbloccato!', '★ New piece unlocked!', '★ ¡Nueva pieza desbloqueada!'),
    modificaColoreBtn:  t('✎ Modifica colore', '✎ Edit color', '✎ Editar color'),
    scegliColore:       tf(
      (nome: string, femPl: boolean) => `Scegli il colore ${femPl ? 'delle' : 'del'} ${nome}:`,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (nome: string, _femPl: boolean) => `Choose the color for the ${nome}:`,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (nome: string, _femPl: boolean) => `Elige el color del ${nome}:`,
    ),
    applicaColore:      t('✓ Applica colore', '✓ Apply color', '✓ Aplicar color'),
  },

  // ── Settings ───────────────────────────────────────────
  settings: {
    impostazioni:      t('Configurazioni',               'Settings',                    'Configuración'),
    aspetto:           t('Aspetto',                      'Appearance',                  'Apariencia'),
    tema:              t('Tema',                         'Theme',                       'Tema'),
    darkMode:          t('Nebula',                       'Nebula',                      'Nebulosa'),
    lightMode:         t('Orbiter',                      'Orbiter',                     'Orbiter'),
    lingua:            t('Lingua',                       'Language',                    'Idioma'),
    notifiche:         t('Notifiche',                    'Notifications',               'Notificaciones'),
    promemoria:        t('Promemoria giornaliero',       'Daily reminder',              'Recordatorio diario'),
    orarioPromemoria:  t('A che ora?',                   'At what time?',               '¿A qué hora?'),
    gestioneCategorie: t('Gestione Categorie',           'Manage Categories',           'Gestión de Categorías'),
    permessoNegato:    t('Permesso notifiche negato',    'Notification permission denied','Permiso de notificaciones denegado'),
    testNotifica:      t('🔔 Invia notifica di test',      '🔔 Send test notification',     '🔔 Enviar notificación de prueba'),
    esportaDati:       t('📤 Esporta dati',                '📤 Export data',                 '📤 Exportar datos'),
    importaDati:       t('📥 Importa dati',                '📥 Import data',                 '📥 Importar datos'),
    importaConferma:   t('Vuoi unire i dati importati con quelli presenti?', 'Merge imported data with existing data?', '¿Quieres fusionar los datos importados con los existentes?'),
    importaOk:         t('✅ Importazione completata (merge)', '✅ Import complete (merge)',    '✅ Importación completada (fusión)'),
    importaErrore:     t('❌ File non valido',             '❌ Invalid file',                '❌ Archivo no válido'),
    passwordErrata:    t('❌ Password errata',             '❌ Wrong password',              '❌ Contraseña incorrecta'),
    passwordEsporta:   t('Scegli una password per cifrare il backup:', 'Choose a password to encrypt the backup:', 'Elige una contraseña para cifrar el backup:'),
    passwordImporta:   t('Inserisci la password del backup:', 'Enter the backup password:', 'Ingresa la contraseña del backup:'),
    qrTransfer:        t('Trasferimento QR (PC → telefono)', 'QR transfer (PC → phone)',     'Transferencia QR (PC → móvil)'),
    qrGenera:          t('📲 Genera QR trasferimento',      '📲 Generate transfer QR',         '📲 Generar QR de transferencia'),
    qrScansiona:       t('Scansiona tutti i QR in ordine dal telefono.', 'Scan all QR codes in order from your phone.', 'Escanea todos los QR en orden desde tu móvil.'),
    qrPrecedente:      t('Precedente',                     'Previous',                       'Anterior'),
    qrSuccessivo:      t('Successivo',                     'Next',                           'Siguiente'),
    qrChiudi:          t('Chiudi',                         'Close',                          'Cerrar'),
    qrCaricamento:     t('Caricamento QR...',              'Loading QR...',                  'Cargando QR...'),
    qrBlocco:          tf(
      (corrente: number, totale: number) => `QR ${corrente}/${totale}`,
      (corrente: number, totale: number) => `QR ${corrente}/${totale}`,
      (corrente: number, totale: number) => `QR ${corrente}/${totale}`,
    ),
    qrImportPrompt:    t('QR completo! Inserisci la password di trasferimento:', 'QR complete! Enter transfer password:', '¡QR completo! Ingresa la contraseña de transferencia:'),
    codiceTransfer:    t('Trasferimento con codice',      'Code transfer',                 'Transferencia por codigo'),
    codiceGenera:      t('📋 Genera codice trasferimento', '📋 Generate transfer code',     '📋 Generar codigo de transferencia'),
    codiceRicevi:      t('📥 Ricevi codice',               '📥 Receive code',                '📥 Recibir codigo'),
    codiceApplica:     t('Applica codice',                'Apply code',                    'Aplicar codigo'),
    codicePlaceholder: t('Incolla qui il codice ricevuto dal PC', 'Paste here the code received from PC', 'Pega aqui el codigo recibido del PC'),
    codiceCopia:       t('Copia codice',                  'Copy code',                     'Copiar codigo'),
    codiceCopiato:     t('✅ Codice copiato',             '✅ Code copied',                 '✅ Codigo copiado'),
    codicePrompt:      t('Inserisci la password del codice:', 'Enter code password:',      'Ingresa la contraseña del codigo:'),
    spazioLocaleTitolo: t('Spazio locale',                 'Local storage',                 'Espacio local'),
    sicurezza:          t('Sicurezza',                    'Security',                      'Seguridad'),
    pianetiVoce:        t('Archivio Pianeti',             'Planet Archive',                'Archivo de Planetas'),
    pianetiSoloSbloccati: t('Mostra solo sbloccati nel mese', 'Show only unlocked this month', 'Mostrar solo desbloqueados del mes'),
    pianetiUsaMock:       t('Usa dati demo locali',          'Use local demo data',            'Usar datos demo locales'),
    pianetiMockNota:      t('Modalità demo: sblocchi simulati per test rapido UI.', 'Demo mode: simulated unlocks for quick UI testing.', 'Modo demo: desbloqueos simulados para prueba rápida de UI.'),
    pianetiStatoSbloccato: t('Sbloccato',                    'Unlocked',                       'Desbloqueado'),
    pianetiStatoBloccato:  t('Bloccato',                     'Locked',                         'Bloqueado'),
    pianetiNessuno:        t('Nessun pianeta sbloccato in questo periodo.', 'No planets unlocked in this period.', 'No hay planetas desbloqueados en este período.'),
    pianetiSbloccatiCount: tf(
      (n: number, total: number) => `Sbloccati ${n}/${total}`,
      (n: number, total: number) => `Unlocked ${n}/${total}`,
      (n: number, total: number) => `Desbloqueados ${n}/${total}`,
    ),
    pianetiRaritaCommon:    t('Comune',    'Common',    'Común'),
    pianetiRaritaUncommon:  t('Non comune', 'Uncommon', 'Poco común'),
    pianetiRaritaRare:      t('Raro',       'Rare',     'Raro'),
    pianetiRaritaEpic:      t('Epico',      'Epic',     'Épico'),
    pianetiRaritaLegendary: t('Leggendario','Legendary','Legendario'),
    pianetiRaritaMythic:    t('Mitico',    'Mythic',    'Mítico'),
    pianetiScoperto:    t('Scoperto', 'Discovered', 'Descubierto'),
    pianetiBloccato:    t('?', '?', '?'),
    esportaVoce:        t('Esporta / Importa',            'Export / Import',               'Exportar / Importar'),
    backupVoce:         t('Backup Automatico',            'Auto Backup',                   'Copia automática'),
    spazioLocaleDettaglio: tf(
      (used: string, max: string, pct: number) => `Usato ${used} su circa ${max} (${pct}%)`,
      (used: string, max: string, pct: number) => `Using ${used} out of about ${max} (${pct}%)`,
      (used: string, max: string, pct: number) => `Usado ${used} de aproximadamente ${max} (${pct}%)`,
    ),
    spazioLocaleWarning: t('⚠️ Spazio locale quasi pieno: valuta backup/esportazione e pulizia dati vecchi.', '⚠️ Local storage is getting full: consider backup/export and cleaning old data.', '⚠️ El espacio local se está llenando: considera backup/exportación y limpieza de datos antiguos.'),
    spazioLocaleNota:   t('Stima basata su limite tipico IndexedDB (~50 MB per dominio).', 'Estimate based on typical IndexedDB limit (~50 MB per origin).', 'Estimación basada en el límite típico de IndexedDB (~50 MB por dominio).'),
    versione:           t('Versione', 'Version', 'Versión'),
    svuotaDati:         t('🗑️ Svuota tutti i dati', '🗑️ Clear all data', '🗑️ Borrar todos los datos'),
    svuotaConferma:     t('Verranno eliminati definitivamente:\n• Tutte le transazioni\n• Tutte le missioni\n• Tutti i prodotti\n• Categorie personalizzate\n\nImpostazioni, tema, lingua e PIN verranno mantenuti.', 'Will be permanently deleted:\n• All transactions\n• All missions\n• All products\n• Custom categories\n\nSettings, theme, language and PIN will be kept.', 'Se eliminarán permanentemente:\n• Todas las transacciones\n• Todas las misiones\n• Todos los productos\n• Categorías personalizadas\n\nLas configuraciones, tema, idioma y PIN se mantendrán.'),
    svuotaFatto:        t('✅ Dati cancellati', '✅ Data cleared', '✅ Datos eliminados'),
  },

  // ── Notifiche ──────────────────────────────────────────
  notifiche: {
    messaggioPromemoria: t(
      'Heila astronauta! 🚀 Hai inserito le tue spese di oggi?',
      'Hey astronaut! 🚀 Have you logged today\'s expenses?',
      '¡Oye astronauta! 🚀 ¿Has registrado tus gastos de hoy?',
    ),
  },

  // ── PWA Install ────────────────────────────────────────
  pwa: {
    installTitle:   t('Installa Andromeda',                                'Install Andromeda',                         'Instalar Andromeda'),
    installMessage: t('Aggiungi alla schermata home per accesso rapido', 'Add to home screen for quick access',    'Añade a la pantalla de inicio para acceso rápido'),
    installButton:  t('Installa',                                       'Install',                                'Instalar'),
    chiudi:         t('Non ora',                                        'Not now',                                'Ahora no'),
    iosMessage:     t('Per installare: tocca ⬆️ poi "Aggiungi alla schermata Home"',
                      'To install: tap ⬆️ then "Add to Home Screen"',
                      'Para instalar: toca ⬆️ y luego "Añadir a pantalla de inicio"'),
  },

  // ── OCR Scontrino ──────────────────────────────────────
  ocr: {
    titolo:            t('📷 Scansiona Scontrino',                  '📷 Scan Receipt',                         '📷 Escanear Ticket'),
    aggiungi:          t('Aggiungi foto',                            'Add photo',                               'Añadir foto'),
    scatta:            t('Scatta foto',                              'Take photo',                              'Tomar foto'),
    analizza:          t('🔍 Analizza scontrino',                    '🔍 Analyse receipt',                      '🔍 Analizar ticket'),
    elaborazione:      t('Analisi in corso…',                        'Analysing…',                              'Analizando…'),
    fotoLabel:         tf(
      (c: number, t: number) => `Foto ${c} di ${t}`,
      (c: number, t: number) => `Photo ${c} of ${t}`,
      (c: number, t: number) => `Foto ${c} de ${t}`,
    ),
    nessuneFoto:       t('Aggiungi almeno una foto dello scontrino.', 'Add at least one receipt photo.',        'Añade al menos una foto del ticket.'),
    totaleRilevato:    t('Totale rilevato',                          'Detected total',                          'Total detectado'),
    totaleCalcolato:   t('Totale calcolato',                         'Calculated total',                        'Total calculado'),
    nessunTotale:      t('Totale non rilevato',                        'Total not detected',                      'Total no detectado'),
    sommaValida:       t('✅ Somma verificata',                       '✅ Sum verified',                          '✅ Suma verificada'),
    sommaNonValida:    t('⚠️ Somma non corrispondente',              '⚠️ Sum mismatch',                          '⚠️ Suma no coincide'),
    nessunArticolo:    t('Nessun articolo rilevato. Riprova con una foto più nitida.', 'No items detected. Try a clearer photo.', 'No se detectaron artículos. Intenta con una foto más nítida.'),
    categoriaLabel:    t('Categoria spesa',                          'Expense category',                        'Categoría de gasto'),
    creaArticoli:      tf(
      (n: number) => `Crea ${n} transazion${n === 1 ? 'e' : 'i'}`,
      (n: number) => `Create ${n} transaction${n === 1 ? '' : 's'}`,
      (n: number) => `Crear ${n} transacción${n === 1 ? '' : 'es'}`,
    ),
    creaTotale:        t('Importa come spesa unica',                 'Import as single expense',                'Importar como gasto único'),
    errore:            t('Errore durante l\'analisi. Riprova.',      'Analysis failed. Try again.',             'Error en el análisis. Inténtalo de nuevo.'),
    rimuoviFoto:       t('Rimuovi',                                   'Remove',                                  'Quitar'),
    colonnaArticolo:   t('Articolo',                                  'Item',                                    'Artículo'),
    colonnaPrezzo:     t('Prezzo',                                    'Price',                                   'Precio'),
    nuovaFoto:         t('+ Altra foto',                              '+ Add more',                              '+ Otra foto'),
    tornaIndietro:     t('← Riprova',                                 '← Retry',                                 '← Reintentar'),
    apriScanner:       t('📷 Scontrino',                              '📷 Receipt',                               '📷 Ticket'),
    guidaAllineamento: t('Allinea lo scontrino tra le linee',         'Align the receipt between the lines',      'Alinea el ticket entre las líneas'),
    chiudiCamera:      t('Annulla',                                   'Cancel',                                   'Cancelar'),
    aggiungiManuale:   t('+ Aggiungi riga',                           '+ Add row',                                '+ Añadir fila'),
    approvatoScontrino: t('✅ Scontrino approvato!',                   '✅ Receipt approved!',                      '✅ ¡Ticket aprobado!'),
    parzialeMentre:    t('Articoli rilevati finora:',                 'Items detected so far:',                   'Artículos detectados hasta ahora:'),
    prezziDaVerificare: tf(
      (n: number) => `⚠️ ${n} prezzo${n === 1 ? '' : 'i'} da verificare`,
      (n: number) => `⚠️ ${n} price${n === 1 ? '' : 's'} to review`,
      (n: number) => `⚠️ ${n} precio${n === 1 ? '' : 's'} por revisar`,
    ),
    prezzoIncerto:     t('Prezzo incerto — verifica e correggi se necessario', 'Uncertain price — check and correct if needed', 'Precio incierto — verifica y corrige si es necesario'),
    prezzoTotaleArticolo: t('Lordo',                              'Gross',                                   'Bruto'),
    scontoArticolo:       t('Sconto',                             'Discount',                                'Descuento'),
    prezzoScontatoArticolo: t('Netto',                            'Net',                                     'Neto'),
  },

  // ── Backup Automatico ─────────────────────────────────
  autoBackup: {
    titolo:          t('Backup automatico',                  'Auto backup',                   'Copia de seguridad automática'),
    attiva:          t('Attiva alla chiusura',               'Enable on close',               'Activar al cerrar'),
    destinazione:    t('Dove salvare',                       'Save to',                       'Guardar en'),
    download:        t('Download (file JSON)',               'Download (JSON file)',           'Descarga (archivo JSON)'),
    cartella:        t('Cartella locale',                    'Local folder',                  'Carpeta local'),
    sceglicartella:  t('Scegli cartella...',                 'Choose folder...',              'Elegir carpeta...'),
    cartellaScelta:  tf(
      (name: string) => `📁 ${name}`,
      (name: string) => `📁 ${name}`,
      (name: string) => `📁 ${name}`,
    ),
    cambiaCar:       t('Cambia cartella',                    'Change folder',                 'Cambiar carpeta'),
    ultimoBackup:    t('Ultimo backup:',                     'Last backup:',                  'Última copia:'),
    mai:             t('Mai',                                'Never',                         'Nunca'),
    backupOra:       t('💾 Backup ora',                      '💾 Backup now',                  '💾 Copia ahora'),
    nonSupportato:   t('Non supportato da questo browser.',  'Not supported by this browser.','No compatible con este navegador.'),
    soloCartella:    t('L\'auto backup richiede la cartella locale.',  'Auto backup requires a local folder.',  'La copia automática requiere una carpeta local.'),
    passwordLabel:   t('Password cifratura',                 'Encryption password',            'Contraseña de cifrado'),
    passwordPlaceholder: t('Lascia vuoto = nessuna cifratura', 'Leave empty = no encryption',  'Dejar vacío = sin cifrar'),
    nota:            t('Con password: file cifrato AES-256. Senza: JSON non cifrato.', 'With password: AES-256 encrypted file. Without: plain JSON.', 'Con contraseña: cifrado AES-256. Sin ella: JSON sin cifrar.'),
  },
}

export type PlanetRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type PlanetMedium = 'videogame' | 'book' | 'film' | 'series' | 'tabletop' | 'realworld'

interface PlanetEntry {
  alias: string
  source: string
  medium: PlanetMedium
  lore: I18n<string>
  rarity: PlanetRarity
}

// ─── Global planet pool (independent from categories) ────
const PLANET_CATALOG: PlanetEntry[] = [
  // ── Common ──
  { alias: 'Timber Hearth', source: 'Outer Wilds',            medium: 'videogame', rarity: 'legendary',    lore: t("Foreste di pini e geyser dall'orbita. Sembra un posto accogliente. E dalla luna vicina... arriva un fischio? Sì, un fischio. Come se qualcuno stesse aspettando.", 'Pine forests and geysers from orbit. Looks warm and welcoming. And from the nearby moon... is that whistling? Yes, whistling. As if someone is waiting.', 'Bosques de pinos y géiseres desde la órbita. Parece acogedor. Y desde la luna cercana... ¿un silbido? Sí, un silbido. Como si alguien estuviera esperando.') },
  { alias: 'Ember Twin',    source: 'Outer Wilds',            medium: 'videogame', rarity: 'legendary',    lore: t("Una luna desertica di sabbia rossa che scambia materia con il suo gemello. La vedo svuotarsi lentamente. E in mezzo a tutto questo caos... delle percussioni? Qualcuno sta suonando là sotto.", "A desert moon of red sand slowly trading matter with its twin. I watch it hollow out. And in the middle of all this chaos... percussion? Someone is actually playing down there.", 'Una luna desértica de arena roja intercambiando materia con su gemela. La veo vaciarse. ¿Y en medio de todo este caos... percusión? Alguien está tocando ahí abajo.') },
  { alias: 'Ash Twin',      source: 'Outer Wilds',            medium: 'videogame', rarity: 'uncommon',    lore: t("Coperto di sabbia che scorre come una clessidra cosmica. Sotto ci dev'essere qualcosa di sepolto. Non riesco a smettere di guardarlo ruotare — ha qualcosa di ipnotico.", "Covered in sand flowing like a cosmic hourglass. Something must be buried beneath. I can't stop watching it turn — there's something hypnotic about it.", 'Cubierto de arena que fluye como un reloj de arena cósmico. Algo debe estar enterrado debajo. No puedo dejar de verlo girar: hay algo hipnótico en ello.') },
  { alias: 'Arrakis',       source: 'Dune',                   medium: 'book',      rarity: 'common',    lore: t("Sabbia ovunque, nessuna traccia d'acqua dall'alto. Come sopravvivono lì sotto?", 'Sand everywhere, no water from above. How do they survive down there?', '¿Arena por todas partes, sin rastro de agua. ¿Cómo sobreviven ahí abajo?') },
  { alias: 'Coruscant',     source: 'Star Wars',              medium: 'film',      rarity: 'common',    lore: t("Nessuna superficie naturale: solo luci artificiali fino all'orizzonte. Una città-mondo.", 'No natural surface: just artificial lights to the horizon. A city-world.', 'Sin superficie natural: solo luces artificiales hasta el horizonte. Un mundo-ciudad.') },
  { alias: 'Naboo',         source: 'Star Wars',              medium: 'film',      rarity: 'common',    lore: t('Valli verdi e laghi specchianti. Troppo bello per essere reale, ma è lì.', 'Green valleys and mirror lakes. Too beautiful to be real, yet there it is.', 'Valles verdes y lagos espejados. Demasiado hermoso para ser real, pero ahí está.') },
  { alias: 'Hillys',        source: 'Beyond Good & Evil',     medium: 'videogame', rarity: 'common',    lore: t("Arcipelaghi e fari che brillano nel buio. C'è qualcosa di familiare lì sotto.", 'Archipelagos and lighthouses glowing in the dark. Something familiar below.', 'Archipiélagos y faros brillando en la oscuridad. Algo familiar ahí abajo.') },
  { alias: 'Bajor',         source: 'Star Trek DS9',          medium: 'series',    rarity: 'common',    lore: t('Continenti verdeggianti attraversati da catene montuose. Una civiltà antica mi aspetta.', 'Verdant continents crossed by mountain ranges. An ancient civilization awaits.', 'Continentes verdes atravesados por cadenas montañosas. Una civilización antigua me espera.') },
  { alias: 'Gallifrey',     source: 'Doctor Who',             medium: 'series',    rarity: 'common',    lore: t('Pianure arancioni sotto cieli dorati. Più bello di quanto le leggende lasciassero credere.', 'Orange plains under golden skies. More beautiful than the legends suggested.', 'Llanuras naranjas bajo cielos dorados. Más hermoso de lo que las leyendas insinuaban.') },
  { alias: 'Caladan',       source: 'Dune',                   medium: 'book',      rarity: 'common',    lore: t('Oceani infiniti e coste rocciose. Una calma potente si sente anche da quassù.', 'Endless oceans and rocky coasts. A powerful calm felt even from up here.', 'Océanos infinitos y costas rocosas. Una calma poderosa se siente desde aquí.') },
  { alias: 'Trantor',       source: 'Foundation',             medium: 'book',      rarity: 'common',    lore: t("Una cupola metallica copre l'intero pianeta. Non si vede un filo d'erba da qui.", 'A metal dome covers the entire planet. Not a blade of grass from here.', 'Una cúpula metálica cubre todo el planeta. Ni una brizna de hierba desde aquí.') },
  { alias: 'Harvest',       source: 'Halo',                   medium: 'videogame', rarity: 'common',    lore: t('Campi coltivati geometrici e città ordinate. Era un posto tranquillo, prima.', 'Geometric crop fields and orderly cities. It was a quiet place, before.', 'Campos de cultivo geométricos y ciudades ordenadas. Era un lugar tranquilo, antes.') },
  { alias: 'Caprica',       source: 'Battlestar Galactica',   medium: 'series',    rarity: 'common',    lore: t('Metropoli dense tra colline azzurre. Una gemma di civiltà sospesa nel vuoto.', 'Dense metropolises among azure hills. A gem of civilization in the void.', 'Metrópolis densas entre colinas azules. Una joya de civilización en el vacío.') },
  { alias: 'Magrathea',     source: "The Hitchhiker's Guide", medium: 'book',      rarity: 'common',    lore: t('Deserto grigio e silenzioso. Difficile credere che qui si costruissero pianeti su commissione.', 'Grey and silent desert. Hard to believe they built planets to order here.', 'Desierto gris y silencioso. Difícil creer que construían planetas por encargo aquí.') },
  { alias: 'Aiur',          source: 'StarCraft',              medium: 'videogame', rarity: 'common',    lore: t("Foreste ancestrali e templi colossali visibili anche dall'orbita. Un mondo che respira.", 'Ancient forests and colossal temples visible from orbit. A world that breathes.', 'Bosques ancestrales y templos colosales visibles desde la órbita. Un mundo que respira.') },
  { alias: 'Tallon IV',     source: 'Metroid Prime',          medium: 'videogame', rarity: 'common',    lore: t("Foreste dense e rovine antiche. Qualcosa di oscuro pulsa al centro del pianeta.", "Dense forests and ancient ruins. Something dark pulses at the planet's core.", 'Bosques densos y ruinas antiguas. Algo oscuro pulsa en el centro del planeta.') },
  { alias: 'Marte',         source: 'Sistema Solare',         medium: 'realworld', rarity: 'common',    lore: t('Deserto rosso sotto un cielo arancione. Le calotte polari scintillano. Olympus Mons è visibile da qui — il vulcano più alto del sistema solare.', 'Red desert under an orange sky. Polar caps glittering. Olympus Mons is visible from here — the tallest volcano in the solar system.', 'Desierto rojo bajo un cielo anaranjado. Las casquetes polares brillan. El Olympus Mons es visible desde aquí: el volcán más alto del sistema solar.') },
  { alias: 'Venere',        source: 'Sistema Solare',         medium: 'realworld', rarity: 'common',    lore: t('Una sfera bianca luminosa avvolta di nuvole dense. Dietro quella bellezza si nasconde un inferno a 450°C. Non atterra nessuno.', 'A luminous white sphere wrapped in dense clouds. Behind that beauty hides a 450°C hell. Nobody lands here.', 'Una esfera blanca luminosa envuelta en nubes densas. Detrás de esa belleza se esconde un infierno de 450°C. Nadie aterriza aquí.') },
  // ── Uncommon ──
  { alias: 'Ferrix',        source: 'Andor',                  medium: 'series',    rarity: 'uncommon',  lore: t('Una città industriale avvolta di fumo e acciaio. Il ritmo del lavoro si sente da quassù.', 'An industrial city wrapped in smoke and steel. The rhythm of work felt from here.', 'Una ciudad industrial envuelta en humo y acero. El ritmo del trabajo se siente desde aquí.') },
  { alias: 'Reach',         source: 'Halo',                   medium: 'videogame', rarity: 'uncommon',  lore: t('Catene montuose imponenti e basi militari sparse. Un bastione che sembrava invincibile.', 'Imposing mountain ranges and military bases. A bastion that seemed invincible.', 'Imponentes cadenas montañosas y bases militares. Un bastión que parecía invencible.') },
  { alias: 'Thessia',       source: 'Mass Effect',            medium: 'videogame', rarity: 'uncommon',  lore: t("Città d'argento immerse in un crepuscolo eterno. Un mondo di conoscenza e bellezza.", 'Silver cities bathed in eternal twilight. A world of ancient knowledge and beauty.', 'Ciudades de plata en un crepúsculo eterno. Un mundo de conocimiento y belleza antigua.') },
  { alias: 'Spira',         source: 'Final Fantasy X',        medium: 'videogame', rarity: 'uncommon',  lore: t("Isole tropicali e rovine sommerse visibili dall'alto. Una bellezza malinconica.", 'Tropical islands and submerged ruins visible from above. A melancholic beauty.', 'Islas tropicales y ruinas sumergidas visibles desde arriba. Una belleza melancólica.') },
  { alias: 'Risa',          source: 'Star Trek',              medium: 'series',    rarity: 'uncommon',  lore: t('Spiagge dorate e acque cristalline. Persino da quassù si sente la voglia di scendere.', 'Golden beaches and crystal waters. Even from up here you feel like going down.', 'Playas doradas y aguas cristalinas. Incluso desde aquí tienes ganas de bajar.') },
  { alias: 'Ferenginar',    source: 'Star Trek',              medium: 'series',    rarity: 'uncommon',  lore: t('Nuvole di pioggia permanenti coprono tutto. Ogni goccia, dicono, ha il suo prezzo.', 'Permanent rain clouds cover everything. Every drop, they say, has its price.', 'Nubes de lluvia permanentes lo cubren todo. Cada gota, dicen, tiene su precio.') },
  { alias: 'Cybertron',     source: 'Transformers',           medium: 'film',      rarity: 'uncommon',  lore: t('Metallo da polo a polo, nessuna natura. Una macchina grande come un mondo che si muove.', 'Metal from pole to pole, no nature. A machine as large as a world, moving.', 'Metal de polo a polo, sin naturaleza. Una máquina tan grande como un mundo en movimiento.') },
  { alias: 'Terminus',      source: 'Foundation',             medium: 'book',      rarity: 'uncommon',  lore: t("Un puntino isolato ai confini della galassia. Eppure da qui nasce qualcosa di enorme.", "A lonely dot at the galaxy's edge. Yet something enormous is born from here.", 'Un punto solitario en el borde de la galaxia. Y sin embargo, algo enorme nace desde aquí.') },
  { alias: 'Pern',          source: 'Dragonriders of Pern',   medium: 'book',      rarity: 'uncommon',  lore: t('Continenti verdi solcati da creature alate enormi. Vedo Thread cadere come pioggia argentata.', 'Green continents furrowed by huge winged creatures. Thread falls like silver rain.', 'Continentes verdes surcados por enormes criaturas aladas. Thread cae como lluvia plateada.') },
  { alias: 'Nirn',          source: 'The Elder Scrolls',      medium: 'videogame', rarity: 'uncommon',  lore: t('Continenti separati da mari tempestosi. Le torri delle capitali si vedono da quassù.', 'Continents separated by stormy seas. The towers of the capitals visible from here.', 'Continentes separados por mares tormentosos. Las torres de las capitales visibles desde aquí.') },
  { alias: "Qo'noS",        source: 'Star Trek',              medium: 'series',    rarity: 'uncommon',  lore: t('Un mondo scuro e tempestoso. Nuvole arancioni coprono i continenti come cicatrici antiche.', 'A dark and stormy world. Orange clouds cover the continents like ancient scars.', 'Un mundo oscuro y tormentoso. Nubes naranja cubren los continentes como cicatrices antiguas.') },
  { alias: 'Oerth',         source: 'Dungeons & Dragons',     medium: 'tabletop',  rarity: 'uncommon',  lore: t('Foreste magiche e montagne antiche. Qualcosa di potente si sente anche da quassù.', 'Magical forests and ancient mountains. Something powerful felt even from up here.', 'Bosques mágicos y montañas antiguas. Algo poderoso se siente incluso desde aquí.') },
  { alias: 'Mongo',         source: 'Flash Gordon',           medium: 'film',      rarity: 'uncommon',  lore: t('Deserti, giungle e tundra compressi in un unico mondo caotico. Nessuna regola visibile.', 'Deserts, jungles, and tundra in one chaotic world. No rules visible from orbit.', 'Desiertos, junglas y tundra en un mundo caótico. Ninguna regla visible desde la órbita.') },
  { alias: 'Giove',         source: 'Sistema Solare',         medium: 'realworld', rarity: 'uncommon',  lore: t("Enorme. Impossibilmente enorme. La Grande Macchia Rossa mi fissa come un occhio. Sono una mosca davanti a questo gigante.", "Enormous. Impossibly enormous. The Great Red Spot stares at me like an eye. I am a fly before this giant.", 'Enorme. Imposiblemente enorme. La Gran Mancha Roja me mira como un ojo. Soy una mosca ante este gigante.') },
  { alias: 'Saturno',       source: 'Sistema Solare',         medium: 'realworld', rarity: 'uncommon',  lore: t("Gli anelli si estendono oltre ogni aspettativa. Dalla mia orbita sembrano quasi irreali — troppo simmetrici per essere naturali.", "The rings stretch beyond all expectation. From my orbit they look almost unreal — too symmetrical to be natural.", 'Los anillos se extienden más allá de toda expectativa. Desde mi órbita parecen casi irreales: demasiado simétricos para ser naturales.') },
  // ── Rare ──
  { alias: "Giant's Deep",  source: 'Outer Wilds',            medium: 'videogame', rarity: 'legendary',      lore: t("Un oceano violento che avvolge tutto. I cicloni sollevano isole intere verso di me. E da qualche parte là sotto... un flauto? Come è possibile che qualcuno stia suonando il flauto in mezzo a quell'inferno?", "A violent ocean wrapping everything. Cyclones lift whole islands toward me. And somewhere down there... a flute? How is it possible that someone is playing a flute in the middle of that chaos?", 'Un océano violento que lo envuelve todo. Los ciclones levantan islas enteras hacia mí. ¿Y en algún lugar ahí abajo... una flauta? ¿Cómo es posible que alguien esté tocando una flauta en medio de ese infierno?') },
  { alias: 'Pandora',       source: 'Avatar',                 medium: 'film',      rarity: 'rare',      lore: t('Una giungla bioluminescente che brilla nel buio. Sento il battito della terra da quassù.', "A bioluminescent jungle glowing in the dark. I feel the earth's heartbeat from up here.", 'Una jungla bioluminiscente que brilla en la oscuridad. Siento el latido de la tierra desde aquí.') },
  { alias: 'Illium',        source: 'Mass Effect',            medium: 'videogame', rarity: 'rare',      lore: t('Porto cosmopolita di luci e vetro. Le navi commerciali sfrecciano come sciami di stelle.', 'Cosmopolitan port of lights and glass. Trade ships dart like swarms of tiny stars.', 'Puerto cosmopolita de luces y cristal. Las naves comerciales vuelan como enjambres de estrellas.') },
  { alias: 'Elysium',       source: 'Mass Effect',            medium: 'videogame', rarity: 'rare',      lore: t('Grattacieli e resort tra colline dorate. Un paradiso che brilla troppo per essere onesto.', 'Skyscrapers and resorts among golden hills. A paradise that shines too bright to be honest.', 'Rascacielos y complejos turísticos entre colinas doradas. Un paraíso que brilla demasiado.') },
  { alias: 'Mustafar',      source: 'Star Wars',              medium: 'film',      rarity: 'rare',      lore: t("Fuoco e lava ovunque. Un pianeta che brucia se stesso dall'interno. Impossibile non guardarlo.", 'Fire and lava everywhere. A planet burning from within. Impossible not to stare.', 'Fuego y lava por todas partes. Un planeta que se quema desde dentro. Imposible no mirarlo.') },
  { alias: 'Zenn-La',       source: 'Marvel',                 medium: 'book',      rarity: 'rare',      lore: t('Un mondo di pace assoluta e civiltà millenaria. Quasi troppo perfetto per essere reale.', 'A world of absolute peace and ancient civilization. Almost too perfect to be real.', 'Un mundo de paz absoluta y civilización milenaria. Casi demasiado perfecto para ser real.') },
  { alias: 'Xandar',        source: 'Marvel',                 medium: 'film',      rarity: 'rare',      lore: t("Città luminose e architettura organica. Un mondo florido che irradia ottimismo dall'orbita.", 'Luminous cities and organic architecture. A flourishing world radiating optimism from space.', 'Ciudades luminosas y arquitectura orgánica. Un mundo próspero que irradia optimismo.') },
  { alias: 'Skaro',         source: 'Doctor Who',             medium: 'series',    rarity: 'rare',      lore: t('Un pianeta di cenere e desolazione. Qualcosa di metallico si muove lento sulla superficie.', 'A planet of ash and desolation. Something metallic moves slowly on the surface.', 'Un planeta de cenizas y desolación. Algo metálico se mueve lentamente en la superficie.') },
  { alias: 'Thedas',        source: 'Dragon Age',             medium: 'videogame', rarity: 'rare',      lore: t('Fortezze medievali tra foreste oscure. Il peso della storia è visibile anche da quassù.', 'Medieval fortresses among dark forests. The weight of history visible from up here.', 'Fortalezas medievales entre bosques oscuros. El peso de la historia visible desde aquí.') },
  { alias: 'New Eden',      source: 'EVE Online',             medium: 'videogame', rarity: 'rare',      lore: t("Sistemi stellari a perdita d'occhio. Una colonia solitaria sospesa nell'immensità.", 'Star systems as far as the eye can see. A lonely colony suspended in immensity.', 'Sistemas estelares a la vista. Una colonia solitaria suspendida en la inmensidad.') },
  { alias: 'Kepler-452b',   source: 'NASA / Kepler',          medium: 'realworld', rarity: 'rare',      lore: t("Simile alla Terra, ma 1.5 miliardi di anni più vecchia. Mi chiedo cosa abbia già visto che noi ancora non immaginiamo.", "Similar to Earth, but 1.5 billion years older. I wonder what it has already witnessed that we can't yet imagine.", 'Similar a la Tierra, pero 1500 millones de años más vieja. Me pregunto qué habrá visto ya que nosotros ni imaginamos.') },
  { alias: 'TRAPPIST-1e',   source: 'NASA / TRAPPIST',        medium: 'realworld', rarity: 'rare',      lore: t("Orbita una stella nana rossa. Il cielo è quasi sempre crepuscolare. Le condizioni per la vita sembrano più che possibili.", "Orbits a red dwarf star. The sky is almost always twilight. Conditions for life seem more than possible.", 'Orbita una estrella enana roja. El cielo es casi siempre crepuscular. Las condiciones para la vida parecen más que posibles.') },
  { alias: 'Proxima b',     source: 'ESO / Proxima Centauri', medium: 'realworld', rarity: 'rare',      lore: t("Il pianeta più vicino alla Terra oltre il sistema solare. Un puntino intorno a una stella rossa fioca. Eppure è lì, reale.", "The closest planet to Earth beyond the solar system. A dot around a faint red star. Yet it is there, real.", 'El planeta más cercano a la Tierra fuera del sistema solar. Un punto alrededor de una débil estrella roja. Y sin embargo está ahí, real.') },
  // ── Epic ──
  { alias: 'Solaris',       source: 'Solaris',                medium: 'book',      rarity: 'epic',      lore: t('Un oceano senziente che muta forma mentre lo osservo. Forse mi sta osservando anche lui.', "A sentient ocean changing shape as I watch. Perhaps it's watching me back.", 'Un océano sintiente que cambia de forma mientras lo observo. Quizás también me observa.') },
  { alias: 'Ego',           source: 'Marvel',                 medium: 'film',      rarity: 'epic',      lore: t("Un pianeta con un volto. Occhi enormi mi guardano dall'orbita. Non so se avvicinarmi.", "A planet with a face. Enormous eyes look at me from orbit. I don't know whether to approach.", 'Un planeta con un rostro. Ojos enormes me miran desde la órbita. No sé si acercarme.') },
  { alias: 'Zebes',         source: 'Metroid',                medium: 'videogame', rarity: 'epic',      lore: t("Caverne immense visibili anche dall'orbita. Qualcosa di antico e silenzioso abita là sotto.", 'Immense caverns visible even from orbit. Something ancient and silent dwells below.', 'Cavernas inmensas visibles desde la órbita. Algo antiguo y silencioso habita ahí abajo.') },
  { alias: 'Ilos',          source: 'Mass Effect',            medium: 'videogame', rarity: 'epic',      lore: t('Una giungla che ha inghiottito ogni edificio. I segreti della galassia dormono qui sotto.', "A jungle that has swallowed every building. The galaxy's secrets lie buried here.", 'Una jungla que ha engullido cada edificio. Los secretos de la galaxia duermen enterrados aquí.') },
  { alias: 'HD 189733b',    source: 'ESA / Hubble',           medium: 'realworld', rarity: 'epic',      lore: t('Blu cobalto come un oceano profondo, ma piove vetro silicatico a 2000 km/h. La bellezza più pericolosa che abbia mai orbitato.', 'Cobalt blue like a deep ocean, but it rains silicate glass at 2000 km/h. The most dangerous beauty I have ever orbited.', 'Azul cobalto como un océano profundo, pero llueve vidrio de silicato a 2000 km/h. La belleza más peligrosa que he orbitado jamás.') },
  { alias: '55 Cancri e',   source: 'NASA / Spitzer',         medium: 'realworld', rarity: 'epic',      lore: t("La superficie è un oceano di lava. Il cielo è arancione fuoco. Si dice che il mantello contenga diamanti — non mi avvicino per verificare.", "The surface is an ocean of lava. The sky is fire orange. They say the mantle holds diamonds — I won't get closer to check.", 'La superficie es un océano de lava. El cielo es naranja fuego. Dicen que el manto contiene diamantes: no me acerco para comprobarlo.') },
  { alias: 'WASP-12b',      source: 'NASA / Hubble',          medium: 'realworld', rarity: 'epic',      lore: t("Il suo sole lo sta lentamente divorando. Ha la forma di un uovo distorto dalla gravità. Ogni anno è un po' più piccolo.", 'Its star is slowly devouring it. Shaped like an egg distorted by gravity. Each year it is a little smaller.', 'Su estrella lo está devorando lentamente. Tiene forma de huevo distorsionado por la gravedad. Cada año es un poco más pequeño.') },
  // ── Legendary ──
  { alias: 'Brittle Hollow', source: 'Outer Wilds',           medium: 'videogame', rarity: 'legendary', lore: t("Un guscio fragile che collassa in un buco nero. Sto guardando un mondo che si autodivora. E in lontananza... un banjo? Qui? Qualcuno sta suonando il banjo su un pianeta che sta cadendo in un buco nero.", "A fragile shell collapsing into a black hole. I'm watching a world devour itself. And in the distance... a banjo? Here? Someone is playing a banjo on a planet falling into a black hole.", 'Una cáscara frágil que colapsa en un agujero negro. Estoy viendo un mundo devorándose a sí mismo. ¿Y a lo lejos... un banjo? ¿Aquí? Alguien toca el banjo en un planeta que cae en un agujero negro.') },
  { alias: 'Krypton',        source: 'DC Comics',             medium: 'book',      rarity: 'legendary', lore: t("Un mondo di cristallo sotto un sole rosso morente. Un'intera civiltà sepolta nel silenzio.", 'A crystal world under a dying red sun. An entire civilization buried in silence.', 'Un mundo de cristal bajo un sol rojo moribundo. Una civilización entera enterrada en el silencio.') },
  { alias: 'J1407b',         source: 'Leiden Observatory',    medium: 'realworld', rarity: 'legendary', lore: t("I suoi anelli sono 200 volte più larghi di quelli di Saturno. Se li avesse il Sole, sarebbero visibili a occhio nudo dalla Terra.", "Its rings are 200 times wider than Saturn's. If the Sun had them, they'd be visible to the naked eye from Earth.", 'Sus anillos son 200 veces más anchos que los de Saturno. Si los tuviera el Sol, serían visibles a simple vista desde la Tierra.') },
  { alias: 'PSR B1257+12 b', source: 'Arecibo Observatory',   medium: 'realworld', rarity: 'legendary', lore: t("Orbita un pulsar che pulsa 160 volte al secondo. È nato dalla morte di una stella. Esiste davvero, e non dovrebbe.", "Orbits a pulsar that pulses 160 times per second. Born from a star's death. It truly exists, and it shouldn't.", 'Orbita un púlsar que pulsa 160 veces por segundo. Nació de la muerte de una estrella. Existe de verdad, y no debería.') },
  // ── Mythic ──
  { alias: 'Dark Bramble',  source: 'Outer Wilds',            medium: 'videogame', rarity: 'mythic',    lore: t("Non è un pianeta normale: spine enormi hanno consumato un mondo intero. Luci spettrali nella nebbia. E dal buio più profondo... una fisarmonica? No, impossibile. Eppure la sento. Una fisarmonica, lì dentro.", 'Not a normal planet: enormous thorns consumed an entire world. Spectral lights in the fog. And from the deepest dark... an accordion? No, impossible. And yet I hear it. An accordion, in there.', 'No es un planeta normal: enormes espinas consumieron un mundo entero. Luces espectrales en la niebla. Y desde la oscuridad más profunda... ¿un acordeón? No, imposible. Y sin embargo lo oigo. Un acordeón, ahí dentro.') },
]

// All planets from the global pool (locale-resolved)
export function getAllPlanets(): { alias: string; source: string; medium: PlanetMedium; lore: string; rarity: PlanetRarity }[] {
  return PLANET_CATALOG.map((p) => ({
    alias: p.alias,
    source: p.source,
    medium: p.medium,
    lore: p.lore[currentLocale],
    rarity: p.rarity,
  }))
}

export interface PlanetCatalogEntry {
  alias: string
  source: string
  medium: PlanetMedium
  lore: string
  rarity: PlanetRarity
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//              INFRASTRUTTURA (non toccare)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Tipo Labels derivato automaticamente dalla struttura STRINGS
type Resolve<S> = { [K in keyof S]: S[K] extends I18n<infer V> ? V : Resolve<S[K]> }
export type Labels = Resolve<typeof STRINGS>

// ─── Lingua attiva ───────────────────────────────────────
const LANG_KEY = 'andromeda-lang'

function getStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'it' || v === 'en' || v === 'es') return v
  } catch { /* SSR / test */ }
  return 'it'
}

let currentLocale: Locale = getStoredLocale()

export function getLocale(): Locale { return currentLocale }

export function setLocale(locale: Locale) {
  currentLocale = locale
  try { localStorage.setItem(LANG_KEY, locale) } catch { /* noop */ }
}

/** Restituisce tutte le label nella lingua attiva (oggetto completo) */
export function labels(): Labels {
  return resolve(STRINGS) as Labels
}

/**
 * Restituisce le chiavi canoniche italiane delle categorie built-in per un tipo.
 */
export function getCanonicalCategories(type: 'entrata' | 'uscita'): readonly string[] {
  return STRINGS.categorie[type]['it'] as readonly string[]
}

/**
 * Normalizza il nome di una categoria alla chiave canonica italiana,
 * indipendentemente dalla lingua in cui è stato salvato.
 * Le categorie personalizzate vengono restituite invariate.
 */
export function normalizeCategoryKey(category: string, type: 'entrata' | 'uscita'): string {
  const arr = STRINGS.categorie[type]
  for (const locale of ['it', 'en', 'es'] as Locale[]) {
    const localeArr = arr[locale] as readonly string[]
    const idx = localeArr.indexOf(category)
    if (idx !== -1) return (arr['it'] as readonly string[])[idx]
  }
  return category // categoria personalizzata
}

/**
 * Traduce una chiave canonica italiana nella lingua attiva corrente.
 * Se non trovata (categoria personalizzata), restituisce l'input invariato.
 */
export function translateCategory(category: string, type?: 'entrata' | 'uscita'): string {
  const types: ('entrata' | 'uscita')[] = type ? [type] : ['entrata', 'uscita']
  for (const t of types) {
    const arr = STRINGS.categorie[t]
    const itArr = arr['it'] as readonly string[]
    const idx = itArr.indexOf(category)
    if (idx !== -1) return (arr[currentLocale] as readonly string[])[idx]
  }
  return category // categoria personalizzata
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolve(obj: Record<string, any>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const k in obj) {
    const v = obj[k]
    if (v && typeof v === 'object' && 'it' in v && 'en' in v && 'es' in v) {
      out[k] = v[currentLocale]
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = resolve(v)
    } else {
      out[k] = v
    }
  }
  return out
}

// ─── Esportazioni per sezione (usate dai componenti) ─────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function localize(obj: Record<string, any>): any {
  return new Proxy({}, {
    get(_target, prop: string | symbol) {
      if (typeof prop === 'symbol') return undefined
      const v = obj[prop]
      if (!v) return v
      if (typeof v === 'object' && 'it' in v && 'en' in v && 'es' in v) return v[currentLocale]
      if (typeof v === 'object' && !Array.isArray(v)) return localize(v)
      return v
    },
  })
}

export const LAYOUT:    Labels['layout']    = localize(STRINGS.layout)
export const TEMI:      Labels['temi']      = localize(STRINGS.temi)
export const DASHBOARD: Labels['dashboard'] = localize(STRINGS.dashboard)
export const MASCOTTE:  Labels['mascotte']  = localize(STRINGS.mascotte)
export const FORM:      Labels['form']      = localize(STRINGS.form)
export const CATEGORIE: Labels['categorie'] = localize(STRINGS.categorie)
export const NOT_FOUND: Labels['notFound']  = localize(STRINGS.notFound)
export const HOME:      Labels['home']      = localize(STRINGS.home)
export const PIN:       Labels['pin']       = localize(STRINGS.pin)
export const GESTIONE_CATEGORIE: Labels['gestioneCategorie'] = localize(STRINGS.gestioneCategorie)
export const MOVIMENTI: Labels['movimenti'] = localize(STRINGS.movimenti)
export const SETTINGS:  Labels['settings']  = localize(STRINGS.settings)
export const NOTIFICHE: Labels['notifiche'] = localize(STRINGS.notifiche)
export const PWA:       Labels['pwa']       = localize(STRINGS.pwa)
export const AUTO_BACKUP: Labels['autoBackup'] = localize(STRINGS.autoBackup)
export const OCR:         Labels['ocr']         = localize(STRINGS.ocr)
export const RECEIPT_DETAIL: Labels['receiptDetail'] = localize(STRINGS.receiptDetail)
export const PRODOTTI: Labels['prodotti'] = localize(STRINGS.prodotti)
export const MISSIONI: Labels['missioni'] = localize(STRINGS.missioni)
