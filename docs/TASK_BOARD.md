# TASK_BOARD — instantánea de tareas

> **Instantánea histórica (5 nov, ~13:30). Ya no se actualiza.** El estado real está en las PR fusionadas, en `README.md` y en `qa/registro-pruebas.md`.

Solo Sergio edita este archivo (instantánea en cada hito). **El tablero vivo es GitHub Projects/Issues.** **Instantánea de la jornada 2 (5 nov, ~13:30).** Estados: **Hecho** · **Parcial** (se dice qué falta) · **Pendiente** · **En curso**. Solo se marca como hecho lo que está en `main` y comprobado; «según X» indica que lo comunica esa persona y no lo he comprobado. En `main` (8675115, CI en verde): reproductor con seis exploradores, cinco tipos de juego sin patrones (orden aleatorio) y álbum de pegatinas; autoría con IA asistida, aviso de segunda revisión de actividades sensibles y aprobación con lista de 6 puntos **exigida también por el servidor**; paquetes que no se pierden sin red; escenarios por contexto; «Mis mochilas» con el catálogo del servidor; envío de progreso automático al volver la red (y al abrir con red) además del manual; la generación con IA deja evidencia (modelo y fecha en el sello y `generations.jsonl`); app que se siente instalada en móvil; contraste AA; compatibilidad con Safari anterior a 16; tests del servidor y CI en cada PR. PR fusionadas hoy: 35, 40, 37 (con 33 y 34), 36, 44, 45 (con 39), 38, 46, 50, 42, 47, 54, 51, 52, 53, 49, 55 y de la 56 a la 62. En revisión: PR 63 (procedencia de la IA no falsificable, envíos en cola, tests con Gemini simulado). Pendiente comprobado: los paquetes aprobados Andes y Uganda siguen siendo espejos; las 5 actividades sensibles de los paquetes aprobados no tienen anotada la segunda revisión; `elige-lo-disponible` pregunta por «los alimentos de la historia» sin que la historia los nombre (decide Carlos); sin pruebas en iPhone, iPad ni tableta con esta versión; sin vídeo; el repositorio sigue privado.

Prioridad: **I** = Imprescindible · **M** = Importante · **P** = Prescindible.
Horas: escenario A (jornadas miércoles 4 y jueves 5 nov; ver `PROJECT_CONTEXT.md §1.1`). Si el calendario real es otro, se recortan primero las **P**, luego las **M**.

## Bloque 0 · Arranque (hoy 12:00–13:00)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-01 | Confirmar con la sede: dos jornadas, viernes, hora de entrega (P-01) y modalidad (P-02) | I | Sergio | — | Parcial: entrega hasta el jueves 23:59 y presentación el viernes 12:00–14:00 (sede); turno desconocido; falta P-02 (modalidad) | Respuesta anotada en `PROJECT_CONTEXT.md` |
| T-02 | Ejecutar diagnóstico en los 5 Macs y pegar resultados en el chat | I | Cada persona | — | Hecho (según Sergio: entornos listos) | 5 informes recibidos; carencias listadas |
| T-03 | Pasar usuarios de GitHub a Sergio | I | Rodrigo, Alejandro, Carlos, Mario | — | Hecho | 4 usuarios recibidos |
| T-04 | Comprobar plan de GitHub (Pro/Student) y elegir opción A/B/C | I | Sergio | — | Hecho: GitHub Pro (Student Pack) | Opción elegida y anotada |
| T-05 | Crear repo, subir kit, invitar, proteger `main` | I | Sergio | T-03, T-04 | Hecho: repo, invitados y PR de prueba; `main` protegida (1 aprobación, comprobado por API) | Los 5 han hecho PR de prueba y el push a `main` falla |
| T-06 | Confirmar roles (10 min) | I | Todos | — | Hecho: Mario producto/pitch, Rodrigo frontend | Roles anotados en `TEAM_ROLES.md` |
| T-07 | Pegar cada uno su prompt en su herramienta de IA y comprobar que responde con su rol | I | Cada persona | T-06 | Pendiente | Cada IA confirma su carpeta y sus reglas |

## Bloque 1 · Contratos y esqueleto (13:00–15:00)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-10 | ADR-001 (front) y ADR-002 (back) | I | Rodrigo + Alejandro, aprueba Sergio | T-06 | Hecho en la práctica: ADR-002 aprobado; ADR-001 aplicado (Vite + TS vanilla + vite-plugin-pwa en `main`), sin confirmación formal de Rodrigo (ADR-001 sigue como propuesta) | ADR en `docs/decisions/` |
| T-11 | Esquema del paquete v0.1 congelado (M1) | I | Sergio, con los tres | T-10 | Hecho: v0.1 en `main`, tag `v0.1`, validado con ajv; aprobado por Alejandro, confirmado por Rodrigo | `contracts/` actualizado y aprobado por los tres |
| T-12 | Reglas pedagógicas v0 (vocabulario, tono, temas permitidos/prohibidos, lista de revisión) | I | Carlos | — | Hecho: reglas v0 en `main` (PR 6 aprobada) | `content/rules/` revisado por Sergio |
| T-13 | 1 módulo «alimentación» de referencia escrito a mano (Andes/ES) | I | Carlos | T-12 | Hecho: paquete Andes aprobado (revisión pedagógica de Carlos, PR 20); validación cultural local pendiente | JSON que valida contra el esquema |
| T-14 | Esqueleto del reproductor + PWA que carga offline (shell vacío) | I | Rodrigo | T-10 | Hecho: PWA en `main`; reapertura sin red probada en iPhone 17 (según Rodrigo, registrado en `qa/`) | Carga sin red tras la primera visita |
| T-15 | Esqueleto del servidor: `/api/generate` (puede devolver caché), validación de esquema | I | Alejandro | T-10, T-11 | Hecho: servidor en `main`; probado en local con curl | Devuelve un paquete válido |
| T-16 | Mapa de usuarios, competencia y 3 hipótesis a validar prioritariamente | I | Mario | — | Parcial: informe de mercado de Mario; PR 10 devuelta a Mario con cinco ajustes (comentario del 5 nov), sin fusionar | `research/` con fuentes |
| T-17 | Lista de personas a contactar y primeros mensajes enviados | I | Mario | — | Pendiente: sin contactos reales; se prioriza el pitch (decisión del 4 nov) | ≥ 5 contactos enviados |
| T-18 | Guion de demo v0 (qué debe verse) | I | Mario | — | En curso (según Mario): guion y PowerPoint | `docs/PITCH_AND_DEMO.md` ajustado |
| T-19 | ADR-003 HTTPS para móviles | M | Sergio + Rodrigo | — | Hecho: ADR-003 en `main`; túnel probado en iPhone 17 | Método elegido y probado con 1 móvil |

## Bloque 2 · Vertical slice 1 (15:45–18:30)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-20 | Actividades `choice`, `story`, `scenario` jugables con el paquete de ejemplo | I | Rodrigo | T-13, T-14 | Hecho: `story`, `choice`, `order` y `scenario` jugables en `/alumno` con los paquetes reales (PR 15 y 17) | Una actividad jugable sin red |
| T-21 | Progreso local (IndexedDB) con avatar sin PII | I | Rodrigo | T-14 | Hecho: progreso por avatar en IndexedDB; probado en local y en iPhone (según Rodrigo) | Se guarda y sobrevive a recargar |
| T-22 | Generación con IA (o flujo asistido) con salida validada + reintento | I | Alejandro | T-12, T-15 | Parcial: autoría asistida y generación con Gemini desde el servidor en `main` (PR 24, 25, 29-31); la generación real deja evidencia (modelo y fecha en el sello, `generations.jsonl`; PR 56, camino probado con un Gemini simulado); cuotas reales de Gemini sin verificar y ninguna llamada real probada hoy | Paquete válido a partir de contexto |
| T-23 | Aprobación con sello (`review`) | I | Alejandro + Rodrigo | T-22 | Parcial: `/alumno` solo sirve aprobados y la aprobación desde pantalla con revisión de 6 puntos está en `main` (PR 24); el servidor valida el revisor (1–100 caracteres) y exige la lista de revisión de 6 puntos (PR 55, con tests); la segunda revisión de actividades sensibles sigue siendo manual (la pantalla la avisa, PR 59) | Solo `approved` llega al reproductor |
| T-24 | Segundo contexto (Uganda/EN) generado y revisado | I | Carlos con Alejandro | T-22 | Hecho: paquete Uganda/EN aprobado (revisión pedagógica, PR 20); validación cultural pendiente; escrito por Carlos, no generado con IA | 2.º paquete aprobado |
| T-25 | Primer plan de pruebas offline | I | Carlos | T-20 | Hecho: `qa/registro-pruebas.md` con las pruebas ejecutadas, incluida la de iPhone en modo avión | `qa/` con pasos |
| T-26 | Esqueleto de diapositivas | I | Mario | T-18 | En curso (según Mario) | 6–8 diapositivas vacías con mensajes |
| T-27 | Primeras 2 conversaciones de validación realizadas | I | Mario | T-17 | Pendiente | Notas en `research/entrevistas/` |

## Bloque 3 · Integración 1 (18:30–20:30) → Hito M3

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-30 | Integración: autoría → paquete → reproductor en `main` | I | Sergio | T-20…T-24 | Parcial: paquete → reproductor → envío → panel integrados en `main` y probados en local (ensayo de Sergio); la autoría ya está en `main` (PR 24); puerta de calidad del servidor sobre `main` pasada por Sergio (sembrado, catálogo, sync doble sin duplicar, 422 sin revisor); falta un ensayo integrado de punta a punta sobre la versión congelada | `main` arranca y juega una actividad |
| T-31 | Prueba en modo avión en ≥ 1 dispositivo real | I | Carlos | T-30 | Hecho (según Rodrigo, registrado por Carlos): iPhone 17, actividad nueva en modo avión y envío al volver la red; paquete sintético, 1 evento | Resultado en `qa/` |
| T-32 | Lista de recortes para mañana | I | Sergio | T-31 | Pendiente | Qué se recorta y por qué |
| T-33 | Resumen de validación y ajuste del pitch | I | Mario | T-27 | Pendiente | Qué cambia en producto/pitch |

## Jornada 2 (jueves 5 nov, 9:30–20:30)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-40 | Cola de sincronización (outbox) + `POST /api/sync` + sync manual | I | Rodrigo + Alejandro | T-21 | Hecho: cola, envío manual y automático al volver la red (PR 45), idempotencia en `main`; probado en local y en iPhone (envío manual); el automático, no probado en dispositivo | El evento llega una sola vez al reenviar |
| T-41 | Panel docente con agregados | M | Rodrigo | T-40 | Hecho: contadores en `/docente` | Muestra resultados de datos sintéticos |
| T-42 | Módulo «pedir ayuda» (sin temas de abuso) | M | Carlos | T-24 | Parcial: borradores Andes/ES y Uganda/EN en `content/drafts/` (PR 35, `draft`, validan contra el esquema; probado por Sergio); sin aprobar ni probar en el reproductor | Revisado con la lista |
| T-43 | Módulo «emociones» (sin inferencia) | M | Carlos | T-24 | Parcial: borradores Andes/ES y Uganda/EN en `content/drafts/` (PR 35, `draft`, validan contra el esquema; probado por Sergio); sin aprobar ni probar en el reproductor; pendiente segunda revisión de contenido sensible | Revisado con la lista |
| T-44 | Audio TTS del navegador en ES/EN | M | Rodrigo | T-20 | Parcial: audio local en `main` (PR 37, con la 34); Rodrigo oyó la primera historia de Andes (ES) y de Uganda (EN) en modo avión, iPhone 17, `cee26cb` (según Rodrigo, registrado en `qa/`); con el modo silencio no se oye | Funciona sin red en los dispositivos de demo; si no, texto |
| T-45 | Instalación como PWA y prueba en 2.º dispositivo | I | Rodrigo + Carlos | T-19 | Parcial: instalación como PWA y arranque desde el icono sin conexión probados en iPhone 17, 0900e78 (según Rodrigo, registrado por Carlos en `qa/`); pendiente segundo dispositivo y regresión sobre la versión congelada | Registrado en `qa/` |
| T-46 | **Congelación de funcionalidades** (16:30) | I | Sergio | — | Pendiente: `main` en 8675115 es la candidata; etiqueta con el OK de Sergio | Tag `v0.9-freeze` |
| T-47 | Correcciones y pulido (solo errores) | I | Todos | T-46 | Pendiente | Lista de errores a cero en los de demo |
| T-48 | Datos sintéticos de demo y semilla | I | Carlos | T-40 | Parcial: `seed:approved-packs` carga 3 paquetes aprobados y hay un borrador de demo («La cocina de Ana») en el ZIP del vídeo; sin eventos de progreso reales ni datos personales | Sin datos reales |
| T-49 | Licencias, README de ejecución real, limpieza de secretos | I | Sergio | T-46 | En curso: licencias en `main` (PR 32); README real en `main` y puesto al día en la PR 51; escaneo de secretos de todo el historial y todas las ramas hecho por Sergio el 5 nov (sin claves, sin `.env` ni `store.json` versionados); el repositorio sigue privado | Repo apto para publicar |
| T-50 | Vídeo de 3 min (grabado con la demo real) | I | Mario + quien maneje demo | T-46 | Pendiente | Vídeo ≤ 3:00 |
| T-51 | Presentación final y 2 ensayos | I | Mario + todos | T-47 | Pendiente | ≤ 5:00 |
| T-52 | **Entrega** (formulario con PPT + vídeo + enlace GitHub) | I | Sergio + Mario | T-49…T-51 | Pendiente | Comprobante de envío guardado |
| T-53 | Etiqueta `v1.0-demo` y copia zip de respaldo | I | Sergio | T-52 | Pendiente | Tag y zip |
| T-54 | IA local en navegador / Piper / Kolibri / más contextos | P | — | — | Pendiente | **No se empieza** salvo que todo lo I y M esté cerrado |

## Viernes 6 nov

| ID | Tarea | Prio | Responsable | Estado | Criterio |
|---|---|---|---|---|---|
| T-60 | Ensayo con cronómetro y comprobación de dispositivos (modo avión, batería, vídeo de respaldo) | I | Todos | Pendiente | Checklist de `PITCH_AND_DEMO.md §7` completo |
| T-61 | Presentación local (hora y formato **por confirmar**) | I | Mario + demo | Pendiente | — |

## Bloqueos y decisiones abiertas

Ver `PROJECT_CONTEXT.md §10` (P-01…P-10).
