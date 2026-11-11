import { contact } from '../../data/projects'

/**
 * A short note in my own words (from the About and the story already on the site), signed
 * with a handwritten name that writes itself in when the note comes into view.
 */
export default function RvNote() {
  return (
    <section id="note" className="rv-note-sec" aria-labelledby="note-title">
      <div className="wrap">
        <div className="rv-letter" data-reveal>
          <h2 id="note-title" className="rv-title">
            The little things <em>matter to me.</em>
          </h2>
          <div className="rv-letter__cols">
            <p>
              I studied architecture, where I learned how people move through spaces and how small design changes shape what they feel. Now I bring that to product design: making complex work clear, so it has a real impact.
            </p>
            <p>
              It starts with asking the right questions. I tend to notice the small things and ask questions to understand what people need. Those conversations often shape where I start.
            </p>
          </div>
          <div className="rv-letter__foot">
            <a className="rv-pill" href={contact.calendly} target="_blank" rel="noreferrer">
              Let’s chat <span aria-hidden="true">↗</span>
              <span className="sr-only"> (Calendly, opens in a new tab)</span>
            </a>
            <svg className="rv-sign" viewBox="0 0 260 90" aria-label="Jb Yashvi" role="img">
              <text x="6" y="62">Jb Yashvi</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
