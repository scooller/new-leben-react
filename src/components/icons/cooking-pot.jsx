import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const LID_VARIANTS = {
  normal: { rotate: 0 },
  animate: { rotate: [0, -14, 14, -10, 10, -6, 6, 0], transition: { duration: 0.9, ease: 'easeInOut' } },
}

const POT_VARIANTS = {
  normal: { scale: 1 },
  animate: { scale: [1, 1.08, 1], transition: { duration: 0.95, ease: 'easeInOut' } },
}

export const CookingPotIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={controls} initial="normal" style={{ transformOrigin: '12px 16px' }} variants={POT_VARIANTS}>
      <path d="M2 12h20" />
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <motion.g animate={controls} initial="normal" style={{ transformOrigin: '18px 6px' }} variants={LID_VARIANTS}>
        <path d="m4 8 16-4" />
        <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
      </motion.g>
    </motion.g>
  </svg>
))
