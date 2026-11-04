import { readingControl, stopReading } from './audio'
import demo from './demo.json'
import { loadPack, type Pack, type Activity } from './packs'
import { authoring } from './autoria'
import './style.css'
import { classTotals, sendProgress, type Progress } from './sync'
import fox from './zorro.svg'
import bird from './colibri.svg'
import { extraAvatars, mochi, savanna } from './art'
import { confetti, isMuted, setMuted, soundRight, soundStamp, soundTap, soundWrong } from './fx'
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
    kinds: { story: 'Historia', choice: 'Elige', order: 'Ordena', scenario: '¿Qué harías?', match: 'Parejas' } as Record<string, string>,
    avatars: { zorro: 'Zorro', colibri: 'Colibrí', llama: 'Llama', jirafa: 'Jirafa', tortuga: 'Tortuga', rana: 'Rana' } as Record<string, string>,
    edition: 'Atlas de aula', expedition: 'EXPEDICIÓN 01', footer: 'El progreso se guarda en este dispositivo.',
    who: '¿Quién eres hoy?', whoHelp: 'Cada explorador guarda sus propios sellos. Elige el tuyo.',
    activities: 'Actividades', goingWith: (name: string) => 'Vas con ' + name + '. Toca una actividad para empezar.',
    next: 'Siguiente', start: 'Empezar', done: 'Completada', minutes: 'min', changeAvatar: 'Cambiar de avatar',
    back: '← Actividades', continue: 'Continuar', needsReview: 'Esta actividad necesita revisión.', goBack: 'Volver',
    yourOrder: 'Tu orden', firstStep: '¿Cuál es el primer paso?', wrongStep: 'Ese no va ahora. Prueba otro paso.',
    nextStep: '¡Bien! ¿Cuál va después?', tryAgain: 'Puedes volver a elegir.',
    wellDone: (name: string) => '¡Buen trabajo, ' + name + '!', seal: 'Sello del valle',
    seals: (done: number, total: number) => 'Tus sellos: ' + done + ' de ' + total,
    nextActivity: 'Siguiente actividad', allActivities: 'Ver todas las actividades',
    storageTitle: 'No se puede acceder al progreso',
    storageHelp: 'Comprueba que el navegador permite guardar datos y vuelve a intentarlo.', retry: 'Volver a intentar',
    playAgain: 'Volver a jugar', backpacks: '← Mis mochilas', correctAnswer: '¡Muy bien!', listenFirst: 'Escucha o lee la pregunta y elige.',
    plateHelp: 'Toca todo lo que va en el plato. ¡Llénalo!', plateWrong: 'Eso no va aquí. Prueba con otra cosa.', plateGood: '¡Sí! Sigue llenando el plato.',
    pairsHelp: 'Toca uno de la izquierda y su pareja de la derecha.', pairsWrong: 'Esa no es su pareja. ¡Inténtalo otra vez!', pairsGood: '¡Pareja encontrada!',
    hello: '¡Hola! Soy Mochi. Cuando termines una actividad, ganarás un sello.', letsGo: '¡Vamos! Empieza por la estación que brilla.',
    stamps: (n: number) => n === 1 ? '1 sello' : n + ' sellos', allDone: '¡Has completado todas las estaciones!'
  },
  en: {
    kinds: { story: 'Story', choice: 'Choose', order: 'Put in order', scenario: 'What would you do?', match: 'Pairs' } as Record<string, string>,
    avatars: { zorro: 'Fox', colibri: 'Hummingbird', llama: 'Llama', jirafa: 'Giraffe', tortuga: 'Turtle', rana: 'Frog' } as Record<string, string>,
    edition: 'Class atlas', expedition: 'EXPEDITION 01', footer: 'Your progress is saved on this device.',
    who: 'Who are you today?', whoHelp: 'Each explorer keeps their own stamps. Choose yours.',
    activities: 'Activities', goingWith: (name: string) => 'You are with ' + name + '. Tap an activity to start.',
    next: 'Next', start: 'Start', done: 'Done', minutes: 'min', changeAvatar: 'Change friend',
    back: '← Activities', continue: 'Continue', needsReview: 'This activity needs review.', goBack: 'Back',
    yourOrder: 'Your order', firstStep: 'What is the first step?', wrongStep: 'Not this one yet. Try another step.',
    nextStep: 'Good! What comes next?', tryAgain: 'You can choose again.',
    wellDone: (name: string) => 'Well done, ' + name + '!', seal: 'Valley stamp',
    seals: (done: number, total: number) => 'Your stamps: ' + done + ' of ' + total,
    nextActivity: 'Next activity', allActivities: 'See all activities',
    storageTitle: 'Progress cannot be saved',
    storageHelp: 'Check that the browser allows saving data and try again.', retry: 'Try again',
    playAgain: 'Play again', backpacks: '← My backpacks', correctAnswer: 'Great!', listenFirst: 'Listen or read the question and choose.',
    plateHelp: 'Tap everything that goes on the plate. Fill it up!', plateWrong: 'That one does not go here. Try another.', plateGood: 'Yes! Keep filling the plate.',
    pairsHelp: 'Tap one on the left, then its match on the right.', pairsWrong: 'Not a match. Try again!', pairsGood: 'Match found!',
    hello: 'Hi! I am Mochi. When you finish an activity, you will earn a stamp.', letsGo: "Let's go! Start with the shining station.",
    stamps: (n: number) => n === 1 ? '1 stamp' : n + ' stamps', allDone: 'You completed every station!'
  }
}
// The interface follows the language of the approved package; Spanish until one is loaded.
let t = texts.es
const avatarName = (avatar: Avatar) => t.avatars[avatar.id]

const kinds: Record<string, { label: string; icon: string }> = {
  story: { label: 'Historia', icon: '<path d="M4 5h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4z"/><path d="M20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z"/>' },
  choice: { label: 'Elige', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>' },
  order: { label: 'Ordena', icon: '<path d="M10 6h10M10 12h10M10 18h10M4 6h1.5M4 12h1.5M4 18h1.5"/>' },
  scenario: { label: '¿Qué harías?', icon: '<path d="M4 5h16v10H10l-5 4v-4H4z"/>' },
  match: { label: 'Parejas', icon: '<rect x="3" y="5" width="7" height="14" rx="2"/><rect x="14" y="5" width="7" height="14" rx="2"/><path d="M10 12h4"/>' }
}
const checkIcon = '<path d="M5 12l5 5 9-10"/>'
const knownPacks = [
  { id: 'alimentacion-andes-es', title: 'Elegimos con lo que hay', place: 'Perú · Andes', language: 'Español', note: 'Revisión pedagógica aprobada' },
  { id: 'food-northern-uganda-en', title: 'Choosing from what is available', place: 'Uganda · Norte', language: 'English', note: 'Revisión pedagógica aprobada' },
  { id: 'food-altiplano-es', title: 'Alimentos en el Altiplano', place: 'Bolivia · Altiplano (contexto sintético)', language: 'Español', note: 'Propuesta de IA revisada por el equipo' }
]
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const sealArt = '<svg viewBox="0 0 210 210"><circle cx="105" cy="105" r="100" fill="#fbe9c0"/><circle cx="105" cy="105" r="78" fill="#f3c76b"/><circle cx="105" cy="105" r="78" fill="none" stroke="#174c43" stroke-width="4" stroke-dasharray="6 7"/><circle cx="105" cy="105" r="58" fill="#174c43"/><path d="M70 122 L92 96 L104 110 L118 90 L140 122 Z" fill="#8fb3a0"/><circle cx="128" cy="84" r="8" fill="#f3c76b"/><path d="M84 128 Q100 120 120 122" stroke="#ecd6a6" stroke-width="5" fill="none" stroke-linecap="round"/></svg>'

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

async function completedIds(avatar: Avatar) {
  const db = await database
  const records = await new Promise<Progress[]>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return new Set(records.filter(record => record.avatarId === avatar.id && record.packId === pack.id)
    .map(record => record.activityId))
}

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
  screen('Mis mochilas', 'Elige una mochila para empezar. Las que llevan ✓ funcionan sin conexión.')
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
  const entries = [...knownPacks]
  for (const [id, saved] of cached) {
    if (!entries.some(entry => entry.id === id)) {
      entries.push({ id, title: saved.title, place: saved.context.country + ' · ' + saved.context.region, language: saved.language === 'en' ? 'English' : 'Español', note: 'Material aprobado' })
    }
  }
  const grid = document.createElement('div')
  grid.className = 'backpack-grid'
  entries.forEach((entry, index) => {
    const ready = cached.has(entry.id)
    const card = document.createElement('a')
    card.className = 'backpack backpack-' + (index % 3) + (ready ? ' ready' : '')
    card.href = '/alumno?pack=' + encodeURIComponent(entry.id)
    const art = icon('<path d="M9 6V5a3 3 0 0 1 6 0v1"/><rect x="5" y="6" width="14" height="15" rx="4"/><path d="M9 13h6"/>', 'backpack-art')
    const title = document.createElement('strong')
    title.textContent = cached.get(entry.id)?.title ?? entry.title
    const place = document.createElement('span')
    place.textContent = entry.place + ' · ' + entry.language
    const state = document.createElement('small')
    state.className = 'backpack-state'
    state.textContent = ready ? '✓ Lista sin conexión' : 'Necesita conexión la primera vez'
    const note = document.createElement('small')
    note.className = 'backpack-note'
    note.textContent = entry.note
    card.append(art, title, place, state, note)
    grid.append(card)
  })
  lesson.append(grid)
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
  screen(t.activities, t.goingWith(avatarName(avatar)))
  const allDone = items.every(item => done.has(item.id))
  lesson.append(guide(allDone ? t.allDone : t.letsGo, allDone ? 'cheer' : 'happy').box)
  lesson.append(seals(items.filter(item => done.has(item.id)).length, items.length))
  const list = document.createElement('div')
  list.className = 'activities'
  const next = items.find(item => !done.has(item.id))
  for (const item of items) {
    const finished = done.has(item.id)
    const card = document.createElement('button')
    card.className = 'activity' + (finished ? ' done' : '') + (item === next ? ' next' : '')
    card.onclick = () => play(avatar, item).catch(storageError)
    const text = document.createElement('span')
    text.className = 'activity-text'
    const label = document.createElement('small')
    label.textContent = t.kinds[item.type] + (item === next ? ' · ' + t.next : '')
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
      end.textContent = t.start
    } else {
      end.className = 'time'
      end.textContent = item.durationMin ? item.durationMin + ' ' + t.minutes : ''
    }
    const tile = icon(kinds[item.type].icon, 'tile')
    const number = document.createElement('b')
    number.className = 'station'
    number.textContent = String(items.indexOf(item) + 1)
    tile.append(number)
    card.append(tile, text, end)
    list.append(card)
  }
  lesson.append(list)
  button(t.changeAvatar, choose).classList.add('secondary')
}

async function play(avatar: Avatar, activity: Activity, replay = false) {
  const db = await database
  const key = [avatar.id, pack.id, activity.id]
  const saved = await new Promise<Progress | undefined>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  if (saved && !replay) return complete(avatar, activity)
  screen(activity.prompt, t.kinds[activity.type] ?? '')
  lesson.className = 'activity-screen kind-' + activity.type
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
  async function finish() {
    const event: Progress = {
      eventId: crypto.randomUUID(), avatarId: avatar.id, packId: pack.id,
      activityId: activity.id, result: activity.type === 'story' ? 'completed' : 'correct', type: 'activity_completed',
      ts: new Date().toISOString(), classCode: 'DEMO-01'
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('progress', 'readwrite')
      const store = tx.objectStore('progress')
      const existing = store.get(key)
      existing.onsuccess = () => { if (!existing.result) store.add(event, key) }
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(tx.error)
    })
    await complete(avatar, activity, true)
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
    // Present the steps out of order, including when the package lists them in solution order.
    const shown = [...ordered.slice(1), ordered[0]]
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
          answer.classList.remove('wrong'); void answer.offsetWidth; answer.classList.add('wrong')
          return
        }
        soundRight()
        slotText[step].textContent = option.text
        slotText[step].parentElement!.classList.add('filled')
        step++
        answer.disabled = true
        if (step === sequence.length) { await delay(450); await finish() }
        else coach.say(t.nextStep, 'happy', 'hop')
      })
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
          selected = { id, element }
          element.classList.add('picked')
          return
        }
        if (!selected) return coach.say(t.pairsHelp, 'thinking', 'wiggle')
        const match = pairs.some(([a, b]) => a === selected!.id && b === id)
        if (!match) {
          element.classList.remove('wrong'); void element.offsetWidth; element.classList.add('wrong')
          setTimeout(() => element.classList.remove('wrong'), 700)
          coach.say(t.pairsWrong, 'thinking', 'wiggle')
          soundWrong()
          return
        }
        const color = 'pair-done pair-' + (found % 4)
        selected.element.className = 'pair-card ' + color
        element.className = 'pair-card ' + color
        selected.element.disabled = element.disabled = true
        selected = undefined
        found++
        soundRight()
        if (found === pairs.length) { coach.say(t.correctAnswer, 'cheer', 'hop'); await delay(600); await finish() }
        else coach.say(t.pairsGood, 'happy', 'hop')
      }
      column.append(element)
    }
    pairs.forEach(([a]) => card(a, left, 'left'))
    // Right column never in the same order as the left one.
    const rights = pairs.map(([, b]) => b)
    ;[...rights.slice(1), rights[0]].forEach(b => card(b, right, 'right'))
  } else if (Array.isArray(activity.correct) && activity.correct.length > 1) {
    // "Fill the plate": every correct option must be collected; wrong ones bounce back.
    const needed = new Set(activity.correct)
    coach.say(t.plateHelp, 'thinking')
    const plate = document.createElement('div')
    plate.className = 'plate'
    plate.setAttribute('aria-label', t.yourOrder)
    const tray = document.createElement('div')
    tray.className = 'tray'
    lesson.append(hint, plate, tray)
    options.forEach(option => {
      const token = button(option.text, async () => {
        if (!needed.has(option.id)) {
          token.classList.remove('wrong'); void token.offsetWidth; token.classList.add('wrong')
          coach.say(option.feedback || t.plateWrong, 'thinking', 'wiggle')
          soundWrong()
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
      if (option.icon) {
        const icon = document.createElement('span')
        icon.setAttribute('aria-hidden', 'true')
        icon.textContent = option.icon
        token.prepend(icon)
      }
      tray.append(token)
    })
  } else {
    const choices = document.createElement('div')
    choices.className = 'choices'
    lesson.append(choices, hint)
    options.forEach((option, index) => {
      const answer = button(option.text, async () => {
        const correct = activity.correct
        if (Array.isArray(correct) ? correct.includes(option.id) : correct === option.id) {
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
        }
      })
      answer.className = 'answer choice-' + (index % 4)
      const letter = document.createElement('b')
      letter.className = 'letter'
      letter.setAttribute('aria-hidden', 'true')
      letter.textContent = 'ABCD'[index] ?? ''
      answer.prepend(letter)
      choices.append(answer)
      if (option.icon) {
        const icon = document.createElement('span')
        icon.setAttribute('aria-hidden', 'true')
        icon.textContent = option.icon
        answer.prepend(icon)
      }
    })
  }
  if (!hint.isConnected) lesson.append(hint)
  if (technicalPreview) button(t.changeAvatar, choose)
}

async function complete(avatar: Avatar, activity: Activity, fresh = false) {
  screen(t.wellDone(avatarName(avatar)), activity.feedback)
  lesson.append(readingControl(activity.feedback, pack.language))
  lesson.className = 'celebrate'
  const seal = document.createElement('div')
  seal.className = 'seal'
  seal.setAttribute('role', 'img')
  seal.setAttribute('aria-label', t.seal)
  seal.innerHTML = sealArt
  const stations = pack.modules.flatMap(module => module.activities).filter(playable)
  seal.style.setProperty('--seal-hue', String((stations.indexOf(activity) * 47) % 360) + 'deg')
  const badge = document.createElement('strong')
  badge.className = 'badge'
  badge.textContent = t.seal
  lesson.prepend(seal, badge)
  if (fresh) { soundStamp(); confetti(lesson) }
  if (technicalPreview) {
    button(t.changeAvatar, choose)
    return
  }
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  const done = await completedIds(avatar)
  lesson.append(seals(items.filter(item => done.has(item.id)).length, items.length))
  const next = items.find(item => !done.has(item.id))
  if (next) button(t.nextActivity, () => play(avatar, next))
  const all = button(t.allActivities, () => activities(avatar))
  if (next) all.classList.add('secondary')
  button(t.playAgain, () => play(avatar, activity, true)).classList.add('secondary')
}

function teacherHeader(title: string, subtitle: string) {
  document.body.classList.add('teacher')
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
  teacherHeader('Cuaderno de clase', 'Clase DEMO-01')
  screen('Cuaderno de clase', 'Clase DEMO-01 · prepara el material, sigue el progreso y deja las tablets listas.')
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
  const received = metric('Eventos recibidos')
  const completed = metric('Actividades completadas')
  lesson.append(metrics)
  const totals = document.createElement('p')
  const status = document.createElement('p')
  status.setAttribute('role', 'status')
  async function refresh() {
    try {
      const data = await classTotals()
      received.textContent = String(data.eventsReceived)
      completed.textContent = String(data.activitiesCompleted)
      totals.textContent = 'Datos de la última consulta al servidor.'
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
    pendingLine.textContent = 'En este dispositivo: ' + total + ' actividades completadas, ' + pending + ' pendientes de enviar.'
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

// Sound switch in the header (children's screens only).
if (!['/docente', '/autoria'].includes(location.pathname)) {
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'sound-toggle'
  const paint = () => {
    toggle.textContent = isMuted() ? '🔇' : '🔊'
    toggle.setAttribute('aria-label', isMuted() ? 'Activar sonidos' : 'Silenciar sonidos')
  }
  toggle.onclick = () => { setMuted(!isMuted()); paint(); soundTap() }
  paint()
  document.querySelector('header')!.append(toggle)
}

const reviewRoute = location.pathname === '/revision'
const technicalPreview = reviewRoute && import.meta.env.MODE === 'revision'
if (technicalPreview) {
  document.querySelector('.edition')!.textContent = 'Revisión técnica'
  document.querySelector('footer')!.textContent = 'Ejemplo técnico en borrador · Solo para pruebas del equipo.'
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
  choose()
} else if (!new URLSearchParams(location.search).get('pack')) {
  document.querySelector('.map-copy small')!.textContent = 'MOCHILA'
  document.querySelector('.map-copy h2')!.textContent = 'Mis mochilas'
  document.querySelector('.map-copy p')!.textContent = 'Aprender sin conexión'
  backpacks().catch(storageError)
} else {
  const id = new URLSearchParams(location.search).get('pack')!
  // Neutral header until the package says where it belongs (the static HTML shows the Andes).
  document.querySelector('.map-copy h2')!.textContent = 'Tu mochila'
  document.querySelector('.map-copy p')!.textContent = 'Aprender sin conexión'
  screen('Buscando material de clase…')
  database.then(db => loadPack(db, id)).then(downloaded => {
    if (!downloaded) {
      screen('No hay material aprobado para este paquete.')
      const home = document.createElement('a')
      home.className = 'button-link'
      home.href = '/'
      home.textContent = '← Mis mochilas'
      return lesson.append(home)
    }
    document.title = 'MOCHILA · ' + downloaded.title
    pack = downloaded
    document.documentElement.lang = pack.language
    if (pack.language === 'en') t = texts.en
    document.querySelector('.edition')!.textContent = t.edition
    document.querySelector('.map-copy small')!.textContent = t.expedition
    document.querySelector('footer')!.textContent = t.footer
    document.querySelector('.map-copy h2')!.textContent = pack.title
    document.querySelector('.map-copy p')!.textContent = pack.context.country
    if (/uganda/i.test(pack.context.country)) {
      document.body.classList.add('scene-savanna')
      document.querySelector<HTMLElement>('aside')!.style.backgroundImage = 'url("' + savanna + '")'
    }
    choose()
  }).catch(error => {
    screen('Paquete no disponible', error instanceof Error ? error.message : '')
    button('Volver a intentar', () => location.reload())
    const home = document.createElement('a')
    home.className = 'button-link secondary-link'
    home.href = '/'
    home.textContent = '← Mis mochilas'
    lesson.append(home)
  })
}
database.catch(storageError)
