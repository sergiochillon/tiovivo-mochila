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
  text.textContent = 'Tus sellos: ' + done + ' de ' + total
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
  screen('No se puede acceder al progreso', 'Comprueba que el navegador permite guardar datos y vuelve a intentarlo.')
  button('Volver a intentar', () => location.reload())
}

function choose() {
  screen('¿Quién va contigo?', 'Elige un compañero para explorar el valle.')
  for (const avatar of avatars) {
    const card = button(avatar.label, () => activities(avatar))
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
  screen('Actividades', 'Vas con ' + avatar.label + '. Toca una actividad para empezar.')
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
    label.textContent = kinds[item.type].label + (item === next ? ' · Siguiente' : '')
    const title = document.createElement('span')
    title.className = 'activity-title'
    title.textContent = item.prompt
    text.append(label, title)
    const end = finished ? icon(checkIcon, 'status') : document.createElement('span')
    if (finished) {
      const state = document.createElement('span')
      state.className = 'sr-only'
      state.textContent = 'Completada'
      text.append(state)
    } else if (item === next) {
      end.className = 'pill'
      end.textContent = 'Empezar'
    } else {
      end.className = 'time'
      end.textContent = item.durationMin ? item.durationMin + ' min' : ''
    }
    card.append(icon(kinds[item.type].icon, 'tile'), text, end)
    list.append(card)
  }
  lesson.append(list)
  button('Cambiar de avatar', choose).classList.add('secondary')
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
  screen(activity.prompt, kinds[activity.type]?.label ?? '')
  if (!technicalPreview) {
    const back = document.createElement('button')
    back.className = 'back'
    back.textContent = '← Actividades'
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
    button('Continuar', finish)
  } else if (activity.type === 'order') {
    const sequence = activity.correct
    if (!Array.isArray(sequence) || sequence.length !== options.length ||
        new Set(sequence).size !== options.length || !options.every(option => sequence.includes(option.id))) {
      screen('Esta actividad necesita revisión.')
      button('Volver', () => activities(avatar))
      return
    }
    let step = 0
    const ordered = sequence.map(id => options.find(option => option.id === id)!)
    // Present the steps out of order, including when the package lists them in solution order.
    const shown = [...ordered.slice(1), ordered[0]]
    const slots = document.createElement('ol')
    slots.className = 'slots'
    slots.setAttribute('aria-label', 'Tu orden')
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
    hint.textContent = '¿Cuál es el primer paso?'
    for (const option of shown) {
      const answer = button(option.text, async () => {
        if (option.id !== sequence[step]) {
          hint.textContent = 'Ese no va ahora. Prueba otro paso.'
          return
        }
        slotText[step].textContent = option.text
        slotText[step].parentElement!.classList.add('filled')
        step++
        answer.disabled = true
        if (step === sequence.length) await finish()
        else hint.textContent = '¡Bien! ¿Cuál va después?'
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
          hint.textContent = option.feedback || 'Puedes volver a elegir.'
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
  if (technicalPreview) button('Cambiar de avatar', choose)
}

async function complete(avatar: Avatar, activity: Activity) {
  screen('¡Buen trabajo, ' + avatar.label + '!', activity.feedback)
  lesson.className = 'celebrate'
  const seal = document.createElement('div')
  seal.className = 'seal'
  seal.setAttribute('role', 'img')
  seal.setAttribute('aria-label', 'Sello del valle')
  seal.innerHTML = sealArt
  const badge = document.createElement('strong')
  badge.className = 'badge'
  badge.textContent = 'Sello del valle'
  lesson.prepend(seal, badge)
  if (technicalPreview) {
    button('Cambiar de avatar', choose)
    return
  }
  const items = pack.modules.flatMap(module => module.activities).filter(playable)
  const done = await completedIds(avatar)
  lesson.append(seals(items.filter(item => done.has(item.id)).length, items.length))
  const next = items.find(item => !done.has(item.id))
  if (next) button('Siguiente actividad', () => play(avatar, next))
  const all = button('Ver todas las actividades', () => activities(avatar))
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
    document.querySelector('.map-copy h2')!.textContent = pack.title
    document.querySelector('.map-copy p')!.textContent = pack.context.country
    choose()
  }).catch(error => {
    screen('Paquete no disponible', error instanceof Error ? error.message : '')
    button('Volver a intentar', () => location.reload())
  })
}
database.catch(storageError)
