# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.9.53] - 2026-09-09

### Changed
- `src/pages/Inn.jsx`: la barra de datos del proyecto (`INFO`) ahora consume dinámicamente el precio desde la API (`innProject`) usando `mapApiProject` en lugar del valor hardcodeado `UF 9.816`.
- `src/components/sections/VideosSection.jsx`: el proyecto destacado del mes ahora consulta la API de proyectos para resolver el precio base dinámico en lugar de tomar el valor estático de `content.js`.
- `src/pages/ProyectoDetalle.jsx`: la pestaña "Precio desde" de la barra de navegación se actualiza dinámicamente con el valor provisto por la API del proyecto.
- `src/data/projects.js` & `src/data/content.js`: eliminados valores de precio estáticos (`UF 9.816` y alternativas de maqueta) sustituyéndolos por marcadores neutrales de fallback.

## [0.9.52] - 2026-09-09

### Removed
- `src/data/projects.js`: eliminados `columns`, `rows` y `title` obsoletos dentro de `relatedProjects`, eliminando datos estáticos residuales de maqueta que eran redundantes frente al consumo real de la API en `RelatedProjects.jsx`.

## [0.9.51] - 2026-09-09

### Changed
- `src/components/proyecto/RelatedProjects.jsx` & `src/data/projects.js`: removido el asterisco (`*`) en la presentación de precios de la tabla de plantas/proyectos relacionados para evitar confusiones al no haber un disclaimer asociado.

## [0.9.50] - 2026-09-09

### Changed
- `src/components/proyecto/RelatedProjects.jsx` & `src/components/proyecto/Cotizador.jsx`: limitada la sección "Plantas relacionadas" para mostrar únicamente las primeras 3 plantas disponibles en lugar del listado completo con paginación, simplificando la visualización y optimizando la carga.

## [0.9.49] - 2026-09-09

### Changed
- `src/data/projects.js` & `src/components/proyecto/Alternatives.jsx`: generalizado el título de la sección de proyectos alternativos de "¿Buscas otras opciones en el sur de Chile?" a "¿Buscas otras opciones?", permitiendo reutilización para proyectos en cualquier zona geográfica.

## [0.9.48] - 2026-09-09

### Documentation
- `README.md`: incorporada subsección detallada sobre el **Pop-up de Avisos para Ocasiones Especiales (Feriados / Cierres)**, documentando su secuencia de aparición condicional, frecuencia por sesión y configuración centralizada en `src/data/announcementData.js`.

## [0.9.47] - 2026-09-09

### Changed
- `src/components/announcement/AnnouncementModal.jsx`: configurado `modal-header` con `data-bs-theme="dark"` y botón `.btn-close.btn-close-white` para renderizar la cruz de cierre en color blanco nítido sobre el fondo oscuro corporativo.

## [0.9.46] - 2026-09-09

### Refactor
- `src/components/announcement/AnnouncementModal.jsx`: adoptada la estructura canónica del modal de Bootstrap 5 dividida formalmente en `.modal-header` (con logo Leben oficial y botón `.btn-close`), `.modal-body` (título y mensaje) y `.modal-footer` (botón de acción), eliminando contenedores flex manuales.

## [0.9.45] - 2026-09-09

### Refactor
- `src/components/cookies/CookieConsentModal.jsx`: refactorizado para usar la estructura nativa del componente Modal de Bootstrap 5 (`modal`, `modal-dialog-centered`, `modal-content`, `modal-header`, `modal-body`, `modal-footer`, `btn-close`), eliminando clases CSS propietarias.
- `src/styles/components/_cookies.scss`: eliminado CSS repetitivo de modales y backdrops, conservando únicamente la clase de bloqueo de scroll y el estilo del botón flotante de revocación. Reducción del tamaño final del bundle CSS.

## [0.9.44] - 2026-09-09

### Refactor
- `src/components/announcement/AnnouncementModal.jsx`: refactorizado para utilizar exclusivamente las clases nativas del componente Modal de Bootstrap 5 (`modal`, `modal-dialog-centered`, `modal-content`, `btn-close`, `modal-body`), eliminando CSS custom innecesario.
- `src/styles/components/_announcement.scss`: eliminado en favor de las utilidades y estilos globales de Bootstrap 5.

## [0.9.43] - 2026-09-09

### Changed
- `src/components/announcement/AnnouncementModal.jsx`: diseño simplificado al extremo para máxima elegancia minimalista, conservando únicamente el logo Leben oficial, título, mensaje y botón "Entendido" (removidos badge y sección de llamado secundario).
- `src/data/announcementData.js`: estructura de datos compactada con solo título y mensaje informativo.
- `src/styles/components/_announcement.scss`: refinados espacios, padding y tipografía del pop-up.

## [0.9.42] - 2026-09-09

### Added
- `src/components/announcement/AnnouncementModal.jsx`: pop-up de avisos minimalista para ocasiones especiales (feriados, horarios especiales, cierres de sucursales) con logo Leben oficial, backdrop blur suave, cierre en tecla ESC y persistencia por sesión en `sessionStorage`.
- `src/data/announcementData.js`: archivo de configuración modular para activar/desactivar el pop-up (`enabled: true/false`), personalizar ID único, badge, título, mensaje y texto destacado.
- `src/styles/components/_announcement.scss`: estilos SCSS específicos para el modal de anuncio con animaciones suaves de entrada.

### Changed
- `src/App.jsx`: montado `AnnouncementModal` con renderizado secuencial condicionado estrictamente a que la web haya finalizado su carga inicial (`isLoaded: true`) y el consentimiento de cookies haya sido resuelto (`hasInteracted: true` y `!isSettingsOpen`).
- `src/styles/main.scss`: importado `@use 'components/announcement';`.

## [0.9.41] - 2026-09-09

### Added
- `README.md`: agregada sección exhaustiva sobre el **Cumplimiento de la Ley 21.719 (Chile) y Sistema de Cookies & Analítica Anónima**, detallando el principio de disociación/anonimato, cookieless pings y modelado de Google Consent Mode v2 sin cookies, y opt-in estricto de Meta Pixel.

### Changed
- `src/hooks/useTrackingConsent.js`: inicialización proactiva de GA4 en modo cookieless (`analytics_storage: denied`, `anonymize_ip: true`) para captura de pings anónimos agregados sin almacenamiento de cookies persistentes antes del consentimiento, evitando pérdida de métricas generales.

## [0.9.40] - 2026-09-09

### Added
- `src/hooks/useTrackingConsent.js`: hook reactivo para control en tiempo real de **Google Consent Mode v2** (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) y **Meta Pixel Consent** (`fbq('consent', 'grant' | 'revoke')`), asegurando cumplimiento estricto de la Ley 21.719 de Chile.
- `.env.example`: documentadas las variables opcionales `VITE_GA_ID` y `VITE_META_PIXEL_ID` para inyección de scripts bajo consentimiento previo.

### Changed
- `src/App.jsx`: integrado el hook `useTrackingConsent()` a nivel de aplicación para sincronización reactiva entre Redux y los servicios de analítica y marketing.

## [0.9.39] - 2026-09-09

### Added
- `src/store/slices/cookieSlice.js`: slice de Redux Toolkit para persistencia de consentimiento conforme a Ley 21.719 (Chile), con almacenamiento en `localStorage`, control de interacción obligatoria y granularidad por finalidades.
- `src/components/cookies/CookieConsentModal.jsx`: modal bloqueante con backdrop blur (`backdrop-filter: blur(8px)`) que impide la navegación libre hasta interactuar, con botones simétricos ("Aceptar solo esenciales" y "Aceptar todas") y panel detallado de toggles.
- `src/components/cookies/CookieSettingsTrigger.jsx`: botón flotante inferior permanente para reconfiguración y revocación expedita del consentimiento en 1 clic.
- `src/styles/components/_cookies.scss`: diseño SCSS para el modal, backdrop, tarjetas de categorías y switch toggles alineados a la estética Leben.
- `src/data/cookiesPageData.js`: contenido legal integral estructurado bajo la Ley 21.719, rol de la Agencia de Protección de Datos Personales (APDP), derechos ARCOP-B, transferencias internacionales y finalidades comerciales de Meta Ads, Google Ads y mailings.
- `src/pages/CookiesPage.jsx`: página de Política de Cookies y Seguridad con botón de reconfiguración interactivo y desglose de derechos.
- `src/App.jsx`: registradas rutas `/cookies` y `/politica-de-cookies` e integrados los componentes de cookies a nivel raíz.

### Changed
- `src/store/store.js`: registrado `cookieReducer` en el store central.
- `src/styles/main.scss`: importado `@use 'components/cookies';`.
- `src/data/content.js`: agregado enlace `'Política de cookies'` en `copyrightLinks`.
- `src/components/layout/Footer.jsx`: mapeado enlace a `/cookies` en el copyright strip.

## [0.9.38] - 2026-09-09

### Security
- `vite.config.js`: removido el token de autenticación en texto plano del proxy local `/api`. Ahora se carga dinámicamente con `loadEnv` a través de la variable de entorno `DEV_API_TOKEN`.
- `.env.local`: agregadas variables `DEV_API_TOKEN` y `DEV_API_TARGET` (excluidas del control de versiones).
- `.env.example`: documentadas las variables de configuración del proxy de desarrollo.
- `.gitignore`: removidas las exclusiones de `vite.config.js` y `AGENTS.md` para versionar la configuración segura y guías operativas.

## [0.9.37] - 2026-09-09

### Added
- `public/images/home/hero-institucional.jpg`: imagen de arquitectura residencial contemporánea generada con IA para los heroes de páginas estáticas e institucionales.
- `src/App.jsx`: agregadas rutas directas `/trabaja-en-leben` y `/trabaja-con-nosotros`.

### Changed
- `src/data/staticPages.js`: reemplazado `banner.jpg` en los heroes por `hero-institucional.jpg` (en nosotros y bases legales), `Trabaja-con-nosotros1.png` (en información de la empresa y trabaja en leben) y `banner-clientes.jpg` (en proceso de reserva en línea).
- `src/components/layout/Navbar.jsx`: conectado el enlace de menú "Trabaja en Leben" a `/trabaja-en-leben`.

## [0.9.36] - 2026-09-09

### Added
- `.agents/mcp/leben-bridge.js`: bridge stdio local para conectar cualquier cliente MCP (Antigravity IDE, Claude, Cursor, Copilot) al endpoint de WordPress Leben con bypass de Cloudflare Turnstile y lectura segura de credenciales desde `.env.local`.
- `.agents/mcp/leben-cli.js`: interfaz de línea de comandos para listar (`npm run mcp -- list`) e invocar herramientas del MCP directamente desde la terminal.
- `.agents/mcp_config.json` & `.vscode/mcp.json`: registro del servidor MCP `leben-wp` para el entorno de trabajo.
- `package.json`: agregado script `"mcp"` para ejecución ágil de tools.

## [0.9.35] - 2026-09-09

### Added
- `src/pages/StaticPage.jsx`: componente genérico y reutilizable para páginas institucionales y legales con soporte de Hero, texto enriquecido, fichas corporativas, pasos del proceso de reserva y botón de descarga de documentos.
- `src/data/staticPages.js`: repositorio de datos estructurados para páginas de `nosotros`, `quienes-somos`, `informacion-de-la-empresa`, `proceso-reserva-en-linea` y `bases-legales` (con enlace al PDF protocolizado oficial).
- `src/App.jsx`: registradas las rutas directas `/nosotros`, `/quienes-somos`, `/informacion-de-la-empresa`, `/proceso-reserva-en-linea` y `/bases-legales` con lazy loading.
- `.env.example`: plantilla de variables de entorno para configuración del MCP remoto de WordPress.

### Documentation
- `AGENTS.md`: documentada la configuración, protocolo JSON-RPC, autenticación Bearer vía variable `WP_MCP_TOKEN` en `.env.local` (sin exponer secretos en git), bypass de Cloudflare Turnstile y catálogo de 20 herramientas del servidor MCP remoto de WordPress Leben (`/wp-json/mcp/v1/http`).

### Changed
- `src/components/layout/Navbar.jsx`: vinculados los links de menú (`menuLinks` y `menuGroups`) a sus rutas directas correspondientes (`/bases-legales`, `/proceso-reserva-en-linea`, `/quienes-somos`, `/informacion-de-la-empresa`, `/nosotros`).
- `src/components/layout/Footer.jsx`: actualizados los links del copyright strip para navegar a `/bases-legales` e `/informacion-de-la-empresa`.
- `src/data/content.js`: actualizados los textos de `copyrightLinks`.

## [0.9.34] - 2026-09-09

### Fixed
- `Navbar.jsx`: corregido atributo `class` a `className` en el divisor "Más" del menú dropdown móvil (resuelto error ESLint).

### Documentation
- `README.md`: actualizada la arquitectura del proyecto (árbol de componentes `sections`, `proyecto`, `lib`, `pages` como `Inn.jsx` y `NotFound.jsx`, y partials SCSS), añadido Three.js al Tech Stack y enlace directo a `CHANGELOG.md`.

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
