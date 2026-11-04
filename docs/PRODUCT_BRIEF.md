# PRODUCT_BRIEF — qué construimos y para quién

Responsable: Rodrigo (producto). Estados: **[DECIDIDO]** · **[HIPÓTESIS]** · **[PENDIENTE]**. Nada de lo marcado como hipótesis está validado todavía.

---

## 1. Problema

En comunidades con Internet lento, caro o inexistente, el material digital de **habilidades para la vida** para niños de 6–10 años es escaso, está en un idioma o contexto que no encaja (p. ej. «come más fruta» donde la fruta no se compra) y no se puede usar sin red. Los docentes tienen poco tiempo para adaptar material a mano. **[HIPÓTESIS]** que esto es un dolor real y priorizado por docentes y ONG: **por validar**.

Lo que **sí** está respaldado por la auditoría: el aprendizaje fundacional es la brecha medida a escala internacional; no hay datos para ordenar la brecha cognitiva frente a la socioemocional en 6–10 años. No usamos ese argumento.

## 2. Usuarios y beneficiarios

| Rol | Quién | Qué necesita |
|---|---|---|
| Usuario-configurador | Docente / educador de ONG | Adaptar material a su comunidad rápido, **controlar y aprobar** lo que ven sus alumnos, funcionar sin red |
| Beneficiario | Niño de 6–10 años | Historias y juegos simples, con audio, en su idioma y con su comida/entorno |
| Comprador potencial (**[HIPÓTESIS]**) | ONG, fundaciones, programas educativos, administraciones | Impacto medible, coste bajo, seguridad infantil, escalabilidad |
| Observador | Familias | Confianza: sin datos personales, sin desconocidos |

## 3. Necesidades detectadas (todas **[HIPÓTESIS]** salvo que se anote evidencia)

1. Contenido relevante localmente (alimentos, recursos, costumbres).
2. Uso sin conexión real, con sincronización diferida.
3. Control docente: revisar antes de mostrar al niño.
4. Seguridad: nada de chat abierto, nada de datos personales.
5. Bajo coste de dispositivo: móviles/tablets modestos, compartidos.
6. Poca carga cognitiva: avatares, audio, pictogramas, frases cortas.

## 4. Propuesta de valor

> Un docente describe su comunidad; la IA prepara actividades de habilidades para la vida adaptadas a ella; el docente las revisa y las aprueba; los niños las usan sin Internet y el progreso se sincroniza cuando hay red.

## 5. Diferenciación (qué decimos y qué no)

| Alternativa | Qué hace | Lo nuestro frente a ella |
|---|---|---|
| Kolibri (offline, académico) | Plataforma offline con contenido curricular | Habilidades para la vida + **adaptación por IA con revisión** + compatibilidad futura (no sustituimos) |
| Aula digital ProFuturo (servidor, router, tablets) | Infraestructura offline en aulas | MOCHILA es una capa de contenido contextual que podría correr encima. **No competimos con la infraestructura** |
| Rori, Khanmigo (tutores IA) | Chat de IA para cognitivo | Sin chat abierto para niños; IA solo en autoría |
| Colors of Kindness, Ubongo (socioemocional) | Contenido socioemocional fijo | Contenido **regenerable por contexto** local |
| Prototipos académicos offline | Pruebas de concepto | Flujo completo (autoría → revisión → offline → sync) |

Frase de diferenciación **[DECIDIDO]**: «No es otro tutor-chatbot; es una fábrica de material contextual **revisado por humanos** que **funciona sin red**».
No decir «el único». No afirmar que nadie lo hace.

## 6. Casos de uso del MVP

1. **Autoría:** una docente de los Andes rurales introduce idioma (ES), alimentos disponibles (papa, quinua, habas, maíz…), recursos y duración. La IA propone el módulo «Alimentación local». Ella cambia una actividad, aprueba y exporta. *(Ejemplos de alimentos: **[HIPÓTESIS]** a validar con alguien que conozca el contexto; en demo se presentan como ejemplo, no como dato antropológico.)*
2. **Adaptación a otro contexto:** el mismo módulo para el norte de Uganda en inglés (alimentos locales como maíz, frijoles, mijo, yuca… **a validar**). Se muestra cuánto cambia el contenido y cuánto tarda.
3. **Uso en el aula sin red:** el niño elige un avatar, escucha una historia corta y resuelve actividades con modo avión activado.
4. **Sincronización:** al volver la red, el docente pulsa «enviar progreso» y ve un resumen agregado (por avatar o por código de clase) en un panel simulado.

## 7. Funcionalidades y prioridades

**Imprescindible (si esto no funciona, no hay demo):**
- I-1 Esquema de paquete (`contracts/`) congelado en el hito M1.
- I-2 Módulo «alimentación local» con 4–5 actividades en 2 contextos, **revisado y con sello**.
- I-3 Flujo de autoría: formulario → generación (con IA o con caché) → editar/aprobar → exportar.
- I-4 Reproductor PWA instalable que funciona en modo avión.
- I-5 Progreso local con avatares (sin PII) + cola de sincronización + sincronización manual a panel docente.
- I-6 Datos sintéticos y aviso de privacidad visible.

**Importante:**
- M-1 Módulo «cuándo pedir ayuda a un adulto» (escenarios cerrados; **no** temas de abuso en el MVP).
- M-2 Módulo «emociones» (identificar y nombrar; sin inferencia de emociones).
- M-3 Audio con la voz del navegador (TTS) en ES e EN.
- M-4 Panel docente con agregados sencillos.

**Prescindible (solo si sobra tiempo, nunca a costa de lo anterior):**
- P-1 LLM local en el navegador para reformular contenido ya aprobado.
- P-2 Voz neuronal offline (Piper WASM).
- P-3 Exportación compatible con Kolibri.
- P-4 Gamificación avanzada, más idiomas, más contextos.

## 8. Hipótesis que hay que validar

| # | Hipótesis | Cómo se valida (ver `RESEARCH_AND_VALIDATION.md`) | Estado |
|---|---|---|---|
| H1 | Docentes/ONG en contextos de baja conectividad carecen de material de habilidades para la vida adaptado | 3–5 conversaciones cortas + fuentes | Sin validar |
| H2 | Un docente aprobaría contenido generado por IA **si puede revisarlo y editarlo** | Mostrar el flujo a 2–3 docentes | Sin validar |
| H3 | El tiempo de adaptación manual es un coste real | Preguntar cuánto tardan hoy | Sin validar |
| H4 | Existe quien pague (ONG/fundación/programa) | Preguntar presupuesto y proceso de compra | Sin validar |
| H5 | El modelo offline-first con sincronización diferida es viable con dispositivos de aula | Prueba técnica offline + preguntas | Sin validar |
| H6 | Niños de 6–10 pueden usarlo con audio y poca lectura | **No podemos validarlo con niños reales en el hackathon.** Se declara como limitación | No validable ahora |

## 9. Métricas (de demo, no de impacto real)

- Tiempo de generación de un módulo adaptado.
- Porcentaje de actividades que el docente edita antes de aprobar (en la demo, simulado con revisores del equipo y **declarado como tal**).
- La demo funciona en modo avión: sí/no, en cuántos dispositivos.
- Al volver la red, la cola se sincroniza sin pérdidas: sí/no.

## 10. Modelo de negocio (**[HIPÓTESIS]**, a explorar por producto)

- Licencias institucionales a ONG/fundaciones/programas para generar y alojar paquetes.
- Servicios de adaptación contextual y formación docente.
- Ojo: la licencia de contenido recomendada por las bases (CC BY-NC-SA) limita la explotación comercial del **contenido**; el negocio tendría que apoyarse en servicio, plataforma y mantenimiento. Producto debe decidir y justificarlo.
