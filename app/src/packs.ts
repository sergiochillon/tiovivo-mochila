import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import schema from '../../contracts/pack-v0.1.schema.json'

export interface Activity {
  id: string
  type: string
  prompt: string
  feedback: string
  options?: { id: string; text: string; icon?: string; feedback?: string }[]
  correct?: string | string[]
}
export interface Pack {
  id: string
  title: string
  language: string
  context: { country: string; region: string }
  review: { status: string }
  modules: { title: string; activities: Activity[] }[]
}
const validator = new Ajv2020()
addFormats(validator)
const valid = validator.compile<Pack>(schema)
function approved(value: unknown, id: string): value is Pack {
  return valid(value) && value.id === id && value.review.status === 'approved'
}

async function updateCache(db: IDBDatabase, id: string, pack?: Pack) {
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('packs', 'readwrite')
    const store = tx.objectStore('packs')
    if (pack) store.put(pack, id)
    else store.delete(id)
    tx.oncomplete = () => resolve()
    tx.onabort = () => reject(tx.error)
  })
}

export async function loadPack(db: IDBDatabase, id: string): Promise<Pack | undefined> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  let response: Response
  try {
    response = await fetch(base + '/packs/' + encodeURIComponent(id), {
      cache: 'no-store', signal: AbortSignal.timeout(6000)
    })
    if (response.status >= 500) throw new Error('Servidor no disponible')
  } catch {
    const cached = await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction('packs').objectStore('packs').get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    if (approved(cached, id)) return cached
    throw new Error('Conéctate para descargar este paquete por primera vez.')
  }
  const data: unknown = response.status === 200 ? await response.json() : undefined
  if (!approved(data, id)) {
    await updateCache(db, id)
    return undefined
  }
  await updateCache(db, id, data)
  return data
}
