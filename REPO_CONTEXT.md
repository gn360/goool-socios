# REPO_CONTEXT

## Objetivo
Este repositorio implementa el **Portal de Socios** y debe seguir exactamente la misma arquitectura utilizada en `goool-front`.

## Regla principal de arquitectura
- Replicar estructura, convenciones, tooling, scripts y patrón de módulos de `goool-front`.
- No introducir variaciones arquitectónicas propias en `goool-socios`.

## Diferencias permitidas respecto de `goool-front`
Únicamente las que hacen al contexto del producto:
- Identidad de aplicación: `goool-socios`.
- Contenidos/etiquetas orientados a Portal de Socios.
- Configuración específica del portal cuando corresponda.

## SDK
La aplicación debe consumir la misma librería compartida:
- `@goool/sdk`

Mantener el mismo patrón de uso/inicialización que en `goool-front`.

## Alcance de archivos en este repositorio
Generar y mantener únicamente archivos específicos de este repositorio (branding/configuración/contexto propios de Portal de Socios), evitando duplicar definiciones comunes que ya estén resueltas por la arquitectura base.
