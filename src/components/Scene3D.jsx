import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

/* ---------- geometry helpers ---------- */

function fibonacciSphere(n, radius) {
  const pts = new Float32Array(n * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts[i * 3] = Math.cos(theta) * r * radius
    pts[i * 3 + 1] = y * radius
    pts[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return pts
}

function scatterBox(n, w, h, d) {
  const pts = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    pts[i * 3] = (Math.random() - 0.5) * w
    pts[i * 3 + 1] = (Math.random() - 0.5) * h
    pts[i * 3 + 2] = (Math.random() - 0.5) * d
  }
  return pts
}

function ringCloud(n, radius, thickness) {
  const pts = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const r = radius + (Math.random() - 0.5) * thickness
    pts[i * 3] = Math.cos(a) * r
    pts[i * 3 + 1] = (Math.random() - 0.5) * thickness * 0.35
    pts[i * 3 + 2] = Math.sin(a) * r
  }
  return pts
}

/* ---------- animated "neural core" ---------- */

function NeuralCore({ compact }) {
  const group = useRef(null)
  const spinY = useRef(0)

  const shellPts = useMemo(() => fibonacciSphere(compact ? 140 : 300, 2.16), [compact])
  const ringPts = useMemo(() => ringCloud(compact ? 90 : 200, 3.15, 0.5), [compact])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const scroll = Math.min(1.6, window.scrollY / Math.max(1, window.innerHeight))
    const px = state.pointer.x
    const py = state.pointer.y

    // constant slow spin, accelerating slightly as you scroll away
    spinY.current += delta * (0.14 + scroll * 0.25)

    // smooth pursuit of pointer parallax + scroll choreography
    const ease = 1 - Math.pow(0.0025, delta)
    g.rotation.y += (spinY.current + px * 0.3 - g.rotation.y) * ease
    g.rotation.x += (py * -0.22 + Math.sin(spinY.current * 0.7) * 0.06 - g.rotation.x) * ease
    g.rotation.z += (px * -0.05 - g.rotation.z) * ease

    g.position.y = (compact ? 0.4 : 0) - scroll * 1.7
    g.position.z = -scroll * 2.4

    // fade the whole object out while leaving the hero
    const fade = Math.max(0, 1 - scroll * 0.75)
    g.traverse((o) => {
      if (!o.material || o.material.opacity === undefined) return
      if (o.userData.baseOpacity === undefined) o.userData.baseOpacity = o.material.opacity
      o.material.opacity = o.userData.baseOpacity * fade
    })
  })

  return (
    <group ref={group} position={[compact ? 0 : 2.35, compact ? 0.4 : 0, 0]} scale={compact ? 0.72 : 1}>
      {/* outer lattice */}
      <mesh>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial wireframe color="#5b8cff" transparent opacity={0.26} />
      </mesh>
      {/* inner volume */}
      <mesh>
        <icosahedronGeometry args={[1.32, 0]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      {/* glowing nucleus */}
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.55} depthWrite={false} blending={2} />
      </mesh>
      {/* particle shell */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shellPts, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#7dd3fc" transparent opacity={0.75} sizeAttenuation depthWrite={false} blending={2} />
      </points>
      {/* tilted orbit ring */}
      <points rotation={[Math.PI / 2.6, 0.4, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringPts, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#c084fc" transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={2} />
      </points>
    </group>
  )
}

function Starfield({ count }) {
  const pts = useMemo(() => scatterBox(count, 30, 18, 12), [count])
  return (
    <group position={[0, 0, -5]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pts, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#94a3bd" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  )
}

/* ---------- canvas host (pauses when scrolled away) ---------- */

export default function Scene3D({ compact = false }) {
  const wrap = useRef(null)
  const [active, setActive] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const obs = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!failed) return undefined
    const t = setTimeout(() => setFailed(false), 4000)
    return () => clearTimeout(t)
  }, [failed])

  if (failed) return null

  return (
    <div ref={wrap} className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => setFailed(true))
        }}
      >
        <Starfield count={compact ? 240 : 650} />
        <NeuralCore compact={compact} />
      </Canvas>
    </div>
  )
}
