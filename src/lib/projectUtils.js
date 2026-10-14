const etapaLabel = (etapa) =>
  /venta|recepcion/.test(etapa) ? 'Entrega Inmediata'
  : /obra/.test(etapa) ? 'En Construcción'
  : /terminacion/.test(etapa) ? 'Próxima Entrega'
  : etapa

/** Collapse tipologías into grouped ranges: '2D - 3D - 4D' (only dorms) */
export function tipologiaSummary(tipologias) {
  const dorms = new Set()
  const others = new Set()
  for (const t of tipologias || []) {
    if (!t.programa || t.programa === 'LOCAL' || t.tipo_producto === 'LOCAL') continue
    const mD = t.programa.trim().match(/^(\d+)\s*D/i)
    if (mD) {
      dorms.add(+mD[1])
    } else {
      others.add(t.programa.trim())
    }
  }
  const parts = []
  if (dorms.size) parts.push([...dorms].sort((a, b) => a - b).map((d) => `${d}D`).join(' - '))
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

export const ORIENTACION_LABELS = {
  N: 'Norte', S: 'Sur', E: 'Oriente', O: 'Poniente',
  NE: 'Nor-Oriente', NO: 'Nor-Poniente',
  SE: 'Sur-Oriente', SO: 'Sur-Poniente',
  P: 'Patio', SP: 'Sin Patio',
}

/** Group raw API projects by comuna → [{ zone, projects }] */
export function groupByComuna(projects) {
  const groups = Object.groupBy(projects || [], (p) => (p.comuna || 'Otros').trim())
  return Object.entries(groups).map(([zone, list]) => ({
    zone,
    projects: list.map(mapApiProject),
  }))
}

export const PROJECT_DISPLAY_ORDER = [
  'baum',
  'mood',
  'livingtown',
  'argomedo',
  'santo',
  'indi',
  'capitanes',
  'suecia',
  'bold',
  'inn',
  'indigo',
  'nordico',
  'parquegermania',
]

export function normalizeProjectName(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/edificio\s+/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

export function getProjectOrderRank(name = '', orderList = PROJECT_DISPLAY_ORDER) {
  const norm = normalizeProjectName(name)
  const idx = orderList.findIndex((target) => normalizeProjectName(target) === norm)
  if (idx !== -1) return idx

  // Fallback: check if target is an exact word in the project name
  const words = String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/edificio\s+/i, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

  const wordIdx = orderList.findIndex((target) => words.includes(normalizeProjectName(target)))
  return wordIdx === -1 ? 9999 : wordIdx
}

export function sortProjectsByCustomOrder(projects = [], orderList = PROJECT_DISPLAY_ORDER) {
  return [...projects].sort((a, b) => {
    const nameA = typeof a === 'string' ? a : (a?.name || a?.title || '')
    const nameB = typeof b === 'string' ? b : (b?.name || b?.title || '')
    const rankA = getProjectOrderRank(nameA, orderList)
    const rankB = getProjectOrderRank(nameB, orderList)
    if (rankA !== rankB) return rankA - rankB
    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' })
  })
}

