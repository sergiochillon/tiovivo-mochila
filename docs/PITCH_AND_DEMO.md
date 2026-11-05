# PITCH_AND_DEMO — la historia, el guion y la demo

Responsable: Mario. Todo es **borrador v0**: se reescribe con lo que realmente exista. **No se muestra en la demo nada que no funcione, ni se dice que algo está validado si no lo está.**

---

## 1. La historia que queremos contar

Una idea en una frase: **«Un docente describe su comunidad; la IA prepara el material; el docente lo revisa; los niños lo usan sin Internet.»**

Hilo narrativo:

1. **Un aula** en la que la conexión es lenta, cara o inexistente, y donde un niño de 7 años necesita saber qué comer con lo que hay, qué hacer si se pierde y cómo ponerle nombre a lo que siente. *(Escena ilustrativa, presentada como tal; no inventar un niño real ni una anécdota.)*
2. **El hueco:** el material digital asume red, cultura y chat abierto.
3. **MOCHILA:** preparar con conexión, usar sin conexión, con un humano en medio.
4. **La prueba:** en directo, modo avión.
5. **Por qué es responsable:** sin chat, sin datos personales, revisión humana.
6. **Por qué puede crecer:** nuevos contextos con el mismo flujo; encaja con infraestructuras existentes.

## 2. Problema (qué se dice)

- Contexto con conectividad limitada: la falta de conexión sigue siendo una de las barreras del aprendizaje digital (lo dice el propio reto).
- Escasez de material de habilidades para la vida adaptado al contexto **[HIPÓTESIS; decir «lo que hemos oído en X conversaciones» solo si es verdad]**.
- Si se cita un dato, que sea de la auditoría §J, verificado y con fuente en la diapositiva. **No** decir que la brecha socioemocional es mayor que la cognitiva.

## 3. Solución

Flujo en tres pasos: **Prepara → Revisa → Usa sin conexión.** Un esquema (ver README) y la demo. Decir qué hace la IA (genera borradores para el docente) y qué **no** hace (hablar con niños).

## 4. Diferenciación (decir con humildad)

- «No es otro tutor-chatbot.»
- «Adapta el contenido a su contexto y lo pone en manos de un docente que lo aprueba.»
- «Funciona sin red y sincroniza cuando vuelve.»
- Si preguntan por Kolibri o ProFuturo: **complemento, no sustituto.** Decir «hasta donde hemos encontrado», nunca «somos los únicos».

## 5. Qué evalúa el jurado (y dónde lo cubrimos)

| Criterio | Cómo lo cubrimos en el pitch |
|---|---|
| Creatividad e innovación | Adaptación contextual con IA + revisión humana + offline |
| Acabado y calidad | Demo estable, repo limpio, README, pruebas offline documentadas |
| Transferencia al mercado | Quién paga (hipótesis), cómo escala, licencias, siguiente paso |
| Educación digital con IA en países desfavorecidos | Dos contextos, offline, bajo coste |
| (ProFuturo) impacto social · inclusión · sostenibilidad · uso ético de IA | Contextos vulnerables; idioma/cultura; modelo de servicio y open source; sin chat, sin PII, revisión humana |

## 6. Guion provisional de 5 minutos (ensayar con cronómetro; objetivo 4:45)

| Tiempo | Bloque | Contenido | Quién habla |
|---|---|---|---|
| 0:00–0:30 | Gancho | Escena del aula sin conexión (ilustrativa) y la pregunta del reto | Presentador |
| 0:30–1:15 | Problema | Conectividad + hueco de material contextual; 1 dato con fuente | Presentador |
| 1:15–1:50 | Idea | Prepara → Revisa → Usa sin conexión; la IA no habla con niños | Presentador |
| 1:50–3:30 | **Demo en directo** (ver §7) | Autoría → sello → modo avión → actividad → sincronizar | Presentador narra; otra persona maneja |
| 3:30–4:00 | Diferenciación | Frente a tutores-chatbot y a plataformas offline | Presentador |
| 4:00–4:30 | Impacto, inclusión y ética | Sin chat, sin PII, revisión humana; limitaciones honestas | Presentador |
| 4:30–5:00 | Transferencia y siguiente paso | Quién pagaría (hipótesis), piloto con ONG/docentes, cierre | Presentador |

Recomendación (no es una asignación impuesta): **un solo presentador** (Mario, por ser la persona de producto y pitch) y **una persona maneja la demo** (Rodrigo, dueño de la interfaz; Sergio de respaldo). Se puede cambiar si se ensaya y sale mejor.

Si el formato de la presentación local del viernes resulta distinto (más o menos tiempo, sin demo en directo), este guion se adapta; **no se conoce todavía** (P-01).

## 7. Escenario de demostración

**Preparación previa (checklist obligatorio, la noche antes y 30 min antes):**
- Paquete aprobado y paquete de respaldo en `content/packs/`.
- App instalada como PWA en el dispositivo de demo y **cargada con red al menos una vez**.
- Dispositivo cargado, modo avión **probado** el mismo día, volumen y voz de audio comprobados.
- Segundo dispositivo de respaldo + **vídeo de 3 minutos** con la demo grabada.
- Datos sintéticos únicamente; ninguna clave visible en pantalla.

**Guion de la demo (≈ 90–100 s):**

1. *(Con red)* Pantalla docente: se introduce contexto «Andes rurales, español, alimentos…». Se pulsa **Generar**. Aparece el borrador (si la API tarda, se carga el resultado en caché y se dice «resultado previamente generado»; **no** simular que es en directo).
2. El docente edita **una** actividad y pulsa **Aprobar** (aparece el sello con nombre sintético de revisor). Se exporta el paquete.
3. Se repite la idea con **otro contexto** (norte de Uganda, inglés) mostrando la diferencia de contenido (solo mostrar, no regenerar).
4. **Se activa el modo avión en pantalla** (que se vea).
5. Vista del niño: elige un avatar, escucha la historia, resuelve una actividad.
6. Se desactiva el modo avión, se pulsa **Enviar progreso**; el panel docente muestra el resultado agregado.

**Qué debe verse sí o sí:** (a) contexto → contenido adaptado, (b) sello de revisión humana, (c) modo avión visible, (d) actividad funcionando sin red, (e) sincronización, (f) aviso de datos sintéticos.

**Plan de fallo:** si algo falla, se pasa al vídeo sin disculpas largas y se continúa con el guion.

## 8. Mensajes clave (máximo tres para que se recuerden)

1. **La IA prepara; el docente decide; el niño juega sin Internet.**
2. **Mismo flujo, cualquier comunidad:** el contenido se adapta a la comida, el idioma y los recursos locales.
3. **Responsable por diseño:** sin chat con niños, sin datos personales, con revisión humana.

## 9. Preguntas difíciles previsibles (preparar respuesta honesta)

| Pregunta | Respuesta honesta |
|---|---|
| ¿Lo habéis probado con niños? | No. Lo declaramos como limitación; siguiente paso: piloto con docentes y ONG |
| ¿Qué IA corre en local? | La generación va con conexión; el niño nunca habla con un modelo. IA local sería una extensión |
| ¿Quién pagaría? | Hipótesis: ONG/fundaciones/programas educativos; estamos validando |
| ¿Por qué no un chatbot? | Seguridad infantil, fiabilidad, y no hace falta para el objetivo |
| ¿Y los datos de los niños? | No se guardan datos personales: avatares y datos sintéticos |
| ¿Cómo sabéis que el contenido es adecuado? | Revisión humana obligatoria + reglas pedagógicas; revisión externa pendiente |
| ¿Es offline de verdad? | Se demuestra en modo avión; limitaciones de iOS/almacenamiento conocidas |
| ¿Qué pasa con el contenido cognitivo? | Línea abierta a investigación; no es el foco |
| ¿Cómo escala? | Nuevos paquetes por contexto con el mismo flujo; licencia libre; encaja con infraestructuras existentes |

## 10. Entregables del pitch

| Entregable | Dueño | Límite |
|---|---|---|
| Esqueleto de diapositivas (6–8) | Mario | 18:30 hoy |
| Guion v1 con datos reales de la demo | Mario | 16:30 mañana |
| Vídeo de 3 min | Mario + quien maneje la demo | 19:00 mañana |
| Presentación final de 5 min (formato pedido por las bases) | Mario | 19:30 mañana |
| Ensayos con cronómetro (×2 mínimo) | Todos | Mañana tarde y viernes por la mañana |
