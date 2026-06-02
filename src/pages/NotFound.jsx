import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BlueprintGrid from '../components/ui/BlueprintGrid'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BlueprintGrid opacity={0.1} />

      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent pointer-events-none animate-scan" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Error code */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="font-mono text-xs text-red-400/70 tracking-[0.3em]">
            ERR://ROUTE-NOT-FOUND
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-900 text-[10rem] leading-none tracking-tight text-white/5 select-none"
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="-mt-8 mb-6"
        >
          <h1 className="font-display font-800 text-3xl md:text-4xl tracking-wide mb-4">
            SIGNAL <span className="text-gradient-cyan">LOST</span>
          </h1>
          <p className="text-accent-silver/50 text-base leading-relaxed">
            The route you requested does not exist in our system. Return to base and reacquire target.
          </p>
        </motion.div>

        {/* HUD readout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="panel clip-corner p-6 mb-8 text-left space-y-2"
        >
          {[
            { label: 'STATUS',    value: 'PAGE NOT FOUND',    color: 'text-red-400' },
            { label: 'CODE',      value: '404',               color: 'text-accent-orange' },
            { label: 'ACTION',    value: 'RETURN TO ORIGIN',  color: 'text-accent-cyan' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-accent-silver/30 tracking-widest">{label}</span>
              <span className={`font-mono text-xs tracking-wider ${color}`}>{value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="clip-corner px-8 py-3.5 bg-accent-cyan text-steel-950 font-display font-700 text-sm tracking-[0.15em] hover:bg-white transition-colors"
          >
            RETURN TO BASE
          </Link>
          <Link
            to="/contact"
            className="clip-corner px-8 py-3.5 border border-accent-cyan/30 text-accent-cyan font-display font-600 text-sm tracking-[0.15em] hover:bg-accent-cyan/10 hover:border-accent-cyan/60 transition-all"
          >
            REPORT ISSUE
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
