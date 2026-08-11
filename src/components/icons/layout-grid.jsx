import { motion } from 'motion/react'
import { createAnimatedIcon } from './animated-icon.jsx'

const T = { duration: 0.8, ease: 'easeInOut', times: [0, 0.4, 0.6, 1] }

const RECT_1 = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: [0, 11, 11, 0], translateY: [0, 0, 0, 0], transition: T },
}
const RECT_2 = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: [0, 0, 0, 0], translateY: [0, 11, 11, 0], transition: T },
}
const RECT_3 = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: [0, -11, -11, 0], translateY: [0, 0, 0, 0], transition: T },
}
const RECT_4 = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: [0, 0, 0, 0], translateY: [0, -11, -11, 0], transition: T },
}

export const LayoutGridIcon = createAnimatedIcon((controls, size) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <motion.rect animate={controls} initial="normal" variants={RECT_1} width="7" height="7" x="3" y="3" rx="1" />
    <motion.rect animate={controls} initial="normal" variants={RECT_2} width="7" height="7" x="14" y="3" rx="1" />
    <motion.rect animate={controls} initial="normal" variants={RECT_3} width="7" height="7" x="14" y="14" rx="1" />
    <motion.rect animate={controls} initial="normal" variants={RECT_4} width="7" height="7" x="3" y="14" rx="1" />
  </svg>
))
