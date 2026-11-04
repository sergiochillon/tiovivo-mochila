# TEAM_ROLES — responsabilidades, propietarios y dependencias

Responsable: Sergio. **La asignación es una recomendación basada en datos objetivos (estudios, herramientas, quién tiene el entorno Git listo) y en criterios explícitos donde no tenemos datos.** No sabemos las habilidades individuales de Mario, Alejandro y Carlos; ver §3.

---

## 1. Cinco responsabilidades

| # | Responsabilidad | Persona (recomendada) | Una frase |
|---|---|---|---|
| R1 | Producto, negocio, validación y pitch | **Rodrigo** | Que sepamos vender lo que construimos y que el problema exista |
| R2 | Coordinación técnica, arquitectura e integración | **Sergio** | Que todo encaje y `main` siempre funcione |
| R3 | Frontend, UX y PWA offline | **Mario** | Lo que ve y usa el niño y el docente |
| R4 | Backend, IA y sincronización | **Alejandro** | Generación con IA, validación y API de sync |
| R5 | Pedagogía, contenidos, adaptación cultural, offline y pruebas | **Carlos** | Que el contenido sea bueno, seguro y que la demo offline funcione de verdad |

## 2. Justificación de R1 y R2 (lo único con datos)

- **R1 → Rodrigo.** Tiene ADET (formación empresarial), ChatGPT Plus (investigación profunda y redacción) y **no necesita ninguna herramienta que otros no tengan**. Su trabajo no bloquea el Git de nadie. Su VPS es opcional.
- **R2 → Sergio.** Es el único Mac con Git, GitHub CLI, autenticación y VS Code confirmados; es quien crea el repositorio, invita y administra. Tiene Claude Code (revisión de PR, scaffolding, depuración difícil) y ha hecho la auditoría, así que conoce las decisiones. También tiene ADET.
- **Riesgo de esta recomendación:** Sergio concentra repositorio, arquitectura e integración (cuello de botella). Mitigaciones: Alejandro es segundo revisor de las PR de Sergio; las carpetas de dominio son de sus dueños; Sergio solo decide interfaces y alcance.
- **Criterio de intercambio R1↔R2** (si Sergio y Rodrigo lo prefieren): R1 va a quien presente con más soltura ante un jurado y tenga más experiencia vendiendo; R2 a quien integre repos con más soltura y esté dispuesto a ser el cuello de botella. **Hay que decidirlo en los primeros 10 minutos**, porque cambia el administrador del repo.

## 3. Justificación de R3, R4, R5 (sin datos individuales)

No tenemos información sobre las habilidades de Mario, Alejandro y Carlos. Los tres tienen **las mismas herramientas conocidas** (Mac M1 + ChatGPT Plus), así que **cambiar los roles entre ellos no cuesta nada en herramientas**. La asignación provisional es:

- **Mario → R3**, **Alejandro → R4**, **Carlos → R5**.

**Cómo confirmarla en 10 minutos** (en el arranque, de viva voz; si alguien discrepa se intercambian los prompts):

1. ¿Quién ha construido antes una app web con JavaScript/TypeScript, HTML/CSS y manejo de estado? → R3.
2. ¿Quién ha construido antes una API (Node/Python) y ha llamado a una API de un LLM o de terceros? → R4.
3. ¿Quién escribe mejor en español e inglés, tiene paciencia para revisar contenido y para probar en dispositivos? → R5.
4. Si dos personas cumplen el mismo criterio, **decide la preferencia personal**; si ambas coinciden, se prioriza que R4 sea la persona con mejor base de backend (el cuello de botella técnico más difícil de arreglar).

> R5 **no es un rol «menor»**: la calidad del contenido, la seguridad infantil y la prueba offline pesan en «uso ético» y «acabado», y son lo primero que se ve en la demo.

## 4. Propietarios y entregables

| Área | Propietario | Entregables | Criterio de hecho |
|---|---|---|---|
| Producto y negocio (`docs/PRODUCT_BRIEF.md`, `research/`) | Rodrigo | Mapa de usuarios y competencia, hipótesis con evidencia, 3–5 conversaciones de validación, modelo de negocio | Cada afirmación de mercado tiene fuente o está marcada como hipótesis |
| Pitch (`pitch/`) | Rodrigo | Guion de 5 min, diapositivas, guion del vídeo de 3 min, guion de demo | Ensayado 2 veces con cronómetro, ≤ 5:00 |
| Arquitectura e integración (`docs/`, `contracts/pack*`, `.github/`, `scripts/`) | Sergio | Esquema v0.1 congelado, repo configurado, `main` verde, tags | `main` arranca y pasa la prueba offline en cada hito |
| Frontend (`app/`) | Mario | Reproductor PWA, autoría (formulario y revisión), panel docente mínimo | Funciona en modo avión en ≥ 2 dispositivos |
| Backend/IA (`server/`, `contracts/sync-api.md`) | Alejandro | Generación validada, aprobación, sync, caché | Un paquete válido sale del generador y es aceptado por el front |
| Contenido y pruebas (`content/`, `qa/`) | Carlos | Módulo «alimentación» en 2 contextos revisado, reglas pedagógicas, plan de pruebas y registro | Todas las actividades del MVP pasan la lista de revisión y el registro de pruebas offline está firmado |

## 5. Dependencias entre áreas

```
Carlos (reglas + contenido) ──▶ Alejandro (generador) ──▶ paquete ──▶ Mario (reproductor)
              │                                                │
              └──────────── Sergio (esquema, integración) ◀─────┘
Rodrigo (pitch/demo) depende de: demo estable (Sergio), contenido (Carlos), vistas claras (Mario)
```

Dependencias concretas y plazos:

| De | A | Qué | Cuándo |
|---|---|---|---|
| Sergio | Todos | Esquema v0.1 congelado | M1 (14:30 hoy) |
| Carlos | Alejandro | Reglas pedagógicas v0 y 1 módulo manual de referencia | 15:30 hoy |
| Alejandro | Mario | Un paquete de ejemplo válido (aunque sea escrito a mano) | 15:45 hoy |
| Mario | Carlos | Primera pantalla jugable para probar offline | 18:00 hoy |
| Rodrigo | Todos | Qué debe verse en la demo (guion v0) | 15:00 hoy |
| Todos | Sergio | PR pequeñas y frecuentes | continuo |

Para no bloquearse: **Mario puede empezar con un paquete de ejemplo escrito a mano** por Carlos o por él mismo, sin esperar al generador.

## 6. Cómo coordinarse

- **Canal:** el chat del equipo que ya tengáis (WhatsApp/Telegram/Discord); **no** se decide nada importante solo en un chat de IA.
- **Reuniones cortas (10 min, de pie):** arranque de cada bloque y revisión de hito (ver `TASK_BOARD.md`).
- **Fuente de verdad:** el repo. Una decisión que afecta a otros se escribe en `docs/decisions/` y se avisa por el chat.
- **Bloqueos:** abrir Issue con etiqueta `bloqueo` y avisar al responsable por el chat. Si pasan 20 minutos sin respuesta, lo resuelve Sergio.
- **IA:** cada persona usa la IA que tiene, **solo dentro de su carpeta**; no se pega código de otro sin avisar. Ver reglas en `GIT_WORKFLOW.md`.

## 7. Herramientas por persona (lo que realmente tienen)

| Persona | Principal | Apoyo | Notas |
|---|---|---|---|
| Sergio | Claude Code (repo, revisión, integración) | Claude Pro (decisiones, ADR), Google AI Pro/Gemini (investigación larga), ChatGPT Go | Reservar Claude Pro/Code para integración, revisión y depuración difícil; no gastarlo en contenido masivo |
| Rodrigo | ChatGPT Plus (investigación, redacción, estructura del pitch) | Grok temporal (con cautela con citas) | Keynote/Google Slides para diapositivas (no asumir Canva ni nada de pago) |
| Mario | ChatGPT Plus | VS Code; Copilot Student **solo si ya lo tiene verificado** | No asumir agente de código en ChatGPT: comprobar qué incluye su plan |
| Alejandro | ChatGPT Plus | Clave gratuita de Gemini API (AI Studio) con **su** cuenta, si se decide | Claves solo en `.env` |
| Carlos | ChatGPT Plus | — | Redacción y revisión de contenido; las fuentes se verifican a mano |
