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
  durationMin?: number
}
export interface Pack {
  id: string
  title: string
  language: string
  context: { country: string; region: string }
  review: { status: string }
  modules: { title: string; activities: Activity[] }[]
}
const validator = new Ajv2020({ allErrors: true })
addFormats(validator)
const valid = validator.compile<Pack>(schema)

function describePath(path: string) {
  const activity = path.match(/^\/modules\/(\d+)\/activities\/(\d+)(.*)$/)
  if (activity) {
    const rest = activity[3] ? ' › ' + activity[3].slice(1).replace(/\//g, ' › ') : ''
    return 'Actividad ' + (Number(activity[2]) + 1) + rest
  }
  return path ? path.slice(1).replace(/\//g, ' › ') : 'Paquete'
}

/** Errors of a draft against pack-v0.1, in short readable lines (empty when valid). */
export function draftErrors(value: unknown): string[] {
  if (valid(value)) return []
  return (valid.errors ?? []).slice(0, 8).map(error => {
    const params = error.params as Record<string, unknown>
    const reasons: Record<string, string> = {
      additionalProperties: 'tiene un campo que no está permitido («' + String(params.additionalProperty) + '»)',
      required: 'falta el campo «' + String(params.missingProperty) + '»',
      maxLength: 'el texto es demasiado largo (máximo ' + String(params.limit) + ' caracteres)',
      minLength: 'el texto está vacío o es demasiado corto',
      enum: 'el valor no está entre los permitidos',
      const: 'el valor no es el esperado',
      pattern: 'el identificador debe ir en minúsculas, con números y guiones',
      type: 'el tipo de dato no es correcto',
      minItems: 'la lista está vacía',
      maximum: 'el número es demasiado alto',
      minimum: 'el número es demasiado bajo'
    }
    return describePath(error.instancePath) + ': ' + (reasons[error.keyword] ?? error.message ?? 'valor no válido')
  })
}
export function approved(value: unknown, id: string): value is Pack {
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
    if (response.status !== 200 && response.status !== 404) {
      throw new Error('No se pudo actualizar el paquete.')
    }
  } catch {
    const cached = await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction('packs').objectStore('packs').get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    if (approved(cached, id)) return cached
    throw new Error('Conéctate para descargar este paquete por primera vez.')
  }
  if (response.status === 404) {
    await updateCache(db, id)
    return undefined
  }
  const data: unknown = await response.json()
  if (!approved(data, id)) return undefined
  await updateCache(db, id, data)
  return data
}
