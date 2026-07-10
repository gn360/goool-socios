# goool-socios

Portal de Socios de goool.

Este repositorio debe mantener la misma arquitectura de `goool-front`,
reutilizando la misma integración con `@goool/sdk`.

## Docker

> ⚠️ Este repositorio es un scaffold. La infraestructura Docker está lista para usar
> una vez que se agregue el código fuente (`package.json`, `src/`, etc.).

### Desarrollo

```bash
# Requiere que goool-api esté corriendo primero (red compartida "goool")
docker compose -f docker-compose.dev.yml up

# La app estará disponible en http://localhost:5174
# Hot Module Replacement activo
```

### Producción

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Arquitectura del contenedor

```
Desarrollo:  node:22-alpine → Vite Dev Server con HMR
Producción:  Dockerfile multi-stage → Nginx (:80) sirviendo build estático
```

El contenedor de producción no expone puertos al host. Apache2 actúa como
Reverse Proxy vía la red Docker `goool_prod`.
