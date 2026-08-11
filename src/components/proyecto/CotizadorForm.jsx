import { useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Reusable cotización modal form.
 * Used by Cotizador (project detail) and CotizadorGeneral.
 * @param {boolean} show         — visibility
 * @param {function} onClose     — close handler
 * @param {string[]} thumbnails  — plant images for the selector
 * @param {number} initialSelected — initial plant index
 */
export default function CotizadorForm({ show, onClose, thumbnails = [], initialSelected = 0 }) {
  const [selected, setSelected] = useState(initialSelected)
  const planImage = thumbnails[selected] ?? thumbnails[0]

  if (!show) return null

  return createPortal(
    <div className="modal d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content lb-cotizar-modal">
          <div className="modal-header border-0">
            <h5 className="modal-title">Cotizar departamento</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            {/* Planta seleccionada + selector rápido */}
            <div className="row g-3 mb-3">
              <div className="col-md-5">
                <img src={planImage} alt="Planta seleccionada" className="img-fluid rounded" />
              </div>
              <div className="col-md-7">
                <label className="form-label fw-semibold">Planta</label>
                <select
                  className="form-select"
                  value={selected}
                  onChange={(e) => setSelected(Number(e.target.value))}
                >
                  {thumbnails.map((_, i) => (
                    <option key={i} value={i}>Planta {String.fromCharCode(65 + i)}</option>
                  ))}
                </select>
                <div className="mt-3">
                  <label className="form-label fw-semibold">Bodega</label>
                  <select className="form-select" defaultValue="">
                    <option value="" disabled>Sin bodega</option>
                    <option value="small">Bodega 4 m² — UF 250</option>
                    <option value="medium">Bodega 6 m² — UF 350</option>
                    <option value="large">Bodega 8 m² — UF 450</option>
                  </select>
                </div>
                <div className="mt-3">
                  <label className="form-label fw-semibold">Estacionamiento</label>
                  <select className="form-select" defaultValue="">
                    <option value="" disabled>Sin estacionamiento</option>
                    <option value="covered">Techado — UF 1.800</option>
                    <option value="uncovered">Descubierto — UF 1.200</option>
                    <option value="double">Doble — UF 3.200</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Datos personales */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellido</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input type="email" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input type="tel" className="form-control" required />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Rango de renta</label>
                <select className="form-select" defaultValue="">
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
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Enviar cotización
            </button>
          </div>
        </div>
      </div>
    </div>, document.body)
}
