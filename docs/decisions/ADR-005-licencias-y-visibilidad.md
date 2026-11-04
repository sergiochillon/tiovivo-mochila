# ADR-005 · Licencias y visibilidad del repositorio

- **Fecha:** 2026-11-04
- **Estado:** propuesta (necesita el visto bueno de los cinco antes de aplicarla; P-08)
- **Propone:** Sergio
- **Aprueba:** todo el equipo

## Contexto
Las bases exigen liberar lo entregado con licencia libre: el código con cualquier licencia aprobada por opensource.org y, para documentación y recursos, recomiendan CC BY-NC-SA 3.0. La entrega incluye un enlace a GitHub y vence el jueves 5 nov a las 23:59. Hoy el repositorio es privado.

No es asesoramiento jurídico: es la opción más simple que cumple lo que piden las bases.

## Decisión propuesta
1. **Código** (`app/`, `server/`, `scripts/`): **MIT**. Es corta, la entiende cualquiera y está aprobada por la OSI.
2. **Documentación y contenido** (`docs/`, `content/`, `pitch/`, `research/`, `qa/`, ilustraciones SVG propias): **CC BY-NC-SA 3.0**, como recomiendan las bases.
3. **Esquema** (`contracts/`): MIT, como el código, para que cualquiera pueda reutilizar el formato.
4. **Visibilidad:** el repositorio se hace **público el jueves antes de la entrega**, después de comprobar que no hay secretos ni datos personales. Si la sede confirma que acepta un repositorio privado compartido con el jurado, se puede mantener privado (pendiente de preguntar).

## Pasos al aprobarla (Sergio, en una PR)
- Añadir `LICENSE` (MIT, titulares: los cinco miembros de TIOVIVO.exe) y `LICENSE-CONTENT.md` (CC BY-NC-SA 3.0, con el enlace oficial al texto legal).
- Añadir la sección «Licencia» al `README.md`, explicando qué cubre cada una.
- Revisar las licencias de las dependencias (Vite, vite-plugin-pwa, ajv, ajv-formats, Express, tsx, TypeScript): **pendiente de comprobar**; hasta donde sabemos son licencias permisivas compatibles con MIT.
- Comprobación de secretos y datos personales antes de publicar: buscar claves y `.env` en el historial, confirmar que solo hay datos sintéticos.
- Cambiar la visibilidad en GitHub (Settings → General → Danger Zone). Lo hace Sergio, como propietario, con el visto bueno del equipo.

## Alternativas consideradas
1. **Apache-2.0 para el código:** añade una cláusula de patentes; más larga y sin ventaja clara para un prototipo.
2. **CC BY-SA 4.0 para el contenido:** más abierta (permite uso comercial) y más actual, pero las bases recomiendan la 3.0 NC; nos ceñimos a lo recomendado.
3. **Mantener el repositorio privado:** depende de que la sede lo acepte; sin confirmar.

## Consecuencias
- Cumplimos el requisito de licencia libre de las bases.
- «NC» impide que terceros usen el contenido con fines comerciales sin permiso; no impide que el equipo ofrezca servicios de adaptación, formación y soporte (modelo de Mario). Si en el futuro un socio lo necesita, el equipo puede relicenciar su propio contenido.
- Hacer público el repositorio expone todo el historial: por eso la comprobación de secretos es obligatoria antes.
