import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoaded } from './store/slices/uiSlice.js'
import { useGsapAnimations } from './hooks/useGsapAnimations.js'

// Layout
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Loader from './components/Loader.jsx'
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
    // ponytail: wait for window.load (all images synced) + 800ms min display
    const onLoad = () => setTimeout(() => dispatch(setLoaded()), 800)

    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    return () => window.removeEventListener('load', onLoad)
  }, [dispatch])

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
        <Suspense fallback={null}>
          <Proyectos />
        </Suspense>
      } />
      <Route path="/proyectos/:slug" element={
        <Suspense fallback={null}>
          <ProyectoDetalle />
        </Suspense>
      } />
      </Routes>
      <ChatWidget />
    </>
  )
}
