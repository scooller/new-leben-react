import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// Lucide table + animación estilo pqoqubbw/icons
const LINE_VARIANTS = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

export const TableIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <motion.path animate={controls} initial="normal" d="M12 3v18" variants={LINE_VARIANTS} />
    <motion.path animate={controls} initial="normal" d="M3 9h18" transition={{ delay: 0.1 }} variants={LINE_VARIANTS} />
    <motion.path animate={controls} initial="normal" d="M3 15h18" transition={{ delay: 0.2 }} variants={LINE_VARIANTS} />
  </svg>
))
