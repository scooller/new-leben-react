import { useEffect, useRef, useState } from 'react'
import { Fancybox } from '@fancyapps/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import ScrollAnim from '../ScrollAnim.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function InteriorismoSection({
  eyebrow,
  title,
  description,
  backgroundImage = 'images/inn/interiorismo.svg',
  id = 'interiorismo',
  ariaLabel = 'Interiorismo',
  // Array of designers with their images and text content
  designers = [
    {
      name: 'Sofía Iturralde',
      image: 'images/inn/interiorismo-sofia.png',
      alt: 'Diseño de Sofía Iturralde',
      color: '#d9bc70',
      text: 'Diseño contemporáneo que combina minimalismo con elementos naturales, creando espacios luminosos y acogedores que resaltan la belleza de los materiales.',
    },
    {
      name: 'Rafael Rivera',
      image: 'images/inn/interiorismo-rafael.png',
      alt: 'Diseño de Rafael Rivera',
      color: '#b78d56',
      text: 'Estilo ecléctico que mezcla tradición y modernidad, con un enfoque en la funcionalidad y la elegancia atemporal.',
    },
    // {
    //   name: 'Teresa Leighton',
    //   image: 'images/inn/interiorismo-teresa.jpg',
    //   alt: 'Diseño de Teresa Leighton',
    //   color: '#a68761',
    //   text: 'Enfoque holístico que integra bienestar y diseño, creando ambientes que promueven el equilibrio y la armonía.',
    // },
  ],
}) {
  const [activeDesigner, setActiveDesigner] = useState(0)
  const sectionRef = useRef(null)
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.to(section, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      Fancybox.bind(section, '[data-fancybox]', {
        Toolbar: { display: { left: [], right: ['close'] } },
      })
    }, section)

    return () => {
      Fancybox.unbind(section)
      ctx.revert()
    }
  }, [])

  const currentDesigner = designers[activeDesigner]

  return (
    <section ref={sectionRef} className="lb-inn-proyecto lb-inn-interiorismo pb-5 mb-5" id={id} aria-label={ariaLabel}>
      <div
        className="container lb-shadow-box px-5 py-4 pt-8"
        style={{ '--lb-inn-proyecto-bg': `url("${base}${backgroundImage}")` }}
      >
        <div className="row align-items-stretch g-5">
          <div className="col-lg-6 align-self-stretch position-relative lb-inn-proyecto__text-column">
            <div className="h-100 pe-4" animation="fade-up">
              {eyebrow && (
                <ScrollAnim as="span" className="lb-inn-proyecto__eyebrow">
                  {eyebrow}
                </ScrollAnim>
              )}

              {title && (
                <ScrollAnim as="h2" className="lb-inn-proyecto__title">
                  {title}
                </ScrollAnim>
              )}

              {description && (
                <ScrollAnim as="p" className="lb-inn-proyecto__text">
                  {description}
                </ScrollAnim>
              )}

              <ScrollAnim as="div" className="lb-inn-interiorismo__designer-content mt-4">
                <h3 style={{ color: currentDesigner.color }} className="lb-inn-interiorismo__designer-name mb-3">
                  {currentDesigner.name}
                </h3>
                <p className="lh-lg lb-inn-interiorismo__designer-text">
                  {currentDesigner.text}
                </p>
              </ScrollAnim>
            </div>
          </div>

          <div className="col-lg-6 d-flex flex-column gap-4">
            <div className="row designers g-4 h-100">
              {designers.map((designer, index) => (
                <div
                  key={designer.name || index}
                  className="col-12 col-md-6 d-flex"
                >
                  <button
                    type="button"
                    className={`btn btn-lg lb-inn-interiorismo__designer-btn ${
                      index === activeDesigner ? 'active' : ''
                    }`}
                    onClick={() => setActiveDesigner(index)}
                  >
                    <h4
                      className="lb-inn-interiorismo__designer-name mt-3 mb-2 px-2"
                      style={{ color: designer.color }}
                    >
                      {designer.name}
                    </h4>
                    <img
                      src={`${base}${designer.image}`}
                      alt={designer.alt}
                      className="img-fluid w-100"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}