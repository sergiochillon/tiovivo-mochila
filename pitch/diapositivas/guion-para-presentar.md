# Guion del pitch · MOCHILA · v9

Presentación de trabajo: [mochila-pitch-v9.pptx](mochila-pitch-v9.pptx), **ocho diapositivas**. Las versiones anteriores disponibles se conservan localmente en `pitch/historico/`; esta PR incorpora la versión actual, sin los archivos de trabajo internos.

Pitch presencial de **cinco minutos** (no el vídeo de tres). Las ventanas siguientes son un **presupuesto, no un ensayo**. El cuerpo oral suma 465 palabras; incluyendo transiciones y «Gracias», unas 499. Con 100 s de demo, son aproximadamente 5:00 a 150 palabras/minuto o 5:14 a 140, sin pausas ni incidencias. Hay que recortar y ensayar antes de cerrar la duración. La diapositiva 4 reserva el espacio de la demo, que sigue pendiente.

## Estado para revisión de la PR 10 · 4 nov 2026

La grabación se realizará **mañana, jueves 5 de noviembre**, según Mario. No existe todavía un vídeo final ni un ensayo final cronometrado registrado por Mario. El PPTX v9 se incorpora tal como lo entregó Mario, conservando animaciones; la página 4 sigue reservada. Sus etiquetas generales de integración pendiente se revisarán con el ensayo final antes del congelado de las 16:30.

- **Referencia técnica:** `main`, commit `9d1afbd`, facilitado por Álex. Sin URL alojada estable; acceso del iPhone mediante el túnel HTTPS temporal de ADR-003.
- **Recorrido para mañana:** `/autoria`, borrador sintético guardado → editar, revisar y aprobar → `/alumno?pack=<id>` con Wi-Fi → PWA en modo avión, reapertura y actividad → recuperar Wi-Fi → `/docente`, «Enviar progreso» y contadores. Confirmar el borrador en el servidor elegido; no depender de una llamada nueva a Gemini ni atribuir generación a un borrador sin confirmar su origen.
- **Actividad propuesta por Carlos:** `elige-lo-disponible`, paquete `alimentacion-andes-es`; revisión pedagógica aprobada por Carlos Herrero el 4 nov. La modificación de autoría y el paquete concreto resultante deben quedar revisados antes de mostrarlos como aprobados.
- **Evidencia registrada:** Rodrigo completó tres actividades Andes en iPhone 17/iOS 27.2/Safari, modo avión, y sincronizó 0/0 → 3/3 al recuperar Wi-Fi (`0900e78`). PWA instalada y reapertura desde el icono registradas en ese commit. No trasladar esa prueba a otra versión ni al paquete Uganda.
- **Uganda:** aprobación pedagógica confirmada por Carlos; esa prueba offline en iPhone corresponde solo a Andes. Validación cultural local y pruebas con niños pendientes para ambos contextos.
- **Reparto propuesto por Álex, pendiente del ensayo:** Rodrigo guía la parte técnica; Mario maneja el iPhone y graba; Álex prepara API y borrador. No cambia la responsabilidad de Mario sobre el pitch.

Fuentes: mensajes trasladados por Mario, [estado actualizado](../estado-demo-2026-11-04.md), [lista de ensayo](../../qa/checklist-demo.md) y [registro de QA](../../qa/registro-pruebas.md), consultados en `origin/main` (`9d1afbd`). No son pruebas ejecutadas por el asistente.

Hilo visual: la mochila que prepara el docente y que acompaña al aula cuando no hay red; el sendero discontinuo terracota es el recorrido. Las ilustraciones de las diapositivas 1, 2, 6 y 8 son dibujos vectoriales hechos para el pitch y llevan la etiqueta «Ilustración conceptual»; la 7 usa tres iconos del mismo estilo, sin logos. La ilustración de la 3 está generada con IA y lo dice en pantalla.

Los bloques entrecomillados son lo que se dice. El texto de pantalla es apoyo: no hace falta leerlo.

## 1. Problema · «Aprender cuando no hay conexión» · 0:00–0:26

En pantalla: mochila en un paisaje de montaña con la señal de wifi desvaneciéndose; título e hipótesis. Etiqueta: «Sin validar con usuarios · niños de 6–10 años».

> Somos TIOVIVO.exe y esto es MOCHILA, nuestra propuesta para el reto Aprender sin conexión. Pensad en un docente con niños de seis a diez años y una conexión que va y viene. Nuestra hipótesis es que le faltan materiales de habilidades para la vida que encajen con su comunidad y que pueda usar sin Internet. Ojo: es una hipótesis. Todavía no la hemos contrastado con docentes.

Transición: «¿Cómo lo resolveríamos? Con una mochila.»

## 2. Propuesta y papel de la IA · «El docente prepara la mochila. El aula la usa sin red.» · 0:26–0:59

En pantalla: tres viñetas unidas por el sendero: preparar (con red · docente + IA), revisar y aprobar (el docente corrige y aprueba), usar sin conexión (sin red · sin hablar con la IA). Debajo, un **ejemplo ilustrativo**: el docente indica alimentación · español · 6–10 años · papa y habas; la IA adaptaría historia, instrucciones, preguntas, opciones y explicaciones. Etiqueta: «Esquema conceptual · flujo previsto, integración pendiente».

> En tres momentos. Primero, con conexión, el docente indica edad, idioma, tema y recursos. Por ejemplo: alimentación, en español, para niños de seis a diez años, con papa y habas. La IA le ayudaría a adaptar la historia, las instrucciones, las preguntas, las opciones y las explicaciones. Segundo, el docente corrige ese borrador y lo aprueba; encajar con la cultura local exige además una revisión local. Y tercero, en clase y sin red, los niños usan el paquete sin hablar con la IA.

Transición: «Pongamos un ejemplo de aula.»

Si preguntan: el ejemplo es ilustrativo, MOCHILA no ha generado ese módulo. La generación necesita conexión; lo que funciona sin red es usar el paquete ya aprobado.

## 3. Escenario · «Una escuela rural. Una tablet para varios.» · 0:59–1:28

En pantalla: la ilustración del aula ocupa casi toda la página; a la izquierda, la frase y tres rasgos (conexión intermitente · alimentación, 6–10 años · papa y habas de la zona). Pie: «Ilustración generada con IA. No es una escuela real ni un piloto».

> Imaginemos una escuela rural en los Andes de Perú, con una conexión que va y viene y pocas tablets para todo el grupo. La maestra aprovecha un rato con red para preparar y revisar el módulo de alimentación con productos de la zona, y después lo usa en clase sin conexión. Es una escena inventada y la ilustración está hecha con IA: sirve para explicar el uso, no es una experiencia real.

Transición: provisional, se cierra con la demo.

## 4. Demo técnica pendiente · reserva 1:28–3:08

Sin guion oral hasta confirmar la demo. La página es un marco discontinuo vacío («Aquí, solo lo comprobado»), sin pantallas de la aplicación. Antes de redactarla, reunir: versión o commit, recorrido que funciona y quién lo ejecutó, paquete enseñado y su estado de revisión, dispositivo/navegador y resultado sin red, y si el progreso llega al panel. Si solo hay una parte comprobada, se enseña como demostración parcial y el resto se explica como previsto. La demo es el sitio natural para enseñar el criterio de funcionamiento de la diapositiva 5, pero solo con lo que se haya probado.

Mientras se ensaya sin demo, saltar esta página.

## 5. Aportación y cómo la comprobaríamos · «Un recorrido completo para el aula rural» · 3:08–3:31

En pantalla, sobre fondo terracota: a la izquierda, «MOCHILA propone preparar actividades contextualizadas, revisarlas y utilizarlas sin conexión, con seguimiento posterior» y «El docente decide qué llega al niño»; a la derecha, «¿Cómo sabríamos si sirve?» con tres criterios: **tiempo** (preparación total, con correcciones y revisión, frente a la habitual), **calidad** (claridad, respuestas correctas y adecuación al contexto) y **funcionamiento** (reabrir sin conexión, conservar el progreso y enviarlo después). Etiqueta: «Criterios propuestos · sin ahorro ni mejora demostrados».

> ¿Qué aportamos? Ya existen plataformas offline, IA para docentes y contenidos contextualizados. MOCHILA propone unirlos en un solo recorrido, con el docente decidiendo qué llega al niño. ¿Cómo sabríamos si sirve? Mediríamos el tiempo total de preparación frente al habitual, la calidad del material y que funcione sin red. Hoy no tenemos ahorro ni mejora del aprendizaje demostrados.

Transición: «Y si el docente decide qué entra en la mochila, hablemos de protección.»

Si preguntan: son criterios propuestos, no resultados; el protocolo está en `research/medicion-adaptacion-demo.md`. Para alternativas (Kolibri, ProFuturo, Khanmigo…), usar `research/competencia.md`, sin afirmar exclusividad.

## 6. Protección · «Solo entra en la mochila lo que el docente aprueba» · 3:31–3:55

En pantalla: una tarjeta con sello de aprobado entra en la mochila abierta; fuera queda un bocadillo de chat tachado. Tres principios de diseño. Etiqueta: «Condiciones de diseño, por comprobar · sin piloto con niños».

> El diseño exige que una persona revise y apruebe el material antes de que entre en la mochila; validar el formato no basta. No hay chat abierto con niños ni inferencia de emociones, y en la demo usamos avatares y datos sintéticos. Son condiciones de diseño: falta comprobarlas en la versión integrada, y no hemos evaluado el aprendizaje con niños.

Transición: «Queda cómo seguir después del hackathon.»

## 7. Financiación · «Financiación y continuidad» · 3:55–4:23

En pantalla: «**Para qué:** terminar la integración, probar dispositivos, revisar contenidos con conocimiento local y preparar un piloto pequeño». Debajo, tres vías unidas por el sendero, cada una con un dato y su estado:

| Vía | Dato | Estado |
|---|---|---|
| 1. Patrocinio de un piloto con una ONG | **Precedente:** ProFuturo, de las fundaciones Telefónica y «la Caixa», arrancó con un piloto en Angola (2016) | Por explorar · sin patrocinador |
| 2. Apoyo universitario | **UPSA Emprende:** mentoría semanal, formación, networking y Demo Day con premios | Edición 2026-27 · plaza por confirmar |
| 3. Préstamo ENISA, ya como empresa | **Requisitos:** sociedad constituida en España y fondos propios al menos iguales al préstamo; sin avales | Futuro · se devuelve con intereses |

Banda final, «Financiar ≠ sostener»: un piloto financiado no son clientes; nos sostendríamos con adaptación, formación y soporte a organizaciones educativas y, después, con la herramienta.

> Para seguir necesitamos financiación: para terminar la integración, probar dispositivos, revisar contenidos con conocimiento local y preparar un piloto pequeño. Exploramos tres vías: un patrocinio para un piloto con una ONG, que tiene precedentes como ProFuturo; apoyo universitario, como UPSA Emprende; y, ya como empresa, un préstamo de ENISA, que se devuelve. Nada está confirmado. Y un piloto financiado no son clientes: para sostenernos venderíamos adaptación, formación y soporte.

Transición: «¿Qué necesitamos ahora?»

Si preguntan:
- **Financiación en general:** no hay financiación confirmada, presupuesto cerrado, acuerdos ni inversores interesados.
- **Patrocinio:** no hay patrocinador ni ONG socia. ProFuturo es un precedente, no una señal de que vaya a financiarnos; además plantea el reto, así que hay que decirlo con tacto. Según la nota de prensa conjunta de Telefónica y Fundación «la Caixa» (14 jul 2016), nació de la alianza de las dos fundaciones, con un aula digital móvil que funciona sin conexión y un primer piloto en Angola.
- **UPSA Emprende:** forma parte del Club Universitario de Innovación 2026-2027 (noticia de la UPSA, 13 oct 2026), dentro del Plan TCUE 2024-2027 de la Junta de Castilla y León. Ofrece mentoría personalizada, formación, networking y un Demo Day con premios en metálico. **No son becas.** La noticia no publica cuantías ni plazo para 2026-27; en 2025-26 los premios fueron de 500 € (Explora) y 1.000 € (Acelera), que no deben presentarse como los de este año. No estamos inscritos ni seleccionados.
- **ENISA:** según su web (consultada el 4 nov 2026), el préstamo participativo es para sociedades constituidas en España, pymes con modelo innovador y fondos propios al menos iguales al préstamo. Se devuelve, parte de los intereses depende de los resultados, no pide avales y ENISA no entra en el capital. No es una subvención ni una inversión a cambio de participaciones. Hoy no tenemos empresa, así que no somos elegibles.
- **Clientes:** no tenemos. Quien usaría MOCHILA es el docente; quien la adoptaría, una ONG o red educativa. Pagador y presupuesto sin validar. Nada sobre licencia (decisión P-08).

## 8. Siguiente paso y cierre · «Material revisado para usar sin conexión» · 4:23–4:46

En pantalla: «**Siguiente hito:** una versión integrada y probada, y una organización o profesional educativo que revise el encaje del módulo» y «**Lo que buscamos:** colaboración para revisar la necesidad, el contenido y la viabilidad de un piloto acotado». Debajo, la frase de cierre y el paisaje con el sendero que une escuelas. Etiqueta: «Sin acuerdos, financiación ni presupuesto cerrado».

> Nuestro siguiente hito es una versión integrada y probada, y que una organización o un profesional educativo revise si el módulo encaja. Por eso buscamos colaboración para revisar la necesidad, el contenido y la viabilidad de un piloto pequeño. Después definiríamos recursos, costes y cómo evaluarlo. Lo que buscamos es sencillo: material revisado para usar sin conexión.

Cierre: pausa breve y «Gracias».

Si preguntan: la petición es colaboración para revisar, no dinero ni un acuerdo. Recursos, costes y criterios del piloto se definirían después, con quien colabore.

## Transiciones y animaciones

Todo es automático: no hay clics extra dentro de las diapositivas. Cada página se completa en 2–4,5 segundos, así que se puede empezar a hablar mientras aparece.

| Paso | Transición | Dentro de la página |
|---|---|---|
| Entrada a la 1 | Fundido desde negro | Aparecen título e hipótesis; los arcos exteriores del wifi se apagan |
| 1 → 2 | Empuje lateral: el camino avanza | Los tres pasos aparecen en orden, las flechas se dibujan y al final aparece el ejemplo |
| 2 → 3 | Zoom: del esquema al aula | Aparece el texto de la izquierda |
| 3 → 4 | Puertas que se abren | Aparece el marco vacío de la demo |
| 4 → 5 | Barrido de izquierda a derecha | Aparece la propuesta y, después, los tres criterios uno tras otro |
| 5 → 6 | Fundido | La tarjeta aprobada cae dentro de la mochila; después, los tres principios |
| 6 → 7 | Fundido | Aparece el «para qué», el sendero se dibuja y cada vía aparece con su dato y su estado; al final, la banda |
| 7 → 8 | Empuje lateral: el camino llega a más escuelas | El paisaje se dibuja, aparecen el hito y la petición y, al final, la frase de cierre |

Cuando se incorpore la demo, revisar la animación de la diapositiva 4.

## Ensayos

| Ensayo | Fecha y participantes | Duración real | Cambios necesarios |
|---|---|---|---|
| Lectura de las siete diapositivas de contenido, sin demo | Pendiente | Pendiente | Pendiente |
| Recorrido completo con quien opere la demo | Pendiente | Pendiente | Pendiente |

Estimación por palabras (no es un ensayo):

| Diapositiva | Palabras | ≈ segundos a 150 ppm | Ventana |
|---|---|---|---|
| 1 | 66 | 26 | 0:00–0:26 |
| 2 | 83 | 33 | 0:26–0:59 |
| 3 | 72 | 29 | 0:59–1:28 |
| 4 | — | reserva | 1:28–3:08 |
| 5 | 58 | 23 | 3:08–3:31 |
| 6 | 60 | 24 | 3:31–3:55 |
| 7 | 69 | 28 | 3:55–4:23 |
| 8 | 57 | 23 | 4:23–4:46 |

La tabla cuenta solo los cuerpos orales: 465 palabras. Las cinco transiciones añaden 33 y el «Gracias» otra. Total estimado: 499 palabras + demo de 100 s ≈ 5:00 a 150 ppm, o 5:14 a 140 ppm. No hay margen acreditado. Recortar unas 70–80 palabras y cronometrar, empezando por los bloques 2 y 3. Las animaciones no se han reproducido en Keynote en esta revisión.

## Lo que falta para cerrar la entrega

**Demo y grabación · jueves 5**
- Hacer la pasada final sobre `9d1afbd` o la versión que confirme el equipo, anotándola. Confirmar borrador guardado y túnel HTTPS disponible.
- Actividad seleccionada: `elige-lo-disponible`, Andes. Confirmar la edición del borrador con Carlos y su revisión; no heredar automáticamente la aprobación del paquete original.
- Repetir en ese entorno descarga, reapertura/actividad offline y sincronización; usar la lista de QA sin dar por ejecutadas sus casillas.
- Grabar el tramo iPhone y completar la diapositiva 4 y su narración únicamente con las acciones observadas. Revisar después las etiquetas generales de integración pendiente de la v9.

**Ensayos**
- Primera lectura cronometrada sin demo y anotar tiempos reales.
- Ensayo completo con el operador de la demo, incluidos los cambios de pantalla.
- Abrir el PPTX en Keynote, reproducirlo entero y revisar transiciones, animaciones, textos, notas, imágenes y proyector antes del jueves 5 a las 16:30. El asistente ha revisado las ocho páginas como imágenes renderizadas, sin reproducir transiciones o animaciones en Keynote.

**Decisiones pendientes**
- Estructura: el encargo original pedía siete diapositivas; esta versión tiene ocho. Confirmar con el equipo y la organización que no hay un límite.
- Mecanismo acordado para la demo: borrador sintético guardado. Álex confirma su disponibilidad en el servidor antes del ensayo; el origen manual/asistido/generado se declara sin inventarlo.
- Ejemplo de la diapositiva 2: confirmar con quien conozca el contexto que «papa y habas» es un ejemplo razonable para los Andes rurales, sin presentarlo como revisado localmente.
- Envío manual confirmado para el recorrido: `/docente` → «Enviar progreso». Ajustar la narración para nombrar esa acción.
- Ilustraciones: decidir si el equipo da por buenas las vectoriales y registrar su procedencia en `pitch/assets/README.md` junto a la de la escuela.
- UPSA Emprende 2026-27: confirmar plazo de inscripción y si MOCHILA encaja (pueden participar estudiantes de 2º a 4º, máster y doctorado). En la misma noticia aparece la Iniciativa Campus Emprendedor 2026, con plazo hasta el 11 de noviembre.
- Patrocinio: decidir si se busca una ONG y una empresa para proponer un piloto. ENISA solo tiene sentido con una sociedad constituida.
- Petición de la diapositiva 8: decidir a quién se dirige después del pitch (organización, profesional educativo) y quién del equipo hace ese contacto.
- Conversación real antes del viernes 6: sigue pendiente. Si llega a hacerse, decidir si se menciona y cómo, sin presentarla como validación.
- Modelo de sostenibilidad por concretar con Sergio. La licencia (P-08) queda fuera del pitch.

## Fuentes y límites

Base: encargo `prompt-presentacion.md`, encargos posteriores de Mario (4 nov), guion v2, `pitch/estado-demo-2026-11-04.md`, `research/competencia.md` y `research/mercado-y-financiacion-2026-11-04.md`. No se ha reproducido ninguna prueba técnica desde el trabajo de pitch. La ilustración del aula procede de generación con IA ([procedencia y prompt](../assets/README.md)).

Fuentes externas consultadas el 4 nov 2026: [Startups y pymes · ENISA](https://www.enisa.es/servicios/financiacion/startups-y-pymes/); [Club Universitario de Innovación 2026-2027 · UPSA](https://www.upsa.es/actualidad/arranca-una-nueva-edicion-del-club-universitario-de-innovacion-2026-2027-en-la-upsa); [programa UPSA Emprende 2025-26](https://adminpro.upsa.es/uploads/Programa_UPSA_Emprende_25_26_TCUE_199d99feec.pdf); [nota de prensa de ProFuturo, 2016](https://www.fundaciontelefonica.com/wp-content/uploads/descargas/1468578288-070716%20NdP_%20Profuturo.pdf).