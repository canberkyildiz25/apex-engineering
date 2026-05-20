import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// ── Single cylinder + piston ──────────────────────────────────────────────────
function CylinderUnit({ index, total, crankAngleOffset }) {
  const pistonRef       = useRef()
  const conrodRef       = useRef()
  const crankpinRef     = useRef()
  const exhaustFlameRef = useRef()

  const spacing = 0.72
  const xPos    = (index - (total - 1) / 2) * spacing

  useFrame(({ clock }) => {
    const t     = clock.elapsedTime * 3.5
    const angle = t + crankAngleOffset
    const crank = 0.32
    const rod   = 1.0

    // Crank pin position
    const crankX = Math.sin(angle) * crank
    const crankY = Math.cos(angle) * crank

    // Piston position via slider-crank
    const pistonY = crankY + Math.sqrt(rod * rod - crankX * crankX)

    if (pistonRef.current)   pistonRef.current.position.y   = pistonY + 0.0
    if (crankpinRef.current) {
      crankpinRef.current.position.x = crankX
      crankpinRef.current.position.y = crankY
    }
    if (conrodRef.current) {
      const dy   = pistonY - crankY
      const dx   = 0 - crankX
      const rl   = Math.sqrt(dx * dx + dy * dy)
      const midX = (crankX + 0) / 2
      const midY = (crankY + pistonY) / 2
      conrodRef.current.position.x    = midX
      conrodRef.current.position.y    = midY
      conrodRef.current.rotation.z    = Math.atan2(dx, dy)
      conrodRef.current.scale.y       = rl / 1.05
    }
    if (exhaustFlameRef.current && exhaustFlameRef.current.material) {
      const isPower = Math.sin(angle) > 0.8
      exhaustFlameRef.current.material.emissiveIntensity = isPower ? 1.5 : 0
      exhaustFlameRef.current.material.opacity           = isPower ? 0.8 : 0
    }
  })

  return (
    <group position-x={xPos}>
      {/* Cylinder block */}
      <mesh position-y={0.6} castShadow>
        <cylinderGeometry args={[0.24, 0.26, 1.1, 24]} />
        <meshStandardMaterial color="#0d1a25" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Cylinder liner (inner) */}
      <mesh position-y={0.6}>
        <cylinderGeometry args={[0.19, 0.19, 1.0, 24, 1, true]} />
        <meshStandardMaterial color="#162535" metalness={0.98} roughness={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Cylinder head */}
      <mesh position-y={1.22} castShadow>
        <cylinderGeometry args={[0.28, 0.26, 0.14, 24]} />
        <meshStandardMaterial color="#0a1520" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* Spark plug */}
      <mesh position={[0, 1.3, 0.16]}>
        <cylinderGeometry args={[0.022, 0.018, 0.1, 8]} />
        <meshStandardMaterial color="#c8a951" metalness={0.99} roughness={0.03} />
      </mesh>
      {/* Spark plug glow */}
      <pointLight position={[0, 1.28, 0.16]} color="#ffdd00" intensity={0} distance={0.4} ref={exhaustFlameRef} />

      {/* Piston */}
      <group ref={pistonRef} position-y={0.35}>
        <mesh castShadow>
          <cylinderGeometry args={[0.185, 0.185, 0.22, 24]} />
          <meshStandardMaterial color="#1a2e40" metalness={0.97} roughness={0.06} />
        </mesh>
        {/* Piston rings */}
        {[-0.06, 0, 0.06].map((dy, i) => (
          <mesh key={i} position-y={dy}>
            <torusGeometry args={[0.185, 0.008, 6, 24]} />
            <meshStandardMaterial color="#c8a951" metalness={0.99} roughness={0.02} />
          </mesh>
        ))}
        {/* Piston pin */}
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          <meshStandardMaterial color="#0d1f2d" metalness={0.98} roughness={0.04} />
        </mesh>
      </group>

      {/* Connecting rod */}
      <mesh ref={conrodRef} castShadow>
        <cylinderGeometry args={[0.028, 0.022, 1.05, 8]} />
        <meshStandardMaterial color="#162030" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* Crankpin */}
      <mesh ref={crankpinRef} castShadow>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.99} roughness={0.02} emissive="#00d4ff" emissiveIntensity={0.3} />
      </mesh>

      {/* Exhaust flame (power stroke indicator) */}
      <mesh ref={exhaustFlameRef} position-y={1.15}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff2200"
          emissiveIntensity={0}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  )
}

// ── Crankshaft ────────────────────────────────────────────────────────────────
function Crankshaft({ cylinders }) {
  const shaftRef = useRef()
  useFrame(({ clock }) => {
    if (shaftRef.current) shaftRef.current.rotation.z = clock.elapsedTime * 3.5
  })

  return (
    <group ref={shaftRef} position-y={-0.32}>
      {/* Main shaft */}
      <mesh rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.045, 0.045, cylinders * 0.72 + 0.2, 16]} />
        <meshStandardMaterial color="#0d1a25" metalness={0.97} roughness={0.06} />
      </mesh>
      {/* Main journals */}
      {Array.from({ length: cylinders + 1 }).map((_, i) => (
        <mesh
          key={i}
          position-x={(i - cylinders / 2) * 0.72}
          rotation-z={Math.PI / 2}
          castShadow
        >
          <cylinderGeometry args={[0.065, 0.065, 0.1, 16]} />
          <meshStandardMaterial color="#1a3040" metalness={0.98} roughness={0.04} />
        </mesh>
      ))}
    </group>
  )
}

// ── Oil pan ───────────────────────────────────────────────────────────────────
function OilPan({ cylinders }) {
  const w = cylinders * 0.72 + 0.3
  return (
    <mesh position-y={-0.72} castShadow>
      <boxGeometry args={[w, 0.22, 0.52]} />
      <meshStandardMaterial color="#080f18" metalness={0.9} roughness={0.2} />
    </mesh>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PistonEngine({ cylinders = 6 }) {
  const FIRING_OFFSETS = {
    4: [0, Math.PI, Math.PI / 2, (3 * Math.PI) / 2],
    6: [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3, Math.PI / 3, Math.PI, (5 * Math.PI) / 3],
    8: [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4],
  }
  const offsets = FIRING_OFFSETS[cylinders] || FIRING_OFFSETS[6]

  return (
    <>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={12} enableDamping dampingFactor={0.05} />
      <Environment preset="warehouse" />

      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]}   intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-4, -3, -4]} intensity={0.3} color="#003355" />
      <pointLight       position={[0, 2, 0]}    intensity={1.0} color="#00d4ff" distance={6} />
      <pointLight       position={[0, -1, 1]}   intensity={0.5} color="#ff4400" distance={4} />

      <group position-y={0.2}>
        {Array.from({ length: cylinders }).map((_, i) => (
          <CylinderUnit
            key={i}
            index={i}
            total={cylinders}
            crankAngleOffset={offsets[i] || 0}
          />
        ))}
        <Crankshaft cylinders={cylinders} />
        <OilPan cylinders={cylinders} />

        {/* Engine block base */}
        <mesh position-y={0} castShadow>
          <boxGeometry args={[cylinders * 0.72 + 0.35, 0.12, 0.58]} />
          <meshStandardMaterial color="#0a1520" metalness={0.95} roughness={0.12} />
        </mesh>
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.3} intensity={1.2} />
        <Vignette eskil={false} offset={0.25} darkness={0.65} />
      </EffectComposer>
    </>
  )
}
