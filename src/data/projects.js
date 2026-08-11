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
    apiId: 9,
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
      eyebrow: '1. Proyecto | Único en su clase',
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

    // --- Floor Plans / Terminaciones ---
    floorPlans: {
      eyebrow: '2. Terminaciones | Diseñadas para durar',
      title: 'Terminaciones',
      description:
        'Equipamiento premium marca Franke: horno, horno microondas, lavavajillas panelable, encimera y campana. Cubierta de cocina ultra compacto terminación Travertino.',
      images: [
        img('inn/Horno.jpg'),
        img('inn/Horno-microondas.jpg'),
        img('inn/Lavavajillas-panelable-scaled.jpg'),
        img('inn/Encimera-y-campana-scaled.jpg'),
        img('inn/Cubierta-cocina-scaled.jpg'),
        img('inn/Griferia-cocina.jpg'),
        img('inn/Griferia-bano-principal.jpg'),
        img('inn/Puertas-scaled.jpg'),
      ],
      items: [
        { label: 'Horno Franke', icon: 'flame' },
        { label: 'Horno Microondas Franke', icon: 'cooking-pot' },
        { label: 'Lavavajillas Panelable Franke', icon: 'washing-machine' },
        { label: 'Encimera y Campana Franke', icon: 'fan' },
        { label: 'Cubierta Cocina Travertino', icon: 'soup' },
        { label: 'Grifería Cocina', icon: 'droplet' },
        { label: 'Grifería Baño Principal', icon: 'shower-head' },
        { label: 'Puertas Enchape', icon: 'frame' },
      ],
    },

    // --- Vista 360 ---
    vista360: {
      eyebrow: 'Recorrido virtual',
      title: 'Explora el proyecto',
      tabs: ['Master Plan', 'Pilotos 360°', 'Vista por piso'],
      images: [img('inn-vista360.jpg'), 'https://my.matterport.com/show/?m=hQ8Fm33FqFY&brand=0', 'https://www.lanube360.com/ileben1/'],
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
      mapCaption: 'Esquicio',
      mapImage: img('inn/esquicio.jpg'),
      floorPlan: {
        thumbnails: [
          img('inn/planta/planta.jpg'),
          img('inn/planta/Cocina-Comedor-1.jpg'),
          img('inn/planta/Comedor-2.jpg'),
          img('inn/planta/Hall-de-acceso.jpg'),
          img('inn/planta/Living-Comedor-2.jpg'),
          img('inn/planta/Living-Comedor-3.jpg'),
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
        { dpto: 'Piso 10', name: 'Edificio Nórdico', location: 'Puerto Varas', tipologia: '2-3 Dorms', superficie: '70-100 m²', precio: 'UF 7.100*' },
        { dpto: 'Piso Duplex', name: 'Edificio Nordico', location: 'Puerto Varas', tipologia: '1-2 Dorms', superficie: '45-70 m²', precio: 'UF 4.800*' },
      ],
    },

    // --- Alternatives ---
    alternatives: {
      title: '¿Buscas otras opciones en el sur de Chile?',
      cards: [
        { name: 'Edificio Índigo', location: 'Puerto Varas', tipologia: '2-3 Dormitorios — Entrega Inmediata', price: 'Desde UF 8.906*', image: img('inn-alt-1.jpg') },
        { name: 'Edificio Nórdico', location: 'Puerto Varas', tipologia: '1-2-3 Dormitorios — Futuro Proyecto', price: 'Desde UF 4.746*', image: img('inn-alt-2.jpg') },
        { name: 'Edificio Bold', location: 'Valdivia', tipologia: '1-2 Dormitorios — Entrega Inmediata', price: 'Desde UF 3.521*', image: img('inn-alt-3.jpg') },
      ],
    },

    // --- Spaces Gallery ---
    spacesGallery: {
      eyebrow: '4. Espacios | Diseño de vanguardia',
      title: 'Vive los espacios diseñados para tí',
      description:
        'Departamentos diseñados para aprovechar al máximo la luz natural y las vistas al lago. Terrazas, dormitorios y baños con terminaciones premium.',
      images: [
        img('inn/render.jpg'),
        img('inn-space-2.jpg'),
        img('inn-space-3.jpg'),
      ],
      designer: {
        name: 'Sofia Iturralde',
        role: 'Interiorista - Directora de Arte',
        avatar: img('inn/sofia.jpg'),
      },
    },

    // --- Location ---
    locationInfo: {
      eyebrow: '5. Ubicación | Conectividad total',
      title: 'Ubicación privilegiada en Puerto Varas',
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
      img('inn/galeria1.jpg'),
      img('inn/galeria2.jpg'),
      img('inn/galeria3.jpg'),
      img('inn/galeria4.jpg'),
      img('inn/galeria5.jpg'),
    ],

    // --- Team / Agents ---
    team: {
      title: 'Te acompañamos en todo el proceso',
      subtitle: 'Visitanos en: Vicente Pérez Rosales 991, Puerto Varas. Horarios de sala de venta: Lun a Dom. 10:00 a 14:00hrs y 15:00 a 19:00hrs.',
      wazeMap: 'https://embed.waze.com/iframe?zoom=16&lat=-41.326080&lon=-72.970514&ct=livemap',
      agents: [
        { name: 'Patricia Ramírez', phone: '+56 9 3420 4833', email: 'pramirez@ileben.cl', avatar: img('Patricia-Ramirez.jpg') },
        { name: 'Catalina Cid', phone: '+56 9 9577 3431', email: 'ccid@ileben.cl', avatar: img('catalina.jpg') },
        { name: 'Patricia Singh', phone: '+56 9 3420 4832', email: 'psingh@ileben.cl', avatar: img('Patricia-Singh.jpg') },
      ],
    },
  },
}

/** Get a project by slug, returns null if not found */
export function getProjectBySlug(slug) {
  return projectDetails[slug] ?? null
}
