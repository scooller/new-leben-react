// ============================================================
// HeroShell — estructura común de todos los heroes:
// <section> + fondo (imagen o video) + overlay + contenido.
// Cada página pasa sus propias clases CSS (lb-hero, lb-proj-hero,
// lb-inn-hero, lb-brokers-hero) para reutilizar su SCSS.
// ============================================================

export default function HeroShell({
  className = '',
  video,                       // src de video (si hay, usa video; si no, image)
  image,
  bgWrapClassName = '',
  bgClassName = '',
  overlayClassName = '',
  children,
  ...rest
}) {
  return (
    <section className={className} {...rest}>
      <div className={bgWrapClassName}>
        {video ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            fetchPriority="high"
            className={bgClassName}
          />
        ) : (
          <img
            src={image}
            alt=""
            fetchPriority="high"
            decoding="async"
            className={bgClassName}
          />
        )}
        <div className={overlayClassName} />
      </div>
      {children}
    </section>
  )
}
