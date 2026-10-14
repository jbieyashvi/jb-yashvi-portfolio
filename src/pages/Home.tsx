import { useEffect, useState, type MouseEvent } from 'react'
import HeroCanvas from '../components/HeroCanvas'
import HowIWork from '../components/HowIWork'
import IdeasInMotion from '../components/IdeasInMotion'
import Journey from '../components/Journey'
import OutsideTeaser from '../components/OutsideTeaser'
import useTitle from '../components/useTitle'
import WorkShowcase from '../components/WorkShowcase'
import { contact } from '../data/projects'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }
  return (
    <button type="button" className={`ccopy${copied ? ' is-copied' : ''}`} onClick={copy}>
      {copied ? (
        <>
          <span aria-hidden="true">✓</span> Copied
        </>
      ) : (
        'Copy email'
      )}
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</span>
    </button>
  )
}

/** Back to the start of the page, without leaving #main in the address bar */
function toTop(e: MouseEvent) {
  e.preventDefault()
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' })
  document.getElementById('main')?.focus({ preventScroll: true })
}

const noop = () => {}

export default function Home() {
  useTitle('Jb Yashvi, Senior Product Designer')
  // iOS Safari only applies :active (the images' colour during a press) once a touch listener
  // exists; a passive one never delays or cancels a tap
  useEffect(() => {
    document.addEventListener('touchstart', noop, { passive: true })
    return () => document.removeEventListener('touchstart', noop)
  }, [])
  return (
    <>
      <HeroCanvas />

      <section id="work" className="work" aria-labelledby="work-title" tabIndex={-1}>
        <WorkShowcase />
      </section>

      <HowIWork />

      <section id="about" className="about" aria-labelledby="about-title" tabIndex={-1}>
        <div className="wrap">
          <div className="mod mod--about" data-reveal>
            <div className="mod__cell mod__cell--dark about__intro-cell">
              <h2 id="about-title" className="about__label">A little about me</h2>
              <p className="about__intro">
                I’m Jb Yashvi
                <img className="about__avatar" src="/about/cafe-avatar.webp" width={240} height={240} alt="" loading="lazy" decoding="async" />,
                a senior product designer at Heizen, focused on supply chain and operational products.
              </p>
            </div>

            <figure className="mod__cell mod__photo about__portrait">
              <img
                src="/about/portrait-purple-sari.webp"
                srcSet="/about/portrait-purple-sari-700.webp 700w, /about/portrait-purple-sari.webp 1000w"
                sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 22vw"
                width={1000}
                height={1250}
                alt="Jb Yashvi in a purple sari, smiling in a sunlit room"
                loading="lazy"
                decoding="async"
              />
              <figcaption>That’s me</figcaption>
            </figure>

            <figure className="mod__cell mod__photo about__model">
              <img
                src="/about/assembling-a-model.webp"
                srcSet="/about/assembling-a-model-700.webp 700w, /about/assembling-a-model.webp 1200w"
                sizes="(max-width: 1100px) 46vw, 36vw"
                width={1200}
                height={900}
                alt="Jb Yashvi at a table, assembling a building-block model from an instruction booklet"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Assembling a model</figcaption>
            </figure>

            <div className="mod__cell about__meta">
              <dl className="about__facts">
                <div>
                  <dt>Currently</dt>
                  <dd>Senior product designer at Heizen</dd>
                </div>
                <div>
                  <dt>Experience in</dt>
                  <dd>Logistics, procurement, inventory and <span className="keep">multi-role</span> operational workflows</dd>
                </div>
                <div>
                  <dt>Skills</dt>
                  <dd>
                    <ul className="about__skills">
                      <li>Product Design</li>
                      <li>User Research</li>
                      <li>UI Design</li>
                      <li>AI Prototyping</li>
                    </ul>
                  </dd>
                </div>
                {/* phones only: the hero drops its tools label, so the tools are listed here */}
                <div className="about__tools">
                  <dt>Tools</dt>
                  <dd>
                    <ul className="about__skills">
                      <li>Figma</li>
                      <li>Claude</li>
                      <li>Codex</li>
                    </ul>
                  </dd>
                </div>
              </dl>
              <div className="about__foot">
                <a className="btn btn--ghost" href={contact.resume} target="_blank" rel="noreferrer">
                  View résumé <span aria-hidden="true" className="btn__icon">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>

            <figure className="mod__cell mod__photo about__desk">
              <img
                src="/about/desk-warm-light.webp"
                width={800}
                height={800}
                alt="A desk by a window, lit by a small warm lamp"
                loading="lazy"
                decoding="async"
              />
              <figcaption>My desk</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Journey />

      <section id="outside" className="outside" aria-labelledby="outside-title" tabIndex={-1}>
        <OutsideTeaser />
      </section>

      <IdeasInMotion />

      <section id="contact" className="contact" aria-labelledby="contact-title" tabIndex={-1}>
        <div className="wrap" data-reveal>
          <div className="cgrid">
            <div className="cgrid__main">
              <h2 id="contact-title" className="contact__title">Let’s make something useful.</h2>
              <div className="contact__actions">
                <p className="contact__lead">Have a project in mind? Let’s talk.</p>
                <a className="btn btn--light contact__book" href={contact.calendly} target="_blank" rel="noreferrer">
                  Book a call <span aria-hidden="true" className="btn__icon">↗</span>
                  <span className="sr-only"> (Calendly, opens in a new tab)</span>
                </a>
                <div className="contact__mail">
                  <span className="contact__or">Or email</span>
                  <a className="contact__email" href={`mailto:${contact.email}`}>{contact.email}</a>
                  <CopyEmail />
                </div>
              </div>
            </div>
            <ul className="cgrid__links">
              <li>
                <a className="clink" href={contact.linkedin} target="_blank" rel="noreferrer">
                  <span className="clink__label">LinkedIn</span>
                  <span className="clink__detail">{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                  <span className="clink__arrow" aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a className="clink" href={contact.instagram} target="_blank" rel="noopener noreferrer">
                  <span className="clink__label">Prototype demos</span>
                  <span className="clink__detail">Instagram, @{contact.instagram.split('/').filter(Boolean).pop()}</span>
                  <span className="clink__arrow" aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a className="clink" href={contact.resume} target="_blank" rel="noreferrer">
                  <span className="clink__label">View résumé PDF</span>
                  <span className="clink__detail">Opens in a new tab</span>
                  <span className="clink__arrow" aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a className="clink" href="#main" onClick={toTop}>
                  <span className="clink__label">Back to top</span>
                  <span className="clink__detail">Return to the start</span>
                  <span className="clink__arrow" aria-hidden="true">↑</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
