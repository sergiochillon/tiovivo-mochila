// Validates every package in content/ against contracts/pack-v0.1.schema.json (the same
// validator as the server). content/packs/ must be approved; content/drafts/ must be valid drafts.
// Run from the repo root: cd server && npx tsx ../scripts/validate-content.mts
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describeAjvErrors, validatePack } from "../server/src/validation.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
let failures = 0;
for (const [folder, status] of [["content/packs", "approved"], ["content/drafts", "draft"]] as const) {
  const files = (await readdir(root + folder)).filter((name) => name.endsWith(".json")).sort();
  for (const name of files) {
    const pack = JSON.parse(await readFile(root + folder + "/" + name, "utf8"));
    const problems = validatePack(pack) ? [] : describeAjvErrors(validatePack.errors);
    if (pack?.review?.status !== status) problems.push(`review.status debe ser «${status}» en ${folder}/`);
    console.log(`${problems.length ? "✗" : "✓"} ${folder}/${name}`);
    for (const problem of problems) console.log("    " + problem);
    failures += problems.length ? 1 : 0;
  }
}
if (failures) {
  console.error(`${failures} paquete(s) con errores`);
  process.exit(1);
}
