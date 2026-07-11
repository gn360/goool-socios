# REPO_CONTEXT

## Qué es este repositorio

`goool-socios` es el portal de miembros de la plataforma Goool. Es una SPA React que consume exclusivamente la REST API de `goool-api`.

## Alcance

Este repositorio contiene:

- Dashboard personal del socio
- Gestión de grupos familiares
- Administración de membresías y suscripciones
- Historial de pagos
- Carné de socio virtual

## Fuera de alcance

- Sitio web público (→ goool-front)
- Administración de clubes (→ goool-clubes)
- Administración de plataforma (→ goool-admin)
- Lógica de negocio (→ goool-api)
- Componentes reutilizables entre apps (→ goool-sdk)

## API

Todas las llamadas a la API usan el prefijo:

```
/api/socios/v1/
```

## Convenciones arquitectónicas

1. SPA pura — sin SSR, sin Server Components, sin BFF.
2. Comunicación exclusiva con `goool-api` vía REST JSON.
3. Sin acceso directo a base de datos.
4. Sin lógica de negocio; solo presentación y orquestación de llamadas.
5. Consumir `@goool/sdk` para componentes, tipos y utilidades compartidas.
6. Seguir la estructura de carpetas definida en `FOLDER_STRUCTURE.md`.
