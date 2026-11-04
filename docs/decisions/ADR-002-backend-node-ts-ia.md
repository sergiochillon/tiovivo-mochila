# ADR-002 · Backend Node + TypeScript y estrategia de IA

- **Fecha:** 2026-11-04
- **Estado:** aprobada
- **Propone:** Alejandro
- **Aprueba:** Sergio (integrador), 2026-11-04

## Contexto
Hay que elegir lenguaje del servidor y proveedor de IA para generar paquetes. Alejandro no tiene suscripción de IA de pago. El tier gratuito de Gemini existe, pero sus límites cambian y el contenido enviado puede usarse para mejorar productos de Google.

## Decisión
- **Node + TypeScript** para `server/`, por coherencia con el frontend y para validar con el mismo esquema JSON (`ajv`).
- **Generación asistida desde el inicio:** se ejecuta la plantilla en un chat de IA, se pega el JSON y el servidor lo valida contra el esquema.
- **Gemini API gratuita:** opcional, solo si el equipo lo confirma. Se envían únicamente datos no personales.
- **Claves** solo en el `.env` del servidor (en `.gitignore`); nunca en el cliente, el repo ni chats de IA.
- **Caché obligatoria:** la demo usa paquetes revisados guardados y nunca depende de una llamada en directo.
- Alejandro no implementa contra el esquema hasta que esté congelado (M1); hasta entonces puede preparar el esqueleto del servidor con el borrador, marcándolo como provisional.

## Alternativas consideradas
1. Python + FastAPI: válido, pero separa lenguaje del front y no comparte validación.
2. Depender solo de Gemini en vivo: descartado por fiabilidad y privacidad.

## Consecuencias
- Mejora: demo fiable y sin coste.
- Empeora: la generación en directo es menos vistosa que una API.
- Toca a `server/` y `contracts/sync-api.md` (Alejandro).
