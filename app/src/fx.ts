// Sound effects synthesized in the browser (no audio files, works offline, no licences)
// and a lightweight confetti burst. Everything respects the mute switch and reduced motion.

let context: AudioContext | undefined
let muted = false
try { muted = localStorage.getItem('mochila-muted') === '1' } catch { /* storage may be blocked */ }

export const isMuted = () => muted
export function setMuted(value: boolean) {
  muted = value
  try { localStorage.setItem('mochila-muted', value ? '1' : '0') } catch { /* ignore */ }
}

function audio() {
  if (muted) return undefined
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return undefined
  context ??= new Ctor()
  if (context.state === 'suspended') void context.resume()
  return context
}

/** One soft bell-like note: a sine body plus a quiet octave partial, with a fast attack and natural decay. */
function bell(ctx: AudioContext, frequency: number, start: number, length = 0.5, volume = 0.18) {
  const out = ctx.createGain()
  out.gain.setValueAtTime(0.0001, start)
  out.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  out.gain.exponentialRampToValueAtTime(0.0001, start + length)
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 4200
  out.connect(filter).connect(ctx.destination)
  for (const [ratio, level, type] of [[1, 1, 'sine'], [2, 0.25, 'sine'], [3, 0.08, 'triangle']] as const) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency * ratio, start)
    gain.gain.value = level
    osc.connect(gain).connect(out)
    osc.start(start)
    osc.stop(start + length + 0.05)
  }
}

export function soundTap() {
  const ctx = audio(); if (!ctx) return
  bell(ctx, 880, ctx.currentTime, 0.12, 0.06)
}

export function soundRight() {
  const ctx = audio(); if (!ctx) return
  const now = ctx.currentTime
  bell(ctx, 784, now, 0.35)        // G5
  bell(ctx, 1175, now + 0.09, 0.6) // D6
}

export function soundWrong() {
  const ctx = audio(); if (!ctx) return
  const now = ctx.currentTime
  // A gentle, low "hmm" (two soft descending notes), never a harsh buzzer.
  bell(ctx, 330, now, 0.22, 0.12)
  bell(ctx, 262, now + 0.12, 0.32, 0.1)
}

export function soundStamp() {
  const ctx = audio(); if (!ctx) return
  const now = ctx.currentTime
  ;[523, 659, 784, 1047].forEach((frequency, index) => bell(ctx, frequency, now + index * 0.08, 0.55, 0.16))
  bell(ctx, 1568, now + 0.4, 0.9, 0.08)
}

export function confetti(target: HTMLElement) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const layer = document.createElement('div')
  layer.className = 'confetti'
  layer.setAttribute('aria-hidden', 'true')
  const colors = ['#f3c76b', '#174c43', '#e77b6a', '#3a6b8c', '#8fb3a0', '#a5552a']
  for (let index = 0; index < 36; index++) {
    const piece = document.createElement('i')
    piece.style.left = Math.random() * 100 + '%'
    piece.style.background = colors[index % colors.length]
    piece.style.animationDelay = (Math.random() * 0.25).toFixed(2) + 's'
    piece.style.setProperty('--drift', (Math.random() * 120 - 60).toFixed(0) + 'px')
    piece.style.setProperty('--spin', (Math.random() * 720 - 360).toFixed(0) + 'deg')
    layer.append(piece)
  }
  target.append(layer)
  setTimeout(() => layer.remove(), 1800)
}
