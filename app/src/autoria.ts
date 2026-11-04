import { approved as isApprovedPack, draftErrors } from './packs'

// Authoring runs on the teacher's computer, with a connection to the MOCHILA server.
// MOCHILA never sends anything to an AI provider: the teacher copies the instructions
// into the assistant they already use and pastes the answer back (assisted generation, ADR-002).
const api = import.meta.env.VITE_API_BASE_URL || '/api'

type Option = { id: string; text: string }
type DraftActivity = { id: string; type: string; prompt: string; feedback: string; options?: Option[]; safetyTag: string; teacherNotes?: string }
type Draft = {
  id: string; title: string; language: string
  review: { status: string; [key: string]: unknown }
  modules: { title: string; activities: DraftActivity[] }[]
  [key: string]: unknown
}

const kindLabels: Record<string, string> = { story: 'Historia', choice: 'Elige', order: 'Ordena', scenario: '¿Qué harías?' }
const checklist = [
  'He leído el paquete completo y cada actividad enseña una sola idea.',
  'El vocabulario y la longitud son adecuados para 6–10 años.',
  'Las opciones son claras y el feedback es amable, sin culpabilizar.',
  'Alimentos, recursos e idioma están revisados o marcados como pendientes de validación local.',
  'No hay estereotipos ni se atribuyen las mismas prácticas a toda una comunidad.',
  'No pide datos personales, texto libre, fotos ni voz, y las acciones son seguras.'
]

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function field(label: string, control: HTMLElement, help = '') {
  const wrapper = element('label', 'field')
  wrapper.append(element('span', 'field-label', label), control)
  if (help) wrapper.append(element('small', 'field-help', help))
  return wrapper
}

function input(value = '', placeholder = '') {
  const control = element('input')
  control.value = value
  control.placeholder = placeholder
  return control
}

function area(value = '', rows = 3) {
  const control = element('textarea')
  control.value = value
  control.rows = rows
  return control
}

function action(label: string, handler: () => void | Promise<void>, secondary = false) {
  const control = element('button', secondary ? 'secondary' : '', label)
  control.type = 'button'
  control.onclick = async () => {
    control.disabled = true
    try { await handler() } finally { control.disabled = false }
  }
  return control
}

function step(number: number, title: string, help: string) {
  const section = element('section', 'author-step')
  const heading = element('h2')
  heading.append(element('b', 'step-number', String(number)), title)
  section.append(heading, element('p', 'step-help', help))
  return section
}

function messages(target: HTMLElement, kind: 'ok' | 'error', lines: string[]) {
  target.className = 'notice ' + kind
  target.replaceChildren(...lines.map(line => element('p', '', line)))
  target.hidden = lines.length === 0
}

function cleanPaste(text: string) {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}

async function send(path: string, body: unknown) {
  const response = await fetch(api + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  })
  const data = await response.json().catch(() => ({}))
  return { status: response.status, data: data as Record<string, unknown> }
}

function serverLines(data: Record<string, unknown>) {
  const details = Array.isArray(data.details) ? data.details.map(String) : []
  if (data.error === 'pack_already_approved') return ['Ya existe un paquete aprobado con este identificador. Cambia el "id" para crear uno nuevo.']
  if (data.error === 'pack_not_draft') return ['Este paquete ya estaba aprobado.']
  return details.length ? details.slice(0, 8) : ['El servidor no aceptó el borrador (' + String(data.error ?? 'error') + ').']
}

export function authoring(lesson: HTMLElement) {
  let draft: Draft | null = null
  lesson.className = 'authoring'
  const heading = element('h1', '', 'Preparar material')
  heading.tabIndex = -1
  const intro = element('p', '', 'Adapta el módulo de alimentación a otra comunidad con ayuda de la IA. Nada llega al alumnado hasta que una persona lo revisa y lo aprueba.')
  lesson.replaceChildren(heading, intro)
  heading.focus()

  // 1 · Context, then either generate on the server or copy the instructions
  const one = step(1, 'Describe la comunidad', 'Con estos datos MOCHILA pide a la IA una propuesta adaptada, o te prepara las instrucciones para el asistente que uses. Envía solo estos datos de contexto, nunca datos de alumnos.')
  const country = input('', 'p. ej. Uganda')
  const region = input('', 'p. ej. Norte de Uganda')
  const foods = input('', 'p. ej. mijo, sorgo, yuca, frijoles, hojas verdes')
  const language = element('select')
  for (const [value, label] of [['es', 'Español'], ['en', 'Inglés']]) {
    const option = element('option', '', label)
    option.value = value
    language.append(option)
  }
  const grid = element('div', 'field-grid')
  grid.append(field('País', country), field('Región', region), field('Idioma para el niño', language),
    field('Alimentos locales', foods, 'Separados por comas (máximo 12).'))
  const contextResult = element('div')
  contextResult.hidden = true
  function context() {
    const list = foods.value.split(',').map(food => food.trim()).filter(Boolean)
    const missing = [[country.value, 'país'], [region.value, 'región']].filter(([value]) => !value.trim()).map(([, name]) => name)
    if (!list.length) missing.push('alimentos')
    if (missing.length) { messages(contextResult, 'error', ['Falta: ' + missing.join(', ') + '.']); return null }
    if (list.length > 12) { messages(contextResult, 'error', ['Indica como máximo 12 alimentos.']); return null }
    messages(contextResult, 'error', [])
    return { country: country.value.trim(), region: region.value.trim(), language: language.value, foods: list }
  }
  const prompt = area('', 10)
  prompt.readOnly = true
  const promptBox = element('div', 'prompt-box')
  promptBox.hidden = true
  const copied = element('p', 'notice ok')
  copied.hidden = true
  const copy = action('Copiar instrucciones', async () => {
    try {
      await navigator.clipboard.writeText(prompt.value)
      messages(copied, 'ok', ['Copiado. Pégalo en tu asistente de IA y copia su respuesta en el paso 2.'])
    } catch {
      prompt.select()
      messages(copied, 'ok', ['Selecciona el texto y cópialo manualmente.'])
    }
  }, true)
  promptBox.append(field('Instrucciones para la IA', prompt), copy, copied)
  const generate = action('Generar propuesta con IA', async () => {
    const data = context()
    if (!data) return
    messages(contextResult, 'ok', ['Pidiendo la propuesta a la IA… puede tardar hasta un minuto.'])
    try {
      const { status, data: body } = await send('/generate/ai', { context: data })
      if (status === 201 || status === 200) {
        draft = body.pack as Draft
        messages(contextResult, 'ok', ['Propuesta generada con IA y guardada como borrador: «' + draft.title + '». Revísala en el paso 3.'])
        renderReview()
      } else if (body.error === 'ai_not_configured') {
        messages(contextResult, 'error', ['La IA no está configurada en este servidor. Usa «Preparar instrucciones», pégalas en tu asistente de IA y trae la respuesta al paso 2.'])
      } else {
        const details = Array.isArray(body.details) ? body.details.map(String).slice(0, 6) : []
        messages(contextResult, 'error', ['La IA no devolvió una propuesta válida. Prueba otra vez o usa «Preparar instrucciones».', ...details])
      }
    } catch {
      messages(contextResult, 'error', ['No hay conexión con el servidor de MOCHILA. La preparación de material necesita conexión.'])
    }
  })
  const prepare = action('Preparar instrucciones', async () => {
    const data = context()
    if (!data) return
    const query = new URLSearchParams({ country: data.country, region: data.region, language: data.language })
    for (const food of data.foods) query.append('foods', food)
    try {
      const response = await fetch(api + '/prompt?' + query.toString())
      const body = await response.json().catch(() => ({})) as Record<string, unknown>
      if (response.status !== 200 || typeof body.prompt !== 'string') return messages(contextResult, 'error', serverLines(body))
      prompt.value = body.prompt
      promptBox.hidden = false
    } catch {
      messages(contextResult, 'error', ['No hay conexión con el servidor de MOCHILA.'])
    }
  }, true)
  one.append(grid, generate, prepare, contextResult, promptBox)

  // 2 · Paste the AI answer
  const two = step(2, 'O pega la propuesta de tu asistente de IA', 'MOCHILA comprueba que cumple el formato y las reglas antes de guardarla como borrador.')
  const pasted = area('', 8)
  pasted.placeholder = 'Pega aquí el JSON que devuelve la IA'
  const pasteResult = element('div')
  pasteResult.hidden = true
  const draftId = input('', 'p. ej. demo-generado-…')
  const reopen = action('Abrir borrador guardado', async () => {
    if (!draftId.value.trim()) return messages(pasteResult, 'error', ['Escribe el identificador del borrador.'])
    try {
      const response = await fetch(api + '/drafts/' + encodeURIComponent(draftId.value.trim()))
      if (response.status !== 200) return messages(pasteResult, 'error', ['No hay ningún borrador con ese identificador (los aprobados no se pueden editar).'])
      draft = await response.json() as Draft
      messages(pasteResult, 'ok', ['Borrador abierto: «' + draft.title + '». Revísalo en el paso 3.'])
      renderReview()
    } catch { messages(pasteResult, 'error', ['No hay conexión con el servidor de MOCHILA.']) }
  }, true)
  two.append(field('Respuesta de la IA', pasted), action('Comprobar borrador', async () => {
    let value: unknown
    try { value = JSON.parse(cleanPaste(pasted.value)) } catch {
      return messages(pasteResult, 'error', ['No es un JSON válido. Copia solo el objeto JSON que devuelve la IA.'])
    }
    if (value && typeof value === 'object') (value as Draft).review = { status: 'draft' }
    const errors = draftErrors(value)
    if (errors.length) return messages(pasteResult, 'error', ['El borrador no cumple el formato:', ...errors])
    try {
      const { status, data } = await send('/generate', { pack: value })
      if (status !== 200) return messages(pasteResult, 'error', serverLines(data))
      draft = data.pack as Draft
      messages(pasteResult, 'ok', ['Borrador guardado: «' + draft.title + '». Revísalo en el paso 3.'])
      renderReview()
    } catch {
      messages(pasteResult, 'error', ['No hay conexión con el servidor de MOCHILA. La preparación de material necesita conexión.'])
    }
  }), field('¿Ya tienes un borrador guardado?', draftId, 'Por ejemplo, el que generó la IA antes de la demo.'), reopen, pasteResult)

  // 3 · Review and edit · 4 · Approve
  const three = step(3, 'Revisa y corrige', 'Corrige cualquier texto. Los cambios se guardan como borrador.')
  const four = step(4, 'Aprueba', 'Solo una persona puede aprobar. Al aprobar, el paquete queda disponible para el alumnado, también sin conexión.')
  three.hidden = true
  four.hidden = true
  const editors: { activity: DraftActivity; prompt: HTMLTextAreaElement; feedback: HTMLTextAreaElement; options: [Option, HTMLInputElement][] }[] = []
  const reviewList = element('div', 'review-list')
  const saveResult = element('div')
  saveResult.hidden = true

  function collect(): Draft {
    for (const editor of editors) {
      editor.activity.prompt = editor.prompt.value.trim()
      editor.activity.feedback = editor.feedback.value.trim()
      for (const [option, control] of editor.options) option.text = control.value.trim()
    }
    return draft!
  }

  async function save(target: HTMLElement) {
    const current = collect()
    const errors = draftErrors(current)
    if (errors.length) { messages(target, 'error', ['Hay campos que corregir:', ...errors]); return false }
    const { status, data } = await send('/generate', { pack: current })
    if (status !== 200) { messages(target, 'error', serverLines(data)); return false }
    // The editor controls still reference the activities in the current draft.
    return true
  }

  function renderReview() {
    editors.length = 0
    reviewList.replaceChildren()
    draft!.modules.forEach(module => module.activities.forEach((activity, index) => {
      const card = element('article', 'review-card')
      const top = element('div', 'review-top')
      top.append(element('small', '', (index + 1) + ' · ' + (kindLabels[activity.type] ?? activity.type)), element('span', 'chip', activity.safetyTag))
      const promptEditor = area(activity.prompt, 3)
      const feedbackEditor = area(activity.feedback, 2)
      card.append(top, field('Enunciado', promptEditor))
      const options: [Option, HTMLInputElement][] = (activity.options ?? []).map(option => [option, input(option.text)])
      if (options.length) {
        const list = element('div', 'option-list')
        options.forEach(([, control], position) => list.append(field('Opción ' + (position + 1), control)))
        card.append(list)
      }
      card.append(field('Mensaje al terminar', feedbackEditor))
      if (activity.teacherNotes) card.append(element('p', 'teacher-note', 'Nota para el docente: ' + activity.teacherNotes))
      editors.push({ activity, prompt: promptEditor, feedback: feedbackEditor, options })
      reviewList.append(card)
    }))
    three.hidden = false
    four.hidden = false
    approved.hidden = true
    three.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  three.append(reviewList, action('Guardar cambios', async () => {
    try {
      if (await save(saveResult)) messages(saveResult, 'ok', ['Cambios guardados como borrador.'])
    } catch { messages(saveResult, 'error', ['No hay conexión con el servidor de MOCHILA.']) }
  }, true), saveResult)

  const checks = checklist.map(text => {
    const box = element('input')
    box.type = 'checkbox'
    const label = element('label', 'check')
    label.append(box, element('span', '', text))
    return { box, label }
  })
  const reviewer = input('', 'Nombre de la persona que revisa')
  const approveResult = element('div')
  approveResult.hidden = true
  const approved = element('div', 'approved')
  approved.hidden = true
  const approve = action('Aprobar y publicar para el alumnado', async () => {
    if (!checks.every(check => check.box.checked)) return messages(approveResult, 'error', ['Marca todos los puntos de la revisión.'])
    if (!reviewer.value.trim()) return messages(approveResult, 'error', ['Escribe el nombre de la persona que revisa.'])
    try {
      if (!(await save(approveResult))) return
      const { status, data } = await send('/review/approve', { packId: draft!.id, reviewer: reviewer.value.trim() })
      if (status !== 200) return messages(approveResult, 'error', serverLines(data))
      messages(approveResult, 'ok', [])
      approveResult.hidden = true
      const when = new Date(String(data.reviewedAt)).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
      const open = element('a', 'button-link', 'Abrir como alumno')
      open.href = '/alumno?pack=' + encodeURIComponent(draft!.id)
      const packId = draft!.id
      const download = action('Descargar paquete JSON', async () => {
        try {
          const response = await fetch(api + '/packs/' + encodeURIComponent(packId), { cache: 'no-store' })
          if (!response.ok) throw new Error()
          const pack: unknown = await response.json()
          if (!isApprovedPack(pack, packId)) throw new Error()
          const url = URL.createObjectURL(new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' }))
          const link = document.createElement('a')
          link.href = url
          link.download = packId + '.json'
          link.click()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
          approveResult.hidden = true
        } catch {
          messages(approveResult, 'error', ['No se pudo descargar el paquete aprobado. Comprueba la conexión y vuelve a intentarlo.'])
        }
      }, true)
      approved.replaceChildren(element('strong', '', 'Aprobado por ' + String(data.reviewedBy) + ' · ' + when),
        element('p', '', 'El paquete ya está disponible para el alumnado. Abre la app con conexión una vez en cada dispositivo para guardarlo y usarlo sin red.'), open, download)
      approved.hidden = false
    } catch { messages(approveResult, 'error', ['No hay conexión con el servidor de MOCHILA.']) }
  })
  const checkList = element('div', 'checklist')
  checkList.append(...checks.map(check => check.label))
  four.append(checkList, field('Revisado por', reviewer), approve, approveResult, approved)

  const back = element('a', 'button-link secondary-link', '← Cuaderno de clase')
  back.href = '/docente'
  lesson.append(one, two, three, four, back)
}
