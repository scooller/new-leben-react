import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const TRANSITION = { type: 'spring', stiffness: 160, damping: 17, mass: 1 }

export const DownloadIcon = createAnimatedIcon((controls, size) => (
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
      transition={TRANSITION}
      variants={{ animate: { translateY: 2 }, normal: { translateX: 0, rotate: 0, translateY: 0 } }}
      d="M12 3v12"
    />
    <motion.path
      animate={controls}
      initial="normal"
      transition={TRANSITION}
      variants={{ animate: { translateY: 2 }, normal: { translateX: 0, rotate: 0, translateY: 0 } }}
      d="m7 10 5 5 5-5"
    />
    <path d="M4 21h16" />
  </svg>
))
