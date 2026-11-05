---
name: mochila-pack-review
description: Use when writing, generating, editing or reviewing a MOCHILA content pack (content/packs, content/drafts, /autoria output) for children aged 5-12 (age bands 5-8, 6-10 and 9-12), or before anyone marks a pack as approved.
license: MIT
---

# MOCHILA: crear y revisar paquetes de contenido

Fuente de las reglas: `content/rules/pedagogical-v0.md` y `contracts/pack-v0.1.schema.json`. Esta skill las aplica y no las sustituye. La revisión la hace una persona; tú propones hallazgos.

## Plantilla por actividad (rellénala antes de dar por buena una actividad)
- **Qué aprende el niño:** una sola idea, dicha en una frase.
- **Qué hace:** una acción concreta.
- **Interacción:** story, choice, plato (choice con varias correctas), order, match o scenario. Debe encajar con la acción.
- **Feedback:** amable y específico por opción; nunca «mal».
- **Si se equivoca:** qué ve y qué ayuda recibe (Mochi retira una opción al segundo fallo).
- **Adaptación 6-10:** frases de unas 12 palabras como máximo para 6-7 años, icono (emoji) en cada opción, `audioText` idéntico al texto en pantalla.
- **Sin red:** no depende de nada que no esté en el paquete.

## Rúbrica de revisión (10 puntos, los de pedagogical-v0)
1. Habilidad del MVP y edad adecuada. 2. Una idea por actividad. 3. Vocabulario y longitud; audio igual al texto. 4. Opciones claras, sin respuesta correcta inventada para una preferencia. 5. Feedback amable. 6. Alimentos, recursos y costumbres validados por alguien del contexto, o marcados `A VALIDAR`. 7. Sin estereotipos ni generalizar a toda una comunidad. 8. Sin datos personales, texto libre, foto, voz ni inferir emociones. 9. Acciones seguras que no sustituyen a una persona adulta. 10. Paquete leído y jugado en el reproductor, con revisor y fecha reales.

## Comprobaciones mecánicas
Cada `correct` existe entre las opciones; en `order`, `correct` lista todas las opciones una vez; en `match`, 3 pares `"izq:der"` y ids sin «:»; ids únicos en minúsculas; `safetyTag` de la lista cerrada; `teacherNotes` ≤ 500 caracteres y sin datos personales. La validación del esquema es necesaria, no suficiente.

## Adaptación al contexto sin inventar
- Un contexto se distingue por lo que ocurre en él: alimentos nombrados, preparación, agua, cocina, mercado, personajes con nombres locales. No basta con traducir y cambiar sustantivos.
- Los datos culturales salen del repositorio o de fuentes citadas. Lo no confirmado va en `teacherNotes` con el prefijo `A VALIDAR`. Las ilustraciones son ilustrativas, no representan a una comunidad concreta.

## Sello honesto
- `review.notes` aprobado: «Revisión pedagógica interna por <nombre> el <fecha>. Validación cultural local pendiente. No probado con niños.» No existe «validado por la comunidad» sin una validación real.
- Un borrador generado por IA lo dice en las notas.
- **Segunda revisión obligatoria** (otra persona, anotada en `review.notes`) para actividades con `safetyTag` `food-safety`, `help-adult`, `emotion-self-choice` o `privacy`. Es una regla **manual**: el endpoint de aprobación del servidor no la comprueba ni registra a la segunda persona; anótala tú en `review.notes`.
- Si falla un punto, el paquete sigue como `draft`. La lista de 6 puntos de `/autoria` la exigen la interfaz y el servidor (`checklist`; sin ella, 422). La segunda revisión de actividades sensibles sigue siendo manual.

## Temas
Permitidos: alimentación, higiene, pedir ayuda, emociones por autoelección, convivencia, seguridad cotidiana no alarmista y autonomía. Prohibidos: abuso, violencia, armas, sustancias, instrucciones médicas o dietas, culpabilizar por pobreza, salud o emociones, y cualquier recogida de datos.

## Informe
Lista hallazgos por actividad con gravedad (bloquea / mejora), cita el texto exacto y propone la corrección. No cambies `review.status` tú.
