# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.9.33] - 2026-09-08

### Changed
- `_proyecto-detalle.scss`: ajustada posición de la flecha indicadora del cotizador a `top: 10rem`.
- `_inn.scss`, `Inn.jsx`: ajustes de jerarquía tipográfica, espaciados y layout en secciones del proyecto INN.
- `Cotizador.jsx`: actualizado estilo visual del badge de conteo de departamentos a `text-bg-dark`.
- `VideoTextSection.jsx`, `ProjectFeatureSection.jsx`, `Recorridos360.jsx`: ajustes de niveles de encabezados (`h1`, `h2`, `h4`) y títulos de sección.

## [0.9.32] - 2026-09-08

### Fixed
- `ScrollAnim.jsx`: comparar el contenido HTML primitivo (`dangerouslySetInnerHTML?.__html`) en lugar de la referencia del objeto en las dependencias de `useEffect`, evitando que la animación se reinicie en bucle infinito ante re-renders de componentes padres.
- `InnTeamAgents.jsx`: removido prop `stagger` innecesario en el subtítulo animado.

## [0.9.31] - 2026-09-08

### Changed
- `Cotizador.jsx`, `RelatedProjects.jsx`: integrado `SplitTitle` en encabezados y títulos de tarjetas de plantas relacionadas.
- `Recorridos360.jsx`: normalizadas rutas de imágenes de Masterplan a `masterplan-1.jpg` y `masterplan-2.jpg`.
- `Inn.jsx`: ajustado timing de delay en cards informativas y fuerza de parallax en carrusel principal.

## [0.9.30] - 2026-09-08

### Changed
- `ProjectFeatureSection.jsx`, `InteriorismoSection.jsx`: mejorado el efecto de parallax en el proyecto INN incorporando `ease: 'power1.out'` y un retardo de inercia suave (`scrub: 1.5`), logrando un movimiento más fluido, notorio y cinematográfico.
- `Inn.jsx`, `Login.jsx`: actualizadas rutas de assets, fondos SVG, textos descriptivos y fotos del equipo asesor.

## [0.9.29] - 2026-09-08

### Added
- `Recorridos360.jsx`: soporte para múltiples imágenes por tour (`images: [{ title, src }]`) con selector de sub-tabs/pills sobre el visor. Se agregaron las vistas "Masterplan" y "Masterplan Primer Piso".

## [0.9.28] - 2026-09-08

### Removed
- `src/data/content.js`: eliminados bloques huérfanos (`ctaContent`, `cotizadorHero`, `splitCarousel`, y badges/links de `footerContent`), junto con claves no utilizadas en el objeto `images` (proyectos demo retirados e iconos redundantes).

## [0.9.27] - 2026-09-08

### Fixed
- `SplitTitle.jsx`: pasar `key` directamente como prop JSX (`<Tag key={key} {...props}>`) en lugar de incluirlo dentro del objeto propagado, eliminando advertencia de React 19 sobre propagación de `key`.

## [0.9.26] - 2026-09-08

### Fixed
- `TeamAgents.jsx`: corregida importación inexistente de `SplitText` a `SplitTitle`. Agregadas guardas seguras para `data` opcional y renderizado condicional de `wazeMap` cuando el proyecto no incluye mapa o datos estáticos de asesores.

## [0.9.25] - 2026-09-08

### Fixed
- `Cotizador.jsx`: el badge de deptos encontrados ahora muestra `'Buscando deptos…'` mientras `plantas` está cargando desde la API (`loading && !plantas.length`), evitando mostrar `0 deptos encontrados` durante la carga inicial.

## [0.9.24] - 2026-09-08

### Changed
- `Cotizador.jsx` & `_proyecto-detalle.scss`: igualada la altura (`2.125rem` / 34px) y centrado vertical flex para el badge de deptos (`.lb-proj-det-filter-badge`), el botón de borrar filtros (`.lb-proj-det-filter-reset`) y los dropdowns de filtro (`.lb-proj-det-filter-btn`).

## [0.9.23] - 2026-09-08

### Added
- `house-heart.jsx`: nuevo componente de icono animado oficial Lucide `house-heart` con microinteracción al hover.
- `ProjectOfMonthSection.jsx`: añadido icono `HouseHeartIcon` interactivo con `hover(iconRef)` al botón `.btn-dark`.

## [0.9.22] - 2026-09-08

### Added
- `SplitTitle.jsx`: soporte completo para `dangerouslySetInnerHTML` preservando etiquetas y estilos HTML (ej. `<span className="text-danger">`) mediante parseo nativo con `DOMParser`, envolviendo recursivamente cada palabra en `.lb-split-word` para su animación en GSAP ScrollTrigger.

## [0.9.21] - 2026-09-08

### Added
- `Diferenciadores.jsx`: parallax desacoplado con GSAP ScrollTrigger (`scrub: 1`) entre el fondo `bgLogo` (`.lb-diff-bg-logo`) y la imagen frontal `pareja` (`.lb-diff-pareja`) en la columna `col-md-5`.

## [0.9.20] - 2026-09-07

### Fixed
- `ScrollAnim.jsx`: soporte completo para `dangerouslySetInnerHTML`: renderiza de forma exclusiva sin pasar `children` al tag DOM (evitando el error de React `Can only set one of children or props.dangerouslySetInnerHTML`) y asegura que el target de animación GSAP sea el elemento principal (`el`) en lugar de fragmentos incompletos de `el.children`.

## [0.9.19] - 2026-09-07

### Changed

- `ScrollAnim.jsx`: añadido `transformOrigin: 'center center'` a los presets de transformación (`zoom-in`, `scale`, `flip-x`, `flip-y`, `rotate` y `bounce`).

## [0.9.18] - 2026-09-07

### Fixed

- `SplitTitle.jsx`: resuelto `Uncaught Error: Can only set one of children or props.dangerouslySetInnerHTML` extrayendo el contenido de `dangerouslySetInnerHTML.__html` para animar las palabras y evitando pasar la prop conflictiva al tag DOM cuando se renderizan hijos.

## [0.9.17] - 2026-09-07

### Fixed

- `SplitTitle.jsx`: resuelto `TypeError: content.split is not a function` asegurando extracción recursiva de texto cuando `text` o `children` contienen elementos o fragmentos JSX (como `<>VISTAS<br />INSUPERABLES</>`).

## [0.9.16] - 2026-09-07

### Changed

- `SplitTitle.jsx`: soporte para texto multilínea (saltos de línea `\n`), extracción recursiva de texto desde `children` (incluyendo etiquetas `<br />`).
- `Inn.jsx`: reemplazados `ScrollAnim` de títulos por `SplitTitle` en el Hero (`h1`) y en la sección Mapa/Ubicación (`h2`).

## [0.9.15] - 2026-09-07

### Fixed

- `SplitTitle.jsx`: añadido soporte para prop `delay`, soporte para `children` tipo string como fallback si se omite `text`, y espaciado consistente de palabras con `margin-right`.
- `VideoTextSection.jsx`: corregida prop de `ScrollAnim` (`animation="fade-up"` en lugar de `type`) y uso de `SplitTitle` con `text` y `delay`.

## [0.9.14] - 2026-09-07

### Removed

- `SplitCarousel.jsx` y `_split-carousel.scss`: eliminado componente y hoja de estilos huérfanos sin referencias en la aplicación.
- `main.scss`: removida regla `@use 'components/split-carousel';`.
- Directorio vacío `docs/`.

### Refactored

- `projectUtils.js`: exportada constante `ORIENTACION_LABELS` compartida y modernizado `groupByComuna` usando `Object.groupBy()`.
- `Cotizador.jsx` y `RelatedProjects.jsx`: reutilizan `ORIENTACION_LABELS` desde `projectUtils.js` en lugar de definir diccionarios locales duplicados.
- `Alternatives.jsx`: simplificado mapeo de proyectos reutilizando `mapApiProject` de `projectUtils.js`.

## [0.9.13] - 2026-09-07

### Changed

- `Inn.jsx`: la data de Team / Agents (`TEAM_DATA`) ahora se define directamente en `Inn.jsx` para facilitar su edición, eliminando la sección `team` de `projectDetails.inn` en `projects.js`.
- `InnTeamAgents.jsx`: sincronización reactiva de `agents` vía `useEffect` cuando cambia `data.agents`.

## [0.9.12] - 2026-09-07

### Changed

- `CarouselNav`: los labels de los items ahora se renderizan con `dangerouslySetInnerHTML`, permitiendo tags HTML (como `<br />` en `ESPACIOS_COMUNES_NAV_ITEMS` de `Inn.jsx`).

## [0.9.11] - 2026-09-07

### Changed

- SCSS: homologadas todas las media queries responsivas de componentes (`_brokers.scss`, `_inn-team-agents.scss`, `_perfil.scss`) utilizando mixins estándar de Bootstrap (`@include bs.media-breakpoint-down(...)`).

## [0.9.10] - 2026-09-07

### Fixed

- `_inn.scss`: importado módulo Bootstrap (`@use 'bootstrap/scss/bootstrap' as bs;`) para resolver namespace `bs` en mixins `@include bs.media-breakpoint-down(md)`.

## [0.9.9] - 2026-09-06

### Changed

- `Cotizador`: `showHeroPanel` ahora es estrictamente `false` por defecto (`showHeroPanel = false`), debiendo activarse de forma explícita en las vistas que requieran el panel hero (como `CotizadorGeneral`).

## [0.9.8] - 2026-09-06

### Added

- `Cotizador`: soporte para prop configurable `showHeroPanel` (booleano). Si es `false`, se omite el panel hero izquierdo y el cotizador se renderiza con el layout estándar `container` (ideal para vistas de proyecto); si es `true` (o modo `universal`), se muestra el panel izquierdo con parallax y layout ancho completo.

## [0.9.7] - 2026-09-06

### Added

- `ProjectFeatureSection`: añadido icono `Image` de `lucide-react` frente al contador de imágenes en las pestañas del modal de espacios.

## [0.9.6] - 2026-09-06

### Refactored

- `ProjectFeatureSection`: reemplazados los SVGs inline del modal de espacios por componentes `X`, `ChevronLeft` y `ChevronRight` de `lucide-react`.

## [0.9.5] - 2026-09-04

### Added

- Cotizador: efecto parallax en `.lb-cot-hero-panel` usando GSAP `ScrollTrigger` con `scrub` y `matchMedia(min-width: 992px)`, separando las velocidades de desplazamiento entre la imagen de fondo (`.lb-cot-hero-bg`) y el texto flotante (`.lb-cot-hero-content`).

## [0.9.4] - 2026-09-04

### Refactored

- Cotizador: simplificado `.lb-cot-hero-panel` combinando degradado y `background-image` en una sola regla SCSS con flexbox, eliminando los divs `.lb-cot-hero-img`, `.lb-cot-hero-overlay` y `position: absolute`.

## [0.9.3] - 2026-09-04

### Changed

- Cotizador: `.lb-cot-hero-img` ahora es un `<div>` con imagen de fondo (`background-image: url(...)`, `background-size: cover`) en vez de una etiqueta `<img>`.

## [0.9.2] - 2026-09-04

### Added

- Cotizador: panel de imagen hero a la izquierda (`Fondo_cotizar.jpg`) con texto superpuesto "Cotiza tu próximo departamento", usando layout `container-fluid` a ancho completo y bordes redondeados a la derecha estilo burbuja de diálogo.
- Nuevas clases SCSS: `.lb-cot-hero-panel`, `.lb-cot-hero-img`, `.lb-cot-hero-overlay`, `.lb-cot-hero-text`, `.lb-cot-content-col`.

## [0.9.1] - 2026-09-02

### Added

- Hook `useBsTooltips` (`src/hooks/useBsTooltips.js`): inicializa tooltips de Bootstrap (`data-bs-toggle="tooltip"`) con re-escaneo por dependencias e inicialización idempotente.
- Tooltips en iconos sociales del footer, avatar y acciones (WhatsApp / mail) de `AgentCard`, valores truncados de `ProjectTabs` y nombre de usuario en `Perfil`.
- Toggle mostrar/ocultar contraseña en `Login` con icono Eye/EyeOff y tooltip dinámico.

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
