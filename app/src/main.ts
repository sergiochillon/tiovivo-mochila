import { readingControl, stopReading } from './audio'
import demo from './demo.json'
import { approvedCatalog, loadPack, type Pack, type Activity } from './packs'
import { authoring } from './autoria'
import '@fontsource/baloo-2/latin-700.css'
import '@fontsource/baloo-2/latin-800.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import './style.css'
import { classResults, classTotals, sendProgress, type Progress } from './sync'
import fox from './zorro.svg'
import bird from './colibri.svg'
import { extraAvatars, mochi, sticker } from './art'
import { neutralScene, sceneCaption, sceneFor, sceneImage, type Scene } from './scenes'
import { confetti, isMuted, setMuted, soundOut, soundRight, soundStamp, soundTap, soundWrong } from './fx'
// Each explorer is a child's identity on a shared device, without personal data: progress is kept per avatar.
// label is the legacy display name used only to migrate old progress records.
const avatars: { id: string; portrait: string; color?: string; label?: string }[] = [
  { id: 'zorro', label: 'Zorro', portrait: fox, color: '#fbe3bd' },
  { id: 'colibri', label: 'Colibrí', portrait: bird, color: '#d7eadb' },
  ...extraAvatars.map(({ id, portrait, color }) => ({ id, portrait, color }))
]

const lesson = document.querySelector<HTMLElement>('#lesson')!
let pack: Pack
type Avatar = typeof avatars[number]

/** Mochi, the guide: a speech bubble whose text and mood can change. */
function guide(text: string, mood: 'happy' | 'thinking' | 'cheer' = 'happy') {
  const box = document.createElement('div')
  box.className = 'guide'
  const art = document.createElement('span')
  art.className = 'guide-art'
  art.innerHTML = mochi(mood)
  const bubble = document.createElement('p')
  bubble.className = 'guide-bubble'
  bubble.setAttribute('role', 'status')
  bubble.textContent = text
  box.append(art, bubble)
  return {
    box,
    say(next: string, nextMood: 'happy' | 'thinking' | 'cheer' = 'happy', effect = '') {
      bubble.textContent = next
      art.innerHTML = mochi(nextMood)
      box.classList.remove('wiggle', 'hop'); void box.offsetWidth
      if (effect) box.classList.add(effect)
    }
  }
}
const database = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('mochila-aula', 3)
  request.onupgradeneeded = event => {
    request.result.createObjectStore('packs')
    if (event.oldVersion === 2) return
    if (event.oldVersion === 0) {
      request.result.createObjectStore('progress')
      return
    }
    const store = request.transaction!.objectStore('progress')
    const scan = store.openCursor()
    scan.onsuccess = () => {
      const cursor = scan.result
      if (!cursor) return
      const record = cursor.value
      const avatar = avatars.find(item => item.label === record.avatarId)
      if (avatar) {
        store.add({ ...record, avatarId: avatar.id }, [avatar.id, record.packId, record.activityId])
        cursor.delete()
      }
      cursor.continue()
    }
  }
  request.onsuccess = () => {
    request.result.onversionchange = () => request.result.close()
    resolve(request.result)
  }
  request.onerror = () => reject(request.error)
})

const texts = {
  es: {
    kinds: { story: 'Historia', choice: 'Elige', order: 'Ordena', scenario: '¿Qué harías?', match: 'Parejas', plate: 'Llena el plato', sort: 'Clasifica', memory: 'Memoria', truefalse: '¿Verdad o mentira?' } as Record<string, string>,
    avatars: { zorro: 'Zorro', colibri: 'Colibrí', llama: 'Llama', jirafa: 'Jirafa', tortuga: 'Tortuga', rana: 'Rana' } as Record<string, string>,
    edition: 'Atlas de aula', expedition: 'EXPEDICIÓN 01', footer: 'El progreso se guarda en este dispositivo.',
    who: '¿Qué explorador eliges hoy?', whoHelp: 'Cada explorador guarda sus propias pegatinas. Elige el tuyo.',
    activities: 'Actividades', goingWith: (name: string) => 'Vas con ' + name + '. Toca una actividad para empezar.',
    start: 'Empezar', done: 'Completada', minutes: 'min', changeAvatar: 'Cambiar de explorador',
    back: '← Actividades', continue: 'Continuar', needsReview: 'Esta actividad necesita revisión.', goBack: 'Volver',
    soundOff: 'Silenciar sonidos', soundOn: 'Activar sonidos',
    yourOrder: 'Tu orden', yourPlate: 'Tu plato', pairFound: 'pareja encontrada', firstStep: '¿Cuál es el primer paso?', wrongStep: 'Ese no va ahora. Prueba otro paso.',
    nextStep: '¡Bien! ¿Cuál va después?', tryAgain: 'Puedes volver a elegir.',
    wellDone: (name: string, n = 0) => ['¡Buen trabajo, ' + name + '!', '¡Lo has conseguido, ' + name + '!', '¡Así se hace, ' + name + '!', '¡Genial, ' + name + '!', '¡Qué bien lo hace ' + name + '!', '¡Eres un crack, ' + name + '!', '¡Misión cumplida, ' + name + '!', '¡Muy bien pensado, ' + name + '!'][n % 8], seal: 'Pegatina de la estación',
    seals: (done: number, total: number) => 'Tus pegatinas: ' + done + ' de ' + total,
    nextActivity: 'Siguiente actividad', allActivities: 'Ver todas las actividades',
    storageTitle: 'No se puede acceder al progreso',
    storageHelp: 'Comprueba que el navegador permite guardar datos y vuelve a intentarlo.', retry: 'Volver a intentar',
    playAgain: 'Volver a jugar', backpacks: '← Mis mochilas', correctAnswer: '¡Muy bien!', listenFirst: 'Escucha o lee la pregunta y elige.',
    plateHelp: 'Toca todo lo que va en el plato. ¡Llénalo!', plateWrong: 'Eso no va aquí. Prueba con otra cosa.', plateGood: '¡Sí! Sigue llenando el plato.',
    pairsHelp: 'Toca uno de la izquierda y su pareja de la derecha.', pairsWrong: (a: string, b: string) => '«' + a + '» y «' + b + '» no son pareja. ¡Prueba con otra!', pairsGood: '¡Pareja encontrada!',
    hello: '¡Hola! Soy Mochi. Cada actividad que termines te dará una pegatina para tu álbum.', letsGo: '¡Vamos! Empieza por la estación que brilla.',
    stamps: (n: number) => n === 1 ? '1 pegatina' : n + ' pegatinas', allDone: '¡Has completado todas las estaciones!',
    album: 'Mi álbum', albumHelp: (name: string) => 'Las pegatinas de ' + name + ' en esta mochila. Cada estación superada pega una nueva.',
    newSticker: '¡Pegatina nueva!', emptySlot: 'Por conseguir', openAlbum: (n: number, total: number) => '📒 Mi álbum (' + n + '/' + total + ')',
    helpOption: 'Te ayudo: ahora hay una opción menos. Mira bien las que quedan.', helpStep: 'Te ayudo: el paso que sigue brilla.', helpPlate: 'Te ayudo: mira lo que brilla.', helpPair: 'Te ayudo: su pareja brilla.',
    sortHelp: 'Mira cada cosa y tócala en su cesta.', sortWrong: (item: string) => '«' + item + '» no va en esa cesta. Prueba en otra.',
    sortGood: '¡Bien! Ahora la siguiente.', helpSort: 'Te ayudo: su cesta brilla.',
    memoryHelp: 'Da la vuelta a dos cartas. ¿Hacen pareja?', memoryMiss: 'No son pareja. ¡Recuerda dónde estaban!',
    memoryHint: 'Te ayudo: mira todas un momento…', memoryCard: 'Carta boca abajo',
    tfHelp: '¿Es verdad o es mentira? Toca tu respuesta.', tfTrue: '✓ Verdad', tfFalse: '✗ Mentira',
    tfCount: (n: number, total: number) => n + ' de ' + total, tfRightTrue: '¡Sí, es verdad!', tfRightFalse: '¡Bien visto, es mentira!',
    tfWasTrue: 'Era verdad.', tfWasFalse: 'Era mentira.', truths: 'Eran verdad:',
    missedTitle: '¡Casi!', missedHelp: 'Esta vez no salió. No pasa nada: así también se aprende.', missedMochi: 'La respuesta era:',
    tryItAgain: 'Intentarlo otra vez', tryAgainShort: 'Otra vez',
    homeTitle: '¿Qué mochila abrimos hoy?', homeHelp: 'Las mochilas con ✓ ya están guardadas y funcionan sin conexión.',
    ready: '✓ Lista sin conexión', needsNet: 'Necesita conexión la primera vez',
    notes: { reviewed: 'Revisión pedagógica aprobada', ai: 'Propuesta de IA revisada por el equipo', approved: 'Material aprobado' } as Record<string, string>,
    langNames: { es: 'Español', en: 'Inglés' } as Record<string, string>,
    age: (range: string) => range.replace('-', '–') + ' años', allAges: 'Todas las edades',
    myBackpacks: 'Mis mochilas', learnOffline: 'Aprender sin conexión', yourBackpack: 'Tu mochila',
    searching: 'Buscando material de clase…', noMaterial: 'No hay material aprobado para esta mochila.',
    unavailable: 'Mochila no disponible', connectFirst: 'Conéctate una vez para descargar esta mochila; después funcionará sin conexión.',
    languageLabel: 'Idioma'
  },
  en: {
    kinds: { story: 'Story', choice: 'Choose', order: 'Put in order', scenario: 'What would you do?', match: 'Pairs', plate: 'Fill the plate', sort: 'Sort it', memory: 'Memory', truefalse: 'True or false?' } as Record<string, string>,
    avatars: { zorro: 'Fox', colibri: 'Hummingbird', llama: 'Llama', jirafa: 'Giraffe', tortuga: 'Turtle', rana: 'Frog' } as Record<string, string>,
    edition: 'Class atlas', expedition: 'EXPEDITION 01', footer: 'Your progress is saved on this device.',
    who: 'Which explorer do you pick today?', whoHelp: 'Each explorer keeps their own stickers. Choose yours.',
    activities: 'Activities', goingWith: (name: string) => 'You are with ' + name + '. Tap an activity to start.',
    start: 'Start', done: 'Done', minutes: 'min', changeAvatar: 'Change explorer',
    back: '← Activities', continue: 'Continue', needsReview: 'This activity needs review.', goBack: 'Back',
    soundOff: 'Mute sounds', soundOn: 'Turn sounds on',
    yourOrder: 'Your order', yourPlate: 'Your plate', pairFound: 'match found', firstStep: 'What is the first step?', wrongStep: 'Not this one yet. Try another step.',
    nextStep: 'Good! What comes next?', tryAgain: 'You can choose again.',
    wellDone: (name: string, n = 0) => ['Well done, ' + name + '!', 'You did it, ' + name + '!', 'Nice work, ' + name + '!', 'Awesome, ' + name + '!', name + ' is on fire!', 'You are a star, ' + name + '!', 'Mission complete, ' + name + '!', 'Great thinking, ' + name + '!'][n % 8], seal: 'Station sticker',
    seals: (done: number, total: number) => 'Your stickers: ' + done + ' of ' + total,
    nextActivity: 'Next activity', allActivities: 'See all activities',
    storageTitle: 'Progress cannot be saved',
    storageHelp: 'Check that the browser allows saving data and try again.', retry: 'Try again',
    playAgain: 'Play again', backpacks: '← My backpacks', correctAnswer: 'Great!', listenFirst: 'Listen or read the question and choose.',
    plateHelp: 'Tap everything that goes on the plate. Fill it up!', plateWrong: 'That one does not go here. Try another.', plateGood: 'Yes! Keep filling the plate.',
    pairsHelp: 'Tap one on the left, then its match on the right.', pairsWrong: (a: string, b: string) => '"' + a + '" and "' + b + '" are not a pair. Try another one!', pairsGood: 'Match found!',
    hello: 'Hi! I am Mochi. Every activity you finish gives you a sticker for your album.', letsGo: "Let's go! Start with the shining station.",
    stamps: (n: number) => n === 1 ? '1 sticker' : n + ' stickers', allDone: 'You completed every station!',
    album: 'My album', albumHelp: (name: string) => name + "'s stickers in this backpack. Every station you finish adds a new one.",
    newSticker: 'New sticker!', emptySlot: 'Still to win', openAlbum: (n: number, total: number) => '📒 My album (' + n + '/' + total + ')',
    helpOption: 'Let me help: there is one option fewer now. Look closely at the rest.', helpStep: 'Let me help: the next step is shining.', helpPlate: 'Let me help: look at what is shining.', helpPair: 'Let me help: its match is shining.',
    sortHelp: 'Look at each thing and tap its basket.', sortWrong: (item: string) => '"' + item + '" does not go in that basket. Try another.',
    sortGood: 'Good! Now the next one.', helpSort: 'Let me help: its basket is shining.',
    memoryHelp: 'Turn over two cards. Are they a pair?', memoryMiss: 'Not a pair. Remember where they were!',
    memoryHint: 'Let me help: look at them all for a moment…', memoryCard: 'Face-down card',
    tfHelp: 'Is it true or false? Tap your answer.', tfTrue: '✓ True', tfFalse: '✗ False',
    tfCount: (n: number, total: number) => n + ' of ' + total, tfRightTrue: 'Yes, it is true!', tfRightFalse: 'Well spotted, it is false!',
    tfWasTrue: 'It was true.', tfWasFalse: 'It was false.', truths: 'These were true:',
    missedTitle: 'Almost!', missedHelp: 'It did not work out this time. That is okay: this is how we learn.', missedMochi: 'The answer was:',
    tryItAgain: 'Try it again', tryAgainShort: 'Try again',
    homeTitle: 'Which backpack shall we open today?', homeHelp: 'Backpacks with ✓ are saved and work without internet.',
    ready: '✓ Ready offline', needsNet: 'Needs internet the first time',
    notes: { reviewed: 'Teaching review approved', ai: 'AI proposal reviewed by the team', approved: 'Approved material' } as Record<string, string>,
    langNames: { es: 'Spanish', en: 'English' } as Record<string, string>,
    age: (range: string) => 'Ages ' + range.replace('-', '–'), allAges: 'All ages',
    myBackpacks: 'My backpacks', learnOffline: 'Learn without internet', yourBackpack: 'Your backpack',
    searching: 'Looking for class material…', noMaterial: 'There is no approved material for this backpack.',
    unavailable: 'Backpack not available', connectFirst: 'Connect once to download this backpack; after that it works offline.',
    languageLabel: 'Language'
  }
}
// The interface follows the language of the approved package; Spanish until one is loaded.
// The menus follow the language chosen on «My backpacks» (remembered on this device); inside a backpack,
// everything follows the language of its content.
type Language = 'es' | 'en'
function uiLanguage(): Language {
  try {
    const saved = localStorage.getItem('mochila-idioma')
    if (saved === 'es' || saved === 'en') return saved
  } catch { /* storage may be blocked */ }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'
}
let t = texts[uiLanguage()]
const avatarName = (avatar: Avatar) => t.avatars[avatar.id]

const kinds: Record<string, { label: string; icon: string }> = {
  story: { label: 'Historia', icon: '<path d="M4 5h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4z"/><path d="M20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z"/>' },
  choice: { label: 'Elige', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>' },
  order: { label: 'Ordena', icon: '<path d="M10 6h10M10 12h10M10 18h10M4 6h1.5M4 12h1.5M4 18h1.5"/>' },
  scenario: { label: '¿Qué harías?', icon: '<path d="M4 5h16v10H10l-5 4v-4H4z"/>' },
  match: { label: 'Parejas', icon: '<rect x="3" y="5" width="7" height="14" rx="2"/><rect x="14" y="5" width="7" height="14" rx="2"/><path d="M10 12h4"/>' },
  sort: { label: 'Clasifica', icon: '<path d="M4 10h16l-2 9H6z"/><path d="M8 10l4-6 4 6"/>' },
  memory: { label: 'Memoria', icon: '<rect x="3" y="4" width="8" height="12" rx="2"/><rect x="13" y="8" width="8" height="12" rx="2"/><path d="M7 9v2M17 13v2"/>' },
  truefalse: { label: '¿Verdad o mentira?', icon: '<path d="M3 12l3 3 5-6"/><path d="M14 9l6 6M20 9l-6 6"/>' }
}
const checkIcon = '<path d="M5 12l5 5 9-10"/>'
type Entry = { id: string; title: string; place: string; language: string; age: string; note: string }
const knownPacks: Entry[] = [
  { id: 'misiones-cocina-5-8-es', title: 'Misiones en la cocina de Ana', place: 'Andes, Perú', language: 'es', age: '5-8', note: 'reviewed' },
  { id: 'kitchen-missions-5-8-en', title: 'Kitchen missions with Ayo', place: 'Northern Uganda', language: 'en', age: '5-8', note: 'reviewed' },
  { id: 'expedicion-mercado-9-12-es', title: 'Expedición al mercado', place: 'Andes, Perú', language: 'es', age: '9-12', note: 'reviewed' },
  { id: 'alimentacion-andes-es', title: 'Elegimos con lo que hay', place: 'Andes, Perú', language: 'es', age: '6-10', note: 'reviewed' },
  { id: 'food-northern-uganda-en', title: 'Choosing from what is available', place: 'Northern Uganda', language: 'en', age: '6-10', note: 'reviewed' },
  { id: 'food-altiplano-es', title: 'Alimentos en el Altiplano', place: 'Altiplano, Bolivia', language: 'es', age: '6-10', note: 'ai' }
]
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
// Praise cycles through eight phrasings, starting at a random one so two children do not hear the same order.
let praiseTurn = Math.floor(Math.random() * 8)
/** A new random order each time, so the answer is never in a position the child can memorise.
 *  `predictable` rejects orders that would give the answer away (retries a few times). */
function shuffled<T>(list: readonly T[], predictable: (order: T[]) => boolean = () => false): T[] {
  let order = [...list]
  for (let attempt = 0; attempt < 12; attempt++) {
    order = [...list]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    if (!predictable(order)) return order
  }
  // Very unlucky draws: take the first rotation that is not predictable.
  for (let shift = 1; shift < list.length; shift++) {
    const rotated = [...list.slice(shift), ...list.slice(0, shift)]
    if (!predictable(rotated)) return rotated
  }
  return order
}
/** Option emoji (if any) before the text, hidden from screen readers; the id lets Mochi find the card. */
function decorate(element: HTMLElement, option: { id: string; icon?: string }) {
  element.dataset.option = option.id
  if (option.icon) {
    const icon = document.createElement('span')
    icon.className = 'option-icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = option.icon
    element.prepend(icon)
  }
  return element
}
const byOption = (container: Element, id: string | undefined) =>
  [...container.querySelectorAll<HTMLElement>('[data-option]')].find(item => item.dataset.option === id)

// Static, trusted markup only: never pass package text to this helper.
function icon(paths: string, className: string) {
  const wrapper = document.createElement('span')
  wrapper.className = className
  wrapper.setAttribute('aria-hidden', 'true')
  wrapper.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>'
  return wrapper
}

const playable = (activity: Activity) => activity.type in kinds
/** The activity's own little drawing (an emoji chosen by its author), in the same slot as the game icon. */
function emojiTile(emoji: string) {
  const wrapper = document.createElement('span')
  wrapper.className = 'tile tile-emoji'
  wrapper.setAttribute('aria-hidden', 'true')
  wrapper.textContent = emoji
  return wrapper
}
/** A link back to the start screen; the logo in the header does the same. */
function homeLink(secondary = true) {
  const link = document.createElement('a')
  link.className = 'button-link' + (secondary ? ' secondary-link' : '')
  link.href = '/'
  link.textContent = '🏠 ' + t.myBackpacks
  return link
}

async function progressOf(avatar: Avatar) {
  const db = await database
  const records = await new Promise<Progress[]>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return records.filter(record => record.avatarId === avatar.id && record.packId === pack.id)
}
/** Activities solved (or stories read): they give a sticker. A failed try does not. */
async function completedIds(avatar: Avatar) {
  return new Set((await progressOf(avatar)).filter(record => record.result !== 'incorrect').map(record => record.activityId))
}
async function failedIds(avatar: Avatar) {
  return new Set((await progressOf(avatar)).filter(record => record.result === 'incorrect').map(record => record.activityId))
}
/** Next station: the first not tried yet; when all were tried, the first one still to solve. */
const nextStation = (items: Activity[], done: Set<string>, failed: Set<string>) =>
  items.find(item => !done.has(item.id) && !failed.has(item.id)) ?? items.find(item => !done.has(item.id))

function seals(done: number, total: number) {
  const row = document.createElement('div')
  row.className = 'seals'
  const text = document.createElement('strong')
  text.textContent = t.seals(done, total)
  const dots = document.createElement('span')
  dots.className = 'dots'
  dots.setAttribute('aria-hidden', 'true')
  for (let index = 0; index < total; index++) {
    const dot = document.createElement('i')
    if (index < done) dot.className = 'on'
    dots.append(dot)
  }
  row.append(text, dots)
  return row
}

function screen(title: string, message = '') {
  stopReading()
  lesson.className = ''
  const heading = document.createElement('h1')
  heading.textContent = title
  heading.tabIndex = -1
  const paragraph = document.createElement('p')
  paragraph.textContent = message
  lesson.replaceChildren(heading, paragraph)
  heading.focus()
}

function button(label: string, action: () => void | Promise<void>) {
  const element = document.createElement('button')
  element.textContent = label
  element.onclick = () => Promise.resolve().then(action).catch(storageError)
  lesson.append(element)
  return element
}

function storageError() {
  screen(t.storageTitle, t.storageHelp)
  button(t.retry, () => location.reload())
}

async function backpacks() {
  screen(t.homeTitle, t.homeHelp)
  lesson.className = 'backpacks'
  const db = await database
  const cached = await new Promise<Map<string, Pack>>((resolve, reject) => {
    const store = db.transaction('packs').objectStore('packs')
    const map = new Map<string, Pack>()
    const cursor = store.openCursor()
    cursor.onsuccess = () => {
      const current = cursor.result
      if (!current) return resolve(map)
      map.set(String(current.key), current.value as Pack)
      current.continue()
    }
    cursor.onerror = () => reject(cursor.error)
  })
  const fromPack = (item: Pack): Entry => ({
    id: item.id, title: item.title, place: item.context.region + ', ' + item.context.country,
    language: item.language, age: (item.context as { ageRange?: string }).ageRange ?? '6-10', note: 'approved'
  })
  const entries = [...knownPacks]
  for (const saved of cached.values()) {
    if (!entries.some(entry => entry.id === saved.id)) entries.push(fromPack(saved))
  }
  // Age filter: the teacher (or child) picks the group; remembered on this device.
  let ageFilter = 'all'
  try { ageFilter = localStorage.getItem('mochila-edad') ?? 'all' } catch { /* ignore */ }
  const filters = document.createElement('div')
  filters.className = 'age-filters'
  filters.setAttribute('role', 'group')
  filters.setAttribute('aria-label', t.allAges)
  const grid = document.createElement('div')
  grid.className = 'backpack-grid'
  const applyFilter = () => {
    for (const card of grid.querySelectorAll<HTMLElement>('a.backpack')) card.hidden = ageFilter !== 'all' && card.dataset.age !== ageFilter
    for (const chip of filters.querySelectorAll<HTMLButtonElement>('button')) chip.setAttribute('aria-pressed', String(chip.dataset.age === ageFilter))
  }
  const paintFilters = () => {
    filters.replaceChildren()
    const ages = [...new Set(entries.map(entry => entry.age))].sort((a, b) => parseInt(a) - parseInt(b))
    if (ages.length < 2) return
    if (!ages.includes(ageFilter)) ageFilter = 'all'
    for (const age of ['all', ...ages]) {
      const chip = document.createElement('button')
      chip.type = 'button'
      chip.className = 'age-chip'
      chip.dataset.age = age
      chip.textContent = age === 'all' ? t.allAges : t.age(age)
      chip.onclick = () => {
        ageFilter = age
        try { localStorage.setItem('mochila-edad', age) } catch { /* ignore */ }
        soundTap()
        applyFilter()
      }
      filters.append(chip)
    }
    applyFilter()
  }
  // Only packages stored on this device are «ready offline»; the rest need a connection the first time.
  const addCard = (entry: Entry, index: number) => {
    const ready = cached.has(entry.id)
    const card = document.createElement('a')
    card.className = 'backpack backpack-' + (index % 3) + (ready ? ' ready' : '')
    card.href = '/alumno?pack=' + encodeURIComponent(entry.id)
    card.dataset.age = entry.age
    const art = icon('<path d="M9 6V5a3 3 0 0 1 6 0v1"/><rect x="5" y="6" width="14" height="15" rx="4"/><path d="M9 13h6"/>', 'backpack-art')
    const title = document.createElement('strong')
    title.textContent = cached.get(entry.id)?.title ?? entry.title
    const place = document.createElement('span')
    place.textContent = entry.place + ' — ' + (t.langNames[entry.language] ?? entry.language)
    const tags = document.createElement('span')
    tags.className = 'backpack-tags'
    const age = document.createElement('small')
    age.className = 'backpack-age'
    age.textContent = t.age(entry.age)
    const state = document.createElement('small')
    state.className = 'backpack-state'
    state.textContent = ready ? t.ready : t.needsNet
    tags.append(age, state)
    const note = document.createElement('small')
    note.className = 'backpack-note'
    note.textContent = t.notes[entry.note] ?? entry.note
    card.append(art, title, place, tags, note)
    grid.append(card)
  }
  entries.forEach(addCard)
  lesson.append(filters, grid)
  paintFilters()
  // With a connection, also offer the packages approved on the server since (for example, ones prepared
  // with AI and approved by a teacher). Offline this adds nothing and the screen is already complete.
  const offered = await approvedCatalog()
  for (const item of offered) {
    if (!entries.some(entry => entry.id === item.id)) {
      entries.push(fromPack(item))
      addCard(entries[entries.length - 1], entries.length - 1)
    }
  }
  paintFilters()
}

/** ES / EN switch for the menus (home only; inside a backpack the content decides). */
function languageSwitch(onChange: () => void) {
  const group = document.createElement('div')
  group.className = 'lang-switch'
  group.setAttribute('role', 'group')
  for (const code of ['es', 'en'] as const) {
    const option = document.createElement('button')
    option.type = 'button'
    option.textContent = code.toUpperCase()
    option.setAttribute('aria-pressed', String(t === texts[code]))
    option.setAttribute('aria-label', code === 'es' ? 'Español' : 'English')
    option.onclick = () => {
      try { localStorage.setItem('mochila-idioma', code) } catch { /* ignore */ }
      t = texts[code]
      document.documentElement.lang = code
      for (const other of group.querySelectorAll('button')) other.setAttribute('aria-pressed', String(other === option))
      soundTap()
      onChange()
    }
    group.append(option)
  }
  document.querySelector('header')!.insertBefore(group, document.querySelector('.edition'))
}

async function choose() {
  screen(t.who, t.whoHelp)
  lesson.className = 'choose'
  lesson.append(guide(t.hello).box)
  const db = await database
  const records = await new Promise<Progress[]>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  const grid = document.createElement('div')
  grid.className = 'avatar-grid'
  if (!technicalPreview) {
    const home = document.createElement('a')
    home.className = 'back'
    home.href = '/'
    home.textContent = t.backpacks
    lesson.prepend(home)
  }
  for (const avatar of avatars) {
    const card = button(avatarName(avatar), () => { soundTap(); return activities(avatar) })
    card.className = 'avatar'
    card.style.setProperty('--avatar-bg', avatar.color ?? '#fbe3bd')
    const portrait = new Image()
    portrait.src = avatar.portrait
    portrait.alt = ''
    card.prepend(portrait)
    const count = records.filter(record => record.avatarId === avatar.id && pack && record.packId === pack.id).length
    const stamps = document.createElement('small')
    stamps.className = 'avatar-stamps'
    stamps.textContent = '★ ' + t.stamps(count)
    card.append(stamps)
    card.dataset.avatar = avatar.id
    grid.append(card)
  }
  lesson.append(grid)
}

async function activities(avatar: Avatar) {
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  if (technicalPreview) {
    const choice = items.find(activity => activity.type === 'choice')
    if (choice) return play(avatar, choice)
  }
  const done = await completedIds(avatar)
  const failed = await failedIds(avatar)
  screen(t.activities, t.goingWith(avatarName(avatar)))
  const allDone = items.every(item => done.has(item.id))
  lesson.append(guide(allDone ? t.allDone : t.letsGo, allDone ? 'cheer' : 'happy').box)
  lesson.append(seals(items.filter(item => done.has(item.id)).length, items.length))
  const list = document.createElement('div')
  list.className = 'activities'
  const next = nextStation(items, done, failed)
  for (const item of items) {
    const finished = done.has(item.id)
    const card = document.createElement('button')
    card.className = 'activity' + (finished ? ' done' : '') + (failed.has(item.id) && !finished ? ' failed' : '') + (item === next ? ' next' : '')
    card.onclick = () => play(avatar, item).catch(storageError)
    const text = document.createElement('span')
    text.className = 'activity-text'
    const label = document.createElement('small')
    label.textContent = kindLabel(item)
    const title = document.createElement('span')
    title.className = 'activity-title'
    title.textContent = item.prompt
    text.append(label, title)
    const end = finished ? icon(checkIcon, 'status') : document.createElement('span')
    if (finished) {
      const state = document.createElement('span')
      state.className = 'sr-only'
      state.textContent = t.done
      text.append(state)
    } else if (item === next) {
      end.className = 'pill'
      end.textContent = failed.has(item.id) ? t.tryAgainShort : t.start
    } else if (failed.has(item.id)) {
      end.className = 'pill retry'
      end.textContent = t.tryAgainShort
    } else {
      end.className = 'time'
      end.textContent = item.durationMin ? item.durationMin + ' ' + t.minutes : ''
    }
    const tile = item.icon ? emojiTile(item.icon) : icon(kinds[item.type].icon, 'tile')
    const number = document.createElement('b')
    number.className = 'station'
    number.textContent = String(items.indexOf(item) + 1)
    tile.append(number)
    card.append(tile, text, end)
    list.append(card)
  }
  lesson.append(list)
  const albumButton = button(t.openAlbum(items.filter(item => done.has(item.id)).length, items.length), () => album(avatar))
  albumButton.classList.add('album-button')
  button(t.changeAvatar, choose).classList.add('secondary')
  lesson.append(homeLink())
}

async function album(avatar: Avatar) {
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  const done = await completedIds(avatar)
  screen(t.album, t.albumHelp(avatarName(avatar)))
  lesson.className = 'album'
  const back = document.createElement('button')
  back.className = 'back'
  back.textContent = t.back
  back.onclick = () => activities(avatar).catch(storageError)
  lesson.prepend(back)
  const grid = document.createElement('div')
  grid.className = 'album-grid'
  items.forEach((item, index) => {
    const slot = document.createElement('figure')
    slot.className = 'album-slot' + (done.has(item.id) ? ' won' : '')
    const art = document.createElement('div')
    art.className = 'album-sticker'
    if (done.has(item.id)) art.innerHTML = sticker(stickerKind(item), index)
    else art.textContent = '?'
    const caption = document.createElement('figcaption')
    caption.textContent = done.has(item.id) ? kindLabel(item) + ' ' + (index + 1) : t.emptySlot
    slot.append(art, caption)
    grid.append(slot)
  })
  lesson.append(grid)
}

/** «Fill the plate»: several right answers AND at least one wrong one. When every option is right
 *  (self-choice, e.g. emotions), any tap is a good answer and it plays as a normal choice. */
const isPlate = (activity: Activity) => {
  const correct = activity.correct
  return Array.isArray(correct) && correct.length > 1 && (activity.type === 'choice' || activity.type === 'scenario') &&
    (activity.options ?? []).some(option => !correct.includes(option.id))
}
const stickerKind = (activity: Activity) => isPlate(activity) ? 'plate' : activity.type
/** What the child sees as the game's name: a choice with several right answers is played as «fill the plate». */
const kindLabel = (activity: Activity) => t.kinds[stickerKind(activity)] ?? t.kinds[activity.type] ?? ''

async function play(avatar: Avatar, activity: Activity, replay = false) {
  const db = await database
  const key = [avatar.id, pack.id, activity.id]
  const saved = await new Promise<Progress | undefined>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  if (saved && saved.result !== 'incorrect' && !replay) return complete(avatar, activity)
  screen(activity.prompt, kindLabel(activity))
  lesson.className = 'activity-screen kind-' + activity.type
  if (activity.icon) {
    const art = document.createElement('span')
    art.className = 'activity-emoji'
    art.setAttribute('aria-hidden', 'true')
    art.textContent = activity.icon
    lesson.querySelector('h1')?.prepend(art)
  }
  lesson.append(readingControl(activity.audioText || activity.prompt, pack.language))
  if (!technicalPreview) {
    const back = document.createElement('button')
    back.className = 'back'
    back.textContent = t.back
    back.onclick = () => activities(avatar).catch(storageError)
    lesson.prepend(back)
  }
  // Mochi gives the instructions, the hints and the praise.
  const coach = guide(t.listenFirst, 'thinking')
  const hint = coach.box
  // After every second mistake Mochi stops repeating and actually helps (scaffolding, never the answer at once).
  let mistakes = 0
  const glow = (element: Element | undefined) => {
    if (!element) return
    element.classList.remove('glow'); void (element as HTMLElement).offsetWidth; element.classList.add('glow')
  }
  // Three tries: the 2nd mistake brings real help from Mochi, the 3rd ends the activity as not solved;
  // the child sees the answer and moves on (it can try again later, and the teacher sees it).
  const MAX_MISTAKES = 3
  let ended = false
  const needsHelp = () => {
    mistakes++
    if (mistakes >= MAX_MISTAKES) { void fail(); return false }
    return mistakes === 2
  }
  async function save(result: Progress['result']) {
    ended = true
    const event: Progress = {
      eventId: crypto.randomUUID(), avatarId: avatar.id, packId: pack.id,
      // Tries used, never more than three: solved at the 1st try → 1; after two mistakes → 3; out of tries → 3.
      activityId: activity.id, result, attempts: result === 'incorrect' ? MAX_MISTAKES : Math.min(mistakes + 1, MAX_MISTAKES), type: 'activity_completed',
      ts: new Date().toISOString(), classCode: 'DEMO-01'
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('progress', 'readwrite')
      const store = tx.objectStore('progress')
      const existing = store.get(key)
      existing.onsuccess = () => {
        const previous = existing.result as Progress | undefined
        // A first try is kept; a later success replaces an earlier failure (and is sent again).
        if (!previous) store.add(event, key)
        else if (previous.result === 'incorrect' && result !== 'incorrect') store.put(event, key)
      }
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(tx.error)
    })
  }
  async function finish() {
    if (ended) return
    await save(activity.type === 'story' ? 'completed' : 'correct')
    await complete(avatar, activity, true)
  }
  async function fail() {
    if (ended) return
    await save('incorrect')
    soundOut()
    await missed(avatar, activity)
  }
  const options = activity.options ?? []
  if (activity.type === 'story') {
    button(t.continue, finish)
  } else if (activity.type === 'order') {
    const sequence = activity.correct
    if (!Array.isArray(sequence) || sequence.length !== options.length ||
        new Set(sequence).size !== options.length || !options.every(option => sequence.includes(option.id))) {
      screen(t.needsReview)
      button(t.goBack, () => activities(avatar))
      return
    }
    let step = 0
    const ordered = sequence.map(id => options.find(option => option.id === id)!)
    // A new order every time; the first step is never shown first.
    const shown = shuffled(ordered, order => order[0] === ordered[0])
    const slots = document.createElement('ol')
    slots.className = 'slots'
    slots.setAttribute('aria-label', t.yourOrder)
    const slotText = sequence.map((_, index) => {
      const item = document.createElement('li')
      const number = document.createElement('b')
      number.textContent = String(index + 1)
      const text = document.createElement('span')
      item.append(number, text)
      slots.append(item)
      return text
    })
    const grid = document.createElement('div')
    grid.className = 'steps'
    lesson.append(slots, hint, grid)
    coach.say(t.firstStep, 'thinking')
    for (const option of shown) {
      const answer = button(option.text, async () => {
        if (option.id !== sequence[step]) {
          coach.say(t.wrongStep, 'thinking', 'wiggle')
          soundWrong()
          if (needsHelp()) {
            coach.say(t.helpStep, 'happy', 'hop')
            glow(byOption(grid, ordered[step].id))
          }
          answer.classList.remove('wrong'); void answer.offsetWidth; answer.classList.add('wrong')
          return
        }
        soundRight()
        slotText[step].textContent = (option.icon ? option.icon + ' ' : '') + option.text
        slotText[step].parentElement!.classList.add('filled')
        step++
        answer.disabled = true
        if (step === sequence.length) { await delay(450); await finish() }
        else coach.say(t.nextStep, 'happy', 'hop')
      })
      decorate(answer, option)
      grid.append(answer)
    }
  } else if (activity.type === 'match') {
    // Pairs: correct holds "leftId:rightId"; ids never contain ":" (schema slug).
    const pairs = (Array.isArray(activity.correct) ? activity.correct : []).map(pair => pair.split(':'))
    const byId = new Map(options.map(option => [option.id, option]))
    if (!pairs.length || pairs.some(pair => pair.length !== 2 || !byId.has(pair[0]) || !byId.has(pair[1]))) {
      screen(t.needsReview)
      button(t.goBack, () => activities(avatar))
      return
    }
    coach.say(t.pairsHelp, 'thinking')
    const board = document.createElement('div')
    board.className = 'pairs'
    const left = document.createElement('div')
    const right = document.createElement('div')
    left.className = right.className = 'pairs-column'
    board.append(left, right)
    lesson.append(hint, board)
    let selected: { id: string; element: HTMLButtonElement } | undefined
    let found = 0
    const card = (id: string, column: HTMLElement, side: 'left' | 'right') => {
      const element = document.createElement('button')
      element.className = 'pair-card'
      element.textContent = byId.get(id)!.text
      element.onclick = async () => {
        soundTap()
        if (side === 'left') {
          selected?.element.classList.remove('picked')
          selected?.element.setAttribute('aria-pressed', 'false')
          selected = { id, element }
          element.classList.add('picked')
          element.setAttribute('aria-pressed', 'true') // a screen reader also hears which card is chosen
          return
        }
        if (!selected) return coach.say(t.pairsHelp, 'thinking', 'wiggle')
        const match = pairs.some(([a, b]) => a === selected!.id && b === id)
        if (!match) {
          element.classList.remove('wrong'); void element.offsetWidth; element.classList.add('wrong')
          setTimeout(() => element.classList.remove('wrong'), 700)
          coach.say(t.pairsWrong(byId.get(selected!.id)!.text, byId.get(id)!.text), 'thinking', 'wiggle')
          soundWrong()
          if (needsHelp()) {
            const partner = pairs.find(([a]) => a === selected!.id)?.[1]
            coach.say(t.helpPair, 'happy', 'hop')
            glow(byOption(right, partner))
          }
          return
        }
        const color = 'pair-done pair-' + (found % 4)
        selected.element.className = 'pair-card ' + color
        element.className = 'pair-card ' + color
        selected.element.disabled = element.disabled = true
        // Matched cards say so (and to whom), not only through their colour.
        selected.element.removeAttribute('aria-pressed')
        selected.element.setAttribute('aria-label', byId.get(selected.id)!.text + ': ' + t.pairFound + ', ' + byId.get(id)!.text)
        element.setAttribute('aria-label', byId.get(id)!.text + ': ' + t.pairFound + ', ' + byId.get(selected.id)!.text)
        selected = undefined
        found++
        soundRight()
        if (found === pairs.length) { coach.say(t.correctAnswer, 'cheer', 'hop'); await delay(600); await finish() }
        else coach.say(t.pairsGood, 'happy', 'hop')
      }
      decorate(element, byId.get(id)!)
      column.append(element)
    }
    pairs.forEach(([a]) => card(a, left, 'left'))
    // Right column in a new order each time, with no card level with its partner.
    const rights = pairs.map(([, b]) => b)
    shuffled(rights, order => rights.length > 1 && order.some((b, index) => b === rights[index]))
      .forEach(b => card(b, right, 'right'))
  } else if (activity.type === 'sort') {
    // Sort into baskets: one thing at a time, tap the basket where it goes.
    const pairs = (Array.isArray(activity.correct) ? activity.correct : []).map(pair => pair.split(':'))
    const byId = new Map(options.map(option => [option.id, option]))
    const basketIds = [...new Set(pairs.map(([, basket]) => basket))]
    if (pairs.length < 3 || basketIds.length < 2 || pairs.some(pair => pair.length !== 2 || !byId.has(pair[0]) || !byId.has(pair[1]))) {
      screen(t.needsReview)
      button(t.goBack, () => activities(avatar))
      return
    }
    const queue = shuffled(pairs)
    coach.say(t.sortHelp, 'thinking')
    const current = document.createElement('div')
    current.className = 'sort-item'
    current.setAttribute('aria-live', 'polite')
    const baskets = document.createElement('div')
    baskets.className = 'baskets'
    lesson.append(hint, current, baskets)
    const contents = new Map<string, HTMLElement>()
    let index = 0
    const show = () => {
      const item = byId.get(queue[index][0])!
      current.textContent = item.text
      decorate(current, item)
      current.classList.remove('pop'); void current.offsetWidth; current.classList.add('pop')
    }
    const drop = async (basketId: string) => {
      if (ended) return
      const [itemId, rightBasket] = queue[index]
      const item = byId.get(itemId)!
      if (basketId !== rightBasket) {
        soundWrong()
        const wrong = byOption(baskets, basketId)
        wrong?.classList.remove('wrong'); void wrong?.offsetWidth; wrong?.classList.add('wrong')
        coach.say(item.feedback || t.sortWrong(item.text), 'thinking', 'wiggle')
        if (needsHelp()) { coach.say(t.helpSort, 'happy', 'hop'); glow(byOption(baskets, rightBasket)) }
        return
      }
      soundRight()
      const chip = document.createElement('span')
      chip.textContent = item.icon ?? item.text
      chip.title = item.text
      contents.get(basketId)!.append(chip)
      index++
      if (index === queue.length) { coach.say(t.correctAnswer, 'cheer', 'hop'); await delay(650); await finish() }
      else { coach.say(t.sortGood, 'happy', 'hop'); show() }
    }
    for (const id of shuffled(basketIds)) {
      const basket = byId.get(id)!
      const element = button(basket.text, () => drop(id))
      element.className = 'basket'
      decorate(element, basket)
      const inside = document.createElement('span')
      inside.className = 'basket-items'
      inside.setAttribute('aria-hidden', 'true')
      element.append(inside)
      contents.set(id, inside)
      baskets.append(element)
    }
    show()
  } else if (activity.type === 'memory') {
    // Memory: face-down cards; turn two over, they stay up if they belong together.
    const pairs = (Array.isArray(activity.correct) ? activity.correct : []).map(pair => pair.split(':'))
    const byId = new Map(options.map(option => [option.id, option]))
    if (pairs.length < 2 || pairs.some(pair => pair.length !== 2 || !byId.has(pair[0]) || !byId.has(pair[1]))) {
      screen(t.needsReview)
      button(t.goBack, () => activities(avatar))
      return
    }
    const partner = new Map<string, string>()
    for (const [a, b] of pairs) { partner.set(a, b); partner.set(b, a) }
    coach.say(t.memoryHelp, 'thinking')
    const board = document.createElement('div')
    board.className = 'memory'
    lesson.append(hint, board)
    let open: HTMLButtonElement[] = []
    let found = 0
    let misses = 0
    let busy = false
    for (const option of shuffled(options.filter(option => partner.has(option.id)))) {
      const card = document.createElement('button')
      card.className = 'memory-card'
      card.dataset.option = option.id
      card.setAttribute('aria-label', t.memoryCard)
      const back = document.createElement('span')
      back.className = 'memory-back'
      back.setAttribute('aria-hidden', 'true')
      back.textContent = '?'
      const face = document.createElement('span')
      face.className = 'memory-face'
      if (option.icon) {
        const art = document.createElement('span')
        art.className = 'memory-icon'
        art.textContent = option.icon
        face.append(art)
      }
      face.append(option.text)
      card.append(back, face)
      card.onclick = async () => {
        if (busy || ended || card.classList.contains('open')) return
        soundTap()
        card.classList.add('open')
        card.setAttribute('aria-label', option.text)
        open.push(card)
        if (open.length < 2) return
        const [first, second] = open
        open = []
        if (partner.get(first.dataset.option!) === second.dataset.option) {
          const color = 'pair-' + (found % 4)
          first.classList.add('matched', color); second.classList.add('matched', color)
          first.disabled = second.disabled = true
          found++
          soundRight()
          if (found === pairs.length) {
            // Memory is about remembering: many misses still solve it, but count as «with help».
            mistakes = misses > pairs.length ? 1 : 0
            coach.say(t.correctAnswer, 'cheer', 'hop'); await delay(800); await finish()
          } else coach.say(t.pairsGood, 'happy', 'hop')
          return
        }
        misses++
        busy = true
        soundWrong()
        coach.say(t.memoryMiss, 'thinking', 'wiggle')
        await delay(1000)
        // Memory forgives some misses (it is about remembering), but not endlessly: too many ends it as unsolved.
        // Documented exception to the three-tries rule: the limit is pairs*2+2 misses, and a solved game with many misses
        // is saved as attempts=2 («with help»), not as the real number of misses.
        if (misses >= pairs.length * 2 + 2) { mistakes = MAX_MISTAKES; await fail(); return }
        for (const turned of [first, second]) { turned.classList.remove('open'); turned.setAttribute('aria-label', t.memoryCard) }
        busy = false
        if (misses % 4 === 0) {
          coach.say(t.memoryHint, 'happy', 'hop')
          board.classList.add('peek')
          await delay(1400)
          board.classList.remove('peek')
        }
      }
      board.append(card)
    }
  } else if (activity.type === 'truefalse') {
    // True or false? One statement at a time; a wrong answer explains why. Three mistakes: not solved.
    const truths = new Set(Array.isArray(activity.correct) ? activity.correct : [])
    const statements = shuffled(options)
    coach.say(t.tfHelp, 'thinking')
    const counter = document.createElement('p')
    counter.className = 'tf-counter'
    const card = document.createElement('div')
    card.className = 'tf-card'
    const row = document.createElement('div')
    row.className = 'tf-buttons'
    lesson.append(hint, counter, card, row)
    let index = 0
    const show = () => {
      counter.textContent = t.tfCount(index + 1, statements.length)
      card.textContent = statements[index].text
      if (statements[index].icon) {
        const art = document.createElement('span')
        art.className = 'option-icon'
        art.setAttribute('aria-hidden', 'true')
        art.textContent = statements[index].icon!
        card.prepend(art)
      }
      card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop')
    }
    const answer = async (value: boolean) => {
      if (ended || yes.disabled) return
      yes.disabled = no.disabled = true
      const statement = statements[index]
      const isTrue = truths.has(statement.id)
      if (value === isTrue) {
        soundRight()
        card.classList.add('right')
        coach.say(isTrue ? t.tfRightTrue : t.tfRightFalse, 'cheer', 'hop')
        await delay(900)
      } else {
        mistakes++
        soundWrong()
        card.classList.add('wrong')
        coach.say((isTrue ? t.tfWasTrue : t.tfWasFalse) + (statement.feedback ? ' ' + statement.feedback : ''), 'thinking', 'wiggle')
        await delay(2600)
        // The third mistake ends the activity right away (no more statements).
        if (mistakes >= MAX_MISTAKES) { await fail(); return }
      }
      card.classList.remove('right', 'wrong')
      index++
      if (index < statements.length) { yes.disabled = no.disabled = false; show(); return }
      if (mistakes >= MAX_MISTAKES) await fail()
      else await finish()
    }
    const yes = button(t.tfTrue, () => answer(true))
    yes.className = 'tf-true'
    const no = button(t.tfFalse, () => answer(false))
    no.className = 'tf-false'
    row.append(yes, no)
    show()
  } else if (isPlate(activity)) {
    // "Fill the plate": every correct option must be collected; wrong ones bounce back.
    const needed = new Set(activity.correct as string[])
    coach.say(t.plateHelp, 'thinking')
    const plate = document.createElement('div')
    plate.className = 'plate'
    plate.setAttribute('aria-label', t.yourPlate)
    const tray = document.createElement('div')
    tray.className = 'tray'
    lesson.append(hint, plate, tray)
    shuffled(options).forEach(option => {
      const token = button(option.text, async () => {
        if (!needed.has(option.id)) {
          token.classList.remove('wrong'); void token.offsetWidth; token.classList.add('wrong')
          coach.say(option.feedback || t.plateWrong, 'thinking', 'wiggle')
          soundWrong()
          if (needsHelp()) {
            coach.say(t.helpPlate, 'happy', 'hop')
            glow(byOption(tray, options.find(item => needed.has(item.id))?.id))
          }
          return
        }
        needed.delete(option.id)
        token.disabled = true
        token.classList.add('on-plate')
        plate.append(token)
        soundRight()
        if (needed.size === 0) { coach.say(t.correctAnswer, 'cheer', 'hop'); await delay(700); await finish() }
        else coach.say(t.plateGood, 'happy', 'hop')
      })
      token.className = 'food-token'
      decorate(token, option)
      tray.append(token)
    })
  } else {
    const choices = document.createElement('div')
    choices.className = 'choices'
    lesson.append(choices, hint)
    // New order each time, so the right answer is not always «A».
    const isRight = (id: string) => Array.isArray(activity.correct) ? activity.correct.includes(id) : activity.correct === id
    shuffled(options).forEach((option, index) => {
      const answer = button(option.text, async () => {
        if (isRight(option.id)) {
          answer.classList.add('right')
          coach.say(t.correctAnswer, 'cheer', 'hop')
          soundRight()
          choices.querySelectorAll('button').forEach(other => { (other as HTMLButtonElement).disabled = true })
          await delay(650)
          await finish()
        } else {
          answer.classList.remove('wrong'); void answer.offsetWidth; answer.classList.add('wrong')
          coach.say(option.feedback || t.tryAgain, 'thinking', 'wiggle')
          soundWrong()
          if (needsHelp()) {
            const wrongs = [...choices.querySelectorAll<HTMLButtonElement>('button')].filter(item =>
              !item.disabled && !isRight(item.dataset.option ?? ''))
            const wrongOne = wrongs.find(item => item !== answer) ?? wrongs[0]
            if (wrongOne) { wrongOne.disabled = true; wrongOne.classList.add('removed'); coach.say(t.helpOption, 'happy', 'hop') }
          }
        }
      })
      answer.className = 'answer choice-' + (index % 4)
      const letter = document.createElement('b')
      letter.className = 'letter'
      letter.setAttribute('aria-hidden', 'true')
      letter.textContent = 'ABCD'[index] ?? ''
      answer.prepend(letter)
      decorate(answer, option)
      choices.append(answer)
    })
  }
  if (!hint.isConnected) lesson.append(hint)
  if (technicalPreview) button(t.changeAvatar, choose)
}

async function complete(avatar: Avatar, activity: Activity, fresh = false) {
  screen(t.wellDone(avatarName(avatar), praiseTurn++), activity.feedback)
  lesson.append(readingControl(activity.feedback, pack.language))
  lesson.className = 'celebrate'
  const seal = document.createElement('div')
  seal.className = 'seal'
  seal.setAttribute('role', 'img')
  seal.setAttribute('aria-label', t.seal)
  const stations = pack.modules.flatMap(module => module.activities).filter(playable)
  seal.innerHTML = sticker(stickerKind(activity), Math.max(0, stations.indexOf(activity)))
  const badge = document.createElement('strong')
  badge.className = 'badge'
  badge.textContent = fresh ? t.newSticker : t.seal
  lesson.prepend(seal, badge)
  if (fresh) { soundStamp(); confetti(lesson) }
  if (technicalPreview) {
    button(t.changeAvatar, choose)
    return
  }
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  const done = await completedIds(avatar)
  const failed = await failedIds(avatar)
  lesson.append(seals(items.filter(item => done.has(item.id)).length, items.length))
  const next = nextStation(items.filter(item => item !== activity), done, failed)
  if (next) button(t.nextActivity, () => play(avatar, next))
  const all = button(t.allActivities, () => activities(avatar))
  if (next) all.classList.add('secondary')
  button(t.playAgain, () => play(avatar, activity, true)).classList.add('secondary')
  lesson.append(homeLink())
}

/** What the right answer was, in words, for the «almost» screen. */
function solutionOf(activity: Activity): string {
  const options = activity.options ?? []
  const text = (id: string) => { const option = options.find(item => item.id === id); return option ? (option.icon ? option.icon + ' ' : '') + option.text : id }
  const correct = Array.isArray(activity.correct) ? activity.correct : activity.correct ? [activity.correct] : []
  if (activity.type === 'order') return correct.map(text).join(' → ')
  if (activity.type === 'match' || activity.type === 'memory') return correct.map(pair => pair.split(':').map(text).join(' + ')).join('   ')
  if (activity.type === 'sort') {
    const baskets = [...new Set(correct.map(pair => pair.split(':')[1]))]
    return baskets.map(basket => text(basket) + ': ' + correct.filter(pair => pair.endsWith(':' + basket)).map(pair => text(pair.split(':')[0])).join(', ')).join('   ')
  }
  if (activity.type === 'truefalse') return t.truths + ' ' + correct.map(text).join('; ')
  return correct.map(text).join(', ')
}

/** Out of tries: no sticker, show the answer, move on. The station stays «to try again». */
async function missed(avatar: Avatar, activity: Activity) {
  screen(t.missedTitle, t.missedHelp)
  lesson.className = 'celebrate missed'
  lesson.append(guide(t.missedMochi, 'happy').box)
  const answer = document.createElement('p')
  answer.className = 'solution'
  answer.textContent = solutionOf(activity)
  lesson.append(answer, readingControl(t.missedMochi + ' ' + answer.textContent, pack.language))
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  const done = await completedIds(avatar)
  const failed = await failedIds(avatar)
  lesson.append(seals(items.filter(item => done.has(item.id)).length, items.length))
  const next = nextStation(items.filter(item => item !== activity), done, failed)
  if (next) button(t.nextActivity, () => play(avatar, next))
  button(t.tryItAgain, () => play(avatar, activity, true)).classList.add('secondary')
  button(t.allActivities, () => activities(avatar)).classList.add('secondary')
  lesson.append(homeLink())
}

/** Paints the landscape behind the screen (DESIGN.md §6). A real scene always carries a short visible "illustrative" note. */
function showScene(scene: Scene, language = 'es') {
  const aside = document.querySelector<HTMLElement>('aside')!
  aside.querySelector('.scene-notice')?.remove()
  if (scene !== neutralScene) aside.prepend(sceneCaption(language))
  aside.style.backgroundColor = scene.cielo
  aside.style.backgroundImage = 'url("' + sceneImage(scene) + '")'
  document.body.dataset.scene = scene.id
}

/** Fixed labels, no free text and nothing stored: «Alumno 1»…«Alumno 6» are the six explorers in order.
 *  (The repo rules forbid free text and personal data about minors.) */
const studentLabel = (avatarId: string) => 'Alumno ' + (avatars.findIndex(avatar => avatar.id === avatarId) + 1)

function teacherHeader(title: string, subtitle: string) {
  document.body.classList.add('teacher')
  showScene(neutralScene)
  document.querySelector('.edition')!.textContent = 'Espacio docente'
  document.querySelector('.map-copy small')!.textContent = 'DOCENTE'
  document.querySelector('.map-copy h2')!.textContent = title
  document.querySelector('.map-copy p')!.textContent = subtitle
}

async function pendingCount() {
  const db = await database
  const records = await new Promise<Progress[]>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return { total: records.length, pending: records.filter(record => !record.sent).length }
}

function teacherPanel() {
  teacherHeader('Cuaderno de clase', 'Tu clase de demostración')
  screen('Cuaderno de clase', 'Mira cómo va cada alumno, prepara material nuevo y deja las tablets listas.')
  lesson.className = 'teacher-home'
  const metrics = document.createElement('div')
  metrics.className = 'metrics'
  function metric(label: string) {
    const card = document.createElement('div')
    const value = document.createElement('strong')
    value.textContent = '—'
    const caption = document.createElement('span')
    caption.textContent = label
    card.append(value, caption)
    metrics.append(card)
    return value
  }
  const received = metric('Avisos recibidos de las tablets')
  const completed = metric('Actividades terminadas')
  lesson.append(metrics)
  const metricsHelp = document.createElement('p')
  metricsHelp.className = 'step-help'
  metricsHelp.textContent = 'Cada vez que un alumno termina una actividad (la resuelve, la lee o se queda sin intentos), su tablet lo apunta y lo envía cuando hay conexión. Abajo ves el detalle de cada alumno.'
  lesson.append(metricsHelp)
  // Per-explorer results: what each pseudonymous explorer solved at first try, with help, or not yet.
  // The class: each explorer on the tablets is one student, shown with a fixed label.
  const rosterTitle = document.createElement('h2')
  rosterTitle.textContent = 'Tu alumnado'
  const rosterHelp = document.createElement('p')
  rosterHelp.className = 'step-help'
  rosterHelp.textContent = 'Cada niño o niña elige un explorador en la tablet y aquí lo ves como «Alumno 1» a «Alumno 6». No se guarda ningún nombre ni dato personal.'
  const rosterList = document.createElement('div')
  rosterList.className = 'roster'
  for (const avatar of avatars) {
    const row = document.createElement('div')
    row.className = 'roster-row'
    const portrait = new Image()
    portrait.src = avatar.portrait
    portrait.alt = ''
    const label = document.createElement('strong')
    label.textContent = studentLabel(avatar.id)
    const who = document.createElement('small')
    who.textContent = texts.es.avatars[avatar.id]
    row.append(portrait, label, who)
    rosterList.append(row)
  }
  lesson.append(rosterTitle, rosterHelp, rosterList)
  const resultsTitle = document.createElement('h2')
  resultsTitle.textContent = 'Resultados por alumno'
  const resultsBox = document.createElement('div')
  resultsBox.className = 'explorer-results'
  lesson.append(resultsTitle, resultsBox)
  async function showResults() {
    try {
      const explorers = await classResults()
      resultsBox.replaceChildren()
      if (!explorers.length) {
        const empty = document.createElement('p')
        empty.textContent = 'Todavía no ha llegado ningún resultado. Cuando las tablets envíen su progreso, aparecerá aquí cada alumno.'
        resultsBox.append(empty)
        return
      }
      for (const explorer of explorers) {
        const avatar = avatars.find(item => item.id === explorer.avatarId)
        const card = document.createElement('details')
        card.className = 'explorer'
        const summary = document.createElement('summary')
        if (avatar) {
          const portrait = new Image()
          portrait.src = avatar.portrait
          portrait.alt = ''
          summary.append(portrait)
        }
        const name = document.createElement('strong')
        name.textContent = studentLabel(explorer.avatarId)
        const chips = document.createElement('span')
        chips.className = 'result-chips'
        const chip = (label: string, kind: string) => {
          const item = document.createElement('span')
          item.className = 'result-chip ' + kind
          item.textContent = label
          chips.append(item)
        }
        chip(explorer.firstTry + ' a la primera', 'first')
        chip(explorer.withHelp + ' con ayuda', 'help')
        chip(explorer.failed + ' sin resolver', 'failed')
        summary.append(name, chips)
        const list = document.createElement('ul')
        for (const result of explorer.results) {
          const line = document.createElement('li')
          const state = result.result === 'incorrect' ? '✗ sin resolver (3 intentos)'
            : result.result === 'completed' ? '📖 leída'
              : result.attempts > 1 ? '✓ con ayuda (' + result.attempts + ' intentos)' : '✓ a la primera'
          line.className = result.result === 'incorrect' ? 'failed' : result.attempts > 1 ? 'help' : 'first'
          line.textContent = state + ': ' + result.activity + ' (' + result.packTitle + ')'
          list.append(line)
        }
        card.append(summary, list)
        resultsBox.append(card)
      }
    } catch {
      resultsBox.textContent = 'No se pueden consultar los resultados ahora (sin conexión con el servidor).'
    }
  }
  const totals = document.createElement('p')
  const status = document.createElement('p')
  status.setAttribute('role', 'status')
  async function refresh() {
    try {
      const data = await classTotals()
      received.textContent = String(data.eventsReceived)
      completed.textContent = String(data.activitiesCompleted)
      totals.textContent = 'Datos de la última consulta al servidor.'
      await showResults()
    }
    catch { totals.textContent = 'No se pueden consultar los contadores ahora.' }
  }
  const panelTitle = document.createElement('h2')
  panelTitle.textContent = 'Sincronizar la clase'
  const explanation = document.createElement('p')
  explanation.textContent = 'Envía las actividades guardadas en este dispositivo cuando tengas conexión.'
  lesson.append(panelTitle, explanation)
  const submit = button('Enviar progreso', async () => {
    submit.disabled = true
    try {
      status.textContent = await sendProgress(await database)
      await refresh()
    } catch (error) {
      const reason = error instanceof TypeError ? 'No hay conexión con el servidor.'
        : error instanceof Error ? error.message + '.' : ''
      status.textContent = 'El progreso sigue guardado en este dispositivo. ' + reason + ' Puedes volver a enviarlo cuando haya conexión.'
    } finally {
      submit.disabled = false
      void showPending()
    }
  })
  button('Actualizar contadores', refresh)
  const pendingLine = document.createElement('p')
  pendingLine.className = 'pending-line'
  async function showPending() {
    const { total, pending } = await pendingCount()
    pendingLine.textContent = 'En este dispositivo: ' + total + ' actividades terminadas, ' + pending + ' pendientes de enviar.'
  }
  lesson.append(status, totals, pendingLine)
  void showPending()
  const authorTitle = document.createElement('h2')
  authorTitle.textContent = 'Preparar material'
  const authorHelp = document.createElement('p')
  authorHelp.textContent = 'Adapta un módulo a otra comunidad con ayuda de la IA y apruébalo antes de que llegue al alumnado.'
  const authorLink = document.createElement('a')
  authorLink.className = 'button-link'
  authorLink.href = '/autoria'
  authorLink.textContent = 'Preparar material nuevo'
  lesson.append(authorTitle, authorHelp, authorLink)
  const demoTitle = document.createElement('h2')
  demoTitle.textContent = 'Preparar este dispositivo para otra sesión'
  const demoHelp = document.createElement('p')
  demoHelp.textContent = 'Borra el progreso guardado en este dispositivo (no borra las mochilas descargadas ni lo ya enviado al servidor).'
  lesson.append(demoTitle, demoHelp)
  const reset = button('Borrar progreso de este dispositivo', async () => {
    const { pending } = await pendingCount()
    const warning = pending > 0
      ? 'Hay ' + pending + ' actividades sin enviar que se perderán. ¿Borrar igualmente?'
      : '¿Borrar el progreso guardado en este dispositivo?'
    if (!confirm(warning)) return
    const db = await database
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('progress', 'readwrite')
      tx.objectStore('progress').clear()
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(tx.error)
    })
    status.textContent = 'Progreso de este dispositivo borrado.'
    await showPending()
  })
  reset.classList.add('secondary')
  // Lay the panel out as three cards: prepare material, class progress, this device.
  const card = (className: string, icon: string, nodes: Node[]) => {
    const section = document.createElement('section')
    section.className = 'panel-card ' + className
    const badge = document.createElement('span')
    badge.className = 'panel-icon'
    badge.setAttribute('aria-hidden', 'true')
    badge.textContent = icon
    section.append(badge, ...nodes)
    return section
  }
  const refreshButton = [...lesson.querySelectorAll('button')].find(item => item.textContent === 'Actualizar contadores')!
  panelTitle.textContent = 'Progreso de la clase'
  explanation.textContent = 'Cuando vuelva la conexión, envía lo que se hizo sin red. Reenviar nunca duplica.'
  authorTitle.textContent = 'Preparar material con IA'
  demoTitle.textContent = 'Este dispositivo'
  const grid = document.createElement('div')
  grid.className = 'panel-grid'
  grid.append(
    card('panel-author', '✨', [authorTitle, authorHelp, authorLink]),
    card('panel-progress', '📊', [panelTitle, metrics, explanation, submit, refreshButton, status, totals]),
    card('panel-device', '📱', [demoTitle, pendingLine, demoHelp, reset])
  )
  lesson.append(grid)
  void refresh()
}

// Sound switch in the header (children's screens only). Its label follows the package language.
let paintSoundToggle = () => {}
if (!['/docente', '/autoria'].includes(location.pathname)) {
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'sound-toggle'
  const paint = () => {
    toggle.textContent = isMuted() ? '🔇' : '🔊'
    toggle.setAttribute('aria-label', isMuted() ? t.soundOn : t.soundOff)
  }
  paintSoundToggle = paint
  toggle.onclick = () => { setMuted(!isMuted()); paint(); soundTap() }
  paint()
  document.querySelector('header')!.append(toggle)
}

const reviewRoute = location.pathname === '/revision'
const technicalPreview = reviewRoute && import.meta.env.MODE === 'revision'
if (technicalPreview) {
  document.querySelector('.edition')!.textContent = 'Revisión técnica'
  document.querySelector('footer')!.textContent = 'Ejemplo técnico en borrador. Solo para pruebas del equipo.'
}
if (location.pathname === '/docente') teacherPanel()
else if (location.pathname === '/autoria') {
  teacherHeader('Preparar material', 'Adaptar un módulo con ayuda de la IA')
  document.querySelector('footer')!.textContent = 'La preparación de material necesita conexión con el servidor de MOCHILA.'
  authoring(lesson)
}
else if (reviewRoute && !technicalPreview) screen('Página no disponible')
else if (technicalPreview) {
  pack = demo
  showScene(neutralScene)
  choose()
} else if (!new URLSearchParams(location.search).get('pack')) {
  const paintHome = () => {
    document.documentElement.lang = t === texts.en ? 'en' : 'es'
    document.querySelector('.map-copy small')!.textContent = 'MOCHILA'
    document.querySelector('.map-copy h2')!.textContent = t.myBackpacks
    document.querySelector('.map-copy p')!.textContent = t.learnOffline
    document.querySelector('.edition')!.textContent = t.edition
    document.querySelector('footer')!.textContent = t.footer
    paintSoundToggle()
    backpacks().catch(storageError)
  }
  showScene(neutralScene)
  languageSwitch(paintHome)
  paintHome()
} else {
  const id = new URLSearchParams(location.search).get('pack')!
  // Neutral header and landscape until the package says where it belongs.
  document.querySelector('.map-copy h2')!.textContent = t.yourBackpack
  document.querySelector('.map-copy p')!.textContent = t.learnOffline
  showScene(neutralScene)
  screen(t.searching)
  database.then(db => loadPack(db, id)).then(downloaded => {
    if (!downloaded) {
      screen(t.noMaterial)
      const home = document.createElement('a')
      home.className = 'button-link'
      home.href = '/'
      home.textContent = t.backpacks
      return lesson.append(home)
    }
    document.title = 'MOCHILA — ' + downloaded.title
    pack = downloaded
    document.documentElement.lang = pack.language
    t = pack.language === 'en' ? texts.en : texts.es
    paintSoundToggle()
    document.querySelector('.edition')!.textContent = t.edition
    document.querySelector('.map-copy small')!.textContent = t.expedition
    document.querySelector('footer')!.textContent = t.footer
    document.querySelector('.map-copy h2')!.textContent = pack.title
    document.querySelector('.map-copy p')!.textContent = pack.context.country
    showScene(sceneFor(pack.context), pack.language)
    choose()
  }).catch(error => {
    screen(t.unavailable, error instanceof Error && /Conéctate/.test(error.message) ? t.connectFirst : '')
    button(t.retry, () => location.reload())
    const home = document.createElement('a')
    home.className = 'button-link secondary-link'
    home.href = '/'
    home.textContent = t.backpacks
    lesson.append(home)
  })
}
database.catch(storageError)
// Ask the browser to keep the saved backpacks and progress: without it, Safari may evict them after days unused.
navigator.storage?.persist?.().catch(() => undefined)
// When the network comes back, send pending progress quietly. The server ignores repeated eventIds,
// so this never duplicates a manual send from /docente; a failure leaves the events pending as before.
if (!technicalPreview) {
  const sendQuietly = () => { database.then(sendProgress).catch(() => undefined) }
  addEventListener('online', sendQuietly)
  // Opened with a connection (e.g. the next day): there is no «online» event, so also try once at start.
  // Nothing is sent when there is nothing pending, and /docente keeps its own manual button.
  // Only where children play: not in /docente (own button) nor /autoria (the teacher's computer).
  if (navigator.onLine && location.pathname !== '/docente' && location.pathname !== '/autoria') setTimeout(sendQuietly, 3000)
}
