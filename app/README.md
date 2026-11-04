# MOCHILA · Frontend y PWA

**Dueño: Rodrigo.** El esqueleto usa Vite, TypeScript y vite-plugin-pwa con una interfaz vanilla. El ejemplo local reproduce el borrador técnico de la PR 5. Solo se puede jugar en /revision para pruebas del equipo. /alumno bloquea el material pendiente de revisión. El progreso se guarda en IndexedDB por avatar, paquete y actividad.

## Ejecutar y probar

Desde esta carpeta, ejecutar `npm ci`, `npm run build` y `npm run preview`. Abrir la URL local que muestra Vite y entrar en /revision. El service worker está habilitado en la compilación de producción.

1. Con red, cargar /revision y esperar a que el service worker controle la página.
2. Desactivar la red y recargar. Elegir Zorro, intentar «Solo papa» y después «Papa, habas y zanahoria».
3. Recargar sin red y elegir Zorro. Debe aparecer la actividad completada. Al elegir Colibrí debe aparecer la actividad por resolver.

La versión anterior se probó en Chrome de escritorio con red desactivada mediante DevTools. La prueba física en dos dispositivos sigue pendiente. Para móvil se necesita un origen HTTPS. La sincronización con la API de Alejandro queda para la integración.

## Prueba de bloqueo de borradores · 4 nov 2026

MacBook Air (MacBookAir10,1), macOS 26.5.1, Chrome 156.0.8078.81 en modo headless. Se compiló una copia aislada del frontend con cada JSON original de la PR 6 (commit `fbc66bf`) en lugar del ejemplo local. Se abrió `/alumno` en un perfil limpio para cada prueba.

| Paquete | Estado | Resultado observado |
|---|---|---|
| alimentacion-andes-es | draft | Aviso de revisión pendiente. Sin botones ni enunciados de actividad. |
| food-northern-uganda-en | draft | Aviso de revisión pendiente. Sin botones ni enunciados de actividad. |

Se comprobó el DOM de la página en ambos casos, con el servidor local disponible.

## Prueba manual en Safari · 4 nov 2026

Rodrigo probó el ejemplo técnico en /revision en una ventana privada de Safari en su Mac. Con el servidor de 127.0.0.1:4179 detenido, recargó la página, recuperó la actividad completada de Colibrí y completó la actividad pendiente de Zorro. Tras otra recarga, Zorro volvió directamente a la pantalla de actividad completada. La prueba se realizó en el mismo dispositivo.

Versión de la prueba Safari: frontend local en app/esqueleto sobre b92c0fb, bundle index-DBaVmX1j.js, ejemplo técnico de la PR 5 (blob f39b7ed). Safari 26.5, MacBook Air (MacBookAir10,1), macOS 26.5.1. Pendiente la prueba física en modo avión en otro dispositivo.

## Prueba positiva en /alumno · 4 nov 2026

Chrome 156.0.8078.81 headless en el mismo Mac, con servidor disponible y perfil nuevo. En una compilación temporal se sustituyó únicamente el bloque review del ejemplo técnico por approved, con revisor sintético y fecha ISO. En /alumno se eligió Zorro, apareció la pregunta del plato, se seleccionó «Papa, habas y zanahoria» y el reproductor mostró «¡Buen trabajo, Zorro!». La copia temporal se eliminó. El ejemplo original sigue en draft.
