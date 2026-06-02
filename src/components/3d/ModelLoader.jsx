import { motion } from 'framer-motion'

export default function ModelLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-steel-950/50">
      <div className="flex flex-col items-center gap-5">
        {/* Spinning rings */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border border-accent-cyan/10" />
          <motion.div
            className="absolute inset-0 rounded-full border-t border-accent-cyan"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-b border-accent-cyan/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-accent-cyan"
          />
          <span className="font-mono text-[9px] text-accent-cyan/40 tracking-[0.3em]">
            LOADING MODEL
          </span>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            className="w-1 h-1 rounded-full bg-accent-cyan"
          />
        </div>
      </div>
    </div>
  )
}
