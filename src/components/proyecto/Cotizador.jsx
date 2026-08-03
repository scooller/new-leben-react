import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFloorPlan } from '../../store/slices/projectSlice.js'
import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Cotizador — visual mockup with static data.
 * Interactive floor plan thumbnail selection via RTK.
 */
export default function Cotizador({ data }) {
  const dispatch = useDispatch()
  const selected = useSelector((s) => s.project.selectedFloorPlan)

  return (
    <section className="lb-proj-det-cotizador" id="cotizador">
      <div className="container">
        {/* Header + Filters */}
        <ScrollAnim as="div" className="row align-items-start g-4 mb-4" animation="fade-up">
          <div className="col-lg-4">
            <h2 className="lb-proj-det-cot-title mb-0">{data.title}</h2>
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
              <button className="btn btn-dark btn-pill">
                <img src={`${import.meta.env.BASE_URL}images/chevron-down.svg`} alt="" width="16" height="16" />
                {' '}Filtrar
              </button>
              <button className="btn btn-outline-dark btn-pill">Borrar filtros</button>
            </div>
          </div>
        </ScrollAnim>

        {/* Main: map + plan + details */}
        <ScrollAnim as="div" className="row g-4 lb-proj-det-cot-main" animation="fade-up" delay={0.1}>
          {/* Location map */}
          <div className="col-lg-3 lb-proj-det-cot-map">
            <div className="lb-proj-det-cot-map-canvas">
              <img
                src={`${import.meta.env.BASE_URL}images/map-pin.svg`}
                alt=""
                width="28"
                height="28"
                className="lb-proj-det-cot-map-pin"
              />
            </div>
            <p className="lb-proj-det-cot-map-caption text-muted small mt-2">{data.mapCaption}</p>
          </div>

          {/* Floor plan card */}
          <div className="col-lg-6 lb-proj-det-cot-plan-card">
            <img
              src={data.floorPlan.image}
              alt="Planta del departamento"
              className="lb-proj-det-cot-plan-img w-100"
              loading="lazy"
              decoding="async"
            />
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
                    <i className={`lucide lucide-${d.icon}`} />
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
                <button key={a} className="btn btn-outline-dark btn-pill flex-grow-1">{a}</button>
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
              <button className="btn btn-danger btn-pill w-100 mt-3 lb-proj-det-cot-cta">
                {data.ctaText}
              </button>
            </div>
          </div>
        </ScrollAnim>
      </div>
    </section>
  )
}
