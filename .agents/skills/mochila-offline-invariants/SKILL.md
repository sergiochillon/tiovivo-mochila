---
name: mochila-offline-invariants
description: Use when changing or reviewing anything that affects MOCHILA's offline behaviour or sync (app/src/packs.ts, sync.ts, vite.config.ts, the service worker, IndexedDB, /api/sync, /api/packs) or when asked to verify or claim that the app works offline.
license: MIT
---

# MOCHILA: invariantes offline y regresión

El offline y la sincronización son la parte mejor hecha del proyecto. Esta skill evita romperla y evita afirmar de más.

## Invariantes (si un cambio rompe uno, no se fusiona)
1. **Ninguna actividad llama a la red ni a un modelo de IA.** Todo lo que el niño necesita sale de IndexedDB y de la precaché.
2. **La precaché incluye todo lo que pinta la interfaz:** HTML, JS, CSS, iconos, logo (`mochila.svg`, `mochila-180.png`) y fuentes `woff2`. Si añades un asset, comprueba `globPatterns` e `includeAssets` en `app/vite.config.ts` y el número de entradas que imprime `npm run build`.
3. **Un 404 o un fallo de red nunca borra una copia local ya aprobada.** Solo se reemplaza por una respuesta 200 válida (esquema, `id` y `review.status === "approved"`).
4. **La sincronización es idempotente por `eventId`.** Reenviar el mismo lote da `alreadyPresent`; el mismo `eventId` con contenido distinto da 409 y no guarda nada del lote. El cliente solo marca `sent` con un 200 cuyo `accepted + alreadyPresent` iguale el lote.
5. **El progreso nunca se pierde por una recarga, un cierre o una actualización.** Si cambias el esquema de IndexedDB (`mochila-aula`, almacenes `progress` y `packs`), sube la versión y migra; no recrees almacenes.
6. **El borrado de progreso es siempre una acción explícita y confirmada** (botón del panel docente).
7. Persistencia: `navigator.storage.persist()` se solicita (dentro de try/catch) y la app funciona si se rechaza.

## Regresión: arranque en frío sin red
1. `cd app && npm run build` (debe pasar sin errores; anota el número de entradas de la precaché).
2. `cd server && npm run seed:approved-packs` con la API parada, y arranca la API.
3. `cd app && npm run preview`; abre la app con red, elige mochila y explorador y descarga el paquete jugando una actividad.
4. Apaga la API y el servidor de preview. Comprueba que ya no responden.
5. Recarga. Cierra el navegador por completo. Reábrelo y entra a la app. Debe cargar, mostrar las mochilas descargadas, conservar el progreso y dejar jugar.
6. Vuelve a levantar API y preview. Envía el progreso desde `/docente` dos veces: la segunda no debe cambiar los contadores.
7. Un paquete que nunca se descargó, sin red, muestra «Conéctate para descargar…», no un error técnico.

## Qué no afirmar
- «Funciona sin conexión» porque la página abierta sigue funcionando al activar el modo avión: eso lo hace cualquier SPA. La prueba válida es cerrar y arrancar en frío.
- Que se ha probado en iPhone o tableta si no se ha hecho: di dispositivo, sistema, navegador, commit y quién lo ejecutó, o escribe «no probado».
- El navegador integrado de Claude Code no registra service workers: no sirve para esta regresión. Usa Chrome o Safari reales.

## Informe
Termina con tres listas: probado por mí (con la salida), inferido del código, no probado.
