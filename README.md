# Muchakarla Hemanth Kumar — Premium Portfolio

A cinematic, award-style personal portfolio built strictly from Hemanth's verified professional
record: AI/ML engineering student at SRK Institute of Technology, internships at CodeAlpha,
Codomax Digital Solutions and CodSoft, Tata & Deloitte enterprise job simulations (Forage),
and ten certifications across Python (Cisco/OpenEDG), AWS Cloud, Generative AI (NASSCOM)
and Cybersecurity.

## Highlights

- **Premium loader** — animated MHK monogram with progress phases
- **Interactive 3D hero** — a "neural core" lattice with particle shell and orbit ring
  (Three.js via @react-three/fiber), reacting to pointer and scroll
- **Light / dark themes** — persisted to localStorage, respects `prefers-color-scheme`
- **Custom cursor** — dot + lagging ring with contextual states (fine pointers only)
- **Magnetic buttons, tilt cards, glass surfaces, animated gradient edges**
- **Scroll experience** — progress bar, section reveals, timeline progress, parallax blobs
- **Storytelling projects section** — alternating editorial layouts with animated
  data-visualisation artwork per engagement
- **Accessible & honest** — semantic HTML, keyboard navigation, focus styles, ARIA where
  needed, full `prefers-reduced-motion` support; the contact form opens your email client
  (`mailto:`) and claims nothing more

## Stack

- React 19 + Vite 6
- Three.js via @react-three/fiber (lazy-loaded; drei no longer used)
- Framer Motion 12 (`MotionConfig reducedMotion="user"` globally)
- Hand-written modular CSS design system — no UI framework

```
src/
├── main.jsx / App.jsx        # composition root
├── index.css                 # imports the style layers below
├── styles/                   # variables · base · components · sections · responsive
├── data/resume.js            # SINGLE SOURCE OF TRUTH for all content
├── hooks/useReducedMotion.js
├── components/               # Loader, Cursor, Navbar, ScrollProgress, Background,
│                             # Reveal, Magnetic, TiltCard, Scene3D, icons
└── sections/                 # Hero, About, Skills, Journey, Work,
                              # Certifications (+Achievements), Contact, Footer
```

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

## Production Build

```bash
npm run build      # emits dist/
npm run preview    # serve the production build locally
```

The Three.js scene is code-split into its own chunk and only fetched after the loader
completes. Particle counts and geometry simplify automatically on small screens or
low-core devices.

## Content Source of Truth

Everything on the site renders from `src/data/resume.js`. Nothing is invented — no fake
projects, employers, statistics, testimonials or links. To add real personal projects,
a GitHub URL, resume PDF download or live demos later:

1. Add them to the `work` array (or `profile.github`) in `src/data/resume.js`
2. Render links in `src/sections/Work.jsx` / `Hero.jsx`

## Customization

- **Colors / radii / motion** → `src/styles/variables.css` (both themes are token-driven)
- **Section copy** → the matching file in `src/sections/`
- **SEO + structured data** → `index.html` (update the canonical URL when deploying)

## Contact Form

Uses a validated `mailto:` handler — it opens the visitor's email app pre-filled to
hemanthhemanth1834@gmail.com. To wire a real backend (Formspree, Resend, your API),
replace the `onSubmit` handler in `src/sections/Contact.jsx`.
