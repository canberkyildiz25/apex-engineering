import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import BlueprintGrid from '../components/ui/BlueprintGrid'
import SectionHeader from '../components/ui/SectionHeader'

const SERVICES = [
  'Propulsion System Design',
  'Structural Analysis (FEA)',
  'Powertrain Engineering',
  'CFD / Aerodynamics',
  'Certification Support',
  'Manufacturing Consulting',
  'Digital Twin / Simulation',
  'Other',
]

const FORMSPREE_ENDPOINT = 'https://formsubmit.co/ajax/canberkyildiz1@gmail.com'

function validate(form) {
  const errors = {}
  if (!form.name.trim())    errors.name    = 'Name is required'
  if (!form.email.trim())   errors.email   = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Invalid email address'
  if (!form.message.trim()) errors.message = 'Project brief is required'
  return errors
}

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', company: '', service: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [focused, setFocused] = useState(null)
  const [status, setStatus]   = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          company:  form.company || '—',
          service:  form.service || 'Not specified',
          message:  form.message,
          _subject: `APEX Engineering Inquiry — ${form.service || 'General'}`,
        }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const Field = ({ id, label, type = 'text', placeholder, as: As = 'input', required }) => (
    <div className="relative">
      <label className="font-mono text-[9px] text-accent-cyan/50 tracking-widest block mb-2">
        {label}
      </label>
      <div className={`relative border transition-all ${
        errors[id]
          ? 'border-red-500/60'
          : focused === id
          ? 'border-accent-cyan/60'
          : 'border-accent-cyan/15'
      }`}>
        {As === 'input' ? (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={form[id]}
            onChange={(e) => { setForm({ ...form, [id]: e.target.value }); setErrors({ ...errors, [id]: '' }) }}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused(null)}
            className="w-full bg-steel-900/50 px-4 py-3 text-sm text-white placeholder-accent-silver/20 font-sans outline-none"
          />
        ) : (
          <textarea
            id={id}
            rows={5}
            placeholder={placeholder}
            value={form[id]}
            onChange={(e) => { setForm({ ...form, [id]: e.target.value }); setErrors({ ...errors, [id]: '' }) }}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused(null)}
            className="w-full bg-steel-900/50 px-4 py-3 text-sm text-white placeholder-accent-silver/20 font-sans outline-none resize-none"
          />
        )}
        {focused === id && !errors[id] && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-cyan pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-cyan pointer-events-none" />
          </>
        )}
      </div>
      {errors[id] && (
        <p className="font-mono text-[9px] text-red-400/80 mt-1 tracking-wider">{errors[id]}</p>
      )}
    </div>
  )

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 border-b border-accent-cyan/10 overflow-hidden">
        <BlueprintGrid opacity={0.08} />
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="GET IN TOUCH"
            title="START YOUR<br/><span class='text-gradient-cyan'>MISSION</span>"
            subtitle="Our engineering team reviews all inquiries within 24 hours. For classified projects, all communications are handled under NDA."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="panel clip-corner p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full border border-accent-cyan/50 bg-accent-cyan/10 flex items-center justify-center mx-auto mb-6">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="font-mono text-[10px] text-accent-cyan/50 tracking-widest mb-3">TRANSMISSION RECEIVED</div>
                <h3 className="font-display font-700 text-2xl mb-3">Message Sent Successfully</h3>
                <p className="text-accent-silver/50 text-sm">Our engineering team will review your inquiry and respond within 24 hours.</p>
                <div className="mt-6 font-mono text-xs text-accent-silver/30">
                  REF: APEX-{Date.now().toString().slice(-8)}
                </div>
                <button
                  onClick={() => { setStatus('idle'); setForm({ name: '', email: '', company: '', service: '', message: '' }) }}
                  className="mt-8 clip-corner-sm px-6 py-2.5 border border-accent-cyan/30 text-accent-cyan font-mono text-xs tracking-widest hover:bg-accent-cyan/10 transition-all"
                >
                  SEND ANOTHER
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-red-500/30 bg-red-500/5 font-mono text-xs text-red-400/80"
                  >
                    TRANSMISSION FAILED — Please check your connection and try again.
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field id="name"    label="FULL NAME *"     placeholder="Dr. John Smith"       required />
                  <Field id="email"   label="EMAIL ADDRESS *" placeholder="j.smith@company.com"  type="email" required />
                  <Field id="company" label="COMPANY / ORG"   placeholder="Aerospace Corp Ltd" />

                  {/* Service selector */}
                  <div>
                    <label className="font-mono text-[9px] text-accent-cyan/50 tracking-widest block mb-2">
                      SERVICE REQUIRED
                    </label>
                    <div className={`border transition-all ${focused === 'service' ? 'border-accent-cyan/60' : 'border-accent-cyan/15'}`}>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        onFocus={() => setFocused('service')}
                        onBlur={() => setFocused(null)}
                        className="w-full bg-steel-900/50 px-4 py-3 text-sm text-white font-sans outline-none appearance-none"
                      >
                        <option value="" className="bg-steel-950">Select a service...</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s} className="bg-steel-950">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <Field
                  id="message"
                  label="PROJECT BRIEF *"
                  placeholder="Describe your project requirements, timeline, applicable standards, and any specific technical constraints..."
                  as="textarea"
                  required
                />

                {/* NDA note */}
                <div className="flex items-start gap-3 p-4 border border-accent-gold/20 bg-accent-gold/5">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full text-accent-gold">
                      <path d="M8 1l1.5 3H13l-2.5 2 1 3L8 7.5 4.5 9l1-3L3 4h3.5z" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                  <p className="font-mono text-[9px] text-accent-gold/60 leading-relaxed">
                    All inquiries are treated as strictly confidential. NDA available upon request before technical discussion.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full clip-corner py-4 bg-accent-cyan text-steel-950 font-display font-700 tracking-[0.2em] text-sm hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {status === 'sending' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-steel-950/40 border-t-steel-950 rounded-full"
                      />
                      TRANSMITTING...
                    </>
                  ) : (
                    'TRANSMIT INQUIRY'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info panels */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                label: 'HEADQUARTERS',
                lines: ['APEX Engineering Systems', 'Maslak, Istanbul 34398', 'Turkey'],
                icon: '📍',
              },
              {
                label: 'COMMUNICATIONS',
                lines: ['+90 212 000 0000', 'info@apex-engineering.com', 'secure@apex-engineering.com (PGP)'],
                icon: '📡',
              },
              {
                label: 'RESPONSE TIME',
                lines: ['Standard: < 24 hours', 'Technical: < 48 hours', 'Emergency: +90 555 000 0000'],
                icon: '⚡',
              },
            ].map(({ label, lines, icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="panel clip-corner p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{icon}</span>
                  <div className="font-mono text-[9px] text-accent-cyan/50 tracking-widest">{label}</div>
                </div>
                <div className="space-y-1.5">
                  {lines.map((line, i) => (
                    <div key={i} className={`text-sm ${i === 0 ? 'text-white font-500' : 'text-accent-silver/50'}`}>
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* System status */}
            <div className="panel clip-corner p-6 border-accent-cyan/20">
              <div className="font-mono text-[9px] text-accent-cyan/50 tracking-widest mb-4">SYSTEM STATUS</div>
              <div className="space-y-3">
                {[
                  { label: 'Engineering Team',  status: 'AVAILABLE',   ok: true },
                  { label: 'Test Facility',      status: 'OPERATIONAL', ok: true },
                  { label: 'NDA Processing',     status: 'ACTIVE',      ok: true },
                  { label: 'Secure Comms',       status: 'ONLINE',      ok: true },
                ].map(({ label, status, ok }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent-silver/50">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                      <span className={`font-mono text-[9px] ${ok ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
