import pack from './demo.json'
import './style.css'
import fox from './zorro.svg'
import bird from './colibri.svg'
const portraits = { Zorro: fox, Colibrí: bird }

const lesson = document.querySelector<HTMLElement>('#lesson')!
const choice = pack.modules.flatMap(module => module.activities).find(item => item.type === 'choice')
if (!choice?.options || typeof choice.correct !== 'string') throw new Error('Falta la actividad de elección del ejemplo')
const activity = { ...choice, options: choice.options, correct: choice.correct }
type Avatar = 'Zorro' | 'Colibrí'
interface Progress {
  eventId: string
  avatarId: Avatar
  packId: string
  activityId: string
  result: 'correct'
  type: 'activity_completed'
  ts: string
  classCode: string
}

const database = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('mochila-aula', 1)
  request.onupgradeneeded = () => request.result.createObjectStore('progress')
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

function screen(title: string, message = '') {
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
  for (const avatar of ['Zorro', 'Colibrí'] as const) {
    const card = button(avatar, () => play(avatar))
    card.className = 'avatar'
    const portrait = new Image()
    portrait.src = portraits[avatar]
    portrait.alt = ''
    card.prepend(portrait)
  }
}

async function play(avatar: Avatar) {
  const db = await database
  const key = [avatar, pack.id, activity.id]
  const saved = await new Promise<Progress | undefined>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  if (saved) return complete(avatar)
  screen(activity.prompt, avatar + ' · Elige qué añadir al plato.')
  const hint = document.createElement('p')
  activity.options.forEach(option => {
    const answer = button(option.text, async () => {
    if (option.id !== activity.correct) {
      hint.textContent = 'Busca el plato con más colores. Puedes volver a elegir.'
      return
    }
    const event: Progress = {
      eventId: crypto.randomUUID(), avatarId: avatar, packId: pack.id,
      activityId: activity.id, result: 'correct', type: 'activity_completed',
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
    complete(avatar)
    })
    const food = document.createElement('span')
    food.setAttribute('aria-hidden', 'true')
    food.textContent = ('icon' in option && option.icon) || ''
    answer.prepend(food)
  })
  lesson.append(hint)
  button('Cambiar de avatar', choose)
}

function complete(avatar: Avatar) {
  screen('¡Buen trabajo, ' + avatar + '!', activity.feedback)
  const badge = document.createElement('strong')
  badge.className = 'badge'
  badge.textContent = '★  Actividad completada'
  lesson.prepend(badge)
  button('Cambiar de avatar', choose)
}

const technicalPreview = location.pathname === '/revision'
if (technicalPreview) {
  document.querySelector('header')!.append(' · Revisión técnica')
  document.querySelector('footer')!.textContent = 'Ejemplo técnico en borrador · Solo para pruebas del equipo.'
}
if (pack.review.status === 'approved' || technicalPreview) choose()
else screen('Este material está pendiente de revisión')
database.catch(storageError)
