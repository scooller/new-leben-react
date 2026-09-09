export const cookiesPageContent = {
  hero: {
    title: 'POLÍTICA DE COOKIES Y SEGURIDAD',
    subtitle: 'Marco de Transparencia conforme a la Ley N° 21.719 de Chile',
    badge: 'Protección de Datos • Chile',
    heroImage: '/images/home/hero-institucional.jpg',
  },
  responsible: {
    razonSocial: 'Inmobiliaria Cenit Limitada (Leben Grupo Inmobiliario)',
    rut: '76.065.957-6',
    direccion: 'Dr. Manuel Barros Borgoño 386, Providencia, Santiago, Chile',
    emailContacto: 'info@ileben.cl',
    telefono: '+569 9129 7804',
    organoRegulador: 'Agencia de Protección de Datos Personales (APDP) de Chile',
  },
  sections: [
    {
      id: 'marco-legal',
      title: '1. Marco Legal y Compromiso de Privacidad',
      content: [
        'En Inmobiliaria Cenit Limitada (en adelante, "Leben" o la "Empresa"), nos comprometemos a garantizar la protección, confidencialidad e integridad de los datos personales de nuestros usuarios, compradores, inversionistas y brokers.',
        'La presente Política de Cookies y Seguridad se rige por la legislación chilena vigente, en especial por la Ley N° 21.719 sobre Protección de Datos Personales (que moderniza la Ley N° 19.628 e instituye la Agencia de Protección de Datos Personales - APDP), la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores y las directrices interpretativas del Servicio Nacional del Consumidor (SERNAC).',
        'Bajo estos estándares, Leben solo instala y utiliza cookies y tecnologías de rastreo no esenciales previa obtención de un consentimiento libre, previo, informado, específico e inequívoco del titular, asegurando siempre mecanismos expeditos para su revocación o modificación.',
      ],
    },
    {
      id: 'que-son-cookies',
      title: '2. ¿Qué son las Cookies y qué tecnologías utilizamos?',
      content: [
        'Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario al acceder a determinadas páginas. Permiten recordar acciones, preferencias de sesión (como navegación, cálculos en el cotizador o estado de autenticación) y recopilar información estadística o publicitaria.',
        'Además de las cookies convencionales, Leben puede utilizar tecnologías equivalentes como píxeles de seguimiento (web beacons), almacenamiento local (HTML5 localStorage) y etiquetas de terceros (Google Tag Manager) para optimizar la navegación y gestionar la atribución comercial.',
      ],
    },
    {
      id: 'categorias-cookies',
      title: '3. Tipos de Cookies y Finalidades Específicas',
      categories: [
        {
          name: 'Cookies Técnicas y Estrictamente Necesarias',
          status: 'Siempre activas (Obligatorias)',
          description:
            'Son indispensables para el funcionamiento operativo y seguro del sitio web. Permiten la navegación fluida, la distribución de tráfico, la seguridad ante ataques y la persistencia de datos indispensables en el cotizador y proceso de reserva.',
          examples: 'Token de sesión, verificación anti-CSRF, registro de consentimiento de cookies (lb_cookie_consent_v1).',
          retention: 'Sesión o hasta 12 meses.',
        },
        {
          name: 'Cookies de Rendimiento y Analítica',
          status: 'Requieren Consentimiento Previo',
          description:
            'Recopilan información anónima o seudónima sobre la interacción de los usuarios en la web: páginas más visitadas, tiempo de permanencia, tasas de rebote y rutas de navegación. Nos ayudan a mejorar la usabilidad y rendimiento del portal.',
          examples: 'Google Analytics 4 (_ga, _ga_*).',
          retention: 'Entre 24 horas y 2 años.',
        },
        {
          name: 'Cookies de Publicidad Digital, Remarketing y Perfilamiento',
          status: 'Requieren Consentimiento Previo',
          description:
            'Son utilizadas para gestionar espacios publicitarios en plataformas de terceros y mostrar anuncios relevantes sobre proyectos Leben acordes a los intereses demostrados por el usuario. Permiten medir la eficacia de nuestras campañas y evitar la saturación de anuncios repetitivos.',
          examples: 'Píxel de Meta (Facebook/Instagram Ads), Google Ads Remarketing, Google Tag Manager.',
          retention: 'Hasta 12 meses.',
        },
        {
          name: 'Tecnologías para Mailings, Prospección y Comunicaciones Comerciales',
          status: 'Requieren Consentimiento Previo',
          description:
            'Cuando el usuario solicita información sobre un proyecto, cotiza o acepta recibir novedades, empleamos balizas de seguimiento para saber si nuestros correos fueron abiertos y qué enlaces resultaron de interés. Esto nos permite enviar ofertas personalizadas, promociones de proyectos y lanzamientos pertinentes, respetando siempre el derecho de cancelación.',
          examples: 'Píxeles de seguimiento de correo electrónico, enlaces de atribución en campañas de emailing.',
          retention: 'Hasta que el usuario revoque su suscripción o consentimiento.',
        },
      ],
    },
    {
      id: 'publicidad-mailing',
      title: '4. Uso de Datos para Marketing y Envíos Masivos (Mailing)',
      content: [
        'En conformidad con el Artículo 28 bis de la Ley N° 19.496 y la Ley N° 21.719, todo envío de correo electrónico con fines de publicidad, ofertas o promociones de proyectos Leben cuenta con una vía expedita, automática y gratuita para solicitar la suspensión inmediata de los envíos ("Desuscribirse").',
        'No comercializamos, cedemos ni arrendamos bases de datos con información personal a terceras empresas no relacionadas. Los datos recopilados a través de formularios y cookies publicitarias se emplean exclusivamente para gestionar la relación comercial entre Leben y el titular.',
        'El usuario tiene derecho absoluto a oponerse al tratamiento de sus datos con fines de mercadotecnia directa o elaboración de perfiles comerciales en cualquier momento y sin costo alguno.',
      ],
    },
    {
      id: 'transferencias-internacionales',
      title: '5. Transferencias Internacionales y Proveedores de Servicios',
      content: [
        'Para operar nuestras herramientas de análisis (Google LLC), publicidad en redes sociales (Meta Platforms Inc.) y almacenamiento en la nube, Leben hace uso de plataformas de clase mundial ubicadas principalmente en Estados Unidos y la Unión Europea.',
        'Dichas transferencias se encuentran respaldadas por cláusulas contractuales tipo, acuerdos de procesamiento de datos con exigencias de encriptación (TLS/SSL) y medidas de seguridad adecuadas conformes a las exigencias de la Ley N° 21.719 de Chile.',
      ],
    },
    {
      id: 'derechos-arcop',
      title: '6. Derechos de los Titulares (ARCOP-B) según la Ley 21.719',
      rights: [
        {
          code: 'Acceso',
          desc: 'Conocer qué datos personales tratamos sobre ti, su origen y los destinatarios.',
        },
        {
          code: 'Rectificación',
          desc: 'Solicitar la corrección o actualización de datos inexactos, desactualizados o incompletos.',
        },
        {
          code: 'Cancelación / Supresión',
          desc: 'Pedir la eliminación de tus datos cuando carezcan de fundamento legal o hayan cumplido su finalidad.',
        },
        {
          code: 'Oposición',
          desc: 'Negarte al tratamiento de tus datos para finalidades específicas como publicidad, marketing o mailing.',
        },
        {
          code: 'Portabilidad',
          desc: 'Obtener tus datos en un formato electrónico estructurado de uso común.',
        },
        {
          code: 'Bloqueo',
          desc: 'Suspender temporalmente cualquier operación de tratamiento mientras se tramita una rectificación o supresión.',
        },
      ],
      howToExercise:
        'Para ejercer cualquiera de estos derechos, el titular debe enviar una solicitud formal al correo info@ileben.cl acompañando fotocopia o imagen de su Cédula de Identidad para verificar su titularidad. Responderemos sin costo dentro de los plazos legales establecidos por la normativa chilena.',
    },
    {
      id: 'revocacion-navegadores',
      title: '7. Cómo Modificar o Revocar tu Consentimiento',
      content: [
        'El usuario puede cambiar o retirar su consentimiento para el uso de cookies en cualquier momento a través del botón flotante disponible en la esquina inferior izquierda de este sitio web.',
        'Adicionalmente, los principales navegadores permiten bloquear o eliminar cookies mediante su panel de configuración:',
      ],
      browsers: [
        { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
        { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies' },
        { name: 'Apple Safari', url: 'https://support.apple.com/es-es/guide/safari/sfri11471/mac' },
        { name: 'Microsoft Edge', url: 'https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d' },
      ],
    },
    {
      id: 'vigencia-actualizaciones',
      title: '8. Vigencia y Actualizaciones',
      content: [
        'La presente política rige desde enero de 2025 y se actualiza periódicamente para cumplir con los dictámenes de la Agencia de Protección de Datos Personales (APDP) y las reformas legislativas.',
        'Cualquier modificación sustancial será informada a través del banner de consentimiento o en la portada de nuestro sitio web.',
      ],
    },
  ],
}
