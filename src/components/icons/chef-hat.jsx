import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// Lucide chef-hat + animación estilo pqoqubbw/icons
const HAT_VARIANTS = {
  normal: { y: 0, scale: 1 },
  animate: {
    y: [0, -2, 0],
    scale: [1, 1.06, 1],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

export const ChefHatIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={controls} initial="normal" variants={HAT_VARIANTS}>
      <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
    </motion.g>
    <path d="M6 17h12" />
  </svg>
))
