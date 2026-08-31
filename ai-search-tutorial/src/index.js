/**
 * AI search sobre los proyectos de new-leben-react.
 *
 * GET  /search?q=<texto>  → búsqueda semántica (Workers AI embeddings + coseno)
 * GET  /health            → ping
 *
 * Catálogo real: fetch a la API de iLeben (misma que usa el front vía
 * api-proxy.php), cache en memoria por 10 min + embeddings cacheados.
 * ponytail: si el catálogo pasa de ~1k docs, migrar a Vectorize
 * (env.VECTOR_INDEX.query) — el shape de respuesta ya es el mismo.
 *
 * Config: API_BASE como var en wrangler.jsonc, API_TOKEN como secret:
 *   npx wrangler secret put API_TOKEN
 */

const CORS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5'
const CACHE_TTL_MS = 10 * 60 * 1000

// Cache en memoria del isolate: { docs, vectors, fetchedAt }
let cache = null

// Proyecto API → texto indexable
function projectToDoc(p) {
	const parts = [
		p.nombre || p.name,
		p.descripcion || p.description,
		p.ubicacion || p.comuna || p.ciudad,
		p.tipologias,
		p.estado,
	].filter(Boolean)
	return { id: String(p.id), slug: p.slug || null, text: parts.join('. ') }
}

async function getCatalog(env) {
	if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache
	const r = await fetch(`${env.API_BASE}/api/v1/proyectos`, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.API_TOKEN}`,
			// La API valida origen, igual que api-proxy.php
			Origin: env.AUTHORIZED_ORIGIN,
			Referer: `${env.AUTHORIZED_ORIGIN}/`,
		},
	})
	if (!r.ok) throw new Error(`API ${r.status}`)
	const json = await r.json()
	const docs = (json?.data || []).map(projectToDoc).filter((d) => d.text)
	const vectors = await Promise.all(docs.map((d) => embed(env, d.text)))
	cache = { docs, vectors, fetchedAt: Date.now() }
	return cache
}

function cosine(a, b) {
	let dot = 0, na = 0, nb = 0
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i]
		na += a[i] * a[i]
		nb += b[i] * b[i]
	}
	return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

async function embed(env, text) {
	const { data } = await env.AI.run(EMBED_MODEL, { text: [text] })
	return data[0]
}

async function search(env, q) {
	const { docs, vectors } = await getCatalog(env)
	const queryVec = await embed(env, q)
	return docs
		.map((doc, i) => ({ id: doc.id, slug: doc.slug, score: cosine(queryVec, vectors[i]) }))
		.sort((a, b) => b.score - a.score)
		.slice(0, 5)
}

export default {
	async fetch(req, env) {
		const { pathname } = new URL(req.url)

		if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

		if (pathname === '/health') {
			return Response.json({ ok: true }, { headers: CORS })
		}

		if (pathname === '/search') {
			const q = new URL(req.url).searchParams.get('q')?.trim()
			if (!q) return Response.json({ error: 'missing ?q' }, { status: 400, headers: CORS })
			return Response.json({ query: q, results: await search(env, q) }, { headers: CORS })
		}

		return new Response('Not found', { status: 404, headers: CORS })
	},
}
