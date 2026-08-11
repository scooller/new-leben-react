import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const SPARKLE_VARIANTS = {
  normal: { y: 0, fill: 'none' },
  animate: { y: [0, -1, 0, 0], fill: 'currentColor', transition: { duration: 1, bounce: 0.3 } },
}

const STAR_VARIANTS = {
  normal: { opacity: 1, x: 0, y: 0 },
  animate: {
    opacity: [0, 1, 0, 0, 0, 0, 1],
    transition: { duration: 2, type: 'spring', stiffness: 70, damping: 10, mass: 0.4 },
  },
}

export const SparklesIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      animate={controls}
      initial="normal"
      variants={SPARKLE_VARIANTS}
      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
    />
    <motion.path animate={controls} initial="normal" variants={STAR_VARIANTS} d="M20 3v4" />
    <motion.path animate={controls} initial="normal" variants={STAR_VARIANTS} d="M22 5h-4" />
    <motion.path animate={controls} initial="normal" variants={STAR_VARIANTS} d="M4 17v2" />
    <motion.path animate={controls} initial="normal" variants={STAR_VARIANTS} d="M5 18H3" />
  </svg>
))
