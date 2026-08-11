import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { opacity: 1, pathLength: 1, pathOffset: 0, transition: { duration: 0.4, opacity: { duration: 0.1 } } },
  animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0], transition: { duration: 0.6, ease: 'linear', opacity: { duration: 0.1 } } },
}

export const InstagramIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.rect animate={controls} initial="normal" variants={VARIANTS} height="20" rx="5" ry="5" width="20" x="2" y="2" />
    <motion.path animate={controls} initial="normal" variants={VARIANTS} d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <motion.line animate={controls} initial="normal" variants={VARIANTS} x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
))
