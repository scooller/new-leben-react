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
      // stop() interrumpe animaciones en curso/pendientes para que un hover rápido
      // no deje la animación atascada cuando startAnimation se resuelve después
      stopAnimation: () => {
        controls.stop()
        controls.start('normal')
      },
    }))
    return (
      <div className={className} {...props}>
        {render(controls, size)}
      </div>
    )
  })
