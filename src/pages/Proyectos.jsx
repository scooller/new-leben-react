import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollAnim from '../components/ScrollAnim.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { proyectosHero, projectGroups, valueProps, proyectosCta, searchFilters, images } from '../data/content.js'
import { useGsapAnimations } from '../hooks/useGsapAnimations.js'

/** Parse UF price string like "UF 3.756*" → number */
const parseUf = (s) => parseFloat(s.replace(/[^\d.]/g, '').replace(/\.(?=\d{3}\D*$)/g, '')) || 0

/** Sort + filter project groups */
function useFilteredGroups(searchParams, sortBy) {
  return useMemo(() => {
    const ubicacion = searchParams.get('ubicacion')
    const tipo = searchParams.get('tipo')
    const precio = searchParams.get('precio')

    const groups = projectGroups
      .filter((g) => !ubicacion || g.zone === ubicacion)
      .map((g) => ({
        ...g,
        projects: [...g.projects].filter((p) => {
          if (tipo && !p.tipologia.includes(tipo.split(' ')[0])) return false
          if (precio) {
            const uf = parseUf(p.price)
            if (precio === 'Hasta 3.000 UF' && uf > 3000) return false
            if (precio === '3.000-6.000 UF' && (uf <= 3000 || uf > 6000)) return false
            if (precio === '6.000+ UF' && uf <= 6000) return false
          }
          return true
        }),
      }))
      .filter((g) => g.projects.length > 0)

    // Sort within each group
    groups.forEach((g) => {
      g.projects.sort((a, b) => {
        const ufa = parseUf(a.price)
        const ufb = parseUf(b.price)
        return sortBy === 'mayor' ? ufb - ufa : ufa - ufb
      })
    })

    return groups
  }, [searchParams, sortBy])
}

export default function Proyectos() {
  useGsapAnimations()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('mayor')
  const filteredGroups = useFilteredGroups(searchParams, sortBy)
  const hasFilters = [...searchParams.keys()].length > 0

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="lb-proj-hero container position-relative d-flex align-items-end lb-radius-bl lb-radius-br">
          <div className="lb-proj-hero-bg-wrap lb-radius-bl lb-radius-br">
            <img src={images.proyectosHero} alt="" className="lb-proj-hero-bg" />
            <div className="lb-proj-hero-overlay" />
          </div>
          <ScrollAnim as="div" className="position-relative d-flex flex-column gap-3 lb-proj-hero-content" animation="fade-up" stagger={0.12}>
            <div className="d-flex align-items-center gap-2">
              <img src={images.line} alt="" width="32" height="0" />
              <span className="lb-eyebrow">{proyectosHero.eyebrow}</span>
            </div>
            <h1 className="mb-0 lb-proj-hero-title">{proyectosHero.title}</h1>
            <p className="mb-0 lb-proj-hero-subtitle">{proyectosHero.subtitle}</p>
            <button className="btn btn-outline-light lb-proj-hero-btn">{proyectosHero.ctaText}</button>
          </ScrollAnim>
        </section>

        {/* Featured Projects */}
        <section className="lb-featured container-fluid" id="proyectos">
          <div className="container d-flex flex-column gap-5">
          {hasFilters && (
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={() => setSearchParams()}
              >
                Resetear filtros
              </button>
            </div>
          )}
          {/* Filter bar */}
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between lb-filter-bar bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex flex-wrap gap-2 align-items-center flex-fill">
              {searchFilters.filters.map((f) => (
                <select
                  key={f.id}
                  className="form-select form-select-sm border-0 bg-transparent"
                  style={{ width: 'auto' }}
                  value={searchParams.get(f.id) || ''}
                  onChange={(e) => {
                    const next = new URLSearchParams(searchParams)
                    if (e.target.value) next.set(f.id, e.target.value)
                    else next.delete(f.id)
                    setSearchParams(next)
                  }}
                >
                  <option value="">{f.label}</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </div>
            <select
              className="form-select form-select-sm border-0 bg-transparent"
              style={{ width: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="mayor">De mayor a menor precio</option>
              <option value="menor">De menor a mayor precio</option>
            </select>
          </div>
          {filteredGroups.map((group, gi) => (
            <div className="d-flex flex-column gap-4" key={group.zone}>
              <ScrollAnim as="div" className="d-flex align-items-center justify-content-between" animation="fade-right" delay={gi * 0.1}>
                <h2 className="mb-0 lb-group-zone">{group.zone}</h2>
              </ScrollAnim>

              <ScrollAnim as="div" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" animation="fade-up" stagger={0.15} delay={0.1}>
                {group.projects.map((project) => (
                  <div key={project.name} className="col">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </ScrollAnim>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <p className="text-center text-muted py-5">No se encontraron proyectos con los filtros seleccionados.</p>
          )}
          </div>
        </section>

        {/* Value Props */}
        <ScrollAnim as="section" className="lb-vprops container-fluid" animation="fade-up" duration={1}>
          <div className="container d-flex flex-column gap-5">
          <div className="d-flex flex-column align-items-center gap-3 pt-2">
            <span className="lb-vprops-eyebrow">{valueProps.eyebrow}</span>
            <h2 className="text-center mb-0 lb-vprops-title">{valueProps.title}</h2>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {valueProps.items.map((item) => (
              <div className="col">
              <div className="bg-white lb-vprop-card d-flex flex-column gap-4 h-100" key={item.num}>
                <span className="lb-vprop-num">{item.num}</span>
                <div className="d-flex flex-column gap-2">
                  <h3 className="mb-0 lb-vprop-card-title">{item.title}</h3>
                  <p className="mb-0 lb-vprop-text">{item.text}</p>
                </div>
              </div>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnim>

        {/* CTA Banner */}
        <ScrollAnim as="section" className="lb-proj-cta container-fluid d-flex flex-column align-items-center gap-5" animation="fade-up" duration={1} style={{ '--lb-cta-bg': `url(${images.proyectosCta})` }}>
          <div className="container position-relative d-flex flex-column align-items-center gap-5">
          <div className="position-relative d-flex flex-column align-items-center gap-3 text-center" style={{ zIndex: 1 }}>
            <span className="lb-vprops-eyebrow">{proyectosCta.eyebrow}</span>
            <h2 className="mb-0 lb-proj-cta-title">{proyectosCta.title}</h2>
            <p className="mb-0 lb-proj-cta-subtitle">{proyectosCta.subtitle}</p>
          </div>
          <form className="position-relative d-flex flex-column flex-md-row gap-3 lb-proj-cta-form" style={{ zIndex: 1 }} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              className="form-control border-0 lb-proj-cta-input"
              placeholder={proyectosCta.inputPlaceholder}
            />
            <button type="submit" className="btn btn-dark lb-proj-cta-btn">{proyectosCta.buttonText}</button>
          </form>
          </div>
        </ScrollAnim>
      </main>
      <Footer />
    </>
  )
}
