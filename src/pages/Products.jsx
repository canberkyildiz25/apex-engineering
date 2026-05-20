import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import BlueprintGrid from '../components/ui/BlueprintGrid'
import SectionHeader from '../components/ui/SectionHeader'
import TechBadge from '../components/ui/TechBadge'
import TurbofanEngine from '../components/3d/TurbofanEngine'
import PistonEngine from '../components/3d/PistonEngine'
import GearAssembly from '../components/3d/GearAssembly'

const PRODUCTS = [
  {
    id:       'tf28000',
    code:     'APEX-TF28000',
    name:     'TF-28000 Turbofan',
    category: 'Aerospace Propulsion',
    desc:     'High-bypass turbofan engine for commercial and military transport aircraft. 15-stage axial compressor, annular combustion chamber with 24 fuel injectors, and 5-stage turbine system.',
    specs: [
      { label: 'MAX THRUST',    value: '28,000', unit: 'lbf',  color: 'cyan' },
      { label: 'BYPASS RATIO',  value: '12.4',   unit: ':1',   color: 'gold' },
      { label: 'TURBINE TEMP',  value: '1,650',  unit: '°C',   color: 'orange' },
      { label: 'PRESSURE RATIO',value: '45:1',   unit: '',     color: 'cyan' },
    ],
    features: ['15-stage axial compressor', 'Full FADEC control', 'TOBI cooling system', 'Chevron exhaust nozzle', 'CMC turbine blades'],
    model:    'turbofan',
    status:   'PRODUCTION',
  },
  {
    id:       've6000',
    code:     'APEX-VE6000',
    name:     'V6 Racing Engine',
    category: 'Automotive Powertrain',
    desc:     'Formula-spec 3.0L V6 twin-turbocharged engine. Plasma-sprayed cylinder bores, titanium connecting rods, flat-plane crankshaft. Designed for 10,500 RPM continuous operation.',
    specs: [
      { label: 'MAX POWER',     value: '620',    unit: 'bhp',  color: 'orange' },
      { label: 'MAX TORQUE',    value: '580',    unit: 'Nm',   color: 'gold' },
      { label: 'REDLINE',       value: '10,500', unit: 'RPM',  color: 'cyan' },
      { label: 'DISPLACEMENT',  value: '3.0',    unit: 'L',    color: 'cyan' },
    ],
    features: ['Dry sump lubrication', 'Variable valve timing', 'Flat-plane crankshaft', 'Titanium con-rods', 'Sequential turbo'],
    model:    'piston',
    status:   'ENGINEERING',
  },
  {
    id:       'pg420',
    code:     'APEX-PG420',
    name:     'Planetary Gearbox PG-420',
    category: 'Power Transmission',
    desc:     'High-torque planetary gear system for industrial and aerospace actuators. Carburized and case-hardened 16MnCr5 gears. Optimized tooth profile via FEA contact analysis.',
    specs: [
      { label: 'INPUT SPEED',   value: '6,000',  unit: 'RPM',  color: 'cyan' },
      { label: 'TORQUE OUT',    value: '4,200',  unit: 'Nm',   color: 'gold' },
      { label: 'GEAR RATIO',    value: '12:1',   unit: '',     color: 'orange' },
      { label: 'EFFICIENCY',    value: '98.5',   unit: '%',    color: 'cyan' },
    ],
    features: ['3-stage planetary', 'Integrated oil cooling', 'CNC ground teeth', 'Life: 40,000 hrs', 'IP67 rated'],
    model:    'gear',
    status:   'AVAILABLE',
  },
]

function Model3D({ type, exploded }) {
  if (type === 'turbofan') return <TurbofanEngine exploded={exploded} />
  if (type === 'piston')   return <PistonEngine cylinders={6} />
  return <GearAssembly />
}

const STATUS_COLORS = {
  PRODUCTION:  'text-green-400 border-green-400/30 bg-green-400/5',
  ENGINEERING: 'text-accent-orange border-accent-orange/30 bg-accent-orange/5',
  AVAILABLE:   'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5',
}

export default function Products() {
  const [selected, setSelected]   = useState(PRODUCTS[0])
  const [exploded, setExploded]   = useState(false)

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-accent-cyan/10">
        <BlueprintGrid opacity={0.08} />
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="PRODUCT CATALOG"
            title="OUR<br/><span class='text-gradient-cyan'>SYSTEMS</span>"
            subtitle="Interactive 3D models — drag to rotate, scroll to zoom, explode to inspect every component."
          />
        </div>
      </section>

      {/* Main viewer */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Product list sidebar */}
            <div className="xl:col-span-2 space-y-3">
              {PRODUCTS.map((product) => (
                <motion.button
                  key={product.id}
                  onClick={() => { setSelected(product); setExploded(false) }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left panel clip-corner p-5 transition-all ${
                    selected.id === product.id
                      ? 'border-accent-cyan/40 bg-accent-cyan/5'
                      : 'hover:border-accent-cyan/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-mono text-[9px] text-accent-silver/40 tracking-widest">{product.code}</div>
                    <span className={`font-mono text-[9px] tracking-widest border px-2 py-0.5 ${STATUS_COLORS[product.status]}`}>
                      {product.status}
                    </span>
                  </div>
                  <h3 className={`font-display font-700 text-base mb-1 ${selected.id === product.id ? 'text-accent-cyan' : 'text-white'}`}>
                    {product.name}
                  </h3>
                  <div className="text-xs text-accent-silver/40">{product.category}</div>

                  {selected.id === product.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-accent-cyan/10"
                    >
                      <p className="text-accent-silver/50 text-xs leading-relaxed mb-4">{product.desc}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {product.specs.map((spec) => (
                          <TechBadge key={spec.label} {...spec} />
                        ))}
                      </div>
                      <ul className="mt-4 space-y-1.5">
                        {product.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-accent-silver/40">
                            <span className="w-1 h-1 rounded-full bg-accent-cyan/50 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* 3D Viewer */}
            <div className="xl:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Canvas */}
                  <div className="relative aspect-square bg-steel-900/50 border border-accent-cyan/10 rounded overflow-hidden">
                    {/* HUD overlay */}
                    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pointer-events-none">
                      <div>
                        <div className="font-mono text-[9px] text-accent-cyan/50 tracking-widest">{selected.code}</div>
                        <div className="font-display font-600 text-sm text-white">{selected.name}</div>
                      </div>
                      <div className={`font-mono text-[9px] tracking-widest border px-2 py-1 ${STATUS_COLORS[selected.status]}`}>
                        {selected.status}
                      </div>
                    </div>

                    {/* Corners */}
                    {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 left-3 -rotate-90', 'bottom-3 right-3 rotate-180'].map((cls) => (
                      <div key={cls} className={`absolute ${cls} w-5 h-5 pointer-events-none z-10`}>
                        <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
                          <polyline points="0,10 0,0 10,0" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />
                        </svg>
                      </div>
                    ))}

                    <Canvas
                      camera={{ position: [0, 0, 7], fov: 45 }}
                      dpr={[1, 2]}
                      gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.2 }}
                    >
                      <Suspense fallback={null}>
                        <Model3D type={selected.model} exploded={exploded} />
                      </Suspense>
                    </Canvas>

                    {/* Bottom overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                      <div className="font-mono text-[9px] text-accent-silver/30">DRAG TO ROTATE</div>
                      <div className="font-mono text-[9px] text-accent-silver/30">SCROLL TO ZOOM</div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {selected.model === 'turbofan' && (
                      <button
                        onClick={() => setExploded(!exploded)}
                        className={`clip-corner-sm px-6 py-2.5 font-display font-600 text-xs tracking-[0.15em] border transition-all ${
                          exploded
                            ? 'text-accent-orange border-accent-orange/40 bg-accent-orange/10 hover:bg-accent-orange/20'
                            : 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5 hover:bg-accent-cyan/15'
                        }`}
                      >
                        {exploded ? '⟵ ASSEMBLE COMPONENTS' : 'EXPLODED VIEW ⟶'}
                      </button>
                    )}
                    <button className="clip-corner-sm px-6 py-2.5 font-display font-600 text-xs tracking-[0.15em] border border-accent-silver/20 text-accent-silver/50 hover:text-white hover:border-accent-silver/40 transition-all">
                      REQUEST DATASHEET
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
