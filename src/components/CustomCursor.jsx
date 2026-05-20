import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX  = useSpring(cursorX, { stiffness: 100, damping: 20 })
  const trailY  = useSpring(cursorY, { stiffness: 100, damping: 20 })
  const isHover = useRef(false)

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const enter = () => { isHover.current = true }
    const leave = () => { isHover.current = false }

    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Main crosshair */}
      <motion.div
        className="custom-cursor"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="6" stroke="#00d4ff" strokeWidth="1" opacity="0.8" />
          <line x1="16" y1="0"  x2="16" y2="10" stroke="#00d4ff" strokeWidth="1" opacity="0.8" />
          <line x1="16" y1="22" x2="16" y2="32" stroke="#00d4ff" strokeWidth="1" opacity="0.8" />
          <line x1="0"  y1="16" x2="10" y2="16" stroke="#00d4ff" strokeWidth="1" opacity="0.8" />
          <line x1="22" y1="16" x2="32" y2="16" stroke="#00d4ff" strokeWidth="1" opacity="0.8" />
          <circle cx="16" cy="16" r="1.5" fill="#00d4ff" />
        </svg>
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="custom-cursor"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '50%',
          }}
        />
      </motion.div>
    </>
  )
}
