# MOCHILA — nota de continuidad

**Corte:** 4 de noviembre de 2026  
**Repositorio:** <https://github.com/sergiochillon/tiovivo-mochila>  
**Rama principal comprobada:** `main` en `9d1afbd` (PR 28). Verificar el commit y las PR abiertas al retomar.

**Actualización (5 de noviembre de 2026):** `main` está en `bfed2d0`; la PR 37 está fusionada e incorpora el trabajo de las PR 33 y 34. La PR 35 también está fusionada. El resto de estados de este documento corresponde al corte del 4 de noviembre.

Este documento conserva el estado operativo para que el equipo pueda retomar MOCHILA después del hackatón. Los estados de GitHub y los resultados de prueba cambian; comprobarlos antes de continuar.

## Qué es MOCHILA

PWA educativa offline-first para actividades de habilidades para la vida. El docente prepara y revisa paquetes con conexión; el alumno descarga paquetes aprobados, juega sin red y sincroniza el progreso cuando vuelve la conexión. La demo usa avatares y datos sintéticos. No hay chat de IA para niños ni se envían datos personales.

La generación asistida puede usar Gemini durante la autoría, pero no es requisito para reproducir la demo: se deben usar borradores y paquetes guardados. La generación requiere conexión. El reproductor y la cola de progreso están diseñados para uso sin conexión.

## Estado conservado en `main`

- Reproductor PWA, paquetes aprobados, caché offline, progreso por avatar, sincronización manual y panel docente.
- Interfaz de autoría conectada con edición, revisión humana y aprobación.
- Tres paquetes con `review.status: approved`: `alimentacion-andes-es`, `food-northern-uganda-en` y `food-altiplano-es`.
- PR 32 fusionada: código bajo MIT; documentación, contenido e ilustraciones propias especificadas bajo CC BY-NC-SA 4.0. Revisar `LICENSE`, `LICENSE-CONTENT.md` y ADR-005.
- A fecha del corte (4 nov), las PR 33 (exportación de paquetes), 34 (voces locales ES/EN) y 35 (módulos y QA) estaban abiertas. La actualización del 5 nov indica cuáles se fusionaron; consultar GitHub para el estado vigente y el contenido final del release.

## Arranque local desde una copia limpia

Requisitos: Node.js y npm compatibles con los lockfiles del repo.

1. Instalar dependencias por separado en `server/` y `app/` con `npm ci`.
2. Con la API detenida, cargar los paquetes aprobados desde `server/` con `npm run seed:approved-packs`.
3. Arrancar la API desde `server/` con `npm start` (por defecto `http://127.0.0.1:3001`).
4. Seguir `app/README.md` para compilar y servir el frontend. Para autoría/panel en el Mac, configurar `VITE_API_BASE_URL=http://127.0.0.1:3001/api` al compilar y usar la vista previa en el puerto 4173, permitido por CORS por defecto. Para la sesión del iPhone, compilar con API relativa y arrancar la vista previa con `MOCHILA_IPHONE_PROXY=1`; el proxy de ADR-003 solo admite paquetes aprobados, sync y progress, así que la autoría se demuestra en el Mac.

Las rutas principales son `/autoria`, `/alumno?pack=alimentacion-andes-es`, `/alumno?pack=food-northern-uganda-en`, `/alumno?pack=food-altiplano-es` y `/docente`.

Para comprobar el paquete Altiplano: abrir `/alumno?pack=food-altiplano-es` con la API activa y confirmar que aparece «Alimentos en el Altiplano». Esta comprobación se hizo en el Mac de Alejandro el 4 nov 2026; la API se volvió a parar al terminar.

Para iPhone, seguir ADR-003 y `qa/checklist-demo.md`: HTTPS mediante túnel temporal a la vista previa, nunca exponer directamente la API; usar datos sintéticos, CORS restringido y cerrar el túnel al terminar. La URL del túnel no es estable.

## Datos y credenciales

- `server/data/store.json` es caché local ignorada por Git. La caché del Mac de Alejandro contenía los tres paquetes aprobados tras ejecutar el seeder el 4 nov. No se distribuye con el repo; repetir el seeder en una instalación nueva.
- La caché puede contener borradores o progreso del entorno local. No copiarla al repo ni usar datos personales.
- `server/.env` y claves de Gemini no deben subirse. La clave de Gemini fue configurada en el Mac de Sergio según el equipo; verificar el historial antes de publicar el repo.
- No considerar concluida la auditoría completa del historial ni cambiar la visibilidad del repo hasta que Sergio confirme la revisión y consulte a la sede sobre acceso privado.

## Pruebas y límites de las afirmaciones

- Consultar `qa/registro-pruebas.md` y `qa/checklist-demo.md`. Repetir el recorrido final con el mismo commit y dispositivos que se presentarán.
- El ensayo móvil registrado acredita los pasos que se hicieron en ese momento; no sustituye repetir descarga, actividad offline y sincronización en el release final.
- Los paquetes tienen revisión pedagógica; la validación cultural local sigue pendiente y no hay pruebas con niños registradas. No describirlos como validados por comunidades.
- Si entran las voces locales de PR 34, comprobar ES y EN en el iPhone sin conexión y registrar navegador, sistema, commit y resultado. No afirmar que el audio funciona offline antes de verificarlo.

## Próximos pasos al retomar

1. `git fetch origin`; revisar `main`, PR abiertas, issues y fecha de entrega antes de elegir el commit base.
2. Resolver o cerrar PR 33, 34 y 35 según su estado vigente; no asumir que el trabajo de esas ramas está integrado.
3. Ejecutar el checklist de demo completo sobre el commit elegido; registrar prueba, dispositivo y resultado.
4. Confirmar alcance pedagógico/cultural de cada paquete y conservar las limitaciones en demo y pitch.
5. Completar la revisión de secretos y datos personales en todo el historial; comprobar con la sede si acepta un repo privado compartido con el jurado. Publicar solo tras esa decisión y confirmación.
6. Actualizar `docs/TASK_BOARD.md` mediante su responsable, Sergio; la instantánea del 4 nov tiene estados que quedaron obsoletos tras las PR 24, 28, 29 y 32.

## Referencias de continuidad

- `docs/PROJECT_CONTEXT.md` — propósito, alcance, privacidad y decisiones.
- `docs/TEAM_ROLES.md` — responsables.
- `docs/GIT_WORKFLOW.md` — ramas y PR.
- `docs/decisions/ADR-003-https-pruebas-movil.md` — prueba móvil segura.
- `docs/decisions/ADR-005-licencias-y-visibilidad.md` — licencias y publicación.
- `qa/checklist-demo.md` — preparación y recorrido de demo.
- `server/README.md` y `app/README.md` — instrucciones detalladas de ejecución.
