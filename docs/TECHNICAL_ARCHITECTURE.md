# TECHNICAL_ARCHITECTURE — arquitectura propuesta

Responsable: Sergio (integración). Fue una **propuesta** para 2 jornadas con 5 personas y hoy es en gran parte realidad (ver «Estado real a 5 nov»). Cualquier cambio de arquitectura o de interfaces se propone por Issue/ADR y lo aprueba el responsable de integración **antes** de tocar código ajeno.

## Estado real a 5 nov (`main` en a044acb)

- **Front (`app/`):** Vite + TypeScript **vanilla** (sin React) + `vite-plugin-pwa`; progreso en IndexedDB; `/alumno`, `/docente` y `/autoria`. Lo del sprint de calidad (PR 37) no está aún en `main`.
- **Back (`server/`):** Node + Express + AJV; Gemini solo desde el servidor; sin chat para niños ni datos personales.
- **Contrato:** `contracts/pack-v0.1.schema.json`.
- **Pendiente (comprobado el 5 nov):** tests y CI; `storage.persist()`; sincronización automática al volver la red; el servidor no exige la lista de revisión ni la identidad del revisor; un 404 borra la copia local; evidencia guardada de la IA real. Sin verificar: tableta física y cuotas reales de Gemini.
- Los apartados siguientes conservan el texto de planificación original; donde difiera de lo anterior, manda esta sección.

Criterios de elección: velocidad de desarrollo, funcionar en Mac M1, facilidad de integración, un solo lenguaje en lo posible, cero coste. **No** se elige tecnología por moda.

---

## 1. Visión: tres piezas y un contrato

```
 [Autoría]  ──(server: IA + validación)──▶  PAQUETE JSON  ──▶  [Reproductor PWA offline]
  (con red)        contracts/pack-v0           (aprobado)            │
                                                                     ▼ cola de eventos
                                                       [API de sincronización] ─▶ [Panel docente]
```

1. **Autoría** (con conexión): formulario de contexto → generación → revisión → exportación.
2. **Paquete**: JSON versionado, el contrato central. Solo se reproduce si `review.status = "approved"`.
3. **Reproductor**: PWA con service worker + IndexedDB. Sin red.
4. **Sincronización**: endpoint simple que recibe eventos de progreso y un panel docente mínimo.

## 2. Frontend (Rodrigo) — **recomendación [HIPÓTESIS], confirmar en ADR-001**

- **Vite + TypeScript + React** (o Preact si hay problemas de rendimiento), **vite-plugin-pwa** (Workbox) para service worker y manifiesto, **Dexie** o `idb` para IndexedDB.
- Una sola app con dos zonas: `/alumno` (reproductor) y `/docente` (autoría y panel).
- Diseño para niños: pictogramas, botones grandes, poca lectura, audio. Accesibilidad básica (contraste, tamaño táctil, `aria`).
- Audio: `speechSynthesis` del navegador como primera opción (**[HIPÓTESIS]**: la disponibilidad de voces en español/inglés **varía por dispositivo**; hay que probar en los móviles/tablets reales). Piper WASM es Prescindible.
- Alternativa más simple si React da problemas: HTML + JS «vanilla» con módulos. Decide Rodrigo con Sergio en el bloque 0, no a mitad de desarrollo.

## 3. Backend e IA (Alejandro) — **recomendación [HIPÓTESIS], confirmar en ADR-002**

- **Node + TypeScript** con un servidor mínimo (Fastify o Express). Un solo lenguaje con el front para compartir validación (JSON Schema con `ajv`).
- Alternativa: Python + FastAPI + pydantic si Alejandro es claramente más fuerte ahí. Criterio: **lo que permita tener el endpoint de generación y el de sync funcionando antes de las 18:30**.
- Almacenamiento: ficheros JSON o SQLite local. **Sin base de datos externa, sin cuentas, sin autenticación** en el MVP (solo un código de clase/PIN simulado, opcional).
- Endpoints previstos (`contracts/sync-api.md`, lo define Alejandro y lo valida Rodrigo):
  - `POST /api/generate` — recibe contexto, devuelve borrador de paquete (`review.status="draft"`).
  - `POST /api/review/approve` — marca el paquete como aprobado con nombre del revisor y fecha.
  - `GET /api/packs/:id` — devuelve el paquete aprobado.
  - `POST /api/sync` — recibe lote de eventos de progreso.
  - `GET /api/progress/:classCode` — agregados para el panel.

## 4. IA y adaptación de contenidos

- **Dónde corre la IA (decidido):** solo en la **autoría**, con conexión. El niño nunca habla con un modelo.
- **Cómo se genera (hipótesis):** prompt plantillado + **salida estructurada** que valida contra el esquema; si no valida, se reintenta o se rechaza. Reglas pedagógicas de Carlos (`content/rules/`) como parte del prompt (vocabulario, longitud, tono, temas permitidos/prohibidos).
- **Proveedor [PENDIENTE, P-06]:** API de Gemini con su **tier gratuito** (existe; límites cambiantes; en el tier gratuito Google puede usar el contenido para mejorar sus productos → **solo contenido sin datos personales**). Las suscripciones de chat del equipo no incluyen crédito de API (comprobar). **Plan B sin API:** «generación asistida»: el docente (o Alejandro) ejecuta la plantilla en ChatGPT/Gemini/Claude, pega el JSON en la interfaz y el servidor lo valida. Es peor demo en directo pero 100 % fiable.
- **Caché obligatoria:** todas las generaciones usadas en la demo se guardan en `content/packs/` (revisadas). **La demo nunca depende de que la API responda** en directo; si responde, bien.
- **Control de calidad:** validación de esquema + lista de comprobación pedagógica + **sello humano**. Ninguna actividad llega al reproductor sin revisión.

## 5. Gestión de datos

- Paquete: JSON, sin datos personales.
- Progreso en dispositivo: `{ eventId, packId, activityId, result, ts, avatarId, classCode }` en IndexedDB. **`avatarId` es un seudónimo local** (p. ej. «zorro-azul»), nunca un nombre real.
- Demo: **datos sintéticos**. Prohibido subir datos de menores reales al repo o a servicios de IA.

### Borrador del paquete v0 (a congelar en el hito M1; **no es definitivo**)

```
Pack {
  packVersion: "0.1", id, title, language: "es"|"en",
  context: { country, region, communityType, foods[], resources[], culturalNotes[], ageRange: "5-8" | "6-10" | "9-12" },
  review:  { status: "draft"|"approved", reviewedBy, reviewedAt, notes },
  modules: [ { id, topic: "food"|"help"|"emotions", title, activities: [Activity] } ]
}
Activity { id, type: "story"|"choice"|"match"|"order"|"scenario",
           prompt, audioText?, options[], correct?, feedback, safetyTag, durationMin }
ProgressEvent { eventId, packId, activityId, result, ts, avatarId, classCode }
```

Reglas del contrato: los campos nuevos se **añaden**, no se renombran. Cambiar o quitar un campo = Issue + aviso a Rodrigo, Alejandro y Carlos + aprobación de Sergio.

## 6. Funcionamiento offline

- **Service worker** precachea el shell de la app y los paquetes aprobados descargados. Estrategia: *cache-first* para shell y paquetes; red solo para sincronización.
- **IndexedDB** guarda paquetes y progreso. Considerar `navigator.storage.persist()`.
- **Instalación como PWA**: en iOS el service worker y la PWA requieren HTTPS (salvo `localhost`). **[PENDIENTE, P-07]** cómo servir HTTPS para probar en móviles (opciones a evaluar: hosting estático gratuito, túnel desde el Mac, el VPS opcional). Sin eso, la demo offline en móvil real no está garantizada.
- **Riesgo conocido:** Safari puede borrar almacenamiento de sitios web no instalados tras días sin uso. Para la demo no importa; para el pitch: «instalado como PWA».
- **Prueba mínima de aceptación:** cargar la app con red → activar modo avión → recargar → jugar una actividad → reactivar red → sincronizar. Registrar el resultado en `qa/`.

## 7. Sincronización

- **Cola de eventos (outbox)** en el dispositivo; botón manual «Enviar progreso». Idempotencia por `eventId` (reenviar no duplica).
- Sincronización automática en segundo plano (Background Sync): **no disponible en todos los navegadores** → Prescindible. Dar por buena la manual.

## 8. Seguridad y privacidad (parte del diseño desde el inicio)

- Sin chat abierto, sin texto libre del niño enviado a ningún modelo.
- Sin inferencia de emociones de los niños (ni cámara, ni micrófono, ni análisis de texto). El niño **elige** opciones.
- Sin cuentas ni PII; avatares y código de clase.
- Claves de API solo en `.env` (en `.gitignore`), solo en el servidor, **nunca** en el cliente ni pegadas en chats de IA.
- Contenido de seguridad infantil (pedir ayuda): escenarios cerrados y simples; **fuera del MVP** cualquier tema de abuso. Revisión humana obligatoria.
- Marco legal: el reglamento europeo de IA prohíbe sistemas de inferencia de emociones en el ámbito educativo (art. 5.1.f, vigente desde el 2 feb 2025); nuestro diseño evita inferir. **No hemos hecho un análisis jurídico completo**; el calendario de obligaciones de alto riesgo en educación aparece de forma contradictoria en las fuentes consultadas. Decirlo así si preguntan.

## 9. Estructura de código (ver `GIT_WORKFLOW.md` para propiedad de carpetas)

- `app/` y `server/` con **su propio** `package.json` y lockfile; **no hay `package.json` en la raíz** (evita conflictos entre quienes instalan dependencias).
- El único contrato compartido es `contracts/`. Nada de importar código de la carpeta de otro.

## 10. Alternativas descartadas o aplazadas

| Alternativa | Decisión |
|---|---|
| App nativa (Android/iOS) | Descartada: más coste, no demostrable mejor en 2 días |
| LLM local en navegador (WebLLM/Gemma pequeña/Qwen pequeña) | Aplazada (Prescindible): peso de descarga, RAM, calidad y compatibilidad inciertos |
| Piper WASM (voz offline) | Aplazada |
| Base de datos remota / autenticación | Descartada para el MVP |
| Microservicios, colas, Docker | Descartado; Docker no es necesario |
| Kolibri como base | Aplazada: puede ser una vía de transferencia, no del MVP |

## 11. Decisiones técnicas pendientes (ADR)

| ADR | Tema | Responsable | Límite |
|---|---|---|---|
| ADR-001 | Framework del front (React vs vanilla) y librería PWA | Rodrigo + Sergio | 13:30 hoy |
| ADR-002 | Lenguaje/servidor del back (Node vs Python) y proveedor de IA | Alejandro + Sergio | 13:30 hoy (proveedor: 15:00) |
| ADR-003 | Cómo servir HTTPS para probar en móviles | Sergio + Rodrigo | 15:00 hoy |
| ADR-004 | Congelar esquema de paquete v0.1 | Sergio con los tres | 14:30 hoy (hito M1) |
