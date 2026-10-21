// ============================================================
// Chilean Form Utilities & Validators (Pure Native JS - Ponytail)
// ============================================================

export const CHILE_REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Región Metropolitana de Santiago',
  'Libertador General Bernardo O\'Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo',
  'Magallanes y de la Antártica Chilena',
]

/**
 * Cleans a RUT string leaving only digits and K
 */
export function cleanRut(rut) {
  return String(rut || '').replace(/[^0-9kK]/g, '').toUpperCase()
}

/**
 * Formats a RUT as XX.XXX.XXX-X
 */
export function formatRut(value) {
  const cleaned = cleanRut(value)
  if (cleaned.length <= 1) return cleaned

  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)

  // Add thousand dots
  let formattedBody = ''
  for (let i = body.length - 1, j = 1; i >= 0; i--, j++) {
    formattedBody = body[i] + formattedBody
    if (j % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody
    }
  }

  return `${formattedBody}-${dv}`
}

/**
 * Validates a Chilean RUT using the Modulo 11 algorithm
 */
export function validateRut(value) {
  const cleaned = cleanRut(value)
  if (cleaned.length < 8 || cleaned.length > 9) return false

  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)

  // Verify body is all numbers
  if (!/^\d+$/.test(body)) return false

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const expectedDvCalc = 11 - (sum % 11)
  let expectedDv = '0'
  if (expectedDvCalc === 11) expectedDv = '0'
  else if (expectedDvCalc === 10) expectedDv = 'K'
  else expectedDv = String(expectedDvCalc)

  return dv === expectedDv
}

/**
 * Formats Chilean phone number to 9 digits (strips +56 or leading 56)
 */
export function formatPhone(value) {
  let cleaned = String(value || '').replace(/\D/g, '')

  // If user pasted with 56 prefix, remove it
  if (cleaned.startsWith('56') && cleaned.length > 9) {
    cleaned = cleaned.slice(2)
  }

  // Max 9 digits for Chilean numbers (mobile starts with 9)
  return cleaned.slice(0, 9)
}

/**
 * Validates Chilean phone number (9 digits, starts with 9 or 2)
 */
export function validatePhone(value) {
  const cleaned = formatPhone(value)
  return /^[2-9]\d{8}$/.test(cleaned)
}

/**
 * Validates basic email format
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

/**
 * Normalizes LinkedIn URL
 */
export function formatLinkedInUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  // Already a full url
  if (/^https?:\/\//i.test(raw)) {
    return raw
  }

  // If starts with linkedin.com
  if (raw.toLowerCase().startsWith('linkedin.com') || raw.toLowerCase().startsWith('www.linkedin.com')) {
    return `https://${raw}`
  }

  // Username only
  const cleanUsername = raw.replace(/^@/, '').replace(/^\/in\//, '')
  return `https://www.linkedin.com/in/${cleanUsername}`
}

/**
 * Validates LinkedIn URL
 */
export function validateLinkedInUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return true // Optional field

  const normalized = formatLinkedInUrl(raw)
  return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(normalized)
}
