# NEURALVERSE — Interactive AI Universe

**Live site:** https://hemanthhemanth1834-bit.github.io/neuralverse/

> "Where intelligence becomes an experience." A cinematic, immersive 3D AI universe
> built by **Muchakarla Hemanth Kumar** (B.Tech CSE — AI/ML, 2024–2028, SRK Institute of Technology).

## Project structure

```
src/
  App.tsx                  # composition + cinematic scroll choreography + atmosphere
  main.tsx                 # entry
  components/              # CinematicIntro, Cursor, Navigation, MagneticButton,
                           # SectionHeading, SceneCanvas, BrandIcons, ErrorBoundary, WebGLFallback
  sections/                # Hero, Brain, Universe, Assistant, Projects, MissionControl,
                           # Future, Skills, About, Contact, Finale
  scenes/                  # NeuralCore, BrainScene, UniverseScene, FutureScene, SkillsConstellation (R3F)
  shaders/materials.ts     # particle / hologram / energy-line GLSL + glow texture
  data/                    # projects.ts, universe.ts (nodes, regions, skills, demo answers)
  hooks/useDevice.ts       # device tier / touch / reduced-motion / WebGL detection
  lib/                     # gsap-setup, smooth-scroll (Lenis)
  utils/device.ts          # capability helpers + particle budgets
  styles/globals.css       # Tailwind v4 tokens + grain, grid, glass, holo effects
public/robots.txt  public/sitemap.xml  .env.example
```

## Installation / development / build

```bash
npm install
npm run dev      # local dev (Vite, network-exposed)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Deployment (Vercel)

1. Push this folder to a Git repo (ensure `.env` is **never** committed — only `.env.example`).
2. Vercel → New Project → import repo. Framework preset: **Vite**.
3. Build command: `npm run build` · Output dir: `dist`.
4. No environment variables required (demo mode). Optionally set `VITE_AI_PROXY_URL`
   to a **backend** proxy URL for live assistant inference (see below).
5. Deploy. `public/robots.txt` + `public/sitemap.xml` ship automatically.

## Environment variables

| Var | Purpose |
|---|---|
| `VITE_AI_PROXY_URL` | Optional backend proxy for the AI assistant. Leave empty = local demo mode. **Never** put real API keys in `VITE_*` vars — they ship to the browser. |
| `VITE_SITE_URL` | Canonical URL for metadata. |
| `VITE_DEMO_MODE` | `true` = force demo answers. |

Copy `.env.example` → `.env` for local experiments.

## Major 3D systems

- **NeuralCore** (`scenes/NeuralCore.tsx`): procedural sphere-cluster particles (320–1800 by
  device tier) with custom GLSL point shader (turbulence + twinkle + distance fade), O(n)
  pseudo-neighbor link web, travelling "comet" pulses, holographic icosahedron heart,
  mouse-parallax + idle camera drift.
- **BrainScene**: ellipsoid particle cortex with hemispheric fissure + sulci wobble; every
  particle colored by nearest of 5 region centers (Vision/Language/Reasoning/Memory/
  Generative). Region cores are raycastable meshes — hover boosts nearby particle
  brightness, click selects.
- **UniverseScene**: 11 knowledge nodes on a Fibonacci shell, link web from data, 90 energy
  pulses lerping along edges, HTML labels, click-to-open dossier panel.
- **FutureScene**: scroll-driven (`progress` 0→1) camera flight through 12 additive torus
  rings + 4 emissive wireframe monoliths (AI/robotics/cloud/spatial) + dust field.
- **SkillsConstellation**: 14 skill stars on a disc + center hub, category colors, honest
  depth labels (no fake percentages).

All scenes share `SceneCanvas` (adaptive DPR `[0.7, 1.75]`, optional Bloom+Vignette —
bloom disabled on low tier), procedural canvas glow textures (zero external assets),
and per-frame cleanup via R3F disposal.

## Animation system

- **Intro**: 2D-canvas neural formation + GSAP timeline (logo blur-in, masked lines,
  progress bar, phase readout), Skip + Esc/Enter, ~6.8s (1.2s reduced-motion).
- **Scroll**: Lenis smooth scroll + GSAP ScrollTrigger section crossfades, per-section
  reveals (`SectionHeading`), Finale collapse timeline, narrative rail + interstitials
  (Scenes 01–11) for continuous story.
- **Micro**: magnetic buttons, cursor morph + labels, dossier transitions (Framer Motion),
  animated counters/sparklines in Mission Control, hover glow borders.

## Performance optimizations

- Device-tier budgets (low 320 / med 900 / high 1800 particles), bloom off on low,
  `multisampling={0}`, `antialias:false`, capped DPR.
- `React.lazy` + `Suspense` per 3D scene, `ErrorBoundary` + WebGL detection + 2D fallback.
- O(n) link generation (no O(n²) neighbor search), instanced-style single-draw Points,
  throttled state updates, `prefers-reduced-motion` kill-switches (camera, particles,
  Lenis, cursor), semantic HTML + keyboard/focus/ARIA throughout.

## Free resources used

React, TypeScript, Vite, Three.js, React Three Fiber, @react-three/drei,
@react-three/postprocessing + postprocessing, GSAP + ScrollTrigger, Lenis,
Tailwind CSS v4, Framer Motion, Lucide icons (brand glyphs redrawn inline as SVG),
Google Fonts (Space Grotesk / Inter / JetBrains Mono, system fallback offline).
All 3D is procedural — no paid models, templates, or APIs.
