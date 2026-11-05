# PROJECT_CONTEXT — contexto completo del proyecto

Última revisión: 4 nov 2026 (arranque de la fase de ejecución; roles de Mario y Rodrigo intercambiados: Mario producto/pitch, Rodrigo frontend). Este archivo es el punto de entrada para humanos e IAs. **Si algo aquí contradice a otro documento, gana este y se corrige el otro.** Responsable: Sergio.

Convención de estados: **[DECIDIDO]** · **[HIPÓTESIS]** (hay que validarla) · **[PENDIENTE]** (nadie lo ha resuelto).

---

## 1. Hack4Edu 2026 (según las bases)

- VII edición, organizada por ProFuturo y UPSA. Soluciones a retos educativos con IA.
- **Plazo de ejecución:** del 3 de noviembre a las 9:00 al 5 de noviembre a las 23:59 (hora local) (Bases, plazos).
- **Entrega** (formulario de la web, preselección local): presentación de 5 minutos, enlace a vídeo de 3 minutos y enlace a GitHub con el código. *En otro punto las bases dicen «ppt o vídeo»: preparamos los tres para no arriesgar.*
- **Preselección local:** jurado de 3 expertos. Si la sede tiene más de 2 equipos, pasan 2 proyectos (1 innovadora + 1 senior). La sede remite el acta el **5 de noviembre**.
- **Final internacional:** 7 de noviembre; prototipo en un máximo de 5 minutos; fallo el 7 (el día 6 se revisa la completitud de los finalistas).
- **Modalidades** (cada equipo concurre a una; se declaró en la inscripción — **[PENDIENTE] confirmar cuál es la nuestra**):
  - *Innovadora* (desarrollo exclusivamente durante 3–5 nov): creatividad e innovación 40 % · acabado y calidad 20 % · transferencia al mercado 20 % · orientación a educación digital con IA en países desfavorecidos 20 %. **Penalización del 20 % si no hay evidencias suficientes de haberlo desarrollado en esos días.**
  - *Senior* (trabajo previo permitido, hay que declarar qué se hizo en el hackathon): 20 % · 30 % · 30 % · 20 %, mismos criterios en ese orden.
- **Premio Retos ProFuturo** (transversal, solo si el reto es «Reto ProFuturo»): impacto social en contextos vulnerables 25 % · enfoque inclusivo y equitativo 25 % · sostenibilidad y escalabilidad 25 % · uso ético y responsable de la IA 25 %. Genera un segundo ranking independiente.
- **Premios exclusivos:** si un proyecto gana en dos rankings se aplica la regla de exclusión (Base 7).
- **Licencia:** hay que liberar el trabajo con licencia libre. Código: cualquier licencia de opensource.org. Documentación y assets: se recomienda CC BY-NC-SA 3.0 (Bases, apartado de propiedad intelectual).
- **Código ético:** se excluyen retos no relacionados con educación digital.
- **Aula de sede:** las bases solo garantizan una hora por la mañana y otra por la tarde los días 4 y 5 para resolver dudas de desarrollo. No es una jornada completa de trabajo en aula.

### 1.1 Calendario: lo que dicen las bases frente a lo que nos han comunicado

| Fuente | Qué dice |
|---|---|
| Bases | Ejecución 3 nov 9:00 → 5 nov 23:59. Subida al formulario al terminar el plazo. Resolución local y acta el 5 nov. Día 6: recepción de finalistas. Final el 7. |
| Comunicado a la sede (según el equipo) | «Dos jornadas, de 9:30 a 20:30, con presentación local el viernes.» |
| Confirmado con la sede (4 nov, según Sergio) | Desarrollo hasta el **jueves 5 nov a las 23:59**; la entrega puede enviarse hasta esa hora. **Presentación local el viernes 6 nov de 12:00 a 14:00**; el turno concreto de nuestro equipo **no se conoce** y no se puede saber todavía. |

**Estado de las discrepancias (actualizado el 4 nov):**

1. **Viernes = 6 nov y bases con resolución local el 5 nov.** La sede indica presentación el viernes 6 de 12:00 a 14:00. Seguimos sin saber si es el pitch ante el jurado local; **[PENDIENTE]** preguntar si el acta se emite igualmente el 5 nov.
2. **Jornadas de trabajo:** se asumen **miércoles 4 y jueves 5 nov** (escenario A). Se marca qué recortar si no es así (ver `TASK_BOARD.md`).
3. **Entrega:** vence el jueves 5 nov a las 23:59 (confirmado por la sede). Congelamos funcionalidades el jueves a las 16:30.
4. **Hora de nuestro turno, duración y formato** de la presentación del viernes: **desconocidos**. No inventarlos.

## 2. Equipo TIOVIVO.exe

Cinco estudiantes de 4.º. Cuatro con MacBook Air M1 (16 GB, 512 GB); el de Alejandro es un M3.

| Persona | Estudios | Herramientas de IA / infraestructura |
|---|---|---|
| Sergio Chillón Sendín | Ing. Informática + ADET | ChatGPT Go, Google AI Pro y un asistente de código de pago (autenticados en su Mac), Antigravity en su VPS Oracle. **Único Mac con Git, GitHub CLI, auth GitHub y VS Code confirmados.** |
| Rodrigo Cabezas Pérez | Ing. Informática + ADET | ChatGPT Plus, acceso temporal a Grok, VPS Oracle propio |
| Mario Ullán Motellón | Ing. Informática | ChatGPT Plus |
| Alejandro Estévez | Ing. Informática | Sin suscripción de IA de pago (herramientas gratuitas; Mac M3) |
| Carlos Herrero | Ing. Informática | ChatGPT Plus |

- VPS Oracle (Sergio y Rodrigo): Ampere A1, ~24 GB RAM, ~200 GB. **Opcionales**: nada crítico puede depender de ellos.
- GitHub Student Developer Pack y herramientas gratuitas de estudiante: **[PENDIENTE] comprobar quién lo tiene activo** (condiciona la protección de `main`, ver `GIT_WORKFLOW.md`).
- El asistente de código de pago solo lo tiene Sergio. Nadie está obligado a contratar nada.

## 3. Reto elegido

**Reto 02 · Aprender sin conexión** — «¿Cómo ofrecer una experiencia de aprendizaje digital de calidad cuando Internet es lento, caro o simplemente no existe?» **[DECIDIDO, provisional]**. Número y título **verificados contra el catálogo oficial (Listado_Retos.pdf, 4 nov)**; lleva la etiqueta «Reto ProFuturo».

Texto del reto: solución educativa *offline-first* para escuelas o comunidades con conectividad limitada, que sincroniza cuando vuelve la red; puede incluir contenidos, actividades, seguimiento del progreso, comunicación docente o IA ejecutada localmente.

**Encaje:** offline-first ✔ (el reproductor funciona sin red) · sincronización ✔ (cola de progreso) · contenidos y actividades ✔ · seguimiento del progreso ✔ · comunicación docente ✔ (panel) · IA «ejecutada localmente»: **solo parcial**. La IA pesada (generación) corre con conexión en la fase de autoría. La IA local en el navegador es un extra **Prescindible**. No venderlo como IA 100 % local.

**Plan B (solo si hay un bloqueo grave y se decide en equipo):** Reto 24, según la auditoría. No se trabaja en paralelo.

## 4. MOCHILA

Plataforma para niños de 5 a 12 años (tramos 5–8, 6–10 y 9–12) en contextos vulnerables o con baja conectividad, centrada en **habilidades para la vida**: educación emocional, convivencia y valores, alimentación saludable con alimentos locales y presupuesto limitado, higiene y salud, primeros auxilios y seguridad básica, autonomía cotidiana. **[DECIDIDO]** El foco inicial es **emocional/social y habilidades para la vida**. Lo cognitivo queda como línea abierta a investigación, **no** como objetivo principal.

Qué implementamos de verdad en el MVP (**[DECIDIDO]**): ver `PRODUCT_BRIEF.md`. En resumen, 1 módulo completo en 2 contextos; los otros módulos solo si hay tiempo.

## 5. Objetivos

1. Una demo que **funcione de verdad sin conexión** (modo avión) y que el jurado pueda ver.
2. Demostrar que la IA aporta algo real: **adaptar contenido a otro país/comunidad** con revisión humana.
3. Un pitch de 5 minutos con problema, usuario, diferenciación, impacto, ética y vía de transferencia.
4. Repositorio limpio, con licencia libre y evidencias de desarrollo en las fechas del hackathon.
5. Maximizar a la vez: ranking de modalidad y Premio Retos ProFuturo (impacto, inclusión, sostenibilidad, ética).

## 6. Alcance

**Dentro:** autoría con conexión → revisión humana → paquete JSON → reproductor PWA offline → progreso con avatares → sincronización manual a un panel docente simulado → datos sintéticos.

**Fuera (no se hace sin aprobación del integrador y del dueño de producto):** chat abierto para niños; cuentas con datos reales de menores; plataforma «universal» de todas las asignaturas; contenido cognitivo (lectoescritura, matemáticas) como objetivo; pagos; analítica avanzada; más de 2 contextos y 3 módulos; app nativa.

## 7. Restricciones

- Tiempo: dos jornadas. Congelar funcionalidades antes del final (ver plan).
- Hardware: Macs M1 de 16 GB. Nada que exija GPU potente. Un LLM local en el navegador puede ser inviable en móviles de gama baja: es Prescindible.
- Dinero: **0 €**. Sin servicios de pago sin autorización del equipo.
- Privacidad: **sin datos personales reales de menores** en demo ni repo. Datos sintéticos y avatares.
- IA y menores: sin chat abierto, sin inferencia de emociones de niños (ni cámara, ni voz, ni texto libre analizado). Contenido con **revisión humana obligatoria** antes de llegar al niño.
- Claves/tokens: **jamás** en el repo ni pegados en chats de IA.

## 8. Recursos disponibles

Ver §2. Gratuitos a verificar antes de usar: tier gratuito de la API de Gemini (existe; los límites los fija Google y cambian; **en el tier gratuito el contenido enviado puede usarse para mejorar productos de Google**, así que solo enviar contenido sin datos personales), GitHub Copilot Student y Pack de estudiantes (solo si cada persona lo tiene verificado). Las suscripciones de chat (ChatGPT, Google AI Pro y similares) **no equivalen a crédito de API** (hasta donde sabemos; comprobar).

## 9. Decisiones tomadas

| ID | Decisión | Estado |
|---|---|---|
| D-01 | Reto 02 con MOCHILA; plan B Reto 24 | Decidido (provisional) |
| D-02 | Autoría con conexión, uso sin conexión | Decidido |
| D-03 | Sin chat abierto para niños; revisión humana obligatoria | Decidido |
| D-04 | Foco en habilidades para la vida; lo cognitivo no es objetivo principal | Decidido |
| D-05 | 2 contextos (Andes rurales de Perú en ES; norte de Uganda en EN) × módulo alimentación como Imprescindible; «pedir ayuda» y «emociones» como Importantes | Decidido (ajustable por el integrador) |
| D-06 | Un repo, `main` protegida, PR obligatorias, un integrador (Sergio) | Decidido |
| D-07 | Datos sintéticos y avatares; sin PII | Decidido |
| D-08 | No afirmar que la brecha socioemocional supera a la cognitiva | Decidido |

## 10. Cuestiones pendientes

| ID | Pendiente | Quién lo resuelve | Para cuándo |
|---|---|---|---|
| P-01 | Confirmar con la sede las dos jornadas, el viernes y la hora de entrega. **Parcial:** entrega hasta el jueves 23:59 y presentación el viernes 12:00–14:00 confirmadas; falta el turno (no se puede saber aún) y si el acta sigue siendo el 5 nov | Sergio (vía interlocutor) | Re-preguntar el jueves |
| P-02 | Modalidad declarada (innovadora/senior) | Sergio | Hoy |
| P-03 | ~~Estado de GitHub Pro / Student Pack~~ **Resuelto:** Sergio tiene GitHub Pro por el Student Pack; `main` está protegida (PR obligatoria, 1 aprobación, sin force push ni borrado) | Sergio | Hecho |
| P-04 | ~~Estado de los 4 Macs restantes~~ **Resuelto (según Sergio):** entornos listos; todos están en el repo y han hecho su PR de prueba | Cada persona | Hecho |
| P-05 | Stack: Node + TypeScript (server): **aprobado (ADR-002)**. Front: propuesta Vite + TypeScript + vite-plugin-pwa; React o vanilla lo decide Rodrigo (ADR-001, pendiente de su respuesta) | Sergio con Rodrigo y Alejandro | Hoy, antes de 13:30 |
| P-06 | Proveedor de IA: **generación asistida (JSON pegado y validado) desde el inicio**; Gemini gratuito solo como añadido si el equipo lo confirma (ADR-002) | Alejandro + Sergio | Gemini: hoy, antes de 15:00 |
| P-07 | Hosting del demo con HTTPS para probar en móviles (el service worker exige HTTPS salvo localhost) | Sergio + Rodrigo | Hoy |
| P-08 | Licencia de código (propuesta: MIT o Apache-2.0) y de contenido (recomendada por bases: CC BY-NC-SA 3.0) y visibilidad del repo en la entrega | Sergio, con todos | Antes de la entrega |
| P-09 | Quién del equipo sale a validar con docentes/ONG y a quién | Mario | Hoy |
| P-10 | Revisión pedagógica externa (alguien de Educación), si es posible | Carlos + Mario | Mañana |
