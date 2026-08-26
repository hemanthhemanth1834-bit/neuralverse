import { useRef, useState } from 'react'
import Reveal, { SectionHead } from '../components/Reveal.jsx'
import Magnetic from '../components/Magnetic.jsx'
import { profile } from '../data/resume'
import { IconMail, IconLinkedIn, IconSend } from '../components/icons.jsx'

const EMAIL = profile.email

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [touched, setTouched] = useState({})
  const formRef = useRef(null)

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value })
    if (errors[key]) setErrors({ ...errors, [key]: null })
  }

  const onBlur = (key) => () => {
    setTouched({ ...touched, [key]: true })
    const fieldErrors = validateField(key, form[key])
    if (fieldErrors) setErrors({ ...errors, [key]: fieldErrors })
  }

  const validateField = (key, value) => {
    if (key === 'name' && !value.trim()) return 'Please enter your name.'
    if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
    if (key === 'subject' && !value.trim()) return 'Add a short subject.'
    if (key === 'message' && value.trim().length < 10) return 'Message should be at least 10 characters.'
    return null
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.subject.trim()) next.subject = 'Add a short subject.'
    if (form.message.trim().length < 10) next.message = 'Message should be at least 10 characters.'
    return next
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    setTouched({ name: true, email: true, subject: true, message: true })
    if (Object.keys(next).length > 0) {
      // Focus first field with error
      const firstError = Object.keys(next)[0]
      formRef.current?.querySelector(`#cf-${firstError}`)?.focus()
      return
    }

    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    const subject = encodeURIComponent(form.subject)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const fieldErrorId = (key) => `cf-${key}-err`

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container contact-wrap">
        <Reveal>
          <div className="glass-card contact-panel">
            <span className="contact-orb" aria-hidden="true" />

            <SectionHead
              center
              index="07"
              label="Contact"
              title={<span id="contact-title">Let&apos;s build something great</span>}
              lead="Open to internships, collaborations and conversations about AI, ML and data. The fastest route is email — I usually reply within a day."
            />

            <div className="contact-actions">
              <Magnetic strength={0.25}>
                <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                  Email Me <IconSend width={16} height={16} />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer noopener">
                  LinkedIn <IconLinkedIn width={15} height={15} />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a className="btn btn-ghost" href={`tel:${profile.phone.replace(/-/g, '')}`}>
                  {profile.phone}
                </a>
              </Magnetic>
            </div>

            <form
              ref={formRef}
              className="contact-form"
              onSubmit={onSubmit}
              noValidate
              aria-label="Contact form"
            >
              <div className="field">
                <input
                  id="cf-name"
                  type="text"
                  placeholder=" "
                  value={form.name}
                  onChange={set('name')}
                  onBlur={onBlur('name')}
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.name && touched.name)}
                  aria-describedby={errors.name && touched.name ? fieldErrorId('name') : undefined}
                />
                <label htmlFor="cf-name">
                  Your name <span aria-hidden="true">*</span>
                </label>
                {errors.name && touched.name && (
                  <p className="error" id={fieldErrorId('name')} role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <input
                  id="cf-email"
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={set('email')}
                  onBlur={onBlur('email')}
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? fieldErrorId('email') : undefined}
                />
                <label htmlFor="cf-email">
                  Email address <span aria-hidden="true">*</span>
                </label>
                {errors.email && touched.email && (
                  <p className="error" id={fieldErrorId('email')} role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="field full">
                <input
                  id="cf-subject"
                  type="text"
                  placeholder=" "
                  value={form.subject}
                  onChange={set('subject')}
                  onBlur={onBlur('subject')}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.subject && touched.subject)}
                  aria-describedby={errors.subject && touched.subject ? fieldErrorId('subject') : undefined}
                />
                <label htmlFor="cf-subject">
                  Subject <span aria-hidden="true">*</span>
                </label>
                {errors.subject && touched.subject && (
                  <p className="error" id={fieldErrorId('subject')} role="alert">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="field full">
                <textarea
                  id="cf-message"
                  placeholder=" "
                  value={form.message}
                  onChange={set('message')}
                  onBlur={onBlur('message')}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.message && touched.message)}
                  aria-describedby={errors.message && touched.message ? fieldErrorId('message') : undefined}
                />
                <label htmlFor="cf-message">
                  Message <span aria-hidden="true">*</span>
                </label>
                {errors.message && touched.message && (
                  <p className="error" id={fieldErrorId('message')} role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="form-foot">
                <p className="form-note">
                  Submitting opens your email app with the message pre-filled — nothing is sent through this website.
                </p>
                <button type="submit" className="btn btn-primary">
                  Compose Email <IconMail width={16} height={16} />
                </button>
              </div>

              <p className="form-status full" role="status" aria-live="polite">
                {sent ? 'Your email app should now be open — thanks for reaching out.' : ''}
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
