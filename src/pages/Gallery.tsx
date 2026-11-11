import '../case-rv.css'
import GalleryJourney from '../components/GalleryJourney'
import GalleryOpening from '../components/GalleryOpening'
import useTitle from '../components/useTitle'

/**
 * Outside the brief: an animated opening (see GalleryOpening), then one continuous,
 * scroll-led journey through the Art, Studio and Personal chapters (see GalleryJourney).
 */
export default function Gallery() {
  useTitle('Outside the brief | Jb Yashvi')
  return (
    <article className="gallery-page outside-page rv-case">
      <GalleryOpening />
      <GalleryJourney />
    </article>
  )
}
