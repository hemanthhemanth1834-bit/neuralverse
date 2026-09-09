import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brainRegions } from '../data/universe';
import { buildParticleMaterial, makeGlowTexture } from '../shaders/materials';

interface Props {
  tier: 'low' | 'medium' | 'high';
  reducedMotion: boolean;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/** Procedural AI brain — ellipsoid particle shell split into 5 glowing regions. */
export default function BrainScene({ tier, reducedMotion, activeId, onHover, onSelect }: Props) {
  const group = useRef<THREE.Group>(null);
  const COUNT = tier === 'low' ? 700 : tier === 'medium' ? 1600 : 2600;
  const glow = useMemo(() => makeGlowTexture(), []);
  const mat = useMemo(() => buildParticleMaterial(glow, 0.95), [glow]);
  const [hovered, setHovered] = useState<string | null>(null);

  const centers = useMemo(() => brainRegions.map((r) => new THREE.Vector3(...r.position)), []);

  const { positions, colors, scales, phases, baseColors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const baseColors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const regionCols = brainRegions.map((r) => new THREE.Color(r.color));
    for (let i = 0; i < COUNT; i++) {
      // brain-ish ellipsoid + sulci noise
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const wobble = 1 + 0.14 * Math.sin(u * 5) * Math.cos(v * 4) + (Math.random() - 0.5) * 0.12;
      let x = 3.0 * Math.sin(v) * Math.cos(u) * wobble;
      let y = 2.15 * Math.cos(v) * wobble;
      let z = 2.5 * Math.sin(v) * Math.sin(u) * wobble;
      if (Math.abs(x) < 0.28) x += x >= 0 ? 0.3 : -0.3; // hemispheric fissure
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      // nearest region
      const p = new THREE.Vector3(x, y, z);
      let best = 0, bd = Infinity;
      centers.forEach((c, k) => {
        const d = p.distanceTo(c);
        if (d < bd) { bd = d; best = k; }
      });
      const c = regionCols[best];
      const dim = 0.5 + Math.random() * 0.5;
      baseColors[i * 3] = c.r * dim; baseColors[i * 3 + 1] = c.g * dim; baseColors[i * 3 + 2] = c.b * dim;
      colors[i * 3] = baseColors[i * 3]; colors[i * 3 + 1] = baseColors[i * 3 + 1]; colors[i * 3 + 2] = baseColors[i * 3 + 2];
      scales[i] = 5 + Math.random() * 18;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, scales, phases, baseColors };
  }, [COUNT, centers]);

  const geoRef = useRef<THREE.BufferGeometry>(null);

  // Recompute the region highlight only when selection changes — never per frame.
  useEffect(() => {
    const geo = geoRef.current;
    if (!geo) return;
    const colAttr = geo.getAttribute('aColor') as THREE.BufferAttribute | undefined;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!colAttr || !posAttr) return;
    const target = brainRegions.findIndex((r) => r.id === (hovered || activeId));
    const c = target >= 0 ? centers[target] : null;
    for (let i = 0; i < COUNT; i++) {
      let boost = 1;
      if (c) {
        const dx = posAttr.getX(i) - c.x, dy = posAttr.getY(i) - c.y, dz = posAttr.getZ(i) - c.z;
        if (dx * dx + dy * dy + dz * dz < 4.84) boost = 1.9;
      }
      colAttr.setXYZ(i, baseColors[i * 3] * boost, baseColors[i * 3 + 1] * boost, baseColors[i * 3 + 2] * boost);
    }
    colAttr.needsUpdate = true;
  }, [hovered, activeId, baseColors, centers, COUNT]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    if (!reducedMotion && group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.18, 0.04);
    }
  });

  return (
    <group ref={group}>
      <points material={mat}>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
      </points>
      {/* gyri curves */}
      {[2.6, 2.0, 1.35].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2.4 + i * 0.25, 0, i * 0.6]}>
          <torusGeometry args={[r, 0.012, 8, 128]} />
          <meshBasicMaterial color={i === 1 ? '#67e8f9' : '#3b82f6'} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      {/* region cores */}
      {brainRegions.map((r) => {
        const isActive = activeId === r.id || hovered === r.id;
        return (
          <mesh
            key={r.id}
            position={r.position as unknown as [number, number, number]}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(r.id); onHover(r.id); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(null); onHover(null); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); onSelect(r.id); }}
          >
            <sphereGeometry args={[isActive ? 0.34 : 0.22, 24, 24]} />
            <meshBasicMaterial color={r.color} transparent opacity={isActive ? 1 : 0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
      <pointLight color="#67e8f9" intensity={20} distance={16} />
    </group>
  );
}
