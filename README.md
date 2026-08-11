# New Leben React

Real estate landing page for **New Leben** — a premium property development brand.  
Built with React 19, Vite 6, Redux Toolkit, Bootstrap 5, GSAP, and Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **State** | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) |
| **Routing** | React Router DOM 7 |
| **Styling** | SCSS + Bootstrap 5.3 (custom variable overrides) |
| **Animation** | GSAP + ScrollTrigger, Motion (formerly Framer Motion) |
| **Lightbox** | Fancybox (`@fancyapps/ui`) |
| **Icons** | Lucide React, Font Awesome 7 |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build (lint + vite build)
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── App.jsx                     # Routes, layout shell, lazy pages
├── main.jsx                    # Entry point (React + Redux + Router)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Fixed nav with hamburger dropdown
│   │   └── Footer.jsx          # Footer with social links + badges
│   ├── sections/               # Home page sections
│   │   ├── Hero.jsx
│   │   ├── Diferenciadores.jsx  # Search + value props
│   │   ├── Testimonials.jsx
│   │   ├── CTASection.jsx
│   │   └── VideosSection.jsx
│   ├── proyecto/               # Project detail page components
│   │   ├── ProjectHero.jsx
│   │   ├── ProjectOverview.jsx
│   │   ├── ProjectTabs.jsx
│   │   ├── SpacesGallery.jsx   # Gallery + interactive amenities
│   │   ├── AgentCard.jsx       # Agent with WhatsApp link
│   │   ├── TeamAgents.jsx
│   │   ├── Cotizador.jsx
│   │   └── ...
│   ├── ChatWidget.jsx          # Floating chat bubble
│   ├── Loader.jsx              # Full-screen initial loader
│   ├── PageLoader.jsx          # Suspense fallback spinner
│   ├── ProjectCard.jsx         # Reusable project listing card
│   └── icons/                  # Animated Lucide icons
│
├── pages/
│   ├── Proyectos.jsx           # Project listing page
│   └── ProyectoDetalle.jsx     # Project detail page
│
├── store/
│   ├── store.js
│   └── slices/
│       ├── uiSlice.js          # isLoaded, activeFilter
│       └── projectSlice.js    # slug, project, notFound
│
├── hooks/
│   └── useGsapAnimations.js    # GSAP + ScrollTrigger hook
│
├── data/
│   ├── content.js              # Site content / images
│   └── projects.js             # Project data
│
└── styles/
    ├── main.scss               # Entry: imports Bootstrap + all components
    ├── global.scss             # Resets, fluid root font-size
    ├── variables.scss          # Design tokens (colors, breakpoints, etc.)
    ├── components/             # Component-specific SCSS partials
    └── vendor/
        └── _fancybox.scss
```

---

## Design System

### Colors (`src/styles/variables.scss`)

| Token | Value | Usage |
|---|---|---|
| `$lb-cream` | `#f5f2ed` | Page background |
| `$lb-dark` | `#1a1a1a` | Headings, dark sections |
| `$lb-red` | `#d44040` | Primary CTA, brand accent |
| `$lb-green` | `#1b5e4a` | Secondary, success, agent badges |
| `$lb-green-dark` | `#38473c` | CTA buttons |
| `$lb-footer` | `#1f1f1f` | Footer background |

### Typography

- **Primary font:** Lexend Deca (headings)
- **Secondary font:** Manrope (body text)
- **Fluid root:** `html { font-size: clamp(87.5%, 82% + 0.25vw, 100%) }`

### Breakpoints

Uses Bootstrap 5.3 default breakpoints via `@include bs.media-breakpoint-down(md)` mixin.
No custom breakpoint variables.

---

## Key Features

- **Lazy-loaded pages** with `Suspense` + `PageLoader` spinner fallback
- **Responsive navbar** with hamburger menu showing all links on mobile
- **Interactive SpacesGallery** — amenity icon buttons focus individual gallery slides
- **WhatsApp integration** on agent cards (`wa.me` links)
- **GSAP animations** — parallax, scroll reveals, hero motion
- **Animated Lucide icons** — motion-controlled hover states
- **Fancybox lightbox** for galleries and location images
- **Fluid typography** via `clamp()` and rem-based sizing throughout
- **Cotizador general** (`/cotizador`) — asistente guiado (wizard) + selección directa de proyectos
- **Pre-selección de planta** — botón "Cotizar" en RelatedProjects navega a `/cotizador` con planta pre-seleccionada vía `location.state`
- **Skeleton loaders** — `ProjectCardSkeleton` con shimmer mientras cargan proyectos o plantas desde la API
- **Scroll suave** — auto-scroll a sección cotizador al llegar desde RelatedProjects o al cambiar modo wizard/directo
- **API-driven plantas** — Cotizador y RelatedProjects consumen `/api/v1/plantas?proyecto_id={id}` con filtros (tipología, producto, piso, planta)

---

## Build Commands

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Vite production build |
| `npm run build:all` | ESLint + Vite build (recommended) |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build locally |

---

## API Integration (iLeben)

La página de Proyectos consume la API de iLeben (`dev.ileben.cl`). La API requiere:

1. **Bearer token** (Sanctum) en header `Authorization`
2. **Origin/Referer válido** — el middleware `token.origin` compara contra `authorized_url` del token

### Configuración

| Ambiente | API | authorized_url | Cómo funciona |
|---|---|---|---|
| **Dev (Vite)** | `dev.ileben.cl` | `test.ileben.cl` | Vite proxy en `vite.config.js` intercepta `/api/*` e inyecta headers |
| **Producción (cPanel)** | `dev.ileben.cl` | `test.ileben.cl` | `.htaccess` rutea `/api/*` → `api-proxy.php` (cURL) |

### Archivos clave

- **`vite.config.js`** — proxy dev con headers `Authorization`, `Origin`, `Referer`
- **`public/api-proxy.php`** — proxy PHP para producción (cURL a `dev.ileben.cl`), no requiere `mod_proxy`
- **`public/.htaccess`** — `RewriteRule ^api/(.*)$ api-proxy.php [L]` + SPA fallback
- **`src/pages/Proyectos.jsx`** — `fetch('/api/v1/proyectos')` (sin trailing slash, Laravel responde 301 con `/`)

### Notas

- El token debe crearse en el panel admin de Leben-site (`admin.ileben.cl` → API Tokens) con `authorized_url` correcta
- El endpoint es `/api/v1/proyectos` **sin slash final** — Laravel redirige 301 si lleva `/`
- `api-proxy.php` habilita `CURLOPT_FOLLOWLOCATION` como red de seguridad ante redirecciones
- Respuesta API: estructura paginada de Laravel (`{ data: [...], current_page, ... }`)
- Fuente: [`API_USAGE.md`](https://github.com/scooller/Leben-site/blob/main/API_USAGE.md) en Leben-site

---

## Referencia de la API (iLeben)

Base URL versionada: `/api/v1`. Descubrimiento: `GET /api/v1` (OpenAPI JSON con paths, tags, esquema de seguridad).

### Seguridad y autenticación

| Capa | Detalle |
|---|---|
| **Bearer token** | Sanctum. Header `Authorization: Bearer {token}` |
| **token.origin** | Middleware que valida `Origin` / `Referer` / `X-Authorized-Url` contra `authorized_url` del token |
| **Login** | `POST /api/v1/login` con `{ email, password }` → retorna `{ user, token }` |

**Errores comunes de auth:**
- `401` Token de acceso requerido
- `401` Token de acceso inválido o expirado
- `403` La URL de origen no está autorizada para este token

### Rate limiting

| Endpoint | Límite |
|---|---|
| `POST /login` | 5/min |
| `POST /register` | 5/min |
| `POST /contact-submissions` | 10/min |

### Endpoints públicos (sin auth)

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/v1` | Descubrimiento OpenAPI |
| `GET` | `/api/v1/site-config` | Configuración del sitio (`SiteSetting::forFrontend`) |
| `POST` | `/api/v1/contact-submissions` | Formulario de contacto |
| `GET` | `/api/v1/payments/public-status/{id}?token={uuid}` | Estado público de pago |

**Contacto** — body recomendado:
```json
{
  "channel": "sale",
  "fields": {
    "name": "Juan Pérez", "email": "juan@example.com",
    "message": "Quiero más información", "phone": "+56911111111",
    "proyecto": "torre-central", "comuna": "Santiago",
    "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "invierno"
  },
  "turnstile_token": "token-si-configurado"
}
```

### Endpoints de catálogo (token.origin, sin auth:sanctum)

Requieren Bearer token válido + origen autorizado, pero no sesión de usuario.

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/v1/proyectos` | Listado de proyectos (paginado) |
| `GET` | `/api/v1/proyectos/{id}` | Detalle de proyecto |
| `GET` | `/api/v1/plantas` | Listado de plantas (paginado) |
| `GET` | `/api/v1/plantas/{id}` | Detalle de planta |
| `GET` | `/api/v1/plantas/filtros-ubicacion` | Regiones y comunas disponibles |
| `GET` | `/api/v1/plantas/proyecto/{slug}/unidad/{name}` | Planta por slug + nombre unidad |

**Filtros de proyectos:** `region`, `comuna`, `etapa`, `q`, `entrega_inmediata`, `tipo`, `perPage`, `fields`/`campos`, `include_plantas`, `include_asesores`

**Filtros de plantas:** `proyecto_id`/`project_id`, `salesforce_proyecto_id`, `project_slug`/`slug`, `comuna_slug`, `catalog_slug`, `comuna`, `provincia`, `region`, `programa`, `programa2`, `piso`, `orientacion`, `tipo_producto`, `entrega`, `disponible`/`available`, `is_active`, `evento_sale`, `min_precio`, `max_precio`, `perPage`, `page`

**Campos útiles en plantas:** `is_available`, `is_paid`, `precio_final`, `cover_image_url`, `interior_image_url`, `asesores`, `proyecto` (objeto anidado con `id`, `name`, `slug`, `comuna`, etc.)

**Ejemplo:**
```bash
curl "https://dev.ileben.cl/api/v1/plantas?proyecto_id=9&disponible=1" \
  -H "Authorization: Bearer TOKEN" \
  -H "Origin: https://test.ileben.cl"
```

### Endpoints protegidos (auth:sanctum + token.origin)

Requieren usuario autenticado + Bearer token + origen autorizado.

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/v1/me` | Usuario autenticado |
| `POST` | `/api/v1/logout` | Cerrar sesión |
| `GET` | `/api/v1/payment-gateways?plant_id={id}` | Pasarelas disponibles para planta |
| `POST` | `/api/v1/checkout` | Iniciar checkout |
| `GET` | `/api/v1/reservations/planta/{plantId}` | Estado de reserva de planta |
| `POST` | `/api/v1/reservations` | Crear reserva (`{ plant_id }`) |
| `DELETE` | `/api/v1/reservations/{sessionToken}` | Liberar reserva |
| `POST` | `/api/v1/payments` | Crear pago |
| `GET` | `/api/v1/payments` | Listar pagos |
| `GET` | `/api/v1/payments/{id}` | Detalle de pago |
| `POST` | `/api/v1/payments/{id}/manual-proof` | Subir comprobante manual (multipart, max 5MB) |

**Checkout** — body requerido:
```json
{
  "plant_id": 10, "quantity": 1, "gateway": "transbank",
  "name": "Juan Pérez", "email": "juan@example.com",
  "phone": "+56911111111", "rut": "12345678-5"
}
```
`gateway`: `transbank`, `mercadopago`, `manual`. Para `manual`, `session_token` es obligatorio.

**Reserva** — respuesta 201:
```json
{
  "reservation": {
    "id": 90, "session_token": "abc123...", "plant_id": 10,
    "status": "active", "expires_at": "2026-06-02T19:10:00Z",
    "remaining_seconds": 900
  }
}
```

### Webhooks y retornos de pasarelas (fuera de `/api/v1`)

Definidos en `routes/web.php`:

| Pasarela | Rutas |
|---|---|
| **Transbank** | `GET /payments/transbank/redirect`, `GET\|POST /payments/transbank/return` |
| **Mercado Pago** | `POST /payments/mercadopago/webhook`, `GET /payments/mercadopago/return` |
| **Resultado** | `GET /payments/success/{payment?}`, `GET /payments/failed/{payment?}`, `GET /payments/pending/{payment?}` |

---

## Errores conocidos / comunes

### GSAP ScrollTrigger mide alturas incorrectas en ProyectoDetalle

**Síntoma:** Las animaciones de scroll se disparan en posiciones equivocadas (antes o después de lo esperado), especialmente al llegar a Cotizador o secciones tardías.

**Causa:** `ProyectoDetalle` tiene muchas imágenes con `loading="lazy"`, que no disparan `load` hasta que el usuario hace scroll. El hook `useGsapAnimations` esperaba a que **TODAS** las imágenes cargaran antes de hacer `ScrollTrigger.refresh()`. Como las lazy nunca terminan, el refresh quedaba bloqueado.

**Fix:** El hook ahora hace `refresh()` inmediatamente (con debounce de 100ms) y re-refrescea por cada imagen que carga individualmente, sin bloquearse esperando el conjunto completo. `useGsapAnimations([project])` sigue pasando `project` como dependencia para re-ejecutar cuando cambia el contenido.

### `navigate()` llamado durante render

**Síntoma:** Warning: `Cannot update a component (BrowserRouter) while rendering a different component`.

**Causa:** Llamar `navigate('/ruta')` directamente en el cuerpo del componente (ej: `if (user) { navigate('/perfil'); return null }`).

**Fix:** Mover a `useEffect`:
```jsx
useEffect(() => { if (user) navigate('/perfil') }, [user, navigate])
if (user) return null
```

### SplitTitle con `overflow: hidden` desalinea el baseline

**Síntoma:** El texto animado con `SplitTitle` se ve ~6px más bajo que texto normal adyacente.

**Causa:** Los `<span class="lb-split-word">` usan `style="display: inline-block; overflow: hidden"`. El `overflow: hidden` cambia el baseline del inline-block al borde inferior del box en lugar del baseline del texto.

**Fix:** Remover `overflow: hidden` del inline style en `SplitTitle.jsx`. No es necesario — GSAP anima el span completo, no hay nada que recortar.

---

## Changelog

All notable changes to this project are documented below.
Dates in `YYYY-MM-DD` format.

---

### 2026-08-11 — Cotizador General, Pre-selección de Plantas & UX

**Added**
- Página `CotizadorGeneral.jsx` (`/cotizador`) — hero + toggle asistente guiado/selección directa + grilla de proyectos
- `RelatedProjects` con botón "Cotizar" por fila — `navigate('/cotizador', { state: { planta, proyecto_id } })`
- Pre-selección automática: `useEffect` detecta `navProyectoId` desde `location.state`, busca match en `apiProjects`, setea `selectedProject` + `mode='directo'`
- `initialFilters` — useMemo que mapea `navPlanta` (programa, tipo_producto, piso, name) a filtros del Cotizador
- Skeleton loading fallback (`ProjectCardSkeleton` × 6) mientras espera match de proyecto al llegar desde RelatedProjects
- Spinner de carga en Cotizador mientras fetch de plantas (`/api/v1/plantas`) responde
- `useApiProjects()` hook reutilizable — fetch `/api/v1/proyectos` con manejo de errores
- `buildCotizadorData(p)` — template INN para estructurar datos del cotizador desde proyecto API

**Fixed**
- Bug: wizard aparecía en vez del cotizador al llegar desde RelatedProjects — guard `!navProyectoId` en render conditions de wizard + directo
- Bug: `navPlanta.proyecto_id` era `undefined` — la API de plantas no tiene campo plano `proyecto_id`, el ID vive en `proyecto.id` (objeto anidado). Fix: `location.state?.proyecto_id || navPlanta?.proyecto?.id` + `RelatedProjects` pasa `proyecto_id: data.apiId` explícitamente
- Bug: auto-select no re-disparaba al hacer click en "Cotizar" estando ya en `/cotizador` — `autoSelected` cambiado de `useRef(false)` a `useRef(null)` que guarda `navPlanta.id`, permitiendo re-trigger por planta distinta
- Bug: type mismatch number vs string en comparación de IDs — `String(p.id) === String(navProyectoId)`
- Dropdowns de filtros aparecían detrás de imagen con zoom — `z-index: 10` en `.lb-proj-det-cot-filters-col` (col-lg-8), `z-index: 1050` en `.lb-proj-det-filter-menu`
- Zoom de imagen de planta desbordaba el card — `overflow: hidden` + `border-radius` en `.lb-proj-det-cot-plan-card .lb-img-trigger`
- Layout de filtros roto — col-lg-8 usado como flex container; separado wrapper interno `.lb-proj-det-cot-filters` para flex
- Scroll no funcionaba al cambiar modo o llegar desde RelatedProjects — `sectionRef` + `scrollIntoView({ behavior: 'smooth' })` con `requestAnimationFrame`

**Changed**
- `RelatedProjects.jsx` — Link → `useNavigate`, texto "Ver proyecto" → "Cotizar", icono arrow-right
- Render conditions `CotizadorGeneral`: `{mode === 'wizard' && !selectedProject && !navProyectoId}` (3 guards: wizard, directo, loading fallback)
- SCSS `_proyecto-detalle.scss` — estilos completos de filtros, plan card, cot styles, loading state

**Build:** ✓ `build:all` — 2092 modules, ~6s

---

### 2026-08-04 — Code Cleanup & Debt Reduction

**Removed**
- `src/lib/utils.js` (`cn()` identity fn) — inlined `className` in 27 icon files
- Dead Redux state: `mobileMenuOpen`, `activeVistaTab` + their reducers
- Dead `markers` prop from `ScrollAnim` (never used in production)
- Dead `end` prop from `ScrollAnim` (never passed by callers)
- Dead class props (`className`, `classBody`, `classImg`, `classText`) from `AgentCard`
- Duplicate `gsap.registerPlugin(ScrollTrigger)` calls — centralized to `main.jsx`
- Footer `hoverOn`/`hoverOff` closure factories + 5 refs — CSS `:has()` handles hover
- `ProjectTabs` JS scroll listener — CSS `position: sticky` handles shadow
- `.lb-proj-det-tabs-stuck` class — merged into base `.lb-proj-det-tabs-bar`
- Dead SCSS: `$font-weights` map, `$lb-bp-*` vars, `.section` utility, duplicate rules

**Changed**
- `useGsapAnimations`: 4 refresh strategies → 1 (image load + timeout), fixed timeout leak
- `Navbar`: 3× duplicated link ternary → `Navlink` helper component
- `SplitTitle`: `.reduce()` nbsp interleaving → CSS `margin-right`
- All `@media (max-width: 768px)` → `@include bs.media-breakpoint-down(md)` across 10 SCSS files
- `ScrollAnim`: `once` default `false` → `true` (matching original intent)
- `useGsapAnimations`: single strategy (image load + timeout), fixed timeout leak

**Fixed**
- React key warnings: moved `key` to outer `.col` in `Testimonials` and `Proyectos`

**Net: -204 lines across SCSS + JS**

---

### 2026-08-04 — Mobile Optimization Pass

**Added**
- `PageLoader` component — spinner shown during `Suspense` page transitions (replaces blank `null` fallback)
- Main navigation links (Cotizar / Brokers / Clientes) now visible inside hamburger dropdown on mobile
- Divider between main links and section links in mobile dropdown
- Mobile breakpoints (`@media max-width: 768px`) across all component SCSS files

**Changed — Mobile Responsive**
- **Navbar:** Dropdown goes full-width on mobile, all links accessible
- **Hero:** Title/padding/border-radius use fluid `clamp()` — no more fixed `65px` font or `680px` min-height on small screens
- **Diferenciadores:** Search card switches from `position: absolute` to `static` on mobile; fixed-width containers (`900px`, `949px`, `626px`) become `100%`; background image dims to `opacity: 0.4` to improve text readability
- **CTA:** Fixed `700px` height → `min-height` with mobile padding; horizontal gradient → vertical on mobile
- **Videos:** Row stacks vertically (`flex-direction: column`) on mobile; all fixed widths → `100%`
- **Testimonials:** Fluid padding and border-radius via `clamp()`
- **Footer:** Fixed column `width: 230px` → `100%` on mobile
- **ChatWidget:** All dimensions converted to rem

**Changed — px → rem**
- Converted all meaningful `px` values to `rem` across **12 SCSS files**:
  `_navbar.scss`, `_hero.scss`, `_diferenciadores.scss`, `_testimonials.scss`, `_cta.scss`, `_videos.scss`, `_footer.scss`, `_chat-widget.scss`, `_search-filter.scss`, `_proyecto-detalle.scss`, `_proyectos.scss`
- `1px`/`2px` borders and `768px` media queries left as-is (standard practice)
- Added fluid root font-size: `html { font-size: clamp(87.5%, 82% + 0.25vw, 100%) }`

**Build:** ✓ `vite build` passes — 2076 modules, ~5.4s

---

### 2026-08-03 — Components & Features

**Added**
- `ProjectCard.jsx` — reusable card component using Bootstrap card system (`card-img-top`, `card-body`, `card-footer`)
- Interactive `SpacesGallery` — amenity icon buttons below gallery that focus individual slides
- WhatsApp links on `AgentCard` — avatar and phone wrapped in `wa.me` link
- Animated Lucide icon components with `startAnimation()` / `stopAnimation()` ref handles

**Changed**
- `Proyectos.jsx` — switched to Bootstrap `row row-cols-1 row-cols-md-2 row-cols-lg-3` grid for cards and value props
- `TeamAgents.jsx` — removed `w-50 mx-auto`, uses `row row-cols-1 row-cols-md-3 g-4`
- `ProyectoDetalle.jsx` — `flex-column flex-md-row` + `w-100` on CTA form
- CTA form layout responsive with Bootstrap flex utilities

**Fixed**
- Icon visibility: root cause was `animate={controls}` with no initial state. Fix: mount `useEffect` calling `stopAnimation()` + default color changed to `$lb-green`
- Mobile card overflow: root cause was `d-flex gap-4` with `flex-fill`. Fix: Bootstrap `row row-cols-*` system

---

### 2026-08-01 — Initial Scaffolding

**Added**
- React 19 + Vite 6 project setup
- Redux Toolkit store with `uiSlice` (mobileMenuOpen, isLoaded, activeFilter) and `projectSlice`
- SCSS architecture: `variables.scss`, `global.scss`, `main.scss` + component partials
- Bootstrap 5.3 integration with custom variable overrides
- GSAP + ScrollTrigger animation system (`useGsapAnimations` hook, `ScrollAnim` component)
- Full-screen `Loader` with GSAP fade-out tied to Redux `isLoaded`
- `ChatWidget` floating bubble
- Home page sections: Hero, Diferenciadores, Testimonials, CTA, Videos
- Lazy-loaded pages: Proyectos, ProyectoDetalle
- Fancybox integration for galleries
- Font Awesome 7 via jsdelivr CDN (correct `font/woff2` MIME type)
