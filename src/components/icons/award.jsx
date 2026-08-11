import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { rotate: 0, scale: 1, transition: { duration: 0.3 } },
  animate: { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1], transition: { duration: 0.6, ease: 'easeInOut' } },
}

export const AwardIcon = createAnimatedIcon((controls, size) => (
  <motion.svg animate={controls} initial="normal" variants={VARIANTS} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    <circle cx="12" cy="8" r="6" />
  </motion.svg>
))
