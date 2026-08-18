const etapaLabel = (etapa) =>
  /venta|recepcion/.test(etapa) ? 'Entrega Inmediata'
  : /obra/.test(etapa) ? 'En Construcción'
  : /terminacion/.test(etapa) ? 'Próxima Entrega'
  : etapa

/** Collapse tipologías into grouped ranges: '2D - 3D - 4D · 2B - 3B - 4B' */
export function tipologiaSummary(tipologias) {
  const dorms = new Set()
  const baths = new Set()
  const others = new Set()
  for (const t of tipologias || []) {
    if (!t.programa || t.programa === 'LOCAL' || t.tipo_producto === 'LOCAL') continue
    const mD = t.programa.trim().match(/^(\d+)\s*D/i)
    const mB = t.programa.trim().match(/\+\s*(\d+)\s*B/i)
    if (mD && mB) { dorms.add(+mD[1]); baths.add(+mB[1]) }
    else others.add(t.programa.trim())
  }
  const parts = []
  if (dorms.size) parts.push([...dorms].sort((a, b) => a - b).map((d) => `${d}D`).join(' - '))
  if (baths.size) parts.push([...baths].sort((a, b) => a - b).map((b) => `${b}B`).join(' - '))
  return [...parts, ...others].join(' · ')
}

/** Map raw API project → ProjectCard props */
export function mapApiProject(p) {
  const valid = (p.tipologias || []).filter((t) => t.programa && t.programa !== 'LOCAL' && t.tipo_producto !== 'LOCAL')
  const tipologia = tipologiaSummary(p.tipologias)
  const minTip = valid.filter((t) => t.precio_desde).map((t) => t.precio_desde)
  const desde = minTip.length ? Math.min(...minTip) : p.precio_desde
  const precioDesde = desde ? `UF ${Math.round(desde).toLocaleString('es-CL')}` : 'UF 0'
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
