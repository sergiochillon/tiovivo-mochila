# ADR-006 · Franjas de edad 5–8, 6–10 y 9–12

- **Fecha:** 2026-11-05
- **Estado:** aprobada
- **Propone:** Sergio (PR #73)
- **Aprueba:** Carlos Herrero (pedagogía y contenido; aprobación de palabra, la registra Alejandro Estévez) y Alejandro Estévez

## Contexto
El alcance inicial era 6–10 años. La PR #73 añade mochilas y generación para 5–8 y 9–12 (esquema: `ageRange` con valores `6-10`, `5-8` y `9-12`). En su revisión, Carlos pidió un acuerdo sobre el cambio de público y que la lista de revisión de la autoría dejara de decir siempre «adecuados para 6–10 años».

## Decisión
- El público pasa a ser **de 5 a 12 años en tres franjas: 5–8, 6–10 y 9–12**. Cada paquete declara la suya y «Mis mochilas» filtra por edad.
- En `/autoria`, el punto de la lista sobre vocabulario y longitud muestra la franja del borrador que se revisa (p. ej. «adecuados para 9–12 años»). Si el borrador no la indica, dice «la edad elegida (5–8, 6–10 o 9–12)».
- El identificador del punto sigue siendo `lenguaje-6-10` para no romper `contracts/sync-api.md` ni las aprobaciones ya emitidas. Es solo un nombre interno.

## Alternativas consideradas
1. Mantener solo 6–10 y retirar 5–8 y 9–12 de la PR #73. Se descarta porque las tres mochilas nuevas ya están revisadas para esas franjas.
2. Renombrar el identificador a `lenguaje-edad`. Se descarta por ahora porque obliga a cambiar el contrato, el servidor y las pruebas sin ganar nada visible.

## Consecuencias
- Las frases de alcance (README, `AGENTS.md`, `PRODUCT_BRIEF.md`, `PROJECT_CONTEXT.md`, `TECHNICAL_ARCHITECTURE.md` y la skill de revisión de paquetes) ya dicen 5–12 años en tres tramos (`095e36d`, Sergio).
- Siguen pendientes, en todas las franjas, la validación cultural local y las pruebas con niños.
- Los datos de la auditoría sobre 6–10 años (brecha fundacional) no cambian: describen esa franja, no el alcance.
