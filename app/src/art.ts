// Original SVG art for MOCHILA (drawn for this project). Static, trusted markup only.

const svgUrl = (svg: string) => 'data:image/svg+xml,' + encodeURIComponent(svg)

/** Mochi: the backpack guide. Mood changes the face. */
export function mochi(mood: 'happy' | 'thinking' | 'cheer' = 'happy') {
  const mouth = mood === 'thinking'
    ? '<path d="M50 74 Q60 70 70 74" stroke="#1d2b27" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : mood === 'cheer'
      ? '<path d="M46 68 Q60 86 74 68 Z" fill="#7a2e1d"/><path d="M52 75 Q60 81 68 75" fill="#e77b6a"/>'
      : '<path d="M48 70 Q60 82 72 70" stroke="#1d2b27" stroke-width="4" fill="none" stroke-linecap="round"/>'
  const brows = mood === 'thinking'
    ? '<path d="M40 46 L52 49 M68 49 L80 46" stroke="#1d2b27" stroke-width="3.5" stroke-linecap="round"/>' : ''
  const arms = mood === 'cheer'
    ? '<path d="M18 70 Q6 52 12 40" stroke="#d9a441" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M102 70 Q114 52 108 40" stroke="#d9a441" stroke-width="9" fill="none" stroke-linecap="round"/>'
    : '<path d="M18 74 Q8 84 14 96" stroke="#d9a441" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M102 74 Q112 84 106 96" stroke="#d9a441" stroke-width="9" fill="none" stroke-linecap="round"/>'
  return '<svg viewBox="0 0 120 130" aria-hidden="true">' +
    '<ellipse cx="60" cy="124" rx="34" ry="5" fill="#000" opacity=".12"/>' + arms +
    '<path d="M42 22 Q42 6 60 6 Q78 6 78 22" stroke="#9a6a1c" stroke-width="7" fill="none"/>' +
    '<rect x="18" y="20" width="84" height="100" rx="30" fill="#f3c76b"/>' +
    '<rect x="18" y="20" width="84" height="100" rx="30" fill="none" stroke="#c9952f" stroke-width="3"/>' +
    '<rect x="34" y="88" width="52" height="24" rx="10" fill="#e9b04d" stroke="#c9952f" stroke-width="3"/>' +
    '<path d="M50 96 h20" stroke="#9a6a1c" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="46" cy="56" r="8" fill="#fff"/><circle cx="74" cy="56" r="8" fill="#fff"/>' +
    '<circle cx="47" cy="57" r="4.5" fill="#1d2b27"/><circle cx="75" cy="57" r="4.5" fill="#1d2b27"/>' +
    '<circle cx="35" cy="68" r="5" fill="#f08a6b" opacity=".55"/><circle cx="85" cy="68" r="5" fill="#f08a6b" opacity=".55"/>' +
    brows + mouth + '</svg>'
}

const face = (body: string) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' + body + '</svg>'

/** Extra explorer avatars (the fox and hummingbird are Rodrigo's originals). */
export const extraAvatars = [
  {
    id: 'llama', es: 'Llama', en: 'Llama', color: '#f6dccd',
    portrait: svgUrl(face('<ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".1"/>' +
      '<path d="M40 30 L44 10 L52 30 Z M68 30 L76 10 L80 30 Z" fill="#f4eee4" stroke="#d8c8b4" stroke-width="2"/>' +
      '<rect x="34" y="24" width="52" height="70" rx="26" fill="#f4eee4" stroke="#d8c8b4" stroke-width="2"/>' +
      '<path d="M34 52 h52" stroke="#d9534f" stroke-width="6"/><path d="M34 60 h52" stroke="#3a6b8c" stroke-width="5"/>' +
      '<circle cx="50" cy="44" r="4" fill="#1d2b27"/><circle cx="70" cy="44" r="4" fill="#1d2b27"/>' +
      '<ellipse cx="60" cy="78" rx="14" ry="10" fill="#e8dccb"/><path d="M54 78 Q60 84 66 78" stroke="#1d2b27" stroke-width="3" fill="none" stroke-linecap="round"/>'))
  },
  {
    id: 'jirafa', es: 'Jirafa', en: 'Giraffe', color: '#fbe9c0',
    portrait: svgUrl(face('<ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".1"/>' +
      '<path d="M46 26 v-12 M74 26 v-12" stroke="#a5712a" stroke-width="5" stroke-linecap="round"/><circle cx="46" cy="12" r="5" fill="#7a4f19"/><circle cx="74" cy="12" r="5" fill="#7a4f19"/>' +
      '<rect x="32" y="22" width="56" height="74" rx="26" fill="#f0b94f"/>' +
      '<circle cx="44" cy="36" r="6" fill="#c9852f"/><circle cx="78" cy="58" r="7" fill="#c9852f"/><circle cx="40" cy="66" r="5" fill="#c9852f"/>' +
      '<circle cx="50" cy="48" r="4.5" fill="#1d2b27"/><circle cx="70" cy="48" r="4.5" fill="#1d2b27"/>' +
      '<ellipse cx="60" cy="80" rx="16" ry="11" fill="#e9a646"/><circle cx="54" cy="79" r="2" fill="#7a4f19"/><circle cx="66" cy="79" r="2" fill="#7a4f19"/>'))
  },
  {
    id: 'tortuga', es: 'Tortuga', en: 'Turtle', color: '#dcebe4',
    portrait: svgUrl(face('<ellipse cx="60" cy="112" rx="38" ry="5" fill="#000" opacity=".1"/>' +
      '<ellipse cx="60" cy="74" rx="40" ry="30" fill="#4f8a5b"/>' +
      '<path d="M40 64 L52 56 L68 56 L80 64 L74 84 L46 84 Z" fill="#6aa874" stroke="#3d6e47" stroke-width="2"/>' +
      '<circle cx="60" cy="34" r="20" fill="#9fd08f"/><circle cx="52" cy="32" r="4" fill="#1d2b27"/><circle cx="68" cy="32" r="4" fill="#1d2b27"/>' +
      '<path d="M53 42 Q60 48 67 42" stroke="#1d2b27" stroke-width="3" fill="none" stroke-linecap="round"/>'))
  },
  {
    id: 'rana', es: 'Rana', en: 'Frog', color: '#e3efd2',
    portrait: svgUrl(face('<ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".1"/>' +
      '<circle cx="40" cy="36" r="14" fill="#5fb05a"/><circle cx="80" cy="36" r="14" fill="#5fb05a"/>' +
      '<circle cx="40" cy="36" r="7" fill="#fff"/><circle cx="80" cy="36" r="7" fill="#fff"/><circle cx="41" cy="37" r="3.5" fill="#1d2b27"/><circle cx="81" cy="37" r="3.5" fill="#1d2b27"/>' +
      '<ellipse cx="60" cy="72" rx="40" ry="32" fill="#5fb05a"/><path d="M38 76 Q60 96 82 76" stroke="#2f6b2c" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="34" cy="70" r="5" fill="#f08a6b" opacity=".5"/><circle cx="86" cy="70" r="5" fill="#f08a6b" opacity=".5"/>'))
  }
]

/** Savanna scene for northern Uganda (the Andes use Rodrigo's valle.svg). */
export const savanna = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="800" height="300" fill="#fbd99a"/>' +
  '<circle cx="640" cy="90" r="46" fill="#f39c4a"/><circle cx="640" cy="90" r="64" fill="#f39c4a" opacity=".25"/>' +
  '<path d="M0 190 Q200 160 400 185 T800 175 L800 300 L0 300 Z" fill="#d9a35b"/>' +
  '<path d="M0 225 Q220 200 420 222 T800 214 L800 300 L0 300 Z" fill="#c4813f"/>' +
  '<path d="M0 262 Q260 244 520 262 T800 256 L800 300 L0 300 Z" fill="#a8652e"/>' +
  '<path d="M140 228 v-58" stroke="#5b3a1e" stroke-width="7"/><ellipse cx="140" cy="166" rx="66" ry="16" fill="#5f7d3a"/><ellipse cx="128" cy="156" rx="40" ry="11" fill="#6f8f45"/>' +
  '<path d="M560 214 v-40" stroke="#5b3a1e" stroke-width="5"/><ellipse cx="560" cy="172" rx="44" ry="11" fill="#5f7d3a"/>' +
  '<path d="M300 236 h44 v-22 l-22-18 l-22 18 Z" fill="#b9733a"/><path d="M294 216 l28-26 l28 26 Z" fill="#8a5a2b"/>' +
  '<path d="M356 240 h34 v-18 l-17-14 l-17 14 Z" fill="#b9733a"/><path d="M351 224 l22-20 l22 20 Z" fill="#8a5a2b"/>' +
  '<path d="M80 60 q10-8 20 0 q10-8 20 0" stroke="#7a4f19" stroke-width="3" fill="none"/><path d="M700 40 q8-6 16 0 q8-6 16 0" stroke="#7a4f19" stroke-width="3" fill="none"/>' +
  '</svg>')
