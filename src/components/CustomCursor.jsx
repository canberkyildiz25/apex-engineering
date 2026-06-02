import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX  = useSpring(cursorX, { stiffness: 100, damping: 20 })
  const trailY  = useSpring(cursorY, { stiffness: 100, damping: 20 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const enter = () => setHover(true)
    const leave = () => setHover(false)

    window.addEventListener('mousemove', move)

    const attachListeners = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
      })
    }

    attachListeners()

    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  if (isTouchDevice()) return null

  return (
    <>
      {/* Main crosshair */}
      <motion.div
        className="custom-cursor"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hover ? 1.4 : 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="6" stroke={hover ? '#ffffff' : '#00d4ff'} strokeWidth="1" opacity="0.9" />
          <line x1="16" y1="0"  x2="16" y2="10" stroke={hover ? '#ffffff' : '#00d4ff'} strokeWidth="1" opacity="0.9" />
          <line x1="16" y1="22" x2="16" y2="32" stroke={hover ? '#ffffff' : '#00d4ff'} strokeWidth="1" opacity="0.9" />
          <line x1="0"  y1="16" x2="10" y2="16" stroke={hover ? '#ffffff' : '#00d4ff'} strokeWidth="1" opacity="0.9" />
          <line x1="22" y1="16" x2="32" y2="16" stroke={hover ? '#ffffff' : '#00d4ff'} strokeWidth="1" opacity="0.9" />
          <circle cx="16" cy="16" r="1.5" fill={hover ? '#ffffff' : '#00d4ff'} />
        </svg>
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="custom-cursor"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: hover ? 2 : 1,
          opacity: hover ? 0.9 : 0.4,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `1px solid ${hover ? 'rgba(255,255,255,0.6)' : 'rgba(0,212,255,0.3)'}`,
            borderRadius: '50%',
            transition: 'border-color 0.15s ease',
          }}
        />
      </motion.div>
    </>
  )
}
