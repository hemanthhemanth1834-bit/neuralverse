import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildParticleMaterial, makeGlowTexture } from '../shaders/materials';

interface Props {
  reducedMotion: boolean;
  progress?: number; // 0..1 scroll through
}

/** Future-tech flight — ring tunnel + monoliths + dust. Scroll drives camera. */
export default function FutureScene({ reducedMotion, progress = 0 }: Props) {
  const group = useRef<THREE.Group>(null);
  const glow = useMemo(() => makeGlowTexture(), []);
  const mat = useMemo(() => buildParticleMaterial(glow, 0.8), [glow]);

  const { positions, colors, scales, phases } = useMemo(() => {
    const N = 900;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const scales = new Float32Array(N);
    const phases = new Float32Array(N);
    const c1 = new THREE.Color('#22d3ee'), c2 = new THREE.Color('#a78bfa');
    for (let i = 0; i < N; i++) {
      const z = (Math.random() - 0.5) * 40;
      const r = 3 + Math.random() * 7;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = z;
      const c = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = c.r * 0.8; colors[i * 3 + 1] = c.g * 0.8; colors[i * 3 + 2] = c.b * 0.8;
      scales[i] = 4 + Math.random() * 14;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, scales, phases };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    if (!reducedMotion && group.current) {
      group.current.rotation.z += delta * 0.03;
    }
    const cam = state.camera as THREE.PerspectiveCamera;
    const targetZ = 8 - progress * 10;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetZ, 0.05);
    cam.position.x = Math.sin(t * 0.1) * 0.6 + state.pointer.x * 0.5;
    cam.position.y = Math.cos(t * 0.08) * 0.4 + state.pointer.y * 0.4;
    cam.lookAt(0, 0, -6);
  });

  return (
    <group ref={group}>
      <points material={mat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
      </points>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0, 6 - i * 2.4]} rotation={[0, 0, (i * Math.PI) / 12]}>
          <torusGeometry args={[4.4 - (i % 4) * 0.35, 0.02, 8, 72]} />
          <meshBasicMaterial color={i % 2 ? '#22d3ee' : '#a78bfa'} transparent opacity={0.5 - i * 0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      {/* monoliths: AI / robotics / cloud / spatial */}
      {[
        { p: [-3.4, -1.2, -4] as const, c: '#22d3ee', g: 'icosahedron' as const },
        { p: [3.4, 1.1, -8] as const, c: '#a78bfa', g: 'octahedron' as const },
        { p: [-2.6, 1.6, -12] as const, c: '#34d399', g: 'box' as const },
        { p: [2.8, -1.6, -16] as const, c: '#f472b6', g: 'torusKnot' as const },
      ].map((m, i) => (
        <group key={i} position={[m.p[0], m.p[1], m.p[2]]}>
          <mesh rotation={[0.4, i * 0.8, 0]}>
            {m.g === 'icosahedron' && <icosahedronGeometry args={[0.9, 0]} />}
            {m.g === 'octahedron' && <octahedronGeometry args={[0.9, 0]} />}
            {m.g === 'box' && <boxGeometry args={[1.1, 1.1, 1.1]} />}
            {m.g === 'torusKnot' && <torusKnotGeometry args={[0.55, 0.18, 64, 12]} />}
            <meshStandardMaterial color={m.c} emissive={m.c} emissiveIntensity={0.9} wireframe transparent opacity={0.85} />
          </mesh>
          <pointLight color={m.c} intensity={8} distance={8} />
        </group>
      ))}
      <ambientLight intensity={0.4} />
    </group>
  );
}
