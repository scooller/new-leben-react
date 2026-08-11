import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice.js'
import { images } from '../data/content.js'
import { Lock, Mail, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error = useSelector((s) => s.auth.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
    // Redirect handled by the `if (user)` check below on re-render
  }

  const fillDemo = (role) => {
    const creds = role === 'comprador'
      ? { email: 'comprador@demo.cl', password: 'demo123' }
      : { email: 'broker@demo.cl', password: 'demo123' }
    setEmail(creds.email)
    setPassword(creds.password)
  }

  // Redirect if login succeeds
  const user = useSelector((s) => s.auth.user)
  useEffect(() => {
    if (user) navigate('/perfil')
  }, [user, navigate])
  if (user) return null

  return (
    <div className="lb-login">
      <div className="lb-login__bg" aria-hidden>
        <img src={images.projInn} alt="" />
        <div className="lb-login__overlay" />
      </div>

      <div className="lb-login__card">
        <Link to="/" className="lb-login__logo">
          <img src={images.logoText} alt="Leben" />
        </Link>

        <h1 className="lb-login__title">Portal de Clientes</h1>
        <p className="lb-login__subtitle">Ingresa para ver tu información</p>

        <form onSubmit={handleSubmit} className="lb-login__form">
          {error && <div className="lb-login__error">{error}</div>}

          <label className="lb-login__field">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="lb-login__field">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-success d-flex align-items-center justify-content-center gap-2 fw-semibold py-2">
            Ingresar
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="lb-login__demo">
          <p className="lb-login__demo-label">Accesos demo rápidos:</p>
          <div className="lb-login__demo-buttons">
            <button type="button" onClick={() => fillDemo('comprador')} className="btn btn-outline-success btn-sm">
              Cliente
            </button>
            <button type="button" onClick={() => fillDemo('broker')} className="btn btn-outline-success btn-sm">
              Broker
            </button>
          </div>
          <p className="lb-login__demo-hint">
            Clave demo: <code>demo123</code>
          </p>
        </div>

        <Link to="/" className="lb-login__back">← Volver al sitio</Link>
      </div>
    </div>
  )
}
