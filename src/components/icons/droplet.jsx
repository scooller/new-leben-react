import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

export const DropletIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.path animate={controls} initial="normal" transition={{ duration: 0.6, delay: 0.2 }} variants={{ normal: { pathLength: 1, opacity: 1, pathOffset: 0 }, animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] } }} d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
))
