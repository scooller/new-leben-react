export default function CarouselNav({
  items = [],
  targetId,
  activeIndex = 0,
  onSelect,
  variant = 'button', // 'button' = degradado con texto+icono en línea | 'stacked' = icono arriba, texto debajo, sin degradado
  className = '',
}) {
  const base = import.meta.env.BASE_URL

  const handleSelect = (index) => {
    onSelect?.(index)
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`lb-inn-hero-tabs lb-inn-hero-tabs--plain lb-inn-hero-tabs--${variant} ${className}`.trim()} aria-label="Opciones del proyecto">
      <ul className={`nav nav-pills nav-justified flex-wrap align-items-stretch gap-4`}>
        {items.map((item, index) => (
          <li className="nav-item" key={item.label || index}>
            <button
              type="button"
              className={`nav-link nav-link__border w-100 h-100 d-flex flex-${variant === 'stacked' ? 'column' : 'row'} align-items-center justify-content-center gap-2 ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelect(index)}
            >
              {variant === 'stacked' && item.icon && <img src={`${base}${item.icon}`} alt="" aria-hidden="true" />}
              <span>{item.label}</span>
              {variant === 'button' && item.icon && <img src={`${base}${item.icon}`} alt="" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
