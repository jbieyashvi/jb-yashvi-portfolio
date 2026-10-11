import DeviceMockup from '../components/DeviceMockup'
import External from '../components/External'
import Flow from '../components/Flow'
import NextProject from '../components/NextProject'
import ProjectHeader from '../components/ProjectHeader'
import useTitle from '../components/useTitle'
import { getProject } from '../data/projects'

const LINK = 'https://jbieyashvi.github.io/iica-mobile-app-prototype/#/home'

export default function Iica() {
  useTitle('IICA, creator collaboration mobile app | Jb Yashvi')
  return (
    <article>
      <ProjectHeader
        name="IICA"
        type="Creator collaboration mobile app"
        intro={
          <>
            <p className="lede">
              IICA is a mobile app for creators, artists and influencers: a place to discover people, view their profiles,
              find collaborators, attend events, take classes and shop.
            </p>
            <p>
              My contribution is the app’s interactive prototype, shown here, which I built fully with AI to work out
              these flows. You can tap through it in the browser.
            </p>
          </>
        }
        meta={[
          { label: 'Product', value: 'Mobile app for creators, artists and influencers' },
          { label: 'Shown here', value: 'Interactive prototype' },
          { label: 'Use of AI', value: 'Prototype built fully with AI' },
          { label: 'Areas', value: 'Discovery, profiles, collaboration, events, classes, shopping' },
        ]}
        actions={<External href={LINK}>View interactive prototype</External>}
      />

      <section className="wrap showcase" aria-label="Prototype preview">
        <DeviceMockup mockup={getProject('iica').mockup!} tone="paper" eager className="mock--hero" />
      </section>

      <section className="wrap walkthrough" aria-labelledby="walk-title">
        <h2 id="walk-title" className="section-title">Selected flows</h2>

        <Flow
          title="Discover creators"
          screens={[
            { src: '/work/iica/home.webp', alt: 'Home screen.', caption: 'Home: spotlight, quick actions and the catalogue' },
            { src: '/work/iica/catalogue.webp', alt: 'Artist catalogue with featured profiles and an A to Z index.', caption: 'Catalogue with an A–Z index' },
            { src: '/work/iica/profile.webp', alt: 'Artist profile screen.', caption: 'A creator’s profile' },
          ]}
        >
          <p>
            Home leads into the catalogue of artists, coaches, athletes and venues. Each profile shows the creator’s
            discipline, location and followers, with a direct way to request a collaboration.
          </p>
        </Flow>

        <Flow
          title="Find a collaborator"
          screens={[
            { src: '/work/iica/collaborate.webp', alt: 'Collaborate screen with a text field to describe the collaborator you need.', caption: 'Describe who you’re looking for' },
            { src: '/work/iica/matches.webp', alt: 'Swipeable match card showing a 92% match.', caption: 'Swipe through suggested matches' },
            { src: '/work/iica/match-detail.webp', alt: 'Match details explaining why two creators match.', caption: 'See why a match was suggested' },
          ]}
        >
          <p>
            A creator describes the collaborator they need in their own words, then reviews suggested matches one card at a
            time and opens the details behind each one.
          </p>
        </Flow>

        <Flow
          title="Events, classes and shopping"
          screens={[
            { src: '/work/iica/event.webp', alt: 'Event detail screen.', caption: 'Event details and tickets' },
            { src: '/work/iica/shop.webp', alt: 'Shop with a featured masterclass and product types.', caption: 'Shop: masterclasses, digital and physical' },
            { src: '/work/iica/masterclass.webp', alt: 'Masterclass detail for The Art of Indian Songwriting.', caption: 'A masterclass page' },
          ]}
        >
          <p>
            Events show the date, venue, spots left and ticket price. Classes are sold as masterclasses in the shop, alongside digital
            and physical products from creators.
          </p>
        </Flow>

        <div className="end-cta">
          <External href={LINK}>View interactive prototype</External>
        </div>
      </section>

      <NextProject slug="iica" />
    </article>
  )
}
