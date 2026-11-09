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

/** Format UF price rounded without decimals as 'UF 3.129' or 'UF 0' */
export function formatPriceUF(val) {
  const num = typeof val === 'number' ? val : parseFloat(val)
  if (!num || isNaN(num)) return 'UF 0'
  return `UF ${formatNumber(Math.round(num), 0)}`
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

/** Normalize a value into an array of non-empty strings */
export function toArray(val) {
  if (!val) return []
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') {
    return val.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return [val]
}

/** Format comuna into title case (e.g. "LA FLORIDA" -> "La Florida") */
export function formatComuna(str) {
  if (!str) return ""
  return String(str)
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

/** Match project comuna against single or multi-select filter */
export function matchComuna(projectComuna, filterComuna) {
  const selected = toArray(filterComuna)
  if (selected.length === 0) return true
  const normProject = String(projectComuna || '').trim().toLowerCase()
  return selected.some((c) => {
    const normC = String(c).trim().toLowerCase()
    return normProject === normC || normProject.includes(normC) || normC.includes(normProject)
  })
}

/** Match planta or tipologia programa against single or multi-select filter value */
export function matchTipologia(programa, filter) {
  const selected = toArray(filter)
  if (selected.length === 0 || !programa) return selected.length === 0
  const normProg = String(programa).trim().toLowerCase()

  return selected.some((filt) => {
    const normFilt = String(filt).trim().toLowerCase()
    if (normProg === normFilt) return true

    // Studio check: matches 'STUDIO', 'ESTUDIO', etc.
    if (normFilt.includes('studio') || normFilt.includes('estudio')) {
      return normProg.includes('studio') || normProg.includes('estudio') || normProg === 'st'
    }

    // Match e.g. '1D', '2D', '3D', '4D' or '1 Dorm' against '1D - 1B', '1D+1B'
    const dormMatch = normFilt.match(/^(\d+)\s*d/i) || normFilt.match(/^(\d+)\s*dorm/i)
    if (dormMatch) {
      const d = dormMatch[1]
      return normProg.startsWith(`${d}d`) || normProg.startsWith(`${d} d`) || new RegExp(`\\b${d}\\s*d`, 'i').test(normProg)
    }

    // Match ranges like '1-2 Dorms' or '2-3 Dorms'
    const rangeMatch = normFilt.match(/^(\d+)\s*-\s*(\d+)/)
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1], 10)
      const max = parseInt(rangeMatch[2], 10)
      const progDorm = normProg.match(/^(\d+)\s*d/i)
      if (progDorm) {
        const d = parseInt(progDorm[1], 10)
        return d >= min && d <= max
      }
    }

    return normProg.includes(normFilt)
  })
}

/** Calculate dynamic UF price ranges based on actual project data */
export function getDynamicPriceRanges(projects = []) {
  const precios = (projects || []).map((p) => parseFloat(p.precio_desde)).filter((p) => p > 0)
  if (!precios.length) {
    return ['Hasta 3.000 UF', '3.000-5.000 UF', '5.000+ UF']
  }
  const min = Math.min(...precios)
  const max = Math.max(...precios)

  const minUF = Math.floor(min / 1000) * 1000
  const maxUF = Math.ceil(max / 1000) * 1000

  const rangos = []
  if (minUF < 3000) {
    rangos.push('Hasta 3.000 UF')
  }
  for (let lo = Math.max(minUF, 3000); lo < maxUF; lo += 2000) {
    const hi = lo + 2000
    rangos.push(`${lo.toLocaleString('es-CL')}-${hi.toLocaleString('es-CL')} UF`)
  }
  rangos.push(`${maxUF.toLocaleString('es-CL')}+ UF`)

  return [...new Set(rangos)]
}

/** Match price against range filter in UF or Renta líquida */
export function matchPrecio(precioValue, filter) {
  if (!filter) return true
  const uf = parseFloat(precioValue) || 0
  if (!uf) return true

  const lower = String(filter).toLowerCase().trim()

  // Support Renta líquida ranges (from contact/invest forms)
  if (lower.includes('$') || lower.includes('renta')) {
    if (lower.includes('hasta 800') || lower.includes('menos de 1.000')) {
      return uf <= 2500
    }
    if (lower.includes('800.000') || lower.includes('1.000.000 y 1.800')) {
      return uf >= 2000 && uf <= 3500
    }
    if (lower.includes('1.500.000') || lower.includes('1.800.000 y 2.500')) {
      return uf >= 3000 && uf <= 5000
    }
    if (lower.includes('2.500.000') || lower.includes('2.500.000 y 3.500')) {
      return uf >= 4500 && uf <= 7000
    }
    if (lower.includes('4.000.000') || lower.includes('sobre 3.500')) {
      return uf >= 6000
    }
  }

  // Support UF ranges
  if (lower.startsWith('hasta')) {
    const max = parseInt(lower.replace(/[^\d]/g, ''), 10)
    return uf <= max
  }
  if (lower.includes('+')) {
    const min = parseInt(lower.replace(/[^\d]/g, ''), 10)
    return uf >= min
  }
  const parts = lower.replace(/[^\d-]/g, '').split('-')
  if (parts.length === 2) {
    const lo = parseInt(parts[0], 10)
    const hi = parseInt(parts[1], 10)
    if (!isNaN(lo) && !isNaN(hi)) {
      return uf >= lo && uf <= hi
    }
  }
  return true
}

/** Filter raw projects by category / intent (vivir, invertir, entrega_inmediata, construccion) */
export function filterProjectsByCategory(projects = [], category = 'todos') {
  if (!category || category === 'todos') return projects
  if (category === 'entrega_inmediata') {
    return projects.filter((p) => p.entrega_inmediata || /entrega\s*inmediata|venta|recepcion/i.test(p.etapa || ''))
  }
  if (category === 'construccion') {
    return projects.filter((p) => /obra|construccion|inicio/i.test(p.etapa || ''))
  }
  if (category === 'invertir') {
    return projects.filter((p) => (p.tipologias || []).some((t) => /studio|1\s*d|2\s*d/i.test(t.programa || '')))
  }
  if (category === 'vivir') {
    return projects.filter((p) => (p.tipologias || []).some((t) => /[2-9]\s*d/i.test(t.programa || '')))
  }
  return projects
}
