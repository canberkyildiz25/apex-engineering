export default function TechBadge({ label, value, unit, color = 'cyan' }) {
  const colors = {
    cyan:   { border: 'border-accent-cyan/30',   text: 'text-accent-cyan',   bg: 'bg-accent-cyan/5'   },
    orange: { border: 'border-accent-orange/30', text: 'text-accent-orange', bg: 'bg-accent-orange/5' },
    gold:   { border: 'border-accent-gold/30',   text: 'text-accent-gold',   bg: 'bg-accent-gold/5'   },
  }
  const c = colors[color] || colors.cyan

  return (
    <div className={`clip-corner-sm p-3 border ${c.border} ${c.bg}`}>
      <div className="font-mono text-[9px] text-accent-silver/40 tracking-widest mb-1">{label}</div>
      <div className={`font-mono text-lg font-500 ${c.text} leading-none tech-number`}>
        {value}
        {unit && <span className="text-xs ml-1 opacity-60">{unit}</span>}
      </div>
    </div>
  )
}
