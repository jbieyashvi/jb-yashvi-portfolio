import { useLightbox } from './Lightbox'
import type { ImageItem } from '../data/images'
import loadAhead from './loadAhead'

const FROM_PDF = 'From the NUTRIO case study PDF'

/** Every statement here comes from the NUTRIO case study PDF. */
const plans = [
  { name: 'Schedule once', tag: 'Try out', body: 'Plan a meal for a specific time.', who: 'Perfect for first-time users' },
  { name: '7 days plan', tag: 'Short term', body: 'Build consistency without long commitment.', who: 'Ideal for trying a routine' },
  { name: '30 days plan', tag: 'Long term', body: 'Full subscription for disciplined living.', who: 'Best for long-term habits' },
]

const surfaces = [
  { name: 'Customer app', body: 'Order a meal now or subscribe to a plan, schedule deliveries, customise meals, wishlist and checkout.' },
  { name: 'Delivery partner app', body: 'Helps riders deliver faster, manage orders easily and stay efficient.' },
  { name: 'Kitchen panel', body: 'Handle approvals, prepare orders and manage deliveries from a single interface.' },
  { name: 'Admin dashboard', body: 'Analytics on orders, subscriptions and users; product management; delivery staff onboarding, document verification and payments.' },
]

const shots: (ImageItem & { body: string })[] = [
  {
    slug: 'plans',
    src: '/work/nutrio/plans',
    w: 1800,
    h: 978,
    caption: 'Explore plans: three levels of commitment',
    body: 'After choosing to plan ahead, people pick how far to commit. Each card says who it suits.',
    alt: 'NUTRIO case study excerpt: “OR Explore Plans, choose a plan based on your commitment level”, with three cards: Schedule Once (Try Out), 7 Days Plan (Short Term) and 30 Days Plan (Long Term), each above a phone showing the Buddha Fuel Bowl order-later screen.',
    label: FROM_PDF,
  },
  {
    slug: 'schedule',
    src: '/work/nutrio/schedule',
    w: 1800,
    h: 910,
    caption: 'Schedule your delivery',
    body: 'Every plan leads to the same step: pick a date and a time that fits the routine.',
    alt: 'NUTRIO case study excerpt: Schedule Your Delivery, with a Select Date & Time card showing Schedule Once at ₹546, a week of dates from 12 to 18 January and a Choose Time button, beside a time picker set to 06:00 PM with Cancel and Save.',
    label: FROM_PDF,
  },
  {
    slug: 'meals',
    src: '/work/nutrio/meals',
    w: 1800,
    h: 1084,
    caption: 'Customise the meal, and choose meals per day',
    body: 'Adjust ingredients and portions, then keep the same bowl every day or pick a different one for each day.',
    alt: 'NUTRIO case study excerpt: Customize Your Meal, a phone with protein options and portion steppers; then How Would You Like Your Meals?, phones showing a 30-day plan with a different bowl chosen for Monday and Tuesday, and a list of bowls to choose from.',
    label: FROM_PDF,
  },
]

export default function NutrioStory() {
  const { open, lightbox } = useLightbox(shots)
  return (
    <>
      <section id="glance" className="wrap glance" aria-labelledby="glance-title" tabIndex={-1}>
        <h2 id="glance-title" className="section-title">At a glance</h2>
        <dl className="glance__list">
          <div>
            <dt>User</dt>
            <dd>Busy professionals and parents, plus gym users, families and lifestyle-focused people who want to eat well.</dd>
          </div>
          <div>
            <dt>Problem</dt>
            <dd>Healthy eating needs daily planning, shopping and cooking, so meals get skipped or replaced with unhealthy options.</dd>
          </div>
          <div>
            <dt>What I did</dt>
            <dd>User research and end-to-end UX/UI design across four connected products. No AI used.</dd>
          </div>
          <div>
            <dt>Delivered</dt>
            <dd>Designs for all four products, through design handoff.</dd>
          </div>
        </dl>
      </section>

      <section id="problem" className="wrap split" aria-labelledby="problem-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="problem-title" className="section-title">User and problem</h2>
          <p>
            Maintaining healthy eating requires daily planning, grocery shopping and cooking. Busy professionals and
            parents often skip meals or rely on unhealthy alternatives.
          </p>
        </div>
        <div className="split__media contrib">
          <div className="contrib__part">
            <h3>The idea</h3>
            <p>
              Scheduled meal subscriptions, tailored for gym users, families and lifestyle-focused people. Customise,
              automate and manage nutrition in one simple app.
            </p>
          </div>
          <div className="contrib__part">
            <h3>The goal</h3>
            <p>
              Make healthy eating consistent, stress-free and predictable: save time, reduce daily decisions and build
              routines that last.
            </p>
          </div>
        </div>
      </section>

      <section id="flow" className="wrap split" aria-labelledby="flow-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="flow-title" className="section-title">Workflow</h2>
          <p>
            One meal can be ordered two ways. Behind the customer app, three more products keep each order moving.
          </p>
        </div>
        <div className="split__media">
          <ol className="steps">
            <li><strong>Choose how to order.</strong> Order now for an instant craving, or explore plans to eat on a schedule.</li>
            <li><strong>Order now:</strong> select a meal, add to cart, check out.</li>
            <li><strong>Or pick a plan:</strong> schedule once, 7 days or 30 days.</li>
            <li><strong>Schedule the delivery.</strong> Pick a date and time; modify or cancel up to 2 hours before delivery.</li>
            <li><strong>Make it yours.</strong> Adjust ingredients and portions; keep one bowl every day or choose per day.</li>
          </ol>
          <ul className="surfaces">
            {surfaces.map((s) => (
              <li key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="decisions" className="wrap ds" aria-labelledby="decisions-title" tabIndex={-1}>
        <div className="ds__head">
          <h2 id="decisions-title" className="section-title">Key design decisions</h2>
          <p>From instant cravings to long-term discipline: the ordering flow adapts to how committed someone is today.</p>
        </div>
        <ol className="dlist dlist--wide">
          <li className="dlist__item">
            <h3>Two ways in, not one funnel</h3>
            <p>
              Order now stays fast and frictionless for instant cravings. Plans sit beside it rather than in front of it,
              so a subscription is a choice, not a hurdle.
            </p>
          </li>
          <li className="dlist__item">
            <h3>Commitment in steps</h3>
            <p>Plans are chosen by commitment level, and each one says who it is for:</p>
            <ul className="plans">
              {plans.map((p) => (
                <li key={p.name} className="plan">
                  <p className="plan__tag">{p.tag}</p>
                  <h4>{p.name}</h4>
                  <p>{p.body}</p>
                  <p className="plan__who">→ {p.who}</p>
                </li>
              ))}
            </ul>
          </li>
          <li className="dlist__item">
            <h3>Flexibility inside a plan</h3>
            <p>
              A plan does not lock in one meal: people choose the same meal for all days or a different one each day,
              adjust ingredients and portions, and can modify or cancel up to 2 hours before delivery.
            </p>
          </li>
          <li className="dlist__item">
            <h3>A health-first identity</h3>
            <p>
              The logo is built on a grid: a bold “N” as the anchor for structure and discipline, and a leaf rising from
              the wordmark for natural nutrition and freshness. Plus Jakarta Sans carries the type.
            </p>
          </li>
        </ol>
        <div className="nshots">
          {shots.map((s, i) => (
            <figure key={s.slug} className="ds__item">
              <button type="button" className="ds__zoom" onClick={() => open(i)} aria-label={`Enlarge: ${s.caption}`}>
                <img
                  src={`${s.src}-1800.webp`}
                  srcSet={`${s.src}-800.webp 800w, ${s.src}-1800.webp 1800w`}
                  sizes="(max-width: 1100px) 100vw, 60vw"
                  width={s.w}
                  height={s.h}
                  alt={s.alt}
                  loading="lazy" ref={loadAhead}
                  decoding="async"
                />
              </button>
              <figcaption>
                <h3>{s.caption}</h3>
                <p>{s.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="contrib" className="wrap split" aria-labelledby="contrib-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="contrib-title" className="section-title">My contribution</h2>
          <p>Designed by hand, without AI, as a Heizen product.</p>
        </div>
        <div className="split__media">
          <ul className="ticks ticks--lg">
            <li>User research and end-to-end UX/UI design, through design handoff.</li>
            <li>All four products: customer app, delivery partner app, kitchen panel and admin dashboard.</li>
            <li>Process: user research, requirement analysis, UX planning, then UI design and testing.</li>
            <li>The visual identity: logo, type and colour.</li>
          </ul>
        </div>
      </section>

      <section id="outcome" className="wrap split" aria-labelledby="outcome-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="outcome-title" className="section-title">Outcome</h2>
        </div>
        <div className="split__media">
          <ul className="ticks ticks--lg">
            <li>Four connected products designed to one system, from the customer’s order to the kitchen, the rider and the admin.</li>
            <li>Designed through design handoff.</li>
          </ul>
        </div>
      </section>
      {lightbox}
    </>
  )
}
