import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/apiFetch.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import ProjectCard from '../ProjectCard.jsx'

const etapaLabel = (etapa) =>
  /venta|recepcion/.test(etapa) ? 'Entrega Inmediata'
  : /obra/.test(etapa) ? 'En Construcción'
  : /terminacion/.test(etapa) ? 'Próxima Entrega'
  : etapa

export default function Alternatives({ data }) {
  const [cards, setCards] = useState(null)
  const [title, setTitle] = useState(data.title)

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/proyectos').then(({ data: all, error }) => {
      if (cancelled || error || !Array.isArray(all)) {
        if (!cancelled) setCards([])
        return
      }
      const SUR_COMUNAS = ['PUERTO VARAS', 'VALDIVIA', 'PUERTO MONTT']
      const others = all.filter((p) => p.name !== data.excludeName)
      const picks = others.filter((p) => SUR_COMUNAS.includes((p.comuna || '').trim().toUpperCase())).slice(0, 3)
      const mapped = picks.map((p) => ({
          name: p.name,
          location: p.direccion,
          comuna: (p.comuna || '').trim(),
          image: p.salesforce_portada_url || '',
          entrega: etapaLabel(p.etapa),
          slug: p.name.toLowerCase().replace(/edificio\s+/i, '').replace(/\s+/g, '-'),
        }))
      setCards(mapped)
      setTitle('¿Buscas otras opciones en el sur de Chile?')
    })
    return () => { cancelled = true }
  }, [data.excludeName])

  return (
    <section className="lb-proj-det-alternatives container" id="alternativas">
      <ScrollAnim as="div" animation="fade-up">
        <SplitTitle as="h2" className="lb-proj-det-section-title" text={title} stagger={0.04} />
      </ScrollAnim>

      <ScrollAnim as="div" className="row row-cols-1 row-cols-md-3 g-4 mt-2" animation="fade-up" stagger={0.1}>
        {(cards || []).map((card) => (
          <div className="col" key={card.name}>
            <ProjectCard project={card} />
          </div>
        ))}
      </ScrollAnim>
      <div className="d-flex justify-content-end mt-4">
        <Link to="/proyectos" className="btn btn-dark text-decoration-none">Ver todos los proyectos</Link>
      </div>
    </section>
  )
}
