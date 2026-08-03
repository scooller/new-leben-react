import { useEffect, useRef, useState } from 'react'

/**
 * Sticky tab bar with project key info.
 * Clicking a tab scrolls to its corresponding section.
 */
export default function ProjectTabs({ tabs }) {
  const barRef = useRef(null)
  const [stuck, setStuck] = useState(false)

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return
      const rect = barRef.current.getBoundingClientRect()
      setStuck(rect.top <= 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      className={`lb-proj-det-tabs-bar position-sticky top-0${stuck ? ' lb-proj-det-tabs-stuck' : ''}`}
    >
      <div className="container">
        <div className="lb-proj-det-tabs-row d-flex align-items-center">
          {tabs.map((tab) => (
            <div key={tab.id} className="lb-proj-det-tab d-flex flex-column">
              <span className="lb-proj-det-tab-label text-uppercase">{tab.label}</span>
              <span className="lb-proj-det-tab-value">{tab.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
