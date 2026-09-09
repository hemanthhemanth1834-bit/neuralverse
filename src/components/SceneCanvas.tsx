import { Suspense, useRef, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useInViewport } from '../hooks/useInViewport';

interface Props {
  children: ReactNode;
  bloom?: boolean;
  camera?: { position: [number, number, number]; fov: number };
  className?: string;
  label?: string;
}

/**
 * Viewport-aware R3F canvas — the WebGL context only exists while its section
 * is near the viewport. This keeps a single scene on the GPU at a time and
 * removes the multi-canvas jank of long 3D pages.
 */
export default function SceneCanvas({ children, bloom = true, camera, className = '', label = '3D scene' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInViewport(ref, '700px');

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`} role="img" aria-label={label}>
      {visible ? (
        <Canvas
          dpr={[0.6, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
          camera={{ position: camera?.position || [0, 0, 9], fov: camera?.fov || 55, near: 0.1, far: 80 }}
        >
          <Suspense fallback={null}>
            {children}
            {bloom && (
              <EffectComposer multisampling={0}>
                <Bloom intensity={0.85} luminanceThreshold={0.12} luminanceSmoothing={0.7} mipmapBlur radius={0.75} />
                <Vignette darkness={0.55} offset={0.25} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      ) : (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="mono-font animate-pulse text-[10px] tracking-[0.45em] text-slate-600">STANDBY</span>
        </div>
      )}
    </div>
  );
}
