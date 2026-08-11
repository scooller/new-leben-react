import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
  animate: { pathLength: [0, 1], opacity: [0, 1], transition: { pathLength: { duration: 0.4, ease: 'easeInOut' }, opacity: { duration: 0.4, ease: 'easeInOut' } } },
}

export const UserCheckIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <motion.path animate={controls} initial="normal" style={{ transformOrigin: 'center' }} variants={VARIANTS} d="M16 11L18 13L22 9" />
  </svg>
))
