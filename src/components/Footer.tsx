import { contact } from '../data/projects'
import Clock from './Clock'

/** A compact closing row; on the home page it reads as the last row of the Contact grid. */
export default function Footer() {
  return (
    <footer className="footer" aria-label="Footer">
      <div className="wrap">
        <div className="footer__row">
          <div className="footer__lead">
            <p className="footer__name">
              Jb Yashvi <span className="footer__role">Product Designer</span>
            </p>
            <Clock />
          </div>
          <p>
            <a className="footer__link" href={contact.resume} target="_blank" rel="noreferrer">
              Résumé <span aria-hidden="true">↗</span>
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
