import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const VARIANTS = {
  normal: { x: 0, y: 0, opacity: 1, transition: { duration: 0.3 } },
  animate: { x: [0, 3, 0], y: [0, -3, 0], opacity: [1, 0.5, 1], transition: { duration: 0.6, ease: 'easeInOut' } },
}

export const SendIcon = createAnimatedIcon((controls, size) => (
  <motion.svg animate={controls} initial="normal" variants={VARIANTS} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </motion.svg>
))
