import { images } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'

export default function CTASection() {
  return (
    <ScrollAnim as="section" className="lb-cta" animation="fade-up" duration={1}>
      <div className="container text-center p-0">
        <img src={images.ctaSection} alt="" className="lb-cta-img w-100 lb-radius-br" loading="lazy" decoding="async" />
      </div>
    </ScrollAnim>
  )
}
