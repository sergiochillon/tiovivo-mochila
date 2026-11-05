import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import schema from '../../contracts/pack-v0.1.schema.json'

export interface Activity {
  id: string
  type: string
  prompt: string
  audioText?: string
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

function savePack(db: IDBDatabase, id: string, pack: Pack) {
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('packs', 'readwrite')
    tx.objectStore('packs').put(pack, id)
    tx.oncomplete = () => resolve()
    tx.onabort = () => reject(tx.error)
  })
}

function savedPack(db: IDBDatabase, id: string) {
  return new Promise<Pack | undefined>((resolve, reject) => {
    const request = db.transaction('packs').objectStore('packs').get(id)
    request.onsuccess = () => resolve(approved(request.result, id) ? request.result : undefined)
    request.onerror = () => reject(request.error)
  })
}

/** Approved packages the server offers now (GET /api/packs). Empty when offline or on any error. */
export async function approvedCatalog(): Promise<Pack[]> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  try {
    const response = await fetch(base + '/packs', { cache: 'no-store', signal: AbortSignal.timeout(5000) })
    if (response.status !== 200) return []
    const data: unknown = await response.json()
    const list = typeof data === 'object' && data !== null && Array.isArray((data as { packs?: unknown }).packs)
      ? (data as { packs: unknown[] }).packs : []
    return list.filter((item): item is Pack =>
      typeof item === 'object' && item !== null && approved(item, String((item as { id?: unknown }).id)))
  } catch {
    return []
  }
}

/**
 * Offline first: the copy already on the device wins over any server answer that is not a valid
 * approved package. A 404, a 5xx, broken JSON, an invalid package or no network never erase or
 * hide a copy that was approved and downloaded before; only a newer approved package replaces it.
 * Returns undefined when the server has no approved package and the device has no copy either.
 */
export async function loadPack(db: IDBDatabase, id: string): Promise<Pack | undefined> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  let fresh: Pack | undefined
  let notApproved = false
  try {
    const response = await fetch(base + '/packs/' + encodeURIComponent(id), {
      cache: 'no-store', signal: AbortSignal.timeout(6000)
    })
    if (response.status === 404) notApproved = true
    else if (response.status === 200) {
      // The server answered: if its package is unreadable or not approved, there is nothing for the child.
      notApproved = true
      const data: unknown = await response.json()
      if (approved(data, id)) fresh = data
    }
  } catch {
    // No network, timeout or unreadable answer: fall back to the saved copy below.
  }
  if (fresh) {
    await savePack(db, id, fresh)
    return fresh
  }
  const saved = await savedPack(db, id)
  if (saved) return saved
  if (notApproved) return undefined
  throw new Error('Conéctate para descargar este paquete por primera vez.')
}
