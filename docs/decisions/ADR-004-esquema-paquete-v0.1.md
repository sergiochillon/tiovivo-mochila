# ADR-004 · Esquema del paquete v0.1

- **Fecha:** 2026-11-04
- **Estado:** propuesta (borrador; se congela en el hito M1, 14:30, si lo aprueban Rodrigo, Alejandro y Carlos)
- **Propone:** Sergio
- **Aprueba:** Sergio + Rodrigo (front) + Alejandro (back) + Carlos (contenido)

## Contexto
El paquete JSON es el contrato entre autoría, servidor y reproductor. Todos esperan al esquema para implementar.

## Decisión
Adoptar `contracts/pack-v0.1.schema.json` (JSON Schema 2020-12) como contrato, partiendo del borrador de `TECHNICAL_ARCHITECTURE.md §5`:
- `Pack` → `context`, `review`, `modules[]` → `Activity` (`story|choice|match|order|scenario`).
- `review.status = approved` exige `reviewedBy` y `reviewedAt`. Solo los paquetes `approved` llegan al niño.
- `ProgressEvent` (en `$defs`) con `avatarId` seudónimo y `classCode`; sin datos personales.
- `additionalProperties: false`: lo que no está en el esquema no se acepta.
- Cambios futuros: se **añaden** campos y se sube `packVersion`; no se renombra ni se quita nada sin Issue y aviso a las tres áreas.
- Ejemplo sintético: `contracts/pack-example.json` (estado `draft`, no apto para niños).

## Puntos abiertos para los revisores
1. ~~**Rodrigo:** semántica de `correct`~~ **Confirmada** (4 nov): `order` compara la secuencia de ids; `match` son parejas `"idA:idB"` izquierda-derecha, sin importar el orden. No necesita campos nuevos.
2. ~~**Alejandro:** `ajv`~~ **Validado por Sergio** con ajv 8.17.1 + ajv-formats 3.0.1 (modo estricto): el esquema compila, y el ejemplo y los dos paquetes de Carlos (PR 6, `draft`) lo cumplen. Pruebas negativas OK (approved sin revisor, choice sin `correct`, safetyTag fuera de lista).
3. ~~**Carlos:** `safetyTag`~~ **Cerrado** a `none, hygiene, food-safety, help-adult, emotion-self-choice, privacy` (una etiqueta principal por actividad). Añadido `teacherNotes` opcional por actividad; no se añade `level`.

## Alternativas consideradas
1. Esquema más abierto (`additionalProperties: true`): menos fricción, pero el contenido generado por IA podría colar campos no previstos.
2. Esperar a tener el generador: bloquea a todos.

## Consecuencias
- Mejora: todos construyen sobre el mismo contrato y validan lo mismo.
- Empeora: cualquier cambio exige aviso.
- Estado de verificación: validado con ajv (ver puntos abiertos). La validación sale del Mac de Sergio; el servidor de Alejandro debe repetirla con su versión de ajv.

## Actualización (4 nov): ProgressEvent y /api/sync
Rodrigo y Alejandro detectaron que el `ProgressEvent` del borrador no encajaba con el borrador de `/api/sync`. Cambios propuestos en el esquema (aditivos): `type` opcional (slug), `classCode` opcional en el evento (el contrato lo pone en el lote; si va en ambos deben coincidir) y `classCode` acepta `DEMO01` y `DEMO-01`. `type` queda como opcional con el único valor del MVP `activity_completed` (acordado por Alejandro). Pendiente: que Alejandro suba `sync-api.md` al repo para que Rodrigo lo vea.

## Actualización (4 nov, noche): temas de módulo
Cambio aditivo en `module.topic`: además de `food`, `help` y `emotions`, se aceptan `hygiene`, `coexistence`, `safety` y `autonomy` (las habilidades para la vida de `PROJECT_CONTEXT.md §4`). No se renombra ni se quita nada; los paquetes existentes siguen siendo válidos. Propuesto por Sergio en la PR 37 (fusionada en `main`, `bfed2d0`).

**Confirmaciones por escrito (5 nov):**
- Alejandro (back): de acuerdo, en el chat del equipo, trasladado por Sergio.
- Carlos (contenido): de acuerdo, en un comentario de la PR 37.
- Rodrigo (front): **pendiente**. Su revisión de la PR 37 no menciona este punto y expresamente no acepta la ampliación de `topic`.

El ADR sigue como «propuesta» hasta tener las tres. Mientras tanto la ampliación ya está en el esquema fusionado, así que si Rodrigo se opone habría que revertirla con aviso a las tres áreas.
