import { useState } from 'react'
import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Vista 360° / Recorrido Virtual section.
 * Figma 2093:4 — white bg, red eyebrow, dark title,
 * underline-style tabs, viewer image.
 */
export default function Vista360({ data }) {
  const [active, setActive] = useState(0)

  return (
    <section className="lb-proj-det-vista360" id="vista360">
      <div className="container">
        <ScrollAnim as="div" className="lb-proj-det-vista360-header" animation="fade-up">
          <span className="lb-proj-det-vista360-eyebrow d-block mb-3">{data.eyebrow}</span>
          <h2 className="lb-proj-det-vista360-title">{data.title}</h2>
        </ScrollAnim>

        <div className="lb-proj-det-vista360-tabs mt-4">
          {data.tabs.map((tab, i) => (
            <button
              key={tab}
              className={`lb-proj-det-vista-tab${active === i ? ' active' : ''}`}
              onClick={() => setActive(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <ScrollAnim
          as="div"
          className="lb-proj-det-vista360-viewer mt-4"
          animation="scale"
          key={active}
        >
          <img
            src={data.image}
            alt={`Recorrido virtual — ${data.tabs[active]}`}
            className="w-100"
            loading="lazy"
            decoding="async"
          />
        </ScrollAnim>
      </div>
    </section>
  )
}
