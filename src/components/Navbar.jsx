import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/',         label: 'HOME',     code: '01' },
  { to: '/about',    label: 'ABOUT',    code: '02' },
  { to: '/products', label: 'PRODUCTS', code: '03' },
  { to: '/projects', label: 'PROJECTS', code: '04' },
  { to: '/contact',  label: 'CONTACT',  code: '05' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const location                = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-steel-950/95 backdrop-blur-xl border-b border-accent-cyan/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="13" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="5" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
                <line x1="16" y1="3"  x2="16" y2="11" stroke="#00d4ff" strokeWidth="1.5" />
                <line x1="16" y1="21" x2="16" y2="29" stroke="#00d4ff" strokeWidth="1.5" />
                <line x1="3"  y1="16" x2="11" y2="16" stroke="#00d4ff" strokeWidth="1.5" />
                <line x1="21" y1="16" x2="29" y2="16" stroke="#00d4ff" strokeWidth="1.5" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-accent-cyan/10 group-hover:bg-accent-cyan/20 transition-colors" />
            </div>
            <div>
              <div className="font-display font-800 text-xl tracking-[0.2em] text-white leading-none">
                APEX
              </div>
              <div className="font-mono text-[9px] text-accent-cyan/60 tracking-[0.3em] leading-none mt-0.5">
                ENGINEERING
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(({ to, label, code }) => (
              <Link
                key={to}
                to={to}
                className="relative group flex items-center gap-2"
              >
                <span className="font-mono text-[10px] text-accent-cyan/40 group-hover:text-accent-cyan/70 transition-colors">
                  {code}
                </span>
                <span className={`font-display font-500 text-sm tracking-[0.12em] transition-colors ${
                  location.pathname === to ? 'text-accent-cyan' : 'text-accent-silver/70 group-hover:text-white'
                }`}>
                  {label}
                </span>
                {location.pathname === to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent-cyan"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="font-mono text-[10px] text-accent-cyan/40 tracking-widest">
              SYS://ONLINE
            </div>
            <Link
              to="/contact"
              className="clip-corner-sm px-5 py-2 bg-accent-cyan/10 border border-accent-cyan/30 hover:bg-accent-cyan/20 hover:border-accent-cyan/60 transition-all font-display font-600 text-sm tracking-[0.1em] text-accent-cyan"
            >
              GET QUOTE
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={open
                  ? i === 1 ? { opacity: 0 } : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 7 : -7 }
                  : { rotate: 0, y: 0, opacity: 1 }
                }
                className="w-6 h-px bg-accent-cyan"
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-steel-950/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            <div className="absolute inset-0 bg-blueprint bg-grid-80 opacity-20" />
            {links.map(({ to, label, code }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={to}
                  className="flex items-center gap-4 group"
                >
                  <span className="font-mono text-xs text-accent-cyan/40">{code}</span>
                  <span className="font-display font-700 text-4xl tracking-[0.15em] text-white group-hover:text-accent-cyan transition-colors">
                    {label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
