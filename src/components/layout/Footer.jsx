import { useRef } from 'react'
import { footerContent } from '../../data/content.js'
import { ShieldCheckIcon } from '../icons/shield-check.jsx'
import { AwardIcon } from '../icons/award.jsx'
import { StarIcon } from '../icons/star.jsx'
import { MapPinIcon } from '../icons/map-pin.jsx'
import { ClockIcon } from '../icons/clock.jsx'
import { PhoneIcon } from '../icons/phone.jsx'
import { MailCheckIcon } from '../icons/mail-check.jsx'
import { FacebookIcon } from '../icons/facebook.jsx'
import { InstagramIcon } from '../icons/instagram.jsx'
import { LinkedinIcon } from '../icons/linkedin.jsx'

const badgeIcons = {
  shieldCheck: ShieldCheckIcon,
  award: AwardIcon,
  starFooter: StarIcon,
}

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
}

/** Hover handlers that delegate to a lucide-animated icon ref */
const hoverOn = (ref, i) => () => (i != null ? ref.current[i] : ref.current)?.startAnimation()
const hoverOff = (ref, i) => () => (i != null ? ref.current[i] : ref.current)?.stopAnimation()

export default function Footer() {
  const { legal, badges, address, schedule, phone, email, social } = footerContent

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street}, ${address.city}`)}`
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`

  const badgeRefs = useRef([])
  const mapPinRef = useRef(null)
  const phoneRef = useRef(null)
  const mailRef = useRef(null)
  const socialRefs = useRef([])

  return (
    <footer className="lb-footer container-fluid">
      <div className="container text-white">
        {/* Legal band */}
        <div className="py-3 px-4 px-md-5">
          <p className="mb-0 lh-lg lb-legal">{legal}</p>
        </div>

        {/* Main footer */}
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-4 px-4 px-md-5 py-4">
          {/* Logo + badges */}
          <div className="d-flex flex-column gap-3">
            <div className="fs-2 fw-bold">
              <span className="text-danger">i</span><span className="text-white">Leben</span>
            </div>
            <div className="d-flex gap-2">
              {badges.map((b, i) => {
                const Icon = badgeIcons[b.icon] || StarIcon
                return (
                  <div
                    key={b.label}
                    className={`lb-badge d-inline-flex flex-column align-items-center justify-content-center rounded border lb-badge-${b.icon}`}
                    onMouseEnter={hoverOn(badgeRefs, i)}
                    onMouseLeave={hoverOff(badgeRefs, i)}
                  >
                    <Icon ref={(el) => { badgeRefs.current[i] = el }} size={20} className="lb-badge-icon" />
                    <span className="lb-badge-label">{b.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Address */}
          <div className="lb-col-w">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex gap-2 align-items-center mb-2 text-decoration-none"
              onMouseEnter={hoverOn(mapPinRef)}
              onMouseLeave={hoverOff(mapPinRef)}
            >
              <MapPinIcon ref={mapPinRef} size={16} className="lb-footer-icon flex-shrink-0 mt-1" />
              <div className="d-flex flex-column lb-contact">
                <span className="fw-semibold">{address.street}</span>
                <span>{address.city}</span>
              </div>
            </a>
          </div>

          {/* Contact */}
          <div className="lb-col-w">
            <div className="d-flex gap-2 align-items-center mb-2">
              <ClockIcon size={16} className="lb-footer-icon flex-shrink-0 mt-1" />
              <div className="d-flex flex-column lb-contact">
                {schedule.map((line) => <span key={line}>{line}</span>)}
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex gap-2 align-items-center mb-2 text-decoration-none"
              onMouseEnter={hoverOn(phoneRef)}
              onMouseLeave={hoverOff(phoneRef)}
            >
              <PhoneIcon ref={phoneRef} size={16} className="lb-footer-icon flex-shrink-0 mt-1" />
              <span className="lb-contact">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="d-flex gap-2 align-items-center text-decoration-none"
              onMouseEnter={hoverOn(mailRef)}
              onMouseLeave={hoverOff(mailRef)}
            >
              <MailCheckIcon ref={mailRef} size={16} className="lb-footer-icon flex-shrink-0 mt-1" />
              <span className="lb-contact">{email}</span>
            </a>
          </div>
        </div>

        {/* Social */}
        <div className="d-flex gap-3 px-4 px-md-5 py-3 border-top border-secondary border-opacity-10">
          {social.map((s, i) => {
            const Ic = socialIcons[s] || FacebookIcon
            return (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="lb-social d-inline-flex align-items-center justify-content-center rounded-circle"
                onMouseEnter={hoverOn(socialRefs, i)}
                onMouseLeave={hoverOff(socialRefs, i)}
              >
                <Ic ref={(el) => { socialRefs.current[i] = el }} size={16} />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
