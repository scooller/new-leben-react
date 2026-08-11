import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { scale: 1, rotate: 0 },
  animate: {
    scale: 1.05,
    rotate: [0, -7, 7, 0],
    transition: { rotate: { duration: 0.5, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 400, damping: 10 } },
  },
}

export const MessageCircleIcon = createAnimatedIcon((controls, size) => (
  <motion.svg animate={controls} initial="normal" variants={VARIANTS} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </motion.svg>
))
