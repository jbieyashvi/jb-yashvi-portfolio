import '../case-rv.css'
import DeviceMockup from '../components/DeviceMockup'
import External from '../components/External'
import Flow from '../components/Flow'
import NextProject from '../components/NextProject'
import ProjectHeader from '../components/ProjectHeader'
import useTitle from '../components/useTitle'
import { getProject } from '../data/projects'

const LINK = 'https://jbieyashvi.github.io/retina-prototype/'
const R = { w: 680, h: 1400 }

export default function Retina() {
  useTitle('Retina.ai, store staff mobile app | Jb Yashvi')
  return (
    <article className="rv-case">
      <ProjectHeader
        name="Retina.ai"
        type="Store staff mobile app"
        intro={
          <>
            <p className="lede">
              A focused app for store staff: find the articles assigned to your site, scan each barcode, photograph the
              product and submit it, without losing work when an upload fails.
            </p>
            <p>
              It is one app within the larger Retina.ai project; the rest of the platform isn’t part of this showcase. My
              contribution is the app’s interactive prototype, shown here, which I built fully with AI.
            </p>
          </>
        }
        meta={[
          { label: 'Product', value: 'Store staff mobile app, part of Retina.ai' },
          { label: 'Users', value: 'Store staff' },
          { label: 'Shown here', value: 'Interactive prototype' },
          { label: 'Use of AI', value: 'Prototype built fully with AI' },
        ]}
        actions={<External href={LINK}>View interactive prototype</External>}
      />

      <section className="wrap showcase" aria-label="Prototype preview">
        <DeviceMockup mockup={getProject('retina').mockup!} tone="paper" eager className="mock--hero" />
      </section>

      <section className="wrap walkthrough" aria-labelledby="walk-title">
        <h2 id="walk-title" className="section-title">The workflow, step by step</h2>

        <Flow
          step={1}
          title="Find assigned articles"
          screens={[
            { src: '/work/retina/articles.webp', alt: 'Article list filtered by category, with one failed upload flagged at the top.', caption: 'Articles to scan, filterable by category', ...R },
            { src: '/work/retina/not-in-store.webp', alt: 'Form to mark an article as not in store, with reasons.', caption: 'Flag an article that isn’t stocked', ...R },
          ]}
        >
          <p>
            Staff see the articles assigned to their site, split into To scan, Mapped and Loose Items, and can filter by
            category. If an article isn’t stocked, they can mark it as not in store with a reason.
          </p>
        </Flow>

        <Flow
          step={2}
          title="Scan the barcode, capture the product"
          screens={[
            { src: '/work/retina/scan.webp', alt: 'Barcode scanner with an alignment frame and a photo fallback.', caption: 'Scan, or take a photo if it fails', ...R },
            { src: '/work/retina/capture.webp', alt: 'Capture screen with Front, Back, Barcode and More steps.', caption: 'Front, back and barcode images', ...R },
          ]}
        >
          <p>
            Opening an article starts the barcode scanner, with a photo fallback when the code can’t be read. Staff then
            capture front, back and barcode images in order, and can add more if needed.
          </p>
        </Flow>

        <Flow
          step={3}
          title="Submit and see what was sent"
          screens={[
            { src: '/work/retina/submitted.webp', alt: 'Submitted state with the next articles to scan.', caption: 'Submitted, with what’s next', ...R },
            { src: '/work/retina/done.webp', alt: 'Submission details: article code, barcode, images sent, time and status.', caption: 'Completion details', ...R },
          ]}
        >
          <p>
            After submitting, staff get a confirmation with the article code, barcode, number of images, time and status,
            plus a direct path to the next article.
          </p>
        </Flow>

        <Flow
          step={4}
          title="Retry failed uploads, track progress"
          screens={[
            { src: '/work/retina/retry.webp', alt: 'Upload failed screen saying images were saved and can be retried.', caption: 'Retry without rescanning', ...R },
            { src: '/work/retina/progress.webp', alt: 'Progress screen with weekly and monthly counts and a daily breakdown.', caption: 'Weekly and monthly progress', ...R },
          ]}
        >
          <p>
            When a connection drops, the captured images are kept, so a failed upload is one tap to retry rather than a
            rescan. A progress view shows articles scanned this week, this month and per day.
          </p>
        </Flow>

        <div className="end-cta">
          <External href={LINK}>View interactive prototype</External>
        </div>
      </section>

      <NextProject slug="retina" />
    </article>
  )
}
