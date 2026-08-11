import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const TRANSITION = { type: 'spring', stiffness: 160, damping: 17, mass: 1 }

export const FrameIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.line animate={controls} initial="normal" transition={TRANSITION} variants={{ animate: { translateY: -4 }, normal: { translateX: 0, rotate: 0, translateY: 0 } }} x1={22} x2={2} y1={6} y2={6} />
    <motion.line animate={controls} initial="normal" transition={TRANSITION} variants={{ animate: { translateY: 4 }, normal: { translateX: 0, rotate: 0, translateY: 0 } }} x1={22} x2={2} y1={18} y2={18} />
    <motion.line animate={controls} initial="normal" transition={TRANSITION} variants={{ animate: { translateX: -4 }, normal: { translateX: 0, rotate: 0, translateY: 0 } }} x1={6} x2={6} y1={2} y2={22} />
    <motion.line animate={controls} initial="normal" transition={TRANSITION} variants={{ animate: { translateX: 4 }, normal: { translateX: 0, rotate: 0, translateY: 0 } }} x1={18} x2={18} y1={2} y2={22} />
  </svg>
))
