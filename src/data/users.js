// ============================================================
// Mock User Data — Portal de Usuario (mockup)
// Two demo accounts: comprador + broker
// ============================================================

export const mockUsers = [
  {
    id: 1,
    email: 'comprador@demo.cl',
    password: 'demo123',
    role: 'usuario',
    name: 'María González',
    rut: '12.345.678-9',
    phone: '+56 9 8765 4321',
    avatar: null,
    property: {
      projectSlug: 'inn',
      projectName: 'Edificio INN',
      unit: 'Depto 502',
      floor: '5° piso',
      typology: '3D + 2B',
      surface: '92 m² útiles',
      orientation: 'Oriente',
      price: 'UF 11.250',
      paymentMethod: '10% pie · Mutuo bancario 80% · 10% contra entrega',
      address: 'Vicente Pérez Rosales 991, Puerto Varas',
    },
    progress: {
      percent: 35,
      milestones: [
        { label: 'Permiso de edificación', status: 'done', date: 'Mar 2025' },
        { label: 'Obras preliminares', status: 'done', date: 'Jun 2025' },
        { label: 'Cimientos', status: 'done', date: 'Sep 2025' },
        { label: 'Estructura', status: 'current', date: 'Ene 2026' },
        { label: 'Terminaciones', status: 'pending', date: 'Jul 2026' },
        { label: 'Entrega', status: 'pending', date: 'Dic 2026' },
      ],
    },
    documents: [
      { name: 'Promesa de Compraventa', file: '#', icon: 'file-text' },
      { name: 'Brochure del Proyecto', file: '#', icon: 'book-open' },
      { name: 'Ficha Técnica Depto 502', file: '#', icon: 'clipboard-list' },
      { name: 'Contrato de Reserva', file: '#', icon: 'file-signature' },
    ],
    news: [
      { id: 1, title: 'Avance de obra Enero 2026', excerpt: 'Las obras estructurales alcanzaron el nivel +5. Mira las fotos del progreso.', date: '15 Ene 2026', tag: 'Obra' },
      { id: 2, title: 'Nuevas terminaciones disponibles', excerpt: 'Te invitamos a conocer las opciones de equipamiento premium Franke.', date: '08 Ene 2026', tag: 'Diseño' },
      { id: 3, title: 'Reunión de propietarios — Marzo', excerpt: 'Agendamos la próxima reunión informativa para el 14 de marzo.', date: '02 Ene 2026', tag: 'Evento' },
    ],
    notifications: [
      { id: 1, text: 'Tu promesa de compraventa fue firmada exitosamente', date: 'hace 2 días', unread: true, icon: 'check-circle' },
      { id: 2, text: 'Nuevo avance de obra disponible (35%)', date: 'hace 5 días', unread: true, icon: 'bar-chart' },
      { id: 3, text: 'Reunión de propietarios agendada para Marzo', date: 'hace 1 semana', unread: false, icon: 'calendar' },
    ],
    assignedBroker: {
      name: 'Fernanda Sandoval',
      phone: '+56 9 9912 9780',
      email: 'fernanda@leben.cl',
    },
  },
  {
    id: 2,
    email: 'broker@demo.cl',
    password: 'demo123',
    role: 'broker',
    name: 'Carlos Muñoz',
    rut: '9.876.543-2',
    phone: '+56 9 1234 5678',
    avatar: null,
    broker: {
      tier: 'SILVER',
      nextTier: 'GOLD',
      salesUF: 7200,
      totalSales: 8,
      rank: 4,
      totalBrokers: 28,
    },
    sales: [
      { id: 1, client: 'Familia Rojas', project: 'Edificio INN', unit: 'Dpto 301', date: '12 Dic 2025', commission: 'UF 45,2', status: 'pagada' },
      { id: 2, client: 'M. Tapia', project: 'Edificio INN', unit: 'Dpto 805', date: '28 Nov 2025', commission: 'UF 52,1', status: 'pagada' },
      { id: 3, client: 'P. Vergara', project: 'Baum', unit: 'Dpto 402', date: '15 Nov 2025', commission: 'UF 38,7', status: 'pendiente' },
      { id: 4, client: 'Familia Cortés', project: 'Edificio INN', unit: 'Dpto 1201', date: '02 Nov 2025', commission: 'UF 61,3', status: 'pagada' },
      { id: 5, client: 'J. Iglesias', project: 'Capitanes', unit: 'Casa B', date: '18 Oct 2025', commission: 'UF 55,0', status: 'pagada' },
    ],
    events: [
      { id: 1, title: 'Lanzamiento Edificio INN — Etapa 2', date: '22 Feb 2026', time: '19:00', location: 'Hotel Cabaña del Lago, Puerto Varas' },
      { id: 2, title: 'Capacitación: Nuevas normativas', date: '05 Mar 2026', time: '10:00', location: 'Online (Zoom)' },
      { id: 3, title: 'Premiación Círculo de Brokers', date: '28 Mar 2026', time: '20:00', location: 'Casino Enjoy, Puerto Varas' },
    ],
    resources: [
      { name: 'Brochure INN', file: '#', type: 'PDF' },
      { name: 'Brochure Baum', file: '#', type: 'PDF' },
      { name: 'Brochure Capitanes', file: '#', type: 'PDF' },
      { name: 'Logos Leben (pack)', file: '#', type: 'ZIP' },
      { name: 'Fichas técnicas — Todos los proyectos', file: '#', type: 'PDF' },
      { name: 'Videos promocionales', file: '#', type: 'MP4' },
      { name: 'Imágenes de render 4K', file: '#', type: 'ZIP' },
    ],
    notifications: [
      { id: 1, text: 'Comisión de UF 38,7 pendiente de pago (P. Vergara)', date: 'hace 3 días', unread: true, icon: 'dollar-sign' },
      { id: 2, text: 'Estás a 3 ventas de subir a Oro', date: 'hace 1 semana', unread: true, icon: 'trophy' },
      { id: 3, text: 'Nuevo evento: Lanzamiento INN Etapa 2', date: 'hace 1 semana', unread: false, icon: 'calendar' },
    ],
  },
]
