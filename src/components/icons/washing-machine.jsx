import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

export const WashingMachineIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={controls} variants={{ normal: { x: 0 }, animate: { x: [0, 0.5, -0.5, 0.3, -0.3, 0], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } } }}>
      <path d="M3 6h3" />
      <path d="M17 6h.01" />
      <rect height="20" rx="2" width="18" x="3" y="2" />
      <motion.g animate={controls} variants={{ normal: { rotate: 0, y: 0, transition: { duration: 0.5, ease: 'linear' } }, animate: { rotate: 360, y: [0, -0.3, 0, 0.3, 0], transition: { rotate: { duration: 1, repeat: Infinity, ease: 'linear' }, y: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' } } } }}>
        <circle cx="12" cy="13" r="5" />
        <path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" />
      </motion.g>
    </motion.g>
  </svg>
))
