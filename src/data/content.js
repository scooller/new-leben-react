// ============================================================
// Content Data — Home Page
// All text content exactly from the Figma design
// ============================================================

const img = (name) => `${import.meta.env.BASE_URL}images/${name}`
const vid = (name) => `${import.meta.env.BASE_URL}video/${name}`

export const videos = {
  hero: vid('Banner-Hero-Desktop.mp4'),
}

export const images = {
  capa21: img('Prueba fondo.png'),
  logoIcon: img('icon.svg'),
  logoText: img('leben.svg'),
  logoBest: img('sello.png'),
  sello9: img('sello9.png'),
  sello4: img('sello4.png'),
  sello10: img('sello10.png'),
  sello11: img('sello11.png'),
  avatarHerman: img('avatar-herman.jpg'),
  avatarFernanda: img('avatar-fernanda.jpg'),
  avatarMaximiliano: img('avatar-maximiliano.jpg'),
  ctaSection: img('banner.jpg'),
  img1Main: img('img1-main.jpg'),
  img1Right: img('img1-right.jpg'),
  chevronDown: img('chevron-down.svg'),
  star: img('star.svg'),
  starHalf: img('star-half.svg'),
  share: img('share.svg'),
  starSmall: img('star-small.svg'),
  shareSmall: img('share-small.svg'),
  starHalfSmall: img('star-half-small.svg'),
  arrowRight: img('arrow-right.svg'),
  line: img('line.svg'),
  proyectosHero: img('proyectos-hero.jpg'),
  proyectosCta: img('proyectos-cta.jpg'),
  projSanto: img('proj-santo.jpg'),
  projArgomedo: img('proj-argomedo.jpg'),
  projMood: img('proj-mood.jpg'),
  projBaum: img('proj-baum.jpg'),
  projCapitanes: img('proj-capitanes.jpg'),
  projSuecia: img('proj-suecia.jpg'),
  projPiloto: img('proj-piloto.jpg'),
  projCotizador: img('proj-cotizador.jpg'),
  projInn: img('inn-hero-lake.jpeg'),
  chevronLeft: img('chevron-left.svg'),
  chevronRight: img('chevron-right.svg'),
  user: img('user.svg'),
  calendar: img('calendar.svg'),
  mapPin: img('map-pin.svg'),
  building: img('building.svg'),
  shieldCheck: img('shield-check.svg'),
  award: img('award.svg'),
  starFooter: img('star-footer.svg'),
  mapPinFooter: img('map-pin-footer.svg'),
  clock: img('clock.svg'),
  phone: img('phone.svg'),
  mail: img('mail.svg'),
  facebook: img('facebook.svg'),
  instagram: img('instagram.svg'),
  linkedin: img('linkedin.svg'),
}

export const heroContent = {
  title: 'Creando espacios donde lo cotidiano se vuelve extraordinario',
}

export const diferenciadoresTitle = {
  part1: 'Descubre cómo hacemos la ',
  highlight: 'diferencia',
  part2: ' en la experiencia inmobiliaria',
}

export const diferenciadores = [
  { image: 'sello9', text: 'Gracias a la excelente evaluación de nuestros clientes hemos sido certificados por 6 años consecutivos por Best Place to Live como una de las mejores inmobiliarias para vivir en Chile y Latinoamérica.' },
  { image: 'sello11', text: 'Hemos sido certificados por la Cámara Chilena de la Construcción (Cchc) con el Sello Pro por trabajar bajo los mejores estándares de sostenibilidad siendo uno de los pocos grupos inmobiliarios en la industria en obtener este sello consecutivamente.' },
  { image: 'sello4', text: 'Certificados como la 4ta mejor inmobiliaria para vivir en Chile y 9na en Latinoamérica gracias al acompañamiento y la experiencia brindada a nuestros clientes en su proceso de compra o inversión. ' },
  { image: 'sello10', text: 'Prácticamente todos nuestros proyectos cuentan con Calificación Energética de Viviendas (CEV) lo que te permite acceder a una tasa rebajada en bancos asociados mientras contribuyes al medio ambiente ahorrando en calefacción y refrigeración.' },
]

export const searchFilters = {
  title1: 'Descubre',
  title2: ' nuestros proyectos',
  filters: [
    {
      id: 'ubicacion',
      label: 'Ubicación',
      placeholder: 'Todas',
      options: ['Santiago Centro', 'La Florida', 'Providencia', 'Las Condes'],
    },
    {
      id: 'tipo',
      label: 'Tipo',
      placeholder: 'Todos',
      options: ['1-2 Dorms', '2-3 Dorms'],
    },
    {
      id: 'precio',
      label: 'Precio UF',
      placeholder: 'Todos',
      options: ['Hasta 3.000 UF', '3.000-6.000 UF', '6.000+ UF'],
    },
    // {
    //   id: 'estado',
    //   label: 'Estado proyectos',
    //   placeholder: 'Todos',
    //   options: ['Inmediata'],
    // },
  ],
}

export const testimonials = {
  title: 'Nuestros propios clientes nos avalan',
  certTitle: 'Certificada 2025-2026',
  certClients: '164 clientes evaluados',
  ratingLabel: 'Rating Best Place to Live®',
  ratingScore: '4.5',
  reviews: [
    {
      id: 1,
      name: 'Herman Oettinger',
      role: 'Propietario en Osorno',
      avatar: 'avatarHerman',
      rating: 5,
      text: '"Espacios bien diseñados, que me sorprenden día a día. La empresa es muy responsable con los tiempos, encantado seguiré comprando siempre."',
      time: 'hace 17 meses',
    },
    {
      id: 2,
      name: 'Fernando Cid',
      role: 'Residente en Frutillar',
      avatar: 'avatarFernanda',
      rating: 5,
      text: '"Proyectos increíbles que han llevado las áreas comunes a un nivel completamente diferente. Es como un hotel de lujo, arquitectura, diseño e iluminación, todo pensado para hacerme sentir especial."',
      time: 'hace 19 meses',
    },
    {
      id: 3,
      name: 'John Von Achon',
      role: 'Residente en Osorno',
      avatar: 'avatarMaximiliano',
      rating: 4.5,
      text: '"El proceso de compra fue transparente y el equipo siempre disponible. Los espacios superaron mis expectativas, realmente se nota que cada detalle fue pensado con cuidado."',
      time: 'hace 21 meses',
    },
  ],
}

export const ctaContent = {
  title: 'Espacios que transforman tu forma de vivir',
  subtitle: 'Descubre proyectos diseñados para integrarse armónicamente con la naturaleza, donde cada detalle constructivo evoca calidez, luz y trascendencia.',
  inputLabel: 'Tu correo electrónico',
  inputPlaceholder: 'hola@leben.cl',
  buttonText: 'Agenda tu visita',
}

export const projectOfMonthContent = {
  title: 'María Gracia en ',
  titleHighlight: 'Leben',
  text: 'La creadora de contenido y conductora María Gracia Subercaseaux visitó junto a su marido Waldemar Méndez nuestro proyecto INN en Puerto Varas y quedó maravillada con sus espacios interiores, terminaciones, diseño y la calidez de los ambientes. Una visita muy especial que nos permite mostrar cómo este edificio no solo propone departamentos frente al lago, sino una nueva forma de disfrutar el sur con sofisticación. ',
  photo: img('inn/maria-gracia.png'),
  video: vid('maria gracia.mp4'),
  buttonText: 'Ver proyecto INN',
  buttonLink: '/proyectos/inn',
}

export const videosContent = {
  monthLabel: 'Proyecto destacado del mes',
  countLabel: '06 Obras seleccionadas',
  project: {
    name: 'Edificio INN',
    year: '2027',
    location: 'Puerto Varas, Chile',
    price: 'UF 9.816',
    mainImage: img('img1-main.jpg'),
    sideImage: img('img1-right.jpg'),
  },
  gallery: {
    title: 'Proyectos Leben',
    subtitle: 'Espacios que transforman la forma de vivir.',
    buttonText: 'Ver todos los proyectos',
  },
}

export const footerContent = {
  legal: 'La promoción se encuentra adscrita en las Bases de promoción protocolizadas con fecha 3 de diciembre de 2025 en la 45° Notaría de Santiago de don Juan Ignacio San Martín Schrüder, Repertorio N° 17917-2025. Las ilustraciones fueron elaboradas con fines ilustrativos y no constituyen necesariamente una representación exacta de la realidad. Su objetivo es mostrar una caracterización general del proyecto y las prestaciones de la departamento al momento de comprar. Ventas sujeto a confirmación con área de ventas. Esta información es virtud de lo señalado en la Ley 19.496 y según la resolución exenta N° 10.408 del 16 de julio de 2013.',
  badges: [
    { icon: 'shieldCheck', label: 'CERT' },
    { icon: 'award', label: 'ISO' },
    { icon: 'starFooter', label: 'RATED' },
  ],
  address: {
    street: 'Dr. Manuel Barros Borgoño 386',
    city: 'Providencia, Santiago, Chile',
  },
  schedule: ['Lun a Vie: 09:00 a 14:00 hrs', 'y 15:00 a 18:00 hrs'],
  phone: '+569 9129 7804',
  email: 'info@ileben.cl',
  social: ['facebook', 'instagram', 'linkedin'],
  socialLinks: {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
  },
  legalLinks: [
    'Canal de Denuncias y Consultas',
    'Acceso Colaboradores',
    'Proceso Reserva en Línea',
    'Información de la Empresa',
    'Bases Legales',
    'Trabaja en Leben',
  ],
  copyright: '© 2024 Ileben Real Estate. Todos los derechos reservados.',
  copyrightLinks: ['Privacidad', 'Términos', 'Cookies'],
}

// ============================================================
// Proyectos Page Data
// ============================================================

export const proyectosHero = {
  eyebrow: 'EXCLUSIVIDAD & DISEÑO',
  title: 'ENCUENTRA TU NUEVO HOGAR',
  subtitle: 'Creando espacios donde lo cotidiano se vuelve extraordinario. Proyectos de alta gama integrados armónicamente en el sur y centro de Chile.',
  ctaText: 'Contactar Asesor',
}

export const projectGroups = [
  {
    zone: 'Santiago Centro',
    filterLabel: 'De mayor a menor precio',
    projects: [
      {
        image: 'projSanto',
        location: 'Condor 1071',
        name: 'Edificio Santo',
        entrega: 'Inmediata',
        tipologia: '1-2 Dorms',
        price: 'UF 3.756*',
      },
      {
        image: 'projArgomedo',
        location: 'Argomedo 382',
        name: 'Edificio Argomedo',
        entrega: 'Inmediata',
        tipologia: '1-2 Dorms',
        price: 'UF 3.790*',
      },
    ],
  },
  {
    zone: 'La Florida',
    projects: [
      {
        image: 'projMood',
        location: 'Av Américo Vespucio 6608',
        name: 'Edificio Mood',
        entrega: 'Inmediata',
        tipologia: '1-2 Dorms',
        equipacion: 'Plug & Play',
        price: 'UF 2.750*',
      },
      {
        image: 'projBaum',
        location: 'El Canelo 6750',
        name: 'Edificio Baum',
        entrega: 'Inmediata',
        tipologia: '1-2 Dorms',
        equipacion: 'Plug & Play',
        price: 'UF 2.844*',
      },
    ],
  },
  {
    zone: 'Providencia',
    projects: [
      {
        image: 'projCapitanes',
        location: 'Capitanes 1445',
        name: 'Edificio Capitanes',
        entrega: 'Inmediata',
        tipologia: '2-3 Dorms, Dúplex y dúplex con Rooftop',
        price: 'UF 7.662*',
      },
      {
        image: 'projSuecia',
        location: 'Tranquila 2307',
        name: 'Edificio Suecia',
        entrega: 'Inmediata',
        tipologia: '2-3 Dorms, Dúplex y dúplex con Rooftop',
        price: 'UF 8.247*',
      },
    ],
  },
  {
    zone: 'Las Condes',
    projects: [
      {
        image: 'projPiloto',
        location: 'Av Apoquindo 1234',
        name: 'Edificio Piloto',
        entrega: 'Inmediata',
        tipologia: '2-3 Dorms',
        price: 'UF 8.906*',
      },
      {
        image: 'projCotizador',
        location: 'El Golf 567',
        name: 'Edificio Cotizador',
        entrega: 'Inmediata',
        tipologia: '2-3 Dorms',
        price: 'UF 9.120*',
        slug: 'cotizador',
      },
    ],
  },
  {
    zone: 'Puerto Varas',
    projects: [
      {
        image: 'projInn',
        location: 'Vicente Pérez Rosales 991',
        name: 'Edificio INN',
        entrega: '2027',
        tipologia: '2-3-4 Dorms',
        price: 'UF 9.816*',
        slug: 'inn',
      },
    ],
  },
]

export const valueProps = {
  eyebrow: 'El Respaldo de Elegir Leben',
  title: 'Comprometidos con los más altos estándares de calidad e innovación constructiva',
  items: [
    { num: '01', title: '6 años certificados', text: 'Lideramos en satisfacción con garantías extendidas y una postventa dedicada y personalizada para proteger tu inversión.' },
    { num: '02', title: '4tos en Chile por calidad', text: 'Reconocidos consistentemente dentro del top nacional gracias a estrictas auditorías técnicas y constructivas.' },
    { num: '03', title: 'Eficiencia Energética CEV MINVU', text: 'Diseños sustentables de última generación con calificación oficial para asegurar un consumo responsable y confort térmico superior.' },
  ],
}

export const proyectosCta = {
  eyebrow: 'Planifica tu Futuro',
  title: 'Agenda tu visita hoy mismo',
  subtitle: 'Déjanos tu correo electrónico y un asesor experto se pondrá en contacto contigo para coordinar una reunión exclusiva.',
  inputPlaceholder: 'ejemplo@correo.cl',
  buttonText: 'Enviar Solicitud',
}

export const cotizadorHero = {
  eyebrow: 'COTIZA TU HOGAR IDEAL',
  title: 'Cotizador General',
  subtitle: 'Encuentra la planta perfecta y cotiza tu próximo hogar en simples pasos.',
  ctaText: 'Comenzar',
}

export const splitCarousel = {
  slides: [
    {
      id: 1,
      title: 'Diseño que se integra con la naturaleza',
      text: 'Proyectos diseñados para integrarse armónicamente con el entorno, donde cada detalle constructivo evoca calidez, luz y trascendencia.',
      ctaLabel: 'Ver proyectos',
      ctaHref: '/proyectos',
      imageUrl: img('img1-main.jpg'),
      imageAlt: 'Proyecto Leben',
    },
    {
      id: 2,
      title: 'Áreas comunes de otro nivel',
      text: 'Arquitectura, diseño e iluminación pensados para hacer de cada día una experiencia comparable a un hotel de lujo.',
      ctaLabel: 'Ver proyecto INN',
      ctaHref: '/proyectos/inn',
      imageUrl: img('inn-overview-1.jpg'),
      imageAlt: 'Áreas comunes INN',
    },
    {
      id: 3,
      title: 'Ubicaciones privilegiadas',
      text: 'Departamentos frente al lago en Puerto Varas y proyectos en las mejores zonas del sur de Chile.',
      ctaLabel: 'Cotiza tu hogar',
      ctaHref: '/cotizador',
      imageUrl: img('inn-hero-lake.jpeg'),
      imageAlt: 'Vista al lago',
    },
  ],
}
