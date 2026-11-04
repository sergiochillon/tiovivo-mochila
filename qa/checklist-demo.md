# Lista de comprobación para la demo MOCHILA

Usar esta lista en el ensayo final con la misma versión y dispositivos que se presentarán. Marcar cada punto solo después de comprobarlo en ese ensayo; las pruebas anteriores son evidencia relacionada, no sustituyen la comprobación de la versión final.

## Antes de empezar

- [ ] Anotar el commit exacto de la versión de demo y confirmar que contiene las PR fusionadas que se van a presentar.
- [ ] Con la API parada, ejecutar `npm run seed:approved-packs` desde `server/`; confirmar que solo se cargaron paquetes con `review.status: "approved"`.
- [ ] Con Wi-Fi activo, abrir `/alumno` y confirmar que aparecen los paquetes aprobados Andes (español) y Uganda (inglés).
- [ ] Abrir `/docente` y comprobar que `DEMO-01` comienza en 0 eventos y 0 actividades para este ensayo.
- [ ] En iPhone, abrir MOCHILA en Safari y añadirla a la pantalla de inicio. Abrirla desde el icono y confirmar que no aparece la barra de direcciones.

## Recorrido offline en iPhone

- [ ] Cargar el paquete Andes por Wi-Fi antes de desconectar.
- [ ] Activar modo avión y comprobar que Wi-Fi también está apagado.
- [ ] Cerrar MOCHILA desde el selector de apps y volver a abrirla desde el icono; confirmar que aparece el selector de avatares.
- [ ] Elegir Zorro y completar la historia de Ana, la elección de papa y habas, y el orden de lavado de manos.
- [ ] Confirmar que la pantalla muestra «Tus sellos: 3 de 5».
- [ ] Recuperar Wi-Fi, abrir `/docente`, pulsar «Enviar progreso» una sola vez y confirmar que los contadores pasan de 0/0 a 3/3.
- [ ] Anotar dispositivo, iOS, navegador, commit, paquete, contadores antes/después y resultado en [`registro-pruebas.md`](registro-pruebas.md).

## Qué se puede afirmar con la evidencia registrada

- Rodrigo informó que en iPhone 17 con iOS 27.2 y Safari instaló MOCHILA en la pantalla de inicio, la abrió desde el icono y la reabrió en modo avión. El selector de avatares volvió a cargar (commit `0900e78`).
- En ese mismo commit y dispositivo, informó que completó tres actividades Andes en modo avión y sincronizó 3 eventos/3 actividades desde `/docente`.
- Sergio informó que en un MacBook Air el ensayo integrado cargó Andes y Uganda, conservó progreso cuando la API estaba parada y sincronizó dos eventos al volver la API (commit `e39c184`). Ese ensayo no fue modo avión real.
- Los paquetes Andes y Uganda tienen revisión pedagógica aprobada; la validación cultural local sigue pendiente. No hay pruebas con niños registradas.
- El paquete Altiplano es un contexto sintético generado con IA; no presentarlo como validado por una comunidad.

## Pendiente para el ensayo final

La prueba de PWA/Andes registrada corresponde a `0900e78`, y el ensayo integrado de servidor a `e39c184`. Completar y registrar de nuevo el recorrido en el commit de demo elegido; no trasladar resultados anteriores a una versión posterior sin repetir la comprobación.
