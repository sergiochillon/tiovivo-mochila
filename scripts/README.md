# scripts/

- `diagnostico_mac.sh`: diagnóstico **de solo lectura** para macOS. No instala ni modifica nada. Léelo antes de ejecutarlo.
- `validate-content.mts`: valida todos los paquetes de `content/packs/` (deben estar aprobados) y `content/drafts/` (deben ser borradores) contra `contracts/pack-v0.1.schema.json`, con el mismo validador que el servidor. Uso: `cd server && npx tsx ../scripts/validate-content.mts`. Lo ejecuta también la CI (`.github/workflows/calidad.yml`).
