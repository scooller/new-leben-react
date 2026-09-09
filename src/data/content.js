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
  logoIcon: img('brand/icon.svg'),
  logoText: img('brand/leben.svg'),
  logoBest: img('brand/sello.png'),
  sello5: img('brand/sello-5.svg'),
  sello4: img('brand/sello4.png'),
  sello10: img('brand/logo-isotipo.webp'),
  sello11: img('brand/sello11.png'),
  avatarHerman: img('home/avatar-herman.jpg'),
  avatarFernanda: img('home/avatar-fernanda.jpg'),
  avatarMaximiliano: img('home/avatar-maximiliano.jpg'),
  ctaSection: img('home/banner.jpg'),
  star: img('icons/star.svg'),
  starHalf: img('icons/star-half.svg'),
  share: img('icons/share.svg'),
  starSmall: img('icons/star-small.svg'),
  shareSmall: img('icons/share-small.svg'),
  starHalfSmall: img('icons/star-half-small.svg'),
  arrowRight: img('icons/arrow-right.svg'),
  line: img('icons/line.svg'),
  pareja: img('home/pareja.png'),
  bgLogo: img('home/hoja.png'),
  proyectosHero: img('proyectos/proyectos-hero.jpg'),
  proyectosCta: img('proyectos/proyectos-cta.jpg'),
  bgLogin: img('Fondo_cotizar.jpg'),
  user: img('icons/user.svg'),
  mapPin: img('icons/map-pin.svg'),
  building: img('icons/building.svg'),
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
  { image: 'sello5', text: 'Certificados <b>6 años consecutivos</b> como una de las mejores inmobiliarias para vivir.' },
  { image: 'sello4', text: '<b>Top-4 Chile y Top-9 Latinoamérica</b> 2025 en satisfacción y acompañamiento al cliente.' },
  { image: 'sello11', text: 'Certificados por la CChC con el <b>Sello PRO</b>, respaldando nuestros estándares de sostenibilidad.' },
  { image: 'sello10', text: 'Proyectos con <b>Certificación Energética</b> con beneficios crediticios y ahorro en energía.' },
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

export const projectOfMonthContent = {
  title: 'María Gracia en ',
  titleHighlight: 'Leben',
  text: 'La creadora de contenido y conductora María Gracia Subercaseaux visitó junto a su marido Waldemar Méndez nuestro proyecto INN en Puerto Varas y quedó maravillada con sus espacios interiores, terminaciones, diseño y la calidez de los ambientes. Una visita muy especial que nos permite mostrar cómo este edificio no solo propone departamentos frente al lago, sino una nueva forma de disfrutar el sur con sofisticación. ',
  photo: img('inn/RAPC_EXT_Elevacioen-Tarde_Media16.jpg'),
  video: vid('maria gracia.mp4'),
  buttonText: 'Ver proyecto INN',
  buttonLink: '/inn-test',
}

export const videosContent = {
  monthLabel: 'Proyecto destacado del mes',
  countLabel: '06 Obras seleccionadas',
  project: {
    name: 'Edificio INN',
    location: 'Puerto Varas, Chile',
    price: 'UF 9.816',
    mainImage: img('home/img1-main.jpg'),
    sideImage: img('home/img1-right.jpg'),
  },
  gallery: {
    title: 'Proyectos Leben',
    subtitle: 'Espacios que transforman la forma de vivir.',
    buttonText: 'Ver todos los proyectos',
  },
}

export const footerContent = {
  legal: 'La promoción se encuentra adscrita en las Bases de promoción protocolizadas con fecha 3 de diciembre de 2025 en la 45° Notaría de Santiago de don Juan Ignacio San Martín Schrüder, Repertorio N° 17917-2025. Las ilustraciones fueron elaboradas con fines ilustrativos y no constituyen necesariamente una representación exacta de la realidad. Su objetivo es mostrar una caracterización general del proyecto y las prestaciones de la departamento al momento de comprar. Ventas sujeto a confirmación con área de ventas. Esta información es virtud de lo señalado en la Ley 19.496 y según la resolución exenta N° 10.408 del 16 de julio de 2013.',
  address: {
    street: 'Dr. Manuel Barros Borgoño 386 ',
    city: 'Providencia, Santiago, Chile',
  },
  schedule: ['Lun a Vie: 09:00 a 14:00 hrs ', 'y 15:00 a 18:00 hrs'],
  phone: '+569 9129 7804',
  email: 'info@ileben.cl',
  social: ['facebook', 'instagram', 'linkedin'],
  socialLinks: {
    facebook: 'https://www.facebook.com/inmobiliarialeben',
    instagram: 'https://www.instagram.com/inmobiliarialeben',
    linkedin: 'https://www.linkedin.com/company/ileben/posts/?feedView=all',
  },
  copyright: '© 2024 Leben. Todos los derechos reservados.',
  copyrightLinks: ['Bases legales', 'Información de la empresa', 'Privacidad'],
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
