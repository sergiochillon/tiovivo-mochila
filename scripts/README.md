# scripts/

- `diagnostico_mac.sh`: diagnóstico **de solo lectura** para macOS. No instala ni modifica nada. Léelo antes de ejecutarlo.
- `preflight-demo.mjs`: comprobación **de solo lectura** antes de enseñar la demo: Node, API (versión actual, tres paquetes aprobados, contadores de `DEMO-01`) y app (service worker y a qué API está compilada). Uso: `node scripts/preflight-demo.mjs` (con `API=` y `APP=` si usas otros puertos). Detecta, por ejemplo, una API antigua sin `GET /api/packs`.
- `validate-content.mts`: valida todos los paquetes de `content/packs/` (deben estar aprobados) y `content/drafts/` (deben ser borradores) contra `contracts/pack-v0.1.schema.json`, con el mismo validador que el servidor. Uso: `cd server && npx tsx ../scripts/validate-content.mts`. Lo ejecuta también la CI (`.github/workflows/calidad.yml`).
