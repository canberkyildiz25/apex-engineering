import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function SectionHeader({ tag, title, subtitle, center = false }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <div ref={ref} className={center ? 'text-center' : ''}>
      {tag && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <div className="h-px w-8 bg-accent-cyan/50" />
          <span className="font-mono text-[10px] text-accent-cyan tracking-[0.3em]">{tag}</span>
          <div className="h-px w-8 bg-accent-cyan/50" />
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display font-800 text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none mb-4"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-accent-silver/50 text-lg max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
