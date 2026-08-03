// ============================================================
// Project Detail Data — Individual project pages
// Data extracted from Figma design "INN" (node 2089:91)
// ============================================================

const img = (name) => `${import.meta.env.BASE_URL}images/${name}`
const vid = (name) => `${import.meta.env.BASE_URL}video/${name}`

export const projectDetails = {
  inn: {
    slug: 'inn',
    name: 'Edificio INN',
    year: '2027',
    location: 'Puerto Varas, Chile',
    address: 'Vicente Pérez Rosales 991, Puerto Varas',
    status: 'EnVenta',
    statusLabel: 'En Venta',
    priceFrom: 'UF 9.816',

    // --- Hero ---
    hero: {
      title: 'Vive la exclusividad frente al lago',
      subtitle: 'Conexión Urbana & Paisajismo Interior',
      location: 'Puerto Varas',
      backgroundVideo: vid('hero-inn.mp4'),
      logo: img('inn-logo.png'),
    },

    // --- Tabs (sticky bar) ---
    tabs: [
      { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991' },
      { id: 'tipologia', label: 'Tipología', value: '2-3-4 Dorms' },
      { id: 'metraje', label: 'Metraje', value: 'Desde 85 m²' },
      { id: 'precio', label: 'Precio desde', value: 'UF 9.816' },
      { id: 'estado', label: 'Estado', value: 'En Venta' },
    ],

    // --- Overview ---
    overview: {
      eyebrow: '1. PROYECTO | Único en su clase',
      title: 'El Sur se vive frente al lago',
      description:
        'Descubre el privilegio de vivir en primera línea con vistas incomparables y despejadas al Lago Llanquihue y los volcanes Osorno y Calbuco, en uno de los edificios más modernos y exclusivos de Puerto Varas. Departamentos, dúplex y deptos. con patio privado. Equipamiento premium Franke.',
      collage: {
        left: img('inn-overview-1.jpg'),
        rightTop: img('inn-overview-2.jpg'),
        rightBottom: img('inn-overview-3.jpg'),
      },
      stats: [
        { value: '2-3-4', label: 'Dormitorios' },
        { value: 'XX a XX m²', label: 'Superficie útil' },
        { value: 'Franke', label: 'Equipación en cocina' },
      ],
    },

    // --- Amenities Strip (upper) ---
    amenitiesTop: [
      { icon: 'key', label: 'Conserjería 24/7' },
      { icon: 'droplet', label: 'Piscina Lounge' },
      { icon: 'activity', label: 'Gimnasio Fit' },
      { icon: 'users', label: 'Sala Gourmet' },
      { icon: 'sun', label: 'Rooftop & BBQ' },
      { icon: 'box', label: 'E-Commerce Lockers' },
      { icon: 'compass', label: 'Bicicleteros' },
    ],

    // --- Floor Plans ---
    floorPlans: {
      eyebrow: '2. TERMINACIONES | Diseñadas para durar',
      title: 'ENCUENTRA TU DISTRIBUCIÓN IDEAL',
      description:
        'Cada departamento cuenta con piso vinílico resistente al agua, ventanas termopanel de PVC, cubiertas de cuarzo en cocinas y un equipamiento completo con horno, encimera vitrocerámica y campana retráctil.',
      blueprint: img('inn-blueprint.jpg'),
      buttons: ['Ver Modelos 2D', 'Ver Modelos 3D', 'Ver Modelos 4D'],
    },

    // --- Vista 360 ---
    vista360: {
      eyebrow: 'RECORRIDO VIRTUAL',
      title: 'Explora el proyecto',
      tabs: ['Master Plan', 'Pilotos 360°', 'Vista por piso'],
      images: [img('inn-vista360.jpg'), null, null],
    },

    // --- Cotizador (visual mock) ---
    cotizador: {
      title: 'Cotiza tu próximo depto en Edificio INN',
      filters: {
        row1: [
          { label: 'Todas las tipologías', options: ['2 Dorms', '3 Dorms', '4 Dorms'] },
          { label: 'Todos los tipos de producto', options: ['Departamento', 'Dúplex', 'Dúplex con Patio'] },
        ],
        row2: [
          { label: 'Todos los pisos', options: ['Piso 1-5', 'Piso 6-10', 'Piso 11+'] },
          { label: 'Todas las plantas', options: ['Planta A', 'Planta B', 'Planta C'] },
        ],
      },
      mapCaption: 'Ubicación del edificio en Puerto Varas',
      floorPlan: {
        image: img('inn-cotizador-planta.jpg'),
        thumbnails: [
          img('inn-thumb-1.jpg'),
          img('inn-thumb-2.jpg'),
          img('inn-thumb-3.jpg'),
          img('inn-thumb-4.jpg'),
          img('inn-thumb-5.jpg'),
        ],
      },
      details: [
        { icon: 'layers', label: 'Planta', value: '110' },
        { icon: 'expand', label: 'Superficie útil', value: '85,57 m²' },
        { icon: 'home', label: 'Dorm + Baño', value: '3 dorm + 2 baño' },
        { icon: 'sun', label: 'Terraza', value: '15,45 m²' },
        { icon: 'compass', label: 'Orientación', value: 'O' },
        { icon: 'maximize', label: 'Superficie total', value: '150,08 m²' },
      ],
      actions: ['Descargar Brochure', 'Vistas por piso'],
      pricing: {
        label: 'Precios desde',
        price: 'UF 9.816',
        shareLabel: 'Compartir',
      },
      ctaText: 'Cotizar',
    },

    // --- Related Projects (table) ---
    relatedProjects: {
      eyebrow: 'OTROS PROYECTOS EN PUERTO VARAS',
      title: 'Proyectos relacionados',
      columns: ['Proyecto', 'Ubicación', 'Tipología', 'Superficie', 'Precio', ''],
      rows: [
        { name: 'Edificio Mood', location: 'Puerto Varas', tipologia: '2-3 Dorms', superficie: '60-90 m²', precio: 'UF 6.200*' },
        { name: 'Edificio Sol', location: 'Puerto Varas', tipologia: '2-3 Dorms', superficie: '70-100 m²', precio: 'UF 7.100*' },
        { name: 'Edificio Luz', location: 'Puerto Varas', tipologia: '1-2 Dorms', superficie: '45-70 m²', precio: 'UF 4.800*' },
      ],
    },

    // --- Alternatives ---
    alternatives: {
      title: '¿Buscas otras opciones en el sur de Chile?',
      cards: [
        { name: 'Edificio Índigo I', location: 'Puerto Varas', tipologia: '2-3 Dormitorios — Entrega Inmediata', price: 'Desde UF 8.906*', image: img('inn-alt-1.jpg') },
        { name: 'Edificio Nórdico I', location: 'Puerto Varas', tipologia: '1-2-3 Dormitorios — Futuro Proyecto', price: 'Desde UF 4.746*', image: img('inn-alt-2.jpg') },
        { name: 'Edificio Bold I', location: 'Valdivia', tipologia: '1-2 Dormitorios — Entrega Inmediata', price: 'Desde UF 3.521*', image: img('inn-alt-3.jpg') },
      ],
    },

    // --- Spaces Gallery ---
    spacesGallery: {
      eyebrow: '4. ESPACIOS | Diseño de vanguardia',
      title: 'VIVIR PARA DISFRUTAR EL SILENCIO',
      description:
        'La volumetría exterior y el diseño de interiores de INN han sido diseñados meticulosamente por Sofia Iturralde. "La fluidez espacial y el uso de luz natural cenital crean una atmósfera de calma y desconexión en medio de la ciudad."',
      images: [
        img('inn-space-1.jpg'),
        img('inn-space-2.jpg'),
        img('inn-space-3.jpg'),
      ],
      designer: {
        name: 'Sofia Iturralde',
        role: 'Interiorista - Directora de Arte',
        avatar: img('inn-designer.jpg'),
      },
    },

    // --- Amenities Icons Strip (lower) ---
    amenitiesBottom: [
      { icon: 'laptop', label: 'Cowork & Lounge' },
      { icon: 'flame', label: 'Quincho en Rooftop' },
      { icon: 'dumbbell', label: 'Training Zone' },
      { icon: 'waves', label: 'Piscina' },
      { icon: 'smile', label: 'Juegos Infantiles' },
    ],

    // --- Location ---
    location: {
      eyebrow: '5. UBICACIÓN | Conectividad Total',
      title: 'CONOCE TU ENTORNO',
      description:
        'INN se emplaza en una de las zonas residenciales más tranquilas y tradicionales de Puerto Varas, a pasos de la costanera y de una vista única frente al lago Llanquihue.',
      checklist: [
        'A pasos de la costanera peatonal de Puerto Varas',
        'Cercano a Mall y Supermercado',
        'A minutos del Casino de Puerto Varas',
        'Cercano al centro urbano de la ciudad',
      ],
      mapImage: img('inn-map.jpg'),
    },

    // --- Bottom Gallery ---
    bottomGallery: [
      img('inn/SAUNA.jpg'),
      img('inn/PISCINA-DUAL.jpg'),
      img('inn/PADEL.jpg'),
      img('inn/LIVING.jpg'),
      img('inn/02_DEPORTE-NAUTICO.jpg'),
      img('inn/DEPORTE-NAUTICO.jpg'),
      img('inn/SAUNA.jpg'),
    ],

    // --- Team / Agents ---
    team: {
      title: 'Te acompañamos en todo el proceso',
      subtitle: 'Visitanos en: Vicente Pérez Rosales 991, Puerto Varas. Horarios de sala de venta: Lun a Dom. 10:00 a 14:00hrs y 15:00 a 19:00hrs.',
      agents: [
        { name: 'Patricia Ramírez', phone: '+56 9 3420 4833', email: 'pramirez@ileben.cl', avatar: img('avatar-patricia-ramirez.png') },
        { name: 'Catalina Cid', phone: '+56 9 9577 3431', email: 'ccid@ileben.cl', avatar: img('avatar-catalina-cid.png') },
        { name: 'Patricia Singh', phone: '+56 9 3420 4832', email: 'psingh@ileben.cl', avatar: img('avatar-patricia-singh.png') },
      ],
    },
  },
}

/** Get a project by slug, returns null if not found */
export function getProjectBySlug(slug) {
  return projectDetails[slug] ?? null
}
