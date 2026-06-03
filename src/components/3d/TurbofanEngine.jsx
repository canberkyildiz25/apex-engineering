import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

// ── Fan blade ──────────────────────────────────────────────────────────────────
function FanBlade() {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.bezierCurveTo(0.08, 0.28, 0.22, 0.58, 0.15, 1.08)
    s.bezierCurveTo(0.07, 1.38, -0.07, 1.38, -0.15, 1.08)
    s.bezierCurveTo(-0.22, 0.58, -0.08, 0.28, 0, 0)
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 4,
  }), [])

  return (
    <mesh castShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#b4c8dc" metalness={0.88} roughness={0.14} envMapIntensity={2.5} />
    </mesh>
  )
}

// ── Fan disc ───────────────────────────────────────────────────────────────────
function FanDisc({ explode, offset }) {
  const { posZ } = useSpring({
    posZ: explode ? offset : 0,
    config: { mass: 1, tension: 100, friction: 18 },
  })
  const BLADES = 22
  return (
    <animated.group position-z={posZ}>
      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.14, 32]} />
        <meshStandardMaterial color="#8898aa" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Blades */}
      {Array.from({ length: BLADES }).map((_, i) => (
        <group key={i} rotation-z={(i / BLADES) * Math.PI * 2}>
          <group position={[0, 0.22, 0]}>
            <FanBlade />
          </group>
        </group>
      ))}
      {/* Blade tip shroud ring */}
      <mesh>
        <torusGeometry args={[1.28, 0.022, 10, 80]} />
        <meshStandardMaterial color="#98aabc" metalness={0.9} roughness={0.12} />
      </mesh>
    </animated.group>
  )
}

// ── Spinner (nose cone) — CFM56-style pointed centre cone ─────────────────────
function Spinner({ explode }) {
  const { posZ } = useSpring({
    posZ: explode ? -2.28 : -1.72,
    config: { mass: 1, tension: 120, friction: 20 },
  })
  return (
    <animated.group position-z={posZ}>
      {/* Tip points in local -Z (intake direction): rotation-x = -PI/2 flips cone +Y → -Z */}
      <mesh rotation-x={-Math.PI / 2} castShadow>
        <coneGeometry args={[0.22, 0.6, 32]} />
        <meshStandardMaterial color="#d8eaf8" metalness={0.65} roughness={0.22} />
      </mesh>
    </animated.group>
  )
}

// ── Inlet lip — rounded nacelle leading edge ───────────────────────────────────
function InletLip({ explode }) {
  const { posZ } = useSpring({
    posZ: explode ? -2.52 : -1.9,
    config: { mass: 1, tension: 100, friction: 18 },
  })
  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <torusGeometry args={[1.4, 0.065, 20, 80]} />
        <meshStandardMaterial color="#9ab0c8" metalness={0.88} roughness={0.14} />
      </mesh>
    </animated.group>
  )
}

// ── Compressor stage ───────────────────────────────────────────────────────────
function CompressorStage({ radius, zPos, explode, offset, index }) {
  const VANES = 32
  const { posZ } = useSpring({
    posZ: explode ? zPos + offset : zPos,
    config: { mass: 1, tension: 90, friction: 16, delay: index * 40 },
  })

  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius * 0.93, 0.09, 48]} />
        <meshStandardMaterial color="#8898a8" metalness={0.94} roughness={0.1} />
      </mesh>
      {Array.from({ length: VANES }).map((_, i) => {
        const angle = (i / VANES) * Math.PI * 2
        const x = Math.cos(angle) * (radius * 0.65)
        const y = Math.sin(angle) * (radius * 0.65)
        return (
          <mesh key={i} position={[x, y, 0]} rotation-z={angle + 0.4} castShadow>
            <boxGeometry args={[radius * 0.3, 0.016, 0.065]} />
            <meshStandardMaterial color="#9aaab8" metalness={0.96} roughness={0.07} />
          </mesh>
        )
      })}
    </animated.group>
  )
}

// ── Combustion chamber ─────────────────────────────────────────────────────────
function CombustionChamber({ explode }) {
  const { posZ } = useSpring({
    posZ: explode ? 0.5 : 0,
    config: { mass: 1, tension: 80, friction: 18 },
  })
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = explode ? 2.5 + Math.sin(clock.elapsedTime * 8) * 1.0 : 0
    }
  })

  return (
    <animated.group position-z={posZ}>
      {/* Outer casing */}
      <mesh>
        <cylinderGeometry args={[0.66, 0.69, 0.62, 32, 1, true]} />
        <meshStandardMaterial color="#60707a" metalness={0.93} roughness={0.14} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner liner — glows on explode */}
      <mesh>
        <cylinderGeometry args={[0.51, 0.53, 0.57, 32, 1, true]} />
        <meshStandardMaterial
          color="#ff4800"
          metalness={0.3}
          roughness={0.6}
          emissive="#ff2500"
          emissiveIntensity={explode ? 1.2 : 0.05}
        />
      </mesh>
      <pointLight ref={lightRef} color="#ff6600" intensity={0} distance={3} />
      {/* Fuel injectors */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.59, Math.sin(angle) * 0.59, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.09, 8]} />
            <meshStandardMaterial color="#788898" metalness={0.98} roughness={0.06} />
          </mesh>
        )
      })}
    </animated.group>
  )
}

// ── Turbine stage ──────────────────────────────────────────────────────────────
function TurbineStage({ zPos, explode, offset, index }) {
  const BLADES = 60
  const { posZ } = useSpring({
    posZ: explode ? zPos + offset : zPos,
    config: { mass: 1, tension: 85, friction: 15, delay: index * 50 },
  })

  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <cylinderGeometry args={[0.7, 0.65, 0.065, 48]} />
        <meshStandardMaterial
          color="#8a7060"
          metalness={0.9}
          roughness={0.18}
          emissive="#aa4400"
          emissiveIntensity={0.18}
        />
      </mesh>
      {Array.from({ length: BLADES }).map((_, i) => {
        const angle = (i / BLADES) * Math.PI * 2
        const x = Math.cos(angle) * 0.45
        const y = Math.sin(angle) * 0.45
        return (
          <mesh key={i} position={[x, y, 0]} rotation-z={angle + 0.8} castShadow>
            <boxGeometry args={[0.2, 0.013, 0.055]} />
            <meshStandardMaterial
              color="#c08860"
              metalness={0.93}
              roughness={0.12}
              emissive="#ff4400"
              emissiveIntensity={0.14}
            />
          </mesh>
        )
      })}
      <mesh>
        <torusGeometry args={[0.68, 0.022, 8, 60]} />
        <meshStandardMaterial color="#7a6850" metalness={0.88} roughness={0.22} />
      </mesh>
    </animated.group>
  )
}

// ── Core cowl — inner cylinder separating bypass duct from core ────────────────
function CoreCowl({ explode }) {
  const { opacity } = useSpring({
    opacity: explode ? 0.2 : 0.85,
    config: { mass: 1, tension: 60, friction: 20 },
  })
  return (
    <group position-z={0.38}>
      <animated.mesh>
        {/* Covers combustor + turbine section (z ~-0.25 to ~1.0) */}
        <cylinderGeometry args={[0.76, 0.76, 1.26, 48, 1, true]} />
        <animated.meshStandardMaterial
          color="#6a7a8a"
          metalness={0.9}
          roughness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
        />
      </animated.mesh>
      {/* Forward ring */}
      <mesh position-z={-0.63}>
        <torusGeometry args={[0.76, 0.038, 12, 64]} />
        <meshStandardMaterial color="#7a8898" metalness={0.88} roughness={0.16} />
      </mesh>
      {/* Aft ring */}
      <mesh position-z={0.63}>
        <torusGeometry args={[0.74, 0.035, 12, 64]} />
        <meshStandardMaterial color="#7a8898" metalness={0.88} roughness={0.16} />
      </mesh>
    </group>
  )
}

// ── Engine nacelle (outer casing) ──────────────────────────────────────────────
function EngineCasing({ explode }) {
  const { opacity } = useSpring({
    opacity: explode ? 0.15 : 0.88,
    config: { mass: 1, tension: 60, friction: 20 },
  })
  return (
    <animated.mesh>
      <cylinderGeometry args={[1.44, 1.36, 3.2, 64, 1, true]} />
      <animated.meshStandardMaterial
        color="#6a7a8a"
        metalness={0.9}
        roughness={0.2}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </animated.mesh>
  )
}

// ── Exhaust nozzle ─────────────────────────────────────────────────────────────
function ExhaustNozzle({ explode }) {
  const { posZ } = useSpring({
    posZ: explode ? 1.8 : 0,
    config: { mass: 1, tension: 80, friction: 18 },
  })
  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <cylinderGeometry args={[0.56, 0.72, 0.52, 32]} />
        <meshStandardMaterial color="#58686a" metalness={0.96} roughness={0.08} />
      </mesh>
      {/* Chevrons */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.63, Math.sin(angle) * 0.63, 0.22]}>
            <boxGeometry args={[0.065, 0.13, 0.04]} />
            <meshStandardMaterial color="#687888" metalness={0.93} roughness={0.12} />
          </mesh>
        )
      })}
    </animated.group>
  )
}

// ── Main TurbofanEngine component ──────────────────────────────────────────────
export default function TurbofanEngine({ exploded = false }) {
  const engineRef = useRef()
  const fanRef    = useRef()

  useFrame(({ clock }) => {
    if (engineRef.current) {
      engineRef.current.rotation.y = clock.elapsedTime * 0.1
    }
    if (fanRef.current) {
      fanRef.current.rotation.z = clock.elapsedTime * (exploded ? 0.5 : 2.5)
    }
  })

  const compressorStages = [
    { radius: 1.1,  zPos: -0.95, offset: -1.4  },
    { radius: 0.95, zPos: -0.75, offset: -1.0  },
    { radius: 0.82, zPos: -0.56, offset: -0.7  },
    { radius: 0.73, zPos: -0.38, offset: -0.4  },
    { radius: 0.68, zPos: -0.20, offset: -0.15 },
  ]

  const turbineStages = [
    { zPos: 0.30, offset: 0.3  },
    { zPos: 0.50, offset: 0.55 },
    { zPos: 0.70, offset: 0.85 },
  ]

  return (
    <>
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
        autoRotate={!exploded}
        autoRotateSpeed={0.4}
      />

      <Environment preset="studio" />

      {/* Brightened lighting — was causing near-invisible geometry */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]}    intensity={2.2} color="#ffffff" castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.9} color="#c0d8ff" />
      <directionalLight position={[0, -8, 3]}   intensity={0.7} color="#ffffff" />
      <pointLight       position={[0, 3, 0]}     intensity={1.2} color="#00d4ff" distance={8} />

      <group ref={engineRef} rotation-x={Math.PI / 2}>
        {/* Outer nacelle */}
        <EngineCasing explode={exploded} />

        {/* Nacelle inlet lip — rounded leading edge */}
        <InletLip explode={exploded} />

        {/* Spinner — nose cone at fan centre */}
        <Spinner explode={exploded} />

        {/* Fan disc + blades */}
        <group ref={fanRef} position-z={-1.4} scale={[1.28, 1.28, 1]}>
          <FanDisc explode={exploded} offset={-1.8} />
        </group>

        {/* HPC stages */}
        {compressorStages.map((stage, i) => (
          <CompressorStage key={i} {...stage} explode={exploded} index={i} />
        ))}

        {/* Combustion chamber */}
        <CombustionChamber explode={exploded} />

        {/* Core cowl — wraps combustor + turbine */}
        <CoreCowl explode={exploded} />

        {/* Turbine stages */}
        {turbineStages.map((stage, i) => (
          <TurbineStage key={i} {...stage} explode={exploded} index={i} />
        ))}

        {/* Exhaust nozzle + chevrons */}
        <ExhaustNozzle explode={exploded} />

        {/* Structural pylons */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 1.38, Math.sin(angle) * 1.38, 0]} rotation-z={angle}>
            <boxGeometry args={[0.04, 0.08, 3.0]} />
            <meshStandardMaterial color="#788898" metalness={0.93} roughness={0.14} />
          </mesh>
        ))}
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.3} intensity={1.0} />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
        <Vignette eskil={false} offset={0.3} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
