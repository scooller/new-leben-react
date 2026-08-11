import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
  animate: { pathLength: [0, 1], opacity: [0, 1], transition: { pathLength: { duration: 0.4, ease: 'easeInOut' }, opacity: { duration: 0.4, ease: 'easeInOut' } } },
}

export const CalendarCheckIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect height="18" rx="2" width="18" x="3" y="4" />
    <path d="M3 10h18" />
    <motion.path animate={controls} initial="normal" style={{ transformOrigin: 'center' }} variants={VARIANTS} d="m9 16 2 2 4-4" />
  </svg>
))
