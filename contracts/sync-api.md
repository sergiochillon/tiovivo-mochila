# API de generación, revisión y sincronización

**Responsable:** Alejandro · **Revisión de frontend:** Rodrigo
**Estado:** borrador; sección de sync revisada por Rodrigo. Alineado con `ProgressEvent` del commit `0ccbce4` de la PR 5. Sergio informa que validó el esquema y los ejemplos con AJV 8.17.1 + ajv-formats en modo estricto.

Base URL local: `/api`. JSON UTF-8 en peticiones y respuestas. No requiere cuentas.
La API no recibe nombres ni texto libre de menores. Los ejemplos son sintéticos.

## `POST /api/generate`

Acepta un paquete JSON pegado por la persona docente/autora y lo valida contra
pack-v0.1. La generación asistida es el único flujo requerido inicialmente;
Gemini queda como proveedor opcional posterior. El resultado siempre es borrador.

Petición (envoltorio ilustrativo; el objeto `pack` depende del esquema oficial):

```json
{ "pack": { "...": "paquete conforme a pack-v0.1" } }
```

`200 OK`: `{ "pack": { "...": "paquete validado con review.status=draft" }, "source": "assisted" }`

`400 Bad Request` si el JSON no se puede parsear; `422 Unprocessable Entity`
si no cumple el esquema, con `{ "error": "validation_failed", "details": ["..."] }`.
No se guarda ni se sirve un paquete inválido.

## `POST /api/review/approve`

Aprueba un borrador existente tras acción explícita de una persona revisora.

Petición: `{ "packId": "food-andes-es-demo", "reviewer": "docente-demo" }`

`200 OK`: `{ "packId": "food-andes-es-demo", "status": "approved", "reviewedBy": "docente-demo", "reviewedAt": "2026-11-04T14:00:00.000Z" }`

El servidor asigna la fecha; no acepta que el cliente selle `approved` por sí
mismo. `404` si no existe, `409` si no está en estado revisable.

## `GET /api/packs/:id`

Devuelve únicamente paquetes aprobados, desde la caché/almacenamiento local.
`200 OK`: el paquete conforme a pack-v0.1. `404` si no existe o no está aprobado.
La demo no depende de una llamada de IA en directo.

## `POST /api/sync`

Recibe un lote de progreso sintético o seudónimo. El servidor deduplica por
`eventId`. **Confirmado para el frontend:** `200 OK` significa que todos los
eventos del lote quedaron almacenados por primera vez o ya estaban almacenados
con el mismo contenido; el cliente puede retirar todo el lote de su cola. Esto
también hace seguro reintentar un lote cuando se perdió la respuesta anterior.

Petición:

```json
{
  "classCode": "DEMO-01",
  "events": [{
    "eventId": "evt-demo-001",
    "packId": "food-andes-es-demo",
    "activityId": "activity-01",
    "type": "activity_completed",
    "result": "correct",
    "ts": "2026-11-04T14:00:00.000Z",
    "avatarId": "zorro-azul"
  }]
}
```

Cada evento incluye `eventId`, `packId`, `activityId`, `result`, `ts` y
`avatarId`; `type` es opcional y `classCode` se envía una vez en el lote. Si un
evento incluye también `classCode`, debe coincidir con el del lote. Para la PWA,
el único valor de `type` usado en el MVP es `activity_completed` (slug).
`result` describe el resultado final al terminar la
actividad: `correct` significa que el niño acabó acertando, aunque necesitara
una pista y varios intentos; no significa que acertara a la primera. Se
admiten los valores previstos en el esquema: `completed`, `correct`,
`incorrect`, `skipped`; el significado operativo de los otros tres valores
queda por confirmar con Rodrigo. No incluir identificadores personales;
`avatarId` es un seudónimo local.

`eventId` identifica inmutablemente el evento. Si ya existe un evento con el
mismo ID y contenido, se cuenta como duplicado y no impide guardar los eventos
nuevos del lote. Si el mismo ID llega con contenido distinto, el servidor
rechaza el lote completo con `409 Conflict` (`event_id_conflict`).

Respuesta `200 OK`:

```json
{ "accepted": 1, "alreadyPresent": 0 }
```

`accepted` cuenta eventos nuevos almacenados en esta petición y
`alreadyPresent` cuenta reenvíos idénticos. El procesamiento es atómico: si un
evento es inválido, no se almacena ninguno de los eventos nuevos del lote y se
devuelve `422` con el `eventId` y el motivo de cada error. Los duplicados
idénticos no invalidan el lote. Ejemplo:

```json
{
  "error": "validation_failed",
  "details": [{ "eventIndex": 0, "eventId": "evt-demo-001", "reason": "activityId is required" }]
}
```

Si falta `eventId` o no se puede leer, `eventId` será `null`; `eventIndex`
identifica igualmente la posición inválida dentro de `events`.

Ante conflicto de identidad, no se almacena ningún evento nuevo del lote y se
devuelve `409` con `eventId` y motivo. El front conserva el lote completo ante
cualquier error y solo lo retira al recibir `200`.

## `GET /api/progress/:classCode`

Devuelve agregados de progreso para el panel, nunca filas que identifiquen a un
niño. `200 OK` (forma ilustrativa):

```json
{ "classCode": "DEMO-01", "eventsReceived": 12, "activitiesCompleted": 9 }
```

Los nombres y métricas concretos se ajustarán con el panel. No se incluyen
datos reales de menores.

## Límites pendientes

- Alinear el paquete de `/generate`, `/review/approve` y `/packs/:id` con el
  esquema pack-v0.1 de Sergio.
- Confirmar con Rodrigo la semántica asignada a `completed`, `incorrect` y
  `skipped`, y la forma final del agregado.
- El almacén es local y de alcance demo; no hay autenticación ni garantía de
  persistencia entre despliegues.
