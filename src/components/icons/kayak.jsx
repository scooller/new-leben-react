import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// Lucide kayak + animación estilo pqoqubbw/icons (paddle + embarcación se mecen)
const BOAT_VARIANTS = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, -6, 6, -3, 0],
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
}

const PADDLE_VARIANTS = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, 12, -6, 0],
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
}

export const KayakIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }} xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={controls} initial="normal" variants={PADDLE_VARIANTS}>
      <path d="M18 17a1 1 0 0 0-1 1v1a2 2 0 1 0 2-2z" />
      <path d="M7 5a2 2 0 1 0-2 2h1a1 1 0 0 0 1-1z" />
      <path d="m6.707 6.707 10.586 10.586" />
    </motion.g>
    <motion.g animate={controls} initial="normal" style={{ originX: '50%', originY: '50%' }} variants={BOAT_VARIANTS}>
      <path d="M20.97 3.61a.45.45 0 0 0-.58-.58C10.2 6.6 6.6 10.2 3.03 20.39a.45.45 0 0 0 .58.58C13.8 17.4 17.4 13.8 20.97 3.61" />
    </motion.g>
  </svg>
))
