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
    nasa:    t('NASA',     'NASA',     'NASA'),
    mission: t('Mission',  'Mission',  'Misión'),
    aurora:  t('Aurora',   'Aurora',   'Aurora'),
    luna:    t('Luna',     'Moon',     'Luna'),
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
    lightMode:         t('NASA',                         'NASA',                        'NASA'),
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
