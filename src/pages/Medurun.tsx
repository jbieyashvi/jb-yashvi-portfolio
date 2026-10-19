import DeviceMockup from '../components/DeviceMockup'
import External from '../components/External'
import MotionPreview from '../components/MotionPreview'
import NextProject from '../components/NextProject'
import ProjectHeader from '../components/ProjectHeader'
import useTitle from '../components/useTitle'
import { getProject } from '../data/projects'

const LIVE = 'https://jbieyashvi.github.io/medurun-landing-page/'

const highlights = [
  {
    title: 'A night-city hero with the dispatch sequence built in',
    body: 'The opening frame pairs an ambulance on a night street with a serif headline, and a thin line underneath traces Request, Dispatch, Track and Care.',
    img: '/work/medurun/hero.webp',
    alt: 'Medurun hero section with a night street, an ambulance and the Request, Dispatch, Track, Care line.',
  },
  {
    title: 'A positioning statement that sharpens as you scroll',
    body: 'The statement starts blurred and comes into focus on scroll, with key phrases set in red. Below it, a five-step emergency network runs from patient request to hospital ready.',
    img: '/work/medurun/positioning.webp',
    alt: 'Positioning section: large serif statement with phrases in red, above a five-step emergency network line.',
  },
  {
    title: 'Services as a list beside one large image',
    body: 'A dark services section keeps one large photograph in place while the service list sits beside it.',
    img: '/work/medurun/services.webp',
    alt: 'Services section on dark navy with an ambulance photo and a list of services.',
  },
  {
    title: 'A route that draws itself through “How it works”',
    body: 'As the visitor scrolls, a red route line advances across a grid and the matching step (Request, Dispatch, Track, Care) becomes active.',
    img: '/work/medurun/how2.webp',
    alt: 'How it works section: a red route line on a grid next to four steps, with Care highlighted.',
  },
  {
    title: 'Reasons to trust it, one card at a time',
    body: 'The “Why Medurun” section moves through image cards with a counter, so each point gets its own frame.',
    img: '/work/medurun/why.webp',
    alt: 'Why Medurun section with a large image card titled Trust and a 01 of 04 counter.',
  },
  {
    title: 'A direct contact block',
    body: 'The page ends with a helpline and separate contacts for support, partnerships and drivers, so each visitor knows who to reach.',
    img: '/work/medurun/contact.webp',
    alt: 'Contact section on dark navy with a helpline number and team email addresses.',
  },
]

export default function Medurun() {
  useTitle('Medurun, ambulance-booking platform landing page | Jb Yashvi')
  return (
    <article>
      <ProjectHeader
        name="Medurun"
        type="Ambulance-booking platform landing page"
        intro={
          <>
            <p className="lede">
              Medurun is an ambulance-booking and emergency healthcare-mobility platform. Its landing page introduces the
              network to patients, hospitals, agencies and ambulance crews.
            </p>
            <p>
              I built this landing page fully with AI, and it is live on the web. Medurun also has admin, user and driver
              apps; they aren’t part of this showcase.
            </p>
          </>
        }
        meta={[
          { label: 'Showcased', value: 'Landing page' },
          { label: 'How it was made', value: 'Built fully with AI' },
          { label: 'Status', value: 'Live website' },
        ]}
        actions={<External href={LIVE}>View AI prototype</External>}
      />

      <section className="wrap showcase" aria-label="Website preview">
        <DeviceMockup mockup={getProject('medurun').mockup!} tone="paper" eager className="mock--hero" />
      </section>

      <section className="wrap split" aria-labelledby="motion-title">
        <div className="split__text">
          <h2 id="motion-title" className="section-title">In motion</h2>
          <p>
            A 27-second screen recording of the live page, scrolling from the hero through the positioning statement, the
            emergency network and “How it works”. It plays muted and pauses when it leaves the screen.
          </p>
        </div>
        <div className="split__media">
          <MotionPreview
            src="/work/medurun/scroll.webm"
            poster="/work/medurun/scroll-poster.webp"
            label="Screen recording scrolling through the live Medurun landing page"
          />
        </div>
      </section>

      <section className="wrap highlights" aria-labelledby="hl-title">
        <h2 id="hl-title" className="section-title">Visual and interaction highlights</h2>
        <div className="highlights__list">
          {highlights.map((h) => (
            <figure key={h.title} className="highlight">
              <img src={h.img} alt={h.alt} width={1600} height={1000} loading="lazy" decoding="async" />
              <figcaption>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </figcaption>
            </figure>
          ))}
          <figure className="highlight highlight--mobile">
            <img className="shot" src="/work/medurun/mobile-hero.webp" alt="Medurun hero on a phone screen." width={780} height={1688} loading="lazy" decoding="async" />
            <figcaption>
              <h3>Holds up on a phone</h3>
              <p>On mobile the hero keeps its headline, both actions and the night-street image within the first screen.</p>
            </figcaption>
          </figure>
        </div>
        <div className="end-cta">
          <External href={LIVE}>View AI prototype</External>
        </div>
      </section>

      <NextProject slug="medurun" />
    </article>
  )
}
