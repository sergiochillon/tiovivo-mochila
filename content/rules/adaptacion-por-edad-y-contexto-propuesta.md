# Propuesta de adaptación por edad y contexto

**Estado:** propuesta de contenido; no modifica todavía las reglas aprobadas, el contrato del paquete ni la interfaz.
**Responsable de contenido:** Carlos.
**Origen:** idea de producto de Mario, 5 nov 2026.

## Objetivo

Que la IA proponga actividades realmente distintas según la edad, el lugar, el idioma y los recursos disponibles. Cambiar solo el idioma o sustituir nombres de alimentos no cuenta como adaptación contextual suficiente.

## Datos de contexto para la autoría adulta

La información la introduce una persona adulta responsable del contenido. No se pregunta a los niños por su vida diaria ni se guardan relatos personales.

- Grupo de edad.
- País, región e idioma o variedad lingüística.
- Situación cotidiana que el adulto quiera trabajar (por ejemplo, preparar alimentos en casa o en la escuela).
- Alimentos disponibles, si la actividad los necesita.
- Recursos confirmados para la situación (por ejemplo, agua, utensilios o una persona adulta que pueda ayudar).
- Restricciones o elementos que se deben evitar.
- Fuente o persona que puede confirmar los datos locales; no incluir datos personales de menores.

Si el adulto no conoce un dato, se deja pendiente para revisión. El generador no lo inventa ni lo presenta al niño como un hecho.

## Diferenciación pedagógica provisional

Mario propone los rangos 5–8, 8–10 y 10–12. Tal como están escritos se solapan en las edades 8 y 10; hay que acordar intervalos sin solapamiento antes de convertirlos en valores del contrato. Las siguientes diferencias son ejemplos para diseñar el contenido, no una regla aprobada:

| Grupo propuesto | Forma de presentar la actividad | Ejemplo de tarea |
|---|---|---|
| 5–8 | Una instrucción breve, apoyo visual y una decisión cada vez | Tocar o arrastrar una tarjeta de alimento confirmado hasta el plato. |
| 8–10 | Dos pasos cortos y selección de más de un elemento | Elegir dos alimentos disponibles y colocarlos en el plato. |
| 10–12 | Comparar alternativas usando restricciones concretas aportadas por el adulto | Elegir entre varias comidas posibles según los alimentos y recursos confirmados. |

En ningún grupo se afirma que una comida sea universalmente correcta, saludable o asequible si no hay información comprobada que lo respalde. Una interacción de arrastrar debe tener también alternativa con botones o toque.

## Qué debe cambiar entre contextos

Cada variante debe usar la situación, recursos, alimentos y vocabulario que la persona adulta haya confirmado para ese contexto. La adaptación debe ser visible en la actividad y en las opciones, no limitarse a traducir el mismo texto.

Ejemplo de trabajo futuro para «crear una comida»:

1. La persona adulta introduce una lista de alimentos y recursos disponibles para la actividad.
2. La IA propone una actividad breve para el grupo de edad elegido y usa únicamente esa lista.
3. La niña o el niño crea una combinación con tarjetas, mediante arrastre o botones.
4. Puede haber varias respuestas válidas; el feedback anima sin clasificar alimentos o cuerpos ni avergonzar.
5. El paquete se guarda para uso sin conexión y sigue siendo un borrador hasta completar la revisión humana.

## Límites de seguridad y revisión

- No pedir al niño su nombre, ubicación, rutina personal, historia familiar, salud, voz, fotos ni texto libre.
- Las escenas de rutina las describe el adulto en términos generales y sin identificar a ningún menor.
- No inferir emociones ni calificar preferencias personales como correctas o incorrectas.
- No inventar prácticas culturales, alimentos, disponibilidad o costes. Marcar lo no confirmado para revisión adulta y mantenerlo fuera del contenido infantil.
- Distinguir revisión pedagógica interna de validación cultural local. El esquema actual no separa esos estados; cualquier cambio de estado requiere decisión de producto y contrato.
- Cada salida de IA es un borrador. Una persona lee el paquete completo y lo prueba antes de aprobarlo; la validación local se registra por separado cuando exista.

## Trabajo técnico pendiente fuera de contenido

- Definir intervalos de edad no solapados y actualizar `ageRange` del contrato (Sergio, con las áreas afectadas).
- Añadir al flujo de autoría los campos de contexto de adulto y hacer que el generador reciba esos valores (Rodrigo y Alejandro).
- Diseñar el tipo de actividad para construir comidas y sus alternativas accesibles; actualizar reproductor, contrato y pruebas offline (Sergio y Rodrigo).
- Acordar cómo representar revisión pedagógica y validación cultural sin que un sello dé a entender una validación que no se hizo.

## Criterio de contenido para una primera prueba

- Preparar una actividad por grupo de edad en Andes/ES y norte de Uganda/EN usando solo datos adultos confirmados.
- Mostrar al menos una diferencia real de situación o recursos por contexto, además del idioma.
- Pedir revisión pedagógica y local antes de servir los paquetes a niños.
- Probar cada interacción en el reproductor y en modo avión antes de incluirla en la demo.
