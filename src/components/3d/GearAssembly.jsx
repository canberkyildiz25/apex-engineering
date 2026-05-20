import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// ── Single gear ───────────────────────────────────────────────────────────────
function Gear({ teeth, radius, thickness, color, emissive, rotationSpeed, position, rotationDir = 1, initialAngle = 0 }) {
  const gearRef = useRef()

  useFrame(({ clock }) => {
    if (gearRef.current) {
      gearRef.current.rotation.z = initialAngle + clock.elapsedTime * rotationSpeed * rotationDir
    }
  })

  const shape = new THREE.Shape()
  const addendum    = radius * 0.08
  const dedendum    = radius * 0.08
  const toothWidth  = (Math.PI * 2) / teeth

  for (let i = 0; i < teeth; i++) {
    const baseAngle = (i / teeth) * Math.PI * 2
    const halfTooth = toothWidth * 0.3

    const pts = [
      [Math.cos(baseAngle - toothWidth * 0.45) * (radius - dedendum), Math.sin(baseAngle - toothWidth * 0.45) * (radius - dedendum)],
      [Math.cos(baseAngle - halfTooth) * radius,                       Math.sin(baseAngle - halfTooth) * radius],
      [Math.cos(baseAngle - halfTooth) * (radius + addendum),          Math.sin(baseAngle - halfTooth) * (radius + addendum)],
      [Math.cos(baseAngle + halfTooth) * (radius + addendum),          Math.sin(baseAngle + halfTooth) * (radius + addendum)],
      [Math.cos(baseAngle + halfTooth) * radius,                       Math.sin(baseAngle + halfTooth) * radius],
      [Math.cos(baseAngle + toothWidth * 0.45) * (radius - dedendum),  Math.sin(baseAngle + toothWidth * 0.45) * (radius - dedendum)],
    ]

    if (i === 0) shape.moveTo(pts[0][0], pts[0][1])
    pts.forEach(([x, y]) => shape.lineTo(x, y))
  }
  shape.closePath()

  const hole = new THREE.Path()
  hole.absarc(0, 0, radius * 0.22, 0, Math.PI * 2, true)
  shape.holes.push(hole)

  // Spoke holes
  const SPOKES = Math.min(6, Math.floor(teeth / 6))
  for (let s = 0; s < SPOKES; s++) {
    const sa    = (s / SPOKES) * Math.PI * 2
    const sx    = Math.cos(sa) * (radius * 0.55)
    const sy    = Math.sin(sa) * (radius * 0.55)
    const spoke = new THREE.Path()
    spoke.absarc(sx, sy, radius * 0.1, 0, Math.PI * 2, true)
    shape.holes.push(spoke)
  }

  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  }

  return (
    <group ref={gearRef} position={position}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={color}
          metalness={0.96}
          roughness={0.08}
          emissive={emissive}
          emissiveIntensity={0.06}
          envMapIntensity={2}
        />
      </mesh>
      {/* Shaft */}
      <mesh>
        <cylinderGeometry args={[radius * 0.16, radius * 0.16, thickness * 2.2, 16]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.99} roughness={0.02} emissive="#00d4ff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function GearAssembly() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.08
    }
  })

  // Gear ratios: large (40t) drives medium (20t), medium drives small (10t)
  // Speed: large=1, medium=2, small=4
  const LARGE_R  = 0.9
  const MEDIUM_R = 0.46
  const SMALL_R  = 0.24

  // Mesh distance (center-to-center = r1 + r2 + small gap)
  const GAP      = 0.05
  const LM_DIST  = LARGE_R + MEDIUM_R + GAP
  const MS_DIST  = MEDIUM_R + SMALL_R + GAP

  const gears = [
    {
      teeth: 40, radius: LARGE_R, thickness: 0.18,
      color: '#0d1f2d', emissive: '#00d4ff',
      rotationSpeed: 0.6, rotationDir: 1, initialAngle: 0,
      position: [0, 0, 0],
    },
    {
      teeth: 20, radius: MEDIUM_R, thickness: 0.18,
      color: '#1a0a00', emissive: '#ff6b2b',
      rotationSpeed: 0.6 * (40 / 20), rotationDir: -1, initialAngle: 0,
      position: [LM_DIST, 0, 0],
    },
    {
      teeth: 10, radius: SMALL_R, thickness: 0.18,
      color: '#0a1a0a', emissive: '#00ff88',
      rotationSpeed: 0.6 * (40 / 10), rotationDir: 1, initialAngle: 0,
      position: [LM_DIST + MS_DIST, 0, 0],
    },
    // Second medium gear above large
    {
      teeth: 24, radius: 0.55, thickness: 0.14,
      color: '#1a1a00', emissive: '#c8a951',
      rotationSpeed: 0.6 * (40 / 24), rotationDir: -1, initialAngle: 0,
      position: [-0.02, LARGE_R + 0.55 + GAP, 0.04],
    },
  ]

  return (
    <>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.06} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="city" />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]}   intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-5, -3, -3]} intensity={0.3} color="#001122" />
      <pointLight       position={[0, 0, 3]}    intensity={2.0} color="#00d4ff" distance={6} />
      <pointLight       position={[LM_DIST, 0, 3]} intensity={1.0} color="#ff6b2b" distance={4} />

      <group ref={groupRef} position={[-(LM_DIST / 2), -0.3, 0]}>
        {gears.map((g, i) => (
          <Gear key={i} {...g} />
        ))}

        {/* Base plate */}
        <mesh position={[LM_DIST / 2, -1.1, -0.12]} receiveShadow>
          <boxGeometry args={[LM_DIST + MS_DIST + 0.4, 0.08, 0.5]} />
          <meshStandardMaterial color="#080f18" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Bearing stands */}
        {[0, LM_DIST, LM_DIST + MS_DIST].map((x, i) => (
          <mesh key={i} position={[x, -0.85, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.5, 16]} />
            <meshStandardMaterial color="#0a1520" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.3} intensity={1.5} />
        <ChromaticAberration offset={[0.0003, 0.0003]} />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
