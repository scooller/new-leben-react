// ============================================================
// Invest Page Data — from Figma "Invest" (node 2260:1044)
// ============================================================

const img = (name) => `${import.meta.env.BASE_URL}images/invest/${name}`

export const investData = {
  // --- Hero Section ---
  hero: {
    eyebrow: 'LEBEN INVEST, INVIERTE INTELIGENTE',
    title: 'Te ayudamos a tener tu nuevo depto de inversión <b class="red">SIN PIE*</b>',
    subtitle:
      '*Compra sin pie es solo para créditos con 90% de aprobación. En Leben Invest tu inversión es segura.',
    ctaText: 'QUIERO INVERTIR',
    ctaHref: '#formulario',
    backgroundImage: img('hero-bg.jpg'),
    quickBadges: [
      { label: '4TO Bptl', href: '#oportunidad' },
      { label: 'COTIZAR', href: '/cotizador' },
      { label: 'BROKER', href: '/brokers' },
      { label: 'CLIENTES', href: '/login' },
    ],
  },

  // --- Value Prop Section ---
  valueProp: {
    eyebrow: 'Oportunidad Única',
    title: 'Es el último momento de aprovechar las <span class="red">mejores promociones</span> para hacer la inversión de tu vida',
    description:
      'Leben Invest es el área de Inversiones de Leben, con condiciones y beneficios exclusivos para inversionistas como tú.',
    prompt: '¿Por qué invertir con Leben Invest?',
    image: img('value-prop.jpg'),
    items: [
      {
        icon: 'percent',
        text: 'Te ayudamos con el 10% de tu Pie.',
      },
      {
        icon: 'calendar',
        text: 'El resto págalo hasta 60 cuotas sin interés.',
      },
      {
        icon: 'shield-check',
        text: 'Arriendo garantizado* hasta 36 meses.',
        footnote: '*Exclusivo para proyectos en la región metropolitana.',
      },
    ],
  },

  // --- Services / Lead Form Section ---
  leadForm: {
    title: '¿Listo para invertir en un depto. con 0% pie?',
    subtitle: 'Completa tus datos para comenzar a explorar opciones',
    rentOptions: [
      'Menos de $1.000.000',
      'Entre $1.000.000 y $1.800.000',
      'Entre $1.800.000 y $2.500.000',
      'Entre $2.500.000 y $3.500.000',
      'Sobre $3.500.000',
    ],
    communes: [
      'Santiago Centro',
      'La Florida',
      'Independencia',
      'San Miguel',
      'Ñuñoa',
      'Macul',
      'Valdivia',
      'Temuco',
    ],
    projects: [
      'Edificio Indi (Independencia)',
      'Edificio Mood (La Florida)',
      'Edificio Living Town (Santiago)',
      'Edificio Bold (Valdivia)',
      'Edificio Alto Los Leones (Providencia)',
      'Edificio Qantus (Ñuñoa)',
    ],
    submitText: 'Enviar',
    disclaimer: 'Al enviar aceptas que un asesor experto de Leben Invest se comunique contigo para evaluar tu perfil.',
  },

  // --- Expert Advisory Section ---
  advisory: {
    eyebrow: 'Soporte Profesional',
    title: 'Asesoría experta para decisiones inteligentes',
    description:
      'Invertir en propiedades no tiene que ser estresante. Nuestro equipo multidisciplinario evalúa constantemente las tendencias de mercado en Chile para entregarte alternativas sólidas y de bajo riesgo.',
    image: img('advisory.jpg'),
    cards: [
      {
        icon: 'trending-up',
        title: 'Expertos en Análisis Financiero',
        description:
          'Nuestro equipo no solo evalúa proyectos, sino que también optimiza las decisiones de inversión en función de tus objetivos.',
      },
      {
        icon: 'briefcase',
        title: 'Asesoramiento Integral',
        description:
          'Desde la selección del inmueble hasta la administración del arriendo, ofrecemos un servicio llave en mano que reduce tu carga operativa y maximiza tu retorno.',
      },
      {
        icon: 'building',
        title: 'Acceso a Proyectos Exclusivos',
        description:
          'Trabajamos con desarrolladores que ofrecen propiedades con alta demanda de arriendo y excelente proyección de valorización.',
      },
      {
        icon: 'check-circle',
        title: 'Simplicidad y Eficiencia',
        description:
          'Nos encargamos de todos los detalles para que tu experiencia sea fluida, desde la compra hasta la generación de ingresos pasivos.',
      },
    ],
  },

  // --- Featured Projects Section ---
  projects: {
    title: 'En Leben tenemos las mejores oportunidades para invertir',
    filters: ['TODOS', 'SANTIAGO', 'REGIONES'],
    items: [
      {
        id: 'indi',
        title: 'Edificio Indi',
        tag: 'Entrega Inmediata',
        location: 'Vallenar 2070 Independencia',
        typology: 'Depto 207 / 1D+1B',
        price: 'UF 2.484',
        region: 'SANTIAGO',
        image: img('project-indi.jpg'),
        href: '/proyectos/edificio-indi',
      },
      {
        id: 'mood',
        title: 'Edificio Mood',
        tag: 'Entrega Inmediata',
        location: 'Américo Vespucio 6608 La Florida',
        typology: 'Depto 209 / 1D+1B',
        price: 'UF 2.750',
        region: 'SANTIAGO',
        image: img('project-mood.jpg'),
        href: '/proyectos/edificio-mood',
      },
      {
        id: 'living-town',
        title: 'Edificio Living Town',
        tag: 'Venta en Blanco - Segundo semestre 2027',
        location: 'Eyzaguirre 580 Stgo. Centro',
        typology: 'Depto 206 / 1D+1B',
        price: 'UF 2.812',
        region: 'SANTIAGO',
        image: img('project-living-town.jpg'),
        href: '/proyectos/edificio-living-town',
      },
      {
        id: 'bold',
        title: 'Edificio Bold',
        tag: 'Entrega Inmediata',
        location: 'Chacabuco 637 Valdivia',
        typology: 'Depto 209 / 1D+1B',
        price: 'UF 3.332',
        region: 'REGIONES',
        image: img('project-bold.jpg'),
        href: '/proyectos/edificio-bold',
      },
    ],
  },

  // --- Investment Process Section ---
  process: {
    title: 'Te ayudamos a invertir sin complicarte',
    subtitle: 'Nuestro proceso de inversión está diseñado para que cada paso sea eficiente y muy claro.',
    steps: [
      {
        number: '1',
        title: 'Asesoría personalizada para inversionistas',
        description:
          'Desde el primer momento, analizamos tu perfil financiero y objetivos para encontrar la mejor oportunidad de inversión.',
        image: img('step-1.jpg'),
        icon: 'users',
      },
      {
        number: '2',
        title: 'Selección de propiedades con alta rentabilidad',
        description:
          'Elegimos departamentos en ubicaciones estratégicas con alta demanda para arriendo, garantizando plusvalía y retorno de inversión.',
        image: img('step-2.jpg'),
        icon: 'search',
      },
      {
        number: '3',
        title: 'Gestión de financiamiento sin complicaciones',
        description:
          'Te acompañamos en la búsqueda del mejor crédito hipotecario y gestionamos convenios con bancos y entidades financieras.',
        image: img('step-3.jpg'),
        icon: 'building',
      },
      {
        number: '4',
        title: 'Firma y entrega de tu propiedad',
        description:
          'Nos aseguramos de que todo el proceso legal y administrativo sea fluido, para que empieces a generar ingresos desde el día uno.',
        image: img('step-4.jpg'),
        icon: 'file-text',
      },
    ],
  },

  // --- Smart Section (Dark CTA Callout) ---
  smartBanner: {
    eyebrow: 'Tranquilidad Total',
    title: 'Tu nuevo depto con<br /><span class="red">SIN PIE y ARRIENDO<br />GARANTIZADO*</span>',
    disclaimer:
      '* COMPRA SIN PIE ES SOLO PARA CRÉDITOS CON 90% DE APROBACIÓN. EXCLUSIVO PARA PROYECTOS EN LA REGIÓN METROPOLITANA.',
    description:
      'Invertir nunca fue tan fácil: deptos. con opción 0 pie y pago en 60 cuotas. Tú recibes el arriendo desde el primer día.',
    ctaText: 'Quiero asesorarme ahora',
    ctaHref: '#formulario',
    image: img('smart-banner.jpg'),
  },

  // --- FAQ Section ---
  faq: {
    eyebrow: 'Soporte',
    title: 'Preguntas frecuentes de nuestros inversionistas',
    items: [
      {
        question: '¿Qué es el Cap rate?',
        answer:
          'El Capitalization Rate (Cap Rate) es la tasa de rentabilidad anual que genera una propiedad de inversión a través de sus arriendos en relación a su valor de compra. Se calcula dividiendo el ingreso operacional neto anual entre el precio de la propiedad.',
      },
      {
        question: '2. ¿Cuál es el beneficio de la 55bis?',
        answer:
          'El artículo 55 bis de la Ley de Impuesto a la Renta permite a las personas naturales rebajar los intereses pagados por créditos hipotecarios de su base imponible de impuesto global complementario, generando una devolución o disminución tributaria significativa.',
      },
      {
        question: '3. ¿Qué es el IVA inmobiliario?',
        answer:
          'Es el impuesto que grava la venta habitual de bienes inmuebles nuevos construidos por empresas inmobiliarias o constructoras. En Chile está incorporado en el valor final de venta y cuenta con créditos especiales para el comprador según la normativa vigente.',
      },
      {
        question: '4. ¿Cuánto debo tener ahorrado para invertir?',
        answer:
          'Con el modelo Leben Invest puedes acceder a opciones con 0% pie o pagar el pie en hasta 60 cuotas sin interés, lo que te permite iniciar tu inversión inmobiliaria con un ahorro inicial mínimo comparado con el mercado tradicional.',
      },
      {
        question: '5. ¿Cuántas propiedades puedo comprar?',
        answer:
          'No existe un límite legal en la cantidad de propiedades que puedes adquirir. El límite lo determina tu capacidad de endeudamiento y sujeto de crédito ante las instituciones financieras. Nuestro equipo te asesora para estructurar compras escalables.',
      },
      {
        question: '¿Qué es un crédito hipotecario?',
        answer:
          'Es un préstamo a mediano o largo plazo (generalmente entre 15 y 30 años) otorgado por un banco o entidad financiera para comprar una propiedad, donde el propio inmueble queda como garantía (hipoteca) hasta la cancelación de la deuda.',
      },
      {
        question: '¿Cuáles son los requisitos para un crédito hipotecario?',
        answer:
          'Tener renta líquida acorde al dividendo proyectado (generalmente el dividendo no debe superar el 25% al 30% de tu sueldo), antigüedad laboral mínima de 1 año, buen historial comercial (sin Dicom) y nacionalidad chilena o residencia definitiva.',
      },
      {
        question: '¿Qué implica un crédito hipotecario?',
        answer:
          'Implica el compromiso mensual de pago del dividendo, el cual incluye amortización de capital, intereses asociados y seguros obligatorios de desgravamen e incendio con sismo. En propiedades para inversión, el arriendo cubre habitualmente este compromiso.',
      },
      {
        question: '¿Qué es una tasa de interés?',
        answer:
          'Es el costo del dinero prestado expresado en un porcentaje anual. En Chile los créditos hipotecarios suelen estructurarse en UF con tasa fija, mixta o variable, siendo la tasa fija la más recomendada para inversionistas por su previsibilidad.',
      },
      {
        question: '10. ¿Qué se entiende por vivienda DFL-2?',
        answer:
          'Es una propiedad habitacional con superficie útil no superior a 140 m². Otorga beneficios tributarios como 50% de descuento en el pago de contribuciones durante años determinados y exención del pago de impuesto a la renta por arriendos para las primeras dos viviendas DFL-2.',
      },
    ],
    bottomCta: {
      text: '¿Tienes más dudas? Hablemos con confianza',
      btnText: 'Quiero invertir',
      href: '#formulario',
    },
  },
}
