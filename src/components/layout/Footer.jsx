import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { footerContent } from '../../data/content.js'
import { hover } from '../icons/animated-icon.jsx'
import { MapPinIcon } from '../icons/map-pin.jsx'
import { ClockIcon } from '../icons/clock.jsx'
import { PhoneIcon } from '../icons/phone.jsx'
import { MailCheckIcon } from '../icons/mail-check.jsx'
import { FacebookIcon } from '../icons/facebook.jsx'
import { InstagramIcon } from '../icons/instagram.jsx'
import { LinkedinIcon } from '../icons/linkedin.jsx'
import { useBsTooltips } from '../../hooks/useBsTooltips.js'

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
}

export default function Footer() {
  const { legal, address, schedule, phone, email, social, socialLinks, copyright, copyrightLinks } = footerContent

  const mapRef = useRef(null)
  const clockRef = useRef(null)
  const phoneRef = useRef(null)
  const mailRef = useRef(null)
  const socialRefs = useRef([])

  useBsTooltips()

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street}, ${address.city}`)}`
  const phoneLink = `tel:${phone.replace(/\D/g, '')}`

  return (
    <footer className="lb-footer container-fluid">
      <div className="container text-white pt-4">
        {/* Legal band */}
        <div className="py-2 py-md-3 px-3 px-md-5 mb-2 mb-md-3">
          <p className="mb-0 lh-lg lb-legal">{legal}</p>
        </div>

        {/* Main footer — 5 columns per Figma */}
        <div className="row g-4 px-3 px-md-5 py-3 py-md-4">
          {/* Col 1: Logo + badges */}
          <div className="col-12 col-md-3 d-flex flex-column gap-3">
            <div className="fs-2 fw-bold">
              <img src="/images/brand/leben_bptl_pro.svg" alt="" className="flex-shrink-0 img-logo" fetchPriority="high" />
            </div>
            <div className="d-flex gap-2">
              {social.map((s, i) => {
                const Ic = socialIcons[s] || FacebookIcon
                return (
                  <a
                    key={s}
                    href={socialLinks[s]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s}
                    data-bs-toggle="tooltip"
                    data-bs-title={s}
                    className={`lb-badge lb-badge-${s} d-inline-flex flex-column align-items-center justify-content-center rounded border text-decoration-none`}
                    onMouseEnter={() => socialRefs.current[i]?.startAnimation()}
                    onMouseLeave={() => socialRefs.current[i]?.stopAnimation()}
                  >
                    <Ic ref={(el) => { socialRefs.current[i] = el }} size={20} className="lb-badge-icon" />
                    <span className="lb-badge-label d-none">{s}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Col 2: Address */}
          <div className="col-12 col-md-4 offset-md-1 d-flex flex-row align-items-start justify-content-between">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-bs-toggle="tooltip"
              data-bs-title="Ver mapa"
              className="d-flex gap-2 align-items-center text-decoration-none"
              {...hover(mapRef)}
            >
              <MapPinIcon ref={mapRef} size={13} className="lb-footer-icon flex-shrink-0 d-inline-flex" />
              <div className="d-flex flex-column lb-contact">
                <span>{address.street}<br />{address.city}</span>
              </div>
            </a>
            <div className='lb-border-red me-4 d-none d-md-block' />
          </div>

          {/* Col 3: Contact */}
          <div className="col-12 col-md-4">
            <div className="d-flex gap-2 align-items-center mb-2" {...hover(clockRef)}>
              <ClockIcon ref={clockRef} size={13} className="lb-footer-icon flex-shrink-0 d-inline-flex" />
              <div className="d-flex flex-column lb-contact">
                <span>{schedule}</span>
              </div>
            </div>
            <a
              href={phoneLink}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex gap-2 align-items-center mb-2 text-decoration-none"
              {...hover(phoneRef)}
            >
              <PhoneIcon ref={phoneRef} size={13} className="lb-footer-icon flex-shrink-0 d-inline-flex" />
              <span className="lb-contact">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="d-flex gap-2 align-items-center text-decoration-none"
              {...hover(mailRef)}
            >
              <MailCheckIcon ref={mailRef} size={13} className="lb-footer-icon flex-shrink-0 d-inline-flex" />
              <span className="lb-contact">{email}</span>
            </a>
          </div>
        </div>

        {/* Copyright strip */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-3 px-md-5 py-3 border-top border-secondary border-opacity-10 lb-copyright-strip text-center text-md-start">
          <span className="lb-copyright">{copyright}</span>
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
            {copyrightLinks.map((link) => {
              const routeMap = {
                'Bases legales': '/bases-legales',
                'Información de la empresa': '/informacion-de-la-empresa',
                'Privacidad': '/informacion-de-la-empresa',
                'Términos': '/bases-legales',
                'Política de cookies': '/cookies',
                'Cookies': '/cookies',
              }
              const targetRoute = routeMap[link]
              return targetRoute ? (
                <Link key={link} to={targetRoute} className="lb-footer-link">{link}</Link>
              ) : (
                <a key={link} href="#" className="lb-footer-link">{link}</a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
