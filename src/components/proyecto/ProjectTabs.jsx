import { useBsTooltips } from '../../hooks/useBsTooltips.js'

/**
 * Sticky tab bar with project key info.
 * CSS position:sticky handles the shadow via .lb-proj-det-tabs-stuck.
 */
export default function ProjectTabs({ tabs }) {
  useBsTooltips([tabs])
  return (
    <div className="lb-proj-det-tabs-bar position-sticky">
      <div className="container">
        <div className="lb-proj-det-tabs-row d-flex align-items-center text-center mx-auto w-75">
          {tabs.map((tab) => (
            <div key={tab.id} className="lb-proj-det-tab d-flex flex-column">
              <span className="lb-proj-det-tab-label">{tab.label}</span>
              <span className="lb-proj-det-tab-value" data-bs-toggle="tooltip" data-bs-title={tab.value}>{tab.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
