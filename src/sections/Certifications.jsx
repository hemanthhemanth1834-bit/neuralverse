import Reveal, { SectionHead } from '../components/Reveal.jsx'
import { certifications, achievements } from '../data/resume'
import { IconTrophy } from '../components/icons.jsx'

function issuerInitials(name) {
  if (!name) return 'CERT'
  return name
    .split(/[\s/·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Certifications() {
  return (
    <>
      <section id="certifications" className="section" aria-labelledby="certs-title">
        <div className="container">
          <SectionHead
            index="05"
            label="Certifications"
            title={<span id="certs-title">Credentials &amp; verified training</span>}
            lead="Ten certification and training programmes spanning Python, cloud, generative AI, cybersecurity and professional skills."
          />

          <div className="cert-grid" role="list" aria-label="Certifications list">
            {certifications.map((cert, i) => (
              <Reveal key={cert.name} delay={(i % 3) * 0.07}>
                <article className="glass-card cert-card" role="listitem">
                  <span className="edge" aria-hidden="true" />
                  <span className="cert-glyph" aria-hidden="true">
                    {issuerInitials(cert.issuer)}
                  </span>
                  <h3>{cert.name}</h3>
                  <p className="issuer">{cert.issuer || 'Verified programme'}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="section" aria-labelledby="achv-title">
        <div className="container">
          <SectionHead index="06" label="Achievements" title={<span id="achv-title">Milestones worth noting</span>} />
          <div className="achievements-band" role="list" aria-label="Achievements list">
            {achievements.map((a, i) => (
              <Reveal key={a} delay={i * 0.06} y={22}>
                <div className="achievement" role="listitem">
                  <IconTrophy aria-hidden="true" />
                  <p>{a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
