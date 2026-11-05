// Comprobación previa a la demo: ¿está todo listo para enseñar MOCHILA? Solo lee; no cambia nada.
// Uso (con la API y la vista previa arrancadas):  node scripts/preflight-demo.mjs
// Opcional: API=http://127.0.0.1:3001 APP=http://127.0.0.1:4173 node scripts/preflight-demo.mjs
const API = process.env.API ?? "http://127.0.0.1:3001";
const APP = process.env.APP ?? "http://127.0.0.1:4173";
const NEEDED = ["alimentacion-andes-es", "expedicion-mercado-9-12-es", "food-altiplano-es", "food-northern-uganda-en", "kitchen-missions-5-8-en", "misiones-cocina-5-8-es"];

let failures = 0;
const ok = (text) => console.log(`  ✓ ${text}`);
const bad = (text, how) => { failures += 1; console.log(`  ✗ ${text}\n      → ${how}`); };
const get = async (url) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return { status: response.status, text: await response.text() };
  } catch (error) {
    return { status: 0, text: String(error.cause?.code ?? error.message) };
  }
};

console.log("MOCHILA · comprobación previa a la demo\n");

const [major, minor] = process.versions.node.split(".").map(Number);
if (major > 22 || (major === 22 && minor >= 12)) ok(`Node ${process.versions.node}`);
else bad(`Node ${process.versions.node} es demasiado antiguo`, "instala Node 22.12 o superior (Vite 7 lo necesita)");

console.log(`\nAPI (${API})`);
const packs = await get(`${API}/api/packs`);
if (packs.status === 404) {
  bad("la API responde pero es una versión antigua (no tiene GET /api/packs)", "párala (Ctrl+C) y arráncala de nuevo con el código actual: cd server && npm start");
} else if (packs.status !== 200) {
  bad("la API no responde", "arráncala: cd server && npm start (y antes, con ella parada, npm run seed:approved-packs)");
} else {
  const ids = JSON.parse(packs.text).packs.map((pack) => pack.id);
  ok(`responde; paquetes aprobados: ${ids.length}`);
  const missing = NEEDED.filter((id) => !ids.includes(id));
  if (missing.length) bad(`faltan paquetes aprobados: ${missing.join(", ")}`, "para la API, ejecuta npm run seed:approved-packs en server/ y vuelve a arrancarla");
  else ok(`están los ${NEEDED.length} paquetes aprobados de content/packs/`);
  const extra = ids.filter((id) => !NEEDED.includes(id));
  if (extra.length) console.log(`  ! hay otros paquetes aprobados que saldrán en «Mis mochilas»: ${extra.join(", ")}\n      → si no son de la demo, borra server/data/store.json con la API parada y vuelve a ejecutar npm run seed:approved-packs`);
  const progress = await get(`${API}/api/progress/DEMO-01`);
  if (progress.status === 200) {
    const { eventsReceived, activitiesCompleted } = JSON.parse(progress.text);
    console.log(`  · contadores de DEMO-01 ahora: ${eventsReceived} eventos, ${activitiesCompleted} actividades${eventsReceived ? " (si quieres empezar de 0, reinicia los datos)" : ""}`);
  }
}

console.log(`\nApp (${APP})`);
const home = await get(`${APP}/`);
if (home.status !== 200) bad("la vista previa no responde", "cd app && VITE_API_BASE_URL=http://127.0.0.1:3001/api npm run build && npm run preview -- --host 127.0.0.1 --port 4173");
else {
  ok("responde");
  const sw = await get(`${APP}/sw.js`);
  if (sw.status === 200) ok("service worker presente (funcionará sin conexión)");
  else bad("no hay service worker", "compila con npm run build (no vale npm run dev)");
  const script = home.text.match(/assets\/index-[^"]+\.js/)?.[0];
  if (script) {
    const bundle = await get(`${APP}/${script}`);
    const baked = bundle.text.match(/https?:\/\/[0-9a-z.:-]+\/api/)?.[0];
    if (!baked) console.log("  · compilada con API relativa (/api): solo vale con el proxy del iPhone (MOCHILA_IPHONE_PROXY=1)");
    else if (baked !== API + "/api") bad(`la app se compiló apuntando a ${baked}, no a ${API}/api`, "recompila con VITE_API_BASE_URL=" + API + "/api");
    else ok(`compilada contra ${baked}`);
  }
}

console.log(`\nIA (opcional)`);
console.log("  · el servidor no expone su clave; para saber si Gemini está activo, mira si «Generar propuesta con IA» responde en /autoria.\n    Para una demo en directo, ten preparado el Plan B (pegar un borrador JSON) y no dependas de Gemini.");

console.log(failures ? `\n${failures} problema(s) por resolver antes de la demo.` : "\nTodo listo. Recuerda: graba y enseña desde http://127.0.0.1:4173 (no localhost).");
process.exit(failures ? 1 : 0);
