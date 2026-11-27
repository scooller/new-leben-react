import { useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnim from '../ScrollAnim.jsx'
import SplitTitle from '../SplitTitle.jsx'
import { HouseHeartIcon } from '../icons/house-heart.jsx'
import { hover } from '../icons/animated-icon.jsx'
import { apiFetch, resolveApiUrl } from '../../lib/apiFetch.js'

const fallbackPhoto = `${import.meta.env.BASE_URL}images/inn/RAPC_EXT_Elevacioen-Tarde_Media16.jpg`
const fallbackVideo = `${import.meta.env.BASE_URL}video/maria gracia.mp4`

const resolveMedia = (url, fallback) => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback
  const trimmed = url.trim()
  if (trimmed.startsWith('/storage/') || trimmed.startsWith('storage/')) return fallback
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return resolveApiUrl(trimmed)
}

const defaultContent = {
  title: 'María Gracia en',
  titleHighlight: 'Leben',
  text: 'La creadora de contenido y conductora María Gracia Subercaseaux visitó junto a su marido Waldemar Méndez nuestro proyecto INN en Puerto Varas y quedó maravillada con sus espacios interiores, terminaciones, diseño y la calidez de los ambientes. Una visita muy especial que nos permite mostrar cómo este edificio no solo propone departamentos frente al lago, sino una nueva forma de disfrutar el sur con sofisticación.',
  photo: fallbackPhoto,
  video: fallbackVideo,
  buttonText: 'Ver proyecto INN',
  buttonLink: '/proyectos/inn',
}

export default function ProjectOfMonthSection() {
  const iconRef = useRef(null)
  const [isEnabled, setIsEnabled] = useState(true)
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    let isMounted = true
    Promise.allSettled([
      apiFetch('/api/v1/site-config'),
      apiFetch('/api/v1/pages/home')
    ]).then(([configRes, homeRes]) => {
      if (!isMounted) return
      const configData = configRes.status === 'fulfilled' ? configRes.value?.data : null
      const homeData = homeRes.status === 'fulfilled' ? homeRes.value?.data : null

      const newsConfig = configData?.news_of_month || configData?.project_of_month
      const homeSection = homeData?.sections?.find((s) => s.key === 'project_of_month' || s.section_key === 'project_of_month')

      if (newsConfig && newsConfig.enabled === false) {
        setIsEnabled(false)
        return
      }

      setApiData({
        title: newsConfig?.title || homeSection?.title,
        titleHighlight: newsConfig?.title_highlight || homeSection?.data?.title_highlight,
        text: newsConfig?.description || newsConfig?.text || homeSection?.data?.description || homeSection?.data?.text,
        photo_url: newsConfig?.photo_url || homeSection?.data?.photo_url,
        video_url: newsConfig?.video_url || homeSection?.data?.video_url,
        button_text: newsConfig?.button_text || homeSection?.data?.button_text,
        button_link: newsConfig?.button_link || homeSection?.data?.button_link,
      })
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const content = useMemo(() => {
    if (!isEnabled) return null
    if (!apiData) return defaultContent

    return {
      title: apiData.title || defaultContent.title,
      titleHighlight: apiData.titleHighlight || defaultContent.titleHighlight,
      text: apiData.text || defaultContent.text,
      photo: resolveMedia(apiData.photo_url, fallbackPhoto),
      video: resolveMedia(apiData.video_url, fallbackVideo),
      buttonText: apiData.button_text || defaultContent.buttonText,
      buttonLink: apiData.button_link || defaultContent.buttonLink,
    }
  }, [isEnabled, apiData])

  if (!content) return null

  const titleWithSpace = content.title.endsWith(' ') ? content.title : `${content.title} `
  const isExternal = content.buttonLink?.startsWith('http://') || content.buttonLink?.startsWith('https://')

  return (
    <section className="lb-project-month">
      <div className="container position-relative">
        <div className="row align-items-center gy-4">
          <div className="col-lg-4">
            <ScrollAnim as="div" animation="fade-left" duration={1} className="lb-project-month-photo">
              <img src={content.photo} alt={content.title} className="rounded-4 img-fluid" loading="lazy" decoding="async" />
            </ScrollAnim>
          </div>

          <div className="col-lg-4">
            <div className="lb-project-month-copy rounded">
              <SplitTitle as='h2' className='lb-project-month-title' dangerouslySetInnerHTML={{ __html: titleWithSpace + '<span className="text-danger">' + content.titleHighlight + '</span>' }} />
              <ScrollAnim as="p" animation="fade-right" duration={1} delay={0.2} className="lb-project-month-text">
                {content.text}
              </ScrollAnim>
              <ScrollAnim as="div" animation="fade-right" duration={1} delay={0.3}>
                {isExternal ? (
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
                ) : (
                  <Link
                    to={content.buttonLink}
                    className="btn btn-dark d-inline-flex align-items-center gap-2"
                    {...hover(iconRef)}
                  >
                    <HouseHeartIcon ref={iconRef} size={18} />
                    <span>{content.buttonText}</span>
                  </Link>
                )}
              </ScrollAnim>
            </div>
          </div>

          <div className="col-lg-4">
            <ScrollAnim as="div" animation="fade-up" duration={1} className="lb-project-month-visual">
              <div className="lb-iphone-video-shell">
                <video
                  src={content.video}
                  poster={content.photo}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="lb-iphone-video"
                />
              </div>
              <img src={`${import.meta.env.BASE_URL}images/home/iphone-container.png`} alt="" className="lb-iphone-frame" loading="lazy" decoding="async" />
            </ScrollAnim>
          </div>
        </div>
      </div>
    </section>
  )
}
