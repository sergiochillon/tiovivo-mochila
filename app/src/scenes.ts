/**
 * Static, original illustrations following DESIGN.md §6 (PR 37).
 * Illustrative only: no scene represents or has been validated by a community (README and DESIGN.md say so).
 * Add a context by adding an entry before the neutral fallback in scenes.
 * No network, external assets or runtime image generation.
 */
export interface SceneContext { country: string; region: string }
export interface Scene {
  readonly id: string
  readonly coincide: (context: SceneContext) => boolean
  readonly nombre: string
  readonly cielo: string
  readonly suelo: string
  readonly acento: string
  readonly ilustracion: string
}


const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
const svg = (sky: string, shapes: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none"><path fill="${sky}" d="M0 0h800v600H0z"/>${shapes}</svg>`

const andes: Scene = {
  id: 'peru-andes', nombre: 'Andes y Altiplano',
  // The Altiplano spans Peru and Bolivia: both use the Andean landscape.
  coincide: ({ country, region }) => /^(peru|bolivia)$/.test(normalize(country)) && /andes|andin|altiplano/.test(normalize(region)),
  cielo: '#DFF3FF', suelo: '#BBD9A8', acento: '#2F7FD8',
  ilustracion: svg('#DFF3FF', `
    <circle cx="610" cy="120" r="55" fill="#FFC531" stroke="white" stroke-width="8"/>
    <path d="M-60 390 200 100 430 390 600 170 860 410V600H-60Z" fill="#7EA6B0"/>
    <path d="m131 177 69-77 82 103-56-24-29 20-24-34Z" fill="#fff"/>
    <path d="m548 229 52-59 66 61-40-11-26 19-22-24Z" fill="#fff"/>
    <path d="M-30 470 320 225 620 500V600H-30Z" fill="#527D8C"/>
    <path d="m270 270 50-45 65 60-41-12-22 17Z" fill="#EAF5F5"/>
    <path d="M0 460Q180 350 390 460T800 440V600H0Z" fill="#BBD9A8"/>
    <path d="M0 505Q190 405 400 510T800 490M0 548Q190 448 400 553T800 533" stroke="#72965F" stroke-width="12"/>
    <path d="M430 455Q340 495 470 530T510 600" stroke="#BFE3FA" stroke-width="23"/>
  `)
}

const uganda: Scene = {
  id: 'uganda-norte', nombre: 'Sabana del norte de Uganda',
  coincide: ({ country, region }) => normalize(country) === 'uganda' && /\b(norte|north|northern)\b/.test(normalize(region)),
  cielo: '#FFF0C9', suelo: '#CE8660', acento: '#B5367D',
  ilustracion: svg('#FFF0C9', `
    <circle cx="610" cy="120" r="55" fill="#F6A15C" stroke="white" stroke-width="8"/>
    <path d="M0 365Q190 310 390 366T800 350V600H0Z" fill="#D9BC74"/>
    <path d="M0 450Q240 385 450 450T800 420V600H0Z" fill="#CE8660"/>
    <path d="m198 435 8-175m-3 75-58-63m61 36 68-48" stroke="#795139" stroke-width="17" stroke-linecap="round"/>
    <path d="M85 270Q75 231 122 220 144 182 192 202 231 173 259 205 310 205 323 242 332 268 286 274Z" fill="#769459" stroke="white" stroke-width="7" stroke-linejoin="round"/>
    <path d="m655 424 5-115m0 45-35-34m35 19 41-35" stroke="#795139" stroke-width="12" stroke-linecap="round"/>
    <path d="M575 317Q569 286 607 282 624 252 658 271 699 247 722 280 760 281 762 310Z" fill="#8FA363" stroke="white" stroke-width="6" stroke-linejoin="round"/>
    <path d="M380 600Q355 540 470 498T530 441" stroke="#EDBC86" stroke-width="32"/>
    <path d="m85 514-8-22m8 22 14-19m477 35-5-22m5 22 16-18m151 62-10-25m10 25 13-20" stroke="#866039" stroke-width="6" stroke-linecap="round"/>
  `)
}

export const neutralScene: Scene = {
  id: 'neutro', nombre: 'Paisaje de la mochila', coincide: () => true,
  cielo: '#DFF3FF', suelo: '#D3EDD0', acento: '#17A06B',
  ilustracion: svg('#DFF3FF', `
    <circle cx="610" cy="120" r="55" fill="#FFC531" stroke="white" stroke-width="8"/>
    <path d="M0 410Q190 270 400 410T800 390V600H0Z" fill="#A5D1CC"/>
    <path d="M0 490Q230 355 450 475T800 450V600H0Z" fill="#D3EDD0"/>
    <path d="M380 600Q350 540 470 500T510 450" stroke="#FFF0C9" stroke-width="28"/>
  `)
}

export const scenes: readonly Scene[] = [andes, uganda, neutralScene]

export function sceneFor(context: SceneContext): Scene {
  return scenes.find(scene => scene.coincide(context)) ?? neutralScene
}

/** Trusted static SVG only. Package strings are never interpolated into markup. */
export function sceneImage(scene: Scene): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(scene.ilustracion)
}

/** Short visible note shown on every real scene: the landscape is not validated by a community. */
export const sceneNotice = { es: 'Paisaje ilustrativo', en: 'Illustrative landscape' } as const

export function sceneCaption(language: string): HTMLElement {
  const caption = document.createElement('small')
  caption.className = 'scene-notice'
  caption.textContent = sceneNotice[language === 'en' ? 'en' : 'es']
  return caption
}
