import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

export const EyeIcon = createAnimatedIcon((controls, size) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      animate={controls}
      initial="normal"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      variants={{
        animate: { scaleY: [1, 0.1, 1], opacity: [1, 0.3, 1] },
        normal: { scaleY: 1, opacity: 1 },
      }}
      style={{ originY: '50%' }}
      d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
    />
    <motion.circle
      animate={controls}
      initial="normal"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      variants={{
        animate: { scale: [1, 0.3, 1], opacity: [1, 0.3, 1] },
        normal: { scale: 1, opacity: 1 },
      }}
      cx="12"
      cy="12"
      r="3"
    />
  </svg>
))
