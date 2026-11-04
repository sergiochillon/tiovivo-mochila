import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { canonicalJson, describeAjvErrors, validatePack } from "./validation.js";
import { snapshot, transact, type Pack } from "./store.js";

const packsDirectory = fileURLToPath(new URL("../../content/packs/", import.meta.url));

async function main(): Promise<void> {
  const files = (await readdir(packsDirectory)).filter((file) => file.endsWith(".json")).sort();
  const approved: Pack[] = [];
  const skipped: string[] = [];
  const ids = new Set<string>();

  for (const file of files) {
    const path = fileURLToPath(new URL(`../../content/packs/${encodeURIComponent(file)}`, import.meta.url));
    let value: unknown;
    try {
      value = JSON.parse(await readFile(path, "utf8"));
    } catch (error) {
      throw new Error(`${file}: no se pudo leer el JSON (${String(error)})`);
    }

    if (!validatePack(value)) {
      throw new Error(`${file}: no cumple pack-v0.1: ${describeAjvErrors(validatePack.errors).join("; ")}`);
    }
    const pack = value as Pack;
    if (pack.review.status !== "approved") {
      skipped.push(`${file} (${pack.review.status})`);
      continue;
    }
    if (ids.has(pack.id)) throw new Error(`ID de paquete repetido en content/packs: ${pack.id}`);
    ids.add(pack.id);
    approved.push(pack);
  }

  if (approved.length === 0) {
    console.info(`No hay paquetes aprobados para cargar. Omitidos: ${skipped.join(", ") || "ninguno"}.`);
    return;
  }

  const current = await snapshot();
  for (const pack of approved) {
    const existing = current.packs.get(pack.id);
    if (existing?.review.status === "approved" && canonicalJson(existing) !== canonicalJson(pack)) {
      throw new Error(`El paquete aprobado ${pack.id} ya existe en la caché con otro contenido; no se sobrescribe.`);
    }
  }

  const imported = await transact((state) => {
    let count = 0;
    for (const pack of approved) {
      const existing = state.packs.get(pack.id);
      if (existing?.review.status === "approved") continue;
      state.packs.set(pack.id, pack);
      count += 1;
    }
    return { value: count, changed: count > 0 };
  });

  console.info(`Paquetes aprobados cargados en caché: ${imported}.`);
  if (skipped.length > 0) console.info(`Paquetes no aprobados omitidos: ${skipped.join(", ")}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Falló la carga de paquetes aprobados.");
  process.exitCode = 1;
});
