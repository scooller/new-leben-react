import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// Lucide dumbbell + animación estilo pqoqubbw/icons
const WEIGHT_VARIANTS = {
  normal: { rotate: 0, scale: 1 },
  animate: {
    rotate: [0, -8, 8, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
}

export const DumbbellIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="m2.5 21.5 1.4-1.4" />
    <path d="m20.1 3.9 1.4-1.4" />
    <motion.g animate={controls} initial="normal" variants={WEIGHT_VARIANTS}>
      <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
      <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
      <path d="m9.6 14.4 4.8-4.8" />
    </motion.g>
  </svg>
))
