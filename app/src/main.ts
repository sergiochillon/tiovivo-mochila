import demo from './demo.json'
import { loadPack, type Pack, type Activity } from './packs'
import './style.css'
import { classTotals, sendProgress, type Progress } from './sync'
import fox from './zorro.svg'
import bird from './colibri.svg'
const avatars = [
  { id: 'zorro', label: 'Zorro', portrait: fox },
  { id: 'colibri', label: 'Colibrí', portrait: bird }
] as const

const lesson = document.querySelector<HTMLElement>('#lesson')!
let pack: Pack
type Avatar = typeof avatars[number]
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
    kinds: { story: 'Historia', choice: 'Elige', order: 'Ordena', scenario: '¿Qué harías?' } as Record<string, string>,
    avatars: { zorro: 'Zorro', colibri: 'Colibrí' } as Record<string, string>,
    edition: 'Atlas de aula', expedition: 'EXPEDICIÓN 01', footer: 'El progreso se guarda en este dispositivo.',
    who: '¿Quién va contigo?', whoHelp: 'Elige un compañero para explorar el valle.',
    activities: 'Actividades', goingWith: (name: string) => 'Vas con ' + name + '. Toca una actividad para empezar.',
    next: 'Siguiente', start: 'Empezar', done: 'Completada', minutes: 'min', changeAvatar: 'Cambiar de avatar',
    back: '← Actividades', continue: 'Continuar', needsReview: 'Esta actividad necesita revisión.', goBack: 'Volver',
    yourOrder: 'Tu orden', firstStep: '¿Cuál es el primer paso?', wrongStep: 'Ese no va ahora. Prueba otro paso.',
    nextStep: '¡Bien! ¿Cuál va después?', tryAgain: 'Puedes volver a elegir.',
    wellDone: (name: string) => '¡Buen trabajo, ' + name + '!', seal: 'Sello del valle',
    seals: (done: number, total: number) => 'Tus sellos: ' + done + ' de ' + total,
    nextActivity: 'Siguiente actividad', allActivities: 'Ver todas las actividades',
    storageTitle: 'No se puede acceder al progreso',
    storageHelp: 'Comprueba que el navegador permite guardar datos y vuelve a intentarlo.', retry: 'Volver a intentar'
  },
  en: {
    kinds: { story: 'Story', choice: 'Choose', order: 'Put in order', scenario: 'What would you do?' } as Record<string, string>,
    avatars: { zorro: 'Fox', colibri: 'Hummingbird' } as Record<string, string>,
    edition: 'Class atlas', expedition: 'EXPEDITION 01', footer: 'Your progress is saved on this device.',
    who: 'Who is coming with you?', whoHelp: 'Choose a friend to explore with.',
    activities: 'Activities', goingWith: (name: string) => 'You are with ' + name + '. Tap an activity to start.',
    next: 'Next', start: 'Start', done: 'Done', minutes: 'min', changeAvatar: 'Change friend',
    back: '← Activities', continue: 'Continue', needsReview: 'This activity needs review.', goBack: 'Back',
    yourOrder: 'Your order', firstStep: 'What is the first step?', wrongStep: 'Not this one yet. Try another step.',
    nextStep: 'Good! What comes next?', tryAgain: 'You can choose again.',
    wellDone: (name: string) => 'Well done, ' + name + '!', seal: 'Valley stamp',
    seals: (done: number, total: number) => 'Your stamps: ' + done + ' of ' + total,
    nextActivity: 'Next activity', allActivities: 'See all activities',
    storageTitle: 'Progress cannot be saved',
    storageHelp: 'Check that the browser allows saving data and try again.', retry: 'Try again'
  }
}
// The interface follows the language of the approved package; Spanish until one is loaded.
let t = texts.es
const avatarName = (avatar: Avatar) => t.avatars[avatar.id]

const kinds: Record<string, { label: string; icon: string }> = {
  story: { label: 'Historia', icon: '<path d="M4 5h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4z"/><path d="M20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z"/>' },
  choice: { label: 'Elige', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>' },
  order: { label: 'Ordena', icon: '<path d="M10 6h10M10 12h10M10 18h10M4 6h1.5M4 12h1.5M4 18h1.5"/>' },
  scenario: { label: '¿Qué harías?', icon: '<path d="M4 5h16v10H10l-5 4v-4H4z"/>' }
}
const checkIcon = '<path d="M5 12l5 5 9-10"/>'
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

function choose() {
  screen(t.who, t.whoHelp)
  for (const avatar of avatars) {
    const card = button(avatarName(avatar), () => activities(avatar))
    card.className = 'avatar'
    const portrait = new Image()
    portrait.src = avatar.portrait
    portrait.alt = ''
    card.prepend(portrait)
    card.dataset.avatar = avatar.id
  }
}

async function activities(avatar: Avatar) {
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  if (technicalPreview) {
    const choice = items.find(activity => activity.type === 'choice')
    if (choice) return play(avatar, choice)
  }
  const done = await completedIds(avatar)
  screen(t.activities, t.goingWith(avatarName(avatar)))
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
    card.append(icon(kinds[item.type].icon, 'tile'), text, end)
    list.append(card)
  }
  lesson.append(list)
  button(t.changeAvatar, choose).classList.add('secondary')
}

async function play(avatar: Avatar, activity: Activity) {
  const db = await database
  const key = [avatar.id, pack.id, activity.id]
  const saved = await new Promise<Progress | undefined>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  if (saved) return complete(avatar, activity)
  screen(activity.prompt, t.kinds[activity.type] ?? '')
  if (!technicalPreview) {
    const back = document.createElement('button')
    back.className = 'back'
    back.textContent = t.back
    back.onclick = () => activities(avatar).catch(storageError)
    lesson.prepend(back)
  }
  const hint = document.createElement('p')
  hint.className = 'hint'
  hint.setAttribute('role', 'status')
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
    await complete(avatar, activity)
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
    hint.textContent = t.firstStep
    for (const option of shown) {
      const answer = button(option.text, async () => {
        if (option.id !== sequence[step]) {
          hint.textContent = t.wrongStep
          return
        }
        slotText[step].textContent = option.text
        slotText[step].parentElement!.classList.add('filled')
        step++
        answer.disabled = true
        if (step === sequence.length) await finish()
        else hint.textContent = t.nextStep
      })
      grid.append(answer)
    }
  } else {
    for (const option of options) {
      const answer = button(option.text, async () => {
        const correct = activity.correct
        if (Array.isArray(correct) ? correct.includes(option.id) : correct === option.id) {
          await finish()
        } else {
          hint.textContent = option.feedback || t.tryAgain
        }
      })
      answer.className = 'answer'
      if (option.icon) {
        const icon = document.createElement('span')
        icon.setAttribute('aria-hidden', 'true')
        icon.textContent = option.icon
        answer.prepend(icon)
      }
    }
  }
  if (!hint.isConnected) lesson.append(hint)
  if (technicalPreview) button(t.changeAvatar, choose)
}

async function complete(avatar: Avatar, activity: Activity) {
  screen(t.wellDone(avatarName(avatar)), activity.feedback)
  lesson.className = 'celebrate'
  const seal = document.createElement('div')
  seal.className = 'seal'
  seal.setAttribute('role', 'img')
  seal.setAttribute('aria-label', t.seal)
  seal.innerHTML = sealArt
  const badge = document.createElement('strong')
  badge.className = 'badge'
  badge.textContent = t.seal
  lesson.prepend(seal, badge)
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
}

function teacherPanel() {
  document.body.classList.add('teacher')
  document.querySelector('.edition')!.textContent = 'Espacio docente'
  screen('Cuaderno de clase', 'Seguimiento del progreso · Clase DEMO-01')
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
      status.textContent = 'El progreso sigue guardado. ' +
        (error instanceof Error ? error.message : '') + ' Puedes volver a enviarlo.'
    } finally {
      submit.disabled = false
    }
  })
  button('Actualizar contadores', refresh)
  lesson.append(status, totals)
  void refresh()
}

const reviewRoute = location.pathname === '/revision'
const technicalPreview = reviewRoute && import.meta.env.MODE === 'revision'
if (technicalPreview) {
  document.querySelector('.edition')!.textContent = 'Revisión técnica'
  document.querySelector('footer')!.textContent = 'Ejemplo técnico en borrador · Solo para pruebas del equipo.'
}
if (location.pathname === '/docente') teacherPanel()
else if (reviewRoute && !technicalPreview) screen('Página no disponible')
else if (technicalPreview) {
  pack = demo
  choose()
} else {
  const id = new URLSearchParams(location.search).get('pack') ?? 'alimentacion-andes-es'
  screen('Buscando material de clase…')
  database.then(db => loadPack(db, id)).then(downloaded => {
    if (!downloaded) return screen('No hay material aprobado para este paquete.')
    pack = downloaded
    document.documentElement.lang = pack.language
    if (pack.language === 'en') t = texts.en
    document.querySelector('.edition')!.textContent = t.edition
    document.querySelector('.map-copy small')!.textContent = t.expedition
    document.querySelector('footer')!.textContent = t.footer
    document.querySelector('.map-copy h2')!.textContent = pack.title
    document.querySelector('.map-copy p')!.textContent = pack.context.country
    choose()
  }).catch(error => {
    screen('Paquete no disponible', error instanceof Error ? error.message : '')
    button('Volver a intentar', () => location.reload())
  })
}
database.catch(storageError)
