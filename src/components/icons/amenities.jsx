import { motion, useAnimation } from 'motion/react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { cn } from '../../lib/utils.js'

// ============================================================
// Amenity Icons — animated on hover (motion/react)
// Same pattern as existing icons (shield-check, clock, etc.)
// Each icon: forwardRef + useAnimation + hover handlers
// ============================================================

const DRAW_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: { duration: 0.3, opacity: { duration: 0.1 } },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.8, 1],
    transition: { duration: 0.4, opacity: { duration: 0.1 } },
  },
}

const BOUNCE_VARIANTS = {
  normal: { y: 0 },
  animate: { y: [0, -3, 0], transition: { duration: 0.5 } },
}

// --- Factory: creates a hover-animated SVG icon from paths ---
function createAmenityIcon(paths, animationType = 'draw') {
  const variants = animationType === 'bounce' ? BOUNCE_VARIANTS : DRAW_VARIANTS
  const isSvgAnimated = animationType === 'bounce'

  const Icon = forwardRef(
    ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
      const controls = useAnimation()
      const isControlledRef = useRef(false)

      useImperativeHandle(ref, () => {
        isControlledRef.current = true
        return {
          startAnimation: () => controls.start('animate'),
          stopAnimation: () => controls.start('normal'),
        }
      })

      const handleMouseEnter = useCallback(
        (e) => {
          if (isControlledRef.current) {
            onMouseEnter?.(e)
          } else {
            controls.start('animate')
          }
        },
        [controls, onMouseEnter]
      )

      const handleMouseLeave = useCallback(
        (e) => {
          if (isControlledRef.current) {
            onMouseLeave?.(e)
          } else {
            controls.start('normal')
          }
        },
        [controls, onMouseLeave]
      )

      const SvgWrapper = isSvgAnimated ? motion.svg : 'svg'

      return (
        <div
          className={cn(className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          <SvgWrapper
            {...(isSvgAnimated ? { animate: controls, initial: 'normal', variants } : {})}
            fill="none"
            height={size}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            {paths.map((d, i) =>
              isSvgAnimated ? (
                <path key={i} d={d} />
              ) : (
                <motion.path
                  key={i}
                  animate={controls}
                  d={d}
                  initial="normal"
                  variants={variants}
                />
              )
            )}
          </SvgWrapper>
        </div>
      )
    }
  )

  return Icon
}

// --- Icon path definitions (from lucide) ---

const KEY_ICON = createAmenityIcon([
  'm15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4',
  'm21 2-9.6 9.6',
  'm15.5 7.5-3.3 3.3a4 4 0 0 1-5.7 0L4 12.3a1 1 0 0 0-1.4 0L1.4 13.5a1 1 0 0 0 0 1.4l3.6 3.6c.4.4.4 1 0 1.4l-1.4 1.4',
])

const DROPLET_ICON = createAmenityIcon([
  'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C4 11.1 3 13 3 15a7 7 0 0 0 7 7',
])

const ACTIVITY_ICON = createAmenityIcon([
  'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
])

const USERS_ICON = createAmenityIcon([
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  'circle cx="9" cy="7" r="4',
  'M22 21v-2a4 4 0 0 0-3-3.87',
  'M16 3.13a4 4 0 0 1 0 7.75',
], 'bounce')

const SUN_ICON = createAmenityIcon([
  'circle cx="12" cy="12" r="4"',
  'M12 2v2',
  'M12 20v2',
  'm4.93 4.93 1.41 1.41',
  'm17.66 17.66 1.41 1.41',
  'M2 12h2',
  'M20 12h2',
  'm6.34 17.66-1.41 1.41',
  'm19.07 4.93-1.41 1.41',
], 'bounce')

const BOX_ICON = createAmenityIcon([
  'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
  'm3.3 7 8.7 5 8.7-5',
  'M12 22V12',
])

const COMPASS_ICON = createAmenityIcon([
  'circle cx="12" cy="12" r="10"',
  'polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"',
])

const LAPTOP_ICON = createAmenityIcon([
  'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a.7.7 0 0 1-.61 1.45H3.33a.7.7 0 0 1-.61-1.45L4 16',
])

const FLAME_ICON = createAmenityIcon([
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
])

const DUMBBELL_ICON = createAmenityIcon([
  'm6.5 6.5 11 11',
  'm21 21-1-1',
  'm3 3 1 1',
  'm18 22 4-4',
  'm2 6 4-4',
  'm3 10 7-7',
  'm14 21 7-7',
])

const WAVES_ICON = createAmenityIcon([
  'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
], 'bounce')

const SMILE_ICON = createAmenityIcon([
  'circle cx="12" cy="12" r="10"',
  'path d="M8 14s1.5 2 4 2 4-2 4-2"',
  'line x1="9" x2="9.01" y1="9" y2="9"',
  'line x1="15" x2="15.01" y1="9" y2="9"',
])

// --- Export map ---
const ICON_MAP = {
  key: KEY_ICON,
  droplet: DROPLET_ICON,
  activity: ACTIVITY_ICON,
  users: USERS_ICON,
  sun: SUN_ICON,
  box: BOX_ICON,
  compass: COMPASS_ICON,
  laptop: LAPTOP_ICON,
  flame: FLAME_ICON,
  dumbbell: DUMBBELL_ICON,
  waves: WAVES_ICON,
  smile: SMILE_ICON,
}

// Set displayNames
Object.entries(ICON_MAP).forEach(([name, Icon]) => {
  Icon.displayName = `${name.charAt(0).toUpperCase() + name.slice(1)}Icon`
})

export {
  KEY_ICON as KeyIcon,
  DROPLET_ICON as DropletIcon,
  ACTIVITY_ICON as ActivityIcon,
  USERS_ICON as UsersIcon,
  SUN_ICON as SunIcon,
  BOX_ICON as BoxIcon,
  COMPASS_ICON as CompassIcon,
  LAPTOP_ICON as LaptopIcon,
  FLAME_ICON as FlameIcon,
  DUMBBELL_ICON as DumbbellIcon,
  WAVES_ICON as WavesIcon,
  SMILE_ICON as SmileIcon,
}

export const amenityIconNames = Object.keys(ICON_MAP)
export default ICON_MAP
