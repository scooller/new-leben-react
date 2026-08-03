import ScrollAnim from '../ScrollAnim.jsx'

/**
 * Bottom gallery: 3 images in a row.
 */
export default function BottomGallery({ images }) {
  return (
    <section className="lb-proj-det-bottom-gallery container">
      <ScrollAnim as="div" className="row g-2" animation="fade-up" stagger={0.1}>
        {images.map((src, i) => (
          <div key={i} className="col-4 lb-img-trigger" tabIndex={0}>
            <img
              src={src}
              alt={`Galería ${i + 1}`}
              className="lb-proj-det-bottom-img lb-img-interactive w-100"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </ScrollAnim>
    </section>
  )
}
