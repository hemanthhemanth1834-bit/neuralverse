import { useState } from 'react'
import Reveal, { SectionHead } from '../components/Reveal.jsx'
import { skillClusters, skillNotes } from '../data/resume'

export default function Skills() {
  const [selected, setSelected] = useState('Python')
  const note = skillNotes[selected]

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead
          index="02"
          label="Technical Skills"
          title={<span id="skills-title">A stack built around intelligence &amp; data</span>}
          lead="Select any skill to see how it has been applied across internships, simulations and certifications."
        />

        <div className="skills-layout">
          <div className="skills-grid" role="group" aria-label="Skill categories">
            {skillClusters.map((cluster, ci) => (
              <Reveal key={cluster.id} delay={ci * 0.06}>
                <article
                  className="glass-card skill-cluster"
                  style={{ '--cluster-color': cluster.color }}
                  aria-label={`${cluster.label} skills`}
                >
                  <span className="edge" aria-hidden="true" />
                  <header>
                    <span className="swatch" aria-hidden="true" />
                    <h3>{cluster.label}</h3>
                    <span className="count" aria-hidden="true">{String(cluster.skills.length).padStart(2, '0')}</span>
                  </header>
                  <div className="skill-chips" role="radiogroup" aria-label={`${cluster.label} skill selection`}>
                    {cluster.skills.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`chip${selected === s ? ' is-active' : ''}`}
                        style={{ '--chip-accent': cluster.color }}
                        onMouseEnter={() => setSelected(s)}
                        onFocus={() => setSelected(s)}
                        onClick={() => setSelected(s)}
                        role="radio"
                        aria-checked={selected === s}
                        aria-label={s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="skill-note" aria-live="polite" aria-atomic="true">
              <span className="glyph" aria-hidden="true">
                {selected.slice(0, 2).toUpperCase()}
              </span>
              <p>
                <b>{selected}</b> — {note || 'Applied across academic and internship project work.'}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
