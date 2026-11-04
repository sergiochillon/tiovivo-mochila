# Estado de la demo · actualización del 4 noviembre 2026

Responsable: Mario. Fuentes: mensajes de Sergio, Álex y Carlos trasladados por Mario y lectura del registro de QA en `origin/main` (`9d1afbd`). El asistente no ha ejecutado las pruebas de aplicación.

**Hay implementación y pruebas registradas del núcleo de la demo. La pasada final en la versión/servidor que se grabarán sigue pendiente. Mario ha fijado la grabación para mañana, jueves 5 de noviembre.**

## Versión y acceso

Álex propone `main`, commit `9d1afbd`. No hay una URL alojada estable. Para el iPhone se usará el túnel HTTPS temporal de [ADR-003](../docs/decisions/ADR-003-https-pruebas-movil.md). Antes de ensayar, dejar disponible el borrador sintético en el servidor. La demo no depende de una llamada nueva a Gemini.

## Contenido

Carlos propone `elige-lo-disponible`, del paquete `alimentacion-andes-es`. En el archivo de main consta revisión pedagógica aprobada por Carlos Herrero el 4 nov 2026. Uganda también tiene aprobación pedagógica. Validación cultural local y pruebas con niños pendientes. Una edición nueva requiere su revisión; el sello original no se hereda automáticamente.

## Evidencia y alcance

| Parte | Evidencia | Límite |
|---|---|---|
| Autoría y aprobación | Equipo informa que están en main; Álex propone abrir un borrador guardado y editar/aprobar | Confirmar origen y disponibilidad del borrador en el servidor elegido; el asistente no ejecutó este flujo |
| Ensayo servidor y panel | Sergio, MacBook Air, `e39c184`: descarga Andes/Uganda, actividad con API parada y sync 2/2 sin duplicar | API parada no equivale a modo avión; no es ensayo integrado de iPhone |
| Actividades y sync iPhone | Rodrigo, `0900e78`, iPhone 17/iOS 27.2/Safari: tres actividades Andes sin red; Wi-Fi y «Enviar progreso», 0/0 → 3/3 | No acredita Uganda ni una nueva versión sin repetir la prueba |
| PWA instalada | Rodrigo, mismo dispositivo/commit: instalación, cierre y reapertura desde el icono en modo avión | El arranque y la actividad/sync son registros separados |

Fuentes de detalle: [registro de QA](../qa/registro-pruebas.md), [lista del ensayo final](../qa/checklist-demo.md) y paquetes en `content/packs/`, leídos desde `origin/main`. Las pruebas anteriores no completan automáticamente la lista final.

## Recorrido propuesto para mañana

1. `/autoria`: borrador sintético guardado, edición acordada con Carlos, revisión y aprobación.
2. `/alumno?pack=<id>` con Wi-Fi: descargar el paquete aprobado que se va a usar.
3. iPhone: modo avión, Wi-Fi apagado, reabrir la PWA, avatar y actividad.
4. Recuperar Wi-Fi; `/docente`, «Enviar progreso» y contadores antes/después.

Reparto propuesto por Álex: Rodrigo guía el tramo técnico, Mario maneja el iPhone y graba, Álex prepara API y borrador. Confirmar versión, paquete final y contadores iniciales en una pasada completa; objetivo de 100 s para el pitch, todavía sin ensayo cronometrado. La grabación, el vídeo final y su enlace no existen todavía en esta entrega.
