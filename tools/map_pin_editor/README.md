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
2. Por defecto, carga automáticamente el mapa de INN (`public/images/inn/Mapa_PV.png`) y los pines actuales.

## Funcionalidades
- **Arrastre interactivo:** Haz clic y arrastra cualquier pin para moverlo. Las coordenadas `x%` e `y%` se recalculan en tiempo real.
- **Crear nuevos pines:** Haz doble clic en cualquier punto del mapa para crear un pin allí.
- **Pin de referencia:** Muestra la ubicación fija del proyecto principal (ej. INN en 40.0%, 68.1%).
- **Importar código:** Pega cualquier bloque existente `const LOCATION_POINTS = [...]` y el editor cargará todos los pines.
- **Copiar al portapapeles:** Genera el código JS exacto listo para pegar en tu componente React.
- **Guardar / Cargar sesión:** Permite guardar la lista de pines en un archivo JSON para continuar más tarde.
