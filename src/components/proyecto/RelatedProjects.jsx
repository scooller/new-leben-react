import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'
import { apiFetch } from '../../lib/apiFetch.js'

const ORIENTACION_LABELS = {
  N: 'Norte', S: 'Sur', E: 'Oriente', O: 'Poniente',
  NE: 'Nor-Oriente', NO: 'Nor-Poniente',
  SE: 'Sur-Oriente', SO: 'Sur-Poniente',
  P: 'Patio', SP: 'Sin Patio',
}

/**
 * Related projects table — fetches real plantas from API.
 */
export default function RelatedProjects({ data, onCotizar }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 5
  const navigate = useNavigate()

  const handleCotizar = (row) => {
    if (onCotizar) {
      onCotizar(row._planta)
      return
    }
    navigate('/cotizador', {
      state: {
        planta: row._planta,
        proyecto_id: data.apiId,
      },
    })
  }

  useEffect(() => {
    if (!data.apiId) return
    let cancelled = false
    setLoading(true)
    setPage(0)
    apiFetch(`/api/v1/plantas?proyecto_id=${data.apiId}`).then(({ data: all, error }) => {
      if (cancelled) return
      setLoading(false)
      if (error || !Array.isArray(all)) return
      const plantas = all.filter((p) => p.is_available)
      if (!plantas.length) return
      setRows(plantas
        .map((p) => ({
          proyecto: p.proyecto?.name || data.projectName,
          nombre: `Dpto. ${p.name}`,
          piso: p.piso,
          ubicacion: ORIENTACION_LABELS[p.orientacion] || p.orientacion,
          tipologia: p.programa,
          superficie: `${Math.round(parseFloat(p.superficie_util) || 0)} m²`,
          precio: `UF ${Math.round(parseFloat(p.precio_lista) || 0).toLocaleString('es-CL')}*`,
          _planta: p,
        })))
    })
    return () => { cancelled = true }
  }, [data.apiId, data.projectName])

  return (
    <section className="lb-proj-det-related" id="relacionados">
      <div className="container">
        <ScrollAnim as="div" animation="fade-up">
          <span className="lb-eyebrow d-block mb-2 text-danger">{data.eyebrow}</span>
          <h2 className="lb-proj-det-section-title">{data.title}</h2>
        </ScrollAnim>

        <ScrollAnim as="div" className="mt-4" animation="fade-up" delay={0.1}>
          <table className="table table-hover lb-proj-det-table align-middle">
            <thead className="d-lg-table-row-group">
              <tr>
                <th className="lb-proj-det-table-hdr">Proyecto</th>
                <th className="lb-proj-det-table-hdr">Nombre</th>
                <th className="lb-proj-det-table-hdr">Piso</th>
                <th className="d-none d-lg-table-cell lb-proj-det-table-hdr">Ubicación</th>
                <th className="d-none d-lg-table-cell lb-proj-det-table-hdr">Tipología</th>
                <th className="d-none d-lg-table-cell lb-proj-det-table-hdr">Superficie</th>
                <th className="d-none d-lg-table-cell lb-proj-det-table-hdr">Precio</th>
                <th className="lb-proj-det-table-hdr"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><span className="placeholder col-12" /></td>
                    <td><span className="placeholder col-12" /></td>
                    <td><span className="placeholder col-12" /></td>
                    <td className="d-none d-lg-table-cell"><span className="placeholder col-12" /></td>
                    <td className="d-none d-lg-table-cell"><span className="placeholder col-12" /></td>
                    <td className="d-none d-lg-table-cell"><span className="placeholder col-12" /></td>
                    <td className="d-none d-lg-table-cell"><span className="placeholder col-12" /></td>
                    <td><span className="placeholder col-6" /></td>
                  </tr>
                ))
              ) : (rows || []).slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((row, i) => (
                <tr key={i}>
                  <td className="fw-semibold">{row.proyecto}</td>
                  <td className="fw-semibold">{row.nombre}</td>
                  <td>{row.piso}</td>
                  <td className="d-none d-lg-table-cell">{row.ubicacion}</td>
                  <td className="d-none d-lg-table-cell">{row.tipologia}</td>
                  <td className="d-none d-lg-table-cell">{row.superficie}</td>
                  <td className="d-none d-lg-table-cell">{row.precio}</td>
                  <td>
                    <button
                      className="lb-proj-det-table-link btn btn-link text-decoration-none p-0 border-0"
                      onClick={() => handleCotizar(row)}
                    >
                      Cotizar
                      <img
                        src={`${import.meta.env.BASE_URL}images/arrow-right.svg`}
                        alt=""
                        width="14"
                        height="14"
                        loading="lazy"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pager */}
          {!loading && rows.length > PAGE_SIZE && (
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <span className="text-muted small">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, rows.length)} de {rows.length}
              </span>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-dark btn-sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="small fw-semibold">{page + 1} / {Math.ceil(rows.length / PAGE_SIZE)}</span>
                <button
                  className="btn btn-outline-dark btn-sm"
                  disabled={(page + 1) * PAGE_SIZE >= rows.length}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </ScrollAnim>
      </div>
    </section>
  )
}
