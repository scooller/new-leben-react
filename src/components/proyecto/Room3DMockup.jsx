import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

/**
 * Mockup 3D de una habitación (living) por dentro, con luz del sol
 * simulada según la orientación de la planta (hemisferio sur: el sol
 * viene del norte).
 *
 * Props:
 * - orientacion: código de orientación de la planta (N, S, E, O, NE, NO, SE, SO)
 */
const ORIENTACIONES = {
  N:  { label: 'Norte',    dir: [0, -1], intensidad: 1.5, desc: 'Máxima luz solar directa todo el día' },
  NE: { label: 'Nor-Oriente', dir: [0.7, -0.7], intensidad: 1.3, desc: 'Sol directo, más fuerte en la mañana' },
  NO: { label: 'Nor-Poniente', dir: [-0.7, -0.7], intensidad: 1.3, desc: 'Sol directo, más fuerte en la tarde' },
  E:  { label: 'Oriente',  dir: [1, 0], intensidad: 1.1, desc: 'Sol de la mañana' },
  O:  { label: 'Poniente', dir: [-1, 0], intensidad: 1.1, desc: 'Sol de la tarde' },
  SE: { label: 'Sur-Oriente', dir: [0.7, 0.7], intensidad: 0.5, desc: 'Luz suave, sol indirecto' },
  SO: { label: 'Sur-Poniente', dir: [-0.7, 0.7], intensidad: 0.5, desc: 'Luz suave, sol indirecto' },
  S:  { label: 'Sur',      dir: [0, 1], intensidad: 0.25, desc: 'Mínima luz directa' },
}

const fmtM2 = (v) => `${Math.round(parseFloat(v) || 0)} m²`
const fmtUF = (v) => `UF ${(Math.round(parseFloat(v) || 0)).toLocaleString('es-CL')}`

export default function Room3DMockup({ orientacion = 'N', planta = null }) {
  const mountRef = useRef(null)
  const [night, setNight] = useState(false)
  const [loading, setLoading] = useState(true)
  const nightRef = useRef(false)
  const applyNightRef = useRef(null)

  const cfg = ORIENTACIONES[(orientacion || 'N').trim().toUpperCase()] || ORIENTACIONES.N

  // Alternar día/noche sin reconstruir la escena
  useEffect(() => { nightRef.current = night; applyNightRef.current?.(night) }, [night])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // --- Dimensiones de la habitación (metros) ---
    const W = 6, H = 2.7, D = 4.5
    const WALL_T = 0.12

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87b7e8)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 1.6, 1.2) // dentro de la habitación

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.target.set(0, 1.2, -1)
    controls.minDistance = 0.5
    controls.maxDistance = 3.5
    controls.maxPolarAngle = Math.PI / 2 - 0.02
    controls.minPolarAngle = 0.4

    // --- Texturas reales del video + gestor de carga ---
    const base = import.meta.env.BASE_URL
    const manager = new THREE.LoadingManager()
    manager.onLoad = () => setReady() // pano y texturas listas
    const loadTex = (file, rx = 1, ry = 1) => {
      const t = new THREE.TextureLoader(manager).load(`${base}images/inn/3d/${file}`)
      t.colorSpace = THREE.SRGBColorSpace
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      t.repeat.set(rx, ry)
      return t
    }

    // --- Materiales con texturas procedurales de alta calidad ---
    // makeBump: canvas -> bumpMap (lineal).
    const makeBump = (size, draw, repeat = 1) => {
      const c = document.createElement('canvas')
      c.width = c.height = size
      draw(c.getContext('2d'), size)
      const t = new THREE.CanvasTexture(c)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(repeat, repeat)
      return t
    }
    // grano gaussiano (más orgánico que píxeles random)
    const grain = (ctx, s, alpha, n, light = true) => {
      for (let i = 0; i < n; i++) {
        const v = light ? 200 + Math.random() * 55 : Math.random() * 55
        ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`
        const r = Math.random() < 0.8 ? 1 : 2
        ctx.fillRect(Math.random() * s, Math.random() * s, r, r)
      }
    }

    // ===== PISO: roble natural claro con veta realista + nudos + bump =====
    const drawFloor = (ctx, s, bump = false) => {
      ctx.fillStyle = bump ? '#808080' : '#c8aa82'
      ctx.fillRect(0, 0, s, s)
      const plank = s / 5
      for (let i = 0; i < 5; i++) {
        const x0 = i * plank
        // tono base del tablón (ligera variación de madera)
        const tone = 182 + Math.random() * 30
        if (bump) {
          const g = 128 + ((tone - 197) * 0.8 | 0)
          ctx.fillStyle = `rgb(${g},${g},${g})`
        } else {
          ctx.fillStyle = `rgb(${tone},${tone * 0.83 | 0},${tone * 0.62 | 0})`
        }
        ctx.fillRect(x0, 0, plank - 2, s)
        // veta longitudinal (fibras largas)
        const fibers = 0.13
        for (let g = 0; g < 26; g++) {
          const gx = x0 + Math.random() * (plank - 2)
          const w = 0.5 + Math.random() * 1.5
          const dark = Math.random() < 0.5
          ctx.strokeStyle = bump
            ? `rgba(${dark ? 60 : 200},${dark ? 60 : 200},${dark ? 60 : 200},${fibers})`
            : (dark ? `rgba(105,80,52,${fibers})` : `rgba(240,225,200,${fibers * 0.7})`)
          ctx.lineWidth = w
          ctx.beginPath()
          ctx.moveTo(gx, 0)
          ctx.bezierCurveTo(gx + (Math.random() * 6 - 3), s * 0.33, gx + (Math.random() * 6 - 3), s * 0.66, gx + (Math.random() * 4 - 2), s)
          ctx.stroke()
        }
        // arcos catedral (marca característica del roble)
        if (Math.random() < 0.8) {
          const cx = x0 + plank * (0.3 + Math.random() * 0.4)
          const cy = s * (0.2 + Math.random() * 0.6)
          ctx.strokeStyle = bump ? 'rgba(70,70,70,.25)' : 'rgba(120,95,65,.18)'
          ctx.lineWidth = 1.2
          for (let a = 0; a < 5; a++) {
            ctx.beginPath()
            ctx.ellipse(cx, cy, 4 + a * 5, (4 + a * 5) * 2.4, 0, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
        // nudo ocasional
        if (Math.random() < 0.35) {
          const kx = x0 + plank * (0.25 + Math.random() * 0.5)
          const ky = s * Math.random()
          ctx.strokeStyle = bump ? 'rgba(50,50,50,.5)' : 'rgba(85,60,38,.45)'
          for (let a = 0; a < 4; a++) {
            ctx.beginPath()
            ctx.ellipse(kx, ky, 3 + a * 2.5, 5 + a * 3, 0, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
        // microbisel (línea de sombra entre tablones) + junta corta
        ctx.fillStyle = bump ? 'rgba(30,30,30,.9)' : 'rgba(80,60,42,.55)'
        ctx.fillRect(x0 + plank - 2, 0, 2, s)
        const off = Math.random() * s
        ctx.fillRect(x0, off, plank - 2, 2)
      }
      grain(ctx, s, 0.03, 3000)
    }
    const bumpPiso = makeBump(1024, (ctx, s) => drawFloor(ctx, s, true), 2)
    // Piso: textura REAL del video + bump procedural, satinado con clearcoat
    const matPiso = new THREE.MeshPhysicalMaterial({
      map: loadTex('tex_piso.png', 2, 2), bumpMap: bumpPiso, bumpScale: 0.03,
      roughness: 0.38, metalness: 0.0, clearcoat: 0.12, clearcoatRoughness: 0.3,
    })

    // ===== MURO: revoque fino con bump sutil =====
    const drawPlaster = (ctx, s, bump = false) => {
      ctx.fillStyle = bump ? '#808080' : '#ece7df'
      ctx.fillRect(0, 0, s, s)
      // manchas suaves de tono (revoque a llana)
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = bump
          ? (Math.random() < 0.5 ? 'rgba(100,100,100,.10)' : 'rgba(160,160,160,.10)')
          : (Math.random() < 0.5 ? 'rgba(220,214,204,.10)' : 'rgba(255,255,255,.10)')
        ctx.beginPath()
        ctx.ellipse(Math.random() * s, Math.random() * s, 20 + Math.random() * 60, 15 + Math.random() * 40, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }
      grain(ctx, s, 0.05, 4000)
    }
    const bumpMuro = makeBump(512, (ctx, s) => drawPlaster(ctx, s, true), 2)
    const matMuro = new THREE.MeshStandardMaterial({
      map: loadTex('tex_muro.png', 2, 2), bumpMap: bumpMuro, bumpScale: 0.005, roughness: 0.88, side: THREE.DoubleSide,
    })
    // Muro lateral de cocina: greige suave
    const matMuroGreige = new THREE.MeshStandardMaterial({ color: 0xd9cfbf, roughness: 0.95, side: THREE.DoubleSide })

    const matCielo = new THREE.MeshStandardMaterial({ color: 0xf5f4f0, roughness: 1, side: THREE.DoubleSide })

    // ===== NOGAL: muebles con vetas anchas =====
    const drawWalnut = (ctx, s, bump = false) => {
      ctx.fillStyle = bump ? '#808080' : '#5c4433'
      ctx.fillRect(0, 0, s, s)
      for (let g = 0; g < 22; g++) {
        const y = Math.random() * s
        const w = 2 + Math.random() * 5
        ctx.strokeStyle = bump
          ? (Math.random() < 0.5 ? 'rgba(50,50,50,.5)' : 'rgba(170,170,170,.4)')
          : `rgba(${30 + Math.random() * 40},${18 + Math.random() * 25},${10 + Math.random() * 15},.4)`
        ctx.lineWidth = w
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(s * 0.3, y + (Math.random() * 14 - 7), s * 0.7, y + (Math.random() * 14 - 7), s, y + (Math.random() * 8 - 4))
        ctx.stroke()
      }
      grain(ctx, s, 0.06, 2500)
    }
    const bumpNogal = makeBump(512, (ctx, s) => drawWalnut(ctx, s, true))
    const matMadera = new THREE.MeshStandardMaterial({
      map: loadTex('tex_nogal.png', 2, 1), bumpMap: bumpNogal, bumpScale: 0.15, roughness: 0.6,
    })
    // Nogal tostado para frentes acanalados de cocina (misma veta, tinte más oscuro)
    const matNogalTostado = new THREE.MeshStandardMaterial({
      map: loadTex('tex_nogal.png', 2, 1), color: 0xb08a70, bumpMap: bumpNogal, bumpScale: 0.15, roughness: 0.65,
    })
    // Verde pizarra (#3D4744) para columnas de cocina
    const matPizarra = new THREE.MeshStandardMaterial({ color: 0x3d4744, roughness: 0.7 })

    // Mármol real del video, pulido con clearcoat + veta en relieve
    const matMarmol = new THREE.MeshPhysicalMaterial({
      map: loadTex('tex_marmol.png'), bumpMap: loadTex('tex_marmol.png'), bumpScale: 0.04,
      roughness: 0.18, metalness: 0.02, clearcoat: 0.45, clearcoatRoughness: 0.1,
    })
    // Mesa de centro con brillo especular sutil
    const matEbano = new THREE.MeshPhysicalMaterial({
      color: 0x26262a, roughness: 0.38, metalness: 0.1, clearcoat: 0.35,
    })

    const matOscuro = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.7, metalness: 0.2 })

    // ===== LINO: tela del sofá con trama de tejido + bouclé =====
    const drawLinen = (ctx, s, bump = false) => {
      ctx.fillStyle = bump ? '#808080' : '#d8d0c3'
      ctx.fillRect(0, 0, s, s)
      const step = 4
      // trama horizontal
      for (let y = 0; y < s; y += step) {
        ctx.fillStyle = bump
          ? (y % (step * 2) ? 'rgba(110,110,110,.5)' : 'rgba(150,150,150,.5)')
          : (y % (step * 2) ? 'rgba(190,182,168,.35)' : 'rgba(230,225,214,.35)')
        ctx.fillRect(0, y, s, step / 2)
      }
      // urdimbre vertical
      for (let x = 0; x < s; x += step) {
        ctx.fillStyle = bump
          ? (x % (step * 2) ? 'rgba(120,120,120,.35)' : 'rgba(160,160,160,.35)')
          : (x % (step * 2) ? 'rgba(200,192,178,.25)' : 'rgba(235,230,220,.25)')
        ctx.fillRect(x, 0, step / 2, s)
      }
      // bouclé: pequeños bucles irregulares
      ctx.strokeStyle = bump ? 'rgba(170,170,170,.4)' : 'rgba(245,241,233,.3)'
      for (let i = 0; i < 400; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 1.5, 0, Math.PI * 1.5)
        ctx.stroke()
      }
    }
    const bumpLino = makeBump(256, (ctx, s) => drawLinen(ctx, s, true), 3)
    // Bouclé con sheen aterciopelado (textura real del video)
    const matTela = new THREE.MeshPhysicalMaterial({
      map: loadTex('tex_tela.png', 2, 2), bumpMap: bumpLino, bumpScale: 0.03, roughness: 0.92,
      sheen: 0.65, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    })

    // Alfombra: lana real del video
    const matAlfombra = new THREE.MeshStandardMaterial({ map: loadTex('tex_alfombra.png', 2, 2), roughness: 0.98, bumpScale: 0.09 })
    // Roble nórdico claro para mesa de comedor
    const matRobleClaro = new THREE.MeshStandardMaterial({ color: 0xceb591, roughness: 0.5 })

    const matMarco = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.6, metalness: 0.4 })
    const matVidrio = new THREE.MeshPhysicalMaterial({
      color: 0xcfe6f5, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.18,
      transmission: 0.9, side: THREE.DoubleSide,
    })

    // Render cinematográfico cálido
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    const room = new THREE.Group()
    const box = (w, h, d, mat, x, y, z, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      m.position.set(x, y, z)
      m.castShadow = cast; m.receiveShadow = true
      room.add(m)
      return m
    }

    // --- Cáscara: piso / cielo / muros (ventanal en -z = orientación seleccionada) ---
    box(W, 0.08, D, matPiso, 0, -0.04, 0)
    box(W, 0.08, D, matCielo, 0, H, 0)
    // muro trasero (+z) y laterales (derecho = greige, zona cocina)
    box(W, H, WALL_T, matMuro, 0, H / 2, D / 2)
    box(WALL_T, H, D, matMuro, -W / 2, H / 2, 0)
    box(WALL_T, H, D, matMuroGreige, W / 2, H / 2, 0)

    // --- Ventanal de piso a cielo con perfilería esbelta (4-5 cm) ---
    const WIN_W = W - 0.6
    const marcoH = 0.05, marcoV = 0.06
    // marcos perimetrales
    box(WIN_W, marcoH, WALL_T * 1.2, matMarco, 0, marcoH / 2, -D / 2)
    box(WIN_W, marcoH, WALL_T * 1.2, matMarco, 0, H - marcoH / 2, -D / 2)
    box(marcoV, H, WALL_T * 1.2, matMarco, -WIN_W / 2 + marcoV / 2, H / 2, -D / 2)
    box(marcoV, H, WALL_T * 1.2, matMarco, WIN_W / 2 - marcoV / 2, H / 2, -D / 2)
    // parteluces verticales esbeltos
    for (let i = 1; i < 4; i++) {
      box(0.04, H - marcoH * 2, WALL_T * 1.2, matMarco, -WIN_W / 2 + (WIN_W / 4) * i, H / 2, -D / 2)
    }
    // vidrio (sin sombras para dejar pasar el sol)
    const vidrio = box(WIN_W - marcoV * 2, H - marcoH * 2, 0.02, matVidrio, 0, H / 2, -D / 2, false)
    vidrio.castShadow = false
    vidrio.receiveShadow = false

    // Cortinas de visillo (lino translúcido) a ambos lados del ventanal
    const matVisillo = new THREE.MeshPhysicalMaterial({
      color: 0xf7f5f0, roughness: 0.85, transparent: true, opacity: 0.7,
      transmission: 0.45, side: THREE.DoubleSide,
    })
    for (const sx of [-1, 1]) {
      const cortina = new THREE.Mesh(new THREE.PlaneGeometry(0.55, H - 0.1), matVisillo)
      cortina.position.set(sx * (WIN_W / 2 - 0.35), (H - 0.1) / 2, -D / 2 + 0.18)
      cortina.rotation.y = sx * 0.12
      room.add(cortina)
    }

    // --- Exterior: panorama 360° visto a través del ventanal ---
    const panoTexture = new THREE.TextureLoader(manager).load(`${base}images/inn/360.png`)
    panoTexture.colorSpace = THREE.SRGBColorSpace
    const pano = new THREE.Mesh(
      new THREE.SphereGeometry(30, 48, 32),
      new THREE.MeshBasicMaterial({ map: panoTexture, side: THREE.BackSide })
    )
    pano.rotation.y = Math.PI // centrar el frente del pano frente al ventanal
    scene.add(pano)

    // --- Mobiliario estilo Japandi (según video INN) ---
    // Alfombra: lana pelo corto (#A8A196) texturizada
    const alfombra = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 2.0),
      matAlfombra
    )
    alfombra.rotation.x = -Math.PI / 2
    alfombra.position.set(0, 0.01, -1.2)
    alfombra.receiveShadow = true
    room.add(alfombra)
    // Sofá seccional en L: lino crema
    box(2.2, 0.45, 0.9, matTela, 0, 0.35, 0.6)
    box(2.2, 0.55, 0.25, matTela, 0, 0.75, 1.0)
    box(0.25, 0.35, 0.9, matTela, -1.05, 0.65, 0.6)
    box(0.25, 0.35, 0.9, matTela, 1.05, 0.65, 0.6)
    box(0.9, 0.35, 1.4, matTela, 1.35, 0.55, 0.0) // chaise
    // Cojines decorativos
    box(0.4, 0.4, 0.12, matMadera, -0.6, 0.78, 0.86, false)
    box(0.4, 0.4, 0.12, matPizarra, 0.6, 0.78, 0.86, false)
    // Mesa de centro: ébano, orgánica (cilindro achatado)
    const mesaCentro = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 24), matEbano)
    mesaCentro.position.set(0, 0.4, -0.8)
    mesaCentro.castShadow = mesaCentro.receiveShadow = true
    room.add(mesaCentro)
    box(0.4, 0.38, 0.4, matEbano, 0, 0.19, -0.8)
    // Taburete rústico de roble
    box(0.32, 0.05, 0.32, matRobleClaro, -1.1, 0.36, -1.2)
    ;[[-0.11, -0.11], [0.11, -0.11], [-0.11, 0.11], [0.11, 0.11]].forEach(([x, z]) =>
      box(0.04, 0.36, 0.04, matRobleClaro, -1.1 + x, 0.18, -1.2 + z)
    )
    // Mueble bajo / tv al muro del fondo
    box(1.8, 0.4, 0.45, matMadera, 0, 0.2, D / 2 - 0.35)
    const tv = box(1.4, 0.8, 0.05, matOscuro, 0, 1.3, D / 2 - 0.2)
    // Espejo circular con marco negro
    const marcoEspejo = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.025, 8, 40),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 })
    )
    marcoEspejo.position.set(-1.6, 1.5, D / 2 - 0.08)
    room.add(marcoEspejo)
    const espejo = new THREE.Mesh(
      new THREE.CircleGeometry(0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0xdfe4e8, roughness: 0.05, metalness: 1 })
    )
    espejo.position.set(-1.6, 1.5, D / 2 - 0.09)
    room.add(espejo)
    // Isla de cocina waterfall: cubierta mármol + frente nogal acanalado
    box(0.9, 0.85, 1.8, matNogalTostado, 1.3, 0.425, 0.9) // cuerpo
    box(0.94, 0.05, 1.84, matMarmol, 1.3, 0.875, 0.9) // cubierta
    box(0.05, 0.85, 1.84, matMarmol, 1.75, 0.425, 0.9) // cascada lateral
    // acanalado del frente (listones verticales)
    for (let z = 0.1; z <= 1.7; z += 0.14) {
      box(0.03, 0.75, 0.06, matMadera, 0.84, 0.42, 0.9 - 0.9 + z, false)
    }
    // Columnas suelo-techo verde pizarra en muro derecho
    box(0.6, H, 1.2, matPizarra, W / 2 - 0.32, H / 2, -0.6)
    box(0.6, H, 1.2, matPizarra, W / 2 - 0.32, H / 2, 1.9)
    // Muebles bajos de cocina nogal en muro derecho
    box(0.6, 0.85, 1.1, matNogalTostado, W / 2 - 0.32, 0.425, 0.65)
    box(0.64, 0.04, 1.1, matMarmol, W / 2 - 0.32, 0.87, 0.65)
    // Comedor: mesa roble nórdico claro + 2 sillas
    box(1.1, 0.06, 0.8, matRobleClaro, -W / 2 + 1.0, 0.74, -1.4)
    ;[[-0.45, -0.3], [0.45, -0.3], [-0.45, 0.3], [0.45, 0.3]].forEach(([x, z]) =>
      box(0.06, 0.72, 0.06, matMadera, -W / 2 + 1.0 + x, 0.36, -1.4 + z)
    )
    box(0.45, 0.06, 0.45, matMadera, -W / 2 + 1.0, 0.45, -1.4 - 0.7)
    box(0.45, 0.5, 0.06, matMadera, -W / 2 + 1.0, 0.75, -1.4 - 0.9)
    // Planta (Strelitzia) en macetero de cemento
    const maceta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0x7d756d, roughness: 0.9 })
    )
    maceta.position.set(-W / 2 + 0.45, 0.175, -D / 2 + 0.6)
    maceta.castShadow = true
    room.add(maceta)
    const hojaMat = new THREE.MeshStandardMaterial({ color: 0x3a5239, roughness: 0.4 })
    for (let i = 0; i < 6; i++) {
      const hoja = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), hojaMat)
      hoja.scale.set(0.35, 1.6, 0.8)
      const a = (i / 6) * Math.PI * 2
      hoja.position.set(-W / 2 + 0.45 + Math.cos(a) * 0.12, 0.35 + 0.35, -D / 2 + 0.6 + Math.sin(a) * 0.12)
      hoja.rotation.set(Math.sin(a) * 0.35, a, Math.cos(a) * 0.35)
      hoja.castShadow = true
      room.add(hoja)
    }
    // Lámpara de pie (enciende de noche)
    box(0.04, 1.5, 0.04, matOscuro, -W / 2 + 0.4, 0.75, -D / 2 + 1.3)
    const pantallaLamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 0.28, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfff2cc, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffdf99, emissiveIntensity: 0 })
    )
    pantallaLamp.position.set(-W / 2 + 0.4, 1.6, -D / 2 + 1.3)
    room.add(pantallaLamp)
    // Colgante disco sobre la isla
    const colganteIsia = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24),
      new THREE.MeshStandardMaterial({ color: 0xececeb, roughness: 0.4, emissive: 0xffdeab, emissiveIntensity: 0 })
    )
    colganteIsia.position.set(1.3, H - 0.55, 0.9)
    room.add(colganteIsia)
    box(0.015, 0.5, 0.015, matOscuro, 1.3, H - 0.27, 0.9, false)
    // Colgante ratán cónico sobre el comedor
    const ratan = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.3, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xd8c2a4, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffba63, emissiveIntensity: 0 })
    )
    ratan.position.set(-W / 2 + 1.0, H - 0.75, -1.4)
    room.add(ratan)
    box(0.015, 0.6, 0.015, matOscuro, -W / 2 + 1.0, H - 0.3, -1.4, false)
    // Rieles de focos negros en el cielo
    const matRiel = new THREE.MeshStandardMaterial({ color: 0x1c1b1a, roughness: 0.35, metalness: 0.8 })
    const rieles = []
    for (const [rx, rz, len, rot] of [[0, -0.5, 3.2, 0], [W / 2 - 1.4, 0.4, 2.4, Math.PI / 2]]) {
      const riel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, len), matRiel)
      riel.position.set(rx, H - 0.05, rz)
      riel.rotation.y = rot
      room.add(riel)
      rieles.push({ riel, x: rx, z: rz, rot })
    }
    // focos orientables sobre los rieles (emisivos de noche)
    const focosEmissive = []
    for (const r of rieles) {
      const n = Math.max(2, Math.round((r.riel.geometry.parameters.depth) / 1.1))
      for (let i = 0; i < n; i++) {
        const foco = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.05, 0.09, 12),
          new THREE.MeshStandardMaterial({ color: 0x1c1b1a, roughness: 0.35, metalness: 0.8, emissive: 0xffe2b3, emissiveIntensity: 0 })
        )
        const t = (i + 0.5) / n - 0.5
        const off = t * r.riel.geometry.parameters.depth
        foco.position.set(r.x + Math.cos(r.rot) * off, H - 0.11, r.z - Math.sin(r.rot) * off)
        room.add(foco)
        focosEmissive.push(foco)
      }
    }
    scene.add(room)

    // --- Luces ---
    const ambient = new THREE.AmbientLight(0xffe8d0, 0.45)
    scene.add(ambient)
    const fill = new THREE.HemisphereLight(0xc2dcff, 0xd8cbb7, 1.3)
    scene.add(fill)

    // Sol según orientación (hemisferio sur: sol en el norte).
    // Golden hour cálida (#FFD6A5) como en el video.
    const [dx, dz] = cfg.dir
    // Sol de tarde en ángulo bajo: sombras largas y dramáticas
    const sol = new THREE.DirectionalLight(0xfff1d6, cfg.intensidad * 4)
    sol.position.set(dx * 11, 4.2, dz * 11)
    sol.castShadow = true
    sol.shadow.mapSize.set(2048, 2048)
    sol.shadow.radius = 3.5
    sol.shadow.bias = -0.0001
    sol.shadow.camera.left = -8; sol.shadow.camera.right = 8
    sol.shadow.camera.top = 8; sol.shadow.camera.bottom = -8
    sol.shadow.camera.near = 1; sol.shadow.camera.far = 40
    scene.add(sol)
    // Luz de ventana (RectAreaLight del tamaño del ventanal): luz de cielo
    // suave y uniforme que baña el interior, como en la referencia
    RectAreaLightUniformsLib.init()
    const WIN_W_L = W - 0.6
    const luzVentana = new THREE.RectAreaLight(0xeaf2ff, 3.2, WIN_W_L, H - 0.1)
    luzVentana.position.set(0, H / 2, -D / 2 + 0.05)
    luzVentana.lookAt(0, H / 2, 0)
    scene.add(luzVentana)
    // Nota: si dir apunta al sur (dz>0), el sol queda DETRÁS del muro del fondo
    // y la luz directa no entra al ventanal — comportamiento realista.

    // Luz cálida de la lámpara de pie (noche)
    const luzLampara = new THREE.PointLight(0xffc266, 0, 6, 2)
    luzLampara.position.set(-W / 2 + 0.4, 1.55, -D / 2 + 1.3)
    scene.add(luzLampara)
    // Colgante de la isla (#FFDEAB ~2700K)
    const luzIsla = new THREE.PointLight(0xffdeab, 0, 5, 2)
    luzIsla.position.set(1.3, H - 0.6, 0.9)
    scene.add(luzIsla)
    // Colgante ratán del comedor (#FFBA63 ~2400K)
    const luzRatan = new THREE.PointLight(0xffba63, 0, 5, 2)
    luzRatan.position.set(-W / 2 + 1.0, H - 0.8, -1.4)
    scene.add(luzRatan)
    const luzTecho = new THREE.PointLight(0xffe0b0, 0, 9, 2)
    luzTecho.position.set(0, H - 0.15, 0)
    scene.add(luzTecho)
    const luzVentanal = new THREE.PointLight(0x9db8d8, 0, 7, 2) // luz de luna por el ventanal
    luzVentanal.position.set(0, 1.6, -D / 2 - 0.5)
    scene.add(luzVentanal)
    // Aparato de techo visible
    const aparato = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe0b0, emissiveIntensity: 0 })
    )
    aparato.position.set(0, H - 0.06, 0)
    room.add(aparato)

    // --- Día / Noche ---
    const DIA = {
      bg: new THREE.Color(0x87b7e8), solInt: cfg.intensidad * 4, ambInt: 0.75, fillInt: 1.3,
      lamp: 0, techo: 0, luna: 0, emis: 0, isla: 0, ratan: 0, focos: 0, exposure: 1.35,
      ambColor: 0xffe8d0, panoTint: 0xdfe6ee,
    }
    const NOCHE = {
      bg: new THREE.Color(0x1a2238), solInt: 0, ambInt: 0.5, fillInt: 0.15,
      lamp: 5, techo: 5, luna: 0.6, emis: 1.2, isla: 8, ratan: 4, focos: 3, exposure: 1.15,
      ambColor: 0x2b1f17, panoTint: 0x7a5348,
    }
    applyNightRef.current = (isNight) => {
      const s = isNight ? NOCHE : DIA
      const k = 0.12
      scene.background.copy(s.bg)
      renderer.toneMappingExposure = s.exposure
      luzVentana.intensity = isNight ? 0.35 : 3.2
      luzVentana.color.set(isNight ? 0x8a9bc4 : 0xeaf2ff)
      sol.intensity = s.solInt
      ambient.intensity = s.ambInt
      ambient.color.set(s.ambColor)
      fill.intensity = s.fillInt
      luzLampara.intensity = s.lamp
      luzTecho.intensity = s.techo
      luzVentanal.intensity = s.luna
      pantallaLamp.material.emissiveIntensity = s.emis
      colganteIsia.material.emissiveIntensity = s.isla
      luzIsla.intensity = s.isla
      ratan.material.emissiveIntensity = s.ratan
      luzRatan.intensity = s.ratan
      focosEmissive.forEach((f) => { f.material.emissiveIntensity = s.focos })
      aparato.material.emissiveIntensity = s.emis * 0.8
      // panorama: bruma desaturada de día, dusk cálido de noche
      pano.material.color.set(s.panoTint)
      tv.material.emissive = new THREE.Color(isNight ? 0x223344 : 0x000000)
      tv.material.emissiveIntensity = k
    }

    // --- Resize ---
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // --- Loop ---
    let raf = 0
    let firstFrame = true
    const setReady = () => {
      // espera el primer frame renderizado + texturas cargadas
      if (firstFrame) { pendingReady = true; return }
      setLoading(false)
    }
    let pendingReady = false
    const tick = () => {
      raf = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
      if (firstFrame) {
        firstFrame = false
        if (pendingReady) setLoading(false)
      }
    }
    tick()
    // Red de seguridad: nunca quedar cargando por más de 8s
    const safety = setTimeout(() => setLoading(false), 8000)
    if (nightRef.current) applyNightRef.current(true)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      scene.traverse((o) => {
        if (o.isMesh) { o.geometry.dispose(); o.material.dispose() }
      })
      applyNightRef.current = null
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.dir[0], cfg.dir[1], cfg.intensidad])

  return (
    <div className="position-relative">
      {/* Cargador mientras inicializa la escena 3D y el panorama */}
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3"
          style={{ background: '#0e1420', zIndex: 2, transition: 'opacity .4s' }}
        >
          <span className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }} role="status" />
          <span className="small text-white-50">Preparando vista 3D…</span>
        </div>
      )}
      <div
        ref={mountRef}
        className="w-100"
        style={{ height: '70vh', touchAction: 'none', cursor: 'grab' }}
        role="img"
        aria-label={`Vista 3D interior, orientación ${cfg.label}`}
      />
      {/* Info orientación + toggle día/noche */}
      <div
        className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-3 small"
        style={{ background: 'rgba(14,20,32,.78)', color: '#fff', pointerEvents: 'none' }}
      >
        <span className="fw-semibold">Orientación: {cfg.label}</span>
        <br />
        <span className="text-white-50">{cfg.desc}</span>
      </div>

      {/* Datos de la planta */}
      {planta && (
        <div
          className="position-absolute bottom-0 start-0 m-3 p-3 rounded-3"
          style={{ background: 'rgba(14,20,32,.82)', color: '#fff', maxWidth: 340, backdropFilter: 'blur(4px)' }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            {planta.interior_image_url && (
              <img
                src={planta.interior_image_url}
                alt={`Esquicio ${planta.name || ''}`}
                width="88"
                height="66"
                className="rounded border border-light-subtle"
                style={{ objectFit: 'contain', background: '#fff' }}
                loading="lazy"
              />
            )}
            <div>
              <div className="fw-semibold">
                {planta.name ? `Planta ${planta.name}` : 'Planta'}
                {planta.piso != null && <span className="text-white-50"> · Piso {planta.piso}</span>}
              </div>
              {planta.programa && <div className="small text-white-50">{planta.programa}</div>}
              {planta.proyecto?.name && <div className="small text-white-50">{planta.proyecto.name}</div>}
            </div>
          </div>
          <ul className="list-unstyled small mb-0 d-flex flex-column gap-1">
            {planta.superficie_util != null && (
              <li className="d-flex justify-content-between gap-3">
                <span className="text-white-50">Superficie útil</span>
                <span className="fw-semibold">{fmtM2(planta.superficie_util)}</span>
              </li>
            )}
            {planta.superficie_terraza != null && parseFloat(planta.superficie_terraza) > 0 && (
              <li className="d-flex justify-content-between gap-3">
                <span className="text-white-50">Terraza</span>
                <span className="fw-semibold">{fmtM2(planta.superficie_terraza)}</span>
              </li>
            )}
            {planta.superficie_total_principal != null && (
              <li className="d-flex justify-content-between gap-3">
                <span className="text-white-50">Superficie total</span>
                <span className="fw-semibold">{fmtM2(planta.superficie_total_principal)}</span>
              </li>
            )}
            <li className="d-flex justify-content-between gap-3">
              <span className="text-white-50">Orientación</span>
              <span className="fw-semibold">{cfg.label}</span>
            </li>
            {planta.precio_lista != null && parseFloat(planta.precio_lista) > 0 && (
              <li className="d-flex justify-content-between gap-3 border-top border-secondary pt-1 mt-1">
                <span className="text-white-50">Precio</span>
                <span className="fw-bold text-warning">{fmtUF(planta.precio_lista)}</span>
              </li>
            )}
          </ul>
        </div>
      )}
      <div className="position-absolute top-0 end-0 m-3 btn-group btn-group-sm" role="group">
        <button
          type="button"
          className={`btn ${!night ? 'btn-warning' : 'btn-outline-warning'}`}
          onClick={() => setNight(false)}
        >
          ☀ Día
        </button>
        <button
          type="button"
          className={`btn ${night ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setNight(true)}
        >
          🌙 Noche
        </button>
      </div>
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 px-3 py-1 rounded-3 small"
        style={{ background: 'rgba(14,20,32,.6)', color: 'rgba(255,255,255,.75)', pointerEvents: 'none' }}
      >
        Arrastra para mirar alrededor
      </div>
    </div>
  )
}
