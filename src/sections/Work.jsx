import Reveal, { SectionHead } from '../components/Reveal.jsx'
import { work } from '../data/resume'

/* Abstract, animated data-visualisations — decorative representations
   of each engagement's domain (no fabricated screenshots). */
function Viz({ variant }) {
  const a = 'var(--p-a)'
  const b = 'var(--p-b)'

  if (variant === 'pipeline') {
    return (
      <svg viewBox="0 0 320 220" className="viz-svg" aria-hidden="true">
        <g stroke={a} strokeWidth="1.4" fill="none" opacity="0.85" className="dash-flow">
          <path d="M40 110 H120 M120 60 H200 M120 160 H200 M200 110 H280" />
        </g>
        {[
          [40, 110], [120, 60], [120, 160], [200, 60], [200, 160]
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill="none" stroke={b} strokeWidth="1.6" className="pulse-node" />
        ))}
        <circle cx="40" cy="110" r="4.5" fill={a} />
        {[120, 200].map((x) => (
          <g key={x}>
            <circle cx={x} cy="60" r="4.5" fill={b} />
            <circle cx={x} cy="160" r="4.5" fill={b} />
          </g>
        ))}
        <circle cx="280" cy="110" r="10" fill="none" stroke={a} strokeWidth="2" className="pulse-node" />
      </svg>
    )
  }

  if (variant === 'models') {
    return (
      <svg viewBox="0 0 320 220" className="viz-svg" aria-hidden="true">
        {[52, 84, 116, 148].map((x, bi) => (
          <rect
            key={x}
            x={x}
            y={190 - [70, 118, 96, 142][bi]}
            width="24"
            height={[70, 118, 96, 142][bi]}
            rx="5"
            fill={bi % 2 ? b : a}
            opacity={0.32 + bi * 0.16}
            className="grow-bar"
            style={{ transformOrigin: `center ${190}px`, animationDelay: `${bi * 0.12}s` }}
          />
        ))}
        <path d="M46 128 L78 82 L110 104 L142 58" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round" className="dash-flow" />
        <circle cx="46" cy="128" r="3.6" fill={a} />
        <circle cx="78" cy="82" r="3.6" fill={a} />
        <circle cx="110" cy="104" r="3.6" fill={a} />
        <circle cx="142" cy="58" r="3.6" fill={a} />
      </svg>
    )
  }

  if (variant === 'web') {
    return (
      <svg viewBox="0 0 320 220" className="viz-svg" aria-hidden="true">
        <rect x="56" y="34" width="208" height="152" rx="12" fill="none" stroke={a} strokeWidth="1.6" />
        <line x1="56" y1="62" x2="264" y2="62" stroke={a} strokeWidth="1.2" opacity="0.7" />
        <circle cx="74" cy="48" r="3.4" fill={b} />
        <circle cx="88" cy="48" r="3.4" fill={b} opacity="0.65" />
        <circle cx="102" cy="48" r="3.4" fill={b} opacity="0.35" />
        <rect x="76" y="80" width="100" height="10" rx="5" fill={a} opacity="0.8" className="shimmer-rect" />
        <rect x="76" y="102" width="150" height="7" rx="3.5" fill={b} opacity="0.55" />
        <rect x="76" y="118" width="126" height="7" rx="3.5" fill={b} opacity="0.4" />
        <rect x="76" y="140" width="72" height="22" rx="11" fill="none" stroke={a} strokeWidth="1.5" />
        <rect x="164" y="140" width="72" height="22" rx="11" fill={a} opacity="0.28" />
      </svg>
    )
  }

  if (variant === 'dashboard') {
    return (
      <svg viewBox="0 0 320 220" className="viz-svg" aria-hidden="true">
        <rect x="36" y="36" width="112" height="66" rx="9" fill="none" stroke={a} strokeWidth="1.4" />
        <rect x="172" y="36" width="112" height="66" rx="9" fill="none" stroke={b} strokeWidth="1.4" />
        <text x="52" y="64" fontSize="20" fontWeight="700" fill={a} fontFamily="monospace">Q4</text>
        <text x="188" y="64" fontSize="20" fontWeight="700" fill={b} fontFamily="monospace">+18%</text>
        {[86, 92, 98].map((y) => (
          <line key={y} x1="52" y1={y} x2="132" y2={y} stroke={a} strokeWidth="3" opacity="0.35" />
        ))}
        {[86, 92, 98].map((y) => (
          <line key={`r${y}`} x1="188" y1={y} x2="268" y2={y} stroke={b} strokeWidth="3" opacity="0.35" />
        ))}
        <polyline
          points="40,180 90,168 130,174 170,150 210,156 250,132 290,138"
          fill="none"
          stroke={a}
          strokeWidth="2.4"
          strokeLinecap="round"
          className="dash-flow"
        />
        {[90, 130, 210, 250].map((x, di) => (
          <circle key={x} cx={x} cy={[168, 174, 156, 132][di]} r="4" fill={b} className="pulse-node" style={{ animationDelay: `${di * 0.3}s` }} />
        ))}
      </svg>
    )
  }

  // scatter / EDA
  return (
    <svg viewBox="0 0 320 220" className="viz-svg" aria-hidden="true">
      <line x1="44" y1="186" x2="292" y2="186" stroke={a} strokeWidth="1.2" opacity="0.5" />
      <line x1="44" y1="30" x2="44" y2="186" stroke={a} strokeWidth="1.2" opacity="0.5" />
      {[
        [70, 150], [96, 122], [118, 138], [142, 98], [166, 116],
        [188, 84], [212, 102], [238, 68], [262, 80], [284, 52]
      ].map(([x, y], di) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={di % 3 === 0 ? 6 : 4} fill={di % 2 ? b : a} opacity="0.75" className="pulse-node" style={{ animationDelay: `${di * 0.14}s` }} />
      ))}
      <path d="M60 158 C120 140, 200 108, 288 54" fill="none" stroke={b} strokeWidth="2" strokeDasharray="5 6" className="dash-flow" />
    </svg>
  )
}

const VARIANTS = ['pipeline', 'models', 'web', 'dashboard', 'scatter']
const PALETTE = [
  ['#38bdf8', '#a78bfa'],
  ['#34d399', '#38bdf8'],
  ['#f472b6', '#fbbf24'],
  ['#38bdf8', '#34d399'],
  ['#a78bfa', '#f472b6']
]

export default function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="container-wide" style={{ width: 'var(--container-wide)', marginInline: 'auto' }}>
        <SectionHead
          index="04"
          label="Selected Work"
          title={<span id="work-title">Where theory met real briefs</span>}
          lead="Internship programmes and enterprise simulations — each one shipped against real industry expectations."
        />

        {work.map((project, i) => {
          const [pa, pb] = PALETTE[i % PALETTE.length]
          const even = i % 2 === 1
          return (
            <Reveal as="article" key={project.id} className={`project${even ? ' flip' : ''}`} y={44}>
              <span className="project-index mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div
                className="project-media"
                style={{ '--p-a': pa, '--p-b': pb }}
                role="img"
                aria-label={`Illustrative data visualization for ${project.name} — ${project.org}`}
              >
                <span className="grid-overlay" aria-hidden="true" />
                <div className="viz">
                  <Viz variant={VARIANTS[i % VARIANTS.length]} />
                </div>
                <span className="sweep" aria-hidden="true" />
              </div>

              <div className="project-info">
                <p className="project-meta">
                  <span className="kind">{project.kind}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.org}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </p>
                <h3>{project.name}</h3>
                <p className="summary">{project.summary}</p>
                <p className="detail">{project.detail}</p>
                <ul className="project-highlights">
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="project-tech" aria-label="Technologies used">
                  {project.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
