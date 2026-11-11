import { useEffect } from 'react'
import RvAbout from '../components/rv/RvAbout'
import RvFooter from '../components/rv/RvFooter'
import RvHero from '../components/rv/RvHero'
import RvNote from '../components/rv/RvNote'
import RvValley from '../components/rv/RvValley'
import RvWork from '../components/rv/RvWork'
import SideDock from '../components/SideDock'
import useTitle from '../components/useTitle'
import '../rv.css'

const noop = () => {}

/** the line across the page column between two sections, with a square where it meets each side */
const Seam = () => <div className="rv-seam" aria-hidden="true" />

export default function Home() {
  useTitle('Jb Yashvi, Product Designer')
  // iOS Safari only applies :active (the images' colour during a press) once a touch listener
  // exists; a passive one never delays or cancels a tap
  useEffect(() => {
    document.addEventListener('touchstart', noop, { passive: true })
    return () => document.removeEventListener('touchstart', noop)
  }, [])
  return (
    <>
      <Seam />
      <RvHero />

      <SideDock />

      <Seam />
      <section id="work" className="rv-work-sec" aria-labelledby="work-title" tabIndex={-1}>
        <RvWork />
      </section>

      <Seam />
      <RvAbout />

      <Seam />
      <RvValley />

      <Seam />
      <RvNote />

      <Seam />
      <RvFooter />
    </>
  )
}
