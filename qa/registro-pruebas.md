# Registro de pruebas — MOCHILA

Un resultado solo se registra si la prueba se ejecutó. Cuando el registro se redacta a partir del informe de otra persona, se indica quién ejecutó la prueba y quién comunicó el resultado.

## 2026-11-04 — Bloqueo de paquetes en borrador

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** MacBook Air (modelo no especificado).
- **Navegador:** Chrome 156.
- **Servidor:** servidor local disponible durante la prueba.
- **Ruta:** `/alumno`.
- **Paquetes:** `content/packs/food-andes-es.json` y `content/packs/food-northern-uganda-en.json` (PR #6, commit `fbc66bf`); ambos con `review.status: "draft"`.
- **Resultado observado:** en ambos casos se mostró «Este material está pendiente de revisión»; no aparecieron botones ni preguntas.
- **Resultado:** correcto para el alcance probado: los paquetes en borrador quedan bloqueados para el alumno.
- **Límite:** la prueba se realizó con el servidor local disponible. No comprueba modo avión, caché offline, reapertura sin red, progreso local ni sincronización.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026. Indicó que el detalle estaba en `app/README.md`, pero esa sección no aparece en la copia de `app/README.md` revisada por Carlos al preparar este registro.
