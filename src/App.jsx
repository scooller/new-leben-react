import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoaded } from './store/slices/uiSlice.js'
import { useGsapAnimations } from './hooks/useGsapAnimations.js'

// Layout
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Loader from './components/Loader.jsx'
import PageLoader from './components/PageLoader.jsx'
import ChatWidget from './components/ChatWidget.jsx'

// Home sections
import Hero from './components/sections/Hero.jsx'
import Diferenciadores from './components/sections/Diferenciadores.jsx'
import Testimonials from './components/sections/Testimonials.jsx'
import CTASection from './components/sections/CTASection.jsx'
import VideosSection from './components/sections/VideosSection.jsx'

// Pages — lazy loaded
const Proyectos = lazy(() => import('./pages/Proyectos.jsx'))
const ProyectoDetalle = lazy(() => import('./pages/ProyectoDetalle.jsx'))

function Home() {
  return (
    <>
      <Hero />
      <Diferenciadores />
      <Testimonials />
      <CTASection />
      <VideosSection />
    </>
  )
}

export default function App() {
  useGsapAnimations()

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
      <Route path="/brokers" element={
        <main className="d-flex align-items-center justify-content-center vh-100">
          <p className="text-muted">Próximamente</p>
        </main>
      } />
      </Routes>
      <ChatWidget />
    </>
  )
}
