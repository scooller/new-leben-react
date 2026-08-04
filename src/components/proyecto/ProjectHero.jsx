import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Hero for project detail page.
 * Structure from Figma (node 2089:92):
 *   - Background image fill (lake view)
 *   - Gradient overlay (dark, bottom-heavy)
 *   - Logo INN (centered-left, mid-height)
 *   - hero-content: title + meta row (subtitle • location)
 */
export default function ProjectHero({ data }) {
  return (
    <section className="lb-proj-hero container position-relative d-flex align-items-end lb-radius-bl lb-radius-br">
      {/* — Background image — */}
      <div className="lb-proj-hero-bg-wrap lb-radius-bl lb-radius-br">
        {data.backgroundVideo ? (
          <video
            src={data.backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            type="video/mp4"
            className="lb-proj-hero-bg"
            fetchPriority="high"
          />
        ) : (
          <img
            src={data.backgroundImage}
            alt=""
            className="lb-proj-hero-bg"
            fetchPriority="high"
            decoding="async"
          />
        )}
        <div className="lb-proj-hero-overlay" />
      </div>

      {/* — Logo — */}
      {data.logo && (
        <ScrollAnim
          as="img"
          src={data.logo}
          alt="Logo proyecto"
          className="lb-proj-hero-logo position-absolute"
          animation="fade-down"
          delay={0.1}
        />
      )}

      {/* — hero-content (title + meta) — */}
      <ScrollAnim
        as="div"
        className="position-relative lb-proj-hero-content"
        animation="fade-up"
        delay={0.2}
      >
        <h1 className="mb-3 lb-proj-hero-title">{data.title}</h1>
        {data.subtitle && data.location && (
          <div className="d-flex align-items-center gap-2 lb-proj-hero-meta">
            <span>{data.subtitle}</span>
            <span className="lb-proj-hero-dot" />
            <span>{data.location}</span>
          </div>
        )}
      </ScrollAnim>
    </section>
  )
}

