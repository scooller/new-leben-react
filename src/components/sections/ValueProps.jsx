import ScrollAnim from '../ScrollAnim.jsx'
import { valueProps } from '../../data/content.js'

export default function ValueProps() {
  return (
    <ScrollAnim as="section" className="lb-vprops container-fluid" animation="fade-up" duration={1}>
      <div className="container d-flex flex-column gap-5">
        <div className="d-flex flex-column align-items-center gap-3 pt-2">
          <span className="lb-vprops-eyebrow">{valueProps.eyebrow}</span>
          <h2 className="text-center mb-0 lb-vprops-title">{valueProps.title}</h2>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {valueProps.items.map((item) => (
            <div className="col" key={item.num}>
              <div className="bg-white lb-vprop-card d-flex flex-column gap-4 h-100">
                <span className="lb-vprop-num">{item.num}</span>
                <div className="d-flex flex-column gap-2">
                  <h3 className="mb-0 lb-vprop-card-title">{item.title}</h3>
                  <p className="mb-0 lb-vprop-text">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollAnim>
  )
}
