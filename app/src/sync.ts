const classCode = 'DEMO-01'
const api = import.meta.env.VITE_API_BASE_URL || '/api'

export interface Progress {
  eventId: string
  avatarId: string
  packId: string
  activityId: string
  result: 'correct' | 'completed'
  type: 'activity_completed'
  ts: string
  classCode: string
  sent?: boolean
}

function count(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

export async function sendProgress(db: IDBDatabase): Promise<string> {
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
    signal: AbortSignal.timeout(10000)
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

export async function classTotals() {
  const response = await fetch(api + '/progress/' + classCode, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (response.status !== 200) throw new Error('No se pudo consultar el panel')
  const data = await response.json()
  if (data?.classCode !== classCode || !count(data.eventsReceived) ||
      !count(data.activitiesCompleted)) throw new Error('Respuesta del panel inválida')
  return { eventsReceived: data.eventsReceived as number, activitiesCompleted: data.activitiesCompleted as number }
}
