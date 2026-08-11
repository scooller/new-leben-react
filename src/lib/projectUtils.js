const etapaLabel = (etapa) =>
  /venta|recepcion/.test(etapa) ? 'Entrega Inmediata'
  : /obra/.test(etapa) ? 'En Construcción'
  : /terminacion/.test(etapa) ? 'Próxima Entrega'
  : etapa

/** Map raw API project → ProjectCard props */
export function mapApiProject(p) {
  const tipologia = p.tipologias
    ? [...new Set(p.tipologias.map((t) => t.programa).filter((t) => t && t !== 'LOCAL'))].join(' · ')
    : ''
  const precioDesde = p.precio_desde ? `UF ${Math.round(p.precio_desde).toLocaleString('es-CL')}` : 'UF 0'
  return {
    id: p.id,
    _raw: p,
    name: p.name,
    location: p.direccion,
    comuna: (p.comuna || 'Otros').trim(),
    image: p.salesforce_portada_url || '',
    entrega: etapaLabel(p.etapa),
    tipologia,
    precioDesde,
    slug: p.name.toLowerCase().replace(/edificio\s+/i, '').replace(/\s+/g, '-'),
  }
}

/** Group raw API projects by comuna → [{ zone, projects }] */
export function groupByComuna(projects) {
  const map = {}
  for (const p of projects) {
    const zone = (p.comuna || 'Otros').trim()
    if (!map[zone]) map[zone] = []
    map[zone].push(mapApiProject(p))
  }
  return Object.entries(map).map(([zone, projects]) => ({ zone, projects }))
}
