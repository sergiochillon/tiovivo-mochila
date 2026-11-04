# RESEARCH_AND_VALIDATION — qué investigamos y cómo validamos

Responsable: Rodrigo. **Regla de oro: no se afirma validado lo que no lo está.** Todo lo de esta tabla empieza como **[HIPÓTESIS]**. La validación se anota en `research/` con fecha, fuente y qué cambia en el producto.

---

## 1. Lo que ya sabemos (conclusiones de la auditoría; **no se rehace**)

La auditoría completa está en el artefacto «Auditoría estratégica Hack4Edu 2026 · TIOVIVO.exe» (sección J, fuentes). Para que el equipo y sus IAs la tengan, **Sergio la exporta a Markdown y la guarda en `research/auditoria-estrategica.md`** (pendiente).

Conclusiones relevantes:

1. **Reto 02** encaja y lleva etiqueta ProFuturo; plan B Reto 24.
2. **No se puede ordenar la brecha cognitiva frente a la socioemocional** en 6–10 años con datos internacionales. La brecha **medida** es la de aprendizaje fundacional (cifras de la auditoría: pobreza de aprendizaje ≈ 70 % en países de renta baja y media y ≈ 89 % en África subsahariana según una simulación de 2022; encuestas MICS en 7–14 años: medianas ≈ 41 % en lectura y ≈ 25 % en aritmética básica). **Verificar cada cifra contra su fuente antes de ponerla en una diapositiva.**
3. **Consecuencia para el pitch:** no decir que lo socioemocional es el mayor problema. Decir que es un hueco de **material contextualizado y utilizable sin conexión**.
4. **Ética:** el reglamento europeo de IA prohíbe inferir emociones en educación (art. 5.1.f). MOCHILA no infiere emociones. UNICEF advierte sobre compañeros de IA para niños: por eso **no hay chat**.

## 2. Necesidades educativas a investigar

| # | Pregunta | Por qué importa |
|---|---|---|
| N1 | ¿Qué habilidades para la vida se enseñan hoy en aulas de baja conectividad y con qué material? | ¿Existe el hueco? |
| N2 | ¿Qué parte del tiempo docente se va en adaptar material al contexto? | Valor de la IA |
| N3 | ¿Con qué dispositivos reales se trabaja (móvil del docente, tablets compartidas, nada)? | Viabilidad técnica |
| N4 | ¿Qué desconfía un docente de una IA que genera contenido para niños? | Diseño del sello |
| N5 | ¿Cómo se paga hoy material/herramientas (ONG, donantes, administración)? | Modelo de negocio |
| N6 | ¿Qué temas son sensibles culturalmente (comida, emociones, ayuda)? | Adaptación cultural |

## 3. Contextos considerados

| Contexto | Idioma | Estado | Notas |
|---|---|---|---|
| Andes rurales de Perú | Español | Elegido para demo **[DECIDIDO]** | Elegido por idioma y por la relevancia de ProFuturo en la región (a confirmar con fuente); alimentos del ejemplo a revisar |
| Norte de Uganda | Inglés | Elegido para demo **[DECIDIDO]** | Inglés como contraste de idioma y de alimentos; riesgo: no hablamos lenguas locales |
| Otros (no se desarrollan) | — | Mencionados como escalabilidad | No prometer cobertura |

Cuidado: los contextos son **ejemplos de adaptación**, no un estudio antropológico. En la demo se dice «ejemplo ilustrativo; debe revisar un docente local».

## 4. Hipótesis

Ver `PRODUCT_BRIEF.md §8` (H1–H6). Cada una se mueve entre **Sin validar → Apoyo parcial → Validada → Refutada** con la evidencia anotada.

## 5. Competencia

Mantener una tabla viva en `research/competencia.md` (Rodrigo) con: nombre, qué hace, público, offline sí/no, IA sí/no, idioma/contexto, licencia/coste, fuente y fecha de consulta. Punto de partida (de la auditoría): Kolibri, aula digital ProFuturo, Rori, Khanmigo, Colors of Kindness, Ubongo (Akili and Me), prototipos académicos offline, Panorama. **Antes de decir «ninguno hace X», buscar de nuevo.** Preferimos «hasta donde hemos encontrado».

## 6. Posibles usuarios y dónde encontrarlos (a decidir por Rodrigo)

- Docentes de primaria conocidos del equipo y de la universidad (incluidos alumnos de Educación si hay acceso).
- Responsables de programas de ProFuturo o mentores presentes en la sede (**preguntar si hay mentores o jurado accesibles**).
- ONG educativas con presencia en zonas rurales (correo corto; **no esperar respuesta en 48 h**).
- Docentes con experiencia internacional o voluntariado.

Realidad: en dos días **no habrá estudio de mercado**. Objetivo realista: **3–5 conversaciones breves** (10–15 min) o respuestas por escrito, más la evidencia documental. Esto se declara como lo que es.

## 7. Preguntas para docentes

1. Cuéntame cómo trabajas hoy temas como alimentación, emociones o qué hacer si un niño se pierde o se hace daño. ¿Con qué material?
2. ¿Qué parte de tu semana se va en adaptar o preparar material? ¿Qué adaptas más?
3. ¿Qué dispositivos tienes a mano en clase? ¿Con qué frecuencia hay Internet?
4. Si una herramienta te propusiera una actividad sobre alimentación con lo que come tu comunidad, ¿qué tendría que pasar para que la usaras con tus alumnos? ¿Qué te daría miedo?
5. (Mostrando la demo) ¿Qué cambiarías de lo que ves? ¿Qué falta o sobra?
6. ¿Cuánto tiempo estarías dispuesto/a a dedicar a revisar contenido generado?
7. ¿Quién decide qué herramientas se usan en tu escuela?

## 8. Preguntas para ONG y organizaciones

1. ¿Qué proyectos de educación o habilidades para la vida tenéis y con qué recursos?
2. ¿Qué os impide hoy escalar material a otras comunidades o idiomas?
3. ¿Cómo se financia una herramienta así (subvención, licencia, donante)? ¿Quién la aprueba?
4. ¿Qué exigencias de protección infantil y de datos tenéis?
5. ¿Qué evidencia de impacto os piden vuestros financiadores?
6. ¿Qué dispositivos y conectividad hay en vuestras comunidades?

(Evitar preguntas que sugieran la respuesta. No mencionar que ya tenemos la solución hasta preguntar por el problema. Anotar citas literales.)

## 9. Cómo validamos la necesidad

- **Mínimo útil (hoy y mañana por la mañana):** 3–5 conversaciones; registrar en `research/entrevistas/` con fecha, perfil (sin datos personales innecesarios), citas y conclusión.
- **Señal de apoyo parcial:** al menos 2 interlocutores confirman por separado el problema N1/N2 sin que se lo sugiramos.
- **Señal de alerta:** si la mayoría dice que no adaptan material o que ya cubren el tema, **se anota y se ajusta el pitch** (no se esconde).
- **Qué no se puede validar:** que los niños de 6–10 aprendan con la app. Se declara como limitación y como siguiente paso (piloto).

## 10. Cómo medimos el valor de la solución (en demo y en el futuro)

| Medida | Demo (hackathon) | Futuro (piloto) |
|---|---|---|
| Tiempo de adaptar un módulo | Cronometrado: manual vs asistido | Mediana por docente |
| Calidad percibida del contenido | Revisión del equipo con la lista de comprobación; si hay, 1–2 docentes | Valoración docente y de coordinadores |
| Funcionamiento offline | Prueba en modo avión en ≥ 2 dispositivos | Fallos por semana en el aula |
| Seguridad | Cumplimiento de la lista (sin chat, sin PII, con revisión) | Auditoría externa |
| Uso por niños | **No medible ahora** | Actividades completadas, retención |

## 11. Registro de evidencias

Cada hallazgo en `research/` lleva: fecha · fuente (enlace o persona/rol) · qué afirma · fiabilidad (alta/media/baja) · qué decisión afecta. Esto también sirve como **evidencia de desarrollo en las fechas del hackathon**.
