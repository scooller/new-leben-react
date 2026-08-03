import { testimonials, images } from '../../data/content.js'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'

export default function Testimonials() {
  const { title, certTitle, certClients, ratingLabel, ratingScore, reviews } = testimonials

  return (
    <ScrollAnim as="section" className="lb-testimonials container" animation="fade-up" duration={1}>
      <div className="d-flex flex-column gap-4">
        {/* Header */}
        <SplitTitle as="h2" className="text-center mb-0 lb-testimonials-title" text={title} />

        {/* Certification banner */}
        <div className="bg-white rounded-3 shadow-sm d-flex align-items-center justify-content-between lb-cert p-3 px-4">
          <div className="d-flex align-items-center gap-3">
            <div className="lb-bptl d-flex flex-column align-items-center justify-content-center rounded text-white">
              <span className="lb-bptl-line">Best</span>
              <span className="lb-bptl-line">Place</span>
              <span className="lb-bptl-line">to Live</span>
              <span className="lb-bptl-reg">®</span>
              <span className="lb-bptl-cert">Certificada</span>
            </div>
            <div className="d-flex flex-column gap-1">
              <p className="fs-5 fw-bold mb-0 text-dark">{certTitle}</p>
              <div className="d-flex align-items-center gap-2">
                <span className="fs-6 text-secondary">{certClients}</span>
                <span className="lb-info d-inline-flex align-items-center justify-content-center fw-bold">i</span>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-6 text-muted">{ratingLabel}</span>
            <div className="d-flex align-items-center gap-2 lb-rating-badge rounded">
              <div className="d-flex align-items-center justify-content-center text-white fw-bold lb-score rounded">{ratingScore}</div>
              <div className="d-flex gap-1 align-items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <img key={i} src={images.star} alt="" width="20" height="20" loading="lazy" decoding="async" />
                ))}
                <img src={images.starHalf} alt="" width="20" height="20" loading="lazy" decoding="async" />
              </div>
              <div className="lb-share-cert d-flex align-items-center justify-content-center rounded">
                <img src={images.share} alt="" width="16" height="16" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <ScrollAnim as="div" className="d-flex gap-3" animation="fade-up" stagger={0.15} delay={0.2}>
          {reviews.map((review) => (
            <div className="flex-fill bg-white rounded-3 shadow-sm lb-review-card d-flex flex-column gap-3 lb-img-trigger" key={review.id} tabIndex={0}>
              <div className="d-flex align-items-center gap-2">
                <img src={images[review.avatar]} alt={review.name} width="44" height="44" className="rounded-circle flex-shrink-0 lb-img-interactive" style={{ objectFit: 'cover' }} loading="lazy" decoding="async" />
                <div className="d-flex flex-column">
                  <p className="fw-bold mb-0 text-dark lb-reviewer-name">{review.name}</p>
                  <p className="fs-6 text-muted mb-0 lb-reviewer-role">{review.role}</p>
                </div>
              </div>
              <p className="mb-0 lb-review-text">{review.text}</p>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src={i < Math.floor(review.rating) ? images.starSmall : (review.rating % 1 !== 0 && i === Math.floor(review.rating) ? images.starHalfSmall : images.starSmall)}
                      alt=""
                      width="16"
                      height="16"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="lb-review-time">{review.time}</span>
                  <div className="lb-share-sm d-flex align-items-center justify-content-center rounded">
                    <img src={images.shareSmall} alt="" width="14" height="14" loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollAnim>
      </div>
    </ScrollAnim>
  )
}
