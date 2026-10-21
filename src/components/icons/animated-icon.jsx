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
    const { style, ...rest } = props
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          lineHeight: 0,
          ...style,
        }}
        {...rest}
      >
        {render(controls, size)}
      </div>
    )
  })
