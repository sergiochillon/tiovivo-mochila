# GIT_WORKFLOW — cómo trabajamos en el repositorio (humanos e IAs)

Responsable: Sergio. Pensado para 5 personas y 2 jornadas: lo mínimo que evita pisarse. **Nadie asume tener acceso al repo hasta que se haya configurado y comprobado** (§9).

---

## 1. Repositorio

- **Nombre recomendado:** `tiovivo-mochila` (privado al inicio). Propietario: la cuenta de Sergio (único Mac con `gh` y auth confirmados).
- **Fuente de verdad:** este repo. Lo que no está en `main` o en una PR abierta no existe para el equipo.
- **Visibilidad:** las bases exigen enlace a GitHub/GitLab y licencia libre. El repositorio es **público desde el 5 nov 2026** (etiqueta `v1.0`); ver `docs/decisions/ADR-005-licencias-y-visibilidad.md`.

## 2. Ramas

- `main`: siempre ejecutable. Protegida. Nadie hace push directo.
- **Una rama por tarea, de vida corta (idealmente < 3 h)**, con prefijo por área:
  `app/<tarea>`, `server/<tarea>`, `content/<tarea>`, `pitch/<tarea>`, `docs/<tarea>`, `infra/<tarea>`.
  Ejemplos: `app/offline-shell`, `server/generate-endpoint`, `content/food-andes`.
- No hay `develop`. Menos ramas, menos conflictos.

## 3. Propiedad de carpetas (anti-colisión)

La regla central: **cada archivo tiene un dueño; solo el dueño (o su IA) lo edita.** Para tocar algo ajeno: Issue o aviso al dueño, y el dueño decide quién lo hace.

| Ruta | Dueño | Notas |
|---|---|---|
| `app/` | Rodrigo | Su propio `package.json` y lockfile |
| `server/` | Alejandro | Su propio `package.json`/`requirements` y lockfile |
| `content/`, `qa/` | Carlos | `content/packs/` es el contenido revisado: fuente de verdad |
| `pitch/`, `research/`, `docs/PRODUCT_BRIEF.md`, `docs/RESEARCH_AND_VALIDATION.md`, `docs/PITCH_AND_DEMO.md` | Mario | |
| `contracts/pack*` y esquema | Sergio | Cambios con aviso y aprobación de Rodrigo, Alejandro y Carlos |
| `contracts/sync-api.md` | Alejandro | Cambios con aviso a Rodrigo |
| `docs/` (resto), `README.md`, `.github/`, `scripts/` | Sergio | `docs/TASK_BOARD.md` solo lo edita Sergio (instantánea; el tablero vivo es GitHub Projects) |
| `docs/decisions/` | Quien decide | **Solo archivos nuevos** (nunca editar el ADR de otro) |

Archivos «calientes» que NO se tocan sin avisar: esquema del paquete, `README.md`, lockfiles ajenos, `.github/`, `.gitignore`.

El archivo `.github/CODEOWNERS` refleja esta tabla.

## 4. Pull Requests

- Toda integración a `main` va por PR. **PR pequeñas** (≤ ~300 líneas cuando sea posible).
- Antes de abrir: `git fetch origin && git merge origin/main` (o `git pull --rebase` si ya sabes usarlo) en tu rama; arrancar y probar lo tuyo.
- Plantilla en `.github/pull_request_template.md`: qué cambia, cómo se probó, qué toca de otros, si cambia una interfaz.
- **Revisión:** 1 aprobación. Revisor por defecto: **Sergio** (integrador). Las PR de Sergio las revisa **Alejandro**. Para PR de solo documentación/pitch/contenido basta una lectura rápida de cualquiera.
- **Plazo de revisión:** 15 minutos en horas de trabajo. Si no hay respuesta, avisar por el chat.
- **Fusión:** *squash and merge* y borrar la rama. Solo el integrador fusiona en los hitos; entre hitos puede fusionar cualquier revisor.
- Prohibido: *force push* a `main`; reescribir historia compartida.

## 5. Issues y tablero

- **GitHub Issues** para tareas, bloqueos y decisiones. Plantillas en `.github/ISSUE_TEMPLATE/`.
- **Etiquetas:** áreas `area:app`, `area:server`, `area:content`, `area:pitch`, `area:integration`; prioridad `P0-imprescindible`, `P1-importante`, `P2-prescindible`; `bloqueo`, `decision`.
- **Tablero:** GitHub Projects con columnas `Backlog · En curso · En revisión · Hecho · Bloqueado`. Si Projects no estuviera disponible en la cuenta, usar etiquetas de estado en Issues y la instantánea `docs/TASK_BOARD.md`.
- Cada PR enlaza su Issue (`Closes #n`).
- Un Issue = un responsable.

## 6. Commits

Convención sencilla (Conventional Commits, en español o inglés pero consistente):

```
tipo(área): resumen en imperativo

feat(app): añade pantalla de actividad tipo "choice"
fix(server): valida campo review.status
docs(pitch): primer guion de 5 minutos
content(pack): módulo alimentación Andes, borrador
chore(infra): añade plantilla de PR
```
Tipos: `feat`, `fix`, `docs`, `content`, `test`, `chore`, `refactor`. Commits frecuentes y pequeños; **dejan evidencia de desarrollo en los días del hackathon** (importa por la penalización del 20 % en la modalidad innovadora).

## 7. Gestión de conflictos

1. **Prevenir:** carpetas con dueño, ramas cortas, PR pequeñas, merge de `main` antes de empezar cada bloque.
2. **Si hay conflicto en tu rama:** lo resuelves tú, en tu máquina, tras `git merge origin/main`. Si el conflicto es en un archivo que no es tuyo: **para y avisa al dueño**; no «elijas el tuyo» sin hablar.
3. **Nunca** sobrescribir con tu versión el archivo de otra persona.
4. Si dudas, no ejecutes `reset --hard`, `push --force`, `checkout .` ni borres ramas ajenas.

## 8. Reglas de colaboración humanos e IAs

1. **Una IA trabaja para su dueño y solo en su carpeta.** La IA de Rodrigo no edita `server/`; la de Alejandro no edita `app/`.
2. **Nunca dos IAs ni dos personas editan el mismo archivo a la vez.** Antes de empezar un archivo compartido, comentar en el Issue «lo cojo».
3. **Contexto:** la IA debe leer `docs/PROJECT_CONTEXT.md` y `docs/TEAM_ROLES.md` (el humano le pega su contenido si la IA no tiene acceso al repo).
4. **No cambiar unilateralmente arquitectura, interfaces ni alcance.** Si la IA o el humano detecta un problema: abrir Issue/ADR, **proponer**, esperar aprobación del integrador.
5. **Interfaces** (esquema del paquete, API de sync): cambio solo por Issue + aviso a las áreas afectadas.
6. **Nada fuera del MVP** sin aprobación de Sergio (alcance) y Mario (si afecta al pitch).
7. **Nada de pago** sin autorización del equipo. **Nada de claves** en el repo ni en chats de IA. **Nada de datos personales reales de menores**: solo sintéticos.
8. **Las salidas de IA se verifican:** cifras con fuente, código ejecutado, contenido revisado por una persona. «No lo he comprobado» es una respuesta válida y esperable.
9. **Marcar autoría de IA no es obligatorio**, pero un commit con grandes bloques generados debe haber sido leído y probado por la persona que lo firma.
10. **Documentar decisiones** que afecten a otros en `docs/decisions/ADR-NNN-titulo.md` (contexto, decisión, alternativas, consecuencias, quién aprobó).

## 9. Puesta en marcha (lo hace Sergio; nadie más asume acceso antes)

> Estos pasos **no se han ejecutado todavía**. Los comandos están sin probar en vuestros equipos. Léelos antes de ejecutar y sustituye `SERGIO_USER` y los usuarios por los reales.

**Paso 0 — Comprobar el plan de la cuenta.** La protección de ramas **no está disponible en repos privados con GitHub Free** (según lo que hemos consultado en la comunidad de GitHub; confírmalo en Settings → Branches). Opciones:

- **A (preferida):** si la cuenta de Sergio tiene GitHub Pro activo (se ofrece gratis a estudiantes verificados vía GitHub Education; **comprobar que está activo**), la protección funciona en repo privado.
- **B:** repo **público** desde el principio (la licencia libre es obligatoria igualmente). Protección disponible, pero el código es visible durante el hackathon. Sin secretos ni datos personales.
- **C:** repo privado sin protección técnica. Se sustituye por disciplina: nadie hace push a `main`, solo el integrador fusiona. Frágil; no recomendado.

**Paso 1 — Crear el repositorio** (en el Mac de Sergio, tras `gh auth status` correcto):
```bash
gh auth status
cd ~/ruta/donde/guardar           # elige la carpeta
gh repo create tiovivo-mochila --private --description "MOCHILA · TIOVIVO.exe · Hack4Edu 2026" --clone
cd tiovivo-mochila
```
Copiar el contenido de `tiovivo-mochila/` del kit al repo, **revisar `git status`**, y:
```bash
git add .
git commit -m "docs: kit inicial de organización"
git push origin main
```
(El primer push a `main` se hace antes de activar la protección.)

**Paso 2 — Configurar fusiones** (solo squash, borrar ramas fusionadas):
```bash
gh repo edit --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge
```

**Paso 3 — Invitar colaboradores** (permiso de escritura). Cada persona debe darte antes su usuario de GitHub:
```bash
gh api -X PUT repos/SERGIO_USER/tiovivo-mochila/collaborators/USUARIO -f permission=push
```
Repetir por persona. Cada invitado debe **aceptar la invitación** (llega por correo o en github.com/notifications).

**Paso 4 — Proteger `main`.** Por la web: Settings → Branches → Add branch ruleset/rule para `main` → «Require a pull request before merging» (1 aprobación) → bloquear *force pushes* y borrado. O con la API:
```bash
gh api -X PUT repos/SERGIO_USER/tiovivo-mochila/branches/main/protection --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 1, "dismiss_stale_reviews": true },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```
`enforce_admins=false` permite a Sergio saltarse la regla en una emergencia. **Regla del equipo: no usarlo.**

**Paso 5 — Comprobar** (cada persona, antes de que su IA/agente asuma nada):
```bash
git clone https://github.com/SERGIO_USER/tiovivo-mochila.git   # o: gh repo clone SERGIO_USER/tiovivo-mochila
cd tiovivo-mochila
git switch -c docs/prueba-acceso
echo "prueba" > research/prueba-USUARIO.txt
git add . && git commit -m "chore: prueba de acceso" && git push -u origin docs/prueba-acceso
```
Y abrir una PR. Comprobar también que `git push origin main` **falla** (protección activa). Después se borra la rama de prueba. Hasta que esto funcione, **ninguna IA debe afirmar que tiene acceso al repo**.

**Paso 6 — GitHub Projects:** crear un proyecto «TIOVIVO MOCHILA» con las columnas indicadas y enlazar el repo. Si no estuviera disponible, usar etiquetas.

## 10. Qué hacer si el repo falla

Si GitHub, la red o la autenticación fallan en mitad de la jornada: trabajar en local con ramas, **no** copiar archivos por mensajería «a mano» al `main` de otro; esperar a poder hacer PR. Para la entrega, Sergio puede preparar un `.zip` del repo como respaldo.
