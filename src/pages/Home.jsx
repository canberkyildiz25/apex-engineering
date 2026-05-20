import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import BlueprintGrid from '../components/ui/BlueprintGrid'
import TechBadge from '../components/ui/TechBadge'
import SectionHeader from '../components/ui/SectionHeader'
import StatCounter from '../components/ui/StatCounter'
import TurbofanEngine from '../components/3d/TurbofanEngine'

// ── Typing effect ─────────────────────────────────────────────────────────────
const PHRASES = ['AEROSPACE', 'DEFENSE', 'AUTOMOTIVE', 'PRECISION']

function TypingText() {
  const [phrase, setPhrase] = useState(0)
  const [text,   setText]   = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeout = useRef(null)

  useEffect(() => {
    const current = PHRASES[phrase]
    if (!deleting && text === current) {
      timeout.current = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && text === '') {
      setDeleting(false)
      setPhrase((p) => (p + 1) % PHRASES.length)
    } else {
      timeout.current = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1))
      }, deleting ? 60 : 90)
    }
    return () => clearTimeout(timeout.current)
  }, [text, deleting, phrase])

  return (
    <span className="text-gradient-cyan">
      {text}
      <span className="animate-blink">_</span>
    </span>
  )
}

// ── HUD corner decoration ──────────────────────────────────────────────────────
function HUDCorner({ className }) {
  return (
    <div className={`absolute w-8 h-8 ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
        <polyline points="0,16 0,0 16,0" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ── Particle field ─────────────────────────────────────────────────────────────
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-accent-cyan rounded-full"
          style={{
            left:   `${Math.random() * 100}%`,
            top:    `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.5, 1] }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

// ── Spec readout panel ─────────────────────────────────────────────────────────
function SpecPanel({ label, value, unit, progress }) {
  return (
    <div className="border-b border-accent-cyan/10 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[10px] text-accent-silver/40 tracking-widest">{label}</span>
        <span className="font-mono text-xs text-accent-cyan tech-number">
          {value}<span className="text-accent-cyan/50 ml-1">{unit}</span>
        </span>
      </div>
      <div className="h-px bg-steel-700 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-cyan/80 to-accent-cyan/20"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ── Home page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [exploded, setExploded] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <BlueprintGrid opacity={0.12} />
        <ParticleField />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent pointer-events-none animate-scan"
          style={{ zIndex: 10 }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20"
        >
          {/* Left: text */}
          <div>
            {/* System tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span className="font-mono text-xs text-accent-cyan/60 tracking-[0.3em]">
                SYS://APEX-ENG-v2.4.1
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-900 text-5xl md:text-6xl xl:text-7xl leading-none tracking-tight mb-2"
            >
              ENGINEERING
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-900 text-5xl md:text-6xl xl:text-7xl leading-none tracking-tight mb-2"
            >
              FOR
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-900 text-5xl md:text-6xl xl:text-7xl leading-none tracking-tight mb-8"
            >
              <TypingText />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-accent-silver/50 text-lg leading-relaxed max-w-md mb-10"
            >
              Advanced propulsion systems, precision components and structural engineering solutions
              trusted by the world's leading aerospace and defense manufacturers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="clip-corner px-8 py-4 bg-accent-cyan text-steel-950 font-display font-700 text-sm tracking-[0.15em] hover:bg-white transition-colors"
              >
                EXPLORE PRODUCTS
              </Link>
              <Link
                to="/projects"
                className="clip-corner px-8 py-4 border border-accent-cyan/30 text-accent-cyan font-display font-600 text-sm tracking-[0.15em] hover:bg-accent-cyan/10 hover:border-accent-cyan/60 transition-all"
              >
                VIEW PROJECTS
              </Link>
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 space-y-0 max-w-xs"
            >
              <SpecPanel label="MAX THRUST"       value="28,000"  unit="lbf"  progress={85} />
              <SpecPanel label="TURBINE INLET TEMP" value="1,650" unit="°C"   progress={72} />
              <SpecPanel label="BYPASS RATIO"     value="12.4"    unit=":1"   progress={90} />
              <SpecPanel label="PRESSURE RATIO"   value="45:1"    unit=""     progress={78} />
            </motion.div>
          </div>

          {/* Right: 3D Engine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* HUD frame */}
            <div className="relative aspect-square max-w-xl mx-auto">
              <HUDCorner className="top-0 left-0" />
              <HUDCorner className="top-0 right-0 rotate-90" />
              <HUDCorner className="bottom-0 left-0 -rotate-90" />
              <HUDCorner className="bottom-0 right-0 rotate-180" />

              {/* Canvas */}
              <div className="w-full h-full rounded">
                <Canvas
                  camera={{ position: [0, 0, 7], fov: 45 }}
                  dpr={[1, 2]}
                  gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.2 }}
                >
                  <Suspense fallback={null}>
                    <TurbofanEngine exploded={exploded} />
                  </Suspense>
                </Canvas>
              </div>

              {/* Overlay labels */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="font-mono text-[9px] text-accent-cyan/50 tracking-[0.2em]">
                  MODEL: APEX-TF28000
                </div>
                <div className="font-mono text-[9px] text-accent-cyan/50 tracking-[0.2em]">
                  REV.4.2
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="font-mono text-[9px] text-accent-silver/30 tracking-[0.2em]">
                  DRAG TO ROTATE
                </div>
                <div className="font-mono text-[9px] text-accent-silver/30 tracking-[0.2em]">
                  SCROLL TO ZOOM
                </div>
              </div>

              {/* Explode button */}
              <div className="absolute -bottom-14 left-0 right-0 flex justify-center">
                <button
                  onClick={() => setExploded(!exploded)}
                  className={`clip-corner-sm px-6 py-2.5 font-display font-600 text-xs tracking-[0.2em] transition-all ${
                    exploded
                      ? 'bg-accent-orange/20 border border-accent-orange/50 text-accent-orange hover:bg-accent-orange/30'
                      : 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20'
                  }`}
                >
                  {exploded ? '⟵ ASSEMBLE' : 'EXPLODE VIEW ⟶'}
                </button>
              </div>
            </div>

            {/* Side specs */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3">
              {[
                { label: 'RPM', value: '14,250', color: 'cyan' },
                { label: 'STAGES', value: '15', color: 'gold' },
                { label: 'WEIGHT', value: '6,200', color: 'orange' },
              ].map((s) => (
                <TechBadge key={s.label} label={s.label} value={s.value} color={s.color} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] text-accent-silver/30 tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-accent-cyan/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-24 border-t border-accent-cyan/10 overflow-hidden">
        <BlueprintGrid opacity={0.06} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-accent-cyan/10">
            {[
              { label: 'PROJECTS DELIVERED',  end: 847,   suffix: '+' },
              { label: 'YEARS EXPERIENCE',    end: 10,    suffix: '' },
              { label: 'CERTIFICATIONS',      end: 24,    suffix: '' },
              { label: 'COUNTRIES SERVED',    end: 38,    suffix: '' },
            ].map(({ label, end, suffix }) => (
              <div key={label} className="bg-steel-950 p-8 text-center">
                <div className="font-display font-800 text-5xl text-white mb-2 glow-cyan">
                  <StatCounter end={end} suffix={suffix} />
                </div>
                <div className="font-mono text-[10px] text-accent-silver/40 tracking-[0.2em]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="CORE CAPABILITIES"
            title="<span class='text-gradient-cyan'>PRECISION</span><br/>ENGINEERING"
            subtitle="From concept to certification, we deliver mission-critical components that perform where it matters most."
          />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '✈',
                code: 'CAP-001',
                title: 'Propulsion Systems',
                desc: 'Turbofan, turbojet and turboshaft engine design, analysis and manufacturing support. From compressor maps to combustion CFD.',
                specs: ['AS9100D Certified', 'Up to 50,000 lbf thrust', 'Full-authority FADEC integration'],
                color: 'cyan',
              },
              {
                icon: '⚙',
                code: 'CAP-002',
                title: 'Powertrain Engineering',
                desc: 'High-performance automotive and motorsport powertrain solutions. Combustion analysis, crankshaft dynamics, NVH optimization.',
                specs: ['Formula-grade tolerances', 'Block & head machining', 'Dyno validation'],
                color: 'orange',
              },
              {
                icon: '🛡',
                code: 'CAP-003',
                title: 'Structural Analysis',
                desc: 'FEA, fatigue, fracture mechanics and damage tolerance analysis for aerospace and defense structural components.',
                specs: ['NASTRAN / ABAQUS', 'DO-160 / MIL-STD', 'Composite structures'],
                color: 'gold',
              },
            ].map((cap, i) => (
              <motion.div
                key={cap.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="panel clip-corner p-8 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-3xl">{cap.icon}</div>
                  <div className="font-mono text-[9px] text-accent-cyan/30 tracking-widest">{cap.code}</div>
                </div>
                <h3 className="font-display font-700 text-xl tracking-wide mb-3 group-hover:text-accent-cyan transition-colors">
                  {cap.title}
                </h3>
                <p className="text-accent-silver/50 text-sm leading-relaxed mb-6">{cap.desc}</p>
                <ul className="space-y-1.5">
                  {cap.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-accent-silver/40">
                      <span className="w-1 h-1 rounded-full bg-accent-cyan/50" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 overflow-hidden border-t border-accent-cyan/10">
        <BlueprintGrid opacity={0.1} />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionHeader
            tag="READY TO COLLABORATE"
            title="START YOUR<br/><span class='text-gradient-gold'>PROJECT</span>"
            subtitle="Share your requirements with our engineering team. From initial concept to final delivery, we're with you every step."
            center
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="clip-corner px-10 py-4 bg-accent-cyan text-steel-950 font-display font-700 tracking-[0.15em] text-sm hover:bg-white transition-colors"
            >
              REQUEST CONSULTATION
            </Link>
            <Link
              to="/products"
              className="clip-corner px-10 py-4 border border-accent-cyan/30 text-accent-silver font-display font-500 tracking-[0.12em] text-sm hover:border-accent-cyan/60 hover:text-white transition-all"
            >
              BROWSE CATALOG
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
