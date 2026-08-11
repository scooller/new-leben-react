import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { pathLength: 1, pathOffset: 0, opacity: 1, transition: { duration: 0.4, opacity: { duration: 0.1 } } },
  animate: { pathLength: [0, 1], pathOffset: [1, 0], opacity: [0, 1], transition: { duration: 0.6, ease: 'linear', opacity: { duration: 0.1 } } },
}

export const MailIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect height="16" rx="2" width="20" x="2" y="4" />
    <motion.path animate={controls} initial="normal" variants={VARIANTS} d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
))
