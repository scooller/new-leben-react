import { heroContent, videos } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

export default function Hero() {
  return (
    <section className="lb-hero container d-flex flex-column align-items-center justify-content-end lb-radius-bl lb-radius-br" id="inicio">
      <div className="lb-hero-bg-wrap lb-radius-bl lb-radius-br">
        <video src={videos.hero} autoPlay muted loop playsInline className="lb-hero-bg" fetchPriority="high" />
        <div className="lb-hero-overlay" />
      </div>
      <ScrollAnim as="div" className="position-relative d-flex flex-column align-items-center w-100 text-center" animation="fade-up" stagger={0.15} start="top 90%">
        <SplitTitle as="h1" className="lb-hero-title mb-0" text={`${heroContent.titlePart1} ${heroContent.titlePart2}`} stagger={0.08} />
        {/* <p className="lb-hero-subtitle text-uppercase mb-0">{heroContent.subtitle}</p> */}
      </ScrollAnim>
    </section>
  )
}
