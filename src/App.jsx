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

// Home sections
import Hero from './components/sections/Hero.jsx'
import Diferenciadores from './components/sections/Diferenciadores.jsx'
import Testimonials from './components/sections/Testimonials.jsx'
import CTASection from './components/sections/CTASection.jsx'
import ProjectOfMonthSection from './components/sections/ProjectOfMonthSection.jsx'
import VideosSection from './components/sections/VideosSection.jsx'

// Pages — lazy loaded
const Proyectos = lazy(() => import('./pages/Proyectos.jsx'))
const ProyectoDetalle = lazy(() => import('./pages/ProyectoDetalle.jsx'))
const Brokers = lazy(() => import('./pages/Brokers.jsx'))
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
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <Loader />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/inn-test" element={
          <Suspense fallback={<PageLoader />}>
            <Inn />
          </Suspense>
        } />
        <Route path="/proyectos" element={
          <Suspense fallback={<PageLoader />}>
            <Proyectos />
          </Suspense>
        } />
        <Route path="/proyectos/:slug" element={
          <Suspense fallback={<PageLoader />}>
            <ProyectoDetalle />
          </Suspense>
        } />
        <Route path="/proyectos/:slug/planta/:plantaId" element={
          <Suspense fallback={<PageLoader />}>
            <ProyectoDetalle />
          </Suspense>
        } />
        <Route path="/brokers" element={
          <Suspense fallback={<PageLoader />}>
            <Brokers />
          </Suspense>
        } />
        <Route path="/cotizador" element={
          <Suspense fallback={<PageLoader />}>
            <CotizadorGeneral />
          </Suspense>
        } />
        <Route path="/cotizador/proyecto/:proyectoSlug/planta/:plantaId" element={
          <Suspense fallback={<PageLoader />}>
            <CotizadorGeneral />
          </Suspense>
        } />
        <Route path="/cotizador/proyecto/:proyectoSlug" element={
          <Suspense fallback={<PageLoader />}>
            <CotizadorGeneral />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        } />
        <Route path="/perfil" element={
          <Suspense fallback={<PageLoader />}>
            <Perfil />
          </Suspense>
        } />
        <Route path="/nosotros" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="nosotros" />
          </Suspense>
        } />
        <Route path="/quienes-somos" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="nosotros" />
          </Suspense>
        } />
        <Route path="/informacion-de-la-empresa" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="informacion-de-la-empresa" />
          </Suspense>
        } />
        <Route path="/proceso-reserva-en-linea" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="proceso-reserva-en-linea" />
          </Suspense>
        } />
        <Route path="/bases-legales" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="bases-legales" />
          </Suspense>
        } />
        <Route path="/trabaja-en-leben" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="trabaja-en-leben" />
          </Suspense>
        } />
        <Route path="/trabaja-con-nosotros" element={
          <Suspense fallback={<PageLoader />}>
            <StaticPage slug="trabaja-en-leben" />
          </Suspense>
        } />
        <Route path="/cookies" element={
          <Suspense fallback={<PageLoader />}>
            <CookiesPage />
          </Suspense>
        } />
        <Route path="/politica-de-cookies" element={
          <Suspense fallback={<PageLoader />}>
            <CookiesPage />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
      <ChatWidget />
      <CookieConsentModal />
      <CookieSettingsTrigger />
    </>
  )
}
