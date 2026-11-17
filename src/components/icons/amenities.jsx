import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// 1. Fogón / Brasero
export const FlameKindlingIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { scale: 1, y: 0 },
        animate: { scale: [1, 1.15, 0.95, 1], y: [0, -1.5, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 10px' }}
      d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z"
    />
    <path d="m5 22 14-4" />
    <path d="m5 18 14 4" />
  </svg>
))

// 2. Calefacción / Calefactor
export const HeaterIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0, opacity: 1 },
        animate: { y: [0, -3, 0], opacity: [1, 0.6, 1], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
    >
      <path d="M11 8c2-3-2-3 0-6" />
      <path d="M15.5 8c2-3-2-3 0-6" />
    </motion.g>
    <path d="M6 10h.01" />
    <path d="M6 14h.01" />
    <path d="M10 16v-4" />
    <path d="M14 16v-4" />
    <path d="M18 16v-4" />
    <path d="M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" />
    <path d="M5 20v2" />
    <path d="M19 20v2" />
  </svg>
))

// 3. E-commerce / Carrito de compras
export const ShoppingCartIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { x: 0, rotate: 0 },
        animate: { x: [0, 2, -1, 0], rotate: [0, 2, -1, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '8px 20px' }}
    >
      <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
      <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
      <circle cx="18" cy="20" r="2" />
      <circle cx="8" cy="20" r="2" />
    </motion.g>
  </svg>
))

// 4. Ondas Verticales
export const WavesVerticalIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0 },
        animate: { y: [0, -2, 2, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
      d="M5 2q2 2.5 0 5t0 5 0 5 0 5"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0 },
        animate: { y: [0, 2, -2, 0], transition: { duration: 0.6, delay: 0.1, ease: 'easeInOut' } },
      }}
      d="M12 2q2 2.5 0 5t0 5 0 5 0 5"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0 },
        animate: { y: [0, -2, 2, 0], transition: { duration: 0.6, delay: 0.2, ease: 'easeInOut' } },
      }}
      d="M19 2q2 2.5 0 5t0 5 0 5 0 5"
    />
  </svg>
))

// 5. Cine / Sala Multimedia
export const CinemaIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { scale: 1 },
        animate: { scale: [1, 1.08, 1], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 10px' }}
    >
      <rect x="2" y="2" width="20" height="14" rx="2" />
      <motion.path
        animate={controls}
        initial="normal"
        variants={{
          normal: { scale: 1 },
          animate: { scale: [1, 1.25, 1], transition: { duration: 0.5, ease: 'easeInOut' } },
        }}
        style={{ transformOrigin: '12px 9px' }}
        d="M15.03 8.44a.65.65 0 0 1 0 1.12l-4.06 2.35a.64.64 0 0 1-.97-.56v-4.7a.647.647 0 0 1 .96-.56z"
      />
    </motion.g>
    <path d="M14 22a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
    <path d="M2 22a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
  </svg>
))

// 6. Edificio / Cowork
export const BuildingIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0, scale: 1 },
        animate: { y: [0, -2, 0], scale: [1, 1.04, 1], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 22px' }}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </motion.g>
  </svg>
))

// 7. Hoja / Áreas Verdes / Parque
export const LeafIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { rotate: 0 },
        animate: { rotate: [0, 10, -8, 4, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '2px 21px' }}
    >
      <path d="M11 20a10 10 0 0010-10 25.9 25.9 0 00-1.04-7.281 1 1 0 00-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0011 20" />
      <path d="M2 21a5 5 0 012.911-4.544C7.613 15.212 8.351 15.24 11 13" />
    </motion.g>
  </svg>
))

// 8. Utensilios / Parrilla / Quincho
export const UtensilsIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { rotate: 0 },
        animate: { rotate: [0, -8, 6, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '7px 22px' }}
      d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { rotate: 0 },
        animate: { rotate: [0, 8, -6, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '21px 22px' }}
      d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"
    />
  </svg>
))

// 9. Café / Cafetería / Coffee Break
export const CoffeeIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0, opacity: 1 },
        animate: { y: [0, -2.5, 0], opacity: [1, 0.4, 1], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
    >
      <path d="M6 2v2M10 2v2M14 2v2" />
    </motion.g>
    <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
  </svg>
))

// 10. Gotas de Agua / Spa / Duchas
export const DropletsIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { scale: 1, y: 0 },
        animate: { scale: [1, 1.12, 1], y: [0, 1.5, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '7px 12px' }}
      d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { scale: 1, y: 0 },
        animate: { scale: [1, 1.08, 1], y: [0, -1.5, 0], transition: { duration: 0.5, delay: 0.1, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '15px 12px' }}
      d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
    />
  </svg>
))

// 11. Bicicleta / Bicicletero / Ciclovía
export const BikeIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { x: 0, rotate: 0 },
        animate: { x: [0, 2, -1, 0], rotate: [0, 2, -1, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 17px' }}
    >
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </motion.g>
  </svg>
))

// 12. Combustible / Electrolinera / Carga EV
export const FuelIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" />
    <path d="M2 21h13" />
    <path d="M3 9h11" />
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { rotate: 0 },
        animate: { rotate: [0, -6, 6, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '18px 5px' }}
      d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5"
    />
  </svg>
))

// 13. Sofá / Sala de Estar / Lounge
export const SofaIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { scaleY: 1, y: 0 },
        animate: { scaleY: [1, 0.92, 1.04, 1], y: [0, 1, -0.5, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 18px' }}
    >
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
      <path d="M12 4v9" />
    </motion.g>
    <path d="M4 18v2M20 18v2" />
  </svg>
))

// 14. Anzuelo de Pesca / Embarcadero
export const FishingHookIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0, rotate: 0 },
        animate: { y: [0, 2.5, -2, 0], rotate: [0, 6, -4, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '19px 10px' }}
    >
      <path d="m17.586 11.414-5.93 5.93a1 1 0 0 1-8-8l3.137-3.137a.707.707 0 0 1 1.207.5V10" />
      <path d="M20.414 8.586 22 7" />
      <circle cx="19" cy="10" r="2" />
    </motion.g>
  </svg>
))

// 15. Microondas / Kitchenette
export const MicrowaveIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="15" x="2" y="4" rx="2" />
    <motion.rect
      animate={controls}
      initial="normal"
      variants={{
        normal: { opacity: 1, scale: 1 },
        animate: { opacity: [1, 0.5, 1], scale: [1, 1.05, 1], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '10px 11.5px' }}
      width="8"
      height="7"
      x="6"
      y="8"
      rx="1"
    />
    <path d="M18 8v7M6 19v2M18 19v2" />
  </svg>
))

// 16. Macetero / Jardín / Huerto
export const PlantPotIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path
      animate={controls}
      initial="normal"
      variants={{
        normal: { rotate: 0 },
        animate: { rotate: [0, 8, -6, 2, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 17px' }}
      d="M14 8.536V6a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V4a4 4 0 0 1-4 4 4 4 0 0 0-4 4 5 5 0 0 1-8-4 5 5 0 0 1 8 4c0 2 1 3 1 5"
    />
    <path d="m18 17-1.085 3.58A2 2 0 0 1 15 22H9.002a2 2 0 0 1-1.913-1.418L6 17" />
    <path d="M5 17h14" />
  </svg>
))

// 17. Almacén / Minimarket / Compras
export const GroceriesIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0, rotate: 0 },
        animate: { y: [0, -2, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.5, ease: 'easeInOut' } },
      }}
      style={{ transformOrigin: '12px 16px' }}
    >
      <path d="M10 15h4" />
      <path d="M19.424 11.095a2.5 2.5 0 0 0 .471-2.309 2 2 0 0 0 .424-3.286 2 2 0 0 0-2.143-3.322 2 2 0 0 0-.676.502 2 2 0 0 0-3.287.424 2.5 2.5 0 0 0-3.189 2.06A3 3 0 0 0 12 11l4-4" />
      <path d="M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M7 11a4 4 0 0 1-4-4V5a1 1 0 0 1 1-1h2a4 4 0 0 1 3.584 2.222" />
    </motion.g>
  </svg>
))

// 18. Bodega Náutica / Muelle
export const WarehouseWavesIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 11V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8v3" />
    <path d="M6 11v-1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    <motion.g
      animate={controls}
      initial="normal"
      variants={{
        normal: { x: 0 },
        animate: { x: [0, 2, -2, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
      }}
    >
      <path d="M2 16q2.5 2 5 0t5 0 5 0 5 0" />
      <path d="M2 21q2.5 2 5 0t5 0 5 0 5 0" />
    </motion.g>
  </svg>
))
