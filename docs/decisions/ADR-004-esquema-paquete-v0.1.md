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
1. **Rodrigo:** semántica de `correct` en `match` (`"idA:idB"`) y `order` (lista ordenada); ¿le sirve así?
2. **Alejandro:** `ajv` con formatos (`date-time`) y `additionalProperties:false`; ¿le encaja con el generador?
3. **Carlos:** valores de `safetyTag` (ahora cualquier texto en minúsculas con guiones); ¿cerrar una lista?

## Alternativas consideradas
1. Esquema más abierto (`additionalProperties: true`): menos fricción, pero el contenido generado por IA podría colar campos no previstos.
2. Esperar a tener el generador: bloquea a todos.

## Consecuencias
- Mejora: todos construyen sobre el mismo contrato y validan lo mismo.
- Empeora: cualquier cambio exige aviso.
- Estado de verificación: el esquema es JSON válido, pero **no se ha probado todavía con un validador real (ajv)**.
