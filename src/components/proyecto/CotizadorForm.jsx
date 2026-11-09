import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatRut, validateRut } from '../../lib/chileUtils.js'

const PLACEHOLDER_FLOORPLAN = '/images/placeholder-floorplan.svg'

/**
 * Reusable cotización modal form.
 * Used by Cotizador (project detail) and CotizadorGeneral.
 * @param {boolean} show           — visibility
 * @param {function} onClose       — close handler
 * @param {string[]} thumbnails    — plant images for the selector
 * @param {number} initialSelected — initial plant index
 * @param {string} planImage       — current selected floorplan image
 * @param {string} plantaName      — active plant name/label
 * @param {string} projectName     — active project name
 */
export default function CotizadorForm({
  show,
  onClose,
  thumbnails = [],
  initialSelected = 0,
  planImage: propPlanImage,
  plantaName = '',
  projectName = '',
}) {
  const [selected, setSelected] = useState(initialSelected)
  const [rut, setRut] = useState('')
  const [rutError, setRutError] = useState('')
  const [rutTouched, setRutTouched] = useState(false)

  // Sync selected index when initialSelected or show changes
  useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected, show])

  if (!show) return null

  // Resolve plan image: match selected plant image, fall back to prop or placeholder
  const activeThumb = Array.isArray(thumbnails) && thumbnails.length > 0 ? (thumbnails[selected] ?? thumbnails[0]) : null
  const currentImage = (selected === initialSelected && propPlanImage ? propPlanImage : activeThumb) || propPlanImage || PLACEHOLDER_FLOORPLAN

  const handleRutChange = (e) => {
    const formatted = formatRut(e.target.value)
    setRut(formatted)
    if (rutTouched || rutError) {
      if (!formatted) {
        setRutError('El RUT es obligatorio')
      } else if (!validateRut(formatted)) {
        setRutError('RUT inválido. Verifica número y dígito verificador.')
      } else {
        setRutError('')
      }
    }
  }

  const handleRutBlur = () => {
    setRutTouched(true)
    if (!rut) {
      setRutError('El RUT es obligatorio')
    } else if (!validateRut(rut)) {
      setRutError('RUT inválido. Verifica número y dígito verificador.')
    } else {
      setRutError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRutTouched(true)
    if (!rut || !validateRut(rut)) {
      setRutError('RUT inválido. Verifica número y dígito verificador.')
      return
    }
    onClose()
  }

  return createPortal(
    <div className="modal d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content lb-cotizar-modal">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title mb-0">Cotizar departamento</h5>
              {projectName && <small className="text-muted fw-semibold">{projectName}</small>}
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            {/* Planta seleccionada + selector rápido */}
            <div className="row g-3 mb-4 align-items-center">
              <div className="col-md-5 text-center">
                <img
                  src={currentImage}
                  alt={plantaName ? `Planta ${plantaName}` : 'Planta seleccionada'}
                  className="img-fluid rounded object-fit-contain bg-light p-2 w-100"
                  style={{ maxHeight: '240px' }}
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_FLOORPLAN
                  }}
                />
              </div>
              <div className="col-md-7">
                <label className="form-label fw-semibold">Planta</label>
                {thumbnails.length > 1 ? (
                  <select
                    className="form-select"
                    aria-label="Seleccionar tipología de planta"
                    value={selected}
                    onChange={(e) => setSelected(Number(e.target.value))}
                  >
                    {thumbnails.map((_, i) => (
                      <option key={i} value={i}>Planta {String.fromCharCode(65 + i)}</option>
                    ))}
                  </select>
                ) : (
                  <select className="form-select" aria-label="Planta seleccionada" disabled value="0">
                    <option value="0">{plantaName || 'Planta seleccionada'}</option>
                  </select>
                )}
                <div className="mt-3">
                  <label htmlFor="cf-bodega" className="form-label fw-semibold">Bodega</label>
                  <select id="cf-bodega" className="form-select" defaultValue="">
                    <option value="" disabled>Sin bodega</option>
                    <option value="small">Bodega 4 m² — UF 250</option>
                    <option value="medium">Bodega 6 m² — UF 350</option>
                    <option value="large">Bodega 8 m² — UF 450</option>
                  </select>
                </div>
                <div className="mt-3">
                  <label htmlFor="cf-estacionamiento" className="form-label fw-semibold">Estacionamiento</label>
                  <select id="cf-estacionamiento" className="form-select" defaultValue="">
                    <option value="" disabled>Sin estacionamiento</option>
                    <option value="covered">Techado — UF 1.800</option>
                    <option value="uncovered">Descubierto — UF 1.200</option>
                    <option value="double">Doble — UF 3.200</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Datos personales con validación */}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="cotizarNombre">Nombre</label>
                  <input id="cotizarNombre" type="text" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="cotizarApellido">Apellido</label>
                  <input id="cotizarApellido" type="text" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="cotizarRut">RUT</label>
                  <input
                    id="cotizarRut"
                    type="text"
                    className={`form-control ${rutTouched && rutError ? 'is-invalid' : rutTouched && !rutError && rut ? 'is-valid' : ''}`}
                    placeholder="12.345.678-9"
                    value={rut}
                    onChange={handleRutChange}
                    onBlur={handleRutBlur}
                    maxLength={12}
                    required
                  />
                  {rutTouched && rutError && (
                    <div className="invalid-feedback small">{rutError}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="cotizarTelefono">Teléfono</label>
                  <input id="cotizarTelefono" type="tel" className="form-control" placeholder="9 1234 5678" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="cotizarEmail">Email</label>
                  <input id="cotizarEmail" type="email" className="form-control" placeholder="nombre@correo.cl" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="cotizarRenta">Rango de renta</label>
                  <select id="cotizarRenta" className="form-select" defaultValue="">
                    <option value="" disabled>Selecciona un rango</option>
                    <option>Hasta $800.000</option>
                    <option>$800.000 — $1.500.000</option>
                    <option>$1.500.000 — $2.500.000</option>
                    <option>$2.500.000 — $4.000.000</option>
                    <option>Más de $4.000.000</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mt-3 d-flex flex-column gap-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="cotizarPoliticas" required />
                  <label className="form-check-label" htmlFor="cotizarPoliticas">
                    He leído los términos y condiciones y los acepto
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="cotizarContacto" required />
                  <label className="form-check-label" htmlFor="cotizarContacto">
                    Acepto que usen mis datos para contactarme y marketing
                  </label>
                </div>
              </div>

              <div className="modal-footer border-0 px-0 pb-0 mt-4">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger">
                  Enviar cotización
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>, document.body)
}
