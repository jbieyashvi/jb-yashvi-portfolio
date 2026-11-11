/** An image shown as a tile that opens the enlarged view (Ideas in motion and Gallery) */
export interface ImageItem {
  slug: string
  /** Base path; files exist as `${src}-800.webp` and `${src}-1800.webp` */
  src: string
  /** Size of the largest file */
  w: number
  h: number
  alt: string
  /** Short caption describing what is shown. No invented titles. */
  caption: string
  /** What kind of work it is, shown with the caption */
  label: string
}
