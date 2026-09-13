# Fakto Web

Aplicación Vue para la gestión visual de grupos y responsables de facturas compartidas. Es un prototipo no funcional: la navegación, formularios y validaciones viven en el cliente, sin backend.

## Requisitos

- Node.js 24 o superior.
- npm 11 o superior.

## Comandos

```bash
npm install
npm run dev
npm run check
```

## Decisiones base

- Vue 3, TypeScript, Vue Router y Vite.
- Tailwind CSS v4 mediante el plugin oficial de Vite.
- Dependencias con versiones exactas por parche y rango `~`.
- Tokens locales en `src/design/tokens.css`; la paleta procede exclusivamente de `../mockups/Paleta de colores.pdf` como referencia, sin ser una dependencia de ejecución.
- La sección de colores de `../support/Design System.pdf` no se utiliza. Sus patrones de componentes, junto con las rejillas y tipografía de `support/`, sí orientan la implementación.

## Estructura

```text
src/
├── app/       # composición y navegación
├── design/    # tokens y estilos globales
├── features/  # flujos por dominio
└── mocks/     # datos locales (siguiente fase)
```
