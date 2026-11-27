# Plan de Mejora UX/UI Mobile — New Leben (React 19 + Bootstrap 5.3.3 + Sass)

> **Alcance:** Auditoría completa de todas las rutas (`/` Home, `/proyectos/:slug`, `/cotizador`, `/brokers`, `/invest`, `/login`, `/perfil`, páginas estáticas `/nosotros`, `/proceso-reserva-en-linea`, `/bases-legales`, `/trabaja-en-leben`, `/cookies`, `404`), componentes globales (`Navbar`, `Footer`, `ChatWidget`, `CookieConsentModal`, `AnnouncementModal`, `Turnstile`) y 21 parciales SCSS.
> **Criterios aplicados:** Bootstrap 5.3.3 primero (Ponytail: cero dependencias nuevas, soluciones centralizadas, desktop `>= 992px` intacto), Apple Human Interface Guidelines (`typography.md`, `accessibility.md`, `layout.md`, `color.md`, `designing-for-ios.md`) y Web Interface Guidelines.
> **Restricción de impacto:** Cambios acotados a `< 768px` (`sm`/`md`) o `< 992px` (`lg` en navegación/drawer) para mantener desktop (`>= 992px`) intacto.

---

## Decisiones aprobadas

- **Contraste dorado (`_inn.scss` / `_inn-team-agents.scss`):** Conservar el dorado/degradado de marca actual (`#d8b35c` / `$inn-gradient`) y usar texto oscuro (`#1a1a1a`) para cumplir WCAG AA (`>= 4.5:1`).
- **Alcance de ejecución inicial:** **Fase 1 + Fase 2** (Fases 3 y 4 documentadas para continuar después).
- **Estrategia de commits:** **1 commit por fase** (Conventional Commits), ejecutando al cierre de cada fase:
  1. `rtk npm run build:all`
  2. `rtk graphify update .`
  3. Bump de `version` en `package.json` + entrada sincronizada en `CHANGELOG.md`
  4. Commit dedicado de la fase.
- **CTA Navbar móvil (`M-29`, incluido en Fase 1):** Cambiar el enlace junto al menú hamburguesa en mobile de `"Invest"` a `"Cotizar"` (`/cotizador`). En `src/components/layout/Navbar.jsx:187`, reemplazar `mainLinks.slice(0, 1)` por selección del enlace `Cotizar` (`/cotizador`) en `mainLinks` con fallback `{ label: 'Cotizar', to: '/cotizador', featured: true }` (manteniendo `"Invest"` accesible dentro del `offcanvas` móvil).

### Skills de apoyo por fase
- **`/ponytail`:** Bootstrap 5.3.3 nativo primero, soluciones centralizadas, mínimo diff sin sobre-ingeniería ni dependencias nuevas.
- **`/apple-design`:** Validar cada fase contra Apple HIG (`typography.md`, `accessibility.md`, `layout.md`, `color.md`, `designing-for-ios.md`, `buttons.md`, `sheets.md`, `entering-data.md`) — áreas táctiles `>= 44×44px`, safe areas (`viewport-fit=cover` + `env()`), legibilidad `>= 12px` y contraste WCAG AA `>= 4.5:1`.
- **`/web-design-guidelines`:** Auditar los archivos modificados de cada fase contra Web Interface Guidelines (`file:line`) antes del cierre.
- **`/caveman-commit`:** Generar el mensaje de commit de cada fase en formato Conventional Commits conciso.

---

## 1. Diagnóstico general

Los **5 problemas mobile más graves** (más el CTA móvil del Navbar `M-29`) y su causa raíz en el código:

1. **Escala tipográfica desproporcionada + auto-zoom iOS Safari**
   - Aunque [global.scss](../../src/styles/global.scss#L12-L18) define `html { font-size: clamp(87.5%, 82% + 0.25vw, 100%) }` (14px en 320px), varias vistas lo anulan con clases desktop (`display-4` en [Invest.jsx](../../src/pages/Invest.jsx#L144), `display-5` y `fs-5` en cuerpo de texto en [StaticPage.jsx](../../src/pages/StaticPage.jsx#L74-L101), `display-5` en [CookiesPage.jsx](../../src/pages/CookiesPage.jsx#L56)), `clamp()` con mínimos altos (`2rem` en [_cotizador-general.scss](../../src/styles/components/_cotizador-general.scss#L79) y [_inn.scss](../../src/styles/components/_inn.scss#L106) con `font-weight: 100`), y [SplitTitle.jsx](../../src/components/SplitTitle.jsx#L24-L26) envuelve cada palabra en `inline-block` sin `overflow-wrap`. En paralelo, micro-textos caen a `5px–10.4px` (viola `typography.md › Ensuring legibility`: mínimo 11pt en iOS) e inputs `< 16px` (`13–15.2px` en [_perfil.scss](../../src/styles/components/_perfil.scss#L96), [_proyectos.scss](../../src/styles/components/_proyectos.scss#L350), [_static-page.scss](../../src/styles/components/_static-page.scss#L115)) disparan auto-zoom en iOS Safari.

2. **Quiebres críticos de layout y scroll horizontal (320–430px)**
   - **Bug SCSS crítico en [_perfil.scss](../../src/styles/components/_perfil.scss#L1157-L1185):** `@include bs.media-breakpoint-down(lg) { .lb-perfil { ... } }` está anidado **dentro** de `.lb-dashboard`, compilando como `.lb-dashboard .lb-perfil__sidebar` (selector imposible). El sidebar móvil jamás colapsa y `.lb-perfil__main` conserva `margin-left: 260px` en un teléfono de 320px.
   - **Turnstile desborda 320px:** [Turnstile.jsx](../../src/components/common/Turnstile.jsx#L77-L80) renderiza ancho fijo `300px` dentro de cards `p-4` (~248px útiles) en [Brokers.jsx](../../src/pages/Brokers.jsx#L480), [Invest.jsx](../../src/pages/Invest.jsx#L352) y [TrabajaForm.jsx](../../src/components/TrabajaForm.jsx#L512).
   - **Tablas/grids rígidos y `clamp()` invertidos:** [_brokers.scss](../../src/styles/components/_brokers.scss#L193) fija `grid-template-columns: 550px repeat(3, 1fr); min-width: 900px` (oculta las 3 columnas de categorías detrás de 550px); [_cotizador-general.scss](../../src/styles/components/_cotizador-general.scss#L13) tiene `clamp(24rem, 28vh, 22rem)` invertido (`min > max`); [_inn.scss](../../src/styles/components/_inn.scss#L577) tiene `clamp(34rem, 120dvh, 52dvh)` invertido; `100vh`/`70vh` en [_perfil.scss](../../src/styles/components/_perfil.scss#L10) y [WindowPanViewer.jsx](../../src/components/proyecto/WindowPanViewer.jsx#L237-L239) fallan en iOS Safari y landscape.

3. **Navegación móvil, CTA erróneo y modales recortados sin scroll**
   - [Navbar.jsx](../../src/components/layout/Navbar.jsx#L230-L275) mete 4 grupos de enlaces en `.dropdown-menu.overflow-hidden` en vez de Bootstrap `offcanvas`, recortando links en 320px y landscape. Además, `mainLinks.slice(0, 1)` ([Navbar.jsx](../../src/components/layout/Navbar.jsx#L187)) muestra `"Invest"` al lado del menú hamburguesa en lugar del CTA principal `"Cotizar"` (`/cotizador`) (`M-29`).
   - Los modales ([CotizadorForm.jsx](../../src/components/proyecto/CotizadorForm.jsx#L80), [CookieConsentModal.jsx](../../src/components/cookies/CookieConsentModal.jsx#L81), [Cotizador.jsx](../../src/components/proyecto/Cotizador.jsx#L1455), [ProjectTeamAgents.jsx](../../src/components/proyecto/ProjectTeamAgents.jsx#L210), [AnnouncementModal.jsx](../../src/components/announcement/AnnouncementModal.jsx#L75)) omiten `modal-fullscreen-sm-down` y `modal-dialog-scrollable`.

4. **Interacción táctil rota en iOS y áreas de toque < 44×44px**
   - Listeners exclusivos de `mousedown` ([Diferenciadores.jsx](../../src/components/sections/Diferenciadores.jsx#L23), [Cotizador.jsx](../../src/components/proyecto/Cotizador.jsx#L317), [BuscadorDepartamentos.jsx](../../src/components/cotizador/BuscadorDepartamentos.jsx#L73)) no cierran dropdowns al tap en iOS; `onClick` + `onPointerDown` duplican disparo en [ProyectoDetalle.jsx](../../src/pages/ProyectoDetalle.jsx#L1071-L1111); `:hover` sin `@media (hover: hover)` expande avatar a 180px aplastando texto en [_inn-team-agents.scss](../../src/styles/components/_inn-team-agents.scss#L51); tooltips Bootstrap se pegan tras tap; controles críticos miden `10px–34px` (`accessibility.md › Mobility`: 44×44pt en iOS).

5. **Accesibilidad (A11y), contraste WCAG AA y CLS en medios**
   - 7 botones solo-ícono y 3 switches sin `aria-label`/`<label htmlFor>`; contraste crítico `< 4.5:1` (blanco sobre dorado `#d8b35c` ~`1.9:1`, `#888`/`#999` sobre `#f5f2ed` ~`2.5–3.5:1`); `<img>` sin dimensiones y `<video>` sin `poster`; GSAP ([SplitTitle.jsx](../../src/components/SplitTitle.jsx#L115), [ScrollAnim.jsx](../../src/components/ScrollAnim.jsx#L42)) ignora `prefers-reduced-motion`.

---

## 2. Inventario de problemas

| ID | Vista / Componente | Problema | Causa | Severidad | Impacto UX | Esfuerzo |
|---|---|---|---|---|---|---|
| **M-01** | `Perfil.jsx` / [_perfil.scss](../../src/styles/components/_perfil.scss#L1157-L1185) | Sidebar móvil no colapsa; contenido desplazado 260px | Media query `< lg` anidado dentro de `.lb-dashboard` | **Crítica** | Portal `/perfil` roto en `< 992px` | S (15m) |
| **M-02** | [Turnstile.jsx](../../src/components/common/Turnstile.jsx#L77) (`Brokers`, `Invest`, `TrabajaForm`) | Widget 300px desborda horizontalmente en 320px | Falta `size: 'flexible'` en `turnstile.render()` | **Crítica** | Scroll horizontal y captcha cortado | S (15m) |
| **M-03** | [Navbar.jsx](../../src/components/layout/Navbar.jsx#L230-L275), [_navbar.scss](../../src/styles/components/_navbar.scss#L190-L201) | Menú móvil `.dropdown-menu.overflow-hidden` se corta sin scroll | Dropdown en vez de Bootstrap `offcanvas` | **Crítica** | Enlaces inferiores inalcanzables | M (2h) |
| **M-04** | [CotizadorForm.jsx](../../src/components/proyecto/CotizadorForm.jsx#L80), [Cotizador.jsx](../../src/components/proyecto/Cotizador.jsx#L1455), [CookieConsentModal.jsx](../../src/components/cookies/CookieConsentModal.jsx#L81), [ProjectTeamAgents.jsx](../../src/components/proyecto/ProjectTeamAgents.jsx#L210), [AnnouncementModal.jsx](../../src/components/announcement/AnnouncementModal.jsx#L75) | Modales largos cortados en portrait/landscape y con teclado móvil | Faltan `modal-fullscreen-sm-down`, `modal-dialog-scrollable`, `role="dialog"` | **Crítica** | Impide enviar cotización o cerrar modal | M (1.5h) |
| **M-05** | [Brokers.jsx](../../src/pages/Brokers.jsx#L273-L331), [_brokers.scss](../../src/styles/components/_brokers.scss#L193-L198) | Tabla de categorías oculta columnas tras 1ra col de 550px | `grid-template-columns: 550px repeat(3, 1fr); min-width: 900px` | **Crítica** | Solo se ven etiquetas en 320–430px | M (2h) |
| **M-06** | [WindowPanViewer.jsx](../../src/components/proyecto/WindowPanViewer.jsx#L187-L336) | Badges superiores se superponen (320–414px); `minHeight: 420px` corta landscape | Dos `position-absolute` enfrentados + `70vh`/`420px` | **Crítica** | Controles de vista tapados/ilegibles | S (45m) |
| **M-07** | Global tipografía ([StaticPage.jsx](../../src/pages/StaticPage.jsx#L74-L101), [Invest.jsx](../../src/pages/Invest.jsx#L144), [CookiesPage.jsx](../../src/pages/CookiesPage.jsx#L56), [_inn.scss](../../src/styles/components/_inn.scss#L106), [_cotizador-general.scss](../../src/styles/components/_cotizador-general.scss#L79)) | Títulos/cuerpo gigantes en mobile y micro-textos `< 12px` | `display-4/5/6`, `fs-5` en párrafos, `clamp(2rem,...)`, `font-weight: 100` | **Alta** | Proporciones rotas y lectura cansada | M (2h) |
| **M-08** | Inputs `< 16px` ([_perfil.scss](../../src/styles/components/_perfil.scss#L96), [_proyectos.scss](../../src/styles/components/_proyectos.scss#L350), [_static-page.scss](../../src/styles/components/_static-page.scss#L115)) | iOS Safari hace auto-zoom al enfocar inputs | `font-size: 13–15.2px` (`< 16px`) | **Alta** | Viewport descalibrado tras escribir | S (30m) |
| **M-09** | [Diferenciadores.jsx](../../src/components/sections/Diferenciadores.jsx#L23-L260), [Cotizador.jsx](../../src/components/proyecto/Cotizador.jsx#L317-L355), [BuscadorDepartamentos.jsx](../../src/components/cotizador/BuscadorDepartamentos.jsx#L73) | Dropdowns no cierran al tap en iOS, desbordan derecha en 320px, bug `elegid$as` | Solo `mousedown`, `minWidth: 190–270px` + `start-0`, `ms-4` sin `md`, literal `$` | **Alta** | Filtros atascados o cortados | M (1.5h) |
| **M-10** | [_inn-team-agents.scss](../../src/styles/components/_inn-team-agents.scss#L51-L274), [_static-page.scss](../../src/styles/components/_static-page.scss#L59) | Tap expande avatar a 180px aplastando card; email desborda; botón WA 30px | `:hover` sin `@media (hover: hover)`, falta `overflow-wrap: anywhere` | **Alta** | Cards de contacto rotas tras tap | S (45m) |
| **M-11** | [_cotizador-general.scss](../../src/styles/components/_cotizador-general.scss#L13), [_inn.scss](../../src/styles/components/_inn.scss#L577), [_perfil.scss](../../src/styles/components/_perfil.scss#L10), [_proyectos.scss](../../src/styles/components/_proyectos.scss#L115-L320) | `clamp()` invertidos (`min > max`), `100vh`, `background-attachment: fixed` | `clamp(24rem, 28vh, 22rem)`, `clamp(34rem, 120dvh, 52dvh)`, `vh` en iOS | **Alta** | Alturas bloqueadas y fondos rotos en iOS | S (45m) |
| **M-12** | [Testimonials.jsx](../../src/components/sections/Testimonials.jsx#L55-L71), [VideosSection.jsx](../../src/components/sections/VideosSection.jsx#L77-L122), [Brokers.jsx](../../src/pages/Brokers.jsx#L522-L540) | Overflow en banner BPTL, meta strip y flechas carrusel con margen negativo | Flex sin `flex-wrap`, `marginLeft/Right: -10px`, `.btn-group` en 320px | **Alta** | Recortes horizontales en 320px | S (1h) |
| **M-13** | [_proyecto-detalle.scss](../../src/styles/components/_proyecto-detalle.scss#L40-L880) | Tabs aplastadas, tabs 360 desbordan, 3 slides de 100px, `columns: 2` fija | Falta `flex-shrink: 0`, `overflow-x`, collapse a 1 col en `< md` | **Alta** | Detalle de proyecto denso y roto | M (2h) |
| **M-14** | [ProyectoDetalle.jsx](../../src/pages/ProyectoDetalle.jsx#L1069-L1125), [_inn.scss](../../src/styles/components/_inn.scss#L830-L1048) | Pines mapa disparan doble tap; labels `8.8px` chocan y desbordan | `onClick` + `onPointerDown`; `overflow: visible` + `nowrap` + pin `25px` | **Alta** | Mapa interactivo inutilizable en celular | M (1.5h) |
| **M-15** | [PerfilBroker.jsx](../../src/pages/PerfilBroker.jsx#L156-L482), [_perfil.scss](../../src/styles/components/_perfil.scss#L394-L548) | 3 tablas de 6 cols y notif dropdown (`320px`) desbordan; `minmax(250px)` | Falta `.table-responsive`, ancho fijo `320px`, grid > ancho interno 208px | **Alta** | Scroll horizontal en dashboard | S (1h) |
| **M-16** | [ChatWidget.jsx](../../src/components/ChatWidget.jsx#L66-L114), [_chat-widget.scss](../../src/styles/components/_chat-widget.scss#L3-L39), [_cookies.scss](../../src/styles/components/_cookies.scss#L15-L17), [index.html](../../index.html#L6) | Chat se corta con teclado/landscape; sin `safe-area-inset` iOS | Altura fija `20rem` + `bottom: 5.5rem`, falta `viewport-fit=cover` y `env()` | **Alta** | Chat cortado; FABs chocan con Home bar | S (1h) |
| **M-17** | Global controles (`Navbar`, `Footer`, `Brokers:573`, `Invest:412`, `Cotizador`, `_inn.scss:564,1787`, `_perfil.scss`) | Áreas táctiles `< 44×44px` (`10px`, `12.8px`, `25px`, `30px`, `32px`, `btn-sm`) | Sin mínimo 44px en mobile; `btn-sm` y `p-0` | **Alta** | Toques fallidos constantes | M (2.5h) |
| **M-18** | Formularios (`Invest`, `Brokers`, `CotizadorForm`, `TrabajaForm`, `Login`, `ProjectTeamAgents`) | Teclado subóptimo, sin autofill, labels sin `htmlFor`/`id` | Faltan `autoComplete`, `inputMode`, `htmlFor`/`id`, `is-invalid` | **Media** | Fricción alta y abandono de leads | M (2h) |
| **M-19** | [Footer.jsx](../../src/components/layout/Footer.jsx#L50-L188), [Login.jsx](../../src/pages/Login.jsx#L18), [Perfil.jsx](../../src/pages/Perfil.jsx#L19) | Tooltips pegados tras tap; links corporativos descentrados en `< md` | `useBsTooltips()` activo en touch; `ms-auto` en mobile | **Media** | Tooltips bloquean UI; footer torcido | S (45m) |
| **M-20** | [_proyecto-detalle.scss](../../src/styles/components/_proyecto-detalle.scss#L31), [_inn.scss](../../src/styles/components/_inn.scss#L216-L283) | Brecha/solape entre navbar móvil (~50px) y tabs sticky (`56px`/`72px`) | `top` hardcoded en vez de `--lb-nav-h` responsiva | **Media** | Salto visual al scrollear | S (30m) |
| **M-21** | `Perfil.jsx:42,93,98`, `ChatWidget.jsx:79,108`, `PerfilComprador.jsx:179`, `ProjectTeamAgents.jsx:214`, `CookieConsentModal.jsx:157-216` | Botones solo-ícono y switches sin nombre accesible | Faltan `aria-label` y `<label htmlFor>` | **Crítica** | Inaccesible en VoiceOver / TalkBack | S (45m) |
| **M-22** | `_inn.scss`, `_brokers.scss`, `_videos.scss`, `_proyecto-detalle.scss`, `_perfil.scss` | Contraste WCAG AA fallido: blanco/dorado (`1.9:1`), `#888`/`#999` en crema (`2.5–3.5:1`) | Tokens claros sobre fondos claros/dorados | **Alta** | Ilegible en exteriores / baja visión | M (2h) |
| **M-23** | `ProyectoDetalle.jsx:165-190`, `Cotizador.jsx:1279`, `Testimonials.jsx:67,81,126` | `<div role="button">` anidando `<a>` o sin `onKeyDown` | Falta `<button type="button">` semántico | **Media** | Falla Switch Control / teclado | S (1h) |
| **M-24** | `HeroShell.jsx`, `ProjectOfMonthSection.jsx`, `ProjectCard.jsx`, `Navbar.jsx`, `Footer.jsx`, `CTASection.jsx` | CLS por `<img>` sin dimensiones; `<video>` negro en iOS Low Power | Faltan `width`/`height` o `.ratio`; falta `poster` en `<video>` | **Media** | Saltos de layout en 4G; hero vacío | M (2h) |
| **M-25** | [SplitTitle.jsx](../../src/components/SplitTitle.jsx#L115), [ScrollAnim.jsx](../../src/components/ScrollAnim.jsx#L42), `_brokers.scss:557` | Ignoran `prefers-reduced-motion: reduce` | Sin check `matchMedia('(prefers-reduced-motion: reduce)')` | **Media** | Molestia vestibular / accesibilidad | S (45m) |
| **M-26** | [_invest.scss](../../src/styles/components/_invest.scss#L8-L10), `Brokers.jsx:376`, `Invest.jsx:526`, [_cookies.scss](../../src/styles/components/_cookies.scss#L8-L11) | Fuga global `.rounded-circle.bg-danger`; clases inexistentes (`border-start-lg`, `xs-small`); `touch-action: none` en `body` | Regla sin scope; scroll-lock agresivo bloquea modal cookies en iOS | **Media** | Colisiones BS5 y scroll trabado | S (30m) |
| **M-27** | [_utilities.scss](../../src/styles/components/_utilities.scss#L42-L80), `_project-of-month.scss:108`, `_not-found.scss:5`, `_videos.scss:11,18` | Paddings SCSS fijos (`5–6rem`) + mockup iPhone de `136px` en Home | Mezcla de utilidades escaladas y paddings rígidos | **Media** | Bloques muy altos o demasiado pequeños | M (1.5h) |
| **M-28** | `StaticPage.jsx:92`, `CookiesPage.jsx:112`, `PerfilComprador.jsx:55`, `ProjectsCatalog.jsx:118` | Emails sin `text-break`, WYSIWYG sin wrapper responsivo, `<select style={{width:'auto'}}>` | Falta `text-break` y `w-100 w-sm-auto` | **Baja** | Desbordes puntuales en 320px | S (30m) |
| **M-29** | [Navbar.jsx](../../src/components/layout/Navbar.jsx#L187) | CTA móvil junto al menú hamburguesa muestra `"Invest"` en vez de `"Cotizar"` | `mainLinks.slice(0, 1)` toma ciegamente el primer ítem de la API (`Invest`) | **Alta** | CTA principal oculto en mobile; lleva a inversores en vez de cotizar | S (15m) |

---

## 3. Plan por fases

> **Regla de cierre por fase:** Antes de cerrar cada fase, revisar cambios con `/apple-design` y `/web-design-guidelines`; luego ejecutar `rtk npm run build:all`, `rtk graphify update .`, actualizar `version` en `package.json` + `CHANGELOG.md` y crear **1 commit** dedicado (`/caveman-commit`).
> **Alcance inmediato aprobado:** **Fase 1 + Fase 2**.

### Fase 1: Correcciones críticas que rompen la experiencia *(Ejecución inmediata — Commit 1)*
- **Objetivos:** Eliminar 100% del scroll horizontal en 320–430px, reparar `/perfil`, migrar menú móvil a `offcanvas`, cambiar el link móvil junto a hamburguesa a `"Cotizar"` (`/cotizador`), hacer scrollables/fullscreen los modales en `< 576px` y corregir `aria-label` críticos.
- **Problemas:** `M-01`, `M-02`, `M-03`, `M-04`, `M-05`, `M-06`, `M-11`, `M-15`, `M-21`, `M-26`, `M-29`.
- **Archivos afectados:** `_perfil.scss`, `Turnstile.jsx`, `Navbar.jsx`, `_navbar.scss`, `CotizadorForm.jsx`, `Cotizador.jsx`, `CookieConsentModal.jsx`, `AnnouncementModal.jsx`, `ProjectTeamAgents.jsx`, `Brokers.jsx`, `_brokers.scss`, `WindowPanViewer.jsx`, `_cotizador-general.scss`, `_inn.scss`, `_proyectos.scss`, `_invest.scss`, `_cookies.scss`, `Perfil.jsx`, `PerfilBroker.jsx`, `PerfilComprador.jsx`, `ChatWidget.jsx`.
- **Riesgo de regresión desktop:** **Bajo.** Todos los cambios de layout usan `< lg` / `modal-fullscreen-sm-down` / `d-lg-none` dejando desktop `>= 992px` idéntico.
- **Criterios de aceptación:**
  - `document.documentElement.scrollWidth <= window.innerWidth` en todas las rutas de 320 a 430px (portrait y landscape).
  - `/perfil` abre/cierra drawer en `< 992px` y mantiene sidebar fija en `>= 992px`.
  - Navbar mobile muestra `"Cotizar"` (`/cotizador`) al lado de la hamburguesa y `"Invest"` queda accesible dentro del `offcanvas`.
  - Todos los modales son completables en 568×320px (iPhone SE landscape).
  - 0 botones solo-ícono o switches sin nombre accesible.

### Fase 2: Proporciones, tipografía y espaciado *(Ejecución inmediata — Commit 2)*
- **Objetivos:** Acotar escala tipográfica mobile sin tocar desktop, eliminar textos `< 12px`, subir inputs mobile a `>= 16px` (cero zoom iOS), alinear barras sticky con `--lb-nav-h` y normalizar paddings/wraps en secciones.
- **Problemas:** `M-07`, `M-08`, `M-12`, `M-13`, `M-20`, `M-27`, `M-28`.
- **Archivos afectados:** `variables.scss`, `global.scss`, `Invest.jsx`, `StaticPage.jsx`, `CookiesPage.jsx`, `Testimonials.jsx`, `VideosSection.jsx`, `Diferenciadores.jsx`, `ProjectsCatalog.jsx`, `_cotizador-general.scss`, `_inn.scss`, `_proyecto-detalle.scss`, `_videos.scss`, `_project-of-month.scss`, `_not-found.scss`, `_perfil.scss`, `_proyectos.scss`, `_static-page.scss`.
- **Riesgo de regresión desktop:** **Bajo.** Reglas encapsuladas en `@media (max-width: 767.98px)` y clases responsivas `p-3 p-md-4` / `py-4 py-md-5`.
- **Criterios de aceptación:**
  - `<h1>` mobile entre `24px` y `32px`; cuerpo `14–16px`; ningún texto legible `< 12px`.
  - Ningún input/select dispara zoom en iOS Safari (`computed font-size >= 16px`).
  - Barras sticky en `ProyectoDetalle` alineadas exactas bajo navbar móvil.

### Fase 3: Navegación, formularios e interacción táctil *(Siguiente paso — Commit 3)*
- **Objetivos:** Elevar todos los targets interactivos a `>= 44×44px`, corregir eventos touch en iOS (`pointerdown`, eliminar doble disparo, `@media (hover: hover)`), desactivar tooltips Bootstrap en touch, añadir `autoComplete`/`inputMode`/`htmlFor` y proteger `safe-area-inset`.
- **Problemas:** `M-09`, `M-10`, `M-14`, `M-16`, `M-17`, `M-18`, `M-19`, `M-23`.
- **Archivos afectados:** `index.html`, `useBsTooltips.js`, `_chat-widget.scss`, `_cookies.scss`, `Diferenciadores.jsx`, `Cotizador.jsx`, `BuscadorDepartamentos.jsx`, `ProyectoDetalle.jsx`, `_inn-team-agents.scss`, `_static-page.scss`, `_proyecto-detalle.scss`, `_inn.scss`, `Invest.jsx`, `Brokers.jsx`, `CotizadorForm.jsx`, `TrabajaForm.jsx`, `Login.jsx`, `ProjectTeamAgents.jsx`, `Footer.jsx`, `Testimonials.jsx`.
- **Riesgo de regresión desktop:** **Muy bajo.** `@media (hover: hover)` conserva intactos hovers y tooltips en desktop; `pointerdown` es transparente en mouse.
- **Criterios de aceptación:**
  - 100% controles táctiles `>= 44×44px` (o hit-area expandida) con separación `>= 8px`.
  - Dropdowns cierran al primer tap fuera en iOS Safari; sin tooltips pegados ni avatars expandidos en touch.
  - Teclados móviles correctos (`tel`, `email`, `numeric`) y autofill funcionando.

### Fase 4: Pulido, accesibilidad y performance percibida *(Paso final — Commit 4)*
- **Objetivos:** Cumplir contraste WCAG AA (`>= 4.5:1`) conservando el dorado de marca con texto oscuro `#1a1a1a`, respetar `prefers-reduced-motion: reduce` en GSAP/CSS y eliminar CLS de imágenes/videos.
- **Problemas:** `M-22`, `M-24`, `M-25`.
- **Archivos afectados:** `variables.scss`, `_inn.scss`, `_inn-team-agents.scss`, `_brokers.scss`, `_videos.scss`, `_proyecto-detalle.scss`, `_perfil.scss`, `SplitTitle.jsx`, `ScrollAnim.jsx`, `HeroShell.jsx`, `ProjectOfMonthSection.jsx`, `ProjectCard.jsx`, `Navbar.jsx`, `Footer.jsx`, `CTASection.jsx`.
- **Riesgo de regresión desktop:** **Bajo.** Mantiene el dorado `#d8b35c` / `$inn-gradient` con texto oscuro `#1a1a1a` (contraste > 8:1).
- **Criterios de aceptación:**
  - Lighthouse Mobile: Accessibility `>= 95`, CLS `< 0.1`, contraste AA verificado.
  - `prefers-reduced-motion: reduce` desactiva animaciones sin dejar elementos en `opacity: 0`.

---

## 4. Sistema de diseño mobile con Bootstrap 5.3.3

| Dimensión | Estándar Bootstrap 5.3.3 (Mobile → Desktop) | Cuándo y por qué usar SCSS propio |
|---|---|---|
| **Tipografía** | Hero H1: `h1` (`<= 2rem` en `< md`); Sección H2: `h2`/`fs-3`; Card H3: `fs-5 fw-bold`; Cuerpo: `fs-6 lh-base` (nunca `fs-5` en `< md`); Meta: `small` (`>= 12px`). Ancho lectura: `max-width: 65ch`. | BS 5.3.3 no trae `fs-md-*` por defecto y `.display-4/5/6` sigue siendo grande en 320px. **1 bloque `@media (max-width: 767.98px)` en `global.scss`** acota `.display-*`, `.lead` y fuerza `font-size: max(1rem, 16px)` en inputs (anti-zoom iOS). |
| **Espaciado** | Secciones: `py-4 py-md-5`. Cards/modales: `p-3 p-md-4`. Grids: `g-3 g-md-4`, `gap-2 gap-md-3`. Márgenes condicionales: `ms-0 ms-md-4`. | Solo en secciones con padding SCSS heredado (`_videos.scss`, `_brokers.scss`, `_not-found.scss`) reduciendo bajo `@include bs.media-breakpoint-down(md)`. |
| **Botones y área táctil** | Usar `.btn` estándar (evitar `.btn-sm` en CTAs mobile) + `py-2 px-3`. En formularios/modales: `w-100 w-sm-auto`. | BS 5 no tiene utilidad para hit-area invisible en dots/pines (`10–25px`): usar `::after { inset: -12px }` y `min-height: 44px; min-width: 44px` en `@media (pointer: coarse)`. |
| **Contenedores** | `.container` con `px-3 px-md-4`. Grids: `row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 g-md-4`. Evitar `w-50`/`w-75` sin `md`. | Ningún SCSS nuevo necesario. |
| **Breakpoints** | Base (`< 576px`: 320–430px portrait, 1 col, `modal-fullscreen-sm-down`, `w-100`); `sm` (`>= 576px`: landscape, botones en fila `w-sm-auto`); `md` (`>= 768px`: restaura tipografía y espaciados desktop); `lg` (`>= 992px`: navbar completa, sidebar `/perfil`, oculta `offcanvas`). | Reutilizar siempre `@include bs.media-breakpoint-down(md|lg)`. |
| **Componentes BS5** | `offcanvas offcanvas-end` (menú móvil), `modal-fullscreen-sm-down modal-dialog-scrollable` (modales), `table-responsive` (tablas), `ratio ratio-16x9` (iframes/videos), `accordion` (bloques largos). | Solo `env(safe-area-inset-*)` y `100dvh` en `ChatWidget` y `CookieSettingsTrigger` (BS 5 no provee utilidades para safe-area ni `dvh`). |

---

## 5. Correcciones concretas (Antes / Después)

### 1. Bug crítico sidebar `/perfil` (`M-01`) — [_perfil.scss](../../src/styles/components/_perfil.scss#L1150-L1186)
*(Bug de anidación SCSS; cerrar `.lb-dashboard` antes del media query.)*

```scss
// ANTES (anidado dentro de .lb-dashboard — nunca aplica)
  &__rank-num { font-weight: $lb-heading-weight; color: $lb-heading-color; line-height: 1; }
  @include bs.media-breakpoint-down(lg) {
    .lb-perfil { &__sidebar { transform: translateX(-100%); } &__main { margin-left: 0; } }
  }
}

// DESPUÉS (fuera de .lb-dashboard)
  &__rank-num { font-weight: $lb-heading-weight; color: $lb-heading-color; line-height: 1; }
}

@include bs.media-breakpoint-down(lg) {
  .lb-perfil {
    &__sidebar { transform: translateX(-100%); &.open { transform: translateX(0); } }
    &__sidebar-close, &__menu-btn { display: flex; min-width: 44px; min-height: 44px; align-items: center; justify-content: center; }
    &__main { margin-left: 0; }
    &__overlay.show { display: block; }
  }
}
```

### 2. Turnstile overflow en 320px (`M-02`) — [Turnstile.jsx](../../src/components/common/Turnstile.jsx#L77-L80)
*(1 línea nativa de Cloudflare; corrige `Brokers`, `Invest` y `TrabajaForm` de golpe.)*

```jsx
// ANTES
widgetIdRef.current = turnstile.render(containerRef.current, { sitekey: siteKey, theme, ... })

// DESPUÉS
widgetIdRef.current = turnstile.render(containerRef.current, { sitekey: siteKey, theme, size: 'flexible', ... })
```

### 3. Menú móvil → Bootstrap `offcanvas` (`M-03`) — [Navbar.jsx](../../src/components/layout/Navbar.jsx#L229-L275)
*(100% Bootstrap 5 nativo; desktop `>= lg` conserva `.dropdown` intacto.)*

```jsx
// ANTES
<div className="dropdown">
  <button className="btn btn-sm lb-hamburger dropdown-toggle" data-bs-toggle="dropdown" aria-label="Menu">...</button>
  <div className="dropdown-menu lb-dropdown end-0 rounded-3 shadow overflow-hidden">...</div>
</div>

// DESPUÉS
<button
  type="button"
  className="btn lb-hamburger d-lg-none"
  data-bs-toggle="offcanvas"
  data-bs-target="#lbMobileNav"
  aria-controls="lbMobileNav"
  aria-label="Abrir menú de navegación"
>
  <span className="lb-burger-line" />
  <span className="lb-burger-line" />
  <span className="lb-burger-line" />
</button>

<div className="offcanvas offcanvas-end" tabIndex="-1" id="lbMobileNav" aria-labelledby="lbMobileNavLabel">
  <div className="offcanvas-header border-bottom">
    <span id="lbMobileNavLabel" className="fw-bold">Menú</span>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar menú" />
  </div>
  <div className="offcanvas-body d-flex flex-column gap-2 py-3">
    {/* mainLinks (incluye Invest), menuLinks, menuGroups, pageLinks con py-2 y data-bs-dismiss="offcanvas" */}
  </div>
</div>

{/* Desktop (>= lg) intacto */}
<div className="dropdown d-none d-lg-block">...</div>
```

### 4. CTA móvil en Navbar: `Cotizar` en vez de `Invest` (`M-29`) — [Navbar.jsx](../../src/components/layout/Navbar.jsx#L186-L188)

```jsx
// ANTES (toma el primer link de la API, actualmente "Invest")
const mainLinks = apiMainLinks
const mainMobileLinks = useMemo(() => mainLinks.slice(0, 1), [mainLinks])

// DESPUÉS (prioriza "Cotizar" / /cotizador junto a la hamburguesa, con fallback seguro)
const mainLinks = apiMainLinks
const mainMobileLinks = useMemo(() => {
  const cotizar = mainLinks.find(
    (l) => l.to === '/cotizador' || /cotizar/i.test(l.label || '')
  )
  return [cotizar || { label: 'Cotizar', to: '/cotizador', featured: true }]
}, [mainLinks])
```

### 5. Modales scrollables y fullscreen en `< 576px` (`M-04`) — [CotizadorForm.jsx](../../src/components/proyecto/CotizadorForm.jsx#L79-L81) y [CookieConsentModal.jsx](../../src/components/cookies/CookieConsentModal.jsx#L81-L115)
*(100% clases Bootstrap 5 — cero SCSS nuevo.)*

```jsx
// ANTES (CotizadorForm.jsx)
<div className="modal d-block" tabIndex="-1" onClick={onClose}>
  <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>

// DESPUÉS
<div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="lb-cotizar-title" onClick={onClose}>
  <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
```

### 6. Tipografía mobile y anti-zoom iOS (`M-07`, `M-08`) — [StaticPage.jsx](../../src/pages/StaticPage.jsx#L92-L101) y [global.scss](../../src/styles/global.scss#L127-L139)

```jsx
// StaticPage.jsx — Bootstrap: cuerpo en fs-6 lh-base en lugar de fs-5
<p key={idx} className="fs-6 lh-base text-secondary mb-3" />
```

```scss
// global.scss — SCSS mínimo centralizado (BS 5 display-* no baja suficiente en 320px; iOS exige >= 16px en inputs)
@media (max-width: 767.98px) {
  .display-4 { font-size: 1.85rem; line-height: 1.15; }
  .display-5 { font-size: 1.65rem; line-height: 1.2; }
  .display-6 { font-size: 1.45rem; line-height: 1.2; }
  .lead { font-size: 1rem; line-height: 1.5; }

  input:not([type='checkbox']):not([type='radio']),
  select,
  textarea {
    font-size: max(1rem, 16px) !important;
  }
}
```

### 7. Tooltips touch + dropdowns iOS (`M-09`, `M-19`) — [useBsTooltips.js](../../src/hooks/useBsTooltips.js) y [Diferenciadores.jsx](../../src/components/sections/Diferenciadores.jsx#L23)

```js
// useBsTooltips.js — 1 línea evita tooltips pegados en Footer, Login y Perfil en dispositivos touch
if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return

// Diferenciadores.jsx:23, Cotizador.jsx:317, BuscadorDepartamentos.jsx:73
document.addEventListener('pointerdown', handleClickOutside) // reemplaza 'mousedown'
```

### 8. Safe area iOS + ChatWidget `dvh` (`M-16`) — [index.html](../../index.html#L6) y [_chat-widget.scss](../../src/styles/components/_chat-widget.scss#L3-L39)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

```scss
// _chat-widget.scss (Bootstrap no cubre env(safe-area-inset-*) ni dvh en diálogo fijo)
.lb-chat-bubble {
  bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
  right: calc(1rem + env(safe-area-inset-right, 0px));
}
.lb-chat-dialog {
  bottom: calc(5.25rem + env(safe-area-inset-bottom, 0px));
  right: calc(1rem + env(safe-area-inset-right, 0px));
  width: min(22.5rem, calc(100% - 2rem));
  max-height: calc(100dvh - 6.5rem - env(safe-area-inset-bottom, 0px));
}
.lb-chat-body {
  height: min(20rem, calc(100dvh - 15rem));
}
```

---

## 6. Checklist de validación mobile

- [ ] **Cero scroll horizontal:** En **320, 360, 375, 390, 414, 430 px** (portrait) y **568×320 / 667×375 / 844×390** (landscape), ejecutar `document.documentElement.scrollWidth <= window.innerWidth` === `true` en todas las rutas (`/`, `/proyectos/inn`, `/cotizador`, `/brokers`, `/invest`, `/login`, `/perfil`, `/nosotros`, `/trabaja-en-leben`, `/cookies`, `/404`).
- [ ] **Navbar móvil:** Link `"Cotizar"` (`/cotizador`) visible junto a hamburguesa en `< 992px`; `"Invest"` accesible dentro del `offcanvas`; `offcanvas` scrollea completo y cierra al navegar/`Escape`.
- [ ] **Tipografía:** `<h1>` <= 32px en 320–375px; ningún texto legible `< 12px`; cero desbordes en emails/URLs; cero auto-zoom en iOS Safari al enfocar inputs.
- [ ] **Modales e interacción táctil:** Modales scrollables con teclado abierto; controles `>= 44×44px`; dropdowns cierran al primer tap fuera en iOS; sin tooltips pegados ni hovers rotos tras tap; FABs respetan `safe-area-inset-bottom`.
- [ ] **A11y y performance:** Lighthouse Mobile Accessibility `>= 95`, contraste WCAG AA `>= 4.5:1` (dorado conservado con texto `#1a1a1a`), CLS `< 0.1`, `prefers-reduced-motion: reduce` respetado.
- [ ] **No-regresión desktop:** Comparar `1280×800` y `1440×900` en Home, `/proyectos/inn`, `/cotizador`, `/brokers`, `/invest` y `/perfil` confirmando layout y tipografía intactos.
- [ ] **Cierre técnico por fase:** `rtk npm run build:all` + `rtk graphify update .` + bump `package.json` + entrada `CHANGELOG.md` + `git commit`.
