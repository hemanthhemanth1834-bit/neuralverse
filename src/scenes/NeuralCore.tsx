import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildParticleMaterial, makeGlowTexture, holoVertex, holoFragment } from '../shaders/materials';
import type { DeviceTier } from '../utils/device';
import { particleBudget } from '../utils/device';

interface Props {
  tier: DeviceTier;
  reducedMotion: boolean;
}

/** Procedural neural core — nodes + web links + data comets + holographic heart. */
export default function NeuralCore({ tier, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const cometsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const holoRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const budget = particleBudget(tier);
  const COUNT = budget.nodes;

  const glowTex = useMemo(() => makeGlowTexture(), []);

  const { positions, colors, scales, phases, linePositions, cometPairs, cometPos } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const palette = [
      new THREE.Color('#67e8f9'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#e0f2fe'),
    ];
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      // clustered sphere with filament bias
      const r = 2.2 + Math.pow(Math.random(), 0.6) * 4.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      const z = r * Math.cos(phi) * 0.9;
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
      const c = palette[Math.floor(Math.random() * palette.length)];
      const dim = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c.r * dim; colors[i * 3 + 1] = c.g * dim; colors[i * 3 + 2] = c.b * dim;
      scales[i] = 6 + Math.random() * 22;
      phases[i] = Math.random() * Math.PI * 2;
    }
    // cheap web: each node links to 2 pseudo-neighbors (deterministic hash) — O(n)
    const segs: number[] = [];
    const stride1 = 37, stride2 = 91;
    for (let i = 0; i < COUNT; i += tier === 'low' ? 3 : 2) {
      const a = pts[i];
      const b = pts[(i + stride1) % COUNT];
      const c = pts[(i + stride2) % COUNT];
      if (a.distanceTo(b) < 3.4) segs.push(a.x, a.y, a.z, b.x, b.y, b.z);
      if (a.distanceTo(c) < 3.4) segs.push(a.x, a.y, a.z, c.x, c.y, c.z);
      if (segs.length > 14000) break;
    }
    // comets travel between random node pairs
    const cometPairs: [THREE.Vector3, THREE.Vector3][] = [];
    const CN = budget.data;
    for (let i = 0; i < CN; i++) {
      const a = pts[Math.floor(Math.random() * COUNT)];
      const b = pts[Math.floor(Math.random() * COUNT)];
      if (a.distanceTo(b) < 5) cometPairs.push([a, b]);
    }
    const cometPos = new Float32Array(Math.max(cometPairs.length, 1) * 3);
    return { positions, colors, scales, phases, linePositions: new Float32Array(segs), cometPairs, cometPos };
  }, [COUNT, tier, budget.data]);

  const particleMat = useMemo(() => buildParticleMaterial(glowTex, 0.95), [glowTex]);
  const cometMat = useMemo(() => buildParticleMaterial(glowTex, 1), [glowTex]);
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);
  const cometGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(cometPos, 3));
    return g;
  }, [cometPos]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    particleMat.uniforms.uTime.value = t;
    cometMat.uniforms.uTime.value = t;
    if (holoRef.current) holoRef.current.uniforms.uTime.value = t;
    // mouse parallax (global listener cheap)
    const mx = state.pointer.x, my = state.pointer.y;
    mouse.current.x += (mx - mouse.current.x) * 0.04;
    mouse.current.y += (my - mouse.current.y) * 0.04;

    if (!reducedMotion && group.current) {
      group.current.rotation.y += delta * 0.05;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.22, 0.03);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, mouse.current.x * 0.08, 0.03);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, mouse.current.x * 0.5, 0.02);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, mouse.current.y * 0.35, 0.02);
    }
    if (coreRef.current && !reducedMotion) {
      coreRef.current.rotation.y -= delta * 0.25;
      coreRef.current.rotation.x += delta * 0.1;
      const s = 1 + Math.sin(t * 1.4) * 0.05;
      coreRef.current.scale.setScalar(s);
    }
    // comets
    if (!reducedMotion && cometsRef.current && cometPairs.length > 0) {
      const pos = (cometGeo.attributes.position as THREE.BufferAttribute);
      for (let i = 0; i < cometPairs.length; i++) {
        const [a, b] = cometPairs[i];
        const k = (t * 0.25 + i * 0.37) % 1;
        // ease + arc lift
        const x = THREE.MathUtils.lerp(a.x, b.x, k);
        const y = THREE.MathUtils.lerp(a.y, b.y, k) + Math.sin(k * Math.PI) * 0.35;
        const z = THREE.MathUtils.lerp(a.z, b.z, k);
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }
    // idle camera drift
    if (!reducedMotion) {
      const cam = state.camera as THREE.PerspectiveCamera;
      cam.position.x = Math.sin(t * 0.08) * 1.1 + mouse.current.x * 0.7;
      cam.position.y = Math.cos(t * 0.06) * 0.7 + mouse.current.y * 0.5;
      cam.lookAt(0, 0, 0);
    }
    void viewport;
  });

  return (
    <group ref={group}>
      <points ref={pointsRef} material={particleMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {cometPairs.length > 0 && (
        <points ref={cometsRef} geometry={cometGeo} material={cometMat} />
      )}
      {/* holographic heart */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.05, 2]} />
        <shaderMaterial
          ref={holoRef}
          vertexShader={holoVertex}
          fragmentShader={holoFragment}
          uniforms={{
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color('#22d3ee') },
            uColorB: { value: new THREE.Color('#a78bfa') },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#bdf3ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight color="#22d3ee" intensity={28} distance={18} decay={2} />
      <pointLight color="#a78bfa" intensity={18} distance={20} decay={2} position={[4, -3, 3]} />
    </group>
  );
}
