import{G as r,g as l,w as n}from"./three-TQgAWo5J.js";function s(a=64){const o=document.createElement("canvas");o.width=o.height=a;const t=o.getContext("2d"),e=t.createRadialGradient(a/2,a/2,0,a/2,a/2,a/2);e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.25,"rgba(160,230,255,0.9)"),e.addColorStop(.55,"rgba(80,160,255,0.28)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,a,a);const i=new r(o);return i.needsUpdate=!0,i}const v=`
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
`,c=`
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
`,u=`
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
`,d=`
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
`;function g(a,o=.95){return new l({uniforms:{uTime:{value:0},uMap:{value:a},uOpacity:{value:o},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:v,fragmentShader:c,transparent:!0,depthWrite:!1,blending:n})}export{u as a,g as b,d as h,s as m};
