# Fakto Web

Aplicación Vue para la gestión visual de grupos y responsables de facturas compartidas. Es un prototipo no funcional: la navegación, formularios y validaciones viven en el cliente, sin backend.

## Requisitos

- Node.js 24 o superior.
- npm 11 o superior.

## Ejecución local

Instale las dependencias de forma reproducible:

```bash
npm ci
```

La opción recomendada genera el build de producción y lo sirve localmente en `http://localhost:4173`:

```bash
npm run start
```

Para desarrollo con recarga en caliente, ejecute:

```bash
npm run dev
```

La aplicación de desarrollo estará disponible en `http://localhost:5173`.

Para verificar calidad y generar solo el artefacto estático, ejecute:

```bash
npm run check
npm run build
```

## Ejecución con Docker

Docker construye el mismo artefacto de producción que `npm run build`. La imagen final solo contiene Nginx y los archivos estáticos de `dist`; no incluye Node.js, dependencias de desarrollo ni el código fuente.

```bash
docker build --tag fakto-web:local .
docker run --rm --publish 8080:80 fakto-web:local
```

Abra `http://localhost:8080`.

También están disponibles los atajos equivalentes:

```bash
npm run docker:build
npm run docker:run
```

O inicie el único contenedor del proyecto con Docker Compose:

```bash
docker compose up --build
```

Para detenerlo, use `docker compose down`.

## Decisiones base

- Vue 3, TypeScript, Vue Router y Vite.
- Tailwind CSS v4 mediante el plugin oficial de Vite.
- Dependencias con versiones exactas por parche y rango `~`.
- Tokens visuales y estilos globales centralizados en `src/design/`.
- Fuentes e íconos locales incluidos en `public/`.

## Estructura

```text
src/
├── app/       # composición y navegación
├── design/    # tokens y estilos globales
├── features/  # flujos por dominio
└── components/ # componentes reutilizables
```

## Organización de vistas

Las seis pantallas web del alcance están implementadas mediante cuatro vistas de ruta:

- `GroupView.vue`: vistas 1 (grupo con miembros), 3 (grupo sin miembros) y 6 (miembro recién agregado).
- `DeleteMemberView.vue`: vista 2, eliminación de un miembro.
- `AssignBillsView.vue`: vista 4, asignación o retiro de facturas.
- `InviteMemberView.vue`: vista 5, invitación de un miembro.

Las vistas 3 y 6 son estados del mismo panel de grupo, no rutas independientes. `EmptyGroupState.vue` representa el estado vacío y el estado reactivo del grupo representa la incorporación del nuevo miembro.
