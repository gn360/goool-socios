# FOLDER_STRUCTURE

```text
goool-socios/
  src/
    app/
      index.ts
    config/
      api.ts
      index.ts
    features/
    layouts/
      index.ts
    providers/
      index.ts
    routes/
      index.tsx
    shared/
      components/
        index.ts
      constants/
        index.ts
      contexts/
        index.ts
      hooks/
        index.ts
      icons/
        index.ts
      utils/
        index.ts
    styles/
      index.ts
    App.tsx
    index.css
    main.tsx
    vite-env.d.ts
  index.html
  nginx.conf
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  .dockerignore
  .env.example
  .gitignore
  README.md
  REPO_CONTEXT.md
  FOLDER_STRUCTURE.md
```

## Decisiones

- `src/app/` — punto de entrada de la aplicación (bootstrap).
- `src/config/` — configuración centralizada (API, constantes de entorno).
- `src/features/` — módulos por capacidad de negocio (cada feature es autocontenida).
- `src/layouts/` — layouts reutilizables (público, autenticado, etc.).
- `src/providers/` — providers globales (React Query, Router, tema, auth).
- `src/routes/` — definición del árbol de rutas con React Router.
- `src/shared/` — código reutilizable dentro de esta aplicación (no va al SDK).
- `src/styles/` — estilos globales y utilidades.

## Reglas

- Las features no deben importarse directamente entre sí.
- Si un componente/hook/utilidad se repite en 3 o más features, considerar moverlo a `shared/`.
- Si es reutilizable entre aplicaciones, pertenece a `@goool/sdk`.
- Usar alias `@/` para imports (evitar rutas relativas profundas).
- Las features se organizan en minúscula (ej: `members`, `payments`, `dashboard`).
