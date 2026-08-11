import { useState } from 'react'
import { Ban } from 'lucide-react'
import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Vista 360° / Recorrido Virtual section.
 * Bootstrap nav-tabs. Tabs without content show empty state.
 */
export default function Vista360({ data }) {
  const [active, setActive] = useState(0)
  const images = data.images ?? [data.image]
  const currentImage = images[active]
  const hasContent = Boolean(currentImage)
  const isIframe = typeof currentImage === 'string' && /^https?:\/\//.test(currentImage)

  return (
    <section className="lb-proj-det-vista360 pt-1" id="vista360">
      <div className="container">
        <ScrollAnim as="div" className="lb-proj-det-vista360-header" animation="fade-up" start="center center">
          <span className="lb-proj-det-vista360-eyebrow d-block mb-3">{data.eyebrow}</span>
          <h2 className="lb-proj-det-vista360-title">{data.title}</h2>
        </ScrollAnim>

        <ul className="nav nav-tabs lb-proj-det-vista360-tabs mt-4" role="tablist">
          {data.tabs.map((tab, i) => (
            <li className="nav-item" key={tab} role="presentation">
              <button
                className={`nav-link lb-proj-det-vista-tab${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={active === i}
                type="button"
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        <ScrollAnim
          as="div"
          className="lb-proj-det-vista360-viewer mt-4"
          animation="fade-up"
          key={active}
        >
          {hasContent ? (
            isIframe ? (
              <div className="ratio ratio-16x9">
                <iframe
                  src={currentImage}
                  title={`Recorrido virtual — ${data.tabs[active]}`}
                  style={{ minHeight: '500px', border: 'none' }}
                  allowFullScreen
                  loading="lazy"
                  />
              </div>
            ) : (
              <img
                src={currentImage}
                alt={`Recorrido virtual — ${data.tabs[active]}`}
                className="img-fluid"
                loading="lazy"
                decoding="async"
              />
            )
          ) : (
            <div className="lb-proj-det-vista360-empty d-flex flex-column align-items-center justify-content-center gap-3 py-5">
              <Ban size={48} className="text-muted" />
              <p className="text-muted mb-0">Sin contenido por el momento</p>
            </div>
          )}
        </ScrollAnim>
      </div>
    </section>
  )
}
