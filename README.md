# goool-socios

Portal de socios de Goool.

## Alcance

- Dashboard personal del socio
- Gestión de grupos familiares
- Suscripciones y membresías
- Historial de pagos
- Carné de socio virtual

## Stack

- React 19
- TypeScript 5.8
- Vite 6
- TailwindCSS 4
- React Router 7
- TanStack Query 5

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run typecheck` | Validación de tipos |

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar:

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API (goool-api) |

## Docker

```bash
# Desarrollo
docker compose -f docker-compose.dev.yml up

# Producción
docker build -t goool-socios:latest .
docker run -p 80:80 goool-socios:latest
```

## SDK

Este proyecto consume `@goool/sdk`. En desarrollo local se usa el protocolo `file:../goool-sdk`.

Para builds Docker de producción, el SDK debe estar empaquetado como tarball o publicado en un registro privado.
