# MOCHILA

**Material Offline de Contexto Local para la Infancia y su Aprendizaje**

Equipo **TIOVIVO.exe** · Hack4Edu 2026 (VII edición, ProFuturo + UPSA) · Reto 02 «Aprender sin conexión» (Reto ProFuturo)

> **Estado real (4–5 nov 2026):** MOCHILA funciona de principio a fin en local: la docente prepara un módulo con ayuda de la IA, lo revisa y lo aprueba; el alumnado lo descarga una vez y lo usa **sin conexión**; el progreso se envía después al panel docente sin duplicados. Probado en navegador de escritorio y, según el registro del equipo (`qa/registro-pruebas.md`), en un iPhone en modo avión con el paquete real de los Andes. Lo que **no** está hecho: validación cultural con las comunidades, pruebas con niños, cuentas de usuario y despliegue público.

---

## Problema

Los niños de 5 a 12 años (tres tramos: 5–8, 6–10 y 9–12) en comunidades con poca conectividad y pocos recursos reciben poca o ninguna educación estructurada en **habilidades para la vida**: alimentación con lo que hay en su entorno, cuándo y cómo pedir ayuda a un adulto, reconocer y gestionar emociones, higiene y convivencia. Las soluciones digitales existentes suelen asumir Internet estable, un idioma y una cultura únicos, o un chat de IA abierto que no es seguro para menores.

*Matiz importante (decidido en la auditoría):* los datos internacionales no permiten afirmar que la brecha socioemocional sea mayor que la cognitiva en 6–10 años. Lo que sí está medido es la brecha de aprendizaje fundacional. **No lo afirmamos en el pitch.** Nuestro argumento es otro: hay una carencia de material de habilidades para la vida **adaptado al contexto local** y **utilizable sin conexión**, y la IA puede abaratar esa adaptación **si hay un docente que revisa**.

## Solución

MOCHILA separa dos momentos:

1. **Preparar (con conexión, el docente u ONG).** El docente describe su contexto (país, idioma, alimentos disponibles, recursos). La IA propone actividades adaptadas. **El docente revisa, edita y aprueba** (sello de revisión humana). Se exporta un **paquete de contexto** (JSON).
2. **Usar (sin conexión, el niño).** Una app web instalable (PWA) funciona sin red con el paquete aprobado: historias, juegos y escenarios con audio. El progreso se guarda en el dispositivo con **avatares, sin datos personales**, y se **sincroniza** cuando hay red.

Los paisajes y personajes son **ilustrativos**: no representan a una comunidad concreta ni están validados por ella.

**No hay chat abierto para niños.** La IA genera contenido para el docente; el niño solo interactúa con contenido ya revisado.

## Público objetivo

- **Usuario que decide y configura:** docentes y educadores de ONG en contextos con conectividad limitada.
- **Beneficiarios:** niños de 5 a 12 años, en tres tramos de edad: 5–8, 6–10 y 9–12 (cada mochila indica el suyo).
- **Posible pagador (hipótesis a validar):** ONG, fundaciones, programas educativos (p. ej. ecosistema ProFuturo), administraciones educativas.

## Funcionamiento general

```
 CON CONEXIÓN (docente)                       SIN CONEXIÓN (aula)
 ┌──────────────────────┐   paquete JSON      ┌──────────────────────────┐
 │ Formulario de contexto│  ───────────────▶   │ PWA: service worker +    │
 │ → IA genera borrador  │   (revisado y        │ IndexedDB; actividades   │
 │ → revisión humana     │    aprobado)         │ con audio; avatar        │
 │ → "sello" y export    │                      └───────────┬──────────────┘
 └──────────────────────┘                                   │ cola de progreso
            ▲                                                ▼ (cuando hay red)
            └──────── panel docente ◀─── sincronización (al volver la red o a mano)
```

## Características (objetivo del MVP; ver prioridades en `docs/PRODUCT_BRIEF.md`)

| Prioridad | Característica | Estado |
|---|---|---|
| Imprescindible | Esquema de paquete v0.1 y módulo de alimentación en 2 contextos (Andes/ES, norte de Uganda/EN) | Hecho: revisión pedagógica aprobada; validación cultural local pendiente |
| Imprescindible | Autoría: contexto → IA (Gemini o asistente externo) → revisión humana → aprobación → descarga JSON | Hecho; un módulo generado con IA (Altiplano, contexto sintético) revisado y aprobado |
| Imprescindible | Reproductor PWA sin conexión (selector de mochilas con filtro por edad, menú en español o inglés, seis exploradores, ocho juegos: historia, elige, llena el plato, ordena, parejas, clasifica, memoria y verdad o mentira; tres intentos, álbum de pegatinas, ayuda de Mochi) | Hecho; probado en iPhone en modo avión según `qa/` (versión anterior al sprint final) |
| Imprescindible | Progreso local con avatares y sincronización al panel docente (automática al volver la red, o manual); el panel muestra por explorador qué resolvió a la primera, con ayuda o sin resolver | Hecho, idempotente (sin duplicados al reenviar) |
| Importante | Escuchar actividades con voces del dispositivo (ES/EN) | Hecho; según el registro de `qa/`, se oye sin conexión en iPhone (no con el modo silencio); depende de las voces instaladas |
| Importante | Módulos «pedir ayuda a un adulto» y «emociones» | Borradores en `content/drafts/`, sin aprobar |
| Prescindible | IA local en el navegador, voz neuronal offline, exportación a Kolibri | No empezado |

## Ejecución

Comandos probados en un MacBook (Node instalado). La clave de Gemini es opcional: sin ella se usa el flujo de copiar y pegar con cualquier asistente de IA.

**1. Servidor** (en `server/`):

```bash
cd server && npm ci
npm run seed:approved-packs   # con el servidor parado: carga content/packs en la caché local
npm run start                 # API en http://127.0.0.1:3001
```

Opcional: copiar `server/.env.example` a `server/.env` y poner `GEMINI_API_KEY` (nunca subirla al repositorio).

**2. App** (en `app/`, en otra terminal):

```bash
cd app && npm ci
VITE_API_BASE_URL=http://127.0.0.1:3001/api npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

**3. Antes de enseñarla**, con ambas arrancadas: `node scripts/preflight-demo.mjs` comprueba (solo lectura) que la API es la versión actual, que están los tres paquetes y que la app compilada apunta a ella.

**4. Recorrido de la demo** (http://127.0.0.1:4173):

1. `/autoria`: describir la comunidad → «Generar propuesta con IA» o «Preparar instrucciones» → revisar y corregir → lista de revisión y nombre → «Aprobar y publicar».
2. `/`: «Mis mochilas» → abrir una mochila con conexión (queda «✓ Lista sin conexión») → elegir avatar → actividades.
3. Sin conexión: recargar y seguir jugando; el progreso se guarda en el dispositivo.
4. Al volver la conexión el progreso se envía solo; en `/docente`, «Enviar progreso» lo reenvía a mano y los contadores suben sin duplicar.

Para probar en un móvil real hace falta HTTPS: ver `docs/decisions/ADR-003-https-pruebas-movil.md`.

## Licencia

- **Código y esquemas** (código fuente de `app/` excepto las ilustraciones SVG y PNG listadas en `LICENSE-CONTENT.md`, además de `server/`, `scripts/` y `contracts/`): **MIT**. Ver [`LICENSE`](LICENSE).
- **Documentación y contenido** (`docs/`, `content/`, `pitch/`, `research/`, `qa/` y las ilustraciones SVG/PNG de `app/` listadas en `LICENSE-CONTENT.md`): **CC BY-NC-SA 4.0**. Ver [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).
- Las licencias cubren solo el material cuyos derechos tiene el equipo; las dependencias y los materiales de terceros mantienen sus propias licencias.
- Usos comerciales del contenido: se acuerdan con el equipo.

Las bases (Base 9) exigen una licencia aprobada por OSI para el código y recomiendan CC BY-NC-SA 3.0 para documentación y assets; usamos la versión 4.0. Decisión: `docs/decisions/ADR-005-licencias-y-visibilidad.md`.

## Mapa del repositorio

| Ruta | Qué contiene | Responsable |
|---|---|---|
| `docs/` | Documentación y decisiones (`docs/decisions/`) | Ver `TEAM_ROLES.md` |
| `contracts/` | Interfaces entre áreas (esquema del paquete, API de sincronización) | Sergio (esquema) · Alejandro (API) |
| `app/` | PWA: reproductor del niño + interfaz de autoría | Rodrigo |
| `server/` | Generación con IA, validación, sincronización | Alejandro |
| `content/` | Paquetes de contenido revisados y reglas pedagógicas | Carlos |
| `qa/` | Plan de pruebas y registro de pruebas offline | Carlos |
| `pitch/` | Guion, diapositivas, vídeo, guion de demo | Mario |
| `research/` | Notas de validación, competencia, fuentes | Mario |
| `scripts/` | Utilidades (diagnóstico de Macs, validación de todo el contenido) | Sergio |

Lectura recomendada para cualquier integrante nuevo (o IA): `docs/PROJECT_CONTEXT.md` → `docs/TEAM_ROLES.md` → `docs/GIT_WORKFLOW.md` → tu carpeta.
