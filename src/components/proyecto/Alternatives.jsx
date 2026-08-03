import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

/**
 * Alternative projects cards — "¿Buscas otras opciones?"
 */
export default function Alternatives({ data }) {
  return (
    <section className="lb-proj-det-alternatives container" id="alternativas">
      <ScrollAnim as="div" animation="fade-up">
        <SplitTitle as="h2" className="lb-proj-det-section-title" text={data.title} stagger={0.04} />
      </ScrollAnim>

      <div className="row g-4 mt-2">
        {data.cards.map((card) => (
          <ScrollAnim
            as="div"
            className="col-md-4"
            animation="fade-up"
            stagger={0.1}
            key={card.name}
          >
            <div className="lb-proj-det-alt-card lb-img-trigger" tabIndex={0}>
              <img
                src={card.image}
                alt={card.name}
                className="lb-proj-det-alt-img lb-img-interactive w-100"
                loading="lazy"
                decoding="async"
              />
              <div className="lb-proj-det-alt-body">
                <h3 className="lb-proj-det-alt-name">{card.name}</h3>
                <p className="lb-proj-det-alt-meta mb-0">{card.tipologia}</p>
                <span className="lb-proj-det-alt-price">{card.price}</span>
              </div>
            </div>
          </ScrollAnim>
        ))}
      </div>
    </section>
  )
}
