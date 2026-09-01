import { heroContent, videos } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import HeroShell from './HeroShell.jsx'

export default function Hero({ title, bottom }) {
  return (
    <HeroShell
      id="inicio"
      className="lb-hero container-fluid d-flex flex-column align-items-center justify-content-end"
      video={videos.hero}
      bgWrapClassName="lb-hero-bg-wrap"
      bgClassName="lb-hero-bg"
      overlayClassName="lb-hero-overlay"
    >
      <ScrollAnim as="div" className="position-relative d-flex flex-column align-items-center w-100 text-center" animation="fade-up" stagger={0.15} start="top 90%">
        <SplitTitle as="h1" className="lb-hero-title mb-4" text={title ?? heroContent.title} stagger={0.08} />
        {bottom}
      </ScrollAnim>
    </HeroShell>
  )
}
