# Reglas pedagógicas v0 — MOCHILA

**Estado:** borrador para integrar y revisar; no sustituye la revisión humana de cada paquete.  
**Público:** niñas y niños de 6–10 años.  
**Objetivo:** actividades breves sobre habilidades para la vida, comprensibles y utilizables sin conexión.

## Reglas para redactar y generar

- Una idea y una acción por actividad. Usar instrucciones directas, una por frase, con palabras cotidianas. Evitar tecnicismos, dobles negaciones, ironía y expresiones idiomáticas difíciles de traducir.
- Tono cálido, respetuoso y sin juicio. No avergonzar, asustar, culpabilizar ni presentar una respuesta equivocada como algo malo.
- Dar 2–4 opciones cortas y distinguibles y feedback breve que explique o anime a probar. En una actividad con respuesta evaluable, debe haber una respuesta prevista y feedback para el acierto/error según lo permita el contrato. No presentar una preferencia personal como respuesta correcta. No exigir lectura extensa; acompañar texto con audio opcional (`audioText`) e iconos/pictogramas comprensibles. El audio debe repetir el contenido, no añadir instrucciones distintas.
- Mantener actividades cortas (objetivo orientativo: 1–3 minutos; ajustar en prueba). Evitar límites de tiempo, competencia y penalizaciones.
- Usar escenas cotidianas y abiertas a distintas familias, capacidades y recursos. No asumir que hay internet, electricidad, refrigeración, dinero, utensilios o alimentos específicos.
- Adaptar vocabulario, idioma y ejemplos con conocimiento local. Los alimentos, costumbres y disponibilidad mencionados para una comunidad son **ejemplos a validar**, no afirmaciones sobre todas las familias de esa región.
- Para alimentación, priorizar decisiones realistas con recursos disponibles y asequibles; no etiquetar comidas o cuerpos como “buenos/malos”, ni hacer promesas médicas o nutricionales.
- El niño elige entre respuestas cerradas. No pedir nombre, ubicación, historia personal, texto libre, foto, voz ni información de salud. No inferir emociones ni características del niño.
- Proponer acciones seguras y apropiadas a la edad. En situaciones que requieran ayuda, sugerir hablar con una persona adulta de confianza, sin pedir que el niño revele detalles en la app.
- La generación automática produce solo borradores. Ningún contenido se muestra como aprobado hasta que una persona lea el paquete completo, complete la lista de revisión y registre el sello humano.

## Lista del sello humano antes de aprobar

1. El paquete trata una habilidad del MVP y es adecuado para 6–10 años.
2. Cada actividad enseña una sola idea y tiene una instrucción que el niño puede entender.
3. El vocabulario y la longitud funcionan para la edad; el texto de audio, si existe, coincide con la instrucción.
4. Las opciones son claras, no se solapan y no hay respuesta correcta inventada para una preferencia personal.
5. El feedback es amable, útil y no avergüenza ni culpabiliza.
6. Los alimentos, recursos, idioma y costumbres están validados por alguien conocedor del contexto o se mantienen como marcadores explícitos fuera de una versión para niños.
7. No hay estereotipos ni se atribuyen las mismas prácticas a toda una comunidad.
8. No solicita datos personales, texto libre, fotos, voz ni información sensible; tampoco infiere emociones.
9. Las acciones son seguras y no sustituyen a una persona adulta o profesional.
10. El paquete completo se ha leído y probado en el reproductor; el revisor registra su identidad y fecha reales. Si falla un punto, sigue como `draft`.

## Instrucción para el generador

Devuelve un borrador, no afirmes que está validado ni aprobado. No inventes contexto cultural ni rellenes con estereotipos los datos que falten: deja marcadores `A VALIDAR` en los metadatos para revisión del adulto y evita mostrarlos al niño. Si una actividad no puede tener respuesta correcta única, no la conviertas en pregunta evaluable; pide al responsable técnico el formato de actividad sin puntuación previsto por el contrato.

**Propuesta de valores para `safetyTag` (pendiente de aceptar en el esquema):** `none`, `hygiene`, `food-safety`, `help-adult`, `emotion-self-choice`, `privacy`. Usar una etiqueta principal por actividad; `none` cuando no requiera una consideración específica. La lista no sustituye estas reglas ni el sello humano. `teacherNotes` sería útil como campo opcional de actividad para indicaciones de mediación y validación local; no añadirlo al JSON hasta que el contrato lo admita.

## Temas

**Permitidos en el MVP:** alimentación cotidiana y elecciones de comida; hábitos sencillos de higiene y salud preventiva; reconocer emociones mediante autoelección; convivencia; pedir ayuda a una persona adulta de confianza; seguridad cotidiana no alarmista; autonomía apropiada a la edad.

**Prohibidos en el MVP:** abuso, violencia explícita o sexual, autolesiones, suicidio, armas, consumo de sustancias, instrucciones médicas o dietas terapéuticas; chat abierto o texto libre; análisis de texto, voz, imagen o conducta para inferir emociones; recopilación de datos personales; culpabilizar por pobreza, alimentación, salud o emociones; consejos que sustituyan a una persona adulta o profesional.

## Guía breve por tipo

- `story`: situación corta, sin moraleja impuesta; termina en una decisión sencilla.
- `choice`: pocas opciones claras; explicar cada resultado con respeto.
- `match` / `order`: elementos concretos, instrucciones explícitas y sin depender de conocimientos locales no validados.
- `scenario`: situación cotidiana de bajo riesgo; ofrecer pedir ayuda a un adulto de confianza cuando corresponda.

