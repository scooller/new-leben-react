// ============================================================
// Brokers Page Data — from Figma "Brokers" (node 2260:2)
// ============================================================

const img = (name) => `${import.meta.env.BASE_URL}images/brokers/${name}`

export const brokersData = {
  // --- Hero ---
  hero: {
    title: '¿Eres broker inmobiliario y quieres estar en el siguiente nivel?',
    subtitle:
      'Transfórmate en un nuevo Broker de Leben y crece con nosotros maximizando tus ingresos con las mejores herramientas del mercado.',
    ctaText: 'Postula ahora',
    ctaHref: '#registro',
    backgroundImage: img('brokers-hero.jpg'),
  },

  // --- Beneficios Intro ---
  benefits: {
    eyebrow: 'Círculo Leben',
    title: 'Beneficios del círculo de <span class="text-danger">Brokers Leben</span>',
    titleAccent: 'Brokers Leben',
    managerPhoto: img('brokers-manager.jpg'),
    items: [
      { icon: 'percent', text: 'Comisiones altamente competitivas en el mercado de corretaje.' },
      { icon: 'building', text: 'Proyectos únicos con ubicaciones premium en Santiago y Regiones.' },
      { icon: 'bell', text: 'Invitación a preventas y lanzamientos exclusivos.' },
      { icon: 'user-check', text: 'Apoyo en la gestión durante cada etapa del proceso de venta.' },
      { icon: 'award', text: 'Respaldo de una inmobiliaria certificada por Great Place to Work.' },
      { icon: 'gift', text: 'Premios al Mejor Broker 2025: Pasajes + Hotel para 2 personas por 5 días en Punta Cana.' },
    ],
  },

  // --- Comparison Table ---
  tiers: {
    eyebrow: 'Tiers Exclusivos',
    title: 'Categorías de Brokers Partner con Beneficios',
    columns: [
      {
        name: 'PARTNER BLACK',
        subtitle: 'VENTAS SOBRE 15.000 UF EN UN PERIODO DE 3 MESES',
      },
      {
        name: 'PARTNER GOLD',
        subtitle: 'VENTAS DESDE 10.000 HASTA 15.000 UF EN UN PERIODO DE 3 MESES',
      },
      {
        name: 'PARTNER SILVER',
        subtitle: 'VENTAS DESDE 0 HASTA 10.000 UF EN UN PERIODO DE 3 MESES',
      },
    ],
    categories: [
      {
        id: 'comunicacion',
        name: 'COMUNICACIÓN',
        rows: [
          { label: 'CONTACTO SEMANAL KAM / MAILING', values: [true, true, true] },
          { label: 'CONTACTO QUINCENAL / MAILING COMISIONES Y AVANCES LEBEN', values: [true, true, true] },
          { label: 'INVITACIÓN A PRE LANZAMIENTOS', values: [true, true, false] },
          { label: 'CANAL DE DIFUSIÓN MAIL / WHATS APP', values: [true, true, true] },
          { label: 'REUNIONES SEMANALES DE SEGUIMIENTO', values: [true, true, false] },
          { label: 'AGENDA DE APOYO EXCLUSIVO CIERRES', values: [true, false, false] },
        ],
      },
      {
        id: 'capacitacion',
        name: 'CAPACITACIÓN',
        rows: [
          { label: 'CAPACITACION DRIVE E INFORMACION LEBEN', values: [true, true, true] },
          { label: 'CAPACITACIONES EXCLUSIVAS LANZAMIENTOS', values: [true, true, false] },
          { label: 'CAPACITACIÓN EQUIPO', values: [true, false, false] },
        ],
      },
      {
        id: 'negocio',
        name: 'NEGOCIO',
        rows: [
          { label: 'PROMESA ASISTIDA ONLINE O PRESENCIAL', values: [true, true, true] },
          { label: 'GESTIÓN HIPOTECARÍA', values: [true, true, true] },
          { label: 'STOCK EXCLUSIVO DE UNIDADES ESPECIALES', values: [true, true, true] },
          { label: 'EXCEPCIONES COMERCIALES EN VENTA VOLUMEN', values: [true, false, false] },
        ],
      },
      {
        id: 'visitas',
        name: 'VISITAS',
        rows: [
          { label: 'VISITAS PREVIO AGENDAMIENTO CON 24 HRS', values: [true, true, true] },
          { label: 'FREE PASS DE INGRESO Y VISITA', values: [true, false, false] },
        ],
      },
      {
        id: 'pagos',
        name: 'PAGOS',
        rows: [
          { label: 'PAGO A 30 DÍAS, POSTERIOR A EMISIÓN DE FACTURA', values: [false, false, true] },
          { label: 'PAGO A 20 DÍAS, POSTERIOR A EMISIÓN DE FACTURA', values: [false, true, false] },
          { label: 'PAGO A 15 DÍAS, POSTERIOR A EMISIÓN DE FACTURA', values: [true, false, false] },
          { label: 'POSIBILIDAD DE FACTORIZAR', values: [true, false, false] },
          { label: 'PAGO DE COMISIÓN DIFERENCIADA', values: [true, false, false] },
        ],
      },
      {
        id: 'beneficios-adicionales',
        name: 'BENEFICIOS ADICIONALES',
        rows: [
          { label: 'ASISTENCIA A EVENTO DE PREMIACIÓN ANUAL', values: [true, true, false] },
          { label: 'PRESUPUESTO DE APOYO A VENTAS PRIVADAS LEBEN', values: [true, true, false] },
          { label: 'PERFIL BROKER EN PLATAFORMA JETBROKERS', values: [true, false, false] },
          { label: 'BENEFICIOS EXCLUSIVOS A MEJORES PARTICIPANTES DE EQUIPO BROKER', values: [true, false, false] },
        ],
      },
    ],
  },

  // --- KAM Info Bar ---
  kam: {
    text: '¿Cómo mantenerme o subir de categoría? Asesórate con tu KAM',
    tiers: [
      { label: 'SILVER', subtitle: 'VENTAS HASTA UF 10.000', minUF: 0, maxUF: 10000 },
      { label: 'GOLD', subtitle: 'VENTAS SOBRE DE UF 10.000', minUF: 10000, maxUF: 15000 },
      { label: 'BLACK', subtitle: 'VENTAS SOBRE UF 15.000', minUF: 15000, maxUF: null },
    ],
    footnote: 'TODAS LAS VENTAS EN UN PERIODO DE 3 MESES',
  },

  // --- Registration Form ---
  registration: {
    eyebrow: 'Únete al Círculo',
    title: 'Transfórmate en nuevo Broker Leben',
    description:
      'Completa el formulario y te contactaremos para ser parte de este exclusivo círculo con el valoramos e incentivamos tu talento.',
    backgroundImage: img('brokers-registration-bg.jpg'),
    fields: [
      { name: 'nombre', label: 'Nombre y Apellido', placeholder: 'Ej. Juan Pérez', type: 'text', col: 2 },
      { name: 'experiencia', label: 'Años de experiencia como broker', placeholder: 'Ej. 5 años', type: 'text', col: 2 },
      { name: 'modalidad', label: '¿Trabajas de forma independiente o en oficina?', placeholder: 'Ej. Independiente', type: 'text', col: 2 },
      { name: 'propiedades', label: '¿Qué tipo de propiedades vendes?', placeholder: 'Ej. Residencial, Comercial', type: 'text', col: 2 },
      { name: 'whatsapp', label: 'Whatsapp', placeholder: 'Ej. +56 9 1234 5678', type: 'tel', col: 2 },
      { name: 'email', label: 'Correo electrónico', placeholder: 'Ej. juan.perez@email.com', type: 'email', col: 2 },
      { name: 'empresa', label: 'Nombre de la empresa para la cual trabajas', placeholder: 'Ej. Inmobiliaria XYZ (Opcional)', type: 'text', col: 1 },
    ],
    submitText: 'Enviar Postulación',
    disclaimer:
      'Al enviar estás aceptando que un KAM de Leben te contacte para dar seguimiento a tu solicitud.',
  },

  // --- Events ---
  events: {
    eyebrow: 'Comunidad iLeben',
    title: 'Eventos Broker',
    tabs: [
      { id: '2025', label: '2025' },
      { id: '2024', label: '2024' },
      { id: '2023', label: '2023' },
      { id: 'alianzas', label: 'Nuevas Alianzas' },
    ],
    gallery: {
      '2025': [
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/1-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/3-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/4-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/5-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/8-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/7-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/6-broker.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/Equipo-Broker-2025.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-2.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-3.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-4.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-5.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-6.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-7.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-8.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-9.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2025-10.jpg',
      ],
      '2024': [
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-2-a.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-3-a.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-6-a.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-7-a.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-8-a.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-9-a.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2024-10-a.jpg',
      ],
      '2023': [
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/1-desayuno.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/2.-desayuno.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/3-desayuno-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/4-desayuno-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/5-desayuno.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/6-desayuno.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/7-desayuno-1-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/8-desayuno-1-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/9-desayuno.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/10-desayuno.jpg',
      ],
      'alianzas': [
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/nuevas-alianzas-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/nuevas-alianzas-2.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/nuevas-alianzas-3-1-1.jpg',
        'https://brokers.ileben.cl/wp-content/uploads/2025/07/nuevas-alianzas-4.jpg',
      ],
    },
  },

  // --- Alliances ---
  alliances: {
    title: 'Alianzas Activas',
    logos: [
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/GEN-PROACTIVO.jpg', name: 'Gen Proactivo' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-HOUM.jpeg', name: 'Houm' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-RENTABILIAZATE-e1768223298638.jpg', name: 'Rentabilízate' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-TRIBUTA-INTELIGENTE.jpeg', name: 'Tributa Inteligente' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/RILA.webp', name: 'Rila' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/Tisser.jpg', name: 'Tisser' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/BIG-CAPITAL.jpg', name: 'Big Capital' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-AUDIPROP.jpeg', name: 'Audiprop' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-CLUB-INVERSIONES.jpeg', name: 'Club Inversiones' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/GCI-CONSULTORE.jpeg', name: 'GCI Consultores' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/Icono-Fadcebook-2018.png', name: 'Facebook' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/Ksa.jpg', name: 'Ksa' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-HT-Dorado-Fondo-Negro.png', name: 'HT' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/Logo-Mi-Inversion.jpeg', name: 'Mi Inversión' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/logo-V_M-vertical-oficial-sin-fondo.png', name: 'V&M' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO_ALVAL_04.png', name: 'Alval' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LogoAlligareGris-scaled.png', name: 'Alligare' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/Logo-p360Inmobiliario.jpg', name: 'P360 Inmobiliario' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/Propiedades-centinela-scaled.jpg', name: 'Propiedades Centinela' },
      { logo: 'https://brokers.ileben.cl/wp-content/uploads/2026/01/LOGO-DPS-1.jpeg', name: 'DPS' },
    ],
  },
}
