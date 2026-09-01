// ============================================================
// HeroShell — estructura común de todos los heroes:
// <section> + fondo (imagen o video) + overlay + contenido.
// Cada página pasa sus propias clases CSS (lb-hero, lb-proj-hero,
// lb-inn-hero, lb-brokers-hero) para reutilizar su SCSS.
// ============================================================

export default function HeroShell({
  id,
  className = '',
  video,                       // src de video (si hay, usa video; si no, image)
  image,
  bgWrapClassName = '',
  bgClassName = '',
  overlay = true,
  overlayClassName = '',
  children,
}) {
  return (
    <section id={id} className={className}>
      <div className={bgWrapClassName}>
        {video ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            fetchPriority="high"
            className={bgClassName || undefined}
          />
        ) : (
          <img
            src={image}
            alt=""
            fetchPriority="high"
            decoding="async"
            className={bgClassName || undefined}
          />
        )}
        {overlay && <div className={overlayClassName} />}
      </div>
      {children}
    </section>
  )
}
