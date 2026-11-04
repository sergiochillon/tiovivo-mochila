import { approved as isApprovedPack, draftErrors } from './packs'

// Authoring runs on the teacher's computer, with a connection to the MOCHILA server.
// MOCHILA never sends anything to an AI provider: the teacher copies the instructions
// into the assistant they already use and pastes the answer back (assisted generation, ADR-002).
const api = import.meta.env.VITE_API_BASE_URL || '/api'

type Option = { id: string; text: string }
type DraftActivity = { id: string; type: string; prompt: string; feedback: string; options?: Option[]; correct?: string | string[]; audioText?: string; safetyTag: string; teacherNotes?: string }
type Draft = {
  id: string; title: string; language: string
  review: { status: string; [key: string]: unknown }
  modules: { title: string; activities: DraftActivity[] }[]
  [key: string]: unknown
}

const kindLabels: Record<string, string> = { story: 'Historia', choice: 'Elige', order: 'Ordena', scenario: '¿Qué harías?', match: 'Parejas' }
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

const topicCards: [string, string, string, string][] = [
  ['food', '🥣', 'Alimentación', 'Comer con lo que hay cerca y asequible'],
  ['hygiene', '🧼', 'Higiene y salud', 'Manos, agua limpia, dientes'],
  ['help', '🙋', 'Pedir ayuda', 'Saber a qué persona adulta acudir'],
  ['emotions', '💛', 'Emociones', 'Nombrar lo que siento y calmarme'],
  ['coexistence', '🤝', 'Convivencia', 'Compartir, turnos y hablar en lugar de pelear'],
  ['safety', '🛡️', 'Seguridad', 'Fuego, cuchillos, caminos y agua'],
  ['autonomy', '🎒', 'Autonomía', 'Rutinas y pequeñas responsabilidades']
]
const presets: [string, string, string, string][] = [
  ['Perú · Andes', 'Perú', 'Andes rurales', 'es'],
  ['Uganda · Norte', 'Uganda', 'Norte de Uganda', 'en'],
  ['Bolivia · Altiplano', 'Bolivia', 'Altiplano', 'es'],
  ['Guatemala · Altiplano', 'Guatemala', 'Altiplano occidental', 'es']
]

export function authoring(lesson: HTMLElement) {
  let draft: Draft | null = null
  lesson.className = 'authoring'
  const heading = element('h1', '', 'Preparar material')
  heading.tabIndex = -1
  const intro = element('p', '', 'Elige un tema y describe la comunidad. La IA propone un módulo de juegos adaptado; tú lo revisas y lo apruebas. Nada llega al alumnado sin tu aprobación.')
  const roles = element('div', 'roles')
  for (const [title, text] of [
    ['✨ La IA propone', 'Adapta los juegos al lugar: idioma, alimentos, recursos y escenas cotidianas. Es solo un borrador.'],
    ['🧑‍🏫 Tú decides', 'Lees, corriges y apruebas con tu nombre. Sin tu aprobación no llega nada al alumnado.'],
    ['🎒 El alumnado recibe', 'Solo el paquete aprobado, que se guarda en la tablet y funciona sin conexión.']
  ]) {
    const card = element('div', 'role')
    card.append(element('strong', '', title), element('p', '', text))
    roles.append(card)
  }
  // Quick access to a draft prepared earlier (for example, the one generated before the demo).
  const reopenBar = element('div', 'reopen-bar')
  const draftId = input('', 'Identificador del borrador guardado')
  const reopenResult = element('div')
  reopenResult.hidden = true
  const reopen = action('Abrir borrador', async () => {
    if (!draftId.value.trim()) return messages(reopenResult, 'error', ['Escribe el identificador del borrador.'])
    try {
      const response = await fetch(api + '/drafts/' + encodeURIComponent(draftId.value.trim()))
      if (response.status !== 200) return messages(reopenResult, 'error', ['No hay ningún borrador con ese identificador (los aprobados no se pueden editar).'])
      draft = await response.json() as Draft
      messages(reopenResult, 'ok', ['Borrador abierto: «' + draft.title + '».'])
      renderReview()
    } catch { messages(reopenResult, 'error', ['No hay conexión con el servidor de MOCHILA.']) }
  }, true)
  reopenBar.append(element('span', 'reopen-label', '¿Ya tienes un borrador?'), draftId, reopen)
  lesson.replaceChildren(heading, intro, roles, reopenBar, reopenResult)
  heading.focus()

  // 1 · Topic and community
  const one = step(1, 'Tema y comunidad', 'MOCHILA envía a la IA solo estos datos de contexto, nunca datos de alumnos.')
  let topic = 'food'
  const topicGrid = element('div', 'topic-grid')
  const topicButtons = topicCards.map(([id, emoji, label, help]) => {
    const card = element('button', 'topic-card')
    card.type = 'button'
    card.setAttribute('aria-pressed', String(id === topic))
    card.append(element('span', 'topic-emoji', emoji), element('strong', '', label), element('small', '', help))
    card.onclick = () => {
      topic = id
      topicButtons.forEach(other => other.setAttribute('aria-pressed', String(other === card)))
      foodsField.hidden = id !== 'food'
    }
    topicGrid.append(card)
    return card
  })
  const country = input('', 'p. ej. Uganda')
  const region = input('', 'p. ej. Norte de Uganda')
  const community = input('', 'p. ej. aldea rural, barrio periurbano')
  const foods = input('', 'Déjalo vacío y la IA los propondrá')
  const resources = input('', 'p. ej. pozo comunitario, cocina de leña, mercado semanal')
  const language = element('select')
  for (const [value, label] of [['es', 'Español'], ['en', 'Inglés']]) {
    const option = element('option', '', label)
    option.value = value
    language.append(option)
  }
  const presetRow = element('div', 'preset-row')
  for (const [label, presetCountry, presetRegion, presetLanguage] of presets) {
    const chip = element('button', 'preset-chip', label)
    chip.type = 'button'
    chip.onclick = () => { country.value = presetCountry; region.value = presetRegion; language.value = presetLanguage }
    presetRow.append(chip)
  }
  const grid = element('div', 'field-grid')
  const foodsField = field('Alimentos locales (opcional)', foods, 'Si lo dejas vacío, la IA propone alimentos de la zona y los marca «A VALIDAR» para que los confirmes.')
  grid.append(field('País', country), field('Región', region), field('Idioma para el niño', language),
    field('Tipo de comunidad (opcional)', community), foodsField,
    field('Recursos disponibles (opcional)', resources, 'Separados por comas: agua, cocina, mercado, escuela…'))
  const contextResult = element('div')
  contextResult.hidden = true
  const split = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean)
  function context() {
    const list = topic === 'food' ? split(foods.value) : []
    const missing = [[country.value, 'país'], [region.value, 'región']].filter(([value]) => !value.trim()).map(([, name]) => name)
    if (missing.length) { messages(contextResult, 'error', ['Falta: ' + missing.join(', ') + '.']); return null }
    if (list.length > 12) { messages(contextResult, 'error', ['Indica como máximo 12 alimentos.']); return null }
    messages(contextResult, 'error', [])
    return {
      country: country.value.trim(), region: region.value.trim(), language: language.value, topic,
      foods: list, resources: split(resources.value).slice(0, 8), communityType: community.value.trim()
    }
  }
  const generate = action('✨ Generar propuesta con IA', async () => {
    const data = context()
    if (!data) return
    generate.classList.add('working')
    messages(contextResult, 'ok', ['La IA está preparando los juegos… puede tardar hasta un minuto.'])
    try {
      const { status, data: body } = await send('/generate/ai', { context: data })
      if (status === 201 || status === 200) {
        draft = body.pack as Draft
        messages(contextResult, 'ok', ['Propuesta lista: «' + draft.title + '». Identificador: ' + draft.id + '. Revísala abajo.'])
        renderReview()
      } else if (body.error === 'ai_not_configured') {
        messages(contextResult, 'error', ['La IA no está configurada en este servidor. Abre un borrador guardado o usa el plan B de abajo.'])
      } else if (body.error === 'ai_busy') {
        messages(contextResult, 'error', [body.reason === 'quota'
          ? 'Se ha agotado el uso gratuito de la IA por ahora. Abre un borrador guardado o usa el plan B de abajo.'
          : 'El servicio de IA está saturado en este momento (lo hemos intentado con varios modelos). Prueba en un rato, abre un borrador guardado o usa el plan B.'])
      } else {
        const details = Array.isArray(body.details) ? body.details.map(String).slice(0, 6) : []
        messages(contextResult, 'error', ['La IA devolvió una propuesta que no cumple las reglas. Prueba otra vez o usa el plan B.', ...details])
      }
    } catch {
      messages(contextResult, 'error', ['No hay conexión con el servidor de MOCHILA. La preparación de material necesita conexión.'])
    } finally { generate.classList.remove('working') }
  })
  generate.classList.add('primary-ai')
  one.append(element('p', 'field-label', 'Tema'), topicGrid, element('p', 'field-label', 'Contextos rápidos'), presetRow, grid, generate, contextResult)

  // Plan B (collapsed): no API key or provider saturated → any AI chat the teacher already uses.
  const two = element('section', 'author-step plan-b')
  const details = element('details')
  details.append(element('summary', '', 'Plan B · ¿No hay IA disponible? Usa el asistente que ya tengas'))
  two.append(details)
  const prompt = area('', 10)
  prompt.readOnly = true
  const promptBox = element('div', 'prompt-box')
  promptBox.hidden = true
  const copied = element('p', 'notice ok')
  copied.hidden = true
  const copy = action('Copiar instrucciones', async () => {
    try {
      await navigator.clipboard.writeText(prompt.value)
      messages(copied, 'ok', ['Copiado. Pégalo en tu asistente de IA y pega aquí su respuesta.'])
    } catch {
      prompt.select()
      messages(copied, 'ok', ['Selecciona el texto y cópialo manualmente.'])
    }
  }, true)
  promptBox.append(field('Instrucciones para la IA', prompt), copy, copied)
  const prepare = action('1 · Preparar instrucciones', async () => {
    const data = context()
    if (!data) { details.open = true; return }
    const query = new URLSearchParams({ country: data.country, region: data.region, language: data.language, topic: data.topic })
    if (data.communityType) query.set('communityType', data.communityType)
    for (const food of data.foods) query.append('foods', food)
    for (const resource of data.resources) query.append('resources', resource)
    try {
      const response = await fetch(api + '/prompt?' + query.toString())
      const body = await response.json().catch(() => ({})) as Record<string, unknown>
      if (response.status !== 200 || typeof body.prompt !== 'string') return messages(pasteResult, 'error', serverLines(body))
      prompt.value = body.prompt
      promptBox.hidden = false
    } catch {
      messages(pasteResult, 'error', ['No hay conexión con el servidor de MOCHILA.'])
    }
  }, true)
  const pasted = area('', 8)
  pasted.placeholder = 'Pega aquí el JSON que devuelve la IA'
  const pasteResult = element('div')
  pasteResult.hidden = true
  details.append(element('p', 'step-help', 'Sirve cuando el servidor no tiene clave de IA o el servicio está saturado: cualquier asistente de chat puede generar la propuesta y MOCHILA la comprueba igual.'),
    prepare, promptBox, field('2 · Respuesta de la IA', pasted), action('3 · Comprobar borrador', async () => {
    let value: unknown
    try { value = JSON.parse(cleanPaste(pasted.value)) } catch {
      return messages(pasteResult, 'error', ['No es un JSON válido. Copia solo el objeto JSON que devuelve la IA.'])
    }
    // Pasted answers always come from an external AI assistant: keep that origin for traceability.
    if (value && typeof value === 'object') (value as Draft).review = { status: 'draft', notes: 'Propuesta asistida con IA externa. Pendiente de revisión pedagógica y validación local.' }
    const errors = draftErrors(value)
    if (errors.length) return messages(pasteResult, 'error', ['El borrador no cumple el formato:', ...errors])
    try {
      const { status, data } = await send('/generate', { pack: value })
      if (status !== 200) return messages(pasteResult, 'error', serverLines(data))
      draft = data.pack as Draft
      messages(pasteResult, 'ok', ['Borrador guardado: «' + draft.title + '». Revísalo abajo.'])
      renderReview()
    } catch {
      messages(pasteResult, 'error', ['No hay conexión con el servidor de MOCHILA. La preparación de material necesita conexión.'])
    }
  }), pasteResult)

  // 3 · Review and edit · 4 · Approve
  const three = step(2, 'Revisa y corrige', 'Lee cada juego como lo verá el alumnado y corrige lo que haga falta. Las notas «A VALIDAR» señalan lo que debe confirmarse en la comunidad.')
  const four = step(3, 'Aprueba', 'Solo una persona puede aprobar. Al aprobar, el paquete queda disponible para el alumnado, también sin conexión.')
  three.hidden = true
  four.hidden = true
  const editors: { activity: DraftActivity; prompt: HTMLTextAreaElement; feedback: HTMLTextAreaElement; options: [Option, HTMLInputElement][] }[] = []
  const reviewList = element('div', 'review-list')
  const saveResult = element('div')
  saveResult.hidden = true

  function collect(): Draft {
    for (const editor of editors) {
      editor.activity.prompt = editor.prompt.value.trim()
      // The audio must repeat the statement (pedagogical rules): keep it in step with the edited text.
      if (editor.activity.audioText !== undefined) editor.activity.audioText = editor.activity.prompt
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
        const correct = activity.correct
        options.forEach(([option, control], position) => {
          let label = 'Opción ' + (position + 1)
          if (activity.type === 'order' && Array.isArray(correct)) label += ' · va en el paso ' + (correct.indexOf(option.id) + 1)
          else if (activity.type === 'match' && Array.isArray(correct)) {
            const pair = correct.find(item => item.split(':').includes(option.id))
            const other = pair?.split(':').find(id => id !== option.id)
            const partner = (activity.options ?? []).find(item => item.id === other)
            if (partner) label += ' · pareja: ' + partner.text
          }
          else if (Array.isArray(correct) ? correct.includes(option.id) : correct === option.id) label += ' · ✓ respuesta correcta'
          list.append(field(label, control))
        })
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
