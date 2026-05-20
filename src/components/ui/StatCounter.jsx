import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

export default function StatCounter({ end, suffix = '', duration = 2000, decimals = 0 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true })
  const frameRef = useRef(null)

  useEffect(() => {
    if (!inView) return
    const start  = performance.now()
    const update = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = easeOutQuart(progress)
      setCount(parseFloat((eased * end).toFixed(decimals)))
      if (progress < 1) frameRef.current = requestAnimationFrame(update)
    }
    frameRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameRef.current)
  }, [inView, end, duration, decimals])

  return (
    <span ref={ref} className="tech-number">
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  )
}
