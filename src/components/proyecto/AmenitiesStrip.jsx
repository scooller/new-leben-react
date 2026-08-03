import AMENITY_ICONS from '../icons/amenities.jsx'

/**
 * Reusable amenities strip with animated hover icons.
 * variant="default" → icon+label in a row (upper strip)
 * variant="icons" → circular icon + label (lower strip)
 *
 * Each icon is a motion/react animated component (hover-triggered).
 */
export default function AmenitiesStrip({ items, variant = 'default' }) {
  return (
    <section className={`lb-proj-det-amenities lb-proj-det-amenities--${variant}`}>
      <div className="container">
        <div className="lb-proj-det-amenities-row d-flex justify-content-between flex-wrap gap-3">
          {items.map((item) => {
            const Icon = AMENITY_ICONS[item.icon]
            return (
              <div key={item.label} className="lb-proj-det-amenity d-flex flex-column align-items-center">
                <span className="lb-proj-det-amenity-icon">
                  {Icon ? <Icon size={24} /> : null}
                </span>
                <span className="lb-proj-det-amenity-label text-center">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
