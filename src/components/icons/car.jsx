import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const CAR_BODY_VARIANTS = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, -2, 2, -1, 0],
    y: [0, -1, 0, -0.5, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

const WHEEL_VARIANTS = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, 180, 360],
    transition: { duration: 0.6, ease: 'linear' },
  },
}

export const CarIcon = createAnimatedIcon((controls, size) => (
  <motion.svg
    animate={controls}
    initial="normal"
    variants={CAR_BODY_VARIANTS}
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
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <motion.circle animate={controls} initial="normal" variants={WHEEL_VARIANTS} cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <motion.circle animate={controls} initial="normal" variants={WHEEL_VARIANTS} cx="17" cy="17" r="2" />
  </motion.svg>
))
