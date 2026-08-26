import { profile } from '../data/resume'
import Magnetic from '../components/Magnetic.jsx'
import { IconChevronUp, IconLinkedIn, IconMail, IconPhone } from '../components/icons.jsx'

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <b>{profile.name}</b>
          <span>Designed &amp; engineered as an interactive portfolio</span>
        </div>

        <div className="footer-links" role="navigation" aria-label="Social links and navigation">
          <a
            className="icon-btn"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`LinkedIn — ${profile.linkedinLabel}`}
          >
            <IconLinkedIn />
          </a>
          <a className="icon-btn" href={`mailto:${profile.email}`} aria-label={`Email — ${profile.email}`}>
            <IconMail />
          </a>
          <a
            className="icon-btn"
            href={`tel:${profile.phone.replace(/-/g, '')}`}
            aria-label={`Phone — ${profile.phone}`}
          >
            <IconPhone />
          </a>
          <Magnetic strength={0.3}>
            <button type="button" className="to-top" onClick={toTop} aria-label="Back to top of page">
              <IconChevronUp />
            </button>
          </Magnetic>
        </div>

        <div className="footer-copy mono">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Rajahmundry · Andhra Pradesh · India</span>
        </div>
      </div>
    </footer>
  )
}
