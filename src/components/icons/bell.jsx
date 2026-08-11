import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { rotate: 0 },
  animate: { rotate: [0, -10, 10, -10, 0] },
}

export const BellIcon = createAnimatedIcon((controls, size) => (
  <motion.svg animate={controls} initial="normal" variants={VARIANTS} transition={{ duration: 0.5, ease: 'easeInOut' }} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </motion.svg>
))
