import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { opacity: 1, pathLength: 1, pathOffset: 0, transition: { duration: 0.4, opacity: { duration: 0.1 } } },
  animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.6, ease: 'linear', opacity: { duration: 0.1 } } },
}

export const LinkedinIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.path animate={controls} initial="normal" variants={VARIANTS} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <motion.rect animate={controls} initial="normal" variants={VARIANTS} height="12" width="4" x="2" y="9" />
    <motion.circle animate={controls} initial="normal" variants={VARIANTS} cx="4" cy="4" r="2" />
  </svg>
))
