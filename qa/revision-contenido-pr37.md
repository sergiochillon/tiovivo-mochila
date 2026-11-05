# Revisión de contenido de la PR 37 — `juegos-andes-es.json`

**Revisor asistido:** copiloto de Carlos. **Fecha:** 2026-11-05.  
**Fuente:** `content/drafts/juegos-andes-es.json` y objeto `texts` leídos en `16df58c`; confirmé que ambos siguen iguales en la cabeza de PR `c0ac457` (2026-11-05).  
**Alcance:** revisión estática de texto y estructura con `content/rules/pedagogical-v0.md` y `.agents/skills/mochila-pack-review/SKILL.md`. No se probó `/autoria`, el reproductor, audio ni modo sin conexión. El paquete debe seguir en `draft` hasta revisión humana completa y prueba en el reproductor.

## Hallazgos por actividad

### `historia-cocina` — mejora pedagógica

El texto es accesible: las frases tienen entre 6 y 11 palabras, y `audioText` coincide exactamente. Sin embargo, «Hoy Ana ayuda en la cocina. En la mesa hay papa, habas, quinua y un huevo. Su abuelo le dice: “Vamos a preparar el almuerzo juntos”» presenta alimentos, pero no enseña una idea de alimentación ni ofrece una decisión. «¡Ana está lista para cocinar con su abuelo!» solo celebra. Propuesta: dar a la historia un objetivo de aprendizaje explícito, por ejemplo reconocer que se puede preparar algo con alimentos disponibles, manteniendo los alimentos como candidatos `A VALIDAR` en notas docentes.

### `arma-plato` — mejora pedagógica

`correct` apunta a opciones existentes y las cuatro respuestas correctas se identifican en la historia; `audioText` coincide con `prompt`. La actividad comprueba memoria literal («todo lo que viste en la historia»), no una decisión de alimentación. Si se conserva, explicar en `teacherNotes` que es una actividad de recuerdo, no una recomendación nutricional; para enseñar alimentación, cambiarla por una elección sencilla basada en lo que la familia tiene disponible, sin calificar alimentos ni platos como buenos o malos. El feedback de la opción pescado es amable, aunque «recuerda la historia» podría ser una pista más concreta.

### `parejas-cocina` — bloquea el sello según la rúbrica actual

Las seis opciones no tienen `icon`, aunque la adaptación 6–10 de la skill exige un emoji en cada opción. `correct` contiene tres pares válidos y los ids son únicos. «Agua y jabón» y la disponibilidad de un plato limpio se presentan como recursos, pero las notas no validan disponibilidad local; mantenerlos como `A VALIDAR` para la persona docente y no insinuarlos como universales. Añadir una devolución útil para reintentos (la devolución actual solo celebra el acierto) y probar que el modo de parejas del reproductor interpreta estos ids como se espera.

### `decide-fuego` — requiere segunda revisión de seguridad

El niño recibe una salida segura (esperar o avisar a otra persona adulta), no se le pide manipular la olla, y la opción de riesgo explica por qué evitarla. Añadir `icon` no es problema aquí: ambas opciones ya lo tienen. El `safetyTag: help-adult` exige segunda revisión de Mario o Sergio; anotarla en `review.notes` cuando ocurra. Mantener esta actividad en borrador hasta entonces.

## Revisión de frases de Mochi

Las frases de Mochi se mantienen bajo el objetivo de doce palabras por oración. «¡Hola! Soy Mochi. Cada actividad que termines te dará una pegatina para tu álbum» tiene 3 y 11 palabras; «Hi! I am Mochi. Every activity you finish gives you a sticker for your album» tiene 4 y 11. El tono general es amable. «¿Quién eres hoy?» puede sonar a pregunta de identidad en un dispositivo compartido; considerar «¿Qué explorador eliges hoy?». «Cada mochila es una misión» y «la estación que brilla» usan metáforas; comprobar comprensión infantil antes de conservarlas. Las ayudas «el paso que sigue brilla» y «su pareja brilla» son menos concretas que «Mira el paso que sigue» y «Busca su pareja». «Te ayudo: he quitado una opción que no va» es comprensible, pero «Te doy una pista» evita etiquetar una opción y puede acompañar una ayuda concreta.

Los textos dinámicos del álbum «Las pegatinas de {nombre} en esta mochila» y «{nombre}'s stickers in this backpack» suenan incompletos. Propuesta: «Aquí están las pegatinas de {nombre}. Completa una actividad para ganar otra» / «{name}'s stickers are in this backpack. Finish an activity to earn another». No se leyó en voz alta con niños; esa comprobación queda pendiente.

## Resultado de la rúbrica

- **A favor:** vocabulario sencillo; enunciados de hasta 11 palabras por frase; `audioText` idéntico; variedad de cuatro tipos; sin datos personales; contexto y alimentos marcados como pendientes de validar.
- **Pendiente/bloqueante:** la historia y el plato se centran en recordar, no en aprender una habilidad de alimentación; faltan iconos en todas las opciones de parejas; falta probar el paquete en el reproductor; falta segunda revisión de `help-adult`; no hay validación cultural local ni prueba con niños.
- **Estado recomendado:** `draft`. Esta revisión estática no constituye la revisión humana de Carlos ni la aprobación del paquete.
