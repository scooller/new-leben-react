# Editor de Pines de Mapa para React (Leben)

Aplicación de escritorio en Python para posicionar visualmente los pines sobre la imagen del mapa de cualquier proyecto y exportar el array `LOCATION_POINTS` listo para pegar en React (`src/pages/Inn.jsx`).

## Requisitos
- Python 3.10+ (ya incluye Tkinter en Windows)
- Pillow (`pip install -r requirements.txt`)

## Inicio Rápido
1. Haz doble clic en `run.bat` o ejecuta:
   ```bash
   python main.py
   ```
2. Por defecto, carga automáticamente el mapa de INN (`public/images/inn/Muestra-Mapa.jpg`) y los pines actuales desde `src/pages/Inn.jsx`.

## Funcionalidades
- **Pin principal del proyecto:**
  - Agregar o reactivar el pin principal con el botón `⭐ Pin Principal` en la barra superior o en el panel lateral.
  - Arrastrar interactivamente el pin principal sobre el mapa para ajustar su posición `left: X%`, `top: Y%` en tiempo real.
  - Clic derecho en cualquier área del mapa para "⭐ Colocar Pin Principal aquí" (o Shift + doble clic).
  - Panel dedicado en la barra lateral para editar el nombre, ajustar coordenadas X/Y con precisión y copiar el snippet JSX del pin (`<div className="lb-inn-map__pin-inn ...">`).
  - Sincronización directa: al guardar en `Inn.jsx`, actualiza automáticamente tanto `LOCATION_POINTS` como el estilo `left/top` del pin principal.
- **Selector de color de fondo del lienzo:**
  - Menú desplegable con preajustes rápidos: Oscuro (`#131418`), Grafito (`#22252c`), Gris (`#3e4451`), Claro (`#dbe0e8`) y Blanco (`#ffffff`).
  - Muestra de color (swatch) interactiva con diálogo `colorchooser` para elegir cualquier color personalizado.
  - Submenú en clic derecho sobre el mapa para cambiar el color de fondo rápidamente.
  - Facilita contrastar planos transparentes, mapas oscuros o mapas claros con alto contraste.
- **Puntos de interés (LOCATION_POINTS):**
  - **Arrastre interactivo sin delay:** Arrastre a 60+ FPS con renderizado optimizado por capas. Las coordenadas `x%` e `y%` se recalculan en tiempo real.
  - **Crear nuevos pines:** Haz doble clic en cualquier punto del mapa o usa clic derecho -> "➕ Agregar Punto de Interés aquí".
  - **Imagen por defecto automática (`nuevo.jpg`):** Cada nuevo punto se inicializa con `images/inn/ubicacion/nuevo.jpg`. Si la imagen no existe en disco, el editor la genera automáticamente (1200x675) para evitar pantallas rotas o errores 404 en React. Al guardar, también garantiza que cualquier ruta de imagen faltante sea auto-generada.
  - **Importar código:** Pega cualquier bloque existente `const LOCATION_POINTS = [...]` y el editor cargará todos los pines.
  - **Copiar al portapapeles:** Genera el código JS exacto listo para pegar en tu componente React.
  - **Guardar directamente:** Actualiza el archivo JSX con un solo clic.
