import { useRef, useState, useEffect, useMemo } from 'react'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import { HouseHeartIcon } from '../icons/house-heart.jsx'
import { hover } from '../icons/animated-icon.jsx'
import { projectOfMonthContent as staticContent } from '../../data/content.js'
import { apiFetch, resolveApiUrl } from '../../lib/apiFetch.js'

export default function ProjectOfMonthSection() {
  const iconRef = useRef(null)
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    let isMounted = true
    apiFetch('/api/v1/pages/home')
      .then(({ data, error }) => {
        if (!error && data?.sections && isMounted) {
          const section = data.sections.find((s) => s.key === 'project_of_month' || s.section_key === 'project_of_month')
          if (section) {
            setApiData(section)
          }
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const content = useMemo(() => {
    if (!apiData) return staticContent
    const d = apiData.data || {}
    const photo = d.photo_url ? resolveApiUrl(d.photo_url) : (d.photo ? resolveApiUrl(d.photo) : staticContent.photo)
    const video = d.video_url ? resolveApiUrl(d.video_url) : (d.video ? resolveApiUrl(d.video) : staticContent.video)
    return {
      title: apiData.title || staticContent.title,
      titleHighlight: d.title_highlight || d.titleHighlight || staticContent.titleHighlight,
      text: d.description || d.text || staticContent.text,
      photo,
      video,
      buttonText: d.button_text || d.cta?.label || staticContent.buttonText,
      buttonLink: d.button_link || d.cta?.url || staticContent.buttonLink,
    }
  }, [apiData])

  const titleWithSpace = content.title.endsWith(' ') ? content.title : `${content.title} `

  return (
    <section className="lb-project-month">
      <div className="container position-relative">
        <div className="row align-items-center gy-4">
          <div className="col-lg-4">
            <ScrollAnim as="div" animation="fade-left" duration={1} className="lb-project-month-photo">
              <img src={content.photo} alt={content.title} className='rounded-4' />
            </ScrollAnim>
          </div>

          <div className="col-lg-4">
            <div className="lb-project-month-copy rounded">
              <SplitTitle as='h2' className='lb-project-month-title' dangerouslySetInnerHTML={{ __html: titleWithSpace + '<span className="text-danger">' + content.titleHighlight + '</span>' }} />
              <ScrollAnim as="p" animation="fade-right" duration={1} delay={0.2} className="lb-project-month-text">
                {content.text}
              </ScrollAnim>
              <ScrollAnim as="div" animation="fade-right" duration={1} delay={0.3}>
                <a
                  href={content.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark d-inline-flex align-items-center gap-2"
                  {...hover(iconRef)}
                >
                  <HouseHeartIcon ref={iconRef} size={18} />
                  <span>{content.buttonText}</span>
                </a>
              </ScrollAnim>
            </div>
          </div>

          <div className="col-lg-4">
            <ScrollAnim as="div" animation="fade-up" duration={1} className="lb-project-month-visual">
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
