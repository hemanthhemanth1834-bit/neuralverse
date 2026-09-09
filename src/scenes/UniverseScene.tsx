import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { universeNodes } from '../data/universe';
import { buildParticleMaterial, makeGlowTexture } from '../shaders/materials';

interface Props {
  reducedMotion: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/** AI knowledge universe — fibonacci-shell nodes, link web, travelling energy. */
export default function UniverseScene({ reducedMotion, selectedId, onSelect, onHover }: Props) {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const glow = useMemo(() => makeGlowTexture(), []);
  const pulseMat = useMemo(() => buildParticleMaterial(glow, 1), [glow]);

  const nodes = useMemo(() => {
    const N = universeNodes.length;
    return universeNodes.map((n, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      const R = 5.2 + (i % 3) * 0.7;
      return {
        ...n,
        pos: new THREE.Vector3(Math.cos(theta) * rad * R, y * 3.4, Math.sin(theta) * rad * R),
      };
    });
  }, []);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const linkGeo = useMemo(() => {
    const arr: number[] = [];
    nodes.forEach((n) => {
      n.links.forEach((l) => {
        const m = byId[l];
        if (m) arr.push(n.pos.x, n.pos.y, n.pos.z, m.pos.x, m.pos.y, m.pos.z);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(arr), 3));
    return g;
  }, [nodes, byId]);

  const PULSES = 90;
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
    return g;
  }, []);

  const edges = useMemo(() => {
    const e: [THREE.Vector3, THREE.Vector3][] = [];
    nodes.forEach((n) => n.links.forEach((l) => { if (byId[l]) e.push([n.pos, byId[l].pos]); }));
    return e;
  }, [nodes, byId]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    pulseMat.uniforms.uTime.value = t;
    if (!reducedMotion && group.current) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.12, 0.03);
    }
    if (!reducedMotion && pulseRef.current && edges.length) {
      const attr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < PULSES; i++) {
        const [a, b] = edges[i % edges.length];
        const k = (t * 0.3 + i * 0.618) % 1;
        attr.setXYZ(i,
          THREE.MathUtils.lerp(a.x, b.x, k),
          THREE.MathUtils.lerp(a.y, b.y, k) + Math.sin(k * Math.PI) * 0.25,
          THREE.MathUtils.lerp(a.z, b.z, k));
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={linkGeo}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points ref={pulseRef} geometry={pulseGeo} material={pulseMat} />
      {nodes.map((n) => {
        const sel = selectedId === n.id;
        return (
          <group key={n.id} position={n.pos}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); onHover(n.id); }}
              onPointerOut={() => onHover(null)}
              onClick={(e) => { e.stopPropagation(); onSelect(n.id); }}
            >
              <sphereGeometry args={[0.22 * n.size + (sel ? 0.12 : 0), 20, 20]} />
              <meshBasicMaterial color={n.color} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh scale={sel ? 2.4 : 1.7}>
              <sphereGeometry args={[0.22 * n.size, 16, 16]} />
              <meshBasicMaterial color={n.color} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <Html center distanceFactor={14} position={[0, 0.55, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
              <div
                className="mono-font whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] tracking-[0.2em]"
                style={{
                  borderColor: `${n.color}55`,
                  color: '#e6edf7',
                  background: 'rgba(3,6,18,.72)',
                  boxShadow: sel ? `0 0 18px ${n.color}88` : 'none',
                }}
              >
                {n.label}
              </div>
            </Html>
          </group>
        );
      })}
      <pointLight color="#22d3ee" intensity={16} distance={24} />
    </group>
  );
}
