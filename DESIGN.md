# DESIGN.md · Sistema visual de MOCHILA

Fuente de verdad del diseño de MOCHILA. Quien cambie la interfaz (persona o IA) lo lee antes y lo actualiza si cambia una decisión. Implementación: `app/src/style.css` (tokens en `:root`), `app/src/art.ts` (ilustraciones) y `app/src/fx.ts` (sonido y confeti).

## 1. Idea: el álbum de la mochila

MOCHILA es una mochila que el niño llena de **pegatinas**. Cada actividad superada da una pegatina; cada explorador tiene su álbum. Esa idea manda en todo:

- Los personajes, los alimentos, los sellos y los exploradores se dibujan como **pegatinas troqueladas**: forma propia, borde blanco grueso y sombra desplazada, como si estuvieran pegadas.
- La interfaz es **un cuaderno de juego al aire libre**: cielo arriba, suelo del lugar abajo, y las tarjetas como papeles sobre ese paisaje.
- **Una sola cosa memorable por pantalla** (la pegatina, Mochi, el plato). Lo demás, tranquilo.

Lo que evitamos a propósito (son los rasgos del diseño genérico generado por IA): fondo crema con serif de alto contraste y acento terracota; etiquetas en MAYÚSCULAS con letra monoespaciada; datos unidos con puntos medios; todo en tarjetas idénticas con la misma sombra gris; flechas «→» decorativas.

## 2. Color

| Token | Valor | Uso |
|---|---|---|
| `--cielo` | `#DFF3FF` | Fondo general (cielo de día) |
| `--cielo-2` | `#BFE3FA` | Fondos secundarios, zonas de juego |
| `--tinta` | `#1C2B4B` | Texto principal (marino, nunca negro puro) |
| `--tinta-suave` | `#4A5878` | Texto secundario (contraste ≥ 4,5:1 sobre blanco y cielo) |
| `--papel` | `#FFFFFF` | Tarjetas y pegatinas |
| `--mochi` | `#FFC531` | Mochi, acentos, progreso |
| `--mochi-oscuro` | `#C98A00` | Bordes y sombras del amarillo |
| `--verde` | `#17A06B` | Acción principal y aciertos |
| `--verde-oscuro` | `#0E7A50` | Sombra de botones verdes |
| `--intento` | `#F28C38` | «Inténtalo otra vez» (nunca rojo de castigo) |
| `--baya` | `#B5367D` | Pegatinas, logros, pareja 2 |
| `--lago` | `#2F7FD8` | Pareja 3, enlaces |

Escenarios (sección 6) añaden su propio par de colores de suelo y cielo.

## 3. Tipografía

- **Baloo 2** (700/800), títulos y botones: redonda, gruesa, amable; se lee como juego sin ser cursi.
- **Atkinson Hyperlegible** (400/700), texto: diseñada para máxima legibilidad (letras que no se confunden: I/l/1, b/d), pensada para lectores que empiezan.
- Ambas con licencia OFL y **servidas desde la app** (`@fontsource`) y precacheadas: funcionan sin conexión.
- Escala (base 18 px en tablet): título de pantalla 2,1–2,8 rem · enunciado de actividad 1,6–2,2 rem · botón 1,15 rem · texto 1,05 rem · nota 0,9 rem.
- Nada en mayúsculas sostenidas; minúsculas y frases cortas.

## 4. Componentes

- **Botón principal**: verde, Baloo 1,15 rem, alto ≥ 56 px, radio 18 px, sombra sólida inferior de 5 px (`--verde-oscuro`) que «se hunde» al pulsar (translateY 3 px).
- **Botón secundario**: blanco con borde `--cielo-2`, misma forma.
- **Tarjeta de juego**: blanco, radio 24 px, borde 3 px del color de su función y sombra sólida desplazada (no difusa gris).
- **Pegatina**: borde blanco 5–6 px alrededor de la forma, sombra `0 6px 0 rgba(28,43,75,.18)`, rotación leve (−3° a 3°).
- **Opciones de respuesta**: tarjetas grandes con la letra en una ficha de color (A verde, B baya, C lago, D amarillo); alto ≥ 76 px.
- **Mochi**: siempre a la izquierda del bocadillo; el bocadillo es el canal de instrucciones, pistas y elogios.
- **Progreso**: fila de huecos de pegatina; los conseguidos se rellenan con la pegatina de color.

## 5. Estados de interacción

| Estado | Señal visual | Sonido | Mochi |
|---|---|---|---|
| Pulsado | se hunde 3 px | toque suave | — |
| Acierto | verde + pegatina ✓ | campana de dos notas | salta, cara de alegría |
| Error | naranja + vaivén | «hmm» grave y suave | inclina la cabeza, da pista |
| Logro | pegatina que cae y rebota + confeti | fanfarria corta | brazos arriba |
| Foco teclado | anillo amarillo 4 px | — | — |
| Desactivado | 45 % de opacidad | — | — |

## 6. Escenarios por contexto

Cada contexto tiene un escenario: ilustración de fondo (SVG propio), color de suelo y de cielo, registrados en `app/src/scenes.ts`. Hoy: **Andes** (Perú y Bolivia: montañas nevadas, sol, terrazas y río), **sabana del norte de Uganda** (acacias, tierra rojiza) y un **paisaje neutro** para «Mis mochilas», la parte docente y cualquier contexto sin escenario propio. Un contexto nuevo se añade registrando su entrada antes del neutro.
En las pantallas de un paquete se ve siempre la nota «Paisaje ilustrativo; no representa una comunidad concreta ni está validado por ella» (arriba del escenario en móvil, abajo en tableta).
Las ilustraciones son **ilustrativas**: no representan una comunidad concreta ni están validadas por ella. Si en el futuro se generan con IA, se preparan antes, se revisan y se guardan como archivos estáticos (nunca se generan en el dispositivo del niño).

## 7. Movimiento

- Solo movimiento que responde a una acción del niño (acertar, fallar, conseguir) y un único momento orquestado al ganar la pegatina.
- Duraciones: 120–200 ms en botones; 350–550 ms en pegatina y Mochi.
- `prefers-reduced-motion`: sin vaivén, sin confeti, sin saltos.

## 8. Tablet y responsive

- Objetivo principal: **tablet en horizontal** (1024×768 a 1280×800). A partir de 900 px en horizontal: escenario a la izquierda (con el título de la misión) y juego a la derecha.
- Vertical y móvil: escenario como franja superior baja y juego debajo.
- Zonas táctiles ≥ 56 px; separación ≥ 12 px entre opciones.
- Una columna de lectura ≤ 70 caracteres.

## 9. Docente

Mismo sistema, más sobrio: fondo `--cielo` muy claro, sin Mochi salvo en estados vacíos, tarjetas por ámbito con el color de su tema. Los siete ámbitos (alimentación, higiene, pedir ayuda, emociones, convivencia, seguridad, autonomía) tienen icono y color propios y están siempre visibles. La IA aparece etiquetada como «propuesta», nunca como contenido final.
