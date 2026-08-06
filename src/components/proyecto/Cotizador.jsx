import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Fancybox } from '@fancyapps/ui'
import { Layers, Expand, Home, Sun, Compass, Maximize } from 'lucide-react'
import { selectFloorPlan } from '../../store/slices/projectSlice.js'
import ScrollAnim from '../ScrollAnim.jsx'

const DETAIL_ICONS = { layers: Layers, expand: Expand, home: Home, sun: Sun, compass: Compass, maximize: Maximize }

export default function Cotizador({ data }) {
  const dispatch = useDispatch()
  const selected = useSelector((s) => s.project.selectedFloorPlan)
  const ref = useRef(null)
  const [showCotizar, setShowCotizar] = useState(false)

  const planImage = data.floorPlan.thumbnails[selected] ?? data.floorPlan.thumbnails[0]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    Fancybox.bind(el, '[data-fancybox="cotizador-plan"]', {})
    return () => Fancybox.unbind(el)
  }, [])

  const mainImage = data.floorPlan.thumbnails[selected] ?? data.floorPlan.image

  return (
    <section className="lb-proj-det-cotizador" id="cotizador" ref={ref}>
      <div className="container">
        {/* Header + Filters */}
        <ScrollAnim as="div" className="row align-items-start g-4 mb-4" animation="fade-up">
          <div className="col-lg-4">
            <h2 className="lb-proj-det-cot-title mb-0" dangerouslySetInnerHTML={{ __html: data.title }} />
          </div>

          <div className="col-lg-8 lb-proj-det-cot-filters">
            {Object.entries(data.filters).map(([rowKey, row]) => (
              <div key={rowKey} className="d-flex gap-3 mb-2">
                {row.map((f) => (
                  <div key={f.label} className="lb-proj-det-filter-dropdown">
                    <span>{f.label}</span>
                    <img
                      src={`${import.meta.env.BASE_URL}images/chevron-down.svg`}
                      alt=""
                      width="16"
                      height="16"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
            <div className="d-flex flex-column gap-2 mt-2">
              <button className="btn btn-dark">
                <img src={`${import.meta.env.BASE_URL}images/chevron-down.svg`} alt="" width="16" height="16" />
                {' '}Filtrar
              </button>
              <button className="btn btn-outline-dark">Borrar filtros</button>
            </div>
          </div>
        </ScrollAnim>

        {/* Main: map + plan + details */}
        <ScrollAnim as="div" className="row g-4 lb-proj-det-cot-main" animation="fade-up" delay={0.1}>
          {/* Location sketch */}
          <div className="col-lg-3 lb-proj-det-cot-map">
            <div className="lb-proj-det-cot-map-canvas">
              <img
                src={data.mapImage}
                alt="Esquicio del edificio"
                className="w-100 h-100"
                style={{ objectFit: 'contain' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="lb-proj-det-cot-map-caption text-muted small mt-2">{data.mapCaption}</p>
          </div>

          {/* Floor plan card */}
          <div className="col-lg-6 lb-proj-det-cot-plan-card">
            <a href={mainImage} data-fancybox="cotizador-plan" className="lb-img-trigger d-block" tabIndex={0}>
              <img
                src={mainImage}
                alt="Planta del departamento"
                className="lb-proj-det-cot-plan-img w-100 lb-img-interactive"
                loading="lazy"
                decoding="async"
              />
            </a>
            <div className="lb-proj-det-cot-thumbs d-flex gap-2 mt-3">
              {data.floorPlan.thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  className={`lb-proj-det-cot-thumb${selected === i ? ' lb-proj-det-cot-thumb--active' : ''}`}
                  onClick={() => dispatch(selectFloorPlan(i))}
                >
                  <img src={thumb} alt={`Planta ${i + 1}`} width="64" height="64" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="col-lg-3 lb-proj-det-cot-details">
            <div className="lb-proj-det-cot-detail-grid">
              {data.details.map((d) => (
                <div key={d.label} className="lb-proj-det-cot-detail-item d-flex align-items-center gap-2">
                  <span className="lb-proj-det-cot-detail-icon" data-icon={d.icon}>
                    {(() => { const Icon = DETAIL_ICONS[d.icon] ?? Layers; return <Icon size={24} /> })()}
                  </span>
                  <div className="d-flex flex-column">
                    <span className="lb-proj-det-cot-detail-label">{d.label}</span>
                    <span className="lb-proj-det-cot-detail-value">{d.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 mt-3">
              {data.actions.map((a) => (
                <button key={a} className="btn btn-outline-dark flex-grow-1">{a}</button>
              ))}
            </div>

            {/* Pricing */}
            <div className="lb-proj-det-cot-pricing mt-4">
              <span className="lb-proj-det-cot-price-label">{data.pricing.label}</span>
              <div className="lb-proj-det-cot-price-row d-flex justify-content-between align-items-center">
                <span className="lb-proj-det-cot-price">{data.pricing.price}</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="small">{data.pricing.shareLabel}</span>
                  <img
                    src={`${import.meta.env.BASE_URL}images/share.svg`}
                    alt="Compartir"
                    width="24"
                    height="24"
                    loading="lazy"
                  />
                </div>
              </div>
              <button
                className="btn btn-danger w-100 mt-3 lb-proj-det-cot-cta"
                onClick={() => setShowCotizar(true)}
              >
                {data.ctaText}
              </button>
            </div>
          </div>
        </ScrollAnim>
      </div>

      {showCotizar && createPortal(
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowCotizar(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content lb-cotizar-modal">
              <div className="modal-header border-0">
                <h5 className="modal-title">Cotizar departamento</h5>
                <button type="button" className="btn-close" onClick={() => setShowCotizar(false)} aria-label="Cerrar" />
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
                      onChange={(e) => dispatch(selectFloorPlan(Number(e.target.value)))}
                    >
                      {data.floorPlan.thumbnails.map((_, i) => (
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
                      He leído las políticas de privacidad
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cotizarContacto" required />
                    <label className="form-check-label" htmlFor="cotizarContacto">
                      Acepto ser contactado con mi email y teléfono
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light" onClick={() => setShowCotizar(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setShowCotizar(false)}>
                  Enviar cotización
                </button>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </section>
  )
}
