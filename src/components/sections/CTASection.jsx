import { ctaContent, images } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

export default function CTASection() {
  const { title, subtitle, inputLabel, inputPlaceholder, buttonText } = ctaContent

  return (
    <ScrollAnim as="section" className="lb-cta container d-flex align-items-start lb-img-trigger" animation="fade-up" duration={1} tabIndex={0}>
      <div className="lb-cta-bg-wrap">
        <img src={images.ctaSection} alt="" className="lb-cta-bg lb-img-interactive lb-bg-interactive" loading="lazy" decoding="async" />
        <div className="lb-cta-gradient" />
      </div>
      <div className="position-relative d-flex flex-column gap-4 h-100 lb-cta-left">
        <div className="d-flex flex-column gap-3">
          <SplitTitle as="h2" className="lb-cta-title mb-0" text={title} />
          <p className="lb-cta-subtitle mb-0">{subtitle}</p>
        </div>
        <form className="d-flex align-items-center justify-content-between lb-cta-pill" onSubmit={(e) => e.preventDefault()}>
          <div className="d-flex flex-column gap-1 flex-grow-1 ps-4">
            <label className="lb-cta-label">{inputLabel}</label>
            <input
              type="email"
              className="form-control border-0 bg-transparent shadow-none p-0 lb-cta-input"
              placeholder={inputPlaceholder}
              aria-label={inputLabel}
            />
          </div>
          <button type="submit" className="btn lb-cta-btn text-white flex-shrink-0">
            {buttonText}
          </button>
        </form>
      </div>
    </ScrollAnim>
  )
}
