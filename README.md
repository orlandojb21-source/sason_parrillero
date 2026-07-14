# Sazón Parrillero — Panel de gestión interna

PWA para gestionar el día a día de Sazón Parrillero: inventario, ventas,
proveedores, solicitudes de compra, gastos y reportes de ingresos vs egresos.

## Stack

- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS), desplegado
  en Vercel.
- **PWA**: manifest dinámico (`src/app/manifest.ts`) + service worker propio
  (`public/sw.js`) que cachea el shell estático y muestra una página de
  respaldo sin conexión (`/offline`). Sin cola de escritura offline: las
  acciones de crear/editar siempre requieren red (ver "Decisiones" abajo).
- **Auth**: Auth.js (NextAuth v5) con Google como único proveedor. Tras el
  login se valida el email contra la hoja `Usuarios` para asignar el rol.
- **Backend**: un Google Apps Script desplegado como Web App, que actúa como
  API sobre un Google Sheet (una pestaña por entidad). Next.js nunca toca el
  Sheet directamente — todo pasa por `src/lib/appsScript.ts` (server-only).
- **Base de datos**: Google Sheets. Ver el esquema completo en `SETUP.md`.

## Primeros pasos

Este proyecto no funciona "out of the box": necesita un Google Sheet, un
Apps Script publicado y credenciales de OAuth propias. Sigue **[SETUP.md](./SETUP.md)**
paso a paso antes de correr `npm run dev`.

```bash
npm install
cp .env.local.example .env.local   # rellena las variables, ver SETUP.md
npm run dev
```

## Estructura

```
apps-script/       Código fuente de Google Apps Script (se pega manualmente
                    en el editor de Apps Script, no se despliega desde aquí)
scripts/            generate-icons.mjs: regenera los íconos de la PWA a partir
                    de img/logo.png si el logo cambia (node scripts/generate-icons.mjs)
src/app/            Rutas (App Router). (app)/ agrupa las páginas autenticadas.
src/lib/            appsScript.ts, roles.ts, session.ts, validation/, actions/
src/components/     ui/, layout/, forms/, reportes/
```

## Roles

`admin` (todo, incluida gestión de Usuarios) · `gerente` (todo excepto
Usuarios) · `cajero` (Ventas y solo lectura de Inventario). Se gestionan desde
la sección **Usuarios** dentro de la app.

## Decisiones deliberadas (para no sobre-diseñar para este tamaño de negocio)

- Un solo lock global (`LockService`) en Apps Script para todas las
  escrituras: suficiente para el volumen de un restaurante pequeño.
- Reportes se calculan al vuelo sumando `Ventas`/`Gastos` por rango de fechas;
  no hay una pestaña de agregados pre-calculados.
- Sin sincronización en tiempo real ni cola de escritura offline.

## Comandos

- `npm run dev` — desarrollo local
- `npm run build` / `npm run start` — build y arranque de producción
- `npm run lint` — ESLint
- `node scripts/generate-icons.mjs` — regenerar íconos PWA desde `img/logo.png`
