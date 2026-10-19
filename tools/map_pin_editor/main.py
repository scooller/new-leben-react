"""
Map Pin Editor - Leben
Herramienta visual para colocar pines sobre imagenes de mapas y sincronizar
el array LOCATION_POINTS y la imagen MAP directamente con React (Inn.jsx u otros).
"""

import os
import re
import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk

# Rutas del proyecto
PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_PAGE_JSX = os.path.normpath(os.path.join(PROJECT_ROOT, "src", "pages", "Inn.jsx"))
PUBLIC_DIR = os.path.normpath(os.path.join(PROJECT_ROOT, "public"))

# Fallbacks por defecto si no se encuentra el archivo JSX
FALLBACK_MAP_REL = "images/inn/Mapa_PV.png"
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
    1. La propiedad `image` del objeto MAP (ej. 'images/inn/Muestra-Mapa.jpg')
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

    # 2. Extraer pin de referencia INN
    ref_pin = {"name": "PROYECTO INN", "x": 40.0, "y": 68.1}
    ref_match = re.search(
        r"pin-inn[\s\S]*?style=\{\{\s*left:\s*['\"]([0-9.]+)%['\"],\s*top:\s*['\"]([0-9.]+)%['\"]",
        content,
    )
    if ref_match:
        try:
            ref_pin["x"] = round(float(ref_match.group(1)), 1)
            ref_pin["y"] = round(float(ref_match.group(2)), 1)
        except ValueError:
            pass

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
        self.img_rect = (0, 0, 1, 1)  # (offset_x, offset_y, rendered_w, rendered_h)

        # Estado de pines
        self.points = []
        self.selected_index = -1
        self.dragging_index = -1
        self.show_reference_pin = tk.BooleanVar(value=True)
        self.reference_pin = {"name": "PROYECTO INN", "x": 40.0, "y": 68.1}

        self._configure_styles()
        self._build_ui()

        # Cargar inicialmente desde Inn.jsx
        if self.current_jsx_path:
            self._load_from_jsx(self.current_jsx_path)
        else:
            self.points = [dict(p) for p in FALLBACK_POINTS]
            self.selected_index = 0
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

        chk_ref = tk.Checkbutton(
            toolbar, text="Pin Referencia Proyecto", variable=self.show_reference_pin,
            bg=COLOR_PANEL_HEADER, fg="#e0e0e0", selectcolor="#1c2128",
            activebackground=COLOR_PANEL_HEADER, activeforeground="#fff",
            font=("Segoe UI", 9), command=self.redraw_canvas
        )
        chk_ref.pack(side=tk.LEFT, padx=12)

        # Acciones de exportación
        btn_copy = tk.Button(
            toolbar, text="📋 Copiar LOCATION_POINTS (JS)", bg=COLOR_GOLD, fg="#1a1a1a",
            activebackground=COLOR_GOLD_HOVER, activeforeground="#000", relief=tk.FLAT,
            font=("Segoe UI", 9, "bold"), padx=12, pady=4, cursor="hand2",
            command=self.on_copy_code
        )
        btn_copy.pack(side=tk.RIGHT, padx=4)

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
        canvas_frame = tk.Frame(paned, bg=COLOR_BG)
        paned.add(canvas_frame, stretch="always", minsize=600)

        # Indicador de origen e imagen cargada
        self.source_indicator_var = tk.StringVar(value="")
        lbl_source = tk.Label(
            canvas_frame, textvariable=self.source_indicator_var,
            bg="#16181d", fg="#b0b8c4", font=("Segoe UI", 8), pady=4, padx=10, anchor="w"
        )
        lbl_source.pack(side=tk.TOP, fill=tk.X)

        self.canvas = tk.Canvas(canvas_frame, bg="#131418", highlightthickness=0, cursor="crosshair")
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

        lbl_side_title = ttk.Label(sidebar, text="Pines en el Mapa", style="Header.TLabel")
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
        self.source_indicator_var.set(f"📄 Origen: {jsx_name}  |  🗺️ MAP.image: '{image_rel}'  |  Puntos: {len(self.points)}")
        self.status_var.set(f"Sincronizado con {jsx_name}: MAP.image = '{image_rel}' y {len(self.points)} pines.")
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
            f"¿Deseas actualizar el array LOCATION_POINTS directamente en:\n{target_jsx}?"
        )
        if not confirm:
            return

        try:
            with open(target_jsx, "r", encoding="utf-8") as f:
                content = f.read()

            new_code = self._generate_js_code()
            pattern = r"const\s+LOCATION_POINTS\s*=\s*\[[\s\S]*?\]"

            if not re.search(pattern, content):
                messagebox.showerror("Error", "No se encontró el bloque `const LOCATION_POINTS = [...]` en el archivo.")
                return

            updated = re.sub(pattern, new_code, content, count=1)
            with open(target_jsx, "w", encoding="utf-8") as f:
                f.write(updated)

            self.status_var.set(f"✅ ¡{os.path.basename(target_jsx)} actualizado con éxito!")
            messagebox.showinfo("Éxito", f"Se actualizó LOCATION_POINTS en {os.path.basename(target_jsx)} exitosamente.")
        except Exception as e:
            messagebox.showerror("Error al guardar", f"Ocurrió un error:\n{e}")

    # -------------------------------------------------------------
    # Renderizado y Canvas
    # -------------------------------------------------------------
    def on_canvas_resize(self, event=None):
        self.redraw_canvas()

    def redraw_canvas(self):
        self.canvas.delete("all")
        if not self.pil_original_image:
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

        resized = self.pil_original_image.resize((new_w, new_h), Image.Resampling.LANCZOS)
        self.tk_image = ImageTk.PhotoImage(resized)
        self.canvas.create_image(offset_x, offset_y, anchor=tk.NW, image=self.tk_image)

        self.canvas.create_rectangle(offset_x, offset_y, offset_x + new_w, offset_y + new_h, outline="#2a2e39", width=1)

        # Pin de referencia
        if self.show_reference_pin.get():
            self._draw_reference_pin()

        # Pines interactivos
        for idx, point in enumerate(self.points):
            self._draw_pin(idx, point, is_selected=(idx == self.selected_index))

    def _draw_reference_pin(self):
        ox, oy, w, h = self.img_rect
        rx = ox + (self.reference_pin["x"] / 100.0) * w
        ry = oy + (self.reference_pin["y"] / 100.0) * h

        self.canvas.create_oval(rx - 9, ry - 9, rx + 9, ry + 9, fill="#1c2128", outline=COLOR_GOLD, width=2)
        self.canvas.create_oval(rx - 4, ry - 4, rx + 4, ry + 4, fill=COLOR_GOLD, outline="")
        label_text = f"★ {self.reference_pin.get('name', 'PROYECTO')}"
        self.canvas.create_text(rx, ry - 16, text=label_text, fill=COLOR_GOLD, font=("Segoe UI", 8, "bold"))

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
                                    outline=COLOR_GOLD_HOVER, width=2)

        self.canvas.create_oval(cx - dot_radius, cy - dot_radius, cx + dot_radius, cy + dot_radius,
                                fill=dot_color, outline=glow_color, width=1.5, tags=(f"pin_{idx}", "pin"))
        self.canvas.create_oval(cx - 2, cy - 2, cx + 2, cy + 2, fill="#ffffff", outline="")

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
        idx = self._find_pin_at_coords(event.x, event.y)
        if idx != -1:
            self.selected_index = idx
            self.dragging_index = idx
            self._select_in_listbox(idx)
            self._populate_form_from_selected()
            self.redraw_canvas()
        else:
            self.dragging_index = -1

    def on_canvas_drag(self, event):
        if self.dragging_index == -1:
            return

        ox, oy, w, h = self.img_rect
        if w <= 0 or h <= 0:
            return

        pct_x = max(0.0, min(100.0, ((event.x - ox) / float(w)) * 100.0))
        pct_y = max(0.0, min(100.0, ((event.y - oy) / float(h)) * 100.0))

        point = self.points[self.dragging_index]
        point["x"] = round(pct_x, 1)
        point["y"] = round(pct_y, 1)

        self.form_vars["x"].set(point["x"])
        self.form_vars["y"].set(point["y"])
        self.status_var.set(f"Moviendo pin '{point.get('name')}': x={point['x']}%, y={point['y']}%")

        self.redraw_canvas()
        self._refresh_listbox_item(self.dragging_index)

    def on_canvas_release(self, event):
        if self.dragging_index != -1:
            self.dragging_index = -1
            self._update_code_preview()

    def on_canvas_double_click(self, event):
        ox, oy, w, h = self.img_rect
        if not (ox <= event.x <= ox + w and oy <= event.y <= oy + h):
            return

        pct_x = round(((event.x - ox) / float(w)) * 100.0, 1)
        pct_y = round(((event.y - oy) / float(h)) * 100.0, 1)

        next_id = max([p.get("id", 0) for p in self.points], default=0) + 1
        new_point = {
            "id": next_id,
            "name": f"Lugar {next_id}",
            "label": f"LUGAR {next_id}",
            "distance": "1.0 km",
            "category": "Interés",
            "time": "10 minutos",
            "img": "images/inn/ubicacion/nuevo.jpg",
            "x": pct_x,
            "y": pct_y,
        }
        self.points.append(new_point)
        self.selected_index = len(self.points) - 1
        self._update_all_views()
        self.redraw_canvas()
        self.status_var.set(f"Nuevo pin #{next_id} agregado en x={pct_x}%, y={pct_y}%")

    def on_canvas_right_click(self, event):
        idx = self._find_pin_at_coords(event.x, event.y)
        if idx != -1:
            self.selected_index = idx
            self._select_in_listbox(idx)
            self._populate_form_from_selected()
            self.redraw_canvas()

            menu = tk.Menu(self.root, tearoff=0, bg=COLOR_SIDEBAR, fg="#ffffff")
            menu.add_command(label="🗑️ Eliminar este Pin", command=self.on_delete_selected_pin)
            menu.add_command(label="📋 Duplicar Pin", command=self.on_duplicate_selected_pin)
            menu.post(event.x_root, event.y_root)

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
        next_id = max([p.get("id", 0) for p in self.points], default=0) + 1
        new_point = {
            "id": next_id,
            "name": f"Nuevo Lugar {next_id}",
            "label": f"LUGAR {next_id}",
            "distance": "1.0 km",
            "category": "Interés",
            "time": "10 minutos",
            "img": "images/inn/ubicacion/nuevo.jpg",
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
