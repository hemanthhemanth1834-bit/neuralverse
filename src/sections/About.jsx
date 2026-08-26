import Reveal, { SectionHead } from '../components/Reveal.jsx'
import TiltCard from '../components/TiltCard.jsx'
import { profile, aboutParagraphs, stats } from '../data/resume'

const INTERESTS = ['Machine Learning Systems', 'Data Analytics', 'Generative AI', 'Cloud Platforms']

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHead
          index="01"
          label="About"
          title={<span id="about-title">Engineering intelligence, one dataset at a time</span>}
        />

        <div className="about-grid">
          <Reveal className="about-copy" delay={0.05}>
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div>
              <p style={{ marginBottom: '0.7rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Current focus areas
              </p>
              <div className="about-interests" role="list" aria-label="Current focus areas">
                {INTERESTS.map((t) => (
                  <span key={t} className="chip" role="listitem">
                    <span className="dot" aria-hidden="true" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ position: 'relative' }}>
              <TiltCard className="profile-card" aria-label={`Profile summary — ${profile.name}`}>
                <div className="profile-head">
                  <div className="profile-avatar" aria-hidden="true">
                    <svg viewBox="0 0 74 82" fill="none">
                      <polygon points="37,3 70,21 70,61 37,79 4,61 4,21" stroke="url(#pa-g)" strokeWidth="1.5" />
                      <defs>
                        <linearGradient id="pa-g" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#38bdf8" />
                          <stop offset="1" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <b>HK</b>
                  </div>
                  <div className="profile-id">
                    <h3>{profile.name}</h3>
                    <p>{profile.role}</p>
                  </div>
                </div>

                <dl className="profile-facts">
                  <div className="profile-fact-row">
                    <dt>Degree</dt>
                    <dd>B.Tech in Artificial Intelligence · SRK Institute of Technology</dd>
                  </div>
                  <div className="profile-fact-row">
                    <dt>Class of</dt>
                    <dd>2028</dd>
                  </div>
                  <div className="profile-fact-row">
                    <dt>Based in</dt>
                    <dd>{profile.location}</dd>
                  </div>
                  <div className="profile-fact-row">
                    <dt>Status</dt>
                    <dd>Open to internships &amp; collaborations</dd>
                  </div>
                </dl>

                <div className="profile-stats">
                  {stats.map((s) => (
                    <div key={s.label} className="stat">
                      <b>{s.value}+</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </TiltCard>

              <span className="float-badge f1" aria-hidden="true">Python</span>
              <span className="float-badge f2" aria-hidden="true">AWS Cloud</span>
              <span className="float-badge f3" aria-hidden="true">Generative AI</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
