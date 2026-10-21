import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLoaded } from './store/slices/uiSlice.js'
import { useGsapAnimations } from './hooks/useGsapAnimations.js'
import { useTrackingConsent } from './hooks/useTrackingConsent.js'

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
const Inn = lazy(() => import('./pages/Inn.jsx'))
const StaticPage = lazy(() => import('./pages/StaticPage.jsx'))
const CookiesPage = lazy(() => import('./pages/CookiesPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function Home() {
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
    const timer = setTimeout(() => dispatch(setLoaded()), 800)
    return () => clearTimeout(timer)
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
          <Route path="/inn-test" element={<Inn />} />
          <Route path="/proyectos/:slug" element={<ProyectoDetalle />} />
          <Route path="/proyectos/:slug/planta/:plantaId" element={<ProyectoDetalle />} />
          <Route path="/brokers" element={<Brokers />} />
          {['/invest', '/inversionistas'].map((p) => (
            <Route key={p} path={p} element={<Invest />} />
          ))}
          <Route path="/cotizador" element={<CotizadorGeneral />} />
          <Route path="/cotizador/proyecto/:proyectoSlug/planta/:plantaId" element={<CotizadorGeneral />} />
          <Route path="/cotizador/proyecto/:proyectoSlug" element={<CotizadorGeneral />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          {['/nosotros', '/quienes-somos', '/informacion-de-la-empresa', '/proceso-reserva-en-linea', '/bases-legales', '/trabaja-en-leben', '/trabaja-con-nosotros'].map((p) => (
            <Route key={p} path={p} element={<StaticPage slug={p.slice(1)} />} />
          ))}
          {['/cookies', '/politica-de-cookies'].map((p) => (
            <Route key={p} path={p} element={<CookiesPage />} />
          ))}
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
