import * as THREE from 'three';

/** Soft round particle sprite generated procedurally — no external textures. */
export function makeGlowTexture(size = 64): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(160,230,255,0.9)');
  g.addColorStop(0.55, 'rgba(80,160,255,0.28)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const particleVertex = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vec3 p = position;
    float w = sin(uTime * 0.6 + aPhase) * 0.12 + sin(uTime * 1.7 + aPhase * 1.3) * 0.05;
    p.x += w;
    p.y += cos(uTime * 0.5 + aPhase) * 0.12;
    p.z += sin(uTime * 0.4 + aPhase * 0.7) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float twinkle = 0.72 + 0.28 * sin(uTime * 2.0 + aPhase * 3.0);
    vAlpha = twinkle * smoothstep(22.0, 6.0, dist);
    gl_PointSize = aScale * uPixelRatio * (180.0 / max(dist, 0.001)) * 0.028;
  }
`;

export const particleFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    vec3 col = vColor * tex.rgb + vColor * 0.35 * tex.a;
    gl_FragColor = vec4(col, tex.a * vAlpha * uOpacity);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

export const holoVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export const holoFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.2);
    float scan = 0.5 + 0.5 * sin(vUv.y * 60.0 - uTime * 2.2);
    float grid = smoothstep(0.92, 1.0, sin(vUv.x * 80.0) * sin(vUv.y * 80.0));
    vec3 col = mix(uColorA, uColorB, vUv.y + fresnel * 0.5);
    float a = 0.08 + fresnel * 0.55 + scan * 0.05 + grid * 0.12;
    gl_FragColor = vec4(col * (0.7 + fresnel * 1.4), a);
  }
`;

export const energyLineVertex = /* glsl */ `
  attribute float aProgress;
  varying float vProgress;
  void main() {
    vProgress = aProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const energyLineFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying float vProgress;
  void main() {
    float head = fract(uTime * 0.35 - vProgress);
    float pulse = smoothstep(0.0, 0.12, head) * smoothstep(0.32, 0.1, head);
    float base = 0.12;
    gl_FragColor = vec4(uColor * (0.6 + pulse * 2.2), base + pulse * 0.85);
  }
`;

export function buildParticleMaterial(map: THREE.Texture, opacity = 0.95) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMap: { value: map },
      uOpacity: { value: opacity },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}
