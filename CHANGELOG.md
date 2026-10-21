# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.9.170] - 2026-10-21

### Changed
- `public/images/watermark-mockup.svg`:
  - Aumentada la separación y el relleno entre marcas de agua: expandido el lienzo a 680x420, agregada caja contenedora con borde punteado suave, mayor espaciado entre repeticiones y disposición escalonada tipo ladrillo para mayor aire y legibilidad.
- `src/styles/components/_static-page.scss`:
  - Ajustado `background-size` a `680px 420px` para corresponder con el nuevo patrón espaciado.

## [0.9.169] - 2026-10-21

### Added
- `public/images/watermark-mockup.svg`:
  - Creado asset vectorial ligero con patrón repetible y rotación diagonal (-24°) de marca de agua con la leyenda `"TEMPORAL — EN CONSTRUCCIÓN"`.
- `src/styles/components/_static-page.scss`:
  - Agregado modificador `.lb-is-mockup` con pseudo-elemento overlay en `position: fixed`, `pointer-events: none` y repetición en mosaico para cubrir toda la pantalla sin obstaculizar la navegación ni los clicks.

### Changed
- `src/data/staticPages.js`:
  - Agregado soporte de atributo booleano `mockup` (`false` por defecto) a todas las definiciones de páginas estáticas.
- `src/pages/StaticPage.jsx`:
  - Condicionada la clase `.lb-is-mockup` sobre el contenedor `<main>` cuando `page.mockup` o `page.isMockup` es `true`.

## [0.9.168] - 2026-10-21

### Added
- `src/data/staticPages.js`:
  - Incorporadas imágenes de logotipo (`logo`) e imágenes de perspectiva arquitectónica (`fondo`), junto a los nombres de los 18 edificios en la sección `PROYECTOS ANTERIORES` de la página de historia (`/nosotros`), extraídas fielmente desde el sitio original `https://ileben.cl/nosotros/`.
- `src/styles/components/_static-page.scss`:
  - Creados estilos SCSS para la sección de proyectos anteriores (`.lb-anteriores-section`), incluyendo el logotipo flotante, la perspectiva de fondo con efecto hover interactivo de expansión y comportamiento responsive para dispositivos móviles y de escritorio.

### Changed
- `src/pages/StaticPage.jsx`:
  - Actualizado el renderizado de la sección de proyectos anteriores para estructurar cada proyecto con su información (nombre de edificio, dirección y comuna) y su columna multimedia compuesta por el logotipo y la perspectiva de fondo.
- `src/styles/main.scss`:
  - Importado `components/static-page`.

## [0.9.167] - 2026-10-21

### Removed
- `src/components/TerrainErosionCarve.jsx`:
  - Eliminado el efecto interactivo de tallado topográfico al hacer click y arrastrar con el mouse en el fondo de la página de inicio, preservando únicamente la animación ambiental sutil de curvas de nivel e inclinación.

## [0.9.166] - 2026-10-21

### Fixed
- `src/App.jsx`:
  - **Reinicio forzado del scroll en navegación:** Desactivada la restauración automática de scroll del navegador (`history.scrollRestoration = 'manual'`), purgada la memoria de scroll de GSAP (`ScrollTrigger.clearScrollMemory()`) y aplicado reseteo instantáneo a `(0, 0)` tanto síncrono como en el siguiente frame de renderizado.
  - **Soporte robusto de anclas:** Si la URL incluye ancla hash (`#id`), preserva el scroll hacia el elemento destino reintentando hasta que el componente lazy/asíncrono termine de montar en el DOM.

## [0.9.165] - 2026-10-21

### Fixed
- `src/components/icons/animated-icon.jsx`:
  - Corregido wrapper de iconos animados aplicando `display: inline-flex`, `width: size`, `height: size` y `lineHeight: 0`, eliminando el espacio inferior del baseline de texto que desplazaba los iconos hacia arriba ~2.6px dentro de insignias circulares y botones.
- `src/pages/Brokers.jsx`:
  - Agregada clase `lh-1` en las insignias circulares de la lista de beneficios para asegurar un centrado geométrico perfecto.

## [0.9.164] - 2026-10-21

### Added
- `src/lib/apiFetch.js`:
  - **Caché en `sessionStorage`:** Las respuestas GET de la API se guardan en `sessionStorage` (`lb_api:<url>`) con TTL de 5 minutos, eliminando peticiones redundantes al navegar entre vistas o recargar en la misma sesión.
  - **Deduplicación en vuelo (`inflight` Map):** Si múltiples componentes solicitan la misma URL simultáneamente (como `/api/v1/proyectos`), comparten la misma promesa y disparan una sola llamada de red.
  - **Función de purga `clearApiCache()`:** Permite invalidar selectiva o totalmente el caché de sesión ante cambios explícitos.

## [0.9.163] - 2026-10-21

### Fixed
- `src/pages/CotizadorGeneral.jsx`:
  - Memoizada propiedad `selectionProp` para prevenir re-instanciación de objetos literales `{ filters }` en cada render.
  - Salvaguardado `handleProjectChange` para evitar actualizaciones de estado cíclicas cuando el proyecto activo no cambia (`prev?.id === p?.id`).
- `src/components/proyecto/Cotizador.jsx`:
  - Eliminado reseteo destructivo de filtros en el efecto de sincronización de `data`.
  - Salvaguardada sincronización de selección externa con `lastAppliedSelectionRef`, evitando que al seleccionar comuna o proyecto en los dropdowns locales se sobreescriban los filtros con la búsqueda previa.

## [0.9.162] - 2026-10-21

### Performance
- `src/lib/apiFetch.js`:
  - Retorno de metadatos de paginación (`last_page`, `total`) para permitir optimizaciones de carga.
- `src/components/proyecto/Cotizador.jsx`:
  - **Paginación paralela:** Páginas 2 a N se descargan en paralelo vía `Promise.all` en lugar de peticiones en serie secuenciales, reduciendo la espera de ~7s a ~1.8s.
  - **Caché en memoria (`plantasCache`):** Reutilización de listas de plantas ya descargadas para que cualquier cambio subsiguiente de filtros responda en 0ms sin parpadeos de carga.
  - **Consulta directa por `proyecto_id`:** En modo universal, cuando se selecciona un proyecto específico, se solicita únicamente dicho proyecto (`?proyecto_id=X`), acelerando la primera búsqueda a ~400ms.

## [0.9.161] - 2026-10-21

### Removed
- `src/styles/variables.scss`:
  - Eliminadas variables de escala custom `$lb-heading-1`, `$lb-heading-2`, `$lb-heading-3` y `$lb-heading-4`.
- `src/styles/components/` (`_brokers.scss`, `_cotizador-general.scss`, `_diferenciadores.scss`, `_hero.scss`, `_inn.scss`, `_inn-team-agents.scss`, `_perfil.scss`, `_proyecto-detalle.scss`, `_proyectos.scss`, `_testimonials.scss`, `_videos.scss`):
  - Eliminadas todas las sobrescrituras explícitas de `font-size` con `$lb-heading-*` en títulos y subtítulos, delegando el tamaño fluido a la escala y RFS nativos de Bootstrap.

## [0.9.160] - 2026-10-21

### Removed
- `src/styles/components/_invest.scss`:
  - Eliminadas clases y reglas `clamp()` redundantes (`.lb-invest-hero__title`, `.lb-invest-value__title`, `.lb-invest-advisory__title`, `.lb-invest-process__title`, `.lb-invest-smart__title`).

### Changed
- `src/pages/Invest.jsx`:
  - Reemplazadas clases custom de títulos por utilidades fluidas nativas de Bootstrap (`display-4`, `h2`, `display-6`).

## [0.9.159] - 2026-10-21

### Added
- `src/styles/global.scss`:
  - Nueva utilidad `.xs-small` (`0.6em`) para micro-textos, notas y aclaraciones legales (con soporte contextual en encabezados `h1`-`h6`).

### Changed
- `src/pages/Invest.jsx` & `src/data/invest.js`:
  - Renderizado HTML en títulos de `valueProp` y `smartBanner` (`dangerouslySetInnerHTML`).
  - Uso de `.xs-small` en disclaimer de banner inteligente y ajustes de layout en selector de proyectos.
- `src/styles/components/_invest.scss`:
  - Borde blanco en `.rounded-circle.bg-danger`.

## [0.9.158] - 2026-10-21

### Changed
- `src/pages/Invest.jsx`:
  - Renderizado de `data.hero.title` mediante `dangerouslySetInnerHTML` para permitir etiquetas HTML (`<b>`, `<span class="red">`, etc.).
- `src/styles/components/_invest.scss`:
  - Soporte de estilos para clases `.red` y `.text-danger` dentro de `.lb-invest-hero__title`.
- `src/pages/Brokers.jsx` & `src/styles/components/_brokers.scss`:
  - Soporte análogo de HTML y estilos de resalte para `data.hero.title` en la página de Brokers.

## [0.9.157] - 2026-10-20

### Added
- `src/pages/Inn.jsx`:
  - Añadido bloque de comentarios sobre la definición de `LOCATION_POINTS` detallando la orientación predeterminada (`right`) y opciones válidas (`direction: 'right' | 'left' | 'top' | 'bottom'`).

## [0.9.156] - 2026-10-20

### Changed
- `src/pages/Inn.jsx`:
  - Pin **MALL** (`Mall Paseo`) configurado con `direction: 'down'` y comentario explicativo para orientar su línea y etiqueta hacia abajo, evitando solapamientos visuales.
- `src/styles/components/_inn.scss`:
  - Agregados alias de clase `&--down` (equivalente a `--bottom`) y `&--up` (equivalente a `--top`) para soporte idiomático fluido.

## [0.9.155] - 2026-10-20

### Added
- `src/styles/components/_inn.scss`:
  - **Soporte multiorientación para pines del mapa:** Soporte para direcciones `right` (por defecto / derecha), `left` (izquierda), `top` (arriba) y `bottom` (abajo).
  - Variables dinámicas de traslación (`--pin-tx`, `--pin-ty`), escala (`--pin-scale`) y punto de anclaje (`--pin-origin`) para que el punto central quede perfectamente fijado en las coordenadas exactas `(x%, y%)` sin desplazarse al hacer hover o selección activa.
- `src/pages/Inn.jsx`:
  - Enlace de clase `lb-inn-map__pin--${dir}` en cada pin según la propiedad `direction` o `dir` de cada elemento en `LOCATION_POINTS`, con valor por defecto `'right'`.
- `tools/map_pin_editor/main.py`:
  - **Selector de dirección en el editor:** Campo `Combobox` interactivo en el formulario ("Dirección:") con opciones `right`, `bottom`, `left`, `top`.
  - **Previsualización visual y exportación:** Renderizado fiel en el lienzo Tkinter hacia cualquier orientación, detección de clics en el badge según la orientación activa, y exportación automática en la generación de código JS.

## [0.9.154] - 2026-10-20

### Added
- `public/images/inn/ubicacion/nuevo.jpg`: Creada imagen de alta resolución (1200x675) de Puerto Varas (Costanera, Lago Llanquihue y Volcán Osorno) para servir como imagen por defecto y placeholder visual para nuevos puntos de interés.
- `tools/map_pin_editor/main.py`:
  - **Auto-generación de imagen por defecto:** Implementada función `ensure_default_point_image()` que garantiza la existencia física de `public/images/inn/ubicacion/nuevo.jpg`.
  - **Sincronización en creación y guardado:** Al añadir nuevos puntos (`_add_point_at` y `on_add_new_pin`) o guardar directamente en JSX (`on_save_directly_to_jsx`), verifica y genera automáticamente cualquier imagen referenciada inexistente para prevenir errores 404 en la web.
- `src/pages/Inn.jsx`:
  - **Fallback visual en carrusel:** En `InnGalleryCarousel`, añadido manejo `onError` y fallback a `images/inn/ubicacion/nuevo.jpg` tanto en `<img />` como en el enlace Fancybox, asegurando que ningún punto muestre imágenes rotas.

## [0.9.153] - 2026-10-20

### Fixed
- `tools/map_pin_editor/main.py`:
  - **Eliminación del lag al arrastrar pines:** Se optimizó radicalmente el ciclo de renderizado durante eventos `<B1-Motion>`:
    - Se separó el dibujo de los pines (`redraw_pins`) del redimensionamiento de la imagen de fondo (`redraw_canvas`), evitando ejecutar costosos remuestreos Lanczos de alta resolución en cada píxel de movimiento.
    - Se incorporó caché dimensional `_cached_image_size` para la imagen base de Tkinter, redimensionándola únicamente al alterar el tamaño de la ventana o lienzo.
    - Se pospusieron las actualizaciones pesadas de UI (`_refresh_listbox_item`, `_update_ref_panel_visuals`, `_update_code_preview`) para el evento `<ButtonRelease-1>`, logrando arrastre de pines fluido a 60+ FPS sin demora.

## [0.9.152] - 2026-10-20

### Added
- `tools/map_pin_editor/main.py`:
  - **Selector de color de fondo del lienzo:** Combobox con preajustes rápidos (Oscuro, Grafito, Gris, Claro, Blanco) y swatch de color interactivo que abre diálogo nativo `colorchooser.askcolor`.
  - **Menú contextual dinámico:** Submenú en clic derecho sobre el mapa ("🎨 Cambiar Color de Fondo") para cambiar el fondo directamente sobre el lienzo.
  - Sincronización visual inmediata del área de trabajo para facilitar contraste con planos transparentes, mapas oscuros o claros.
- `tools/map_pin_editor/README.md`: Documentado el nuevo selector de color de fondo del lienzo.

## [0.9.151] - 2026-10-20

### Added
- `tools/map_pin_editor/main.py`:
  - **Pin Principal Interactivo:** Soporte completo para agregar, seleccionar, posicionar y reubicar interactivamente el pin principal del proyecto sobre el mapa.
  - **Panel dedicado en Sidebar:** Bloque con estado ("⭐ Pin Principal del Proyecto"), botón de activación/selección, eliminación, edición de nombre, ajuste fino de coordenadas X% e Y% con spinboxes, y botón para copiar snippet JSX (`<div className="lb-inn-map__pin-inn ...">`).
  - **Interacción en Canvas:** Selección visual diferenciada (anillo dorado resplandeciente con estrella central y badge de coordenadas), arrastre interactivo en tiempo real con recálculo continuo de coordenadas porcentuales.
  - **Menú contextual (clic derecho):** Opciones para "⭐ Colocar Pin Principal aquí", "🎯 Seleccionar y Mover Pin Principal", "📋 Copiar JSX Pin Principal" y "🗑️ Quitar Pin Principal".
  - **Sincronización bidireccional:** Al guardar directamente en `Inn.jsx`, sincroniza tanto el array `LOCATION_POINTS` como los estilos de posición `left/top` del pin principal.
- `tools/map_pin_editor/README.md`: Documentadas las nuevas capacidades interactivas y atajos para gestionar el pin principal del proyecto.

## [0.9.150] - 2026-10-19

### Removed
- `public/images/`: Limpieza exhaustiva de 82 imágenes no utilizadas (47.48 MB recuperados):
  - `proyectos/`: Eliminados 8 mockups locales gigantes (`proj-argomedo.jpg`, `proj-piloto.jpg`, etc.) obsoletos tras integración con API de Salesforce.
  - `inn/`: Eliminados SVGs sobredimensionados (`espacio.svg`, `edificio.svg`), renders y mapas huérfanos (`360.png`, `Mapa_PV.png`, `mapa-big.jpg`, etc.).
  - `inn/galerias/` y `inn/3d/`: Eliminadas carpetas completas y sus archivos huérfanos/duplicados.
  - `inn/panoramas/`: Eliminados duplicados y descartes de IA (`Fundo Playa Venado.png`, `Reserva_Nacional_Llanquihue_AI.jpg`, etc.).
  - `brokers/`: Eliminadas fotos de eventos y logos SVG locales obsoletos (reemplazados por endpoint remoto en producción).
  - `icons/`: Eliminados 14 archivos SVG obsoletos sustituidos por componentes React en `src/components/icons/`.
  - `team/`, `home/`, `brand/`: Eliminadas versiones duplicadas o temporales (`catalina.jpg`, `Prueba fondo.png`, `sello9.png`).

### Fixed
- `src/data/projects.js`: Corregidas referencias de imágenes de terminaciones en Edificio INN para apuntar a los archivos existentes en `images/inn/terminaciones/terminacion-*.jpg`.
- `src/components/proyecto/InnPanoramasModal.jsx`: Sincronizada extensión a `.jpg` para `Fundo Playa Venado_2.jpg`.

## [0.9.149] - 2026-10-19

### Changed
- `tools/map_pin_editor/main.py`: Ahora extrae dinámicamente tanto la imagen del mapa desde `const MAP = { ... image: '...' }` como los puntos desde `const LOCATION_POINTS` leyendo directamente `src/pages/Inn.jsx` (u otro archivo JSX seleccionado), con botón de sincronización y guardado directo.

## [0.9.148] - 2026-10-19

### Added
- `tools/map_pin_editor/`: Editor visual e interactivo de escritorio en Python (`main.py`, `run.bat`, `requirements.txt`, `README.md`) para cargar planos y mapas, ubicar y arrastrar pines interactivamente, y exportar/importar el array `LOCATION_POINTS` listo para pegar en React.
- `package.json`: Script `"map-editor"` para ejecutar la herramienta con `npm run map-editor`.

## [0.9.147] - 2026-10-19

### Documentation
- `README.md`:
  - Removida referencia a Three.js en la tabla de Tech Stack.
  - Sincronizada la estructura completa del proyecto (`src/`): incorporados subdirectorios `announcement/`, `cookies/`, `cotizador/`, fondo procedural `TerrainErosionCarve.jsx`, páginas (`Invest.jsx`, `StaticPage.jsx`, `CookiesPage.jsx`), hooks (`useTrackingConsent.js`), fuentes de datos y parciales SCSS (`_cookies`, _`invest`), y eliminadas referencias a archivos borrados (`Proyectos.jsx`, `_cta.scss`).

## [0.9.146] - 2026-10-19

### Changed
- `src/App.jsx` (`ponytail`):
  - Simplificado temporizador de carga: reemplazado detector de `document.readyState` y listener `load` por un único `setTimeout` con cleanup en montaje.
  - Simplificado desplazamiento por ancla (hash): reemplazada cascada de 3 timeouts (100, 300, 700ms) por un único temporizador con cleanup.
  - Rutas consolidadas: mapeo conciso con `.map()` para aliases (`/invest`, `/inversionistas`, `/cookies`, `/politica-de-cookies`) y páginas estáticas integrando resolución automática de slugs en `StaticPage`.

## [0.9.145] - 2026-10-19

### Removed
- `src/components/proyecto/Room3DMockup.jsx`: eliminado componente 3D huérfano sustituido previamente por `WindowPanViewer`.
- Dependencia `three`: removida de `package.json` reduciendo bundle y eliminando chunk no utilizado.
- `src/components/sections/ValueProps.jsx`: eliminado componente obsoleto sin referencias en el proyecto.
- `src/components/icons/car.jsx`, `src/components/icons/footprints.jsx`: eliminados iconos animados en desuso tras refactor de ubicación en INN.
- `src/styles/components/_cta.scss`: eliminado archivo CSS redundante; reemplazado por utilidades Bootstrap `.img-fluid .d-block` en `CTASection.jsx`.

### Changed
- `src/App.jsx`: simplificado enrutador envolviendo `<Routes>` en un único `<Suspense fallback={<PageLoader />}>`, eliminando 21 wrappers repetitivos por ruta.
- `src/components/layout/Navbar.jsx`: simplificada concatenación de clases CSS en `Navlink`, eliminando lógica redundante con `Set` y `Array.from`.
- `vite.config.js`: removido comentario sobre chunk de `Room3DMockup`.
- `README.md`: actualizadas referencias en la estructura del proyecto.

## [0.9.144] - 2026-10-19

### Changed
- Auditoría global de border-radius en todas las páginas y componentes (`ponytail`):
  - `Inn.jsx` & `_inn.scss`: tabs de héroe de INN adaptados a utilidad nativa `rounded-pill` de Bootstrap; eliminada declaración manual redundante en `_inn.scss`.
  - `_inn.scss`: mapa interactivo pin y hit areas actualizados de `999px` hardcoded al token `$lb-radius-pill`.
  - `_navbar.scss`: barra de navegación y badges de navegación actualizados de `50rem` al token estándar `$lb-radius-pill`.
  - `_hero.scss` & `_proyectos.scss`: eliminadas declaraciones inertes `border-radius: 0` en breakpoints mobile.

## [0.9.143] - 2026-10-19

### Changed
- `Brokers.jsx` & `_brokers.scss`: estandarización de border-radius con utilidades globales (`ponytail`):
  - Uso de clases atómicas `.lb-radius-bl .lb-radius-br` (de `global.scss`) en `HeroShell` de Brokers en lugar de clases ad-hoc.
  - Eliminados estilos manuales de `border-bottom-left-radius` / `border-bottom-right-radius` en `_brokers.scss`.
  - Reemplazado `borderRadius: '50rem'` inline por utilidad nativa `rounded-pill` de Bootstrap en paginación de eventos.

## [0.9.142] - 2026-10-19

### Added
- `Cotizador.jsx`, `projects.js`: soporte para descarga de brochure en cotizador con mockup digital de Edificio INN:
  - Enlace al PDF mockup `images/inn/Brochure_Digital_2026.pdf` para Edificio INN (`isInn`).
  - `ActionButton` adaptado para admitir props de enlaces (`href`, `download`, `target`, `rel`, `disabled`).

## [0.9.141] - 2026-10-16

### Changed
- `Brokers.jsx` & `_brokers.scss`: carrusel de eventos adaptado para paginación de 3 en 3 elementos:
  - Visualización en cuadrícula de 3 fotos por diapositiva con controles de navegación prev/next circulares y puntos de paginación interactivos.
  - Sincronización automática de diapositivas al alternar pestañas (`2025`, `2024`, `2023`, `Nuevas Alianzas`).

## [0.9.140] - 2026-10-16

### Changed
- `Brokers.jsx`, `brokers.js`, `_brokers.scss`: transformada la sección de eventos en un carrusel dinámico interactivo:
  - Extracción directa de las 40 fotos reales de eventos desde `https://brokers.ileben.cl/` categorizadas por pestaña (`2025`, `2024`, `2023`, `Nuevas Alianzas`).
  - Implementación de carrusel continuo infinito (`marquee`) que se actualiza reactivamente al cambiar de pestaña.
  - Pausa de movimiento al pasar el cursor (`:hover`), elevación sutil de las diapositivas y bordes degradados.

## [0.9.139] - 2026-10-16

### Changed
- `Brokers.jsx`, `brokers.js`, `_brokers.scss`: reemplazada la cuadrícula fija de alianzas por un carrusel continuo e infinito de logos:
  - Extracción e incorporación de los 20 logos oficiales activos desde `https://brokers.ileben.cl/`.
  - Animación suave infinita (`marquee`) con pausa al pasar el cursor (`:hover`), desvanecimiento lateral en gradiente y logos con hover interactivo.

## [0.9.138] - 2026-10-16

### Changed
- `Brokers.jsx` & `_brokers.scss`: refactorización ponytail para reemplazar estilos propios por utilidades nativas de Bootstrap 5.3:
  - Hero, beneficios y manager photo adaptados a utilidades de Bootstrap (`rounded-4`, `img-fluid`, `d-flex align-items-center gap-3`, badges circulares `rounded-circle bg-danger`).
  - Formulario de postulación optimizado con `card bg-black text-white border-light border-opacity-10`, `form-control` y `btn btn-danger rounded-pill`.
  - Pestañas de eventos migradas a botones pill nativos (`btn rounded-pill px-4 py-2`).
  - Tarjetas de eventos y logos de alianzas adaptados a `card`, `card-body` y sistema de rejilla `row row-cols-2 row-cols-md-4 g-4`.
  - Reducción de más de 450 líneas en `_brokers.scss`, manteniendo únicamente la tabla de tiers (carrusel específico de Figma) y los chevrons geométricos.

## [0.9.137] - 2026-10-16

### Added
- `Navbar.jsx` & `_navbar.scss`: estado `.active` automático y dinámico para enlaces de navegación:
  - Detección precisa de la página activa mediante `useLocation()` (`pathname` y prefijo de ruta).
  - Estilo visual de enlace activo con color blanco de alto contraste, tipografía destacada e indicador inferior rojo `#d1193e`.
  - Enlaces destacados (como "Cotizar") conservan su estilo botón pill sin interferir con la navegación activa.

## [0.9.136] - 2026-10-16

### Changed
- `Invest.jsx` & `_invest.scss`: refactorización ponytail para reemplazar estilos propietarios por utilidades nativas de Bootstrap 5.3:
  - Reemplazo de `.lb-invest-form-card*` por `card bg-dark text-white rounded-4`, `form-control`, `form-select` y `btn btn-danger`.
  - Reemplazo de estilos de tarjetas y badges por `card`, `card-body`, `card-footer`, `badge`, `bg-body-tertiary` y utilidades flex/spacing (`d-flex`, `gap-3`, `align-items-start`).
  - Reducción de más del 80% del archivo `_invest.scss`, conservando únicamente tokens de layout parallax, títulos clamp y microinteracciones de hover.

## [0.9.135] - 2026-10-16

### Changed
- `Invest.jsx` & `_invest.scss`: centrado completo de todos los elementos del banner principal (hero):
  - Eyebrow, título de 65px, bajada descriptiva y botón CTA "QUIERO INVERTIR" perfectamente centrados horizontal y verticalmente según Figma `2260:1072`.

## [0.9.134] - 2026-10-16

### Changed
- `Invest.jsx`, `_invest.scss`, `index.html`: igualado diseño pixel-perfect con Figma Desktop (`2260:1044`):
  - **Tipografía**: añadida fuente `Lexend Deca` (pesos 400, 500, 600, 700) aplicada globalmente a la página.
  - **Hero**: altura 720px con borde recto, tipografía exacta (título 65px/600 `#f5f2ed`), botón rectangular `218x51` radio 8px `#d1193e`.
  - **Oportunidad Única**: bullets con insignias circulares verde esmeralda `#1b5e4a` y check blanco, imagen `592x480` con radio 16px.
  - **Formulario**: contenedor oscuro `#1a1a1a` radio 24px con rejilla exacta de 3x3 (inputs blancos altura 42px radio 8px y botón Enviar `#d1193e` integrado en la tercera columna).
  - **Asesoría Experta**: estructura de 2 columnas (imagen izquierda + lista vertical de 4 beneficios con check-circle `#1b5e4a`).
  - **Proyectos**: pestañas `SANTIAGO | REGIONES` con separador rojo, tarjetas `#f0f3f7` con barra de estado (`Entrega Inmediata` `#d1193e` / `Venta en Blanco` `#5a6e7f`) y enlace `Conocer proyecto →`.
  - **Proceso**: tarjetas `#f5f8fc` radio 16px con insignia circular roja `44x44` superpuesta.
  - **Smart Banner**: contenedor `#141414` altura 515px con imagen lateral y botón redondeado `#d1193e`.
  - **FAQ**: acordeón de 2 columnas de 5 tarjetas blancas radio 12px y banner inferior de contacto con botón `Quiero invertir`.

## [0.9.133] - 2026-10-16

### Added
- `Invest.jsx`, `invest.js`, `_invest.scss`: implementada la página completa de Leben Invest desde Figma (nodos `2260:1044` y `2260:1489`):
  - **Hero Section**: curvatura inferior `120px`, título con split typography, fondo parallax, CTA principal y badges rápidos.
  - **Oportunidad Única**: split layout con imagen destacada y 3 beneficios con iconografía diferenciadora (10% pie, 60 cuotas sin interés, arriendo garantizado 36 meses).
  - **Formulario de Inversión**: captura de leads con campos de contacto, RUT, renta líquida, comuna y proyecto.
  - **Asesoría Experta**: 4 tarjetas de valor (análisis financiero, servicio llave en mano, proyectos exclusivos y simplicidad operativa).
  - **Oportunidades de Inversión**: listado interactivo con pestañas de filtro (Todos, Santiago, Regiones) y tarjetas con tags de entrega y valores UF.
  - **Proceso de Inversión**: 4 pasos estructurados con fotografía, insignia numérica y descripción paso a paso.
  - **Banner Smart**: callout en tarjeta oscura `#141414` destacando opción 0 pie y arriendo garantizado con CTA directo.
  - **Preguntas Frecuentes**: acordeón interactivo en 2 columnas con 10 respuestas clave del mercado inmobiliario chileno y banner de contacto.
- `Navbar.jsx` & `App.jsx`: enlazada ruta `/invest` (y alias `/inversionistas`) en el menú principal y navbar dinámico.

## [0.9.132] - 2026-10-16

### Added
- `Brokers.jsx`, `brokers.js`, `_brokers.scss`: implementado carrusel interactivo por categorías para la tabla de Tiers según Figma:
  - Estructuradas las 6 categorías completas: `COMUNICACIÓN`, `CAPACITACIÓN`, `NEGOCIO`, `VISITAS`, `PAGOS` y `BENEFICIOS ADICIONALES`.
  - Orden de columnas invertido según especificación: `PARTNER BLACK` (negro `#111111`), `PARTNER GOLD` (dorado `#c5a059`) y `PARTNER SILVER` (plata `#8e959e`).
  - Navegación por carrusel: botones laterales con chevron (`<` y `>`), selector de pestañas superiores (`tabs`) por categoría y paginación inferior interactiva con indicador numérico.
  - Columna de categoría vertical roja `#d1193e` con texto rotado 90° que abarca la altura completa de las filas de la categoría activa.
  - Indicador de flecha/chevron en la celda de cabecera roja apuntando hacia `PARTNER BLACK`.

## [0.9.131] - 2026-10-16

### Changed
- `Brokers.jsx` & `_brokers.scss`: ajustada tabla de categorías y barra KAM para coincidir fielmente con el diseño Figma:
  - Cabecera: fondo rojo `#d1193e` en columna de categorías/título, plata `#8e959e` en Silver, dorado `#c5a059` en Gold y negro `#111111` en Black.
  - Celdas: fondo rojo `#d1193e` con texto blanco en todas las etiquetas de categoría ("COMUNICACIÓN") y bordes redondeados en las esquinas inferiores.
  - Checks: coloreados según tier (Silver `#8e959e`, Gold `#c5a059`, Black `#111111`).
  - Navegación: añadidos botones flotantes circulares rojos con chevron (`<` y `>`) flanqueando la tabla.
  - KAM Info Bar: icono de correo rojo `#d1193e` y barra chevron en cápsula continua entrelazada (`border-radius: 9999px`) con gradientes metálicos y etiquetas inferiores con flechas.

## [0.9.130] - 2026-10-16

### Changed
- `Brokers.jsx` & `_brokers.scss`: alineada maquetación completa con el diseño Figma Desktop (nodo `2260:2`):
  - Hero: curvatura inferior `120px` (`border-radius: 0 0 120px 120px`), botón CTA único "Postula ahora" (eliminado botón secundario no presente en Figma).
  - Tabla de Tiers: añadida columna de categoría ("COMUNICACIÓN") a cada fila con grid proporcional de 5 columnas (`130px 450px repeat(3, 1fr)`).
  - KAM Info Bar: chevrons entrelazados con clip-path e indicadores de gradiente metálico (Silver, Gold, Black) y etiquetas de venta.
  - Formulario de Registro: ajustado card a contenedor oscuro `#111111` con borde sutil, campos de experiencia/contacto y disclaimer legal inferior sin checkboxes redundantes.
  - Eventos: corregido título y descripción del evento 3 a "Lanzamiento Exclusivo Vitacura" con preventa VIP según Figma.
  - Alianzas: tarjetas de logotipos individuales con fondo blanco, bordes redondeados y micro-interacción hover.
- `src/data/brokers.js`: añadida propiedad `category: 'COMUNICACIÓN'` a filas de tiers y actualizada tarjeta de evento 3.

## [0.9.129] - 2026-10-15

### Changed
- `BuscadorDepartamentos.jsx`: renombrado desde `FlightSearchForm.jsx` para reflejar con precisión el dominio inmobiliario del proyecto.
- `CotizadorGeneral.jsx`: actualizado import y uso a `BuscadorDepartamentos`.
- `_cotizador-general.scss`: migradas clases `.lb-flight-*` a `.lb-buscador-*`.

## [0.9.128] - 2026-10-15

### Removed
- `public/images/inn/`: eliminados 47 archivos de imágenes y SVGs no referenciados (~14.3 MB liberados) tras auditoría exhaustiva:
  - Carpeta en desuso `public/images/inn/galerias/` completa (16 imágenes).
  - SVGs de prueba y assets obsoletos en raíz: `edificio.svg`, `espacio.svg`, `EECC_Atrio.jpg`, `EECC_Bodega_Nautica.jpg`, `EECC_Quincho_Gourmet.jpg`, `Foto_Iturralde_400x680.jpg`, `Foto_Rivera_400x680.jpg`, `Logo_INN_Mapa.png`, `mapa-big.jpg`, `mapa.png`, `masterplan-1.jpg`, `masterplan-2.jpg`, `RAPC_EXT_Elevacioen-Tarde_Media16.jpg`, `V.png`.
  - Duplicados en `equipamiento/`: `Equipamiento_Detalle_Cocina_Franke.jpg`, 6 detalles de cocina duplicados fuera del subdirectorio activo `cocina/`, y mockup de instrucciones `Fotos_Cocina_Orden y Textos.png`.
  - Alternativas en `panoramas/`: `Fundo Playa Venado_2.jpg`, `Playa Venado_06_IA.jpg`, `Reserva_Nacional_Llanquihue_AI.jpg`.
  - Terminaciones obsoletas en `terminaciones/`: 6 archivos no referenciados (conservando las 2 utilizadas por `src/data/projects.js`).

## [0.9.127] - 2026-10-15

### Removed
- `public/images/inn/Ubicacion_01_Color.jpg`, `public/images/inn/Ubicacion_02_Color.jpg`: eliminadas imágenes placeholder en desuso.

### Changed
- `Inn.jsx`: reemplazados puntos de ubicación por exclusivamente los 6 puntos nuevos con imágenes en `public/images/inn/ubicacion` (`Mesa Tropera`, `Jumbo`, `Casino Dreams`, `Cassis`, `Mall Paseo`, `La Olla`), sincronizando carrusel e índice activo a 0.

## [0.9.126] - 2026-10-15

### Removed
- `Inn.jsx`: eliminada estructura duplicada y en desuso `LOCATION_DATA`, estado `mapTab`, `showMapModal`, refs de iconos e interfaz modal `#innMapModal`.
- `public/images/inn/Ubicacion_03_Color.jpg`: eliminado archivo de imagen placeholder en desuso.
- `public/images/inn/panoramas/Nueva carpeta`: eliminada carpeta duplicada con copias redundantes de imágenes de ubicación.

### Changed
- `Inn.jsx`: consolidada la base de datos de ubicación en un único array `LOCATION_POINTS`, eliminando punto duplicado de "Mesa Tropera" y enlazando imágenes individuales generadas (`Casino_Dreams_01_IA`, `Cassis_IA`, `La Olla_IA`, `Mesa_Tropera_AI`, `Paseo_Puerto_Varas_AI`, `Supermercado_Jumbo_AI`).

## [0.9.125] - 2026-10-15

### Changed
- `_cotizador-general.scss`: reemplazados radios manuales/inconsistentes en `.lb-flight-category-bar`, pestañas, tarjeta, caja de ruta y dropdowns por variables nativas de Bootstrap (`bs.$border-radius-xl`, `bs.$border-radius-lg`, `bs.$border-radius`, `bs.$border-radius-pill`), corrigiendo el radio de la barra superior.

## [0.9.124] - 2026-10-15

### Changed
- `CotizadorGeneral.jsx`: ampliado tamaño y respiro del banner hero (`lb-cot-gen-banner--expanded`) y ocultada la flecha triangular cuando no hay planta seleccionada para una integración limpia con el formulario flotante.
- `FlightSearchForm.jsx`: rediseñado con fidelidad a la estructura del formulario de LATAM Airlines: barra de navegación superior oscura con indicador activo rojo, caja de ruta enmarcada (Comuna + Proyecto) con badge de intercambio, fila secundaria con selectores y botón CTA.
- `_cotizador-general.scss`: perfeccionados estilos para el banner expandido, tarjeta flotante unificada, selectores de ruta y estados responsivos.

## [0.9.123] - 2026-10-15

### Added
- `FlightSearchForm.jsx`: nuevo componente de selección y búsqueda de departamentos inspirado en el formulario `#flight-search-form` de LATAM Airlines, con tabs de categoría/intención, segmentos de búsqueda con iconos (`Ubicación`, `Proyecto`, `Dormitorios`, `Orientación`), botón CTA prominente y chips de comunas frecuentes.
- `_cotizador-general.scss`: estilos responsive `.lb-flight-search-*` con diseño de tarjeta flotante unificada, divisores verticales, menús desplegables con conteo de proyectos y micro-animaciones.

### Changed
- `CotizadorGeneral.jsx`: integrado `FlightSearchForm` en el estado inicial sin planta seleccionada, enlazando la búsqueda al `Cotizador` con filtros preseleccionados y soporte para volver a buscar o limpiar.
- `Cotizador.jsx`: soporte para `selection.filters`, disparador `onReset` y botón `onModifySearch` para retornar al formulario de búsqueda.

## [0.9.122] - 2026-10-14

### Fixed
- `CotizadorGeneral.jsx`: corregido `useEffect` de scroll para soportar cualquier ancla (incluyendo `#cotizador-gral` y `#cotizador`) haciendo scroll suave a la parte superior (`top: 0`) o al elemento correspondiente.
- `Navbar.jsx`: añadido soporte en `handleClick` para que los enlaces a `#cotizador-gral` realicen scroll suave al inicio de la página.

## [0.9.121] - 2026-10-14

### Changed
- `_proyecto-detalle.scss` & `_proyectos.scss`: eliminadas declaraciones manuales de `padding-block` en favor de las utilidades nativas de Bootstrap (`py-4 py-md-5` y `py-3 py-md-4`).
- `Cotizador.jsx`, `ProjectsCatalog.jsx`, `ProjectOverview.jsx`, `FloorPlans.jsx`, `Vista360.jsx`, `SpacesGallery.jsx`, `LocationSection.jsx`, `BottomGallery.jsx`, `TeamAgents.jsx`, `RelatedProjects.jsx`: adoptadas clases utilitarias estándar de Bootstrap para espaciado vertical homologado y responsive.

## [0.9.120] - 2026-10-14

### Added
- `ProjectCard.jsx`: añadido badge `bg-secondary` en la esquina superior derecha (`top-0 end-0 m-2`) con la comuna del proyecto formateada en `text-capitalize`.

## [0.9.119] - 2026-10-14

### Changed
- `projectUtils.js`: incorporada lista de ordenamiento de proyectos preferida (`PROJECT_DISPLAY_ORDER`) y utilidades `getProjectOrderRank` y `sortProjectsByCustomOrder` con normalización robusta y búsqueda por palabra clave.
- `ProjectsCatalog.jsx`: aplicado ordenamiento personalizado a proyectos planos y por zona (Baum, Mood, Living Town, Argomedo, Santo, Indi, Capitanes, Suecia, Bold, INN, Índigo, Nórdico, Parque Germania y resto).
- `Cotizador.jsx`: ordenado el desplegable de proyectos en modo universal según el orden personalizado.

## [0.9.118] - 2026-10-14

### Removed
- `Proyectos.jsx`: eliminada la página legacy tras su fusión definitiva en `/cotizador`.
- `App.jsx`: eliminada la ruta `/proyectos` del router principal.

## [0.9.117] - 2026-10-14

### Added
- `ProjectsCatalog.jsx`: componente reutilizable para catálogo de proyectos con filtros dinámicos (ubicación, tipología, precio UF), barra de filtrado responsiva, soporte para datos externos o internos vía API, estado de carga skeleton, y vista agrupada por zona o lista plana.

### Changed
- `Proyectos.jsx`: refactorizado para reutilizar `ProjectsCatalog` con agrupación por comunas (`groupByZone`), eliminando ~160 líneas de código redundante.
- `CotizadorGeneral.jsx`: refactorizado para reutilizar `ProjectsCatalog` pasando proyectos precargados (`projects={rawProjects}`), eliminando hooks duplicados y manteniendo la navegación directa al ancla `#proyectos`.

## [0.9.116] - 2026-10-14

### Added
- `global.scss`: implementada animación cinemática para modales (`scale(0.92) + translateY(20px)` a `scale(1) translateY(0)` con curva `cubic-bezier(0.16, 1, 0.3, 1)`) y desenfoque progresivo de fondo (`backdrop-filter: blur(8px)`).

## [0.9.115] - 2026-10-14

### Changed
- `global.scss`: refactorizada la clase `.highlight` (`.btn-highlight`) aislando el pulso a ondas exteriores transparentes (`box-shadow` en pseudo-elementos `::before`/`::after` con `isolation: isolate`), eliminando filtros difusos y fondos bajo el texto para mantener la tipografía 100% nítida y legible.

## [0.9.114] - 2026-10-14

### Changed
- `_inn.scss`: ajustado estilo de botón destacado (`nav-link--featured`, `btn-outline-primary`) en la botonera de navegación de INN para que tenga fondo transparente con borde rojo Leben en reposo, y pase a rojo sólido primario con sombra en `:hover` y `:focus`.
- `Inn.jsx`: asignada clase `btn-outline-primary` al botón destacado de Cotizador en la botonera desktop.

## [0.9.113] - 2026-10-14

### Added
- `global.scss`: creada clase utilitaria `.dot-highlight` (y `.lb-dot-highlight`) con animación de pulso y halo radar en rojo-leben (`$lb-red`) para pines y puntos circulares.
- `_inn.scss`: integrada la clase `.dot-highlight` sobre `.lb-inn-map__pin-dot-wrap` para resaltar pines seleccionados en el mapa de Puerto Varas.

### Changed
- `Inn.jsx`: asignada clase `.dot-highlight` al pin de ubicación activo en el mapa interactivo.

## [0.9.112] - 2026-10-14

### Added
- `global.scss`: creada clase `.highlight` (junto con `.lb-highlight` y `.btn-highlight`) con animación de pulso y resplandor radial en color rojo-leben (`$lb-red`) detrás del elemento para captar atención.

## [0.9.111] - 2026-10-14

### Changed
- `Cotizador.jsx`: definido `DEFAULT_COTIZADOR_DATA` internamente con `title` y `subtitle` (`data = DEFAULT_COTIZADOR_DATA`) y fallback seguro de estado.
- `CotizadorGeneral.jsx`: eliminada la constante y prop redundante `COTIZADOR_DATA` y actualizado título de cabecera.
- `ProjectFeatureSection.jsx`: renombrada prop a `descriptionHtml` para contenido HTML enriquecido.
- `Inn.jsx`: adoptada prop `descriptionHtml` en secciones de proyecto y mapa de ubicación; actualizado texto de video y botones.
- `RelatedProjects.jsx`: título dinámico con nombre del proyecto (`Alternativas en ${data.projectName}`).
- `Navbar.jsx`: actualizado enlace de navegación a "Invest".
- `projects.js`: configurado `subtitle` para cotizador de Edificio INN.

## [0.9.110] - 2026-10-13

### Changed
- `InnPanoramasModal.jsx`: carrusel de panoramas implementado con componente nativo Carousel de Bootstrap (`.carousel.slide`, `.carousel-inner`, `.carousel-item`).
- `InnPanoramasModal.jsx`: tarjetas agrupadas automáticamente en pares de 2 por slide (`chunkIntoPairs`) para que nunca desborden en una segunda fila.
- `InnPanoramasModal.jsx`: integración con Fancybox en las imágenes del carrusel agrupadas por categoría (`panoramas-{categoryId}`).
- `Recorridos360.jsx`, `_inn.scss`: botones de subvistas de Masterplan estilizados en dorado (`.lb-inn-360__subtabs`) con degradado INN, borde sutil y estado activo homologado.

### Fixed
- `_fancybox.scss`: fijado `z-index: 2000 !important` en `.fancybox__container` para que Fancybox se posicione por encima de modales de Bootstrap (`z-index: 1055`).

## [0.9.109] - 2026-10-13

### Fixed
- `_proyecto-detalle.scss`: imagen de planta usa `aspect-ratio: 133/60` en el wrapper `.lb-img-trigger` con `width: 100%` y altura variable (no fija). La `<img>` interna pasa a `height: 100%` sin ratio propio.
- `_proyecto-detalle.scss`: columna de detalles `.lb-proj-det-cot-details` declarada como `display: flex; flex-direction: column` para que sus hijos sean flex items.
- `_proyecto-detalle.scss`: precio y botón Cotizar (`.lb-proj-det-cot-pricing`) siempre al fondo de la columna derecha con `margin-top: auto !important` para sobreescribir Bootstrap `.mt-4 { margin-top: 1.5rem !important }`.

## [0.9.108] - 2026-10-09

### Changed
- `_navbar.scss`: invertido el comportamiento del botón `featured` (`.lb-nav-link--featured`, `.btn-primary`): fondo sólido primario (`$lb-red`) y texto blanco en estado normal, y borde con fondo transparente (`outline`) en estado `:hover` y `:focus`.
- `_inn.scss`: ajustado `.nav-link--featured` y `.btn-primary` en el navbar del proyecto INN para que mantenga fondo rojo primario por defecto y pase a `outline` rojo transparente en `:hover`.
- `Inn.jsx`: asignada la clase `nav-link--featured btn btn-primary` por defecto a los items destacados en pestañas de escritorio y menú móvil, respondiendo al nuevo comportamiento invertido.

## [0.9.107] - 2026-10-09

### Changed
- `Cotizador.jsx`: unificada la cabecera del cotizador en una sola fila (`row g-4 align-items-end mb-4`) con tres columnas: `col-lg-3` para el título, `col-lg-6` para los selectores de filtro (ambas suman 9 columnas alineadas con la planta) y `col-lg-3` para las acciones de filtro (badge contador y botón Limpiar, alineada con los detalles).
- `_proyecto-detalle.scss`: añadida clase `.lb-proj-det-cot-title-col` al grupo de posicionamiento relativo de la cabecera.

## [0.9.106] - 2026-10-09

### Changed
- `Cotizador.jsx`: trasladado el título a fila superior (`col-12 mb-3`), reestructurados los filtros en `col-lg-9` (`lb-proj-det-cot-filters-col`) y los botones de acción del filtro (contador/badge y botón Limpiar) en `col-lg-3` (`lb-proj-det-cot-filter-actions-col`) para alinear perfectamente con las columnas principales de la planta (`col-lg-9`) y detalles (`col-lg-3`).
- `_proyecto-detalle.scss`: removido `max-width` fijo en `.lb-proj-det-cot-title` y añadida clase `.lb-proj-det-cot-filter-actions-col` con posicionamiento relativo e índice de capa.

## [0.9.105] - 2026-10-09

### Changed
- `_inn.scss`: creado estilo `.lb-inn-btn` (y `.lb-inn .btn-gold`) que homologa los botones CTA al diseño de `.nav-link.nav-link__border.active` pero invertido: por defecto con fondo degradado dorado, borde dorado y texto blanco, y en `:hover` fondo transparente con borde dorado y texto oscuro. Actualizado el contenedor `.card.lb-inn-hero-tabs__inner` en `.lb-inn-360` con diseño glassmorphism y pestañas activas con hover transparente y solo borde.
- `Inn.jsx`: sustituido `btn btn-gold` por `btn lb-inn-btn` en el botón de Mapa, texto en mayúsculas y removido `MapPinIcon`.
- `ProjectFeatureSection.jsx`: sustituido `btn btn-gold` por `btn lb-inn-btn` en el botón "Conoce los espacios" con texto en mayúsculas.
- `InnTeamAgents.jsx`: sustituido `btn btn-gold` por `btn lb-inn-btn` en el botón "Agenda tu visita" con texto en mayúsculas y removido `CalendarCheckIcon`.
- `Recorridos360.jsx`: homologado el padding del card-body y etiquetas en mayúsculas (`tour.label.toUpperCase()`) para igualar el navbar del proyecto.

## [0.9.104] - 2026-10-07

### Fixed
- `Cotizador.jsx` & `_proyecto-detalle.scss`: removida la clase `h-100` y sustituido `height: 100%` por `height: auto` en `.lb-img-trigger` y `.lb-proj-det-cot-plan-img`. Ahora el navegador no fuerza ambas dimensiones fijas y respeta correctamente el cálculo dinámico del `aspect-ratio: 133 / 60` a partir del ancho disponible.

## [0.9.103] - 2026-10-07

### Changed
- `Cotizador.jsx`: unificado el esquicio del edificio y la planta del departamento en una sola tarjeta interactiva panorámica (`col-lg-9`), reduciendo el layout principal de 3 columnas a 2 columnas (`col-lg-9` imagen unificada, `col-lg-3` ficha técnica y cotización). Se eliminó la columna separada de esquicio (`.lb-proj-det-cot-map`) y la constante `PLACEHOLDER_ESQUICIO`.
- `_proyecto-detalle.scss`: implementado aspect ratio nativo `133 / 60` (proporción exacta de 665×300) en el disparador de imagen y en la planta (`.lb-img-trigger`, `.lb-proj-det-cot-plan-img`, `.lb-proj-det-cot-skeleton`), con `object-fit: contain` para escalar nítidamente cualquier resolución HD/Retina sin recortes ni distorsión. Ajustado el contenedor de botones y thumbnails inferior para alinearse armónicamente con la nueva grilla.

## [0.9.102] - 2026-10-07

### Changed
- `Navbar.jsx`: removida la condición `forceScrolled` para la ruta `/cotizador`. Ahora la barra de navegación se inicia transparente sobre el nuevo banner hero (`.lb-cot-gen-banner`) y transiciona con fondo translúcido y desenfoque (`.lb-navbar-scrolled`) al hacer scroll, igual que en las demás páginas con hero.
- `_cotizador-general.scss`: añadido `padding-top: $lb-navbar-height` a `.lb-cot-gen-banner` para compensar la altura del navbar fijo y centrar adecuadamente su contenido.

## [0.9.101] - 2026-10-07

### Fixed
- Navegación a `#proyectos`:
  - `Navbar.jsx`: añadido handler `handleClick` en `Navlink` para enlaces con hash (`to: '/cotizador#proyectos'`), asegurando scroll suave automático cuando el usuario ya se encuentra en la misma página.
  - `App.jsx`: implementado scroll hacia el elemento `location.hash` con reintentos para soportar rutas con lazy-loading (`CotizadorGeneral`).
  - `CotizadorGeneral.jsx`: añadido `useEffect` al montar y al cambiar hash para hacer `scrollIntoView` suave a `#proyectos`.
  - `_cotizador-general.scss`: configurado `scroll-margin-top: 5rem` en `#proyectos` para compensar la altura del navbar fijo.

## [0.9.100] - 2026-10-07

### Fixed
- `CotizadorGeneral.jsx`: corregido el mapeo de proyectos en `useFilteredProjects` aplicando `mapApiProject(p)`. Los datos de la API ahora se transforman correctamente a las propiedades esperadas por `ProjectCard` (`image`, `location`, `entrega`, `tipologia`, `precioDesde`), restaurando la visualización completa de información e imágenes en las tarjetas.

## [0.9.99] - 2026-10-07

### Changed
- `CotizadorGeneral.jsx`: en la sección "Main Projects" (`#proyectos`), se eliminó la separación y títulos por comuna (`groupByComuna`). Ahora todos los proyectos se muestran unificados en una sola grilla continua (`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`), ordenados alfabéticamente por comuna y nombre de proyecto (`useFilteredProjects`).

## [0.9.98] - 2026-10-07

### Changed
- `CotizadorGeneral.jsx`: rediseñado el layout para incorporar la imagen de fondo (`/images/Fondo_cotizar.jpg`) como banner superior (`.lb-cot-gen-banner`) con título, subtítulo y flecha estilizada en la base apuntando hacia el interior del banner (`.lb-cot-gen-banner__arrow`). El componente `Cotizador` ahora se renderiza directamente debajo en un contenedor estándar (`container g-4`), replicando la estructura de diseño de `Inn.jsx`.
- `Cotizador.jsx`: simplificado eliminando la lógica y ramas específicas de `showHeroPanel`, `hasHero`, observador de resize y efectos GSAP de parallax lateral, estandarizando el Cotizador en su contenedor responsivo nativo en todas las vistas.
- `_cotizador-general.scss`: agregados estilos de `.lb-cot-gen-banner` con fondo panorámico, gradiente oscuro de contraste, tipografía con `$font-title` y flecha notch en la base con fondo `$lb-cream` apuntando hacia el interior del banner.
- `_proyecto-detalle.scss`: removidas reglas obsoletas `.lb-cot-hero-panel`, `.lb-cot-hero-bg`, `.lb-cot-content-col` y `&--has-hero`.

## [0.9.97] - 2026-10-07

### Changed
- `Inn.jsx`: soporte dual para pestañas destacadas (`featured: true`) según presencia de `active: true`. Si `active` no está definido o es falso, renderiza como botón contorno (`btn-outline-primary nav-link--featured-outline`) con borde primario y relleno primario al `:hover`; si `active` es verdadero (o la sección está seleccionada/activa), permanece siempre relleno en color primario (`btn-primary nav-link--featured active`).
- `_inn.scss`: añadidas clases `.nav-link--featured-outline` y `.btn-outline-primary` con fondo transparente, borde `$lb-red` y transición de relleno `$lb-red` en hover/focus/active, extendiendo también el soporte para ítems en menú móvil (`dropdown-item--featured-outline`).

## [0.9.96] - 2026-10-07

### Changed
- `Inn.jsx`: integrado soporte para ítems destacados (`featured: true`) en el menú de navegación del proyecto (`TABS`). En la botonera desktop aplica clases `nav-link--featured btn btn-primary` preservando el estado activo/hover, y en el menú móvil aplica `dropdown-item--featured` con punto indicador primario `lb-inn-dot--primary`.
- `_inn.scss`: añadidas reglas para `.nav-link--featured` y `.btn-primary` dentro de `.lb-inn-hero-tabs__inner` para utilizar el color primario de marca (`$lb-red` y hover/active `$lb-red-dark`) en lugar del degradado activo dorado (`$lb-gradient-gold`), junto con adaptaciones correspondientes en el selector móvil.

## [0.9.95] - 2026-10-07

### Changed
- `Navbar.jsx`: ampliado componente interno `Navlink` para admitir `active`, `variant`, clases personalizadas (`className`), y clases Bootstrap (`btn btn-primary active`). Configurado el enlace `Cotizar` en `mainLinks` como destacado (`featured: true, active: true`) y actualizados `menuLinks` directos para Locales comerciales y Proyectos.
- `_navbar.scss`: extendidas reglas `.lb-nav-link` y `.lb-dropdown-link` para que `.active` y `.btn-primary` adopten el estilo destacado de botón principal (`$lb-red`, pill redondeado, sombra y transiciones).

## [0.9.94] - 2026-10-07

### Changed
- `global.scss`: removido `background-image: url(/images/home/fondo.jpeg)` estático en `#root main#main-home`, configurado `position: relative` con elevación de secciones hijas a `z-index: 1`, y añadida clase `.lb-home-terrain-bg` para renderizar el fondo de terreno procedural interactivo como lienzo fijo en `z-index: 0`.
- `App.jsx`: montado `TerrainErosionCarve` como fondo dinámico dentro de `<main id="main-home">` en la ruta principal.
- `TerrainErosionCarve.jsx`: adaptada la paleta de colores por defecto a la identidad Leben (`lineColor` en tono pizarra bosque `rgba(56, 71, 60, 0.20)` y `accentColor` en bronce patagónico `rgba(158, 110, 67, 0.70)`), y configurada captura no invasiva de tallado en `window` con filtro para elementos interactivos y soporte táctil sin bloqueo de scroll.

## [0.9.93] - 2026-10-07

### Changed
- `InnPanoramasModal.jsx`: simplificado adoptando utilidades y componentes nativos de Bootstrap 5 (`btn-close btn-close-white`, `card border-0`, `ratio ratio-16x9`, `object-fit-cover`, `modal-open`), removiendo icono `X` superfluo y reduciendo lógica de bloqueo de scroll a una línea.
- `_inn.scss`: eliminados selectores CSS redundantes de close-button, card-img-wrap, card-info, card-dist, footer y controls en favor de utilidades estándar de Bootstrap 5.

## [0.9.92] - 2026-10-07

### Added
- `InnPanoramasModal.jsx`: modal de panoramas y experiencias ("EL SUR, A TU MANERA") basado en estructura modal de Bootstrap 5 (`modal fade`, `modal-dialog-centered modal-xl`, `modal-content`), con fondo de bosque nativo, tabs por categoría (`RUTA DEL LAGO`, `NATURALEZA EN GRANDE`, `CULTURA JUNTO AL LAGO`, `ESCAPADAS MEMORABLES`), navegación por slides con contador (`[1/3]`), tarjetas de panoramas con fotos y distancia en vehículo, soporte para teclado (Escape y flechas de navegación) y bloqueo de scroll.
- `_inn.scss`: estilos integrados para `.lb-inn-panoramas-modal`, simplificados eliminando wrappers redundantes al aprovechar las clases de Bootstrap, fondo natural con gradiente oscuro, tipografía de título en `$font-title` y acento dorado `$inn-gold`, pestañas con línea activa, tarjetas en tono arena `#f6f1eb` y botones de navegación circulares.
- Imágenes en `public/images/inn/panoramas/` para destinos y fondo del modal (`bg-forest.jpg`, `ensenada.jpg`, `playa-venado.jpg`, `saltos-petrohue.jpg`, `teatro-lago.jpg`, `peulla.jpg`).

### Changed
- `Inn.jsx`: re-habilitado el botón "Descubrir panoramas" para abrir el nuevo modal interactivo de experiencias y panoramas.

## [0.9.91] - 2026-10-06

### Added
- `TerrainErosionCarve.jsx`: recreación interactiva del fondo animado de mapa topográfico con erosión dinámica (`terrain-erosion-carve`), implementado con Canvas 2D nativo, ruido procedural 2D (fBm), isolíneas calculadas con marching squares, tallado de cauces por arrastre/pointer, partículas de sedimento y auto-regeneración exponencial del terreno.

## [0.9.90] - 2026-10-06

### Changed
- `_inn.scss`: modificado el comportamiento de animación en hover y activo de las tarjetas del carrusel de ubicación (`.lb-inn-gallery__card`) a `scale` (`scale(1.02)` / `scale(1.035)`) en lugar de desplazamiento vertical (`translateY`), con padding compensatorio en `.carousel-inner` para prevenir cortes por overflow.

## [0.9.89] - 2026-10-06

### Changed
- `Inn.jsx`: rediseñadas las tarjetas del carrusel de ubicación `InnGalleryCarousel` a tarjetas full-bleed sin caja inferior blanca, con tarjeta central activa en color y borde dorado (`offset: [-1, 0, 1]`), tarjetas inactivas en escala de grises, degradado oscuro inferior con título en mayúsculas, icono `WalkIcon` y tiempo a pie (`a X minutos de INN`), preservando intacto el botón para ampliar imagen con Fancybox en la esquina superior derecha.
- `_inn.scss`: actualizados estilos de `.lb-inn-gallery__card`, imagen con ratio `16/10`, `border-radius: 10px`, filtro grayscale condicional para inactivos y hover, overlay inferior con gradiente oscuro, tipografía de título y tiempo, y botón zoom Fancybox posicionado arriba a la derecha.

## [0.9.88] - 2026-10-06

### Changed
- `_inn.scss`: color de fondo de las secciones de ubicación y galería (`.lb-inn-map` y `.lb-inn-gallery`) actualizado a `#f9f2e7` idéntico al fondo del diseño.
- `_inn.scss`: añadida línea conectora horizontal (`.lb-inn-map__pin-line`) entre el punto del pin y la pastilla de texto con separación de 1.15rem, con iluminación dorada en hover y activo.
- `Inn.jsx`: extraído `InnGalleryCarousel` como componente memoizado (`memo`) con `handleSelectLocation` estabilizado (`useCallback`), evitando que re-renders de React fuercen o reseteen las clases del carrusel de Bootstrap al hacer clic en los pines.

## [0.9.87] - 2026-10-06

### Changed
- `Inn.jsx`: actualizadas coordenadas de pines para calzar exactamente con el nuevo mapa base `Mapa_PV.png`, agregados los 9 puntos de interés (`Mesa Tropera`, `Costanera`, `Mall`, `Cassis`, `Casino Dreams`, `Playa Puerto Chico`, `Jumbo`, `La Olla`), renderizado el pin oficial de INN (`pin_logo.png`) en Vicente Pérez Rosales 991 e integrada la dirección con icono dorado bajo el mapa interactivo.
- `_inn.scss`: rediseñados pines con marcador circular (punto gris con centro blanco / dorado activo) y pastilla blanca con borde y texto en mayúsculas, ajustado pin de INN y estilo de dirección `.lb-inn-map__address`.

## [0.9.86] - 2026-10-04

### Changed
- `_inn.scss`: incrementado `z-index` de pines en hover y focus a `50 !important` y tooltip a `60` para superponerse claramente sobre pines vecinos cercanos y pin activo.

## [0.9.85] - 2026-10-04

### Fixed
- `Inn.jsx`: optimizado registro de clics en pines del mapa agregando `onPointerDown`, desactivado auto-avance conflictivo (`interval: false`) y encolado de transiciones de carrusel en caso de estar en deslizamiento (`_isSliding`).
- `_inn.scss`: añadida zona de clic expandida (`::before` de 55px), `touch-action: manipulation` y `pointer-events: none` en elementos hijos del pin para evitar clics perdidos.

## [0.9.84] - 2026-10-04

### Changed
- `Inn.jsx`: eliminada ampliación con modal en el mapa de ubicación; convertida la sección en mapa interactivo con pines de interés sincronizados bidireccionalmente con `innGalleryCarousel` (al hacer clic en un pin se selecciona la tarjeta del carrusel y viceversa).
- `_inn.scss`: añadidos estilos para pines interactivos de mapa (`.lb-inn-map__pin`), pulsos, tooltips y tarjetas interactivas de galería con estado seleccionado (`.lb-inn-gallery__card--active`).

## [0.9.83] - 2026-09-22

### Changed
- `InteriorismoSection.jsx`: habilitado renderizado de HTML en descripción mediante `dangerouslySetInnerHTML`.
- `Inn.jsx`: actualizados textos comerciales, dirección con salto de línea, tipologías, descripción y botón de mapa ("Descubrir panoramas"), detalles de sala de ventas/piloto, descripción de proyecto y reseña extendida de interiorismo.

## [0.9.82] - 2026-09-17

### Added
- `Footer.jsx`: añadida sección "Información Corporativa" sobre la franja de copyright/routeMap con enlaces a Trabaja en Leben (`/trabaja-en-leben`), Bases legales (`/bases-legales`) y Proceso de Reserva en línea (`/proceso-reserva-en-linea`).

### Removed
- `Navbar.jsx`: removido bloque comentado de Información Corporativa en el menú de navegación superior.

## [0.9.81] - 2026-09-17

### Fixed
- `CarouselNav.jsx` & `Inn.jsx`: eliminado el desplazamiento automático de scroll (`scrollIntoView`) al hacer clic en las pestañas/botones de navegación de la sección "Espacios", permitiendo cambiar de diapositiva sin desplazar la pantalla.

## [0.9.80] - 2026-09-17

### Added
- `public/images/placeholder-floorplan.svg` y `public/images/placeholder-esquicio.svg`: placeholders visuales arquitectónicos para planta y esquicio.

### Changed
- `Cotizador.jsx`: preservada la estructura visual completa de `lb-proj` en estado inicial / sin filtros, mostrando valores en guion (`UF -`, `- m²`, `-`) e imágenes placeholder que se actualizan automáticamente al filtrar datos reales.
- `Cotizador.jsx`: añadido mockup de prueba para Edificio Inn, ocultando el primer thumbnail en `lb-proj-det-cot-thumb` y seleccionando el segundo por defecto.
- `CotizadorGeneral.jsx`: inicializado `COTIZADOR_DATA` con estructura base sin datos pre-cargados.

## [0.9.79] - 2026-09-17

### Changed
- `projectUtils.js`: actualizada función `tipologiaSummary` para omitir la cuenta de baños y mostrar exclusivamente el rango/listado de dormitorios (`2D - 3D - 4D`) en las tarjetas de la sección de proyectos.

## [0.9.78] - 2026-09-17

### Changed
- `App.jsx`: redirigida la ruta `/proyectos` permanentemente hacia `/cotizador#proyectos` mediante `<Navigate replace />`.
- `VideosSection.jsx`: enlace actualizado a `/cotizador#proyectos`.
- `Diferenciadores.jsx`: redirección de buscador actualizada a `/cotizador?${params}#proyectos`.
- `ProyectoDetalle.jsx`: botón de retorno actualizado a `/cotizador#proyectos`.
- `Navbar.jsx`: actualizado `pageLinksMap` para registrar `/cotizador` con anclas a `#cotizador` y `#proyectos`.

## [0.9.77] - 2026-09-17

### Fixed
- `_navbar.scss`: configurado ancho dinámico intrínseco (`width: max-content`, `min-width: max-content`, `max-width: calc(100vw - 2rem)`) y `white-space: nowrap` en `.lb-dropdown` y `.lb-dropdown-link`, evitando que textos extensos como "Canal de denuncias y consultas" queden truncados.

## [0.9.76] - 2026-09-17

### Changed
- `Navbar.jsx`: activado `featured: true` en el enlace `'Locales comerciales'` del menú desplegable y soporte de `target="_blank"` / `rel="noopener noreferrer"` para enlaces externos automáticos.

## [0.9.75] - 2026-09-17

### Added
- `Navbar.jsx`: soporte en `Navlink` para destacar links mediante propiedades `featured: true` (o `highlight: true`) y `badge: 'Texto'` tanto en barra superior como en menú dropdown móvil.
- `_navbar.scss`: clases `.lb-nav-link--featured` (estilo pill/botón CTA), `.lb-nav-badge`, `.lb-dropdown-link--featured` y `.lb-dropdown-badge` con estilos responsivos.

## [0.9.74] - 2026-09-16

### Added
- `ProjectFeatureSection.jsx`: el objeto `slide` ahora soporta la propiedad opcional `link`. Si `link` existe y no es nulo o vacío, Fancybox abre dicho link (soporta URLs externas, relativas e internas), manteniendo la imagen `img` como render del slide en el carrusel; de lo contrario, se abre `img` por defecto.
- `Inn.jsx`: configurada la propiedad `link` en los slides de espacios comunes (`ESPACIOS_COMUNES_SLIDES`) para abrir las imágenes en alta resolución en Fancybox.

## [0.9.73] - 2026-09-16

### Refactor
- Unificación de botones con degradado dorado: creados `$lb-gradient-gold` y el mixin `@mixin btn-gold-base` en `variables.scss`, y expuestas las clases globales unificadas `.btn-gold` / `.btn-inn-gold` en `global.scss`.
- Removidas por completo las clases CSS redundantes `&__spaces-btn` de `_inn.scss` y `&__cta` de `_inn-team-agents.scss`.
- Limpiadas clases duplicadas en JSX (`ProjectFeatureSection.jsx` y `InnTeamAgents.jsx`), eliminando `lb-inn-proyecto__spaces-btn`, `lb-inn-team-agents__cta`, `rounded-pill` y `fw-bold` en favor de la clase unificada `btn-gold`.
- Reemplazados los gradientes lineales repetidos en tabs/filtros activos por la variable compartida `$lb-gradient-gold`.

## [0.9.72] - 2026-09-16

### Security
- Dependencias parchadas con `rtk npm audit fix`: resueltas 3 vulnerabilidades de severidad alta en subdependencias (`brace-expansion`, `js-yaml`, `nanoid`). 0 vulnerabilidades detectadas.

### Changed
- `App.jsx` & `global.scss`: asignado id fijo `#main-home` al contenedor principal del home y trasladado el fondo fijo (`/images/home/fondo.jpeg`) a `main#main-home` en lugar de la sección individual de proyecto del mes.
- `CTASection.jsx`: ancho de imagen ajustado con clase responsiva `w-md-75 mx-auto`.
- `_project-of-month.scss`: removido fondo duplicado para heredar el fondo unificado del home.

## [0.9.71] - 2026-09-16

### Fixed
- `CotizadorGeneral.jsx`: habilitada y conectada la sección de proyectos principales ("Main Projects") con los hooks `useSearchParams`, `useDynamicFilters` y `useFilteredGroups`, soportando filtrado por comuna, tipología y rango de precios UF, reseteo de filtros (`setSearchParams({})`), animaciones con `ScrollAnim`, y componentes de renderizado de tarjetas (`ProjectCard` y `ProjectCardSkeleton`).
- `CotizadorGeneral.jsx`: adaptado `useApiProjects` para exponer el estado completo `{ data, loading, error }`, permitiendo tanto la carga del cotizador general como los estados de carga y error en la grilla de proyectos.
- `Alternatives.jsx`: removida importación no utilizada de `Link` para cumplir con las reglas estrictas de linter (`max-warnings 0`).

## [0.9.70] - 2026-09-16

### Fixed
- `Cotizador.jsx`: incorporado `ResizeObserver` en `.container` (`containerRef`) para sincronizar dinámicamente y al píxel la altura de la columna hero `.lb-cot-hero-panel` (`heroPanelRef.current.style.height = container.offsetHeight`) ante cualquier cambio de estado, filtro o planta.
- `_proyecto-detalle.scss`: eliminado el `padding-top` y `padding-bottom` (ambos en `0`) en `.lb-cot-content-col` dentro de `.lb-proj-det-cotizador--has-hero` para evitar que la columna agregue desfase vertical respecto al `.container` interno, logrando igualdad exacta de altura entre la imagen y el cotizador.

## [0.9.69] - 2026-09-16

### Fixed
- `CotizadorGeneral.jsx`: habilitada la carga de miniaturas/mockups en `COTIZADOR_DATA.floorPlan` utilizando los datos de `getProjectBySlug('inn')?.cotizador?.floorPlan` al igual que en `/inn-test`, permitiendo visualizar los renders y fotografías del departamento en las miniaturas y galería del cotizador general.
- `Cotizador.jsx`: preservado `object-fit-contain` hardcodeado en la imagen principal y eliminadas expresiones dangling no utilizadas.

## [0.9.68] - 2026-09-16

### Fixed
- `_proyecto-detalle.scss`: sincronizada dinámicamente la altura de la columna `.lb-cot-hero-panel` con el contenido derecho (`.lb-cot-content-col`) mediante flexbox stretch (`height: auto`, `align-self: stretch`), eliminando la altura rígida fija (`73dvh`) y el margen desincronizado.
- `_proyecto-detalle.scss`: reubicado el espaciado de la navbar fija a `padding-top: 60px` en `.lb-proj-det-cotizador--has-hero` para que ambas columnas comiencen exactamente en la misma cota vertical, y ajustado el padding inferior de `.lb-cot-content-col` (`1rem`) para que la imagen termine alineada con los botones de acción (`.btn-outline-dark`).
- `Cotizador.jsx`: eliminado el margen inferior sobrante `mb-4` en la fila principal `#detalle-cot` (`mb-0`) cuando `hasHero` está activo.

## [0.9.67] - 2026-09-16

### Added
- `Cotizador.jsx`: agregado label semántico visible encima de cada dropdown de filtro (`.lb-proj-det-filter-label` dentro de `.lb-proj-det-filter-group`), tanto en modo universal (Comuna, Proyecto, Tipología, Orientación) como en modo detalle de proyecto (Tipología, Tipo de producto, Piso, Planta), preservando el texto por defecto / placeholder dentro del botón.
- `_proyecto-detalle.scss`: estilos para `.lb-proj-det-filter-group` y `.lb-proj-det-filter-label`, alineando los botones de filtros y badges al pie (`align-items-end`) y manteniendo distribución responsiva en móviles (grilla de 2 columnas).
- `_inn.scss`: color contextualizado `$inn-gold-dark` para `.lb-proj-det-filter-label` dentro de `.lb-inn-cot`.

## [0.9.66] - 2026-09-15

### Fixed
- `_utilities.scss`: añadido escalado automático global para paddings y márgenes estáticos grandes (`py-4`, `py-5`, `p-4`, `p-5`, `px-4`, `px-5`, `my-4`, `my-5`) en viewports móviles (<768px) cuando no tienen prefijos responsivos explícitos (`:not([class*='py-sm-'])`), evitando espacios verticales y horizontales muertos en teléfonos.
- `global.scss`: utilidades `.pt-6`, `.pt-7` y `.pt-8` adaptadas para escalar progresivamente (40% en mobile, 70% en tablet, 100% en desktop) y añadidas variantes por breakpoint (`.pt-md-*`, `.pt-lg-*`).
- `_inn.scss`: ajustado padding vertical de `.lb-inn-info` (1.5rem en mobile vs 5.5rem en desktop), `.lb-inn-360` (2rem en mobile vs 5.5rem en desktop) y `.lb-proj-det-alternatives` (2.25rem en mobile).
- `_proyecto-detalle.scss`: columna de cotizador `.lb-cot-content-col` optimizada con `padding-block: 2rem` y `padding-inline: 1rem` en pantallas móviles/tablets (`< lg`).
- `Inn.jsx`: padding de la galería de fotos adaptado responsivamente con `py-2 py-md-3`.

## [0.9.65] - 2026-09-15

### Fixed
- `ProjectFeatureSection.jsx`, `InteriorismoSection.jsx` & `Inn.jsx`: reemplazados paddings estáticos excesivos en móviles (`px-5`, `py-4`, `p-5`) por escalas responsivas (`px-3 px-md-5`, `py-3 py-md-4`, `p-3 p-md-4 p-lg-5`), aliviando el espacio vertical y horizontal en smartphones.
- `_inn.scss`: reducidos paddings y márgenes desproporcionados en móviles en `.lb-inn-info` (`padding: 2.25rem 0 1.5rem` vs 5.5rem en desktop; bordes divisores adaptados a separación horizontal), `.lb-inn-proyecto` (`padding-top: 2rem` vs 4.5rem; margen inferior de tarjeta reducido a 2.5rem en móvil vs 7rem en desktop).
- `Footer.jsx`: espaciado vertical y horizontal adaptado con `py-2 py-md-3 px-3 px-md-5`.

## [0.9.64] - 2026-09-15

### Fixed
- `src/components/sections/ProjectFeatureSection.jsx` & `_inn.scss`: optimizado el modal "Ver Detalles" (Espacios del proyecto) con scroll horizontal suave sin cortes en categorías y miniaturas (`.lb-inn-spaces-modal__tabs-scroll`, `.lb-inn-spaces-modal__thumbs-scroll`), scroll vertical garantizado para pantallas pequeñas, bloqueo de scroll en el body al abrir, cierre accesible con tecla Escape y flechas de navegación redimensionadas.

## [0.9.63] - 2026-09-15

### Fixed
- `src/pages/Inn.jsx` & `_inn.scss`: implementado nuevo selector compacto flotante para móvil (`.lb-inn-mobile-nav`) con dropdown elegante de 7 secciones sincronizado en tiempo real con scrollspy, reemplazando la barra recortada en móvil y preservando la botonera horizontal completa en desktop.
- `src/components/layout/Navbar.jsx`: ocultado logo secundario y separador en móviles (`d-none d-md-flex`) para despejar el header, e incorporadas las anclas de sección de `/inn-test` en el menú hamburguesa ("Navegación").
- `src/components/sections/ProjectFeatureSection.jsx` & `_inn.scss`: corregido margen negativo del carrusel en móvil (`margin-bottom: 0`, `-10rem` solo en desktop `lg`), botón "Ver Detalles" reposicionado en flujo natural (`position: relative`) con `z-index: 25` para evitar bloqueo por Fancybox o imágenes, y parallax del carrusel restringido a desktop (`min-width: 992px`).

## [0.9.62] - 2026-09-15

### Fixed
- `src/components/layout/Footer.jsx` & `_footer.scss`: adaptadas columnas a `col-12 col-md-*` en móvil, ocultada línea divisoria vertical en pantallas pequeñas (`d-none d-md-block`) y franja de copyright responsiva con apilamiento vertical.
- `src/pages/Inn.jsx` & `_inn.scss`: tabs del hero (`.lb-inn-hero-tabs`) optimizados para móvil con scroll horizontal suave sin scrollbar visible, paddings reducidos y `gap` responsivo.
- `src/components/sections/Recorridos360.jsx` & `_inn.scss`: ancho de tarjeta ajustado al 100% en móvil (eliminada compresión de `53dvw`) y gap de pills reducido a `gap-2 gap-md-4`.
- `src/components/proyecto/Cotizador.jsx` & `_proyecto-detalle.scss`: padding lateral `ps-0 ps-lg-5` en filtros, apilamiento de contenedor en `flex-column flex-lg-row` y ajuste en grilla de 2 columnas para dropdowns en móviles.
- `src/components/sections/InteriorismoSection.jsx` & `_inn.scss`: padding responsive `pt-4 pt-lg-8` y `px-3 px-md-5`, margen inferior de diseñadores en `2rem` en móvil (`-10rem` solo en desktop `lg`), altura responsive de tarjeta de diseñadores (`22rem` en móvil) y parallax GSAP restringido a desktop (`min-width: 992px`).
- `_navbar.scss`: ajustes de tamaño de logo y espaciados de navegación para pantallas móviles angostas.

## [0.9.61] - 2026-09-14

### Added
- `AGENTS.md`: incorporada la directiva mandatoria y regla operativa para utilizar la herramienta CLI `tgrep` en búsquedas rápidas e indexadas en el código (compatible con ripgrep).

### Changed
- `src/components/sections/ProjectFeatureSection.jsx`: ajuste de espaciado inferior (`mb-2`) en el contenedor de logos destacados (`lb-inn-proyecto__highlight`).

## [0.9.60] - 2026-09-14

### Added
- `src/components/proyecto/WindowPanViewer.jsx`: estado de alerta elegante cuando un departamento o piso no cuenta con registro visual disponible; agregada distinción visual con badge de advertencia cuando la vista es referencial del piso (ref. depto alternativo).

## [0.9.59] - 2026-09-14

### Added
- `src/components/proyecto/WindowPanViewer.jsx`: visor de vistas por piso tipo ventana con movimiento de paneo fluido mediante cursor del mouse en desktop y arrastre táctil (drag) fluido en mobile, mapeo inteligente de fotos por departamento (`public/images/inn/vistas`) y selector de ángulos cuando hay tomas múltiples.

### Changed
- `src/components/proyecto/Cotizador.jsx`: reemplazado el visor 3D Three.js en el modal "Vistas por piso" por `WindowPanViewer`, optimizando rendimiento, eliminando la carga de Three.js en el modal y mostrando la foto real del ventanal del departamento actual.

## [0.9.58] - 2026-09-14

### Added
- `src/pages/Inn.jsx`: agregado icono interactivo `MapPinIcon` con micro-animación hover (`hover(mapIconRef)`) y layout flexible al botón "Ver mapa ampliado"; eliminada referencia huérfana duplicada en el botón de imagen.

## [0.9.57] - 2026-09-11

### Fixed
- `_inn.scss`: corregido el estado hover en los items del modal de ubicación (`.lb-inn-map-modal__item`), unificándolo con el estilo active (fondo dorado translúcido con borde dorado) para eliminar el conflicto de texto blanco sobre fondo blanco proveniente de Bootstrap.

## [0.9.56] - 2026-09-11

### Added
- `src/pages/Inn.jsx`: modal de ubicación interactivo con 2 pestañas ("A pie" y "En vehículo") usando `nav-pills` de Bootstrap e iconos animados (`FootprintsIcon`, `CarIcon`), lista interactiva con distancias en km y galería a la derecha con máscara circular vinculada al punto activo.
- `src/components/icons/footprints.jsx`: icono animado de huellas/caminata con `motion/react`.
- `src/components/icons/car.jsx`: icono animado de vehículo con `motion/react`.
- `src/styles/components/_inn.scss`: estilos boutique dorados para tabs, lista interactiva y máscara circular del modal de ubicación.

## [0.9.55] - 2026-09-11

### Changed
- `CookieConsentModal`: añadido encabezado oscuro (`modal-header bg-dark`) con el logotipo de Leben (`images.logoIcon` + `images.logoText`), alineado con el diseño del modal de aviso (`AnnouncementModal`).

## [0.9.54] - 2026-09-09

### Added
- `src/pages/Inn.jsx`: agregadas las secciones `RelatedProjects` ("Plantas relacionadas") y `Alternatives` ("¿Buscas otras opciones?") inmediatamente después del Cotizador.
- `src/styles/components/_inn.scss`: incorporados estilos personalizados para `RelatedProjects` y `Alternatives` bajo el scope `.lb-inn`, adaptando tabla, tipografías y botones a la estética dorada y boutique de INN.

### Changed
- `src/pages/Inn.jsx`: conectada la acción "Cotizar" de la tabla de plantas relacionadas para seleccionar la planta en el Cotizador superior y realizar scroll suave hacia él.
- `src/components/proyecto/Cotizador.jsx`: habilitada la resolución de la planta activa a partir de `selection?.planta?.id` al actualizarse externamente la selección.

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
