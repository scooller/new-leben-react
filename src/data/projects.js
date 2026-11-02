// ============================================================
// Project Detail Data — Individual project pages
// Deprecated: Projects are 100% loaded dynamically from backend API (/api/v1/proyectos and /api/v1/proyectos/{slug}/content)
// ============================================================

export const projectDetails = {}

/**
 * Get a project by slug (deprecated, backend is single source of truth)
 * @deprecated
 */
export function getProjectBySlug(slug) {
  return projectDetails[slug] ?? null
}
