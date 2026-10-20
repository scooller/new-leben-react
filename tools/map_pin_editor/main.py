"""
Map Pin Editor - Leben
Herramienta visual para colocar pines sobre imagenes de mapas y sincronizar
el array LOCATION_POINTS y la imagen MAP directamente con React (Inn.jsx u otros).
"""

import os
import re
import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, colorchooser
from PIL import Image, ImageTk

# Rutas del proyecto
PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_PAGE_JSX = os.path.normpath(os.path.join(PROJECT_ROOT, "src", "pages", "Inn.jsx"))
PUBLIC_DIR = os.path.normpath(os.path.join(PROJECT_ROOT, "public"))
DEFAULT_NEW_POINT_IMG = "images/inn/ubicacion/nuevo.jpg"


def ensure_default_point_image():
    """
    Garantiza que exista la imagen por defecto para puntos nuevos (public/images/inn/ubicacion/nuevo.jpg).
    Si no existe en disco, crea un archivo placeholder de alta resolución (1200x675) para evitar errores 404.
    """
    target_abs = os.path.normpath(os.path.join(PUBLIC_DIR, DEFAULT_NEW_POINT_IMG.replace("/", os.sep)))
    if os.path.exists(target_abs):
        return True

    try:
        os.makedirs(os.path.dirname(target_abs), exist_ok=True)
        img = Image.new("RGB", (1200, 675), color=(30, 34, 42))
        img.save(target_abs, "JPEG", quality=90, optimize=True)
        return True
    except Exception as e:
        print(f"Error creando imagen por defecto {target_abs}: {e}")
        return False


# Fallbacks por defecto si no se encuentra el archivo JSX
FALLBACK_MAP_REL = "images/inn/Muestra-Mapa.jpg"
FALLBACK_POINTS = [
    {"id": 1, "name": "Mesa Tropera", "label": "MESA TROPERA", "distance": "1.2 km", "category": "Gastronomía", "time": "12 minutos", "img": "images/inn/ubicacion/Mesa_Tropera_AI.jpg", "x": 10.7, "y": 49.9},
    {"id": 2, "name": "Jumbo", "label": "JUMBO", "distance": "1.5 km", "category": "Supermercado", "time": "15 minutos", "img": "images/inn/ubicacion/Supermercado_Jumbo_AI.jpg", "x": 85.3, "y": 66.4},
    {"id": 3, "name": "Casino Dreams", "label": "CASINO DREAMS", "distance": "2.3 km", "category": "Entretenimiento", "time": "22 minutos", "img": "images/inn/ubicacion/Casino_Dreams_01_IA.jpg", "x": 15.7, "y": 54.7},
    {"id": 4, "name": "Cassis", "label": "CASSIS", "distance": "2.5 km", "category": "Cafetería", "time": "25 minutos", "img": "images/inn/ubicacion/Cassis_IA.jpg", "x": 14.7, "y": 51.3},
    {"id": 5, "name": "Mall Paseo", "label": "MALL", "distance": "3.1 km", "category": "Comercio", "time": "30 minutos", "img": "images/inn/ubicacion/Paseo_Puerto_Varas_AI.jpg", "x": 5.1, "y": 52.6},
    {"id": 6, "name": "La Olla", "label": "LA OLLA", "distance": "3.8 km", "category": "Gastronomía", "time": "20 minutos", "img": "images/inn/ubicacion/La Olla_IA.jpg", "x": 79.3, "y": 81.1},
]

# Estilos visuales acordes a Leben / INN
COLOR_BG = "#1e1e24"
COLOR_SIDEBAR = "#252830"
COLOR_PANEL_HEADER = "#2f333e"
COLOR_GOLD = "#d4af37"
COLOR_GOLD_HOVER = "#f2cb4d"
COLOR_DOT_DEFAULT = "#73777d"
COLOR_TEXT = "#ffffff"
COLOR_MUTED = "#9ba3af"
COLOR_BORDER = "#3a3f4d"


def parse_jsx_file(jsx_path):
    """
    Lee un archivo JSX y extrae:
    1. La propiedad `image` del objeto MAP (ej. 'images/inn/Mapa_Ok_Sitio.png')
    2. Las coordenadas del pin de referencia del proyecto
    3. El array LOCATION_POINTS
    """
    if not os.path.exists(jsx_path):
        return None

    try:
        with open(jsx_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error leyendo {jsx_path}: {e}")
        return None

    # 1. Extraer imagen desde MAP
    image_rel = None
    map_match = re.search(r"const\s+MAP\s*=\s*\{([\s\S]*?)\n\}", content)
    if map_match:
        img_match = re.search(r"\bimage\s*:\s*['\"]([^'\"]+)['\"]", map_match.group(1))
        if img_match:
            image_rel = img_match.group(1).strip()

    if not image_rel:
        # Fallback genérico si el formato varía
        img_match = re.search(r"\bimage\s*:\s*['\"](images/[^'\"]+)['\"]", content)
        if img_match:
            image_rel = img_match.group(1).strip()

    # 2. Extraer pin de referencia del proyecto
    ref_pin = {"name": "PROYECTO INN", "x": 40.0, "y": 68.1, "enabled": False}
    ref_match = re.search(
        r"(?:lb-[\w-]+-map__pin-(?:inn|project|main)|pin-inn)[\s\S]*?style=\{\{\s*left:\s*['\"]([0-9.]+)%['\"],\s*top:\s*['\"]([0-9.]+)%['\"]",
        content,
    )
    if ref_match:
        try:
            ref_pin["x"] = round(float(ref_match.group(1)), 1)
            ref_pin["y"] = round(float(ref_match.group(2)), 1)
            ref_pin["enabled"] = True
        except ValueError:
            pass
        title_match = re.search(r'title=["\']([^"\']+)["\']', ref_match.group(0)) or re.search(r'alt=["\']([^"\']+)["\']', ref_match.group(0))
        if title_match:
            clean_title = title_match.group(1).split(" - ")[0].strip()
            if clean_title:
                ref_pin["name"] = clean_title
    elif "pin-inn" in content:
        ref_pin["enabled"] = True

    # 3. Extraer array LOCATION_POINTS
    points = []
    points_match = re.search(r"const\s+LOCATION_POINTS\s*=\s*\[([\s\S]*?)\]\s*(?:;|\n\n|const|export)", content)
    if points_match:
        obj_matches = re.findall(r"\{([^}]+)\}", points_match.group(1))
        for obj_str in obj_matches:
            item = {}
            for key in ["id", "name", "label", "distance", "category", "time", "img", "x", "y"]:
                m = re.search(rf"\b{key}\s*:\s*(?:'([^']*)'|\"([^\"]*)\"|([0-9.]+))", obj_str)
                if m:
                    val = m.group(1) or m.group(2) or m.group(3)
                    if key == "id":
                        try:
                            item[key] = int(val)
                        except ValueError:
                            item[key] = val
                    elif key in ["x", "y"]:
                        try:
                            item[key] = round(float(val), 1)
                        except ValueError:
                            item[key] = 0.0
                    else:
                        item[key] = val
            if "x" in item and "y" in item:
                points.append(item)

    return {
        "image_rel": image_rel,
        "ref_pin": ref_pin,
        "points": points,
    }


class MapPinEditorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Editor de Pines de Mapa — Leben")
        self.root.geometry("1420x880")
        self.root.minsize(1050, 680)
        self.root.configure(bg=COLOR_BG)

        # Estado del documento JSX actual
        self.current_jsx_path = DEFAULT_PAGE_JSX if os.path.exists(DEFAULT_PAGE_JSX) else ""
        self.current_map_rel = ""
        self.map_image_path = ""
        self.pil_original_image = None
        self.tk_image = None
        self._cached_image_size = None
        self.img_rect = (0, 0, 1, 1)  # (offset_x, offset_y, rendered_w, rendered_h)

        # Estado de pines
        self.points = []
        self.selected_index = -1
        self.dragging_index = -1
        self.show_reference_pin = tk.BooleanVar(value=True)
        self.reference_pin = {"name": "PROYECTO INN", "x": 40.0, "y": 68.1, "enabled": True}
        self.is_ref_selected = False
        self.dragging_reference = False

        self.ref_name_var = tk.StringVar(value=self.reference_pin["name"])
        self.ref_x_var = tk.DoubleVar(value=self.reference_pin["x"])
        self.ref_y_var = tk.DoubleVar(value=self.reference_pin["y"])

        # Color de fondo del lienzo
        self.canvas_bg_color = "#131418"
        self.bg_presets = {
            "Oscuro": "#131418",
            "Grafito": "#22252c",
            "Gris": "#3e4451",
            "Claro": "#dbe0e8",
            "Blanco": "#ffffff",
        }

        self._configure_styles()
        self._build_ui()

        # Cargar inicialmente desde Inn.jsx
        if self.current_jsx_path:
            self._load_from_jsx(self.current_jsx_path)
        else:
            self.points = [dict(p) for p in FALLBACK_POINTS]
            self.selected_index = 0
            self._sync_ref_vars()
            self._update_all_views()
            self.status_var.set("Modo offline: Usa los botones de la barra superior para cargar un archivo JSX.")

    def _configure_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure(".", background=COLOR_BG, foreground=COLOR_TEXT, font=("Segoe UI", 9))
        style.configure("TFrame", background=COLOR_BG)
        style.configure("Sidebar.TFrame", background=COLOR_SIDEBAR)
        style.configure("TLabel", background=COLOR_SIDEBAR, foreground=COLOR_TEXT, font=("Segoe UI", 9))
        style.configure("Header.TLabel", background=COLOR_SIDEBAR, foreground=COLOR_GOLD, font=("Segoe UI", 11, "bold"))
        style.configure("Muted.TLabel", background=COLOR_SIDEBAR, foreground=COLOR_MUTED, font=("Segoe UI", 8))

    def _build_ui(self):
        # 1. Barra de herramientas superior
        toolbar = tk.Frame(self.root, bg=COLOR_PANEL_HEADER, height=50, padx=12, pady=6)
        toolbar.pack(side=tk.TOP, fill=tk.X)

        # Botón de sincronización con Inn.jsx
        btn_sync = tk.Button(
            toolbar, text="🔄 Sincronizar Inn.jsx", bg=COLOR_GOLD, fg="#1a1a1a",
            activebackground=COLOR_GOLD_HOVER, activeforeground="#000", relief=tk.FLAT,
            font=("Segoe UI", 9, "bold"), padx=12, pady=4, cursor="hand2",
            command=self.on_reload_default_jsx
        )
        btn_sync.pack(side=tk.LEFT, padx=(0, 6))

        btn_open_jsx = tk.Button(
            toolbar, text="📄 Cargar otro JSX...", bg="#3d4452", fg="#fff",
            activebackground="#4d5566", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9), padx=10, pady=4, cursor="hand2",
            command=self.on_open_jsx_file
        )
        btn_open_jsx.pack(side=tk.LEFT, padx=6)

        btn_open_img = tk.Button(
            toolbar, text="📁 Cargar Imagen suelta...", bg="#3d4452", fg="#fff",
            activebackground="#4d5566", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9), padx=10, pady=4, cursor="hand2",
            command=self.on_open_image_file
        )
        btn_open_img.pack(side=tk.LEFT, padx=6)

        # Botón para agregar o seleccionar Pin Principal
        btn_add_ref_tool = tk.Button(
            toolbar, text="⭐ Pin Principal", bg="#423516", fg=COLOR_GOLD_HOVER,
            activebackground="#594820", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9, "bold"), padx=10, pady=4, cursor="hand2",
            command=self.on_add_or_select_reference_pin
        )
        btn_add_ref_tool.pack(side=tk.LEFT, padx=6)

        chk_ref = tk.Checkbutton(
            toolbar, text="Mostrar Pin Principal", variable=self.show_reference_pin,
            bg=COLOR_PANEL_HEADER, fg="#e0e0e0", selectcolor="#1c2128",
            activebackground=COLOR_PANEL_HEADER, activeforeground="#fff",
            font=("Segoe UI", 9), command=self.on_toggle_reference_pin
        )
        chk_ref.pack(side=tk.LEFT, padx=6)

        # Selector de color de fondo del lienzo
        sep_bg = tk.Frame(toolbar, width=1, height=22, bg=COLOR_BORDER)
        sep_bg.pack(side=tk.LEFT, padx=(6, 8))

        tk.Label(toolbar, text="🎨 Fondo:", bg=COLOR_PANEL_HEADER, fg="#e0e0e0", font=("Segoe UI", 9)).pack(side=tk.LEFT, padx=(0, 4))

        self.bg_combo_var = tk.StringVar(value="Oscuro")
        self.bg_combo = ttk.Combobox(
            toolbar, textvariable=self.bg_combo_var,
            values=list(self.bg_presets.keys()) + ["Personalizado..."],
            state="readonly", width=11, font=("Segoe UI", 9)
        )
        self.bg_combo.pack(side=tk.LEFT, padx=(0, 4))
        self.bg_combo.bind("<<ComboboxSelected>>", self.on_bg_preset_selected)

        self.btn_bg_swatch = tk.Button(
            toolbar, text="  ", bg=self.canvas_bg_color, activebackground=self.canvas_bg_color,
            relief=tk.SOLID, bd=1, width=2, cursor="hand2", command=self.on_choose_custom_bg_color
        )
        self.btn_bg_swatch.pack(side=tk.LEFT, padx=(0, 6))

        # Acciones de exportación
        btn_copy = tk.Button(
            toolbar, text="📋 Copiar LOCATION_POINTS (JS)", bg=COLOR_GOLD, fg="#1a1a1a",
            activebackground=COLOR_GOLD_HOVER, activeforeground="#000", relief=tk.FLAT,
            font=("Segoe UI", 9, "bold"), padx=12, pady=4, cursor="hand2",
            command=self.on_copy_code
        )
        btn_copy.pack(side=tk.RIGHT, padx=4)

        btn_copy_ref = tk.Button(
            toolbar, text="⭐ Copiar JSX Pin Principal", bg="#3d3725", fg=COLOR_GOLD,
            activebackground="#50472d", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9), padx=10, pady=4, cursor="hand2",
            command=self.on_copy_reference_pin_jsx
        )
        btn_copy_ref.pack(side=tk.RIGHT, padx=4)

        btn_save_to_jsx = tk.Button(
            toolbar, text="💾 Guardar en Inn.jsx", bg="#2e5d32", fg="#e8f5e9",
            activebackground="#388e3c", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9, "bold"), padx=10, pady=4, cursor="hand2",
            command=self.on_save_directly_to_jsx
        )
        btn_save_to_jsx.pack(side=tk.RIGHT, padx=4)

        btn_import = tk.Button(
            toolbar, text="📥 Pegar Código...", bg="#3d4452", fg="#fff",
            activebackground="#4d5566", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9), padx=10, pady=4, cursor="hand2",
            command=self.on_import_code_dialog
        )
        btn_import.pack(side=tk.RIGHT, padx=4)

        # 2. Barra de estado inferior
        self.status_var = tk.StringVar(value="Iniciando...")
        status_bar = tk.Frame(self.root, bg=COLOR_PANEL_HEADER, height=26, padx=12, pady=4)
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        lbl_status = tk.Label(status_bar, textvariable=self.status_var, bg=COLOR_PANEL_HEADER, fg=COLOR_MUTED, font=("Segoe UI", 8))
        lbl_status.pack(side=tk.LEFT)

        # 3. Contenedor principal dividido
        paned = tk.PanedWindow(self.root, orient=tk.HORIZONTAL, bg=COLOR_BORDER, sashwidth=4)
        paned.pack(fill=tk.BOTH, expand=True)

        # Canvas a la izquierda
        self.canvas_frame = tk.Frame(paned, bg=self.canvas_bg_color)
        paned.add(self.canvas_frame, stretch="always", minsize=600)

        # Indicador de origen e imagen cargada
        self.source_indicator_var = tk.StringVar(value="")
        lbl_source = tk.Label(
            self.canvas_frame, textvariable=self.source_indicator_var,
            bg="#16181d", fg="#b0b8c4", font=("Segoe UI", 8), pady=4, padx=10, anchor="w"
        )
        lbl_source.pack(side=tk.TOP, fill=tk.X)

        self.canvas = tk.Canvas(self.canvas_frame, bg=self.canvas_bg_color, highlightthickness=0, cursor="crosshair")
        self.canvas.pack(fill=tk.BOTH, expand=True)

        self.canvas.bind("<Configure>", self.on_canvas_resize)
        self.canvas.bind("<ButtonPress-1>", self.on_canvas_press)
        self.canvas.bind("<B1-Motion>", self.on_canvas_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_canvas_release)
        self.canvas.bind("<Double-Button-1>", self.on_canvas_double_click)
        self.canvas.bind("<Button-3>", self.on_canvas_right_click)

        # Sidebar a la derecha
        sidebar = tk.Frame(paned, bg=COLOR_SIDEBAR, width=440, padx=12, pady=10)
        paned.add(sidebar, stretch="never", minsize=390)

        # Panel Pin Principal del Proyecto
        ref_frame = tk.LabelFrame(
            sidebar, text=" ⭐ Pin Principal del Proyecto ", bg="#1f232d", fg=COLOR_GOLD,
            font=("Segoe UI", 9, "bold"), padx=10, pady=8, relief=tk.GROOVE
        )
        ref_frame.pack(fill=tk.X, pady=(0, 10))

        ref_top = tk.Frame(ref_frame, bg="#1f232d")
        ref_top.pack(fill=tk.X, pady=(0, 6))

        self.btn_add_ref = tk.Button(
            ref_top, text="➕ Agregar / Seleccionar", bg="#3a3219", fg=COLOR_GOLD_HOVER,
            activebackground="#4d4323", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 8, "bold"), padx=6, pady=2, cursor="hand2",
            command=self.on_add_or_select_reference_pin
        )
        self.btn_add_ref.pack(side=tk.LEFT, padx=(0, 4))

        self.btn_del_ref = tk.Button(
            ref_top, text="🗑️ Quitar", bg="#4a2527", fg="#ffb4b4",
            activebackground="#5e2e30", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 8), padx=6, pady=2, cursor="hand2",
            command=self.on_remove_reference_pin
        )
        self.btn_del_ref.pack(side=tk.LEFT, padx=4)

        btn_copy_jsx_ref = tk.Button(
            ref_top, text="📋 Copiar JSX", bg="#2a303d", fg="#b0b8c4",
            activebackground="#3a4254", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 8), padx=6, pady=2, cursor="hand2",
            command=self.on_copy_reference_pin_jsx
        )
        btn_copy_jsx_ref.pack(side=tk.RIGHT)

        ref_name_row = tk.Frame(ref_frame, bg="#1f232d")
        ref_name_row.pack(fill=tk.X, pady=(0, 4))
        tk.Label(ref_name_row, text="Nombre:", bg="#1f232d", fg=COLOR_MUTED, font=("Segoe UI", 8, "bold")).pack(side=tk.LEFT)
        ent_ref_name = tk.Entry(
            ref_name_row, textvariable=self.ref_name_var, bg="#171920", fg="#ffffff",
            insertbackground="#ffffff", relief=tk.FLAT, font=("Segoe UI", 9)
        )
        ent_ref_name.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(6, 0))
        ent_ref_name.bind("<KeyRelease>", self.on_ref_field_changed)

        ref_coord_row = tk.Frame(ref_frame, bg="#1f232d")
        ref_coord_row.pack(fill=tk.X)

        tk.Label(ref_coord_row, text="X (%):", bg="#1f232d", fg="#e0e0e0", font=("Segoe UI", 8)).pack(side=tk.LEFT)
        spin_ref_x = tk.Spinbox(
            ref_coord_row, from_=0.0, to=100.0, increment=0.1, textvariable=self.ref_x_var,
            width=6, bg="#272a34", fg="#fff", relief=tk.FLAT, command=self.on_ref_spin_changed
        )
        spin_ref_x.pack(side=tk.LEFT, padx=(4, 8))
        spin_ref_x.bind("<KeyRelease>", self.on_ref_spin_changed)

        tk.Label(ref_coord_row, text="Y (%):", bg="#1f232d", fg="#e0e0e0", font=("Segoe UI", 8)).pack(side=tk.LEFT)
        spin_ref_y = tk.Spinbox(
            ref_coord_row, from_=0.0, to=100.0, increment=0.1, textvariable=self.ref_y_var,
            width=6, bg="#272a34", fg="#fff", relief=tk.FLAT, command=self.on_ref_spin_changed
        )
        spin_ref_y.pack(side=tk.LEFT, padx=(4, 8))
        spin_ref_y.bind("<KeyRelease>", self.on_ref_spin_changed)

        self.ref_status_lbl = tk.Label(ref_coord_row, text="", bg="#1f232d", fg=COLOR_GOLD, font=("Segoe UI", 8))
        self.ref_status_lbl.pack(side=tk.LEFT)

        lbl_side_title = ttk.Label(sidebar, text="Puntos de Interés (LOCATION_POINTS)", style="Header.TLabel")
        lbl_side_title.pack(anchor="w", pady=(0, 6))

        # Lista de pines
        list_frame = tk.Frame(sidebar, bg=COLOR_SIDEBAR)
        list_frame.pack(fill=tk.X, pady=(0, 8))

        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.pins_listbox = tk.Listbox(
            list_frame, height=7, bg="#1c1e24", fg="#ffffff",
            selectbackground=COLOR_GOLD, selectforeground="#000000",
            relief=tk.FLAT, font=("Segoe UI", 9), yscrollcommand=scrollbar.set
        )
        self.pins_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.pins_listbox.yview)
        self.pins_listbox.bind("<<ListboxSelect>>", self.on_listbox_select)

        # Botones lista
        btn_row = tk.Frame(sidebar, bg=COLOR_SIDEBAR)
        btn_row.pack(fill=tk.X, pady=(0, 10))

        btn_add = tk.Button(
            btn_row, text="➕ Nuevo Pin", bg="#333947", fg="#fff",
            activebackground="#444c5e", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9), padx=8, pady=3, command=self.on_add_new_pin
        )
        btn_add.pack(side=tk.LEFT, padx=(0, 4))

        btn_del = tk.Button(
            btn_row, text="🗑️ Eliminar Pin", bg="#4a2527", fg="#ffb4b4",
            activebackground="#5e2e30", activeforeground="#fff", relief=tk.FLAT,
            font=("Segoe UI", 9), padx=8, pady=3, command=self.on_delete_selected_pin
        )
        btn_del.pack(side=tk.LEFT, padx=4)

        sep = tk.Frame(sidebar, height=1, bg=COLOR_BORDER)
        sep.pack(fill=tk.X, pady=(0, 8))

        # Formulario de propiedades
        lbl_edit_title = ttk.Label(sidebar, text="Propiedades del Pin Seleccionado", style="Header.TLabel")
        lbl_edit_title.pack(anchor="w", pady=(0, 6))

        form_frame = tk.Frame(sidebar, bg=COLOR_SIDEBAR)
        form_frame.pack(fill=tk.X)

        self.form_vars = {
            "id": tk.StringVar(),
            "name": tk.StringVar(),
            "label": tk.StringVar(),
            "category": tk.StringVar(),
            "distance": tk.StringVar(),
            "time": tk.StringVar(),
            "img": tk.StringVar(),
            "x": tk.DoubleVar(),
            "y": tk.DoubleVar(),
        }

        fields = [
            ("ID:", "id", False),
            ("Nombre:", "name", True),
            ("Label (Pill):", "label", True),
            ("Categoría:", "category", True),
            ("Distancia:", "distance", True),
            ("Tiempo:", "time", True),
            ("Ruta Imagen:", "img", True),
        ]

        for row_idx, (label_text, var_name, editable) in enumerate(fields):
            lbl = tk.Label(form_frame, text=label_text, bg=COLOR_SIDEBAR, fg=COLOR_MUTED, font=("Segoe UI", 8, "bold"))
            lbl.grid(row=row_idx, column=0, sticky="w", pady=2)
            ent = tk.Entry(form_frame, textvariable=self.form_vars[var_name], bg="#1c1e24", fg="#ffffff",
                           insertbackground="#ffffff", relief=tk.FLAT, font=("Segoe UI", 9),
                           state="normal" if editable else "readonly")
            ent.grid(row=row_idx, column=1, sticky="ew", pady=2, padx=(6, 0))
            if editable:
                ent.bind("<KeyRelease>", self.on_form_field_changed)

        form_frame.columnconfigure(1, weight=1)

        # Coordenadas X% e Y%
        coords_frame = tk.Frame(sidebar, bg="#1a1c22", padx=10, pady=6, relief=tk.FLAT)
        coords_frame.pack(fill=tk.X, pady=(8, 10))

        lbl_coord_title = tk.Label(coords_frame, text="Coordenadas Relativas (%):", bg="#1a1c22", fg=COLOR_GOLD, font=("Segoe UI", 9, "bold"))
        lbl_coord_title.pack(anchor="w", pady=(0, 2))

        coord_inputs = tk.Frame(coords_frame, bg="#1a1c22")
        coord_inputs.pack(fill=tk.X)

        tk.Label(coord_inputs, text="X (%):", bg="#1a1c22", fg="#fff").pack(side=tk.LEFT)
        self.spin_x = tk.Spinbox(
            coord_inputs, from_=0.0, to=100.0, increment=0.1, textvariable=self.form_vars["x"],
            width=6, bg="#272a34", fg="#fff", relief=tk.FLAT, command=self.on_spin_changed
        )
        self.spin_x.pack(side=tk.LEFT, padx=(4, 16))
        self.spin_x.bind("<KeyRelease>", self.on_spin_changed)

        tk.Label(coord_inputs, text="Y (%):", bg="#1a1c22", fg="#fff").pack(side=tk.LEFT)
        self.spin_y = tk.Spinbox(
            coord_inputs, from_=0.0, to=100.0, increment=0.1, textvariable=self.form_vars["y"],
            width=6, bg="#272a34", fg="#fff", relief=tk.FLAT, command=self.on_spin_changed
        )
        self.spin_y.pack(side=tk.LEFT, padx=4)
        self.spin_y.bind("<KeyRelease>", self.on_spin_changed)

        # Vista previa del código generado
        lbl_code_title = ttk.Label(sidebar, text="Vista Previa de Código (JS)", style="Header.TLabel")
        lbl_code_title.pack(anchor="w", pady=(4, 2))

        self.code_text = tk.Text(
            sidebar, height=7, bg="#15171c", fg="#a6e22e",
            font=("Consolas", 8), relief=tk.FLAT, padx=6, pady=6, wrap=tk.NONE
        )
        self.code_text.pack(fill=tk.BOTH, expand=True, pady=(0, 6))

        # Botón grande para copiar
        btn_big_copy = tk.Button(
            sidebar, text="📋 Copiar al Portapapeles", bg=COLOR_GOLD, fg="#1a1a1a",
            activebackground=COLOR_GOLD_HOVER, activeforeground="#000", relief=tk.FLAT,
            font=("Segoe UI", 10, "bold"), pady=6, cursor="hand2", command=self.on_copy_code
        )
        btn_big_copy.pack(fill=tk.X)

    # -------------------------------------------------------------
    # Carga desde JSX (MAP.image + LOCATION_POINTS)
    # -------------------------------------------------------------
    def _load_from_jsx(self, jsx_path):
        parsed = parse_jsx_file(jsx_path)
        if not parsed:
            messagebox.showerror("Error", f"No se pudo analizar el archivo JSX:\n{jsx_path}")
            return False

        self.current_jsx_path = jsx_path

        # 1. Puntos del mapa
        if parsed["points"]:
            self.points = parsed["points"]
            self.selected_index = 0
        else:
            self.points = [dict(p) for p in FALLBACK_POINTS]
            self.selected_index = 0

        # 2. Pin de referencia
        if parsed.get("ref_pin"):
            self.reference_pin = parsed["ref_pin"]
            self.show_reference_pin.set(self.reference_pin.get("enabled", True))
            self._sync_ref_vars()
            self._update_ref_panel_visuals()

        # 3. Resolver imagen de MAP
        image_rel = parsed.get("image_rel") or FALLBACK_MAP_REL
        self.current_map_rel = image_rel

        # Convertir a ruta absoluta en public/
        full_img_path = os.path.normpath(os.path.join(PUBLIC_DIR, image_rel.replace("/", os.sep)))

        if os.path.exists(full_img_path):
            self._load_image_from_path(full_img_path)
        else:
            fallback_abs = os.path.normpath(os.path.join(PUBLIC_DIR, FALLBACK_MAP_REL.replace("/", os.sep)))
            if os.path.exists(fallback_abs):
                self._load_image_from_path(fallback_abs)
                self.status_var.set(f"Aviso: Imagen '{image_rel}' no encontrada. Usando mapa por defecto.")
            else:
                self.status_var.set(f"No se encontró la imagen: {full_img_path}")

        jsx_name = os.path.basename(jsx_path)
        ref_status_str = f"Pin Principal: {self.reference_pin['name']}" if self.reference_pin.get("enabled") else "Sin Pin Principal"
        self.source_indicator_var.set(f"📄 Origen: {jsx_name}  |  🗺️ MAP.image: '{image_rel}'  |  Puntos: {len(self.points)}  |  ⭐ {ref_status_str}")
        self.status_var.set(f"Sincronizado con {jsx_name}: MAP.image = '{image_rel}', {len(self.points)} pines y {ref_status_str}.")
        self._update_all_views()
        return True

    def on_reload_default_jsx(self):
        if os.path.exists(DEFAULT_PAGE_JSX):
            self._load_from_jsx(DEFAULT_PAGE_JSX)
        else:
            messagebox.showwarning("Aviso", f"No se encontró {DEFAULT_PAGE_JSX}")

    def on_open_jsx_file(self):
        start_dir = os.path.join(PROJECT_ROOT, "src", "pages")
        file_path = filedialog.askopenfilename(
            title="Seleccionar archivo de página JSX (ej. Inn.jsx)",
            initialdir=start_dir if os.path.exists(start_dir) else PROJECT_ROOT,
            filetypes=[("Archivos React JSX/JS", "*.jsx;*.js"), ("Todos los archivos", "*.*")]
        )
        if file_path:
            self._load_from_jsx(file_path)

    def on_open_image_file(self):
        file_path = filedialog.askopenfilename(
            title="Seleccionar Imagen de Mapa",
            initialdir=os.path.join(PUBLIC_DIR, "images"),
            filetypes=[("Imágenes", "*.png;*.jpg;*.jpeg;*.webp"), ("Todos los archivos", "*.*")]
        )
        if file_path:
            self._load_image_from_path(file_path)
            self.source_indicator_var.set(f"📁 Imagen suelta: {os.path.basename(file_path)}")

    def _load_image_from_path(self, path):
        try:
            self.pil_original_image = Image.open(path)
            self.map_image_path = path
            self._cached_image_size = None
            self.redraw_canvas()
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo cargar la imagen:\n{e}")

    # -------------------------------------------------------------
    # Guardado directo a JSX
    # -------------------------------------------------------------
    def on_save_directly_to_jsx(self):
        target_jsx = self.current_jsx_path or DEFAULT_PAGE_JSX
        if not os.path.exists(target_jsx):
            messagebox.showerror("Error", f"No se encontró el archivo destino:\n{target_jsx}")
            return

        confirm = messagebox.askyesno(
            "Guardar en JSX",
            f"¿Deseas actualizar el mapa y los pines directamente en:\n{target_jsx}?"
        )
        if not confirm:
            return

        try:
            # Asegurar que la imagen por defecto exista siempre
            ensure_default_point_image()
            default_abs = os.path.normpath(os.path.join(PUBLIC_DIR, DEFAULT_NEW_POINT_IMG.replace("/", os.sep)))

            # Verificar si algún punto hace referencia a una imagen inexistente y crearla
            for p in self.points:
                p_img = (p.get("img") or "").strip()
                if p_img:
                    p_img_abs = os.path.normpath(os.path.join(PUBLIC_DIR, p_img.replace("/", os.sep)))
                    if not os.path.exists(p_img_abs):
                        try:
                            os.makedirs(os.path.dirname(p_img_abs), exist_ok=True)
                            if os.path.exists(default_abs):
                                import shutil
                                shutil.copyfile(default_abs, p_img_abs)
                            else:
                                Image.new("RGB", (1200, 675), color=(30, 34, 42)).save(p_img_abs, "JPEG", quality=90)
                        except Exception as ex:
                            print(f"Aviso al crear imagen faltante {p_img_abs}: {ex}")

            with open(target_jsx, "r", encoding="utf-8") as f:
                content = f.read()

            new_code = self._generate_js_code()
            pattern = r"const\s+LOCATION_POINTS\s*=\s*\[[\s\S]*?\]"

            if not re.search(pattern, content):
                messagebox.showerror("Error", "No se encontró el bloque `const LOCATION_POINTS = [...]` en el archivo.")
                return

            updated = re.sub(pattern, new_code, content, count=1)

            ref_saved = False
            if self.reference_pin.get("enabled"):
                rx = self.reference_pin.get("x", 40.0)
                ry = self.reference_pin.get("y", 68.1)
                ref_pattern = r'((?:pin-inn|lb-[\w-]+-map__pin-(?:inn|project|main))[\s\S]*?style=\{\{\s*left:\s*[\'"])[0-9.]+(%[\'"],\s*top:\s*[\'"])[0-9.]+(%[\'"])'
                if re.search(ref_pattern, updated):
                    updated = re.sub(ref_pattern, rf"\g<1>{rx}\g<2>{ry}\g<3>", updated, count=1)
                    ref_saved = True

            with open(target_jsx, "w", encoding="utf-8") as f:
                f.write(updated)

            ref_msg = f" y Pin Principal ({self.reference_pin['x']}%, {self.reference_pin['y']}%)" if ref_saved else ""
            self.status_var.set(f"✅ ¡{os.path.basename(target_jsx)} actualizado con éxito! (LOCATION_POINTS{ref_msg})")
            messagebox.showinfo("Éxito", f"Se actualizó LOCATION_POINTS{ref_msg} en {os.path.basename(target_jsx)} exitosamente.")
        except Exception as e:
            messagebox.showerror("Error al guardar", f"Ocurrió un error:\n{e}")

    # -------------------------------------------------------------
    # Renderizado y Canvas
    # -------------------------------------------------------------
    # -------------------------------------------------------------
    # Renderizado y Canvas Optimizado (Cero Delay)
    # -------------------------------------------------------------
    def on_canvas_resize(self, event=None):
        self.redraw_canvas()

    def redraw_pins(self):
        """Redibuja únicamente los pines y referencias sin tocar la imagen de fondo."""
        self.canvas.delete("pin")

        # Pin de referencia del proyecto
        if self.show_reference_pin.get():
            self._draw_reference_pin()

        # Pines interactivos
        for idx, point in enumerate(self.points):
            self._draw_pin(idx, point, is_selected=(idx == self.selected_index))

    def redraw_canvas(self):
        """Redibuja el lienzo completo, re-escalando la imagen solo si cambió de tamaño."""
        if not self.pil_original_image:
            self.canvas.delete("all")
            self._cached_image_size = None
            self.canvas.create_text(
                self.canvas.winfo_width() / 2, self.canvas.winfo_height() / 2,
                text="Haz clic en '🔄 Sincronizar Inn.jsx' o carga una imagen para comenzar",
                fill="#6c7380", font=("Segoe UI", 13)
            )
            return

        cw = self.canvas.winfo_width()
        ch = self.canvas.winfo_height()
        if cw <= 10 or ch <= 10:
            return

        orig_w, orig_h = self.pil_original_image.size
        scale = min(cw / orig_w, ch / orig_h)
        new_w = max(1, int(orig_w * scale))
        new_h = max(1, int(orig_h * scale))

        offset_x = (cw - new_w) // 2
        offset_y = (ch - new_h) // 2
        self.img_rect = (offset_x, offset_y, new_w, new_h)

        # Re-escalar y refrescar la imagen SOLO si cambiaron las dimensiones reales
        if self._cached_image_size != (new_w, new_h) or not self.tk_image:
            self.canvas.delete("all")
            resized = self.pil_original_image.resize((new_w, new_h), Image.Resampling.BILINEAR)
            self.tk_image = ImageTk.PhotoImage(resized)
            self._cached_image_size = (new_w, new_h)
            self.canvas.create_image(offset_x, offset_y, anchor=tk.NW, image=self.tk_image, tags="bg_map")
            self.canvas.create_rectangle(offset_x, offset_y, offset_x + new_w, offset_y + new_h, outline="#2a2e39", width=1, tags="bg_map")

        self.redraw_pins()

    def _draw_reference_pin(self):
        if not self.reference_pin.get("enabled", True) or not self.show_reference_pin.get():
            return

        ox, oy, w, h = self.img_rect
        rx = ox + (self.reference_pin.get("x", 40.0) / 100.0) * w
        ry = oy + (self.reference_pin.get("y", 68.1) / 100.0) * h

        is_sel = getattr(self, "is_ref_selected", False)
        pin_name = self.reference_pin.get("name", "PROYECTO")
        coords_text = f"({self.reference_pin.get('x', 0)}%, {self.reference_pin.get('y', 0)}%)"

        if is_sel:
            # Anillo exterior resplandeciente
            self.canvas.create_oval(rx - 16, ry - 16, rx + 16, ry + 16, outline=COLOR_GOLD_HOVER, width=2, dash=(4, 2), tags=("ref_pin", "pin"))
            self.canvas.create_oval(rx - 12, ry - 12, rx + 12, ry + 12, fill="#382e14", outline=COLOR_GOLD_HOVER, width=2, tags=("ref_pin", "pin"))
            self.canvas.create_oval(rx - 6, ry - 6, rx + 6, ry + 6, fill=COLOR_GOLD_HOVER, outline="", tags=("ref_pin", "pin"))
            self.canvas.create_text(rx, ry, text="★", fill="#000000", font=("Segoe UI", 9, "bold"), tags=("ref_pin", "pin"))
        else:
            self.canvas.create_oval(rx - 10, ry - 10, rx + 10, ry + 10, fill="#1c2128", outline=COLOR_GOLD, width=2, tags=("ref_pin", "pin"))
            self.canvas.create_oval(rx - 5, ry - 5, rx + 5, ry + 5, fill=COLOR_GOLD, outline="", tags=("ref_pin", "pin"))
            self.canvas.create_text(rx, ry, text="★", fill="#ffffff", font=("Segoe UI", 7, "bold"), tags=("ref_pin", "pin"))

        # Badge superior distintivo
        badge_text = f"★ {pin_name} {coords_text}"
        char_w = 6.8
        badge_w = max(55, len(badge_text) * char_w)
        bx1 = rx - (badge_w / 2)
        bx2 = rx + (badge_w / 2)
        by1 = ry - 32
        by2 = ry - 14

        bg_color = "#332711" if is_sel else "#1c2128"
        border_color = COLOR_GOLD_HOVER if is_sel else COLOR_GOLD
        text_color = COLOR_GOLD_HOVER if is_sel else "#ffffff"

        self.canvas.create_rectangle(bx1, by1, bx2, by2, fill=bg_color, outline=border_color, width=1.5 if is_sel else 1, tags=("ref_pin", "pin"))
        self.canvas.create_text(rx, (by1 + by2) / 2, text=badge_text, fill=text_color, font=("Segoe UI", 8, "bold" if is_sel else "normal"), tags=("ref_pin", "pin"))

    def _draw_pin(self, idx, point, is_selected=False):
        ox, oy, w, h = self.img_rect
        cx = ox + (point.get("x", 0) / 100.0) * w
        cy = oy + (point.get("y", 0) / 100.0) * h

        dot_radius = 8 if is_selected else 6
        line_len = 18
        badge_text = point.get("label") or point.get("name") or f"Pin #{point.get('id')}"

        dot_color = COLOR_GOLD if is_selected else COLOR_DOT_DEFAULT
        glow_color = COLOR_GOLD if is_selected else "#ffffff"

        if is_selected:
            self.canvas.create_oval(cx - (dot_radius + 4), cy - (dot_radius + 4),
                                    cx + (dot_radius + 4), cy + (dot_radius + 4),
                                    outline=COLOR_GOLD_HOVER, width=2, tags=(f"pin_{idx}", "pin"))

        self.canvas.create_oval(cx - dot_radius, cy - dot_radius, cx + dot_radius, cy + dot_radius,
                                fill=dot_color, outline=glow_color, width=1.5, tags=(f"pin_{idx}", "pin"))
        self.canvas.create_oval(cx - 2, cy - 2, cx + 2, cy + 2, fill="#ffffff", outline="", tags=(f"pin_{idx}", "pin"))

        line_x1 = cx + dot_radius
        line_x2 = line_x1 + line_len
        line_color = COLOR_GOLD if is_selected else "#73777d"
        self.canvas.create_line(line_x1, cy, line_x2, cy, fill=line_color, width=1.5, tags=(f"pin_{idx}", "pin"))

        font = ("Segoe UI", 8, "bold") if is_selected else ("Segoe UI", 8)
        pill_height = 18
        pad_x = 7

        char_w = 6.5
        text_w = max(35, len(badge_text) * char_w)
        pill_x1 = line_x2
        pill_x2 = pill_x1 + text_w + (pad_x * 2)
        pill_y1 = cy - (pill_height / 2)
        pill_y2 = cy + (pill_height / 2)

        pill_bg = "#222630" if not is_selected else "#2c2616"
        pill_border = COLOR_GOLD if is_selected else "#545a67"
        text_color = COLOR_GOLD_HOVER if is_selected else "#ffffff"

        self.canvas.create_rectangle(pill_x1, pill_y1, pill_x2, pill_y2, fill=pill_bg, outline=pill_border, width=1, tags=(f"pin_{idx}", "pin"))
        self.canvas.create_text(pill_x1 + pad_x, cy, anchor=tk.W, text=badge_text, fill=text_color, font=font, tags=(f"pin_{idx}", "pin"))

    # -------------------------------------------------------------
    # Mouse Events
    # -------------------------------------------------------------
    def _is_ref_pin_at_coords(self, click_x, click_y):
        if not self.reference_pin.get("enabled", True) or not self.show_reference_pin.get():
            return False
        ox, oy, w, h = self.img_rect
        rx = ox + (self.reference_pin.get("x", 40.0) / 100.0) * w
        ry = oy + (self.reference_pin.get("y", 68.1) / 100.0) * h

        dist = ((click_x - rx) ** 2 + (click_y - ry) ** 2) ** 0.5
        if dist <= 18:
            return True

        pin_name = self.reference_pin.get("name", "PROYECTO")
        coords_text = f"({self.reference_pin.get('x', 0)}%, {self.reference_pin.get('y', 0)}%)"
        badge_text = f"★ {pin_name} {coords_text}"
        badge_w = max(55, len(badge_text) * 6.8)
        bx1 = rx - (badge_w / 2)
        bx2 = rx + (badge_w / 2)
        by1 = ry - 34
        by2 = ry - 12
        if bx1 <= click_x <= bx2 and by1 <= click_y <= by2:
            return True
        return False

    def _find_pin_at_coords(self, click_x, click_y):
        ox, oy, w, h = self.img_rect
        for idx in reversed(range(len(self.points))):
            p = self.points[idx]
            cx = ox + (p.get("x", 0) / 100.0) * w
            cy = oy + (p.get("y", 0) / 100.0) * h

            dist = ((click_x - cx) ** 2 + (click_y - cy) ** 2) ** 0.5
            if dist <= 12:
                return idx

            line_x1 = cx + 6
            pill_x1 = line_x1 + 18
            pill_x2 = pill_x1 + 120
            pill_y1 = cy - 10
            pill_y2 = cy + 10
            if pill_x1 <= click_x <= pill_x2 and pill_y1 <= click_y <= pill_y2:
                return idx
        return -1

    def on_canvas_press(self, event):
        # 1. Comprobar si se hizo clic en el Pin Principal del proyecto
        if self._is_ref_pin_at_coords(event.x, event.y):
            self.is_ref_selected = True
            self.dragging_reference = True
            self.selected_index = -1
            self.dragging_index = -1
            self.pins_listbox.selection_clear(0, tk.END)
            self._update_ref_panel_visuals()
            self.redraw_pins()
            self.status_var.set(f"⭐ Pin Principal seleccionado: '{self.reference_pin.get('name')}' ({self.reference_pin.get('x')}%, {self.reference_pin.get('y')}%)")
            return

        # 2. Comprobar si se hizo clic en un pin normal
        idx = self._find_pin_at_coords(event.x, event.y)
        if idx != -1:
            self.is_ref_selected = False
            self.dragging_reference = False
            self.selected_index = idx
            self.dragging_index = idx
            self._select_in_listbox(idx)
            self._populate_form_from_selected()
            self._update_ref_panel_visuals()
            self.redraw_pins()
        else:
            self.dragging_index = -1
            self.dragging_reference = False
            self.is_ref_selected = False
            self._update_ref_panel_visuals()
            self.redraw_pins()

    def on_canvas_drag(self, event):
        ox, oy, w, h = self.img_rect
        if w <= 0 or h <= 0:
            return

        pct_x = max(0.0, min(100.0, ((event.x - ox) / float(w)) * 100.0))
        pct_y = max(0.0, min(100.0, ((event.y - oy) / float(h)) * 100.0))

        if self.dragging_reference:
            self.reference_pin["x"] = round(pct_x, 1)
            self.reference_pin["y"] = round(pct_y, 1)
            self.ref_x_var.set(self.reference_pin["x"])
            self.ref_y_var.set(self.reference_pin["y"])
            self.redraw_pins()
            return

        if self.dragging_index == -1:
            return

        point = self.points[self.dragging_index]
        point["x"] = round(pct_x, 1)
        point["y"] = round(pct_y, 1)

        self.form_vars["x"].set(point["x"])
        self.form_vars["y"].set(point["y"])
        self.redraw_pins()

    def on_canvas_release(self, event):
        if self.dragging_reference:
            self.dragging_reference = False
            self._update_ref_panel_visuals()
            self._update_code_preview()
            self.status_var.set(f"Pin Principal '{self.reference_pin.get('name')}': x={self.reference_pin['x']}%, y={self.reference_pin['y']}%")
        if self.dragging_index != -1:
            idx = self.dragging_index
            self.dragging_index = -1
            self._refresh_listbox_item(idx)
            self._update_code_preview()
            p = self.points[idx]
            self.status_var.set(f"Pin '{p.get('name')}': x={p['x']}%, y={p['y']}%")

    def _add_point_at(self, pct_x, pct_y):
        ensure_default_point_image()
        next_id = max([p.get("id", 0) for p in self.points], default=0) + 1
        new_point = {
            "id": next_id,
            "name": f"Lugar {next_id}",
            "label": f"LUGAR {next_id}",
            "distance": "1.0 km",
            "category": "Interés",
            "time": "10 minutos",
            "img": DEFAULT_NEW_POINT_IMG,
            "x": pct_x,
            "y": pct_y,
        }
        self.points.append(new_point)
        self.selected_index = len(self.points) - 1
        self.is_ref_selected = False
        self._update_all_views()
        self.redraw_canvas()
        self.status_var.set(f"Nuevo pin #{next_id} agregado en x={pct_x}%, y={pct_y}%")

    def on_canvas_double_click(self, event):
        ox, oy, w, h = self.img_rect
        if not (ox <= event.x <= ox + w and oy <= event.y <= oy + h):
            return

        pct_x = round(((event.x - ox) / float(w)) * 100.0, 1)
        pct_y = round(((event.y - oy) / float(h)) * 100.0, 1)

        # Si se mantiene Shift presionado, coloca el Pin Principal aquí
        if event.state & 0x0001:
            self.on_place_reference_pin_at(pct_x, pct_y)
            return

        self._add_point_at(pct_x, pct_y)

    def on_canvas_right_click(self, event):
        ox, oy, w, h = self.img_rect
        if w <= 0 or h <= 0:
            return
        pct_x = round(max(0.0, min(100.0, ((event.x - ox) / float(w)) * 100.0)), 1)
        pct_y = round(max(0.0, min(100.0, ((event.y - oy) / float(h)) * 100.0)), 1)

        menu = tk.Menu(self.root, tearoff=0, bg=COLOR_SIDEBAR, fg="#ffffff")

        # Clic sobre Pin Principal
        if self._is_ref_pin_at_coords(event.x, event.y):
            self.is_ref_selected = True
            self.selected_index = -1
            self.pins_listbox.selection_clear(0, tk.END)
            self._update_ref_panel_visuals()
            self.redraw_canvas()

            menu.add_command(label="🎯 Seleccionar Pin Principal", command=self.on_add_or_select_reference_pin)
            menu.add_command(label="📋 Copiar JSX Pin Principal", command=self.on_copy_reference_pin_jsx)
            menu.add_separator()
            menu.add_command(label="🗑️ Quitar Pin Principal", command=self.on_remove_reference_pin)
            menu.post(event.x_root, event.y_root)
            return

        # Clic sobre un pin normal
        idx = self._find_pin_at_coords(event.x, event.y)
        if idx != -1:
            self.selected_index = idx
            self.is_ref_selected = False
            self._select_in_listbox(idx)
            self._populate_form_from_selected()
            self._update_ref_panel_visuals()
            self.redraw_canvas()

            menu.add_command(label="🗑️ Eliminar este Pin", command=self.on_delete_selected_pin)
            menu.add_command(label="📋 Duplicar Pin", command=self.on_duplicate_selected_pin)
            menu.post(event.x_root, event.y_root)
            return

        # Clic en espacio vacío del mapa
        menu.add_command(
            label=f"➕ Agregar Punto de Interés aquí ({pct_x}%, {pct_y}%)",
            command=lambda: self._add_point_at(pct_x, pct_y)
        )
        menu.add_command(
            label=f"⭐ Colocar Pin Principal aquí ({pct_x}%, {pct_y}%)",
            command=lambda: self.on_place_reference_pin_at(pct_x, pct_y)
        )
        menu.add_separator()
        bg_menu = tk.Menu(menu, tearoff=0, bg=COLOR_SIDEBAR, fg="#ffffff")
        for name, hex_val in self.bg_presets.items():
            bg_menu.add_command(label=f"{name} ({hex_val})", command=lambda h=hex_val: self.set_canvas_bg_color(h))
        bg_menu.add_separator()
        bg_menu.add_command(label="🖌️ Elegir Color...", command=self.on_choose_custom_bg_color)
        menu.add_cascade(label="🎨 Cambiar Color de Fondo", menu=bg_menu)
        menu.post(event.x_root, event.y_root)

    # -------------------------------------------------------------
    # Selector de Color de Fondo
    # -------------------------------------------------------------
    def set_canvas_bg_color(self, color_hex):
        if not color_hex:
            return
        self.canvas_bg_color = color_hex
        if hasattr(self, "canvas"):
            self.canvas.configure(bg=color_hex)
        if hasattr(self, "canvas_frame"):
            self.canvas_frame.configure(bg=color_hex)
        if hasattr(self, "btn_bg_swatch"):
            self.btn_bg_swatch.configure(bg=color_hex, activebackground=color_hex)
        matched = False
        for name, hex_val in self.bg_presets.items():
            if hex_val.lower() == color_hex.lower():
                self.bg_combo_var.set(name)
                matched = True
                break
        if not matched:
            self.bg_combo_var.set("Personalizado...")
        self.status_var.set(f"🎨 Color de fondo cambiado a {color_hex}")

    def on_bg_preset_selected(self, event=None):
        selected = self.bg_combo_var.get()
        if selected == "Personalizado...":
            self.on_choose_custom_bg_color()
        elif selected in self.bg_presets:
            self.set_canvas_bg_color(self.bg_presets[selected])

    def on_choose_custom_bg_color(self):
        color = colorchooser.askcolor(color=self.canvas_bg_color, title="Seleccionar Color de Fondo del Mapa")
        if color and color[1]:
            self.set_canvas_bg_color(color[1])

    # -------------------------------------------------------------
    # Métodos del Pin Principal del Proyecto
    # -------------------------------------------------------------
    def on_toggle_reference_pin(self):
        enabled = self.show_reference_pin.get()
        self.reference_pin["enabled"] = enabled
        if not enabled:
            self.is_ref_selected = False
        self._update_ref_panel_visuals()
        self.redraw_canvas()

    def on_add_or_select_reference_pin(self):
        if not self.reference_pin.get("enabled"):
            self.reference_pin["enabled"] = True
            if self.reference_pin.get("x", 0) == 0 and self.reference_pin.get("y", 0) == 0:
                self.reference_pin["x"] = 50.0
                self.reference_pin["y"] = 50.0
            self.show_reference_pin.set(True)
            self.status_var.set("⭐ Pin Principal del proyecto activado. Arrástralo a su ubicación en el mapa.")
        else:
            self.status_var.set("⭐ Pin Principal seleccionado. Puedes arrastrarlo en el mapa o editar sus coordenadas.")

        self.is_ref_selected = True
        self.selected_index = -1
        self.pins_listbox.selection_clear(0, tk.END)
        self._sync_ref_vars()
        self._update_ref_panel_visuals()
        self.redraw_canvas()

    def on_remove_reference_pin(self):
        self.reference_pin["enabled"] = False
        self.show_reference_pin.set(False)
        self.is_ref_selected = False
        self._update_ref_panel_visuals()
        self.redraw_canvas()
        self.status_var.set("Pin Principal deshabilitado del mapa.")

    def on_place_reference_pin_at(self, pct_x, pct_y):
        self.reference_pin["enabled"] = True
        self.reference_pin["x"] = round(pct_x, 1)
        self.reference_pin["y"] = round(pct_y, 1)
        self.show_reference_pin.set(True)
        self.is_ref_selected = True
        self.selected_index = -1
        self.pins_listbox.selection_clear(0, tk.END)
        self._sync_ref_vars()
        self._update_ref_panel_visuals()
        self.redraw_canvas()
        self.status_var.set(f"⭐ Pin Principal ubicado en x={self.reference_pin['x']}%, y={self.reference_pin['y']}%")

    def on_ref_field_changed(self, event=None):
        self.reference_pin["name"] = self.ref_name_var.get()
        self.redraw_canvas()

    def on_ref_spin_changed(self, event=None):
        try:
            self.reference_pin["x"] = round(float(self.ref_x_var.get()), 1)
            self.reference_pin["y"] = round(float(self.ref_y_var.get()), 1)
        except ValueError:
            return
        self._update_ref_panel_visuals()
        self.redraw_canvas()

    def _sync_ref_vars(self):
        self.ref_name_var.set(self.reference_pin.get("name", "PROYECTO INN"))
        self.ref_x_var.set(self.reference_pin.get("x", 40.0))
        self.ref_y_var.set(self.reference_pin.get("y", 68.1))

    def _update_ref_panel_visuals(self):
        enabled = self.reference_pin.get("enabled", True) and self.show_reference_pin.get()
        if hasattr(self, "ref_status_lbl"):
            if enabled:
                rx = self.reference_pin.get("x", 0.0)
                ry = self.reference_pin.get("y", 0.0)
                self.ref_status_lbl.config(text=f"Activo: ({rx}%, {ry}%)", fg=COLOR_GOLD)
                self.btn_add_ref.config(text="🎯 Seleccionar")
            else:
                self.ref_status_lbl.config(text="Inactivo / Sin agregar", fg=COLOR_MUTED)
                self.btn_add_ref.config(text="➕ Agregar")

    def _generate_ref_pin_jsx(self):
        ref_name = self.reference_pin.get("name", "Proyecto INN")
        ref_x = self.reference_pin.get("x", 40.0)
        ref_y = self.reference_pin.get("y", 68.1)
        code = (
            f"{{/* Pin {ref_name} */}}\n"
            f"<div\n"
            f"  className=\"lb-inn-map__pin-inn position-absolute\"\n"
            f"  style={{{{ left: '{ref_x}%', top: '{ref_y}%' }}}}\n"
            f"  title=\"{ref_name}\"\n"
            f">\n"
            f"  <img\n"
            f"    src={{`${{base}}images/inn/pin_logo.png`}}\n"
            f"    alt=\"{ref_name}\"\n"
            f"    className=\"lb-inn-map__pin-inn-img\"\n"
            f"  />\n"
            f"</div>"
        )
        return code

    def on_copy_reference_pin_jsx(self):
        code = self._generate_ref_pin_jsx()
        self.root.clipboard_clear()
        self.root.clipboard_append(code)
        self.root.update()
        self.status_var.set("✅ ¡Código JSX del Pin Principal copiado al portapapeles exitosamente!")

    # -------------------------------------------------------------
    # Sincronización Formulario y Lista
    # -------------------------------------------------------------
    def _update_all_views(self):
        self._refresh_listbox()
        self._select_in_listbox(self.selected_index)
        self._populate_form_from_selected()
        self._update_code_preview()

    def _refresh_listbox(self):
        self.pins_listbox.delete(0, tk.END)
        for p in self.points:
            lbl = p.get("label") or p.get("name") or "Sin Nombre"
            self.pins_listbox.insert(tk.END, f"#{p.get('id', '?')} {lbl} ({p.get('x', 0)}%, {p.get('y', 0)}%)")

    def _refresh_listbox_item(self, idx):
        if 0 <= idx < len(self.points):
            p = self.points[idx]
            lbl = p.get("label") or p.get("name") or "Sin Nombre"
            text = f"#{p.get('id', '?')} {lbl} ({p.get('x', 0)}%, {p.get('y', 0)}%)"
            self.pins_listbox.delete(idx)
            self.pins_listbox.insert(idx, text)
            if idx == self.selected_index:
                self.pins_listbox.selection_set(idx)

    def _select_in_listbox(self, idx):
        self.pins_listbox.selection_clear(0, tk.END)
        if 0 <= idx < len(self.points):
            self.pins_listbox.selection_set(idx)
            self.pins_listbox.see(idx)

    def on_listbox_select(self, event):
        sel = self.pins_listbox.curselection()
        if sel:
            self.selected_index = sel[0]
            self._populate_form_from_selected()
            self.redraw_canvas()

    def _populate_form_from_selected(self):
        if 0 <= self.selected_index < len(self.points):
            p = self.points[self.selected_index]
            for key, var in self.form_vars.items():
                var.set(p.get(key, ""))
        else:
            for var in self.form_vars.values():
                var.set("")

    def on_form_field_changed(self, event=None):
        if 0 <= self.selected_index < len(self.points):
            p = self.points[self.selected_index]
            for key in ["name", "label", "category", "distance", "time", "img"]:
                p[key] = self.form_vars[key].get()
            self._refresh_listbox_item(self.selected_index)
            self._update_code_preview()
            self.redraw_canvas()

    def on_spin_changed(self, event=None):
        if 0 <= self.selected_index < len(self.points):
            p = self.points[self.selected_index]
            try:
                p["x"] = round(float(self.form_vars["x"].get()), 1)
                p["y"] = round(float(self.form_vars["y"].get()), 1)
            except ValueError:
                return
            self._refresh_listbox_item(self.selected_index)
            self._update_code_preview()
            self.redraw_canvas()

    def on_add_new_pin(self):
        ensure_default_point_image()
        next_id = max([p.get("id", 0) for p in self.points], default=0) + 1
        new_point = {
            "id": next_id,
            "name": f"Nuevo Lugar {next_id}",
            "label": f"LUGAR {next_id}",
            "distance": "1.0 km",
            "category": "Interés",
            "time": "10 minutos",
            "img": DEFAULT_NEW_POINT_IMG,
            "x": 50.0,
            "y": 50.0,
        }
        self.points.append(new_point)
        self.selected_index = len(self.points) - 1
        self._update_all_views()
        self.redraw_canvas()

    def on_duplicate_selected_pin(self):
        if 0 <= self.selected_index < len(self.points):
            orig = self.points[self.selected_index]
            next_id = max([p.get("id", 0) for p in self.points], default=0) + 1
            cloned = dict(orig)
            cloned["id"] = next_id
            cloned["name"] = f"{orig.get('name', 'Copia')} (Copia)"
            cloned["label"] = f"{orig.get('label', 'COPIA')}"
            cloned["x"] = min(100.0, round(cloned.get("x", 50.0) + 2.0, 1))
            cloned["y"] = min(100.0, round(cloned.get("y", 50.0) + 2.0, 1))
            self.points.append(cloned)
            self.selected_index = len(self.points) - 1
            self._update_all_views()
            self.redraw_canvas()

    def on_delete_selected_pin(self):
        if 0 <= self.selected_index < len(self.points):
            del self.points[self.selected_index]
            self.selected_index = max(0, self.selected_index - 1) if self.points else -1
            self._update_all_views()
            self.redraw_canvas()

    # -------------------------------------------------------------
    # Generación y Exportación de Código
    # -------------------------------------------------------------
    def _generate_js_code(self):
        lines = ["const LOCATION_POINTS = ["]
        for p in self.points:
            line = (
                f"  {{ id: {p.get('id', 1)}, name: '{p.get('name', '')}', "
                f"label: '{p.get('label', '')}', distance: '{p.get('distance', '')}', "
                f"category: '{p.get('category', '')}', time: '{p.get('time', '')}', "
                f"img: '{p.get('img', '')}', x: {p.get('x', 0.0)}, y: {p.get('y', 0.0)} }},"
            )
            lines.append(line)
        lines.append("]")
        return "\n".join(lines)

    def _update_code_preview(self):
        code = self._generate_js_code()
        self.code_text.delete("1.0", tk.END)
        self.code_text.insert(tk.END, code)

    def on_copy_code(self):
        code = self._generate_js_code()
        self.root.clipboard_clear()
        self.root.clipboard_append(code)
        self.root.update()
        self.status_var.set("✅ ¡Código LOCATION_POINTS copiado al portapapeles exitosamente!")

    # -------------------------------------------------------------
    # Importador de Código JS / JSON
    # -------------------------------------------------------------
    def on_import_code_dialog(self):
        dlg = tk.Toplevel(self.root)
        dlg.title("Importar LOCATION_POINTS")
        dlg.geometry("680x480")
        dlg.configure(bg=COLOR_BG)

        tk.Label(
            dlg, text="Pega aquí el array de JS o JSON existente:",
            bg=COLOR_BG, fg=COLOR_TEXT, font=("Segoe UI", 10, "bold")
        ).pack(anchor="w", padx=12, pady=(12, 6))

        txt = tk.Text(dlg, bg="#15171c", fg="#a6e22e", font=("Consolas", 9), relief=tk.FLAT, padx=8, pady=8)
        txt.pack(fill=tk.BOTH, expand=True, padx=12, pady=4)
        txt.insert(tk.END, self._generate_js_code())

        def do_import():
            raw = txt.get("1.0", tk.END).strip()
            parsed = self._parse_imported_text(raw)
            if parsed:
                self.points = parsed
                self.selected_index = 0 if self.points else -1
                self._update_all_views()
                self.redraw_canvas()
                self.status_var.set(f"✅ Se importaron {len(parsed)} pines exitosamente.")
                dlg.destroy()
            else:
                messagebox.showerror("Error de parseo", "No se detectaron pines válidos en el texto ingresado.")

        btn_row = tk.Frame(dlg, bg=COLOR_BG)
        btn_row.pack(fill=tk.X, padx=12, pady=10)

        tk.Button(
            btn_row, text="Importar Ahora", bg=COLOR_GOLD, fg="#000",
            font=("Segoe UI", 9, "bold"), padx=12, pady=5, command=do_import
        ).pack(side=tk.RIGHT, padx=4)

        tk.Button(
            btn_row, text="Cancelar", bg="#3a3f4d", fg="#fff",
            font=("Segoe UI", 9), padx=10, pady=5, command=dlg.destroy
        ).pack(side=tk.RIGHT, padx=4)

    def _parse_imported_text(self, text):
        try:
            data = json.loads(text)
            if isinstance(data, list):
                return data
        except Exception:
            pass

        results = []
        obj_matches = re.findall(r"\{([^}]+)\}", text)
        for obj_str in obj_matches:
            item = {}
            for key in ["id", "name", "label", "distance", "category", "time", "img", "x", "y"]:
                m = re.search(rf"\b{key}\s*:\s*(?:'([^']*)'|\"([^\"]*)\"|([0-9.]+))", obj_str)
                if m:
                    val = m.group(1) or m.group(2) or m.group(3)
                    if key in ["id"]:
                        try:
                            item[key] = int(val)
                        except ValueError:
                            item[key] = val
                    elif key in ["x", "y"]:
                        try:
                            item[key] = round(float(val), 1)
                        except ValueError:
                            item[key] = 0.0
                    else:
                        item[key] = val
            if "x" in item and "y" in item:
                results.append(item)

        return results


def main():
    root = tk.Tk()
    app = MapPinEditorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
