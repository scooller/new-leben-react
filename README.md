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
│       └── projectSlice.js    # slug, project, selectedFloorPlan, notFound
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

---

## Changelog

All notable changes to this project are documented below.
Dates in `YYYY-MM-DD` format.

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
