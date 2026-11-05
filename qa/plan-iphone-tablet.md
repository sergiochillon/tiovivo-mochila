# Plan de pruebas en iPhone y tableta — MOCHILA

Un estado «Hecho» requiere fuente con quién ejecutó la prueba, dispositivo, sistema, navegador, commit y fecha. Los resultados comunicados por otra persona se atribuyen a esa persona; no se amplía su alcance.

| Identificador | Dispositivo | Pasos | Resultado esperado | Estado | Fuente/nota |
|---|---|---|---|---|---|
| MOB-01 | iPhone 17 · iOS 27.2 · Safari | Instalar la PWA desde Safari; abrirla desde el icono con Wi-Fi y después reabrirla desde el icono en modo avión. | La pantalla inicial abre sin conexión y sin barra de direcciones. | Hecho | Rodrigo; iPhone 17; iOS 27.2; Safari; commit `0900e78`; 2026-11-04. Fuente: `qa/registro-pruebas.md`, «Instalación de la PWA y arranque desde el icono sin conexión». |
| MOB-02 | iPhone 17 · iOS 27.2 · Safari | Precargar Andes con Wi-Fi; activar modo avión; completar tres actividades; recuperar Wi-Fi y sincronizar desde `/docente`. | Se completan tres actividades offline y se sincronizan 3 eventos/3 actividades. | Hecho | Rodrigo; iPhone 17; iOS 27.2; Safari; commit `0900e78`; 2026-11-04. Fuente: `qa/registro-pruebas.md`, «Tres actividades del paquete Andes en modo avión y sincronización». No es la versión de la PR 37. |
| MOB-03 | Escritorio; modelo y sistema operativo por confirmar | Recuperar el informe de auditoría independiente y documentar los escenarios 1–6, el resultado y los fallos. | El registro identifica ejecutor, modelo/sistema, Chrome, commit y fecha; se conservan los resultados observados. | Pendiente | El prompt de Carlos informa una auditoría en Chrome sobre `9d1afbd`, pero no aporta fecha, versión de Chrome, sistema operativo, nombre del ejecutor ni resultados detallados. |
| MOB-04 | iPhone; modelo por confirmar | Instalar/actualizar la versión de la PR 37 y repetir el recorrido de actividades offline y sincronización. | La versión actualizada abre, permite jugar offline y sincroniza al volver la conexión. | Pendiente | Repetir en la versión de demo tras su integración. |
| MOB-05 | iPad; modelo por confirmar | Instalar/abrir la PWA, jugar actividades y repetir con modo avión. | La PWA abre y permite completar actividades sin conexión. | Pendiente | |
| MOB-06 | Tableta Android; modelo por confirmar | Instalar/abrir la PWA, jugar actividades y repetir con modo avión. | La PWA abre y permite completar actividades sin conexión. | Pendiente | |
| MOB-07 | Segundo dispositivo; modelo/sistema por confirmar | Completar una actividad en el primer dispositivo y comprobar el comportamiento al abrir el mismo progreso en el segundo. | El comportamiento de progreso queda documentado sin pérdida ni atribuciones incorrectas. | Pendiente | |
| MOB-08 | Un mismo dispositivo; dos navegadores por confirmar | Abrir MOCHILA en dos navegadores y comprobar por separado carga, actividad y almacenamiento local. | Ambos recorridos se comportan según lo esperado y no se confunde el almacenamiento entre navegadores. | Pendiente | |
| MOB-09 | iPhone; modelo/iOS por confirmar | En la versión de demo, activar el modo silencio y reproducir el audio de una actividad. | El resultado de audio queda comprobado y documentado con el modo silencio activado. | Pendiente | No probado en la demo. Antecedente: Rodrigo informó que en iPhone 17/iOS 27.2/Safari, commit `cee26cb`, el botón cambió a «Detener» sin que se oyera voz con silencio activado (2026-11-04; `qa/registro-pruebas.md`, «Voz local offline en Andes y Uganda»). |
| MOB-10 | Teléfono o tableta; modelo por confirmar | Cambiar la orientación durante una actividad y continuar. | El contenido sigue legible y se puede completar la actividad. | Pendiente | |
| MOB-11 | Teléfono o tableta; modelo por confirmar | Publicar una versión nueva, actualizar el service worker y volver a abrir la app. | Se carga la versión esperada sin dejar la app en un estado inconsistente. | Pendiente | |
| MOB-12 | Teléfono o tableta; modelo por confirmar | Reiniciar el dispositivo y abrir MOCHILA sin conexión. | La app abre y conserva el progreso local esperado. | Pendiente | |
| MOB-13 | Teléfono o tableta; modelo por confirmar | Usar la app, cerrar y volver a abrirla tras 24 horas. | La app abre y el progreso local esperado sigue disponible. | Pendiente | |
| MOB-14 | Teléfono o tableta; modelo por confirmar | Reducir el espacio disponible y abrir/usar MOCHILA. | El resultado ante poco espacio queda documentado; no se presenta como probado hasta ejecutar el caso. | Pendiente | |

## Alcance y límites

- MOB-01 y MOB-02 corresponden a `0900e78`; no acreditan la versión de la PR 37.
- MOB-03 permanece pendiente porque faltan metadatos y el informe de resultados. La referencia del prompt no basta para marcarla «Hecho» bajo el criterio de este plan.
- No hay aquí evidencia de pruebas en iPadOS o tableta Android, ni de pruebas con niños.
