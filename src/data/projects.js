// ============================================================
// Project Detail Data — Individual project pages
// Data extracted from Figma design "INN" (node 2089:91)
// ============================================================

const img = (name) => `${import.meta.env.BASE_URL}images/${name}`
const vid = (name) => `${import.meta.env.BASE_URL}video/${name}`
const iframe = (src) => src

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
      title: 'El Sur se vive frente al lago',
      subtitle: 'Conexión Urbana & Paisajismo Interior',
      location: 'Puerto Varas',
      backgroundVideo: vid('hero-inn.mp4'),
      logo: img('inn-logo.png'),
    },

    // --- Tabs (sticky bar) ---
    tabs: [
      { id: 'direccion', label: 'Dirección', value: 'Vicente Pérez Rosales 991, Puerto Varas' },
      { id: 'tipologia', label: 'Tipología', value: '2-3-4 Dorms' },
      { id: 'metraje', label: 'Metraje', value: 'Desde 85 m²' },
      { id: 'precio', label: 'Precio desde', value: 'UF 9.816' },
      { id: 'estado', label: 'Estado', value: 'Venta en Verde' },
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
        { value: '2 • 3 • 4', label: 'Dormitorios' },
        { value: 'Desde 85 m²', label: 'Superficie útil' },
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

    // --- Floor Plans / Terminaciones ---
    floorPlans: {
      eyebrow: '2. TERMINACIONES | Diseñadas para durar',
      title: 'TERMINACIONES',
      description:
        'Equipamiento premium marca Franke: horno, horno microondas, lavavajillas panelable, encimera y campana. Cubierta de cocina ultra compacto terminación Travertino.',
      images: [
        img('inn/terminacion-horno.jpg'),
        img('inn/terminacion-microondas.jpg'),
        img('inn/terminacion-lavavajillas.jpg'),
        img('inn/terminacion-encimera-campana.jpg'),
        img('inn/terminacion-cubierta-cocina.jpg'),
        img('inn/terminacion-griferia-cocina.jpg'),
        img('inn/terminacion-griferia-bano.jpg'),
        img('inn/terminacion-puertas.jpg'),
      ],
      items: [
        { label: 'Horno Franke' },
        { label: 'Horno Microondas Franke' },
        { label: 'Lavavajillas Panelable Franke' },
        { label: 'Encimera y Campana Franke' },
        { label: 'Cubierta Cocina Travertino' },
        { label: 'Grifería Cocina' },
        { label: 'Grifería Baño Principal' },
        { label: 'Puertas Enchape' },
      ],
    },

    // --- Vista 360 ---
    vista360: {
      eyebrow: 'RECORRIDO VIRTUAL',
      title: 'Explora el proyecto',
      tabs: ['Master Plan', 'Pilotos 360°', 'Vista por piso'],
      images: [img('inn-vista360.jpg'), iframe('https://my.matterport.com/show/?m=hQ8Fm33FqFY&brand=0'), iframe('https://www.lanube360.com/ileben1/')],
    },

    // --- Cotizador (visual mock) ---
    cotizador: {
      title: 'Cotiza tu próximo depto en <span class="text-danger">Edificio INN</span>',
      filters: {
        row1: [
          { label: 'Todas las tipologías', options: ['2D+2B', '2D+3B', '3D+2B', '3D+3B', '3D+4B', '4D+4B'] },
          { label: 'Todos los tipos de producto', options: ['Departamento'] },
        ],
        row2: [
          { label: 'Todos los pisos', options: ['Piso 1-5', 'Piso 6-10', 'Piso 11+'] },
          { label: 'Todas las plantas', options: ['Planta A', 'Planta B', 'Planta C'] },
        ],
      },
      mapCaption: 'Ubicación del edificio en Puerto Varas',
      mapImage: img('inn/esquicio.png'),
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
      eyebrow: 'Alternativas a Edificio INN • Puerto Varas',
      title: 'Proyectos similares que te pueden interesar',
      columns: ['Proyecto', 'Ubicación', 'Tipología', 'Superficie', 'Precio', ''],
      rows: [
        { dpto: 'Piso 1', name: 'Edificio Mood', location: 'Puerto Varas', tipologia: '2-3 Dorms', superficie: '60-90 m²', precio: 'UF 6.200*' },
        { dpto: 'Piso 10', name: 'Edificio Sol', location: 'Puerto Varas', tipologia: '2-3 Dorms', superficie: '70-100 m²', precio: 'UF 7.100*' },
        { dpto: 'Piso Duplex', name: 'Edificio Luz', location: 'Puerto Varas', tipologia: '1-2 Dorms', superficie: '45-70 m²', precio: 'UF 4.800*' },
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
      title: 'VIVE LOS ESPACIOS DISEÑADOS PARA TÍ',
      description:
        'Departamentos diseñados para aprovechar al máximo la luz natural y las vistas al lago. Terrazas, dormitorios y baños con terminaciones premium.',
      images: [
        img('inn/render.jpeg'),
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
      title: 'UBICACIÓN PRIVILEGIADA EN PUERTO VARAS',
      description:
        'INN se emplaza en primera línea frente al lago Llanquihue, en una de las zonas más privilegiadas de Puerto Varas, roderado de los principales atractivos de la ciudad.',
      checklist: [
        'Museo Pablo Fierro',
        'Monumento Héroes Patrios',
        'Casino',
        'Centro de Puerto Varas',
        'Mall - Supermercado',
        'Costanera',
        'Muelle Piedralplen',
        'Muelle Puerto Varas',
        'Mesa Tropera',
        'Hotel Cumbres',
        'Cassis',
        'La Olla',
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
