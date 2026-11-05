# MOCHILA server

Backend Node + TypeScript para autoría asistida, aprobación, paquetes y progreso.
El contrato HTTP está en `../contracts/sync-api.md`; los paquetes se validan con
`../contracts/pack-v0.1.schema.json`.

## Arranque local

```sh
npm install
npm run dev
```

Por defecto escucha en `http://127.0.0.1:3001`. Configuración opcional:

- `PORT`: puerto HTTP (por defecto `3001`).
- `HOST`: interfaz de escucha (por defecto `127.0.0.1`).
- `CORS_ORIGINS`: lista separada por comas de orígenes permitidos (por defecto
  Vite en `localhost:5173`, `127.0.0.1:5173`, `localhost:4173` y
  `127.0.0.1:4173`).
- `MOCHILA_DATA_DIR`: directorio alternativo para el almacén JSON local.
- `GEMINI_API_KEY`: clave opcional del servidor para generación asistida con Gemini.
- `GEMINI_MODEL`: modelo Gemini opcional (por defecto `gemini-3.5-flash`, probado en la API gratuita).

El servidor crea `data/store.json` al guardar el primer borrador, aprobación o
lote de progreso. El directorio local está ignorado por Git. No hay paquetes
aprobados precargados en esta rama; el ejemplo del contrato está en `draft` y
no se sirve al reproductor.

Después de que Carlos apruebe paquetes en `content/packs/`, cárgalos antes de
arrancar el servidor:

```sh
npm run seed:approved-packs
npm start
```

El comando valida cada archivo con pack-v0.1, importa solo los que ya tienen
`review.status: "approved"` y sello válido, y omite los `draft`. Nunca cambia
el estado de revisión. Si usas `MOCHILA_DATA_DIR`, ejecuta la carga y el
servidor con el mismo valor.

## Endpoints

- `POST /api/generate`: valida JSON asistido y guarda un paquete como `draft`.
  Reenviar el ID actualiza el borrador; un paquete aprobado no se sobrescribe.
- `GET /api/prompt?country=...&region=...&language=es&foods=...`: construye la
  plantilla con las reglas pedagógicas y el contexto. Repite `foods` para varios
  alimentos. Devuelve `422` si falta contexto o excede los límites.
- `POST /api/generate/ai`: recibe `{ "context": { "country", "region",
  "language", "foods": [] } }`, llama a Gemini desde el servidor, valida la
  respuesta con pack-v0.1 y guarda el resultado como `draft`. `GEMINI_API_KEY`
  nunca se envía al cliente; si falta, devuelve `503 ai_not_configured`.
- `GET /api/drafts/:id`: recupera solo borradores para edición; paquetes
  aprobados o IDs inexistentes devuelven `404`.
- `POST /api/review/approve`: registra revisor y fecha en el servidor.
- `GET /api/packs`: devuelve `{ packs: [...] }` con los paquetes aprobados,
  ordenados por id; los borradores no se incluyen.
- `GET /api/packs/:id`: devuelve un paquete aprobado concreto.
- `POST /api/sync`: valida el lote completo, guarda de forma atómica e
  idempotente por `eventId`.
- `GET /api/progress/:classCode`: devuelve contadores agregados sin avatares.

El `POST /api/generate` original conserva el flujo de JSON pegado y validado.
La llamada opcional a Gemini envía únicamente el contexto indicado y las reglas
pedagógicas. En el nivel gratuito, Google puede usar el contenido enviado para
mejorar sus productos; usa solo contextos sintéticos o no personales. Las claves
se guardan en `server/.env` (ignorado por Git) y nunca se registran cuerpos de
petición. Ninguna generación se aprueba automáticamente.

`npm run typecheck` comprueba los tipos TypeScript sin iniciar el servidor.
