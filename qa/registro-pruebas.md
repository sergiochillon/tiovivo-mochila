# Registro de pruebas — MOCHILA

Un resultado solo se registra si la prueba se ejecutó. Cuando el registro se redacta a partir del informe de otra persona, se indica quién ejecutó la prueba y quién comunicó el resultado.

## 2026-11-04 — Bloqueo de paquetes en borrador

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** MacBook Air (modelo no especificado).
- **Navegador:** Chrome 156.
- **Servidor:** servidor local disponible durante la prueba.
- **Ruta:** `/alumno`.
- **Paquetes:** `content/packs/food-andes-es.json` y `content/packs/food-northern-uganda-en.json` (PR #6, commit `fbc66bf`); ambos con `review.status: "draft"`.
- **Resultado observado:** en ambos casos se mostró «Este material está pendiente de revisión»; no aparecieron botones ni preguntas.
- **Resultado:** correcto para el alcance probado: los paquetes en borrador quedan bloqueados para el alumno.
- **Límite:** la prueba se realizó con el servidor local disponible. No comprueba modo avión, caché offline, reapertura sin red, progreso local ni sincronización.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026. Indicó que el detalle estaba en `app/README.md`, pero esa sección no aparece en la copia de `app/README.md` revisada por Carlos al preparar este registro.

## 2026-11-04 — Actividad disponible en `/alumno` con copia aprobada temporal

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** MacBook Air (modelo y versión de sistema no especificados).
- **Navegador:** Chrome 156, modo headless.
- **Servidor:** servidor local disponible durante la prueba.
- **Ruta:** `/alumno`.
- **Paquete:** copia temporal del ejemplo técnico de PR #5, modificada para la prueba con `review.status: "approved"`, revisor sintético y fecha sintética. La copia se eliminó al terminar; los paquetes originales de PR #6 siguen en `draft`.
- **Acciones y resultado observado:** eligió el avatar Zorro, respondió la pregunta del plato y apareció «¡Buen trabajo, Zorro!».
- **Resultado:** correcto para el alcance probado: el reproductor deja jugar una actividad con una copia que cumple el estado aprobado.
- **Límite:** no prueba el proceso real de autoría, revisión humana ni aprobación del paquete; tampoco prueba modo avión, persistencia de progreso o sincronización.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026.

## 2026-11-04 — Reapertura y progreso local con el servidor parado

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** MacBook Air con macOS 26.5.1.
- **Navegador:** Safari 26.5, ventana privada.
- **Ruta:** `/revision`.
- **Paquete:** ejemplo técnico de PR #5.
- **Versión probada:** frontend local de `app/esqueleto` sobre `b92c0fb`; bundle `index-DBaVmX1j.js`.
- **Acciones y resultado observado:** detuvo el servidor y comprobó que su dirección ya no respondía; recargó la app, recuperó el resultado de Colibrí, completó la actividad con Zorro y volvió a recargar. Zorro conservó su resultado.
- **Resultado:** correcto para el alcance probado: la aplicación reabre y conserva progreso local en Safari con el servidor inaccesible.
- **Límite:** servidor parado no equivale a una prueba física de modo avión en móvil. No comprueba el recorrido integrado de autoría, aprobación, exportación ni sincronización.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026.

## 2026-11-04 — Reapertura en modo avión y recuperación de progreso en iPhone

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** iPhone 17 con iOS 27.2.
- **Navegador:** Safari.
- **Conexión y URL:** comenzó con Wi-Fi y HTTPS; después activó modo avión, cerró la pestaña y reabrió la misma URL.
- **URL usada:** `https://jam-rush-seeking-copied.trycloudflare.com/revision` (túnel temporal, ya cerrado; no es una URL vigente).
- **Ruta:** `/revision`.
- **Versión probada:** commit `24f7cf2`.
- **Actividad y progreso:** completó una actividad con el avatar Zorro antes de desconectar. No se especificó el paquete utilizado.
- **Acciones y resultado observado:** al reabrir en modo avión apareció el selector de avatares; al elegir Zorro, se recuperó «¡Buen trabajo, Zorro!».
- **Resultado:** correcto para el alcance probado: la app reabre sin red y recupera el progreso guardado localmente.
- **Límite:** la actividad se completó antes de desconectar. Esta prueba no demuestra que se pueda completar una actividad nueva offline ni que la sincronización funcione al volver la red.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026.

## 2026-11-04 — Ensayo integrado de carga, uso local y sincronización

- **Ejecutó:** Sergio, con apoyo de un asistente de IA.
- **Registro preparado por:** Carlos, a partir del informe de Sergio.
- **Dispositivo:** MacBook Air.
- **Navegador:** navegador integrado, tamaño de viewport móvil; versión no indicada.
- **Entorno:** API local con datos de prueba y `CORS_ORIGINS`; proxy HTTPS de ADR-003.
- **Versión probada:** `main` en `e39c184`.
- **Paquetes:** seed cargó los dos paquetes aprobados; Andes y Uganda se descargaron desde `/alumno`.
- **Acciones y resultado observado:** con la API parada, se reabrió Andes desde la copia local y se completó una actividad nueva. El envío sin API conservó el progreso. Al volver a iniciar la API, se confirmaron 2 eventos y el panel mostró 2/2. Al reenviar, no se crearon duplicados.
- **Resultado:** correcto para el recorrido integrado de descarga, actividad local, cola y sincronización con API disponible.
- **Límite:** no fue modo avión real; el navegador no registró un service worker. No se probó el recorrido integrado en un iPhone. La prueba anterior en iPhone solo cubrió reapertura y recuperación de un resultado completado antes de desconectar.
- **Fuente del registro:** mensaje de Sergio del 4 nov 2026.

## 2026-11-04 — Actividad nueva en modo avión y sincronización desde iPhone

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** iPhone 17 con iOS 27.2.
- **Navegador:** Safari.
- **Conexión:** abrió la app con Wi-Fi y HTTPS; activó modo avión y apagó el Wi-Fi antes de elegir avatar y empezar la actividad.
- **Rutas:** `/alumno` y, al recuperar la conexión, `/docente`.
- **Versión probada:** commit `5afc92a`.
- **Paquete:** paquete sintético aprobado `qa-iphone-nuevo`; no son los paquetes reales de Andes o Uganda.
- **Acciones y resultado observado:** eligió Zorro, abrió «¿Qué plato tiene más colores?», respondió sin conexión y vio «¡Buen trabajo, Zorro!». Al volver el Wi-Fi, pulsó «Enviar progreso» una vez. En `DEMO-01`, los contadores pasaron de 0 eventos/0 actividades a 1 evento/1 actividad; la API confirmó el mismo resultado.
- **Resultado:** correcto para el alcance probado: se completa una actividad nueva en modo avión y se sincroniza al recuperar la conexión.
- **Límite:** se probó un paquete sintético y un evento. No es una prueba con el contenido Andes/Uganda ni con varios eventos.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026.

## 2026-11-04 — Tres actividades del paquete Andes en modo avión y sincronización

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** iPhone 17.
- **Navegador:** Safari en iOS 27.2.
- **Conexión:** cargó `/alumno` por Wi-Fi; luego activó modo avión antes de elegir avatar y empezar las actividades.
- **Ruta de sincronización:** `/docente` al recuperar Wi-Fi.
- **Versión probada:** commit `0900e78`.
- **Paquete:** `alimentacion-andes-es`, con revisión pedagógica aprobada; la validación cultural local sigue pendiente.
- **Acciones y resultado observado:** con Zorro completó sin red la historia de Ana, la elección de papa y habas y la ordenación del lavado de manos. La pantalla mostró «Tus sellos: 3 de 5». En `/docente`, los contadores empezaron en 0 eventos/0 actividades; tras pulsar «Enviar progreso» una vez, pasaron a 3/3. La API confirmó el resultado.
- **Resultado:** correcto para el alcance probado: tres actividades del paquete Andes se completan en modo avión y se sincronizan al recuperar Wi-Fi.
- **Límite:** no prueba el paquete de Uganda ni sustituye la validación cultural local o pruebas con niños.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026.

## 2026-11-04 — Instalación de la PWA y arranque desde el icono sin conexión

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** iPhone 17 con iOS 27.2.
- **Navegador:** Safari.
- **Versión probada:** commit `0900e78`.
- **Paquete:** `alimentacion-andes-es`, con revisión pedagógica aprobada; la validación cultural local sigue pendiente.
- **Instalación y conexión:** añadió MOCHILA a la pantalla de inicio desde Safari. Con Wi-Fi, abrió la app desde el icono y apareció «¿Quién va contigo?» sin barra de direcciones.
- **Acciones y resultado observado:** activó el modo avión, comprobó que el Wi-Fi estaba apagado, cerró la app desde el selector y la volvió a abrir desde el icono. Volvió a cargar el selector de avatar.
- **Resultado:** correcto para el alcance probado: la PWA instalada abre desde el icono y vuelve a mostrar su pantalla inicial en modo avión.
- **Límite:** esta prueba acredita instalación y arranque offline; no prueba completar una actividad nueva ni sincronizar progreso. Esas acciones constan en la prueba Andes anterior.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026, 18:10.

## 2026-11-04 — Voz local offline en Andes y Uganda

- **Ejecutó:** Rodrigo.
- **Registro preparado por:** Carlos, a partir del informe de Rodrigo.
- **Dispositivo:** iPhone 17 con iOS 27.2.
- **Navegador:** Safari.
- **Versión probada:** commit `cee26cb` (PR #34).
- **Paquetes:** `alimentacion-andes-es` y `food-northern-uganda-en`, ambos con revisión pedagógica aprobada; la validación cultural local sigue pendiente.
- **Conexión:** cargó cada paquete con Wi-Fi; después activó modo avión y apagó Wi-Fi antes de reproducir la historia.
- **Acciones y resultado observado:** pulsó «Escuchar» en Andes y «Listen» en Uganda. Oyó la narración en español e inglés, respectivamente, sin conexión.
- **Resultado:** correcto para el alcance probado: la primera historia de cada paquete reproduce voz en el idioma del paquete sin red.
- **Incidencia/condición para la demo:** con el modo silencio del iPhone activado (campana tachada), el botón cambiaba a «Detener», pero no se oía voz. Rodrigo recomienda dejar el modo silencio desactivado durante la demo.
- **Límite:** solo se probó la primera historia de cada paquete. La validación cultural local y las pruebas con niños siguen pendientes.
- **Fuente del registro:** mensaje de Rodrigo del 4 nov 2026.

## 2026-11-05 — Arranque en frío sin servidor en Safari (simulador de iPhone)

- **Ejecutó:** Sergio, con un asistente de IA sobre el Simulator de Xcode. **No es un dispositivo físico.**
- **Dispositivo:** simulador iPhone 16, iOS 18.5, Safari (WebKit real). No cubre modo avión real, la voz, el modo silencio ni el hardware.
- **Versión probada:** `main` en `8675115` (compilada contra una API local temporal con los tres paquetes aprobados; datos temporales, borrados después).
- **Conexión:** con la API y el servidor de la app encendidos (`localhost`), abrió «Mis mochilas», entró en «Elegimos con lo que hay» (Andes) y eligió Zorro; abrió la actividad 1 (historia). Después **paró API y servidor** y **cerró Safari del todo** (`simctl terminate`).
- **Acciones y resultado observado:** al volver a abrir `http://localhost:…/` sin ningún servidor, la app cargó entera; «Mis mochilas» mostró Andes como «✓ Lista sin conexión» (la mochila de Uganda, nunca abierta, seguía sin ese sello); al abrir Andes sin red aparecieron los seis exploradores. El botón de sonido, la cabecera con la Dynamic Island y la nota «Paisaje ilustrativo…» se ven bien.
- **Resultado:** correcto para el alcance probado: **el arranque en frío sin servidor funciona en WebKit real** (service worker y paquete guardado en IndexedDB).
- **Límites:** no se completó la actividad sin red ni se probó el envío del progreso; el service worker de `localhost` no demuestra HTTPS ni la instalación desde el icono de inicio; no sustituye la prueba en el iPhone de demo (hoja `ensayo-final-iphone.md`).
- **Tableta (mismo día, mismo método):** simulador iPad (A16), iOS 18.5, Safari, en horizontal: `/alumno?pack=alimentacion-andes-es` muestra el paisaje a la izquierda y la elección de explorador a la derecha (el diseño de tableta de `DESIGN.md` §8), con los seis exploradores y sin desbordes. Solo una captura; no se jugó ninguna actividad.
- **Hallazgo:** en 393 pt la fila «Tus pegatinas: 0 de 5» partía los cinco puntos en 4 + 1; corregido en la PR de esta rama (la fila baja entera).
