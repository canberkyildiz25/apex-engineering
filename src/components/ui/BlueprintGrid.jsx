export default function BlueprintGrid({ className = '', opacity = 0.15 }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Coarse grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px',
        }}
      />
      {/* Corner marks */}
      {[
        'top-4 left-4',
        'top-4 right-4',
        'bottom-4 left-4',
        'bottom-4 right-4',
      ].map((pos) => (
        <div key={pos} className={`absolute ${pos} w-6 h-6`}>
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
            <polyline points="0,12 0,0 12,0"       stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />
          </svg>
        </div>
      ))}
    </div>
  )
}
