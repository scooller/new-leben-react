# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.9.0] - 2026-09-01

### Added
- Componente reutilizable `HeroShell` para la estructura común de todos los heroes (Home, Proyectos, ProjectHero, INN, Brokers), preservando el SCSS existente de cada página.
- Utilidades CSS propias `w-N`, `h-N`, `max-w-N` (paso de 5) y variantes responsivas `w-{sm|md|lg|xl|xxl}-N` tipo Bootstrap.
- Textos de diferenciadores ahora aceptan HTML (`<b>`).
- Navegación de "Espacios comunes" (INN) vinculada al carrusel por `navId`.
- Mockup 3D con texturas reales en el modal de vistas del cotizador.
- Worker de Cloudflare con búsqueda semántica (`ai-search`).

### Changed
- `.lb-proj-hero-content` usa la clase `container` de Bootstrap para alinearse a la grilla.
- `ChatWidget`: `maxWidth: 80%` inline reemplazado por clase `max-w-80`.
- CSS de Fancybox e IntersectionObserver scrollspy centralizados en INN.
- Sección de contacto INN rediseñada con agent cards tipo pill.
- Iconos animados para espacios comunes y cotizador.

### Fixed
- Modal de horarios ya no se abre solo al cargar la página INN.
- Tag malformado `</ br>` en el título "ESPACIOS COMUNES" que rompía la compilación.
- Keys duplicadas de React en carruseles con imágenes repetidas.

### Removed
- `EQUIPMENT_NAV_ITEMS` sin uso en `Inn.jsx`.

## [0.8.0] - 2026-08-28

### Added
- Mockup 3D con texturas reales en el modal de vistas del cotizador.
- Modal de vistas 3D e iconos animados en el cotizador.

## [0.7.0] - 2026-08-27

### Added
- Modal de ubicación ampliada (reemplaza lightbox del mapa).

## [0.6.0] - 2026-08-25

### Added
- Galería b/n y sección de mapa en INN.
- Scrollspy en los tabs del hero de INN.

## [0.5.0] - 2026-08-24

### Added
- Página 404 personalizada.
- Segunda sección de banner con video en INN.
- Recorridos 360° y navegación entre proyectos.
- Carousel de navegación reutilizable (`CarouselNav`).

### Changed
- Limpieza de dependencias: removidos oxlint y `@types/react`.
- Assets públicos (`public/images`, `public/video`) fuera del repo.

## [0.4.0] - 2026-08-23

### Changed
- Refinado el layout de contacto del footer.

## [0.3.0] - 2026-08-18

### Added
- Landing page de INN con tipografía Julius Sans One.
- Iconos animados y datos reales de API en tarjetas del cotizador.

## [0.2.0] - 2026-08-13

### Added
- Split carousel y mejoras de UI en el cotizador.
- Cotizador universal con filtrado inteligente y skeletons.
- Filtros dinámicos y `ProjectCard` compartido en Proyectos.

### Fixed
- Galería, filtros, rutas y UX de skeletons del cotizador.

## [0.1.0] - 2026-08-11

### Added
- Commit inicial: setup Vite + React + Bootstrap, Home, listado de proyectos y cotizador base.
