import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

// ── Fan blade (single) ──────────────────────────────────────────────────────
function FanBlade({ angle, explode }) {
  const { pos } = useSpring({
    pos: explode ? angle * 0.3 : 0,
    config: { mass: 1, tension: 120, friction: 20 },
  })

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.bezierCurveTo(0.05, 0.3, 0.18, 0.6, 0.12, 1.1)
    s.bezierCurveTo(0.06, 1.4, -0.06, 1.4, -0.12, 1.1)
    s.bezierCurveTo(-0.18, 0.6, -0.05, 0.3, 0, 0)
    return s
  }, [])

  const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3 }

  return (
    <animated.group rotation-z={angle} position-y={pos}>
      <mesh castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color="#1a2a3a"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
    </animated.group>
  )
}

// ── Fan disc ─────────────────────────────────────────────────────────────────
function FanDisc({ explode, offset }) {
  const { posZ } = useSpring({
    posZ: explode ? offset : 0,
    config: { mass: 1, tension: 100, friction: 18 },
  })
  const BLADES = 24
  return (
    <animated.group position-z={posZ}>
      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.12, 32]} />
        <meshStandardMaterial color="#0d1f2d" metalness={0.98} roughness={0.08} />
      </mesh>
      {/* Blades */}
      {Array.from({ length: BLADES }).map((_, i) => (
        <group key={i} rotation-z={(i / BLADES) * Math.PI * 2}>
          <group position={[0, 0.22, 0]}>
            <FanBlade angle={0} explode={false} />
          </group>
        </group>
      ))}
      {/* Ring */}
      <mesh>
        <torusGeometry args={[1.32, 0.025, 12, 80]} />
        <meshStandardMaterial color="#1e3a50" metalness={0.95} roughness={0.1} />
      </mesh>
    </animated.group>
  )
}

// ── Compressor stage ─────────────────────────────────────────────────────────
function CompressorStage({ radius, zPos, explode, offset, index }) {
  const VANES = 32
  const { posZ } = useSpring({
    posZ: explode ? zPos + offset : zPos,
    config: { mass: 1, tension: 90, friction: 16, delay: index * 40 },
  })

  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius * 0.92, 0.08, 48]} />
        <meshStandardMaterial color="#0a1520" metalness={0.96} roughness={0.08} />
      </mesh>
      {Array.from({ length: VANES }).map((_, i) => {
        const angle = (i / VANES) * Math.PI * 2
        const x = Math.cos(angle) * (radius * 0.65)
        const y = Math.sin(angle) * (radius * 0.65)
        return (
          <mesh key={i} position={[x, y, 0]} rotation-z={angle + 0.4} castShadow>
            <boxGeometry args={[radius * 0.3, 0.015, 0.06]} />
            <meshStandardMaterial color="#1a3040" metalness={0.97} roughness={0.05} />
          </mesh>
        )
      })}
    </animated.group>
  )
}

// ── Combustion chamber ────────────────────────────────────────────────────────
function CombustionChamber({ explode }) {
  const { posZ } = useSpring({
    posZ: explode ? 0.5 : 0,
    config: { mass: 1, tension: 80, friction: 18 },
  })
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = explode ? 2 + Math.sin(clock.elapsedTime * 8) * 0.8 : 0
    }
  })

  return (
    <animated.group position-z={posZ}>
      {/* Outer casing */}
      <mesh>
        <cylinderGeometry args={[0.65, 0.68, 0.6, 32, 1, true]} />
        <meshStandardMaterial color="#0d1a25" metalness={0.95} roughness={0.12} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner liner */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.52, 0.55, 32, 1, true]} />
        <meshStandardMaterial
          color="#ff4400"
          metalness={0.3}
          roughness={0.6}
          emissive="#ff2200"
          emissiveIntensity={explode ? 0.8 : 0}
        />
      </mesh>
      {/* Flame glow light */}
      <pointLight ref={lightRef} color="#ff6600" intensity={0} distance={3} />
      {/* Fuel injectors */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.58, Math.sin(angle) * 0.58, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
            <meshStandardMaterial color="#2a4a60" metalness={0.99} roughness={0.05} />
          </mesh>
        )
      })}
    </animated.group>
  )
}

// ── Turbine stage ─────────────────────────────────────────────────────────────
function TurbineStage({ zPos, explode, offset, index }) {
  const BLADES = 60
  const { posZ } = useSpring({
    posZ: explode ? zPos + offset : zPos,
    config: { mass: 1, tension: 85, friction: 15, delay: index * 50 },
  })

  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <cylinderGeometry args={[0.7, 0.65, 0.06, 48]} />
        <meshStandardMaterial
          color="#1a0a00"
          metalness={0.92}
          roughness={0.15}
          emissive="#331100"
          emissiveIntensity={0.1}
        />
      </mesh>
      {Array.from({ length: BLADES }).map((_, i) => {
        const angle = (i / BLADES) * Math.PI * 2
        const x = Math.cos(angle) * 0.45
        const y = Math.sin(angle) * 0.45
        return (
          <mesh key={i} position={[x, y, 0]} rotation-z={angle + 0.8} castShadow>
            <boxGeometry args={[0.2, 0.012, 0.05]} />
            <meshStandardMaterial
              color="#3a1500"
              metalness={0.95}
              roughness={0.1}
              emissive="#ff3300"
              emissiveIntensity={0.05}
            />
          </mesh>
        )
      })}
      <mesh>
        <torusGeometry args={[0.68, 0.02, 8, 60]} />
        <meshStandardMaterial color="#2a0f00" metalness={0.9} roughness={0.2} />
      </mesh>
    </animated.group>
  )
}

// ── Engine casing ─────────────────────────────────────────────────────────────
function EngineCasing({ explode }) {
  const { opacity } = useSpring({
    opacity: explode ? 0.15 : 0.85,
    config: { mass: 1, tension: 60, friction: 20 },
  })

  return (
    <animated.mesh>
      <cylinderGeometry args={[1.42, 1.35, 3.2, 64, 1, true]} />
      <animated.meshStandardMaterial
        color="#0d1e2e"
        metalness={0.92}
        roughness={0.18}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </animated.mesh>
  )
}

// ── Exhaust nozzle ────────────────────────────────────────────────────────────
function ExhaustNozzle({ explode }) {
  const { posZ } = useSpring({
    posZ: explode ? 1.8 : 0,
    config: { mass: 1, tension: 80, friction: 18 },
  })

  return (
    <animated.group position-z={posZ}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.5, 32]} />
        <meshStandardMaterial color="#0a1520" metalness={0.97} roughness={0.06} />
      </mesh>
      {/* Chevrons */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0.2]}>
            <boxGeometry args={[0.06, 0.12, 0.04]} />
            <meshStandardMaterial color="#1a3040" metalness={0.95} roughness={0.1} />
          </mesh>
        )
      })}
    </animated.group>
  )
}

// ── Main TurbofanEngine component ─────────────────────────────────────────────
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
    { radius: 1.1, zPos: -0.95, offset: -1.4 },
    { radius: 0.95, zPos: -0.75, offset: -1.0 },
    { radius: 0.82, zPos: -0.56, offset: -0.7 },
    { radius: 0.73, zPos: -0.38, offset: -0.4 },
    { radius: 0.68, zPos: -0.20, offset: -0.15 },
  ]

  const turbineStages = [
    { zPos: 0.30, offset: 0.3 },
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

      {/* Ambient */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]}   intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#004466" />
      <pointLight       position={[0, 3, 0]}    intensity={0.8} color="#00d4ff" distance={8} />

      <group ref={engineRef} rotation-x={Math.PI / 2}>
        {/* Outer casing */}
        <EngineCasing explode={exploded} />

        {/* Inlet cone */}
        <mesh position-z={-1.65} castShadow>
          <coneGeometry args={[1.38, 0.4, 48]} />
          <meshStandardMaterial color="#0a1825" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Fan disc */}
        <group ref={fanRef} position-z={-1.4} scale={[1.28, 1.28, 1]}>
          <FanDisc explode={exploded} offset={-1.8} />
        </group>

        {/* Compressor stages */}
        {compressorStages.map((stage, i) => (
          <CompressorStage key={i} {...stage} explode={exploded} index={i} />
        ))}

        {/* Combustion chamber */}
        <CombustionChamber explode={exploded} />

        {/* Turbine stages */}
        {turbineStages.map((stage, i) => (
          <TurbineStage key={i} {...stage} explode={exploded} index={i} />
        ))}

        {/* Exhaust nozzle */}
        <ExhaustNozzle explode={exploded} />

        {/* Pylons */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 1.38, Math.sin(angle) * 1.38, 0]} rotation-z={angle}>
            <boxGeometry args={[0.04, 0.08, 3.0]} />
            <meshStandardMaterial color="#0d1f2d" metalness={0.95} roughness={0.12} />
          </mesh>
        ))}
      </group>

      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.4} intensity={0.8} />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
        <Vignette eskil={false} offset={0.3} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
