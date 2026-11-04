# MOCHILA

**Material Offline de Contexto Local para la Infancia y su Aprendizaje**

Equipo **TIOVIVO.exe** · Hack4Edu 2026 (VII edición, ProFuturo + UPSA) · Reto 02 «Aprender sin conexión» (Reto ProFuturo)

> **Estado real (actualizar en cada hito):** fase de organización. **No hay código ni funcionalidad terminada.** Todo lo que aparece abajo como «funcionamiento» o «características» es el **diseño objetivo del MVP**, no algo ya construido. Cada documento distingue entre **Decidido**, **Hipótesis** y **Pendiente**.

---

## Problema

Los niños de 6 a 10 años en comunidades con poca conectividad y pocos recursos reciben poca o ninguna educación estructurada en **habilidades para la vida**: alimentación con lo que hay en su entorno, cuándo y cómo pedir ayuda a un adulto, reconocer y gestionar emociones, higiene y convivencia. Las soluciones digitales existentes suelen asumir Internet estable, un idioma y una cultura únicos, o un chat de IA abierto que no es seguro para menores.

*Matiz importante (decidido en la auditoría):* los datos internacionales no permiten afirmar que la brecha socioemocional sea mayor que la cognitiva en 6–10 años. Lo que sí está medido es la brecha de aprendizaje fundacional. **No lo afirmamos en el pitch.** Nuestro argumento es otro: hay una carencia de material de habilidades para la vida **adaptado al contexto local** y **utilizable sin conexión**, y la IA puede abaratar esa adaptación **si hay un docente que revisa**.

## Solución

MOCHILA separa dos momentos:

1. **Preparar (con conexión, el docente u ONG).** El docente describe su contexto (país, idioma, alimentos disponibles, recursos). La IA propone actividades adaptadas. **El docente revisa, edita y aprueba** (sello de revisión humana). Se exporta un **paquete de contexto** (JSON).
2. **Usar (sin conexión, el niño).** Una app web instalable (PWA) funciona sin red con el paquete aprobado: historias, juegos y escenarios con audio. El progreso se guarda en el dispositivo con **avatares, sin datos personales**, y se **sincroniza** cuando hay red.

**No hay chat abierto para niños.** La IA genera contenido para el docente; el niño solo interactúa con contenido ya revisado.

## Público objetivo

- **Usuario que decide y configura:** docentes y educadores de ONG en contextos con conectividad limitada.
- **Beneficiarios:** niños de 6–10 años.
- **Posible pagador (hipótesis a validar):** ONG, fundaciones, programas educativos (p. ej. ecosistema ProFuturo), administraciones educativas.

## Funcionamiento general

```
 CON CONEXIÓN (docente)                       SIN CONEXIÓN (aula)
 ┌──────────────────────┐   paquete JSON      ┌──────────────────────────┐
 │ Formulario de contexto│  ───────────────▶   │ PWA: service worker +    │
 │ → IA genera borrador  │   (revisado y        │ IndexedDB; actividades   │
 │ → revisión humana     │    aprobado)         │ con audio; avatar        │
 │ → "sello" y export    │                      └───────────┬──────────────┘
 └──────────────────────┘                                   │ cola de progreso
            ▲                                                ▼ (cuando hay red)
            └─────────────────── panel docente ◀─── sincronización manual
```

## Características (objetivo del MVP; ver prioridades en `docs/PRODUCT_BRIEF.md`)

| Prioridad | Característica | Estado |
|---|---|---|
| Imprescindible | Esquema de paquete + 1 módulo (alimentación local) en 2 contextos (Andes/ES, norte de Uganda/EN) | Pendiente |
| Imprescindible | Flujo de autoría: contexto → IA → revisión humana → exportar | Pendiente |
| Imprescindible | Reproductor PWA que funciona en modo avión | Pendiente |
| Imprescindible | Progreso local con avatares + sincronización manual a panel docente | Pendiente |
| Importante | Módulos «pedir ayuda a un adulto» y «emociones» | Pendiente |
| Prescindible | IA local en el navegador, voz neuronal offline, exportación a Kolibri | Pendiente |

## Ejecución

> Pendiente: aún no existe código. Cuando haya algo ejecutable, el responsable de cada área añadirá aquí el comando exacto (`app/README.md`, `server/README.md`). Hasta entonces no se documentan comandos que nadie haya probado.

## Licencia

> **Pendiente de decidir** (ver `docs/PROJECT_CONTEXT.md`). Las bases exigen liberar el trabajo con licencia libre: código con cualquier licencia de opensource.org; documentación y assets, recomendada CC BY-NC-SA 3.0. No subir nada con licencia incompatible ni con datos personales.

## Mapa del repositorio

| Ruta | Qué contiene | Responsable |
|---|---|---|
| `docs/` | Documentación y decisiones (`docs/decisions/`) | Ver `TEAM_ROLES.md` |
| `contracts/` | Interfaces entre áreas (esquema del paquete, API de sincronización) | Sergio (esquema) · Alejandro (API) |
| `app/` | PWA: reproductor del niño + interfaz de autoría | Rodrigo |
| `server/` | Generación con IA, validación, sincronización | Alejandro |
| `content/` | Paquetes de contenido revisados y reglas pedagógicas | Carlos |
| `qa/` | Plan de pruebas y registro de pruebas offline | Carlos |
| `pitch/` | Guion, diapositivas, vídeo, guion de demo | Mario |
| `research/` | Notas de validación, competencia, fuentes | Mario |
| `scripts/` | Utilidades (diagnóstico de Macs) | Sergio |

Lectura recomendada para cualquier integrante nuevo (o IA): `docs/PROJECT_CONTEXT.md` → `docs/TEAM_ROLES.md` → `docs/GIT_WORKFLOW.md` → tu carpeta.
