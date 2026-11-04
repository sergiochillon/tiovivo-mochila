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
  los servidores Vite de `localhost:5173` y `127.0.0.1:5173`).
- `MOCHILA_DATA_DIR`: directorio alternativo para el almacén JSON local.

El servidor crea `data/store.json` al guardar el primer borrador, aprobación o
lote de progreso. El directorio local está ignorado por Git. No hay paquetes
aprobados precargados en esta rama; el ejemplo del contrato está en `draft` y
no se sirve al reproductor.

## Endpoints

- `POST /api/generate`: valida JSON asistido y guarda un paquete como `draft`.
  Reenviar el ID actualiza el borrador; un paquete aprobado no se sobrescribe.
- `POST /api/review/approve`: registra revisor y fecha en el servidor.
- `GET /api/packs/:id`: devuelve solo paquetes aprobados.
- `POST /api/sync`: valida el lote completo, guarda de forma atómica e
  idempotente por `eventId`.
- `GET /api/progress/:classCode`: devuelve contadores agregados sin avatares.

El endpoint de generación no llama a un proveedor de IA. Las claves no son
necesarias para el flujo asistido y nunca se registran cuerpos de petición.

`npm run typecheck` comprueba los tipos TypeScript sin iniciar el servidor.
