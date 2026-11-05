# MOCHILA: reglas para cualquier agente de IA

PWA offline-first para niños de 5 a 12 años, en tres tramos de edad (5–8, 6–10 y 9–12) (habilidades para la vida). La IA solo ayuda a la persona docente a preparar contenido en el servidor; una persona lo revisa y lo aprueba; el niño lo usa sin conexión; el progreso se sincroniza después sin duplicados. No hay chat para niños ni datos personales.

## Antes de tocar nada
- Ejecuta `git status`, `git branch --show-current` y `git fetch`. Trabaja en una rama `app/…`, `server/…`, `content/…`, `docs/…` o `pitch/…` creada desde `origin/main` actualizado.
- Nunca trabajes en `main`, nunca hagas push forzado, nunca fusiones una PR propia. Solo se fusiona con squash y con la aprobación de otra persona.
- Lee `docs/GIT_WORKFLOW.md` (propiedad de carpetas). Cada archivo tiene un dueño; para tocar uno ajeno, pide el cambio por comentario en la PR.

## Carpetas
`app/` PWA (Vite + TypeScript vanilla) · `server/` API (Express + AJV) · `contracts/` esquema y API · `content/` paquetes y reglas · `qa/` pruebas · `docs/` documentación · `DESIGN.md` sistema visual (fuente de verdad del diseño).

## Reglas que no se negocian
- Ninguna clave, token ni contenido de `.env` en archivos, prompts, logs ni capturas.
- Ningún dato personal de menores. Sin texto libre, foto, voz ni inferencia de emociones.
- Contenido para niños: solo `draft` hasta que una persona lo revise de verdad. Nunca escribas «validado por la comunidad», «probado con niños» ni «aprobado» si no es verdad. La fórmula honesta es «revisión pedagógica interna; validación local pendiente; no probado con niños».
- Lo que la IA propone sobre cultura local se marca `A VALIDAR`.
- Ninguna actividad llama a la red ni a un modelo de IA durante el juego.
- Sin dependencias nuevas sin justificarlas en la PR. Sin cambiar licencias (código MIT; contenido propio CC BY-NC-SA 4.0). Sin copiar recursos ni identidad de otros productos.
- Cambios de esquema (`contracts/`) o de API: avisa antes y espera aprobación.

## Cómo informar
- No digas «hecho» ni «funciona» sin ejecutar la comprobación y enseñar la salida (`cd app && npm run build`, `cd server && npm run typecheck`).
- Separa siempre: probado por mí / inferido del código / no probado.
- Una prueba en dispositivo se anota en `qa/` con quién, dispositivo, sistema, commit y resultado.

## Skills del proyecto
`mochila-offline-invariants` (antes de tocar `packs.ts`, `sync.ts`, `vite.config.ts` o el service worker) · `mochila-pack-review` (crear o revisar paquetes de contenido) · `impeccable` (no viene en el repo: solo si está instalada en tu perfil; revisión de diseño; solo `critique`, `audit`, `adapt`, `harden`, `polish`; nunca `document`, `live`, `bolder`, `overdrive` ni `delight`) · `mobile-native` (fallos de web en iPhone y tableta).
