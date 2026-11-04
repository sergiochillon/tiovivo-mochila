import pack from './demo.json'
import './style.css'
import fox from './zorro.svg'
import bird from './colibri.svg'
const avatars = [
  { id: 'zorro', label: 'Zorro', portrait: fox },
  { id: 'colibri', label: 'Colibrí', portrait: bird }
] as const

const lesson = document.querySelector<HTMLElement>('#lesson')!
const choice = pack.modules.flatMap(module => module.activities).find(item => item.type === 'choice')
if (!choice?.options || typeof choice.correct !== 'string') throw new Error('Falta la actividad de elección del ejemplo')
const activity = { ...choice, options: choice.options, correct: choice.correct }
type Avatar = typeof avatars[number]
interface Progress {
  eventId: string
  avatarId: Avatar['id']
  packId: string
  activityId: string
  result: 'correct'
  type: 'activity_completed'
  ts: string
  classCode: string
}

const database = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('mochila-aula', 2)
  request.onupgradeneeded = event => {
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
  for (const avatar of avatars) {
    const card = button(avatar.label, () => play(avatar))
    card.className = 'avatar'
    const portrait = new Image()
    portrait.src = avatar.portrait
    portrait.alt = ''
    card.prepend(portrait)
  }
}

async function play(avatar: Avatar) {
  const db = await database
  const key = [avatar.id, pack.id, activity.id]
  const saved = await new Promise<Progress | undefined>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  if (saved) return complete(avatar)
  screen(activity.prompt, avatar.label + ' · Elige qué añadir al plato.')
  const hint = document.createElement('p')
  activity.options.forEach(option => {
    const answer = button(option.text, async () => {
    if (option.id !== activity.correct) {
      hint.textContent = 'Busca el plato con más colores. Puedes volver a elegir.'
      return
    }
    const event: Progress = {
      eventId: crypto.randomUUID(), avatarId: avatar.id, packId: pack.id,
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
  screen('¡Buen trabajo, ' + avatar.label + '!', activity.feedback)
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
