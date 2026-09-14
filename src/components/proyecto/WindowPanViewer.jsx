import { useEffect, useMemo, useRef, useState } from 'react'

/** Catálogo de vistas por departamento y piso en Edificio INN */
const INN_VISTAS = {
  '203': ['203.jpg', '203(2).jpg'],
  '205': ['205.jpg', '205(2).jpg'],
  '302': ['302.jpg', '302(2).jpg', '302(3).jpg'],
  '310': ['310.jpg', '310(2).jpg'],
  '403': ['403.jpg', '403 (2).jpg'],
  '409': ['409.jpg'],
  '507': ['507.jpg'],
  '508': ['508.jpg'],
  '602': ['602.jpg', '602(2).jpg'],
  '603': ['603.jpg'],
  '610': ['610.jpg'],
  '611': ['611.jpg'],
  '612': ['612(2).jpg'],
  '613': ['613.jpg'],
  '614': ['614.jpg'],
  '708': ['708.jpg'],
  '709': ['709.jpg'],
  '806': ['806.jpg'],
  '807': ['807.jpg'],
  '906': ['906.jpg', '906(2).jpg'],
}

const INN_FLOOR_FALLBACK = {
  2: ['203', '205'],
  3: ['302', '310'],
  4: ['403', '409'],
  5: ['507', '508'],
  6: ['602', '603', '610', '611', '612', '613', '614'],
  7: ['708', '709'],
  8: ['806', '807'],
  9: ['906'],
}

/** Resuelve departamento y conjunto de fotos a partir del objeto planta */
function resolveVista(planta) {
  if (!planta) {
    return { unit: '602', floor: 6, images: INN_VISTAS['602'], isExact: true }
  }

  // 1. Extraer número de depto de 3 dígitos (del 200 al 999)
  const raw = `${planta.name || ''} ${planta.numero || ''} ${planta.codigo || ''}`
  const match = raw.match(/\b([2-9]\d{2})\b/)
  if (match && INN_VISTAS[match[1]]) {
    const unit = match[1]
    return { unit, floor: parseInt(unit[0], 10), images: INN_VISTAS[unit], isExact: true }
  }

  // 2. Fallback por número de piso
  const floorNum = parseInt(planta.piso, 10) || (match ? parseInt(match[1][0], 10) : null)
  if (floorNum && INN_FLOOR_FALLBACK[floorNum]) {
    const unit = INN_FLOOR_FALLBACK[floorNum][0]
    return { unit, floor: floorNum, images: INN_VISTAS[unit], isExact: false }
  }

  // 3. Fallback genérico
  return { unit: '602', floor: 6, images: INN_VISTAS['602'], isExact: false }
}

export default function WindowPanViewer({ planta = null }) {
  const containerRef = useRef(null)
  const [shotIndex, setShotIndex] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const touchStartRef = useRef(null)
  const panRef = useRef({ x: 0, y: 0 })

  const base = import.meta.env.BASE_URL

  const vistaInfo = useMemo(() => resolveVista(planta), [planta])
  const currentImages = vistaInfo.images
  const currentImageFile = currentImages[shotIndex] || currentImages[0]
  const imageSrc = `${base}images/inn/vistas/${currentImageFile}`

  // Detectar touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Mantener panRef sincronizado
  useEffect(() => {
    panRef.current = pan
  }, [pan])

  // Reset al cambiar depto o toma
  useEffect(() => {
    setShotIndex(0)
    setPan({ x: 0, y: 0 })
  }, [vistaInfo.unit])

  // Mouse pan (Desktop)
  const handleMouseMove = (e) => {
    if (isTouchDevice || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    // Normalizado de -1 a 1
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    const clampedX = Math.max(-1, Math.min(1, normX))
    const clampedY = Math.max(-1, Math.min(1, normY))

    setPan({ x: clampedX, y: clampedY })
    setIsInteracting(true)
  }

  const handleMouseLeave = () => {
    if (isTouchDevice) return
    // Regresar al centro suavemente
    setPan({ x: 0, y: 0 })
  }

  // Touch drag (Mobile)
  const handleTouchStart = (e) => {
    if (!e.touches[0]) return
    const t = e.touches[0]
    touchStartRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      initialPanX: panRef.current.x,
      initialPanY: panRef.current.y,
    }
    setIsInteracting(true)
  }

  const handleTouchMove = (e) => {
    if (!touchStartRef.current || !e.touches[0] || !containerRef.current) return
    const t = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const deltaX = t.clientX - touchStartRef.current.startX
    const deltaY = t.clientY - touchStartRef.current.startY

    // Convertir delta pixel a rango normalizado (-1 a 1)
    const factorX = (deltaX / (rect.width * 0.4)) * -1
    const factorY = (deltaY / (rect.height * 0.4)) * -1

    const newX = Math.max(-1, Math.min(1, touchStartRef.current.initialPanX + factorX))
    const newY = Math.max(-1, Math.min(1, touchStartRef.current.initialPanY + factorY))

    setPan({ x: newX, y: newY })
  }

  const handleTouchEnd = () => {
    touchStartRef.current = null
  }

  // Desplazamiento máximo: 7.5% en X y 5.5% en Y con zoom de 1.18x
  const translateX = -pan.x * 7.5
  const translateY = -pan.y * 5.5

  return (
    <div
      ref={containerRef}
      className="lb-window-viewer position-relative w-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: '70vh',
        minHeight: '420px',
        maxHeight: '760px',
        background: '#090d16',
        cursor: isTouchDevice ? 'grab' : 'crosshair',
        touchAction: 'none',
      }}
    >
      {/* Capa de imagen con Pan tipo ventana */}
      <div
        className="lb-window-viewer__canvas position-absolute w-100 h-100 top-0 start-0"
        style={{
          transform: `translate3d(${translateX}%, ${translateY}%, 0) scale(1.18)`,
          transition: touchStartRef.current ? 'none' : 'transform 0.16s cubic-bezier(0.2, 0.8, 0.35, 1)',
          willChange: 'transform',
        }}
      >
        <img
          key={imageSrc}
          src={imageSrc}
          alt={`Vista desde ventanal depto ${vistaInfo.unit}`}
          className="w-100 h-100 object-fit-cover d-block"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>

      {/* Sombreado perimetral simulando marco / profundidad de ventanal */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge informativo superior izquierdo */}
      <div
        className="position-absolute top-0 start-0 m-3 p-2 px-3 rounded-3 text-white"
        style={{
          background: 'rgba(11, 15, 25, 0.72)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          zIndex: 5,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary px-2 py-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            Piso {vistaInfo.floor}
          </span>
          <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>
            Dpto. {vistaInfo.unit}
          </span>
        </div>
        <div className="small text-white-50 mt-1" style={{ fontSize: '0.75rem' }}>
          {vistaInfo.isExact ? 'Vista real desde ventanal' : `Vista referencial Piso ${vistaInfo.floor}`}
        </div>
      </div>

      {/* Selector de ángulos / tomas si hay más de 1 imagen */}
      {currentImages.length > 1 && (
        <div
          className="position-absolute top-0 end-0 m-3 p-1 rounded-pill d-flex gap-1"
          style={{
            background: 'rgba(11, 15, 25, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            zIndex: 5,
          }}
        >
          {currentImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 border-0 ${shotIndex === idx ? 'btn-light text-dark fw-bold shadow-sm' : 'text-white-50 bg-transparent'}`}
              style={{ fontSize: '0.75rem' }}
              onClick={(e) => {
                e.stopPropagation()
                setShotIndex(idx)
              }}
            >
              Ángulo {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Indicador de ayuda en la parte inferior */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 px-3 py-1 rounded-pill text-white text-center"
        style={{
          background: 'rgba(11, 15, 25, 0.65)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.78rem',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: isInteracting ? 0.35 : 0.95,
          transition: 'opacity 0.4s ease',
        }}
      >
        <span>{isTouchDevice ? 'Desliza con el dedo para recorrer la vista' : 'Mueve el cursor para recorrer la vista'}</span>
      </div>
    </div>
  )
}
