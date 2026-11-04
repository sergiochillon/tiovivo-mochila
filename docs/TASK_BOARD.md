# TASK_BOARD — instantánea de tareas

Solo Sergio edita este archivo (instantánea en cada hito). **El tablero vivo es GitHub Projects/Issues.** Estado inicial de TODAS las tareas: **Pendiente**. Ninguna funcionalidad está terminada.

Prioridad: **I** = Imprescindible · **M** = Importante · **P** = Prescindible.
Horas: escenario A (jornadas miércoles 4 y jueves 5 nov; ver `PROJECT_CONTEXT.md §1.1`). Si el calendario real es otro, se recortan primero las **P**, luego las **M**.

## Bloque 0 · Arranque (hoy 12:00–13:00)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-01 | Confirmar con la sede: dos jornadas, viernes, hora de entrega (P-01) y modalidad (P-02) | I | Sergio | — | Pendiente | Respuesta anotada en `PROJECT_CONTEXT.md` |
| T-02 | Ejecutar diagnóstico en los 5 Macs y pegar resultados en el chat | I | Cada persona | — | Pendiente | 5 informes recibidos; carencias listadas |
| T-03 | Pasar usuarios de GitHub a Sergio | I | Rodrigo, Alejandro, Carlos, Mario | — | Pendiente | 4 usuarios recibidos |
| T-04 | Comprobar plan de GitHub (Pro/Student) y elegir opción A/B/C | I | Sergio | — | Pendiente | Opción elegida y anotada |
| T-05 | Crear repo, subir kit, invitar, proteger `main` | I | Sergio | T-03, T-04 | Pendiente | Los 5 han hecho PR de prueba y el push a `main` falla |
| T-06 | Confirmar roles (10 min) | I | Todos | — | Pendiente | Roles anotados en `TEAM_ROLES.md` |
| T-07 | Pegar cada uno su prompt en su herramienta de IA y comprobar que responde con su rol | I | Cada persona | T-06 | Pendiente | Cada IA confirma su carpeta y sus reglas |

## Bloque 1 · Contratos y esqueleto (13:00–15:00)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-10 | ADR-001 (front) y ADR-002 (back) | I | Rodrigo + Alejandro, aprueba Sergio | T-06 | Pendiente | ADR en `docs/decisions/` |
| T-11 | Esquema del paquete v0.1 congelado (M1) | I | Sergio, con los tres | T-10 | Pendiente | `contracts/` actualizado y aprobado por los tres |
| T-12 | Reglas pedagógicas v0 (vocabulario, tono, temas permitidos/prohibidos, lista de revisión) | I | Carlos | — | Pendiente | `content/rules/` revisado por Sergio |
| T-13 | 1 módulo «alimentación» de referencia escrito a mano (Andes/ES) | I | Carlos | T-12 | Pendiente | JSON que valida contra el esquema |
| T-14 | Esqueleto del reproductor + PWA que carga offline (shell vacío) | I | Rodrigo | T-10 | Pendiente | Carga sin red tras la primera visita |
| T-15 | Esqueleto del servidor: `/api/generate` (puede devolver caché), validación de esquema | I | Alejandro | T-10, T-11 | Pendiente | Devuelve un paquete válido |
| T-16 | Mapa de usuarios, competencia y 3 hipótesis a validar prioritariamente | I | Mario | — | Pendiente | `research/` con fuentes |
| T-17 | Lista de personas a contactar y primeros mensajes enviados | I | Mario | — | Pendiente | ≥ 5 contactos enviados |
| T-18 | Guion de demo v0 (qué debe verse) | I | Mario | — | Pendiente | `docs/PITCH_AND_DEMO.md` ajustado |
| T-19 | ADR-003 HTTPS para móviles | M | Sergio + Rodrigo | — | Pendiente | Método elegido y probado con 1 móvil |

## Bloque 2 · Vertical slice 1 (15:45–18:30)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-20 | Actividades `choice`, `story`, `scenario` jugables con el paquete de ejemplo | I | Rodrigo | T-13, T-14 | Pendiente | Una actividad jugable sin red |
| T-21 | Progreso local (IndexedDB) con avatar sin PII | I | Rodrigo | T-14 | Pendiente | Se guarda y sobrevive a recargar |
| T-22 | Generación con IA (o flujo asistido) con salida validada + reintento | I | Alejandro | T-12, T-15 | Pendiente | Paquete válido a partir de contexto |
| T-23 | Aprobación con sello (`review`) | I | Alejandro + Rodrigo | T-22 | Pendiente | Solo `approved` llega al reproductor |
| T-24 | Segundo contexto (Uganda/EN) generado y revisado | I | Carlos con Alejandro | T-22 | Pendiente | 2.º paquete aprobado |
| T-25 | Primer plan de pruebas offline | I | Carlos | T-20 | Pendiente | `qa/` con pasos |
| T-26 | Esqueleto de diapositivas | I | Mario | T-18 | Pendiente | 6–8 diapositivas vacías con mensajes |
| T-27 | Primeras 2 conversaciones de validación realizadas | I | Mario | T-17 | Pendiente | Notas en `research/entrevistas/` |

## Bloque 3 · Integración 1 (18:30–20:30) → Hito M3

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-30 | Integración: autoría → paquete → reproductor en `main` | I | Sergio | T-20…T-24 | Pendiente | `main` arranca y juega una actividad |
| T-31 | Prueba en modo avión en ≥ 1 dispositivo real | I | Carlos | T-30 | Pendiente | Resultado en `qa/` |
| T-32 | Lista de recortes para mañana | I | Sergio | T-31 | Pendiente | Qué se recorta y por qué |
| T-33 | Resumen de validación y ajuste del pitch | I | Mario | T-27 | Pendiente | Qué cambia en producto/pitch |

## Jornada 2 (jueves 5 nov, 9:30–20:30)

| ID | Tarea | Prio | Responsable | Depende de | Estado | Criterio de finalización |
|---|---|---|---|---|---|---|
| T-40 | Cola de sincronización (outbox) + `POST /api/sync` + sync manual | I | Rodrigo + Alejandro | T-21 | Pendiente | El evento llega una sola vez al reenviar |
| T-41 | Panel docente con agregados | M | Rodrigo | T-40 | Pendiente | Muestra resultados de datos sintéticos |
| T-42 | Módulo «pedir ayuda» (sin temas de abuso) | M | Carlos | T-24 | Pendiente | Revisado con la lista |
| T-43 | Módulo «emociones» (sin inferencia) | M | Carlos | T-24 | Pendiente | Revisado con la lista |
| T-44 | Audio TTS del navegador en ES/EN | M | Rodrigo | T-20 | Pendiente | Funciona sin red en los dispositivos de demo; si no, texto |
| T-45 | Instalación como PWA y prueba en 2.º dispositivo | I | Rodrigo + Carlos | T-19 | Pendiente | Registrado en `qa/` |
| T-46 | **Congelación de funcionalidades** (16:30) | I | Sergio | — | Pendiente | Tag `v0.9-freeze` |
| T-47 | Correcciones y pulido (solo errores) | I | Todos | T-46 | Pendiente | Lista de errores a cero en los de demo |
| T-48 | Datos sintéticos de demo y semilla | I | Carlos | T-40 | Pendiente | Sin datos reales |
| T-49 | Licencias, README de ejecución real, limpieza de secretos | I | Sergio | T-46 | Pendiente | Repo apto para publicar |
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
