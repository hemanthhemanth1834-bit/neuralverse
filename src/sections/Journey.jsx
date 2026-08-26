import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Reveal, { SectionHead } from '../components/Reveal.jsx'
import { experience, education } from '../data/resume'
import { IconTrophy } from '../components/icons.jsx'

function ExperienceTimeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <div className="timeline" ref={ref} aria-label="Experience timeline">
      <motion.span
        className="progress"
        aria-hidden="true"
        style={{ scaleY: progress }}
      />
      <ol>
        {experience.map((job, i) => (
          <Reveal as="li" key={job.company} delay={i * 0.05} y={22}>
            <div className="tl-item">
              <div className="tl-top">
                <h3>{job.position}</h3>
                <span className="tl-period">{job.period}</span>
                <span className="tl-type">{job.type}</span>
              </div>
              <p className="tl-org">{job.company}</p>
              <ul>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {job.achievement && (
                <p className="tl-achievement">
                  <IconTrophy /> {job.achievement}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

export default function Journey() {
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container">
        <SectionHead
          index="03"
          label="Experience & Education"
          title={<span id="journey-title">The journey so far</span>}
          lead="Internships, enterprise job simulations and the academic track behind them."
        />

        <div className="journey-grid">
          <ExperienceTimeline />

          <div>
            <Reveal>
              <h3 className="journey-subhead">Education</h3>
            </Reveal>
            <div className="timeline">
              <span className="progress" style={{ '--tp': 1 }} aria-hidden="true" />
              <ol>
                {education.map((ed, i) => (
                  <Reveal as="li" key={ed.school} delay={i * 0.08} y={22}>
                    <div className="tl-item">
                      <div className="tl-top">
                        <h3>{ed.degree}</h3>
                      </div>
                      <p className="tl-org">
                        {ed.school} · {ed.location}
                      </p>
                      <span className="tl-period">{ed.period}</span>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
