import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// Animación oficial de https://lucide-animated.com/icons/external-link
const ARROW_VARIANTS = {
  normal: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  animate: {
    scale: [1, 0.92, 1],
    translateX: [0, 2, 0],
    translateY: [0, -2, 0],
    originX: 1,
    originY: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

export const ExternalLinkIcon = createAnimatedIcon((controls, size) => (
  <svg
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <motion.g
      animate={controls}
      initial="normal"
      variants={ARROW_VARIANTS}
      style={{ transformOrigin: 'top right' }}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </motion.g>
  </svg>
))
