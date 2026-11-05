# Lista de comprobación para la demo MOCHILA

Usar esta lista en el ensayo final con la misma versión y dispositivos que se presentarán. Marcar cada punto solo después de comprobarlo en ese ensayo; las pruebas anteriores son evidencia relacionada, no sustituyen la comprobación de la versión final.

## Antes de empezar

- [ ] Anotar el commit exacto de la versión de demo y confirmar que contiene las PR fusionadas que se van a presentar.
- [ ] Con la API parada, ejecutar `npm run seed:approved-packs` desde `server/`; confirmar que solo se cargaron paquetes con `review.status: "approved"`.
- [ ] Con Wi-Fi activo, abrir `/alumno` y entrar en «Mis mochilas»; confirmar que allí aparecen las mochilas disponibles para la demo. No asumir que Andes y Uganda aparecen directamente en `/alumno`.
- [ ] Abrir `/docente` y comprobar que `DEMO-01` comienza en 0 eventos y 0 actividades para este ensayo.
- [ ] En iPhone, abrir MOCHILA en Safari y añadirla a la pantalla de inicio. Abrirla desde el icono y confirmar que no aparece la barra de direcciones.
- [ ] Desactivar el modo silencio del iPhone y comprobar que se oye la narración; con la campana tachada el botón podía cambiar a «Detener» sin audio.

## Recorrido offline en iPhone

- [ ] En «Mis mochilas», cargar por Wi-Fi una mochila aprobada que esté incluida en el commit de demo; anotar su nombre, idioma y commit. Los borradores actuales no se usan con niños.
- [ ] Activar modo avión y comprobar que Wi-Fi también está apagado.
- [ ] Cerrar MOCHILA desde el selector de apps y volver a abrirla desde el icono; confirmar que aparece el selector de avatares.
- [ ] Elegir Zorro y completar las tres actividades acordadas para la mochila seleccionada.
- [ ] Confirmar que la pantalla muestra tres sellos completados; anotar el total de actividades de esa mochila.
- [ ] Recuperar Wi-Fi, abrir `/docente`, pulsar «Enviar progreso» una sola vez y confirmar que los contadores pasan de 0/0 a 3/3.
- [ ] Anotar dispositivo, iOS, navegador, commit, paquete, contadores antes/después y resultado en [`registro-pruebas.md`](registro-pruebas.md).

## Qué se puede afirmar con la evidencia registrada

- Rodrigo informó que en iPhone 17 con iOS 27.2 y Safari instaló MOCHILA en la pantalla de inicio, la abrió desde el icono y la reabrió en modo avión. El selector de avatares volvió a cargar (commit `0900e78`).
- En ese mismo commit y dispositivo, informó que completó tres actividades del paquete Andes en modo avión y sincronizó 3 eventos/3 actividades desde `/docente`. La lista actual de mochilas en `/alumno` debe comprobarse en la versión elegida para la demo.
- Sergio informó que en un MacBook Air el ensayo integrado cargó Andes y Uganda, conservó progreso cuando la API estaba parada y sincronizó dos eventos al volver la API (commit `e39c184`). Ese ensayo no fue modo avión real.
- Rodrigo informó que en iPhone 17/Safari, commit `cee26cb`, oyó la primera historia de Andes en español y de Uganda en inglés en modo avión. Con el modo silencio activado no se oyó la voz.
- La revisión pedagógica anterior de Andes y Uganda no se traslada a las propuestas reescritas el 2026-11-05: las nuevas versiones están en `content/drafts/` con estado `draft`. No cargarlas en la demo ni afirmar que están aprobadas. La validación cultural local y las pruebas con niños siguen pendientes.
- El paquete Altiplano es un contexto sintético generado con IA; no presentarlo como validado por una comunidad.

## Pendiente para el ensayo final

La prueba de PWA/Andes registrada corresponde a `0900e78`, y el ensayo integrado de servidor a `e39c184`. Completar y registrar de nuevo el recorrido en el commit de demo elegido; no trasladar resultados anteriores a una versión posterior sin repetir la comprobación.
