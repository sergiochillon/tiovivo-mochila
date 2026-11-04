# content/ — paquetes revisados y reglas pedagógicas

**Dueño: Carlos.**
- `packs/`: paquetes JSON **revisados** (fuente de verdad del contenido). Un paquete solo es válido si cumple el esquema de `contracts/` y lleva `review.status = approved`.
- `drafts/`: propuestas en revisión. Se mantienen con `review.status = draft` y el seed no las carga; no mover a `packs/` ni aprobar hasta completar revisión y prueba en el reproductor.
- `rules/`: reglas pedagógicas y lista de revisión que usa el generador (vocabulario, tono, temas permitidos/prohibidos).
Sin datos personales. Solo contenido sintético o ilustrativo, marcado como tal.
