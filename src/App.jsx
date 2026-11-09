import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLoaded } from './store/slices/uiSlice.js'
import { useGsapAnimations } from './hooks/useGsapAnimations.js'
import { useTrackingConsent } from './hooks/useTrackingConsent.js'
import { useSeo } from './hooks/useSeo.js'

// Layout
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Loader from './components/Loader.jsx'
import PageLoader from './components/PageLoader.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import CookieConsentModal from './components/cookies/CookieConsentModal.jsx'
import CookieSettingsTrigger from './components/cookies/CookieSettingsTrigger.jsx'
import AnnouncementModal from './components/announcement/AnnouncementModal.jsx'
import TerrainErosionCarve from './components/TerrainErosionCarve.jsx'

// Home sections
import Hero from './components/sections/Hero.jsx'
import Diferenciadores from './components/sections/Diferenciadores.jsx'
import Testimonials from './components/sections/Testimonials.jsx'
import CTASection from './components/sections/CTASection.jsx'
import ProjectOfMonthSection from './components/sections/ProjectOfMonthSection.jsx'
import VideosSection from './components/sections/VideosSection.jsx'

// Pages — lazy loaded
const ProyectoDetalle = lazy(() => import('./pages/ProyectoDetalle.jsx'))
const Brokers = lazy(() => import('./pages/Brokers.jsx'))
const Invest = lazy(() => import('./pages/Invest.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Perfil = lazy(() => import('./pages/Perfil.jsx'))
const CotizadorGeneral = lazy(() => import('./pages/CotizadorGeneral.jsx'))
const StaticPage = lazy(() => import('./pages/StaticPage.jsx'))
const CookiesPage = lazy(() => import('./pages/CookiesPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function Home() {
  useSeo({
    title: 'Departamentos y Proyectos en Venta en Chile',
    description: 'Venta de departamentos y proyectos residenciales en el sur de Chile y Santiago. Diseños sustentables, alta calidad y asesoría personalizada con Inmobiliaria Leben.',
    canonical: '/',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': 'https://ileben.cl/#organization',
        name: 'Inmobiliaria Leben',
        legalName: 'Leben Grupo Inmobiliario',
        url: 'https://ileben.cl',
        logo: 'https://ileben.cl/images/brand/leben_bptl_pro.svg',
        image: 'https://ileben.cl/images/home/hero-institucional.jpg',
        description: 'Desarrollador y gestor inmobiliario con proyectos residenciales de alta gama en el sur y centro de Chile.',
        telephone: '+56 9 3950 0089',
        email: 'info@ileben.cl',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Dr. Manuel Barros Borgoño 386',
          addressLocality: 'Providencia',
          addressRegion: 'Región Metropolitana',
          addressCountry: 'CL',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:30',
          },
        ],
        sameAs: [
          'https://www.facebook.com/lebeninmobiliaria',
          'https://www.instagram.com/lebeninmobiliaria',
          'https://www.linkedin.com/company/leben-inmobiliaria',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://ileben.cl/#website',
        url: 'https://ileben.cl',
        name: 'Inmobiliaria Leben',
        publisher: {
          '@id': 'https://ileben.cl/#organization',
        },
      },
    ],
  })

  return (
    <>
      <Hero />
      <Diferenciadores />
      <Testimonials />
      <CTASection />
      <ProjectOfMonthSection />
      <VideosSection />
    </>
  )
}

export default function App() {
  useGsapAnimations()
  useTrackingConsent()

  const dispatch = useDispatch()

  useEffect(() => {
    // Immediate activation on next frame to eliminate artificial FCP/LCP block
    const raf = requestAnimationFrame(() => dispatch(setLoaded()))
    return () => cancelAnimationFrame(raf)
  }, [dispatch])

  const location = useLocation()

  // Prevent browser from restoring old scroll positions across route changes
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (!location.hash) {
      ScrollTrigger.clearScrollMemory?.()
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Re-assert on next animation frame to guarantee zero offset after DOM/Suspense commit
      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      })
      return () => cancelAnimationFrame(raf)
    }

    const id = decodeURIComponent(location.hash.slice(1))
    let attempts = 0
    let timer

    const tryScrollToAnchor = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (attempts < 8) {
        attempts++
        timer = setTimeout(tryScrollToAnchor, 100)
      }
    }

    tryScrollToAnchor()
    return () => clearTimeout(timer)
  }, [location.pathname, location.hash])

  return (
    <>
      <Loader />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main id="main-home">
                  <TerrainErosionCarve className="lb-home-terrain-bg" />
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route path="/inn-test" element={<Navigate to="/proyectos/inn" replace />} />
          <Route path="/proyectos/:slug" element={<ProyectoDetalle />} />
          <Route path="/proyectos/:slug/planta/:plantaId" element={<ProyectoDetalle />} />
          <Route path="/brokers" element={<Brokers />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/inversionistas" element={<Navigate to="/invest" replace />} />
          <Route path="/cotizador" element={<CotizadorGeneral />} />
          <Route path="/cotizador/proyecto/:proyectoSlug/planta/:plantaId" element={<CotizadorGeneral />} />
          <Route path="/cotizador/proyecto/:proyectoSlug" element={<CotizadorGeneral />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          {/* Static Pages - Canonical routes */}
          <Route path="/nosotros" element={<StaticPage slug="nosotros" />} />
          <Route path="/quienes-somos" element={<Navigate to="/nosotros" replace />} />
          <Route path="/informacion-de-la-empresa" element={<Navigate to="/nosotros" replace />} />
          <Route path="/proceso-reserva-en-linea" element={<StaticPage slug="proceso-reserva-en-linea" />} />
          <Route path="/bases-legales" element={<StaticPage slug="bases-legales" />} />
          <Route path="/trabaja-en-leben" element={<StaticPage slug="trabaja-en-leben" />} />
          <Route path="/trabaja-con-nosotros" element={<Navigate to="/trabaja-en-leben" replace />} />
          {/* Cookies */}
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/politica-de-cookies" element={<Navigate to="/cookies" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatWidget />
      <CookieConsentModal />
      <CookieSettingsTrigger />
      <AnnouncementModal />
    </>
  )
}
