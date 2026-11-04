# ADR-005 · Licencias y visibilidad del repositorio

- **Fecha:** 2026-11-04
- **Estado:** aprobada (4 nov): ok de Rodrigo, Carlos, Mario y Sergio; Alejandro aprueba con las condiciones de esta revisión. **Versión decidida: CC BY-NC-SA 4.0**, porque la Base 9 dice «os recomendamos Creative Commons BY-NC-SA 3.0» (recomendación, no exigencia). Aplicada en `LICENSE`, `LICENSE-CONTENT.md` y `README.md`. Pendiente antes de publicar: revisión de secretos y datos personales en el historial.
- **Propone:** Sergio
- **Aprueba:** todo el equipo (los cinco son coautores y titulares de lo que licenciamos)

## Contexto
Las bases exigen liberar lo entregado con licencia libre: el código con cualquier licencia aprobada por opensource.org; para documentación y recursos, según nuestro resumen de las bases (`PROJECT_CONTEXT.md §1`), **se recomienda** CC BY-NC-SA 3.0. **Confirmado con el texto de las bases (Base 9):** «Para la documentación y assets os recomendamos Creative Commons BY-NC-SA 3.0». Es una recomendación. La entrega incluye un enlace a GitHub y vence el jueves 5 nov a las 23:59. Hoy el repositorio es privado.

No es asesoramiento jurídico: es la opción más simple que cumple lo que piden las bases, con sus límites explicados.

## Decisión propuesta
1. **Código** (`app/`, `server/`, `scripts/`) y **esquema** (`contracts/`): **MIT**.
2. **Documentación y contenido** (`docs/`, `content/`, `pitch/`, `research/`, `qa/`, ilustraciones SVG propias): **CC BY-NC-SA**, con esta regla para la versión:
   - si las bases solo la **recomiendan**, usamos **4.0** (Creative Commons considera la 3.0 una versión antigua y recomienda la 4.0 para obras nuevas; las condiciones BY, NC y SA son las mismas);
   - si las bases **exigen** la 3.0 literalmente, usamos **3.0**.
3. **Alcance:** las licencias cubren **solo el material cuyos derechos tiene el equipo**: lo escrito, dibujado o programado por sus cinco miembros. No cubren dependencias de terceros (cada una con su licencia), marcas, ni textos o imágenes ajenos. El borrador generado con IA (Gemini) se trata como contenido del equipo solo después de que una persona del equipo lo revise y edite; no afirmamos derechos sobre lo que el proveedor de IA reclame.
4. **Visibilidad:** el repositorio se hace **público el jueves antes de la entrega**, tras comprobar que no hay secretos ni datos personales en el historial. Si la sede confirma que acepta un repositorio privado compartido con el jurado, se puede mantener privado (pendiente de preguntar).

## Qué permite y qué no la cláusula NC (matizado)
- La licencia regula lo que pueden hacer **terceros**. El equipo, como titular, **no queda limitado por la licencia que concede**: puede usar su propio contenido en servicios pagados de adaptación, formación y soporte, o licenciarlo de otra forma a un socio, siempre que estén de acuerdo los cinco coautores.
- En cambio, **un tercero** (por ejemplo, una ONG o una empresa) **no puede** usar nuestro contenido en algo principalmente dirigido a obtener ventaja comercial o compensación económica sin nuestro permiso. Si un socio quiere incluirlo en un programa de pago, hará falta un permiso o una licencia aparte del equipo.
- Esto encaja con el modelo de servicios de Mario, pero conviene decirlo así en el pitch: «el contenido es abierto para uso no comercial; los usos comerciales se acuerdan con el equipo».

## Pasos al aprobarla (Sergio, en una PR)
- Añadir `LICENSE` (MIT, titulares: los cinco miembros de TIOVIVO.exe) y `LICENSE-CONTENT.md` (CC BY-NC-SA en la versión decidida, con el enlace oficial al texto legal y la lista de carpetas que cubre).
- Añadir la sección «Licencia» al `README.md`: qué cubre cada licencia, qué queda fuera (terceros) y la nota sobre usos comerciales.
- Revisar las licencias de las dependencias (Vite, vite-plugin-pwa, ajv, ajv-formats, Express, tsx, TypeScript, dotenv): **pendiente de comprobar**; hasta donde sabemos son permisivas y compatibles con MIT.
- Revisión de secretos y datos personales en todo el historial antes de publicar (incluido que `server/.env` nunca se haya subido).
- Cambiar la visibilidad en GitHub (Settings → General → Danger Zone). Lo hace Sergio, como propietario, con el visto bueno del equipo.

## Alternativas consideradas
1. **Apache-2.0 para el código:** añade una cláusula de patentes; más larga y sin ventaja clara para un prototipo.
2. **CC BY-SA 4.0 para el contenido (sin NC):** más abierta y facilitaría que socios lo usen en programas de pago, pero se aparta de lo que recomiendan las bases.
3. **Mantener el repositorio privado:** depende de que la sede lo acepte; sin confirmar.

## Consecuencias
- Cumplimos el requisito de licencia libre de las bases.
- NC limita a terceros, no al equipo; los socios que quieran uso comercial necesitarán un acuerdo con el equipo.
- Hacer público el repositorio expone todo el historial: por eso la revisión de secretos es obligatoria antes.
