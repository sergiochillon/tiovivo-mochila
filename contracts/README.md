# contracts/ — interfaces entre áreas

- `pack-v0.1.schema.json` (esquema del paquete y `ProgressEvent`): **dueño Sergio**; **borrador** hasta la congelación en el hito M1 (14:30 hoy, ADR-004). Aprueban Rodrigo, Alejandro y Carlos.
- `pack-example.json`: paquete sintético de ejemplo (`draft`, no apto para niños) para que `app/` y `server/` prueben sin esperar al generador.
- `sync-api.md` (API de generación, aprobación y sincronización): **dueño Alejandro**; valida Rodrigo.

Regla: los campos se **añaden**, no se renombran ni se quitan sin Issue + aviso a las áreas afectadas.
Estado: esquema validado con ajv 8.17.1 + ajv-formats (ejemplo y paquetes de Carlos incluidos); `sync-api.md` pendiente de subir al repo por Alejandro.
