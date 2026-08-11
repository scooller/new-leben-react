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
    title: 'Beneficios del círculo de ',
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
        name: 'PARTNER SILVER',
        subtitle: 'VENTAS DESDE 0 HASTA 10.000 UF EN UN PERIODO DE 3 MESES',
      },
      {
        name: 'PARTNER GOLD',
        subtitle: 'VENTAS DESDE 10.000 HASTA 15.000 UF EN UN PERIODO DE 3 MESES',
      },
      {
        name: 'PARTNER BLACK',
        subtitle: 'VENTAS SOBRE 15.000 UF EN UN PERIODO DE 3 MESES',
      },
    ],
    rows: [
      { label: 'CONTACTO SEMANAL KAM / MAILING', values: [true, true, true] },
      { label: 'CONTACTO QUINCENAL / MAILING COMISIONES Y AVANCES LEBEN', values: [true, true, true] },
      { label: 'INVITACIÓN A PRE LANZAMIENTOS', values: [false, true, true] },
      { label: 'CANAL DE DIFUSIÓN MAIL / WHATSAPP', values: [true, true, true] },
      { label: 'REUNIONES SEMANALES DE SEGUIMIENTO', values: [false, true, true] },
      { label: 'AGENDA DE APOYO EXCLUSIVO CIERRES', values: [false, false, true] },
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
    years: ['2025', '2024', '2023'],
    cards: [
      {
        image: img('brokers-event-1.jpg'),
        title: 'Cierre de Año iLeben 2024',
        description: 'Premiación anual y networking de brokers elite en el hotel W.',
      },
      {
        image: img('brokers-event-2.jpg'),
        title: 'Workshop IA Inmobiliaria',
        description: 'Capacitación práctica en el uso de herramientas IA para acelerar cierres.',
      },
      {
        image: img('brokers-event-3.jpg'),
        title: 'Broker Summit Sur',
        description: 'Encuentro regional de corredores con tour de proyectos en Puerto Varas.',
      },
    ],
  },

  // --- Alliances ---
  alliances: {
    title: 'Alianzas Activas',
    logos: [
      { logo: img('logo-rentabilizate.svg'), name: 'Rentabilízate' },
      { logo: img('logo-tributa.svg'), name: 'Tributa' },
      { logo: img('logo-r-inversiones.svg'), name: 'R Inversiones' },
      { logo: img('logo-tisser.svg'), name: 'Tisser' },
    ],
  },
}
