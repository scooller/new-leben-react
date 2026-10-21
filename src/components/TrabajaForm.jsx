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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // 10MB limit check
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

    for (const field of required) {
      if (!String(formData[field] || '').trim()) {
        setErrorMessage('Por favor, completa todos los campos obligatorios (*).')
        return
      }
    }

    if (!formData.cargarcv) {
      setErrorMessage('Por favor, adjunta tu CV en formato PDF, Word o TXT.')
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
              className="form-control"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Apellido <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              className="form-control"
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          {/* RUT y Telefono */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              RUT <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="rut"
              className="form-control"
              placeholder="Ej: 12.345.678-9"
              value={formData.rut}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              className="form-control"
              placeholder="+56 9 1234 5678"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email y Region */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="nombre@correo.cl"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Región de domicilio <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="regiondedomicilio"
              className="form-control"
              placeholder="Ej: Región Metropolitana"
              value={formData.regiondedomicilio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Titulo y Experiencia (anos) */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Título profesional / técnico <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="tituloprofesionaltecnico"
              className="form-control"
              placeholder="Ej: Ingeniero Constructor / Arquitecto"
              value={formData.tituloprofesionaltecnico}
              onChange={handleChange}
              required
            />
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
              className="form-control"
              placeholder="Ej: 5"
              value={formData.experiencia}
              onChange={handleChange}
              required
            />
          </div>

          {/* Ultimo cargo y Ultima empresa */}
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Último cargo desempeñado <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="ultimocargodesempenado"
              className="form-control"
              placeholder="Ej: Jefe de Proyectos"
              value={formData.ultimocargodesempenado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-secondary">
              Última empresa <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="ultimaempresa"
              className="form-control"
              placeholder="Nombre de la empresa"
              value={formData.ultimaempresa}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo nuevo: LinkedIn (opcional) */}
          <div className="col-12">
            <label className="form-label small fw-semibold text-secondary d-flex align-items-center gap-1">
              <Linkedin size={15} className="text-primary" />
              <span>LinkedIn</span>
              <span className="text-muted fw-normal">(opcional)</span>
            </label>
            <input
              type="url"
              name="linkedin"
              className="form-control"
              placeholder="https://www.linkedin.com/in/tu-perfil"
              value={formData.linkedin}
              onChange={handleChange}
            />
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
              className="form-control"
              placeholder="Cuéntanos brevemente sobre tus principales logros, áreas de especialización e interés profesional..."
              value={formData.brevesintesisdetuexperiencialaboral}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pt-3">
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
                  <span>ENVIAR</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
