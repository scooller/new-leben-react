import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
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
    // ponytail: 800ms arbitrary, replace with LCP-based timing if bounce rate on fast connections rises
    const onLoad = () => setTimeout(() => dispatch(setLoaded()), 800)

    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    return () => window.removeEventListener('load', onLoad)
  }, [dispatch])

  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    } else {
      const id = location.hash.replace('#', '')
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return true
        }
        return false
      }
      if (!tryScroll()) {
        const t1 = setTimeout(tryScroll, 100)
        const t2 = setTimeout(tryScroll, 300)
        const t3 = setTimeout(tryScroll, 700)
        return () => {
          clearTimeout(t1)
          clearTimeout(t2)
          clearTimeout(t3)
        }
      }
    }
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
          <Route path="/invest" element={<Invest />} />
          <Route path="/inversionistas" element={<Invest />} />
          <Route path="/cotizador" element={<CotizadorGeneral />} />
          <Route path="/cotizador/proyecto/:proyectoSlug/planta/:plantaId" element={<CotizadorGeneral />} />
          <Route path="/cotizador/proyecto/:proyectoSlug" element={<CotizadorGeneral />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/nosotros" element={<StaticPage slug="nosotros" />} />
          <Route path="/quienes-somos" element={<StaticPage slug="nosotros" />} />
          <Route path="/informacion-de-la-empresa" element={<StaticPage slug="informacion-de-la-empresa" />} />
          <Route path="/proceso-reserva-en-linea" element={<StaticPage slug="proceso-reserva-en-linea" />} />
          <Route path="/bases-legales" element={<StaticPage slug="bases-legales" />} />
          <Route path="/trabaja-en-leben" element={<StaticPage slug="trabaja-en-leben" />} />
          <Route path="/trabaja-con-nosotros" element={<StaticPage slug="trabaja-en-leben" />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/politica-de-cookies" element={<CookiesPage />} />
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
