import { useAnimation } from 'motion/react'
import { forwardRef, useImperativeHandle } from 'react'

/** Shared hover helper — parent delegates animation via ref */
export const hover = (ref) => ({
  onMouseEnter: () => ref.current?.startAnimation(),
  onMouseLeave: () => ref.current?.stopAnimation(),
})

/**
 * Factory: eliminates ~40 lines of forwardRef/useImperativeHandle boilerplate per icon.
 * @param {(controls: AnimationControls, size: number) => JSX.Element} render — return the svg
 */
export const createAnimatedIcon = (render) =>
  forwardRef(function AnimatedIcon({ className, size = 28, ...props }, ref) {
    const controls = useAnimation()
    useImperativeHandle(ref, () => ({
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    }))
    return (
      <div className={className} {...props}>
        {render(controls, size)}
      </div>
    )
  })
