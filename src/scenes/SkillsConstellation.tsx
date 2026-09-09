import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { skills } from '../data/universe';
import { buildParticleMaterial, makeGlowTexture } from '../shaders/materials';

interface Props {
  reducedMotion: boolean;
  active: string | null;
  onHover: (name: string | null) => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  Language: '#22d3ee',
  Web: '#38bdf8',
  Data: '#fbbf24',
  AI: '#a78bfa',
  '3D': '#67e8f9',
  Tools: '#34d399',
};

/** Skills constellation — disc of connected skill stars. No fake percentages. */
export default function SkillsConstellation({ reducedMotion, active, onHover }: Props) {
  const group = useRef<THREE.Group>(null);
  const glow = useMemo(() => makeGlowTexture(), []);
  const mat = useMemo(() => buildParticleMaterial(glow, 0.7), [glow]);

  const nodes = useMemo(() => {
    return skills.map((s, i) => {
      const a = (i / skills.length) * Math.PI * 2;
      const R = i % 2 === 0 ? 4.6 : 3.0;
      return {
        ...s,
        pos: new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R * 0.7, ((i * 37) % 10) / 10 - 0.5),
        color: CATEGORY_COLOR[s.category] || '#67e8f9',
      };
    });
  }, []);

  const dust = useMemo(() => {
    const N = 400;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const scales = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      colors[i * 3] = 0.25; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0.8;
      scales[i] = 3 + Math.random() * 9;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, scales, phases };
  }, []);

  const linkGeo = useMemo(() => {
    const arr: number[] = [];
    nodes.forEach((n, i) => {
      const m = nodes[(i + 1) % nodes.length];
      const c = nodes[(i + 5) % nodes.length];
      arr.push(n.pos.x, n.pos.y, n.pos.z, m.pos.x, m.pos.y, m.pos.z);
      if (i % 2 === 0) arr.push(n.pos.x, n.pos.y, n.pos.z, c.pos.x, c.pos.y, c.pos.z);
      arr.push(n.pos.x, n.pos.y, n.pos.z, 0, 0, 0);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(arr), 3));
    return g;
  }, [nodes]);

  useFrame((state, delta) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    if (!reducedMotion && group.current) {
      group.current.rotation.z += delta * 0.02;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.15, 0.03);
    }
  });

  return (
    <group ref={group}>
      <points material={mat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[dust.colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[dust.scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[dust.phases, 1]} />
        </bufferGeometry>
      </points>
      <lineSegments geometry={linkGeo}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {/* core */}
      <mesh>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {nodes.map((n) => {
        const isActive = active === n.name;
        return (
          <group key={n.name} position={n.pos}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); onHover(n.name); }}
              onPointerOut={() => onHover(null)}
            >
              <sphereGeometry args={[isActive ? 0.24 : 0.14, 16, 16]} />
              <meshBasicMaterial color={n.color} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <Html center distanceFactor={13} position={[0, 0.42, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
              <div
                className="mono-font whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] tracking-[0.18em]"
                style={{
                  background: 'rgba(3,6,18,.75)',
                  border: `1px solid ${n.color}44`,
                  color: isActive ? '#fff' : '#cbd5e1',
                  boxShadow: isActive ? `0 0 14px ${n.color}77` : 'none',
                }}
              >
                {n.name.toUpperCase()}
              </div>
            </Html>
          </group>
        );
      })}
      <pointLight color="#38bdf8" intensity={12} distance={20} />
    </group>
  );
}
