import { draftErrors } from './packs'

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

function instructions(context: Record<string, string>) {
  const language = context.language === 'en' ? 'inglés' : 'español'
  return [
    'Eres un asistente que adapta actividades educativas de habilidades para la vida para niñas y niños de 6 a 10 años que pueden usarlas sin conexión.',
    '',
    'Contexto de la comunidad:',
    '- País: ' + context.country,
    '- Región: ' + context.region,
    '- Tipo de comunidad: ' + context.community,
    '- Alimentos locales y asequibles: ' + context.foods,
    '- Recursos disponibles: ' + (context.resources || 'no indicados'),
    '- Idioma de los textos para el niño: ' + language,
    '',
    'Tema: alimentación cotidiana con lo que hay disponible, higiene antes de comer y pedir ayuda a una persona adulta de confianza.',
    '',
    'Reglas obligatorias:',
    '- Una idea y una acción por actividad; frases cortas y palabras cotidianas.',
    '- Tono cálido y sin juicio: no avergonzar, asustar ni culpabilizar; no etiquetar comidas como buenas o malas; sin promesas médicas.',
    '- 2–4 opciones cortas y claras; feedback breve que anime.',
    '- No asumir internet, electricidad, nevera, dinero ni alimentos que no estén en el contexto.',
    '- No inventar datos culturales: si falta información, escribe "A VALIDAR" en context.culturalNotes.',
    '- El niño solo elige entre respuestas cerradas: no pedir nombre, ubicación, texto libre, fotos ni voz; no inferir emociones.',
    '- Sin temas de abuso, violencia, armas, sustancias ni dietas terapéuticas.',
    '- Es un borrador: no afirmes que está validado ni aprobado.',
    '',
    'Devuelve SOLO un objeto JSON válido (sin texto alrededor) con esta forma exacta:',
    '{',
    '  "packVersion": "0.1",',
    '  "id": "identificador-en-minusculas-con-guiones",',
    '  "title": "título corto",',
    '  "language": "' + (context.language === 'en' ? 'en' : 'es') + '",',
    '  "context": { "country": "...", "region": "...", "communityType": "...", "foods": ["..."], "resources": ["..."], "culturalNotes": ["..."], "ageRange": "6-10" },',
    '  "review": { "status": "draft" },',
    '  "modules": [ { "id": "food", "topic": "food", "title": "...", "activities": [ ... ] } ]',
    '}',
    '',
    'Incluye 5 actividades, en este orden: "story", "choice", "order", "scenario" (pedir ayuda a una persona adulta) y "scenario" (seguridad al cocinar).',
    'Cada actividad: { "id": "minusculas-con-guiones", "type": "...", "prompt": "máx. 400 caracteres", "options": [ { "id": "...", "text": "..." } ], "correct": "id de la opción correcta" (en "order", la lista de ids en el orden correcto; "story" no lleva options ni correct), "feedback": "máx. 300 caracteres", "safetyTag": uno de "none", "hygiene", "food-safety", "help-adult", "emotion-self-choice", "privacy", "durationMin": número entre 1 y 10 }.',
    'No añadas campos que no estén en esta forma.'
  ].join('\n')
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

  // 1 · Context and instructions for the AI
  const one = step(1, 'Describe la comunidad', 'Con estos datos MOCHILA prepara las instrucciones para el asistente de IA que uses. MOCHILA no envía nada a ningún servicio de IA.')
  const country = input('', 'p. ej. Uganda')
  const region = input('', 'p. ej. Norte de Uganda')
  const community = input('', 'p. ej. comunidad rural')
  const foods = input('', 'p. ej. mijo, sorgo, yuca, frijoles, hojas verdes')
  const resources = input('', 'p. ej. huerto familiar, pozo comunitario')
  const language = element('select')
  for (const [value, label] of [['es', 'Español'], ['en', 'Inglés']]) {
    const option = element('option', '', label)
    option.value = value
    language.append(option)
  }
  const grid = element('div', 'field-grid')
  grid.append(field('País', country), field('Región', region), field('Tipo de comunidad', community),
    field('Idioma para el niño', language), field('Alimentos locales', foods, 'Separados por comas.'), field('Recursos disponibles', resources))
  const prompt = area('', 10)
  prompt.readOnly = true
  const promptBox = element('div', 'prompt-box')
  promptBox.hidden = true
  const copied = element('p', 'notice ok')
  copied.hidden = true
  const copy = action('Copiar instrucciones', async () => {
    try {
      await navigator.clipboard.writeText(prompt.value)
      messages(copied, 'ok', ['Copiado. Pégalo en tu asistente de IA y copia aquí su respuesta.'])
    } catch {
      prompt.select()
      messages(copied, 'ok', ['Selecciona el texto y cópialo manualmente.'])
    }
  }, true)
  promptBox.append(field('Instrucciones para la IA', prompt), copy, copied)
  const contextError = element('div')
  contextError.hidden = true
  one.append(grid, action('Preparar instrucciones', () => {
    const missing = [[country, 'país'], [region, 'región'], [community, 'tipo de comunidad'], [foods, 'alimentos']]
      .filter(([control]) => !(control as HTMLInputElement).value.trim()).map(([, name]) => name as string)
    if (missing.length) return messages(contextError, 'error', ['Falta: ' + missing.join(', ') + '.'])
    messages(contextError, 'error', [])
    prompt.value = instructions({
      country: country.value.trim(), region: region.value.trim(), community: community.value.trim(),
      foods: foods.value.trim(), resources: resources.value.trim(), language: language.value
    })
    promptBox.hidden = false
  }), contextError, promptBox)

  // 2 · Paste the AI answer
  const two = step(2, 'Pega la propuesta de la IA', 'MOCHILA comprueba que cumple el formato y las reglas antes de guardarla como borrador.')
  const pasted = area('', 8)
  pasted.placeholder = 'Pega aquí el JSON que devuelve la IA'
  const pasteResult = element('div')
  pasteResult.hidden = true
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
  }), pasteResult)

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
    draft = data.pack as Draft
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
      approved.replaceChildren(element('strong', '', 'Aprobado por ' + String(data.reviewedBy) + ' · ' + when),
        element('p', '', 'El paquete ya está disponible para el alumnado. Abre la app con conexión una vez en cada dispositivo para guardarlo y usarlo sin red.'), open)
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
