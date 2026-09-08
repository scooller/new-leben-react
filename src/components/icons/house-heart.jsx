import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const HEART_TRANSITION = { duration: 0.5, ease: 'easeInOut' }
const HEART_VARIANTS = {
  normal: { scale: 1 },
  animate: { scale: [1, 1.25, 0.95, 1.15, 1] },
}

export const HouseHeartIcon = createAnimatedIcon((controls, size) => (
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
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <motion.path
      d="M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z"
      animate={controls}
      initial="normal"
      variants={HEART_VARIANTS}
      transition={HEART_TRANSITION}
      style={{ transformOrigin: '12px 13.5px' }}
    />
  </svg>
))

export default HouseHeartIcon
