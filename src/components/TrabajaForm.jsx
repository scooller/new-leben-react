import { useState } from 'react'
import {
  Send,
  Upload,
  CheckCircle2,
  Linkedin,
  FileCheck,
  AlertCircle,
  Briefcase,
} from 'lucide-react'
import Turnstile from './common/Turnstile.jsx'
import {
  CHILE_REGIONS,
  formatRut,
  validateRut,
  formatPhone,
  validatePhone,
  validateEmail,
  formatLinkedInUrl,
  validateLinkedInUrl,
} from '../lib/chileUtils.js'

export default function TrabajaForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    telefono: '',
    email: '',
    regiondedomicilio: '',
    tituloprofesionaltecnico: '',
    ultimocargodesempenado: '',
    ultimaempresa: '',
    experiencia: '',
    linkedin: '',
    cargarcv: null,
    brevesintesisdetuexperiencialaboral: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // RUT formatting as user types
  const handleRutChange = (e) => {
    const formatted = formatRut(e.target.value)
    setFormData((prev) => ({ ...prev, rut: formatted }))
    if (fieldErrors.rut) {
      setFieldErrors((prev) => ({ ...prev, rut: '' }))
    }
  }

  // RUT validation on blur
  const handleRutBlur = () => {
    if (formData.rut && !validateRut(formData.rut)) {
      setFieldErrors((prev) => ({ ...prev, rut: 'RUT inválido. Verifica número y dígito verificador.' }))
    }
  }

  // Phone formatting
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData((prev) => ({ ...prev, telefono: formatted }))
    if (fieldErrors.telefono) {
      setFieldErrors((prev) => ({ ...prev, telefono: '' }))
    }
  }

  // Phone validation on blur
  const handlePhoneBlur = () => {
    if (formData.telefono && !validatePhone(formData.telefono)) {
      setFieldErrors((prev) => ({ ...prev, telefono: 'Ingresa un teléfono chileno válido (9 dígitos).' }))
    }
  }

  // Email validation on blur
  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Ingresa un correo electrónico válido.' }))
    }
  }

  // LinkedIn formatting and validation on blur
  const handleLinkedInBlur = () => {
    if (formData.linkedin) {
      const normalized = formatLinkedInUrl(formData.linkedin)
      setFormData((prev) => ({ ...prev, linkedin: normalized }))
      if (!validateLinkedInUrl(normalized)) {
        setFieldErrors((prev) => ({ ...prev, linkedin: 'Formato de perfil de LinkedIn no válido.' }))
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('El archivo no debe superar los 10MB.')
        return
      }
      setErrorMessage('')
      setFormData((prev) => ({ ...prev, cargarcv: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Required fields check
    const required = [
      'nombre',
      'apellido',
      'rut',
      'telefono',
      'email',
      'regiondedomicilio',
      'tituloprofesionaltecnico',
      'ultimocargodesempenado',
      'ultimaempresa',
      'experiencia',
      'brevesintesisdetuexperiencialaboral',
    ]

    const errors = {}

    for (const field of required) {
      if (!String(formData[field] || '').trim()) {
        errors[field] = 'Este campo es requerido.'
      }
    }

    if (formData.rut && !validateRut(formData.rut)) {
      errors.rut = 'RUT inválido. Verifica número y dígito verificador.'
    }

    if (formData.telefono && !validatePhone(formData.telefono)) {
      errors.telefono = 'Ingresa un teléfono chileno válido (9 dígitos).'
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido.'
    }

    if (formData.linkedin && !validateLinkedInUrl(formData.linkedin)) {
      errors.linkedin = 'Formato de perfil de LinkedIn no válido.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setErrorMessage('Por favor, revisa los campos marcados en rojo antes de continuar.')
      return
    }

    if (!formData.cargarcv) {
      setErrorMessage('Por favor, adjunta tu CV en formato PDF, Word o TXT.')
      return
    }

    // Turnstile check
    if (!turnstileToken) {
      setErrorMessage('Por favor, completa la verificación de seguridad Turnstile.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    // Simulate submission / hook to API
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1000)
  }

  const handleReset = () => {
    setFormData({
      nombre: '',
      apellido: '',
      rut: '',
      telefono: '',
      email: '',
      regiondedomicilio: '',
      tituloprofesionaltecnico: '',
      ultimocargodesempenado: '',
      ultimaempresa: '',
      experiencia: '',
      linkedin: '',
      cargarcv: null,
      brevesintesisdetuexperiencialaboral: '',
    })
    setFieldErrors({})
    setTurnstileToken(null)
    setIsSubmitted(false)
    setErrorMessage('')
  }

  if (isSubmitted) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center">
        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
          <CheckCircle2 size={36} />
        </div>
        <h3 className="h4 fw-bold text-dark mb-2">¡Postulación Enviada con Éxito!</h3>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
          Muchas gracias por tu interés en formar parte de Leben Grupo Inmobiliario. Nuestro equipo de selección revisará tus antecedentes y se pondrá en contacto contigo si tu perfil califica para nuestras vacantes.
        </p>
        <div>
          <button type="button" onClick={handleReset} className="btn btn-outline-danger px-4">
            Enviar otra postulación
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white lb-trabaja-card">
      <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
        <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-3 p-2">
          <Briefcase size={28} />
        </div>
        <div>
          <h3 className="h5 fw-bold mb-0 text-dark">Formulario de Postulación</h3>
          <p className="text-muted small mb-0">Completa tus datos laborales y adjunta tu currículum</p>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 py-2 px-3 small">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          {/* Nombre y Apellido */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              className={`form-control ${fieldErrors.nombre ? 'is-invalid' : ''}`}
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            {fieldErrors.nombre && <div className="invalid-feedback small">{fieldErrors.nombre}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Apellido <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              className={`form-control ${fieldErrors.apellido ? 'is-invalid' : ''}`}
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            {fieldErrors.apellido && <div className="invalid-feedback small">{fieldErrors.apellido}</div>}
          </div>

          {/* RUT y Telefono (+56) */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              RUT <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="rut"
              maxLength={12}
              className={`form-control ${fieldErrors.rut ? 'is-invalid' : ''}`}
              placeholder="Ej: 12.345.678-9"
              value={formData.rut}
              onChange={handleRutChange}
              onBlur={handleRutBlur}
              required
            />
            {fieldErrors.rut && <div className="invalid-feedback small">{fieldErrors.rut}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Teléfono <span className="text-danger">*</span>
            </label>
            <div className="input-group has-validation">
              <span className="input-group-text bg-light text-secondary fw-semibold">+56</span>
              <input
                type="tel"
                name="telefono"
                maxLength={9}
                className={`form-control ${fieldErrors.telefono ? 'is-invalid' : ''}`}
                placeholder="9 1234 5678"
                value={formData.telefono}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                required
              />
              {fieldErrors.telefono && <div className="invalid-feedback small">{fieldErrors.telefono}</div>}
            </div>
          </div>

          {/* Email y Region Selector */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
              placeholder="nombre@correo.cl"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              required
            />
            {fieldErrors.email && <div className="invalid-feedback small">{fieldErrors.email}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Región de domicilio <span className="text-danger">*</span>
            </label>
            <select
              name="regiondedomicilio"
              className={`form-select ${fieldErrors.regiondedomicilio ? 'is-invalid' : ''}`}
              value={formData.regiondedomicilio}
              onChange={handleChange}
              required
            >
              <option value="">—Selecciona tu región—</option>
              {CHILE_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {fieldErrors.regiondedomicilio && <div className="invalid-feedback small">{fieldErrors.regiondedomicilio}</div>}
          </div>

          {/* Titulo y Experiencia (anos) */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Título profesional / técnico <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="tituloprofesionaltecnico"
              className={`form-control ${fieldErrors.tituloprofesionaltecnico ? 'is-invalid' : ''}`}
              placeholder="Ej: Ingeniero Constructor / Arquitecto"
              value={formData.tituloprofesionaltecnico}
              onChange={handleChange}
              required
            />
            {fieldErrors.tituloprofesionaltecnico && <div className="invalid-feedback small">{fieldErrors.tituloprofesionaltecnico}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Años de experiencia <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="50"
              name="experiencia"
              className={`form-control ${fieldErrors.experiencia ? 'is-invalid' : ''}`}
              placeholder="Ej: 5"
              value={formData.experiencia}
              onChange={handleChange}
              required
            />
            {fieldErrors.experiencia && <div className="invalid-feedback small">{fieldErrors.experiencia}</div>}
          </div>

          {/* Ultimo cargo y Ultima empresa */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Último cargo desempeñado <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="ultimocargodesempenado"
              className={`form-control ${fieldErrors.ultimocargodesempenado ? 'is-invalid' : ''}`}
              placeholder="Ej: Jefe de Proyectos"
              value={formData.ultimocargodesempenado}
              onChange={handleChange}
              required
            />
            {fieldErrors.ultimocargodesempenado && <div className="invalid-feedback small">{fieldErrors.ultimocargodesempenado}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Última empresa <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="ultimaempresa"
              className={`form-control ${fieldErrors.ultimaempresa ? 'is-invalid' : ''}`}
              placeholder="Nombre de la empresa"
              value={formData.ultimaempresa}
              onChange={handleChange}
              required
            />
            {fieldErrors.ultimaempresa && <div className="invalid-feedback small">{fieldErrors.ultimaempresa}</div>}
          </div>

          {/* LinkedIn (opcional con mascara/normalizacion) */}
          <div className="col-12">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-1">
              <Linkedin size={15} className="text-primary" />
              <span>LinkedIn</span>
              <span className="text-muted fw-normal">(opcional)</span>
            </label>
            <input
              type="url"
              name="linkedin"
              className={`form-control ${fieldErrors.linkedin ? 'is-invalid' : ''}`}
              placeholder="https://www.linkedin.com/in/tu-perfil o tu usuario"
              value={formData.linkedin}
              onChange={handleChange}
              onBlur={handleLinkedInBlur}
            />
            {fieldErrors.linkedin ? (
              <div className="invalid-feedback small">{fieldErrors.linkedin}</div>
            ) : (
              <div className="form-text small text-muted">
                Puedes ingresar tu URL completa o simplemente tu usuario de LinkedIn.
              </div>
            )}
          </div>

          {/* Cargar CV */}
          <div className="col-12">
            <label className="form-label small fw-semibold text-secondary">
              Cargar CV <span className="text-danger">*</span> <span className="text-muted fw-normal">(.pdf, .docx, .doc, .txt — máx. 10MB)</span>
            </label>
            <div className="input-group">
              <input
                type="file"
                name="cargarcv"
                id="cargarcv-input"
                className="form-control"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                required
              />
              <label className="input-group-text bg-light text-secondary" htmlFor="cargarcv-input">
                {formData.cargarcv ? <FileCheck size={18} className="text-success" /> : <Upload size={18} />}
              </label>
            </div>
            {formData.cargarcv && (
              <div className="form-text text-success small mt-1 d-flex align-items-center gap-1">
                <FileCheck size={14} />
                <span>Archivo seleccionado: <strong>{formData.cargarcv.name}</strong></span>
              </div>
            )}
          </div>

          {/* Breve sintesis laboral */}
          <div className="col-12">
            <label className="form-label small fw-semibold text-secondary">
              Breve síntesis de tu experiencia laboral <span className="text-danger">*</span>
            </label>
            <textarea
              name="brevesintesisdetuexperiencialaboral"
              rows={4}
              className={`form-control ${fieldErrors.brevesintesisdetuexperiencialaboral ? 'is-invalid' : ''}`}
              placeholder="Cuéntanos brevemente sobre tus principales logros, áreas de especialización e interés profesional..."
              value={formData.brevesintesisdetuexperiencialaboral}
              onChange={handleChange}
              required
            />
            {fieldErrors.brevesintesisdetuexperiencialaboral && (
              <div className="invalid-feedback small">{fieldErrors.brevesintesisdetuexperiencialaboral}</div>
            )}
          </div>

          {/* Turnstile Antispam Widget */}
          <div className="col-12 pt-2">
            <Turnstile
              onVerify={(token) => {
                setTurnstileToken(token)
                setErrorMessage('')
              }}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>

          <div className="col-12 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pt-2">
            <small className="text-muted">* Campos obligatorios</small>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-danger btn-lg px-4 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>ENVIAR POSTULACIÓN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
