import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-accent-cyan/10 bg-steel-950 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint bg-grid-80 opacity-10" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display font-800 text-3xl tracking-[0.2em] text-white mb-1">APEX</div>
            <div className="font-mono text-xs text-accent-cyan/50 tracking-[0.3em] mb-6">ENGINEERING SYSTEMS</div>
            <p className="text-accent-silver/50 text-sm leading-relaxed max-w-sm">
              Precision engineering solutions for aerospace, defense, and automotive industries.
              ISO 9001:2015 certified. 10+ years of excellence.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs text-green-400/70">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="font-mono text-[10px] text-accent-cyan/50 tracking-[0.2em] mb-4">NAVIGATION</div>
            <ul className="space-y-2">
              {[
                { to: '/',         label: 'Home' },
                { to: '/about',    label: 'About Us' },
                { to: '/products', label: 'Products' },
                { to: '/projects', label: 'Projects' },
                { to: '/contact',  label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-accent-silver/50 hover:text-accent-cyan text-sm transition-colors font-sans"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-mono text-[10px] text-accent-cyan/50 tracking-[0.2em] mb-4">CONTACT</div>
            <ul className="space-y-3">
              {[
                { label: 'Engineering HQ', value: 'Istanbul, TR' },
                { label: 'Phone', value: '+90 212 000 0000' },
                { label: 'Email', value: 'info@apex-eng.com' },
              ].map(({ label, value }) => (
                <li key={label}>
                  <div className="font-mono text-[10px] text-accent-cyan/40 mb-0.5">{label}</div>
                  <div className="text-sm text-accent-silver/60">{value}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-accent-cyan/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-accent-silver/30">
            © {year} APEX Engineering Systems. All rights reserved.
          </div>
          <div className="font-mono text-xs text-accent-cyan/30 tracking-widest">
            REV.{year}.1 // ISO-9001:2015 // AS9100D
          </div>
        </div>
      </div>
    </footer>
  )
}
