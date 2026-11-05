import { timeoutSignal } from './net'

const classCode = 'DEMO-01'
const api = import.meta.env.VITE_API_BASE_URL || '/api'

export interface Progress {
  eventId: string
  avatarId: string
  packId: string
  activityId: string
  result: 'correct' | 'completed' | 'incorrect'
  attempts?: number
  type: 'activity_completed'
  ts: string
  classCode: string
  sent?: boolean
}

function count(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

// One send at a time: the online event, the start-up send and the teacher's button can coincide.
let sending: Promise<string> | undefined

export function sendProgress(db: IDBDatabase): Promise<string> {
  sending ??= sendPending(db).finally(() => { sending = undefined })
  return sending
}

async function sendPending(db: IDBDatabase): Promise<string> {
  const records = await new Promise<Progress[]>((resolve, reject) => {
    const request = db.transaction('progress').objectStore('progress').getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  const pending = records.filter(record => !record.sent && record.classCode === classCode)
  if (!pending.length) return 'Todo el progreso está enviado.'
  const events = pending.map(({ sent, ...event }) => event)
  const response = await fetch(api + '/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classCode, events }),
    signal: timeoutSignal(10000)
  })
  if (response.status !== 200) throw new Error('Respuesta del servidor: ' + response.status)
  const ack = await response.json()
  if (!count(ack?.accepted) || !count(ack?.alreadyPresent) ||
      ack.accepted + ack.alreadyPresent !== events.length) throw new Error('Confirmación incompleta')
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('progress', 'readwrite')
    const store = tx.objectStore('progress')
    for (const event of pending) {
      store.put({ ...event, sent: true }, [event.avatarId, event.packId, event.activityId])
    }
    tx.oncomplete = () => resolve()
    tx.onabort = () => reject(tx.error)
  })
  return 'Progreso enviado. Eventos confirmados: ' + events.length + '.'
}

export interface ExplorerResult {
  avatarId: string; done: number; firstTry: number; withHelp: number; failed: number
  results: { packId: string; packTitle: string; activityId: string; activity: string; result: string; attempts: number; ts: string }[]
}

/** Per-explorer results of the class (pseudonymous avatars only), latest try of each activity. */
export async function classResults(): Promise<ExplorerResult[]> {
  const response = await fetch(api + '/progress/' + classCode + '/detail', { cache: 'no-store', signal: timeoutSignal(8000) })
  if (response.status !== 200) throw new Error('No se pudieron consultar los resultados')
  const data = await response.json()
  return Array.isArray(data?.explorers) ? data.explorers as ExplorerResult[] : []
}

export async function classTotals() {
  const response = await fetch(api + '/progress/' + classCode, { cache: 'no-store', signal: timeoutSignal(8000) })
  if (response.status !== 200) throw new Error('No se pudo consultar el panel')
  const data = await response.json()
  if (data?.classCode !== classCode || !count(data.eventsReceived) ||
      !count(data.activitiesCompleted)) throw new Error('Respuesta del panel inválida')
  return { eventsReceived: data.eventsReceived as number, activitiesCompleted: data.activitiesCompleted as number }
}
