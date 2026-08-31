import { useRef } from 'react'
import { hover } from '../icons/animated-icon.jsx'

// Icono por item: string = imagen estática | componente = icono animado en hover (ref propio)
function ItemIcon({ icon }) {
  const ref = useRef(null)
  if (!icon) return null
  if (typeof icon === 'string') {
    return <img src={`${import.meta.env.BASE_URL}${icon}`} alt="" aria-hidden="true" />
  }
  const Icon = icon
  return (
    <span className="d-inline-flex" {...hover(ref)}>
      <Icon ref={ref} />
    </span>
  )
}

export default function CarouselNav({
  items = [],
  targetId,
  activeIndex = 0,
  onSelect,
  variant = 'button', // 'button' = degradado con texto+icono en línea | 'stacked' = icono arriba, texto debajo, sin degradado
  className = '',
}) {
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
              {variant === 'stacked' && item.icon && <ItemIcon icon={item.icon} />}
              <span>{item.label}</span>
              {variant === 'button' && item.icon && <ItemIcon icon={item.icon} />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
