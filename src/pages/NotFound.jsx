import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="lb-not-found d-flex align-items-center justify-content-center text-center">
        <div className="container">
          <p className="lb-not-found__code mb-2">404</p>
          <h1 className="lb-not-found__title mb-3">Página no encontrada</h1>
          <p className="lb-not-found__text mx-auto mb-4">
            La dirección que buscas no existe o fue movida.
          </p>
          <Link to="/" className="btn btn-dark d-inline-flex align-items-center gap-2">
            <Home size={17} aria-hidden="true" />
            Ir al inicio
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
