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
| Kolibri | Plataforma offline gratuita con contenido curricular **y habilidades para la vida**; Studio permite organizar y publicar recursos | Hipótesis de valor: reducir el trabajo de adaptación contextual con IA y revisión trazable. Hay que comparar el tiempo total con el flujo existente; compatibilidad futura sin implementar ([producto](https://learningequality.org/kolibri/about-kolibri/), [Studio](https://github.com/learningequality/studio/blob/unstable/README.md), consulta: 4 nov 2026) |
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

- Tiempo total de adaptación hasta aprobación: preparación, generación/espera, revisión, correcciones y exportación. [Protocolo comparativo](../research/medicion-adaptacion-demo.md). Ensayo solo si queda hueco después de M3. Sin medición ejecutada: no afirmar ahorro ni porcentajes; una generación desde caché no mide el tiempo de generación en directo.
- Porcentaje de actividades que el docente edita antes de aprobar (en la demo, simulado con revisores del equipo y **declarado como tal**).
- La demo funciona en modo avión: sí/no, en cuántos dispositivos.
- Al volver la red, la cola se sincroniza sin pérdidas: sí/no.

## 10. Modelo de negocio y transferencia al mercado

Investigación documental: **4 nov 2026**, ámbito de producto de Mario. [Análisis completo, presupuesto ilustrativo y 28 fuentes primarias](../research/mercado-y-financiacion-2026-11-04.md). Sustituye el registro de pendientes por conclusiones documentales y propuestas. **Nada cerrado por el equipo; H4 sigue sin validar.** No hay clientes, contactos realizados, presupuestos de compradores ni financiación confirmados en esta investigación.

### 10.1 Cliente, usuario y pagador

**[HIPÓTESIS] Segmento inicial recomendado:** ONG o red educativa que ya acompaña escuelas con dispositivos disponibles y necesita adaptar actividades a comunidades concretas. El docente prepara y revisa; la dirección de programa o red autoriza; la entidad operadora podría contratar y pagar con presupuesto de programa o financiación de terceros. La familia y el niño no son el pagador propuesto.

**[RECOMENDACIÓN, no decisión]** Empezar por un servicio delimitado de adaptación, revisión local, formación y soporte. Explorar una cuota de mantenimiento por programa solo si aparece demanda de continuidad. La licencia institucional para autoría alojada sigue como opción futura. No hay evidencia para fijar hoy precio por alumno o suscripción. **[HIPÓTESIS de escala]** Los servicios permitirían entrar y aprender; la herramienta permitiría reutilizar módulos, delegar autoría y revisión en equipos del socio y distribuir a más escuelas. Debe medirse si disminuyen las horas de incorporación y soporte por escuela y el esfuerzo de revisión por módulo. La revisión local conserva un coste: no se promete escala sin acompañamiento.

### 10.2 Organizaciones candidatas y cómo acceder

Las actividades y canales están documentados; la posibilidad de que contraten MOCHILA es una inferencia pendiente de validación.

| Prioridad | Organización | Encaje documentado | Entrada propuesta |
|---|---|---|---|
| A | ProFuturo | Implementación a través de contrapartes locales y alianzas tecnológicas | Presentación a través de Hack4Edu si se consigue, o [formulario oficial](https://profuturo.education/contacto/); pedir derivación a contenido/implementación. [Fuente de encaje](https://profuturo.education/aliados/) |
| A | Fe y Alegría Perú | Redes rurales andinas y equipo FYA Digital | `peru@feyalegria.org.pe`, publicado en su [web](https://feyalegria.org.pe/); pedir acceso a coordinación rural o digital. [Fuente de encaje](https://feyalegria.org.pe/que-hacemos/) |
| A | Entreculturas / REDEC | Vinculación con Fe y Alegría y canal educativo desde España | `educacion@entreculturas.org`, [contacto REDEC](https://redec.org/contacto/); solicitar derivación al equipo de cooperación pertinente. [Vínculo institucional](https://www.entreculturas.org/quienes-somos/) |
| B | Asante Africa | Recursos localizados, aprendizaje digital y presencia en Uganda | [Contacto institucional](https://asanteafrica.org/); confirmar responsable y atención a 6–10 años antes de proponer piloto |
| B | War Child | Programa Can’t Wait to Learn y actividad educativa en Uganda | [Canal de alianzas](https://www.warchild.net/the-care-system/evidence-based-methodologies/emb/cant-wait-to-learn/); buscar una necesidad complementaria, pues ya dispone de solución propia |
| B | Learning Equality / Kolibri | Ecosistema offline y comunidad de operadores | [Comunidad](https://community.learningequality.org/), para explorar distribución e interoperabilidad futura; no se ha acreditado como comprador |

Primera petición propuesta: revisar si una actividad concreta cubre una carencia del programa. Después habría que identificar decisor, partida y proceso de contratación. Un formulario de donaciones o de alianzas corporativas no acredita que la entidad compre soluciones educativas.

**Comprobaciones directas, 4 nov 2026:** AECID cerró el 22/05/2026 a las 23:59; GIF publica su última ventana cerrada; Fe y Alegría publica el buzón indicado; Asante Africa declara presencia en Uganda en su página principal. [Evidencia y límites de cada dato](../research/mercado-y-financiacion-2026-11-04.md#comprobación-directa-de-los-cuatro-datos-solicitados-por-sergio). Verificación documental del asistente; revisión humana de Mario y operatividad de contactos pendientes. **Posible compra, financiación y ahorro: hipótesis.**

### 10.3 Quién podría financiar MOCHILA

| Vía | Conclusión para MOCHILA | Fuente |
|---|---|---|
| Presupuesto de programa de ONG/red | Primera hipótesis a explorar; no hay partida ni compromiso identificados | Redes documentadas arriba; posibilidad de compra inferida |
| Patrocinio empresarial mediante un operador | Posible estructura para un piloto; la existencia de alianzas no acredita interés por MOCHILA | [Entreculturas: empresas](https://www.entreculturas.org/empresas/) |
| AECID innovación 2026 | Cerró solicitudes el **22 de mayo de 2026**; no es financiación disponible para solicitar hoy. Futuras ediciones exigirían comprobar bases y entidad solicitante | [Procedimiento oficial](https://www.aecid.gob.es/detalle-procedimiento-activo?_es_aecid_sede_procedimientos_ProcedimientoWebPortlet_id=workspace%3A%2F%2FSpacesStore%2F461a2350-0cf5-4b85-b41c-eefa8d362b37&p_p_id=es_aecid_sede_procedimientos_ProcedimientoWebPortlet&p_p_lifecycle=0&p_p_mode=view&p_p_state=normal&refererPlid=48326) |
| Fundación «la Caixa», cooperación internacional | Requiere entidad elegible con experiencia y socio local; no es solicitud directa de un equipo estudiantil. Edición y plazo por confirmar | [Requisitos publicados](https://fundacionlacaixa.org/es/convocatorias-sociales-cooperacion-internacional) |
| UNICEF Venture Fund | No accesible directamente en el estado documentado: exige empresa en país de programa, prototipo y requisitos adicionales; falta convocatoria educativa pertinente | [Requisitos oficiales](https://www.unicefventurefund.org/apply-funding) |
| Global Innovation Fund | Ventanilla cerrada según la página consultada; opción futura, sin solicitud inmediata | [Estado de solicitudes](https://www.globalinnovation.fund/apply-for-funding) |
| Botnar / Jacobs | No priorizar solicitudes espontáneas: no las aceptan o generalmente no las consideran | [Botnar](https://fondationbotnar.org/funding/), [Jacobs](https://jacobsfoundation.org/faqs/) |

Conclusión: preparar un piloto con operador y posible patrocinador tiene más fundamento inmediato que prometer acceso a una gran subvención. **No se ha verificado una ayuda abierta para la que este equipo pueda afirmar hoy su elegibilidad.** Las ayudas de desarrollo no equivalen a ingresos recurrentes de clientes.

### 10.4 Qué tendría que demostrar el primer piloto

**[PROPUESTA]** Seis semanas, 2–3 escuelas, 4–6 docentes, un módulo y un contexto con revisión local. Es trabajo futuro, no acordado. La nueva petición de Sergio añade una conversación real antes del viernes 6; [plan y registro](../research/conversacion-real-antes-del-viernes.md), pendiente y sin contacto enviado. Comparar tiempo total de preparación y revisión manual frente al asistido, calidad, funcionamiento offline y horas de soporte. Continuidad comercial exige un responsable y un proceso presupuestario identificados; no basta el entusiasmo por la demo.

El informe contiene un coste ilustrativo de **2.760 €**, construido con 88 horas a 25 €/h, 100 € de operación y 20 % de contingencia. **Supuestos propios, no tarifa validada ni oferta**; excluye dispositivos, viajes, impuestos y evaluación causal. El precio y la rentabilidad siguen pendientes.

### 10.5 Restricciones y diferenciación

Kolibri ya incluye habilidades para la vida y permite organizar contenido: **no diferenciarnos diciendo que solo cubre lo académico**. La oportunidad a comprobar es ahorrar trabajo de adaptación contextual con revisión humana y uso offline. La compatibilidad con Kolibri no está implementada.

La monetización debe revisar derechos del material utilizado y requisitos de cada socio. La cláusula NC no impide al titular comercializar su propio material, pero restringe usos de terceros; cobrar por servicios no elimina automáticamente esas restricciones. No se modifica ninguna licencia. [Creative Commons: explicación oficial](https://creativecommons.org/faq/).

Frase de transferencia propuesta para el pitch: «Nuestra hipótesis es entrar mediante adaptación, formación y soporte a una red educativa. La herramienta permitiría reutilizar módulos y que los equipos del socio preparen y revisen actividades para más escuelas. Debemos comprobar cuánto acompañamiento requiere y quién lo pagaría».

**Licencia (P-08): decide Sergio con el equipo. Su propuesta es MIT para código y CC BY-NC-SA para documentación y contenido; aún no se registra como decisión aprobada. No incluir afirmaciones sobre licencia o permisos comerciales en el pitch.** Sin medición propia no se publican cifras de ahorro; la demostración del flujo por sí sola no prueba ahorro.

### 10.6 Pendientes de revisión y entrega

- Mario debe abrir y leer personalmente las cuatro fuentes: [lista de comprobación humana](../research/revision-humana-fuentes.md). La lectura del asistente no cuenta como revisión humana.
- Conseguir una conversación real de unos 10 minutos antes del viernes 6; registrar fecha y notas. Todavía pendiente. La simulación es exclusivamente interna: no se incorpora a diapositivas, vídeo ni guion ni se cita como evidencia.
- Ensayo de medición solo si hay hueco después de M3; en caso contrario usar: «La IA propone un borrador y aquí lo revisamos. Todavía no hemos medido si el proceso completo ahorra tiempo».
- Alinear el PowerPoint y el guion con la demo realmente probada antes del **jueves 5 de noviembre, 16:30 (Europe/Madrid)**. Tarea pendiente y separada de esta PR documental; no acredita actualización del PPTX.
