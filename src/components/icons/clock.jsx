import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const HAND_VARIANTS = {
  normal: { rotate: 0, originX: '0%', originY: '100%' },
  animate: { rotate: 360, originX: '0%', originY: '100%' },
}

const MINUTE_VARIANTS = {
  normal: { rotate: 0, originX: '0%', originY: '100%' },
  animate: { rotate: 45, originX: '0%', originY: '100%' },
}

export const ClockIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <motion.line animate={controls} initial="normal" transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} variants={HAND_VARIANTS} x1="12" x2="12" y1="12" y2="6" />
    <motion.line animate={controls} initial="normal" transition={{ duration: 0.5, ease: 'easeInOut' }} variants={MINUTE_VARIANTS} x1="12" x2="16" y1="12" y2="12" />
  </svg>
))
