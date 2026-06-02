import { Html, useProgress } from '@react-three/drei'

export default function ModelLoader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 120 }}>
        <div style={{
          width: 40,
          height: 40,
          border: '1px solid rgba(0,212,255,0.15)',
          borderTop: '1px solid #00d4ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <span style={{
          fontFamily: 'monospace',
          fontSize: 9,
          color: 'rgba(0,212,255,0.5)',
          letterSpacing: '0.3em',
          whiteSpace: 'nowrap',
        }}>
          LOADING {progress.toFixed(0)}%
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  )
}
