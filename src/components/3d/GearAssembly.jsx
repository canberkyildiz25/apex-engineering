import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// Planetary geometry: Sun r=0.6 (24t), Planet r=0.3 (12t), Ring r_inner=1.2 (48t)
// Ring held fixed → ω_carrier = ω_sun/3, ω_planet_world = -ω_sun
const SUN_R     = 0.60
const PLANET_R  = 0.30
const RING_R    = SUN_R + 2 * PLANET_R   // 1.20
const ORBIT_R   = SUN_R + PLANET_R       // 0.90 — planet centre orbit radius
const THICKNESS = 0.22

// ── Gear tooth shape builder ──────────────────────────────────────────────────
function buildGearShape(radius, teeth, isInternal = false) {
  const shape    = new THREE.Shape()
  const addendum = radius * 0.085
  const dedendum = radius * 0.085
  const tw       = (Math.PI * 2) / teeth

  for (let i = 0; i < teeth; i++) {
    const base     = (i / teeth) * Math.PI * 2
    const half     = tw * 0.3
    const rPitch   = radius
    const rTip     = isInternal ? rPitch - addendum : rPitch + addendum
    const rRoot    = isInternal ? rPitch + dedendum : rPitch - dedendum

    const pts = [
      [Math.cos(base - tw * 0.45) * rRoot,    Math.sin(base - tw * 0.45) * rRoot],
      [Math.cos(base - half) * rPitch,         Math.sin(base - half) * rPitch],
      [Math.cos(base - half) * rTip,           Math.sin(base - half) * rTip],
      [Math.cos(base + half) * rTip,           Math.sin(base + half) * rTip],
      [Math.cos(base + half) * rPitch,         Math.sin(base + half) * rPitch],
      [Math.cos(base + tw * 0.45) * rRoot,     Math.sin(base + tw * 0.45) * rRoot],
    ]
    if (i === 0) shape.moveTo(pts[0][0], pts[0][1])
    pts.forEach(([x, y]) => shape.lineTo(x, y))
  }
  shape.closePath()
  return shape
}

// ── Sun gear ──────────────────────────────────────────────────────────────────
function SunGear({ sunRef }) {
  const shape = useMemo(() => {
    const s = buildGearShape(SUN_R, 24)
    // Centre bore
    const bore = new THREE.Path()
    bore.absarc(0, 0, SUN_R * 0.25, 0, Math.PI * 2, true)
    s.holes.push(bore)
    // 6 lightening holes
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const h = new THREE.Path()
      h.absarc(Math.cos(a) * SUN_R * 0.55, Math.sin(a) * SUN_R * 0.55, SUN_R * 0.09, 0, Math.PI * 2, true)
      s.holes.push(h)
    }
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: THICKNESS, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2,
  }), [])

  return (
    <group ref={sunRef}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#c8a440" metalness={0.95} roughness={0.1} emissive="#c8a440" emissiveIntensity={0.08} envMapIntensity={2} />
      </mesh>
      {/* Input shaft */}
      <mesh>
        <cylinderGeometry args={[SUN_R * 0.24, SUN_R * 0.24, THICKNESS * 2.5, 16]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.99} roughness={0.02} emissive="#00d4ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// ── Planet gear (single) ───────────────────────────────────────────────────────
function PlanetGear({ planetRef }) {
  const shape = useMemo(() => {
    const s = buildGearShape(PLANET_R, 12)
    const bore = new THREE.Path()
    bore.absarc(0, 0, PLANET_R * 0.28, 0, Math.PI * 2, true)
    s.holes.push(bore)
    // 3 lightening holes
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2
      const h = new THREE.Path()
      h.absarc(Math.cos(a) * PLANET_R * 0.52, Math.sin(a) * PLANET_R * 0.52, PLANET_R * 0.1, 0, Math.PI * 2, true)
      s.holes.push(h)
    }
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: THICKNESS, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2,
  }), [])

  return (
    <group ref={planetRef}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#9aaab8" metalness={0.94} roughness={0.12} envMapIntensity={2} />
      </mesh>
      {/* Planet pin */}
      <mesh>
        <cylinderGeometry args={[PLANET_R * 0.27, PLANET_R * 0.27, THICKNESS * 2.8, 12]} />
        <meshStandardMaterial color="#7888a0" metalness={0.96} roughness={0.06} />
      </mesh>
    </group>
  )
}

// ── Ring gear (annulus) with internal teeth ───────────────────────────────────
function RingGear() {
  const shape = useMemo(() => {
    // Outer boundary
    const OUTER_R = RING_R + 0.16
    const s = buildGearShape(RING_R, 48, true)  // internal teeth

    // Outer rim (subtract internal hole from solid annulus)
    // We build: outer solid circle, then cut out the gear profile
    const outer = new THREE.Shape()
    outer.absarc(0, 0, OUTER_R, 0, Math.PI * 2, false)

    // Cut the gear profile as a hole
    const innerCut = new THREE.Path()
    const addendum = RING_R * 0.085
    const dedendum = RING_R * 0.085
    const teeth = 48
    const tw    = (Math.PI * 2) / teeth
    for (let i = 0; i < teeth; i++) {
      const base   = (i / teeth) * Math.PI * 2
      const half   = tw * 0.3
      const rTip   = RING_R - addendum
      const rRoot  = RING_R + dedendum
      const pts = [
        [Math.cos(base - tw * 0.45) * rRoot, Math.sin(base - tw * 0.45) * rRoot],
        [Math.cos(base - half) * RING_R,      Math.sin(base - half) * RING_R],
        [Math.cos(base - half) * rTip,        Math.sin(base - half) * rTip],
        [Math.cos(base + half) * rTip,        Math.sin(base + half) * rTip],
        [Math.cos(base + half) * RING_R,      Math.sin(base + half) * RING_R],
        [Math.cos(base + tw * 0.45) * rRoot,  Math.sin(base + tw * 0.45) * rRoot],
      ]
      if (i === 0) innerCut.moveTo(pts[0][0], pts[0][1])
      pts.forEach(([x, y]) => innerCut.lineTo(x, y))
    }
    innerCut.closePath()
    outer.holes.push(innerCut)

    return outer
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: THICKNESS, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 2,
  }), [])

  return (
    <group>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#5a6878" metalness={0.92} roughness={0.18} envMapIntensity={1.5} />
      </mesh>
      {/* Outer ring detail */}
      <mesh>
        <torusGeometry args={[RING_R + 0.16, 0.015, 8, 96]} />
        <meshStandardMaterial color="#6a7888" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  )
}

// ── Carrier plate ─────────────────────────────────────────────────────────────
function Carrier({ carrierRef }) {
  return (
    <group ref={carrierRef}>
      {/* Carrier disc */}
      <mesh position-z={THICKNESS + 0.04}>
        <cylinderGeometry args={[ORBIT_R + PLANET_R * 0.5, ORBIT_R + PLANET_R * 0.5, 0.06, 48]} />
        <meshStandardMaterial color="#7a8898" metalness={0.88} roughness={0.2} transparent opacity={0.7} />
      </mesh>
      {/* Planet pins on carrier */}
      {[0, 1, 2].map(i => {
        const angle = (i / 3) * Math.PI * 2
        const x = Math.cos(angle) * ORBIT_R
        const y = Math.sin(angle) * ORBIT_R
        return (
          <mesh key={i} position={[x, y, THICKNESS + 0.04]}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
            <meshStandardMaterial color="#9aaab8" metalness={0.95} roughness={0.07} />
          </mesh>
        )
      })}
      {/* Output shaft */}
      <mesh position-z={THICKNESS * 1.5 + 0.06}>
        <cylinderGeometry args={[0.12, 0.12, THICKNESS, 16]} />
        <meshStandardMaterial color="#ff6b2b" metalness={0.97} roughness={0.04} emissive="#ff6b2b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function GearAssembly() {
  const assemblyRef = useRef()
  const sunRef      = useRef()
  const carrierRef  = useRef()
  const planet0Ref  = useRef()
  const planet1Ref  = useRef()
  const planet2Ref  = useRef()
  const planetRefs  = [planet0Ref, planet1Ref, planet2Ref]

  // Kinematics (ring fixed):
  // ω_sun = 2.0 rad/s (input)
  // ω_carrier = ω_sun * S/(S+R) = 2.0 * 24/72 = 2/3
  // ω_planet_world = -ω_sun (opposite spin)
  // In carrier-local frame: ω_planet_local = ω_planet_world - ω_carrier = -2.0 - 2/3 ≈ -2.667
  const W_SUN     =  2.0
  const W_CARRIER =  W_SUN / 3
  const W_PLANET_LOCAL = -(W_SUN * 24 / 12) / 1 + W_CARRIER   // carrier-frame rotation

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (assemblyRef.current) assemblyRef.current.rotation.y = t * 0.08
    if (sunRef.current)      sunRef.current.rotation.z      = t * W_SUN
    if (carrierRef.current)  carrierRef.current.rotation.z  = t * W_CARRIER

    planetRefs.forEach((ref, i) => {
      if (!ref.current) return
      // Each planet group is placed at orbit position i in carrier space.
      // Planet self-rotation in carrier-local frame:
      const carrierAngle = t * W_CARRIER
      const orbitAngle   = (i / 3) * Math.PI * 2 + carrierAngle
      ref.current.position.x = Math.cos(orbitAngle) * ORBIT_R
      ref.current.position.y = Math.sin(orbitAngle) * ORBIT_R
      // Planet self-spin: rolls on sun → ω_planet_world = -W_SUN * (SUN_R/PLANET_R) * (W_CARRIER/W_SUN - 1) ...
      // Simplified: planet counter-rotates at 2× sun speed relative to world
      ref.current.rotation.z = -t * (SUN_R / PLANET_R) * (W_SUN - W_CARRIER) - (i / 3) * Math.PI * 2
    })
  })

  return (
    <>
      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={8} enableDamping dampingFactor={0.06} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="city" />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]}    intensity={2.0} color="#ffffff" castShadow />
      <directionalLight position={[-5, -3, -3]} intensity={0.8} color="#aaccff" />
      <directionalLight position={[0, -5, 3]}   intensity={0.5} color="#ffffff" />
      <pointLight       position={[0, 0, 3]}    intensity={1.8} color="#00d4ff" distance={6} />
      <pointLight       position={[0, 0, -2]}   intensity={0.6} color="#ff6b2b" distance={4} />

      <group ref={assemblyRef} position={[0, -0.1, 0]}>
        {/* Ring gear — fixed (held by housing) */}
        <RingGear />

        {/* Sun gear — input (gold) */}
        <SunGear sunRef={sunRef} />

        {/* 3 planet gears — orbit + self-spin driven by carrier */}
        {planetRefs.map((ref, i) => (
          <PlanetGear key={i} planetRef={ref} />
        ))}

        {/* Carrier — output (orange shaft) */}
        <Carrier carrierRef={carrierRef} />
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.3} intensity={1.5} />
        <ChromaticAberration offset={[0.0003, 0.0003]} />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
