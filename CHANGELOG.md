# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Navegación de "Espacios comunes" (INN) vinculada al carrusel: cada item del nav tiene `id`, cada slide un `navId`, y al hacer click el carrusel salta a la galería del espacio seleccionado.

### Changed
- Modal "Conoce los espacios" rediseñado para soportar múltiples galerías con navegación anidada, textos de progreso y estado activo.
- Botón de cierre en modal movido a la esquina superior derecha y modificado estado hover a `var(--bs-danger)`.
- Sección "Espacios" del INN ahora usa su propio estado de slide (`activeEspacioSlide`) en vez de compartirlo con "Departamentos".

### Fixed
- Corregido tag malformado `</ br>` en el título "ESPACIOS COMUNES" (`Inn.jsx`) que rompía la compilación.
- Corregidas keys duplicadas de React en carruseles con imágenes repetidas (slides de `ProjectFeatureSection` y galería b/n del INN ahora usan key por índice).

### Removed
- Eliminado `EQUIPMENT_NAV_ITEMS` sin uso en `Inn.jsx`.
