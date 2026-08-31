import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

// Adaptado de pqoqubbw/icons (waves-ladder)
export const WavesLadderIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <motion.g
      animate={controls}
      initial={{ y: 0, opacity: 1 }}
      variants={{
        normal: { y: 0, opacity: 1 },
        animate: {
          y: [13, 0],
          opacity: [0, 0, 1],
          transition: { duration: 1, times: [0, 0.5, 1], repeat: 0 },
        },
      }}
    >
      <path d="M19 5a2 2 0 0 0-2 2v11" />
      <path d="M7 13h10" />
      <path d="M7 9h10" />
      <path d="M9 5a2 2 0 0 0-2 2v11" />
    </motion.g>
  </svg>
))
