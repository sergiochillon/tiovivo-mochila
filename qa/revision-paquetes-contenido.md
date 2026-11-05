# Revisión estática de propuestas de contenido — 2026-11-05

**Revisor:** copiloto de Carlos. **Alcance:** lectura de JSON y revisión contra `content/rules/pedagogical-v0.md`, `contracts/pack-v0.1.schema.json` de la PR 37 y la rúbrica de `.agents/skills/mochila-pack-review/SKILL.md` leída desde `origin/chore/agent-skills` (`65be506`).  
**Límite:** esta es una propuesta de revisión, no sustituye la decisión humana de Carlos. No se probaron los paquetes en `/autoria` ni en el reproductor; tampoco se validaron con una persona local ni con niños. Todos los paquetes nuevos o reescritos permanecen en `draft`.

En esta rama no hay archivos `content/drafts/generado-*.json` entregados por Alejandro. Por eso no atribuyo estas propuestas a sus borradores ni afirmo haber completado esa revisión de C2; se ampliaron aquí los borradores existentes de ayuda y emociones.

## Cobertura preparada

| Paquete | Ámbito | Actividades | Contexto y adaptación | Estado |
|---|---|---:|---|---|
| `food-andes-es.json` | Alimentación | 5 | Candidatos del paquete anterior del repo; agua, disponibilidad y preparación explícitamente `A VALIDAR`. | `draft` |
| `food-northern-uganda-en.json` | Alimentación | 5 | Candidatos del paquete anterior del repo y referencia FAO general; nombres, agua, recursos y preparación por confirmar localmente. | `draft` |
| `hygiene-andes-es.json` | Higiene | 4 | Agua, jabón y recursos tratados de forma condicional; no culpa al niño si faltan. | `draft` |
| `help-andes-es.json` | Pedir ayuda | 4 | Situaciones cotidianas; se ofrece una persona adulta de confianza. | `draft` |
| `help-northern-uganda-en.json` | Pedir ayuda | 4 | Traducción adaptada del tema; revisar el inglés y referentes adultos localmente. | `draft` |
| `emotions-andes-es.json` | Emociones | 4 | Autoelección; el niño puede pasar y no se le pide compartir su emoción. | `draft` |
| `emotions-northern-uganda-en.json` | Emociones | 4 | Autoelección; no se infiere emoción ni se fuerza una respuesta. | `draft` |

## Revisión por actividad

Cada punto recoge la idea y acción previstas, el apoyo ante error que aún debe comprobarse en el reproductor, y la adaptación de edad/uso offline. En las actividades con opciones, todos los enunciados y `audioText` coinciden; los textos se mantienen dentro de frases cortas. Los iconos de opciones se revisaron en los JSON.

### Alimentación — Andes

| Actividad | Qué aprende y qué hace | Interacción y ayuda si se equivoca | Revisión pendiente |
|---|---|---|---|
| `historia-de-ana` | Una familia usa alimentos disponibles; escucha una historia corta. | `story`; no se evalúa una preferencia. | Confirmar “Ana”, alimentos y vocabulario local. |
| `arma-un-plato-posible` | Reconoce qué alimentos dice la historia que están disponibles; elige opciones múltiples. | `choice`; feedback específico por alimento, sin calificar comidas. | Verificar selección múltiple, feedback y opciones en reproductor. |
| `preparar-con-ayuda` | Pide a una persona adulta que indique el agua y ayude a cocinar; ordena pasos. | `order`; feedback amable al completar. | Validar el orden local; comprobar la ayuda tras error. |
| `parejas-comida-segura` | Relaciona una tarea con el recurso/ayuda pertinente. | `match`; feedback general al completar. | Validar agua, utensilios y vajilla; comprobar feedback por pareja errónea. |
| `preguntar-preparacion` | Si no conoce una preparación, elige pedir ayuda adulta. | `scenario`; la opción de probar sin preguntar tiene feedback amable. | Segunda revisión de seguridad por Mario o Sergio. |

### Alimentación — Norte de Uganda

| Actividad | Qué aprende y qué hace | Interacción y ayuda si se equivoca | Revisión pendiente |
|---|---|---|---|
| `story-at-home` | Una familia tiene mijo y frijoles hoy; escucha que otra familia puede tener otros alimentos. | `story`; sin respuesta evaluada. | Confirmar nombre Ayo, alimentos y palabras en la comunidad elegida. |
| `choose-a-possible-meal` | Reconoce los alimentos que el relato dice que hay; elige varios. | `choice`; feedback específico y neutral para las opciones. | Verificar selección múltiple y claridad de iconos/nombres. |
| `ask-before-preparing` | Ante una preparación desconocida, elige preguntar a una persona adulta de confianza. | `scenario`; feedback explica la opción más segura. | Segunda revisión de seguridad por Mario o Sergio. |
| `match-tasks-and-help` | Relaciona lavar/cocinar/servir con agua indicada, adulto y plato limpio. | `match`; feedback general al completar. | Confirmar recursos, traducción y feedback ante pareja errónea. |
| `order-preparation-with-help` | Ordena preguntar por el agua, lavar si corresponde y pedir que una persona adulta prepare. | `order`; feedback indica que el adulto guía el agua y la preparación. | Confirmar secuencia y vocabulario local; segunda revisión de seguridad. |

### Higiene — Andes ilustrativo

| Actividad | Qué aprende y qué hace | Interacción y ayuda si se equivoca | Revisión pendiente |
|---|---|---|---|
| `historia-antes-de-comer` | Antes de comer, alguien pregunta qué recurso usar para lavarse las manos. | `story`; no se juzga si faltan recursos. | Ajustar vocabulario y contexto. |
| `elige-higiene` | Identifica el uso de agua y jabón cuando están disponibles. | `choice`; explicación breve de la opción elegida. | Validar el mensaje localmente y comprobar feedback. |
| `orden-lavado` | Ordena mojar, frotar con jabón, enjuagar y secar si hay paño limpio. | `order`; mensaje amable si falta un recurso. | Validar adaptación cuando falten agua o jabón; prueba en reproductor. |
| `si-no-hay-agua` | Si no hay agua, pregunta a una persona adulta por una opción segura. | `scenario`; feedback corto, sin exigir una solución al niño. | Acordar localmente una alternativa segura y segunda revisión. |

### Pedir ayuda — ambos idiomas

| Actividad | Qué aprende y qué hace | Interacción y ayuda si se equivoca | Revisión pendiente |
|---|---|---|---|
| `historia-pedir-ayuda` / `help-story` | Una tarea puede costar; se puede pedir ayuda adulta. | `story`; normaliza pedir apoyo. | Revisar frase y referente adulto local. |
| `elige-como-pedir-ayuda` / `choose-how-to-ask` | Ante una tarea difícil, elige entre pedir otra explicación, ayuda con el primer paso o un ejemplo. | `choice` múltiple; las tres opciones son válidas y llevan feedback propio. | Confirmar que las tres opciones se muestran como válidas y el reproductor no penaliza una preferencia. |
| `pasos-para-pedir-apoyo` / `steps-to-ask` | Busca un adulto, indica qué parte necesita ayuda y escucha la explicación. | `order`; instrucción concreta. | Revisar que no obligue al niño a contar detalles personales. |
| `adulto-de-confianza` / `trusted-adult-at-school` | Si no encuentra al docente, busca otra persona adulta de confianza en la escuela. | `scenario`; corrige con una salida segura si elige salir solo. | A VALIDAR: adaptar escuela y referentes seguros; segunda revisión obligatoria. |

### Emociones — ambos idiomas

| Actividad | Qué aprende y qué hace | Interacción y ayuda si se equivoca | Revisión pendiente |
|---|---|---|---|
| `historia-emociones` / `feelings-story` | Las personas pueden sentir cosas distintas; no hay emoción prescrita. | `story`; no se asigna emoción al niño. | Revisar lenguaje local y tono. |
| `elegir-por-mi` / `choose-for-myself` | Si quiere, toma un momento, elige una palabra para sí o pasa. | `choice` múltiple; cada opción se trata como válida. | Verificar que el reproductor no marque como incorrecto pasar. |
| `pausa-o-apoyo` / `pause-or-support` | Si no quiere hablar, puede pedir una pausa, apoyo o pasar. | `scenario`; feedback recuerda que no tiene que compartir. | Segunda revisión sensible; confirmar que ninguna opción expone al niño. |
| `elegir-una-pausa` / `choose-a-pause` | Si quiere, puede tomarse un momento, pedir apoyo o volver cuando quiera. | `choice` múltiple; todas las opciones son válidas. | Confirmar que no se evalúa como incorrecta una preferencia personal; segunda revisión sensible. |

## Revisión mecánica

Los nueve JSON de `content/packs/` y `content/drafts/` pasaron la validación de JSON Schema Draft 2020-12 contra `contracts/pack-v0.1.schema.json` de `origin/main` (`bfed2d0`). En las siete propuestas nuevas o reescritas se comprobó además coincidencia exacta de `audioText`/`prompt`, referencias de `correct`, ids de opciones únicos, tres parejas para `match`, orden con cada opción una vez, `teacherNotes` dentro del máximo y emoji en cada opción. El paquete aprobado Altiplano preexistente no se reescribió; conserva dos opciones sin emoji y dos frases por encima del objetivo de doce palabras. `juegos-andes-es.json` es el borrador de PR 37 ya integrado en `main`; su revisión separada está en `revision-contenido-pr37.md`. Esto no demuestra el comportamiento en `/autoria` ni en el reproductor.

## Decisiones que aún no se pueden afirmar

- No se marcó ningún paquete nuevo como `approved` ni como validado por la comunidad.
- La práctica cultural local, los nombres, la disponibilidad de agua/recursos y la adecuación del inglés necesitan revisión de alguien conocedor del contexto.
- Los temas `help-adult`, `emotion-self-choice` y `food-safety` requieren segunda revisión de Mario o Sergio; está anotada como pendiente en los paquetes.
- No hay prueba con niños. La lectura en voz alta y el reproductor offline quedan pendientes.
