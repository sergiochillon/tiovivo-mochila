# ADR-001 · Frontend: Vite + TypeScript + vite-plugin-pwa

- **Fecha:** 2026-11-04
- **Estado:** propuesta (pendiente de que Rodrigo confirme React o vanilla)
- **Propone:** Sergio, a partir de la propuesta de Rodrigo (JS modular + service worker propio)
- **Aprueba:** Sergio (integrador) + Rodrigo (dueño de `app/`)

## Contexto
Rodrigo, dueño de `app/`, propuso JS modular y un service worker escrito a mano para el primer hito. El paquete JSON es el contrato central y la demo depende de que la PWA funcione sin conexión.

## Decisión
- **Vite + TypeScript** (no JS sin tipos), para compartir tipos con el esquema `contracts/pack-v0.1.schema.json`.
- **`vite-plugin-pwa`** (Workbox) para service worker y manifiesto, en vez de uno escrito a mano.
- **React o vanilla + TS:** lo decide Rodrigo según con cuál llegue antes al hito M2 (actividad jugable sin red). No es motivo de bloqueo.
- Almacenamiento local: IndexedDB (`idb` o Dexie).
- Hasta que se congele el esquema (M1, 14:30), `app/` puede trabajar con un paquete de ejemplo local (`contracts/pack-example.json`).

## Alternativas consideradas
1. JS modular + service worker manual: más rápido de arrancar, pero sin tipos y con más riesgo en la caché offline, que es lo más frágil de la demo.
2. Framework de pago o app nativa: descartadas (coste, tiempo).

## Consecuencias
- Mejora: errores de esquema detectados al compilar; menos riesgo en el precaché.
- Empeora: algo de configuración inicial.
- `app/` tiene su propio `package.json` y lockfile; nadie importa código de otras carpetas.
