# Lista de comprobación para la demo MOCHILA

Usar esta lista en el ensayo final con la misma versión y dispositivos que se presentarán. Marcar cada punto solo después de comprobarlo en ese ensayo; las pruebas anteriores son evidencia relacionada, no sustituyen la comprobación de la versión final.

## Antes de empezar

- [ ] Anotar el commit exacto de la versión de demo y confirmar que contiene las PR fusionadas que se van a presentar.
- [ ] Con la API parada, ejecutar `npm run seed:approved-packs` desde `server/`; confirmar que solo se cargaron paquetes con `review.status: "approved"`.
- [ ] Con Wi-Fi activo, abrir «Mis mochilas» y confirmar que aparece la mochila aprobada elegida para la demo.
- [ ] En `/docente`, anotar los contadores iniciales de `DEMO-01` antes de activar el modo avión.
- [ ] En iPhone, abrir MOCHILA en Safari y añadirla a la pantalla de inicio. Abrirla desde el icono y confirmar que no aparece la barra de direcciones.
- [ ] Desactivar el modo silencio del iPhone y comprobar que se oye la narración; con la campana tachada el botón podía cambiar a «Detener» sin audio.

## Recorrido offline en iPhone

- [ ] Abrir la mochila aprobada elegida por Wi-Fi antes de desconectar.
- [ ] Activar modo avión y comprobar que Wi-Fi también está apagado.
- [ ] Cerrar MOCHILA desde el selector de apps y volver a abrirla desde el icono; confirmar que aparece el selector de avatares.
- [ ] Elegir Zorro y completar una actividad sin conexión.
- [ ] Confirmar que el progreso local de la actividad aparece en la mochila.
- [ ] Recuperar Wi-Fi en la app del alumno y esperar a que se envíe el progreso automáticamente.
- [ ] Sin pulsar «Enviar progreso», abrir `/docente` y comparar los contadores con el valor inicial anotado.
- [ ] Si el envío automático no aparece, registrar el fallo antes de probar el envío manual como recuperación.
- [ ] Anotar dispositivo, iOS, navegador, commit, paquete, contadores antes/después y resultado en [`registro-pruebas.md`](registro-pruebas.md).

## Qué se puede afirmar con la evidencia registrada

- Rodrigo informó que en iPhone 17 con iOS 27.2 y Safari instaló MOCHILA en la pantalla de inicio, la abrió desde el icono y la reabrió en modo avión. El selector de avatares volvió a cargar (commit `0900e78`).
- En ese mismo commit y dispositivo, informó que completó tres actividades Andes en modo avión y sincronizó 3 eventos/3 actividades desde `/docente`.
- Sergio informó que en un MacBook Air el ensayo integrado cargó Andes y Uganda, conservó progreso cuando la API estaba parada y sincronizó dos eventos al volver la API (commit `e39c184`). Ese ensayo no fue modo avión real.
- Rodrigo informó que en iPhone 17/Safari, commit `cee26cb`, oyó la primera historia de Andes en español y de Uganda en inglés en modo avión. Con el modo silencio activado no se oyó la voz.
- PR 45 añade envío automático al evento `online`; la nueva demo debe comprobarlo en `/docente` sin pulsar antes el botón manual.
- Los paquetes Andes y Uganda tienen revisión pedagógica aprobada; la validación cultural local sigue pendiente. No hay pruebas con niños registradas.
- El paquete Altiplano es un contexto sintético generado con IA; no presentarlo como validado por una comunidad.

## Pendiente para el ensayo final

La prueba de PWA/Andes registrada corresponde a `0900e78`, y el ensayo integrado de servidor a `e39c184`. Completar y registrar de nuevo el recorrido en el commit de demo elegido; no trasladar resultados anteriores a una versión posterior sin repetir la comprobación.

El guion paso a paso para el ensayo final con modo avión real está en [`ensayo-final-v0.9-freeze.md`](ensayo-final-v0.9-freeze.md).
