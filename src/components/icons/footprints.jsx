import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const FOOT_VARIANTS_LEFT = {
  normal: { y: 0 },
  animate: {
    y: [0, -3, 0],
    transition: { duration: 0.4, repeat: 1, ease: 'easeInOut' },
  },
}

const FOOT_VARIANTS_RIGHT = {
  normal: { y: 0 },
  animate: {
    y: [0, -3, 0],
    transition: { duration: 0.4, delay: 0.2, repeat: 1, ease: 'easeInOut' },
  },
}

export const FootprintsIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      animate={controls}
      initial="normal"
      variants={FOOT_VARIANTS_LEFT}
      d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.5v2"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={FOOT_VARIANTS_LEFT}
      d="M4 13h4"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={FOOT_VARIANTS_RIGHT}
      d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.5v2"
    />
    <motion.path
      animate={controls}
      initial="normal"
      variants={FOOT_VARIANTS_RIGHT}
      d="M16 17h4"
    />
  </svg>
))
