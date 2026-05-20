import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import BlueprintGrid from '../components/ui/BlueprintGrid'
import SectionHeader from '../components/ui/SectionHeader'

const CATEGORIES = ['ALL', 'AEROSPACE', 'DEFENSE', 'AUTOMOTIVE', 'INDUSTRIAL']

const PROJECTS = [
  {
    id: 1, code: 'PRJ-2024-001',
    title:    'Next-Gen VTOL Propulsion',
    category: 'AEROSPACE',
    year:     '2024',
    client:   'Classified',
    duration: '18 months',
    tags:     ['Turbofan', 'FADEC', 'CFD', 'Noise Reduction'],
    desc:     'Complete propulsion system redesign for a tilt-rotor unmanned aerial vehicle. Achieved 23% thrust improvement while reducing acoustic signature by 14 dB.',
    metrics:  [{ label: 'THRUST GAIN', value: '+23%' }, { label: 'NOISE REDUCTION', value: '14 dB' }, { label: 'FUEL EFFICIENCY', value: '+18%' }],
  },
  {
    id: 2, code: 'PRJ-2024-002',
    title:    'Formula E Powertrain Optimization',
    category: 'AUTOMOTIVE',
    year:     '2024',
    client:   'Team Classified',
    duration: '8 months',
    tags:     ['Motor Design', 'Thermal Management', 'Regenerative Braking'],
    desc:     'Electric motor and inverter thermal management system redesign. Continuous power increased by 35 kW while maintaining temperature under 85°C under peak loads.',
    metrics:  [{ label: 'POWER GAIN', value: '+35 kW' }, { label: 'PEAK TEMP', value: '85 °C' }, { label: 'LAP TIME', value: '-0.4s' }],
  },
  {
    id: 3, code: 'PRJ-2023-007',
    title:    'Fighter Jet Inlet Duct Analysis',
    category: 'DEFENSE',
    year:     '2023',
    client:   'Ministry of Defence',
    duration: '12 months',
    tags:     ['Supersonic CFD', 'Intake Design', 'Oblique Shock', 'Boundary Layer'],
    desc:     'Full intake duct redesign for a 4th-generation fighter operating at Mach 1.8. Pressure recovery improved by 8% with complete boundary layer separation elimination.',
    metrics:  [{ label: 'PRESSURE RECOVERY', value: '+8%' }, { label: 'MACH NUMBER', value: '1.8' }, { label: 'SEPARATION', value: 'ELIMINATED' }],
  },
  {
    id: 4, code: 'PRJ-2023-012',
    title:    'Gas Turbine Compressor Blade Repair',
    category: 'INDUSTRIAL',
    year:     '2023',
    client:   'Energy Utility Corp',
    duration: '6 months',
    tags:     ['Compressor', 'Fatigue Analysis', 'DIC Testing', 'Life Extension'],
    desc:     'In-situ compressor blade crack analysis and repair certification for a 220 MW power plant gas turbine. Extended service life by 12,000 operating hours.',
    metrics:  [{ label: 'LIFE EXTENSION', value: '12,000 hr' }, { label: 'COST SAVING', value: '$4.2M' }, { label: 'DOWNTIME', value: '0 days' }],
  },
  {
    id: 5, code: 'PRJ-2022-018',
    title:    'Hypersonic Re-entry Vehicle TPS',
    category: 'AEROSPACE',
    year:     '2022',
    client:   'Space Agency',
    duration: '24 months',
    tags:     ['Ablative Materials', 'Hypersonics', 'Aeroheating', 'UHTC'],
    desc:     'Thermal protection system design and analysis for a reusable re-entry vehicle. Survived 2,800°C stagnation temperatures across 3 consecutive re-entry missions.',
    metrics:  [{ label: 'PEAK TEMP', value: '2,800 °C' }, { label: 'RE-ENTRIES', value: '3×' }, { label: 'MASS SAVING', value: '180 kg' }],
  },
  {
    id: 6, code: 'PRJ-2022-025',
    title:    'Armored Vehicle Suspension',
    category: 'DEFENSE',
    year:     '2022',
    client:   'Classified',
    duration: '14 months',
    tags:     ['NVH', 'Durability', 'Mine Blast', 'FEA'],
    desc:     'Active suspension redesign for an 8×8 armored personnel carrier. Passes NATO STANAG 4569 Level 4 blast protection with 40% improved ride comfort metrics.',
    metrics:  [{ label: 'BLAST RATING', value: 'STANAG L4' }, { label: 'RIDE COMFORT', value: '+40%' }, { label: 'GROUND CLEARANCE', value: '+60mm' }],
  },
]

export default function Projects() {
  const [filter,   setFilter]   = useState('ALL')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'ALL' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-accent-cyan/10">
        <BlueprintGrid opacity={0.08} />
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="PORTFOLIO"
            title="PROVEN<br/><span class='text-gradient-cyan'>IN THE FIELD</span>"
            subtitle="From classified defense programs to open-class motorsport — our engineering speaks through results."
          />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mt-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`clip-corner-sm px-5 py-2 font-mono text-xs tracking-[0.15em] border transition-all ${
                  filter === cat
                    ? 'bg-accent-cyan/15 border-accent-cyan/50 text-accent-cyan'
                    : 'border-accent-silver/15 text-accent-silver/40 hover:border-accent-cyan/30 hover:text-accent-silver/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(project)}
                  whileHover={{ y: -4 }}
                  className="panel clip-corner p-6 cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-mono text-[9px] text-accent-cyan/40 tracking-widest">{project.code}</div>
                    <div className="font-mono text-[9px] text-accent-silver/30">{project.year}</div>
                  </div>

                  {/* Category badge */}
                  <div className="inline-block font-mono text-[9px] tracking-[0.2em] px-2 py-1 border border-accent-cyan/20 text-accent-cyan/60 mb-3">
                    {project.category}
                  </div>

                  <h3 className="font-display font-700 text-lg mb-3 group-hover:text-accent-cyan transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-accent-silver/40 text-sm leading-relaxed mb-4 line-clamp-2">{project.desc}</p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="text-center bg-steel-800/60 px-3 py-1.5">
                        <div className="font-mono text-xs text-accent-cyan tech-number">{m.value}</div>
                        <div className="font-mono text-[8px] text-accent-silver/30 tracking-wide">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="font-mono text-[9px] text-accent-silver/30 border border-accent-silver/10 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-steel-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="panel clip-corner max-w-2xl w-full p-8 relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 font-mono text-xs text-accent-silver/40 hover:text-white transition-colors"
              >
                [×] CLOSE
              </button>

              <div className="font-mono text-[9px] text-accent-cyan/50 tracking-widest mb-2">{selected.code}</div>
              <div className="inline-block font-mono text-[9px] tracking-[0.2em] px-2 py-1 border border-accent-cyan/20 text-accent-cyan/60 mb-4">
                {selected.category}
              </div>
              <h2 className="font-display font-800 text-3xl mb-4 leading-tight">{selected.title}</h2>
              <p className="text-accent-silver/60 leading-relaxed mb-6">{selected.desc}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {selected.metrics.map((m) => (
                  <div key={m.label} className="panel clip-corner-sm p-4 text-center">
                    <div className="font-mono text-xl text-accent-cyan tech-number mb-1">{m.value}</div>
                    <div className="font-mono text-[9px] text-accent-silver/40 tracking-wide">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm border-t border-accent-cyan/10 pt-6">
                <div>
                  <div className="font-mono text-[9px] text-accent-cyan/40 tracking-widest mb-1">CLIENT</div>
                  <div className="text-accent-silver/60">{selected.client}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-accent-cyan/40 tracking-widest mb-1">DURATION</div>
                  <div className="text-accent-silver/60">{selected.duration}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[9px] text-accent-silver/40 border border-accent-silver/15 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
