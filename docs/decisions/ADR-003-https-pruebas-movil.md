# ADR-003 · HTTPS para probar en móvil

- **Fecha:** 2026-11-04
- **Estado:** aprobada (método de pruebas; no es un despliegue)
- **Propone:** Sergio, con Rodrigo
- **Aprueba:** Sergio (integrador) + Rodrigo (dueño de `app/`); afecta a Alejandro (`server/`)

## Contexto
El service worker y la instalación como PWA exigen HTTPS en el iPhone (salvo `localhost`). Para probar la app sin conexión en un móvil real hace falta servirla por HTTPS. HTTPS local con certificado propio obliga a instalar y confiar en un perfil en el iPhone. No hay presupuesto ni hosting contratado.

## Decisión
Para las pruebas en móvil se usa un **túnel temporal de Cloudflare (`cloudflared tunnel --url`, gratuito y sin cuenta)** desde el Mac que sirve la compilación:

1. `npm run build` (compilación de demo; `/revision` desactivada) y `npm run preview` en el Mac.
2. El túnel apunta **solo a la vista previa de la app**, nunca directamente al servidor.
3. Para probar la sincronización, la vista previa arranca con `MOCHILA_IPHONE_PROXY=1`, un proxy que reenvía al servidor **únicamente** `GET /api/packs/:id` (solo sirve aprobados), `POST /api/sync` y `GET /api/progress/DEMO-01`. `generate`, `approve` y cualquier otra ruta o método quedan bloqueados (comprobado por Rodrigo y por Sergio en local).
4. La API se arranca con datos de prueba sintéticos en una carpeta aparte y con `CORS_ORIGINS=https://<url>.trycloudflare.com`. Sin esa variable, `POST /api/sync` responde `403 origin_not_allowed`, porque el navegador envía `Origin` en los POST (comprobado por Sergio en local con el origen de la vista previa).
5. El túnel es temporal: no se reinicia durante una prueba (la URL cambia y el service worker queda ligado a la URL anterior), no se comparte la URL y se cierra al terminar.

## Resultados hasta ahora
- **Reapertura sin red en iPhone:** iPhone 17, iOS 27.2, Safari, commit `24f7cf2`, ruta `/revision`: con HTTPS se completó una actividad; en modo avión, al reabrir la misma URL se recuperó el progreso (ejecutó Rodrigo; registrado en `qa/registro-pruebas.md`).
- **Sin probar todavía en móvil:** completar una actividad nueva sin red, la descarga del paquete aprobado y la sincronización al volver la red.

## Alternativas consideradas
1. HTTPS local con certificado propio (mkcert): funciona, pero exige instalar y confiar en un certificado en cada iPhone. Descartada para la demo.
2. Hosting estático gratuito (GitHub Pages u otro): sirve la app, pero no la API, y publica el contenido en una URL estable. Queda como plan B si el túnel falla.
3. VPS Oracle del equipo: opcional por norma del proyecto; nada crítico puede depender de él.

## Consecuencias
- Mejora: prueba real en iPhone sin coste ni cuentas.
- Empeora: depende de la red del Mac y del servicio de Cloudflare durante la carga inicial; la URL cambia en cada arranque.
- Seguridad: la API no tiene autenticación; por eso nunca se expone directamente y el proxy limita las rutas. Solo datos sintéticos.
- Para la presentación: la demo debe llevar la app ya cargada en el dispositivo antes de ir sin red, y un vídeo de respaldo.
