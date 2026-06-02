import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import BlueprintGrid from '../components/ui/BlueprintGrid'
import SectionHeader from '../components/ui/SectionHeader'
import StatCounter from '../components/ui/StatCounter'
import GearAssembly from '../components/3d/GearAssembly'
import ModelLoader from '../components/3d/ModelLoader'

const timeline = [
  { year: '2014', title: 'Founded',                desc: 'Started as a small aerospace consulting firm with 3 senior engineers and a vision for precision manufacturing.' },
  { year: '2016', title: 'AS9100D Certification',  desc: 'Achieved aerospace quality management certification, opening doors to Tier-1 defense contracts.' },
  { year: '2018', title: 'Propulsion Lab',          desc: 'Opened state-of-the-art propulsion testing facility with full-scale turbofan test cell capacity.' },
  { year: '2020', title: 'Automotive Division',     desc: 'Expanded into motorsport and high-performance automotive powertrain engineering.' },
  { year: '2022', title: 'Global Expansion',        desc: 'Established partnerships in 38 countries across Europe, Asia, and the Americas.' },
  { year: '2024', title: 'APEX 3.0',                desc: 'Launched next-generation digital twin platform for real-time engine health monitoring.' },
]

const team = [
  { name: 'Dr. Kemal Arslan',     role: 'Chief Engineering Officer', spec: 'Propulsion & Thermodynamics', exp: '22 years', code: 'ENG-001' },
  { name: 'Selin Yıldırım',       role: 'Head of Structural Analysis', spec: 'FEA / Composite Structures', exp: '15 years', code: 'ENG-002' },
  { name: 'Marco Di Benedetto',   role: 'Powertrain Lead',             spec: 'IC Engines / Motorsport',    exp: '18 years', code: 'ENG-003' },
  { name: 'Dr. Ayşe Korkmaz',     role: 'R&D Director',                spec: 'CFD / Aerodynamics',         exp: '20 years', code: 'ENG-004' },
]

export default function About() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-20 pt-32 overflow-hidden">
        <BlueprintGrid opacity={0.1} />
        <div className="absolute inset-0 bg-gradient-to-b from-steel-950 via-transparent to-steel-950" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-accent-cyan/50" />
            <span className="font-mono text-[10px] text-accent-cyan tracking-[0.3em]">ABOUT APEX</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-900 text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight"
          >
            BUILT BY<br /><span className="text-gradient-cyan">AN ENGINEER,</span><br />FOR ENGINEERS.
          </motion.h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 border-t border-accent-cyan/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionHeader
              tag="OUR MISSION"
              title="PRECISION<br/><span class='text-gradient-gold'>WITHOUT</span><br/>COMPROMISE"
              subtitle="Every component we design, every analysis we deliver, must perform flawlessly under the most extreme conditions. That's not a goal — it's a minimum requirement."
            />
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { end: 847,  suffix: '+', label: 'Completed Projects',    color: 'text-accent-cyan' },
                { end: 10,   suffix: '+', label: 'Years of Excellence',   color: 'text-accent-gold' },
                { end: 99.7, suffix: '%', label: 'First-pass Approval',   color: 'text-accent-cyan', decimals: 1 },
                { end: 0,    suffix: '',  label: 'Safety Incidents',      color: 'text-green-400' },
              ].map(({ end, suffix, label, color, decimals }) => (
                <div key={label} className="panel clip-corner-sm p-5">
                  <div className={`font-display font-800 text-3xl ${color} mb-1`}>
                    <StatCounter end={end} suffix={suffix} decimals={decimals || 0} />
                  </div>
                  <div className="font-mono text-[9px] text-accent-silver/40 tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gear 3D */}
          <div className="relative aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 rounded-full bg-accent-cyan/3 blur-3xl" />
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.2 }}>
              <Suspense fallback={<ModelLoader />}>
                <GearAssembly />
              </Suspense>
            </Canvas>
            <div className="absolute top-4 left-4 font-mono text-[9px] text-accent-cyan/40 tracking-widest">
              PLANETARY GEAR SYSTEM
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 border-t border-accent-cyan/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader tag="MILESTONES" title="OUR<br/><span class='text-gradient-cyan'>HISTORY</span>" />
          <div className="mt-16 relative">
            {/* Central line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/0 via-accent-cyan/30 to-accent-cyan/0 hidden md:block" />

            <div className="space-y-12">
              {timeline.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="panel clip-corner p-6 inline-block">
                      <div className="font-mono text-[10px] text-accent-cyan/50 tracking-widest mb-2">{year}</div>
                      <h3 className="font-display font-700 text-lg mb-2">{title}</h3>
                      <p className="text-accent-silver/50 text-sm leading-relaxed max-w-xs">{desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-accent-cyan border-2 border-steel-950 flex-shrink-0 relative z-10">
                    <div className="absolute inset-0 rounded-full bg-accent-cyan/30 animate-ping" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 border-t border-accent-cyan/10">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader tag="LEADERSHIP" title="THE<br/><span class='text-gradient-gold'>TEAM</span>" />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="panel clip-corner p-6 group"
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-cyan/20 to-steel-800 border border-accent-cyan/20 flex items-center justify-center mb-4 text-2xl font-display font-700 text-accent-cyan">
                  {member.name.charAt(0)}
                </div>
                <div className="font-mono text-[9px] text-accent-cyan/30 tracking-widest mb-2">{member.code}</div>
                <h3 className="font-display font-700 text-base mb-0.5 group-hover:text-accent-cyan transition-colors">{member.name}</h3>
                <div className="text-xs text-accent-silver/50 mb-3">{member.role}</div>
                <div className="space-y-1">
                  <div className="font-mono text-[9px] text-accent-gold/60">{member.spec}</div>
                  <div className="font-mono text-[9px] text-accent-silver/30">{member.exp} experience</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 border-t border-accent-cyan/10 bg-steel-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="font-mono text-[10px] text-accent-cyan/40 tracking-widest text-center mb-10">
            CERTIFICATIONS & STANDARDS
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['AS9100D', 'ISO 9001:2015', 'NADCAP', 'DO-160G', 'MIL-STD-810', 'ITAR', 'FAR Part 21', 'EASA Part-21'].map((cert) => (
              <div key={cert} className="clip-corner-sm px-5 py-2.5 border border-accent-cyan/20 bg-steel-800/50">
                <span className="font-mono text-xs text-accent-silver/60 tracking-widest">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
