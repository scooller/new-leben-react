import ScrollAnim from '../ScrollAnim.jsx'
import { projectOfMonthContent as content } from '../../data/content.js'

export default function ProjectOfMonthSection() {
  return (
    <section className="lb-project-month">
      <div className="container position-relative">
        <div className="row align-items-center gy-4">
          <div className="col-lg-4">
            <ScrollAnim as="div" animation="fade-up" duration={1} className="lb-project-month-photo">
              <img src={content.photo} alt={content.title} className='rounded-4' />
            </ScrollAnim>
          </div>

          <div className="col-lg-4">
            <div className="lb-project-month-copy rounded">
              <ScrollAnim as="h2" animation="fade-up" duration={1} delay={0.1} className="lb-project-month-title">
                {content.title}
                <span className="text-danger">{content.titleHighlight}</span>
              </ScrollAnim>
              <ScrollAnim as="p" animation="fade-up" duration={1} delay={0.2} className="lb-project-month-text">
                {content.text}
              </ScrollAnim>
              <ScrollAnim as="div" animation="fade-up" duration={1} delay={0.3}>
                <a
                  href={content.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark"
                >
                  {content.buttonText}
                </a>
              </ScrollAnim>
            </div>
          </div>

          <div className="col-lg-4">
            <ScrollAnim as="div" animation="zoom-in" duration={1} className="lb-project-month-visual">
              <div className="lb-iphone-video-shell">
                <video
                  src={content.video}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="lb-iphone-video"
                />
              </div>
              <img src={`${import.meta.env.BASE_URL}images/home/iphone-container.png`} alt="" className="lb-iphone-frame" />
            </ScrollAnim>
          </div>
        </div>
      </div>
    </section>
  )
}
