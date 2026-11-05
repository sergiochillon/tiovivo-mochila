# Progreso sintético para la demo

El archivo [`demo-progreso-sintetico.json`](demo-progreso-sintetico.json) contiene dos eventos ficticios del paquete Andes aprobado: una historia completada y una elección respondida correctamente. Solo usa el código `DEMO-01` y los avatares locales `zorro` y `colibri`; no contiene datos personales.

Con el servidor local iniciado y los paquetes aprobados cargados, se puede enviar el lote desde la raíz del repositorio:

```sh
curl -X POST http://127.0.0.1:3001/api/sync \
  -H 'Content-Type: application/json' \
  --data-binary @qa/demo-progreso-sintetico.json
```

En una base local vacía, la primera respuesta esperada es `accepted: 2` y `alreadyPresent: 0`. Al reenviar exactamente el mismo archivo, se espera `accepted: 0` y `alreadyPresent: 2`; los contadores no deben aumentar otra vez. En `/docente`, los dos eventos contribuyen a `eventsReceived` y `activitiesCompleted`.

Es una preparación de datos; **no se ha enviado el lote ni se ha probado aquí la respuesta del servidor**. Úsalo solo contra el servidor local de demo. Si se reutiliza un almacén existente, registra primero los contadores de `DEMO-01` y compara el incremento; no presentes estos eventos sintéticos como resultados de una prueba con niños.
