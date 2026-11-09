/**
 * WebMCP Browser Agent Tools Integration
 * Implements WebMCP spec: https://webmachinelearning.github.io/webmcp/
 * Exposes real estate search and quoting tools to AI agents running inside browser sessions.
 */
export function initWebMcp() {
  if (typeof window === 'undefined') return

  // 1. Declarative WebMCP annotations on DOM forms
  const annotateForms = () => {
    try {
      const buscadorForm = document.querySelector('.lb-buscador-card-body')
      if (buscadorForm && !buscadorForm.getAttribute('toolname')) {
        buscadorForm.setAttribute('toolname', 'buscar_departamentos')
        buscadorForm.setAttribute('tooldescription', 'Filtrar y buscar proyectos inmobiliarios por comuna, proyecto y dormitorios')
      }
      const cotizadorForm = document.querySelector('#cotizador form')
      if (cotizadorForm && !cotizadorForm.getAttribute('toolname')) {
        cotizadorForm.setAttribute('toolname', 'enviar_cotizacion')
        cotizadorForm.setAttribute('tooldescription', 'Enviar solicitud de cotización formal de departamento a Inmobiliaria Leben')
      }
    } catch {
      // Non-blocking
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', annotateForms, { once: true })
  } else {
    setTimeout(annotateForms, 200)
  }

  // 2. Programmatic WebMCP Registration
  const modelCtx = window.modelContext || document.modelContext
  if (!modelCtx || typeof modelCtx.registerTool !== 'function') return

  try {
    modelCtx.registerTool({
      name: 'search_projects',
      description: 'Buscar proyectos inmobiliarios y departamentos de Inmobiliaria Leben por comuna o nombre.',
      inputSchema: {
        type: 'object',
        properties: {
          comuna: { type: 'string', description: 'Nombre de la comuna (ej: Temuco, Puerto Varas, Santiago)' },
          query: { type: 'string', description: 'Nombre del proyecto o término de búsqueda' },
        },
      },
      execute: async ({ comuna, query } = {}) => {
        try {
          const res = await fetch('/api/v1/proyectos')
          const data = await res.json()
          let list = Array.isArray(data) ? data : (data?.data || [])
          if (comuna) {
            list = list.filter((p) => p.comuna?.toLowerCase().includes(comuna.toLowerCase()))
          }
          if (query) {
            list = list.filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()))
          }
          return { projects: list }
        } catch (e) {
          return { error: e.message }
        }
      },
    })

    modelCtx.registerTool({
      name: 'get_project_detail',
      description: 'Obtener información detallada, tipologías y equipamiento de un edificio residencial de Inmobiliaria Leben.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Slug del proyecto (ej: inn, cumbres-del-sur)' },
        },
        required: ['slug'],
      },
      execute: async ({ slug }) => {
        try {
          const res = await fetch(`/api/v1/proyectos/${encodeURIComponent(slug)}/content`)
          return await res.json()
        } catch (e) {
          return { error: e.message }
        }
      },
    })
  } catch {
    // Non-blocking WebMCP init
  }
}
