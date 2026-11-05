const etapaLabel = (etapa) =>
  /venta|recepcion/.test(etapa) ? 'Entrega Inmediata'
  : /obra/.test(etapa) ? 'En Construcción'
  : /terminacion/.test(etapa) ? 'Próxima Entrega'
  : etapa

/** Format number with Chilean locale and up to maxDecimals (default 2) */
export function formatNumber(val, maxDecimals = 2) {
  const num = typeof val === 'number' ? val : parseFloat(val)
  if (num === null || num === undefined || isNaN(num)) return '0'
  return num.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  })
}

/** Format UF price as 'UF 3.128,72' or 'UF 0' */
export function formatPriceUF(val) {
  const num = typeof val === 'number' ? val : parseFloat(val)
  if (!num || isNaN(num)) return 'UF 0'
  return `UF ${formatNumber(num, 2)}`
}

/** Format surface in m² with up to 2 decimal places */
export function formatMeters(val) {
  const num = typeof val === 'number' ? val : parseFloat(val)
  if (!num || isNaN(num)) return '- m²'
  return `${formatNumber(num, 2)} m²`
}

/** Format real estate programa (e.g. '1D+1B', '2D+2B', '3 dorm + 2 baño', '3D+3B Dup') */
export function formatPrograma(str) {
  if (!str) return '—'
  let res = String(str).trim()
  res = res.replace(/(\d+)\s*(?:dorms?|D\b)/gi, (_, count) => {
    const n = parseInt(count, 10)
    return n === 1 ? '1 dormitorio' : `${n} dormitorios`
  })
  res = res.replace(/(\d+)\s*(?:baños?|B\b)/gi, (_, count) => {
    const n = parseInt(count, 10)
    return n === 1 ? '1 baño' : `${n} baños`
  })
  res = res.replace(/\bdup\b/gi, 'Dúplex')
  res = res.replace(/\s*\+\s*/g, ' + ')
  return res
}

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
  const precioDesde = desde ? formatPriceUF(desde) : 'UF 0'
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
  N: 'Norte',
  S: 'Sur',
  O: 'Oriente',
  P: 'Poniente',
  E: 'Oriente',
  NO: 'Nor-Oriente',
  NE: 'Nor-Oriente',
  NP: 'Nor-Poniente',
  SO: 'Sur-Oriente',
  SE: 'Sur-Oriente',
  SP: 'Sur-Poniente',
  NS: 'Norte-Sur',
  PSO: 'Poniente-Sur-Oriente',
  Norte: 'Norte',
  Sur: 'Sur',
  Oriente: 'Oriente',
  Poniente: 'Poniente',
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

