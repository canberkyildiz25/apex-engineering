import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const CRANK_R    = 0.32
const ROD_LEN    = 1.0
const SPACING    = 0.72
const BANK_ANGLE = Math.PI / 6  // 30° → 60° V total

// ── Single cylinder unit (works in local bank space) ──────────────────────────
function CylinderUnit({ index, crankAngleOffset }) {
  const pistonRef       = useRef()
  const conrodRef       = useRef()
  const crankpinRef     = useRef()
  const sparkLightRef   = useRef()
  const flameRef        = useRef()

  const xPos = (index - 1) * SPACING   // 3 cylinders per bank centred at 0

  useFrame(({ clock }) => {
    const t     = clock.elapsedTime * 3.5
    const angle = t + crankAngleOffset
    const cx    = Math.sin(angle) * CRANK_R
    const cy    = Math.cos(angle) * CRANK_R
    const py    = cy + Math.sqrt(ROD_LEN * ROD_LEN - cx * cx)

    if (pistonRef.current)   pistonRef.current.position.y   = py
    if (crankpinRef.current) { crankpinRef.current.position.x = cx; crankpinRef.current.position.y = cy }
    if (conrodRef.current) {
      const dx = -cx, dy = py - cy
      conrodRef.current.position.set(cx / 2, (cy + py) / 2, 0)
      conrodRef.current.rotation.z = Math.atan2(dx, dy)
      conrodRef.current.scale.y    = Math.sqrt(dx * dx + dy * dy) / 1.05
    }
    const isPower = Math.sin(angle) > 0.82
    if (sparkLightRef.current)  sparkLightRef.current.intensity   = isPower ? 1.8 : 0
    if (flameRef.current?.material) {
      flameRef.current.material.emissiveIntensity = isPower ? 1.4 : 0
      flameRef.current.material.opacity           = isPower ? 0.75 : 0
    }
  })

  return (
    <group position-x={xPos}>
      {/* Cylinder block */}
      <mesh position-y={0.62} castShadow>
        <cylinderGeometry args={[0.24, 0.26, 1.1, 24]} />
        <meshStandardMaterial color="#788898" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Cylinder liner */}
      <mesh position-y={0.62}>
        <cylinderGeometry args={[0.19, 0.19, 1.0, 24, 1, true]} />
        <meshStandardMaterial color="#5a6a78" metalness={0.9} roughness={0.15} side={THREE.BackSide} />
      </mesh>
      {/* Cylinder head */}
      <mesh position-y={1.24} castShadow>
        <cylinderGeometry args={[0.28, 0.26, 0.14, 24]} />
        <meshStandardMaterial color="#8898a8" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Spark plug */}
      <mesh position={[0, 1.31, 0.16]}>
        <cylinderGeometry args={[0.022, 0.018, 0.1, 8]} />
        <meshStandardMaterial color="#c8a951" metalness={0.99} roughness={0.03} emissive="#c8a951" emissiveIntensity={0.2} />
      </mesh>
      <pointLight ref={sparkLightRef} position={[0, 1.28, 0.16]} color="#ffdd00" intensity={0} distance={0.5} />

      {/* Piston */}
      <group ref={pistonRef} position-y={0.35}>
        <mesh castShadow>
          <cylinderGeometry args={[0.185, 0.185, 0.22, 24]} />
          <meshStandardMaterial color="#7a8a9a" metalness={0.88} roughness={0.14} />
        </mesh>
        {[-0.065, 0, 0.065].map((dy, i) => (
          <mesh key={i} position-y={dy}>
            <torusGeometry args={[0.185, 0.008, 6, 24]} />
            <meshStandardMaterial color="#c8a951" metalness={0.99} roughness={0.02} />
          </mesh>
        ))}
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          <meshStandardMaterial color="#9aa8b4" metalness={0.96} roughness={0.06} />
        </mesh>
      </group>

      {/* Connecting rod */}
      <mesh ref={conrodRef} castShadow>
        <cylinderGeometry args={[0.028, 0.022, 1.05, 8]} />
        <meshStandardMaterial color="#8898a4" metalness={0.88} roughness={0.12} />
      </mesh>

      {/* Crankpin — cyan accent */}
      <mesh ref={crankpinRef} castShadow>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.99} roughness={0.02} emissive="#00d4ff" emissiveIntensity={0.4} />
      </mesh>

      {/* Combustion flash */}
      <mesh ref={flameRef} position-y={1.15}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0} transparent opacity={0} />
      </mesh>
    </group>
  )
}

// ── Valve cover for one bank (spans 3 cylinders) ──────────────────────────────
function ValveCover() {
  const w = 2 * SPACING + 0.55
  return (
    <group position-y={1.42}>
      <mesh castShadow>
        <boxGeometry args={[w, 0.12, 0.55]} />
        <meshStandardMaterial color="#6a7a88" metalness={0.82} roughness={0.25} />
      </mesh>
      {/* Brand/rib detail */}
      {[-SPACING, 0, SPACING].map((x, i) => (
        <mesh key={i} position={[x, 0.07, 0]}>
          <boxGeometry args={[0.38, 0.04, 0.48]} />
          <meshStandardMaterial color="#7a8898" metalness={0.8} roughness={0.28} />
        </mesh>
      ))}
    </group>
  )
}

// ── One complete bank of 3 cylinders ─────────────────────────────────────────
function CylinderBank({ bankAngle, offsets }) {
  return (
    <group rotation-z={bankAngle}>
      {offsets.map((off, i) => (
        <CylinderUnit key={i} index={i} crankAngleOffset={off} />
      ))}
      <ValveCover />
    </group>
  )
}

// ── Intake plenum — sits in the V valley between banks ────────────────────────
// Banks now rotate around Z, so heads are at approx (±0.61, 1.06) in world XY.
// Plenum lives at y≈0.85 between the two banks.
function IntakePlenum() {
  const w = 2 * SPACING + 0.3
  return (
    <group position-y={0.85}>
      {/* Main plenum body — horizontal cylinder along X */}
      <mesh rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.2, 0.2, w, 16]} />
        <meshStandardMaterial color="#9aacbc" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* End caps */}
      {[-w / 2, w / 2].map((x, i) => (
        <mesh key={i} position-x={x} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#8898a8" metalness={0.82} roughness={0.25} />
        </mesh>
      ))}
      {/* Runners — left bank (upper-left, rotation-z = -30° from plenum) */}
      {[-SPACING, 0, SPACING].map((x, i) => (
        <group key={i} position-x={x}>
          <mesh position={[-0.16, 0.12, 0]} rotation-z={-0.55} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.38, 10]} />
            <meshStandardMaterial color="#8898a8" metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0.16, 0.12, 0]} rotation-z={0.55} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.38, 10]} />
            <meshStandardMaterial color="#8898a8" metalness={0.82} roughness={0.22} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Crankshaft with journals + counterweights ─────────────────────────────────
function Crankshaft() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 3.5
  })
  const THROWS = 3
  const throwOffsets = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]

  return (
    <group ref={ref} position-y={-0.32}>
      {/* Main shaft */}
      <mesh rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.045, 0.045, THROWS * SPACING + 0.35, 16]} />
        <meshStandardMaterial color="#7a8898" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Main bearing journals (4 for 3-throw crank) */}
      {Array.from({ length: THROWS + 1 }).map((_, i) => (
        <mesh key={i} position-x={(i - THROWS / 2) * SPACING} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.068, 0.068, 0.12, 16]} />
          <meshStandardMaterial color="#9aaab8" metalness={0.96} roughness={0.06} />
        </mesh>
      ))}
      {/* Crankpin throws + counterweights */}
      {throwOffsets.map((throwAngle, i) => {
        const x = (i - 1) * SPACING
        const cwAngle = throwAngle + Math.PI  // counterweight opposite throw
        return (
          <group key={i} position-x={x} rotation-z={throwAngle}>
            {/* Crankpin */}
            <mesh position-y={CRANK_R} rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
              <meshStandardMaterial color="#9aaab8" metalness={0.95} roughness={0.06} />
            </mesh>
            {/* Throw webs */}
            {[-0.1, 0.1].map((dx, j) => (
              <mesh key={j} position={[dx, CRANK_R / 2, 0]} castShadow>
                <boxGeometry args={[0.08, CRANK_R, 0.28]} />
                <meshStandardMaterial color="#8898a4" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
            {/* Counterweight */}
            <group rotation-z={Math.PI}>
              <mesh position-y={CRANK_R * 0.7} castShadow>
                <boxGeometry args={[0.28, CRANK_R * 0.9, 0.32]} />
                <meshStandardMaterial color="#6a7a88" metalness={0.88} roughness={0.14} />
              </mesh>
            </group>
          </group>
        )
      })}
    </group>
  )
}

// ── Oil pan ───────────────────────────────────────────────────────────────────
function OilPan() {
  const w = 3 * SPACING + 0.3
  return (
    <mesh position-y={-0.76} castShadow>
      <boxGeometry args={[w, 0.24, 0.6]} />
      <meshStandardMaterial color="#4a5a68" metalness={0.88} roughness={0.22} />
    </mesh>
  )
}

// ── Timing cover (front face) ─────────────────────────────────────────────────
function TimingCover() {
  const w = 3 * SPACING + 0.3
  return (
    <group position-x={w / 2 + 0.06}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 1.8, 0.62]} />
        <meshStandardMaterial color="#8898a8" metalness={0.85} roughness={0.22} />
      </mesh>
    </group>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PistonEngine() {
  // 60° V6: left bank +30°, right bank -30° (around engine X-axis)
  // Firing order 1-5-3-6-2-4 → crank throws 120° apart
  const leftOffsets  = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]
  const rightOffsets = [Math.PI / 3, Math.PI, (5 * Math.PI) / 3]

  return (
    <>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={12} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="warehouse" />

      <ambientLight intensity={1.0} />
      <directionalLight position={[4, 6, 4]}    intensity={2.5} color="#ffffff" castShadow />
      <directionalLight position={[-4, 4, 2]}   intensity={1.2} color="#b0ccff" />
      <directionalLight position={[0, -4, -3]}  intensity={0.5} color="#ffffff" />
      <pointLight       position={[0, 2, 0]}    intensity={1.8} color="#00d4ff" distance={8} />
      <pointLight       position={[0, -1, 1]}   intensity={0.8} color="#ff6600" distance={5} />

      <group position-y={0.1}>
        {/* Left bank — tilted +30° (Z-forward tilt) */}
        <CylinderBank bankAngle={BANK_ANGLE}  offsets={leftOffsets}  />
        {/* Right bank — tilted -30° */}
        <CylinderBank bankAngle={-BANK_ANGLE} offsets={rightOffsets} />

        {/* Intake plenum in V valley */}
        <IntakePlenum />

        {/* Crankshaft at bottom of V */}
        <Crankshaft />

        {/* Oil pan */}
        <OilPan />

        {/* Engine block deck (base of V) */}
        <mesh position-y={0} castShadow>
          <boxGeometry args={[3 * SPACING + 0.35, 0.12, 0.65]} />
          <meshStandardMaterial color="#6a7a88" metalness={0.88} roughness={0.18} />
        </mesh>

        {/* Timing cover */}
        <TimingCover />
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.3} intensity={1.0} />
        <Vignette eskil={false} offset={0.25} darkness={0.65} />
      </EffectComposer>
    </>
  )
}
