import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const GROUP_VARIANTS = {
  animate: { transition: { staggerChildren: 0.2 } },
}

const DROP_VARIANTS = {
  normal: { opacity: 1 },
  animate: { opacity: [1, 0.2, 1], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
}

const DROPS = [
  'M14 17v.01', 'M10 16v.01', 'M13 13v.01', 'M16 10v.01',
  'M11 20v.01', 'M17 14v.01', 'M20 11v.01',
]

export const ShowerHeadIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="m4 4 2.5 2.5" />
    <path d="M13.5 6.5a4.95 4.95 0 0 0-7 7" />
    <path d="M15 5 5 15" />
    <motion.g animate={controls} initial="normal" variants={GROUP_VARIANTS}>
      {DROPS.map((d, i) => <motion.path key={i} d={d} variants={DROP_VARIANTS} />)}
    </motion.g>
  </svg>
))
