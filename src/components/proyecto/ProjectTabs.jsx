/**
 * Sticky tab bar with project key info.
 * CSS position:sticky handles the shadow via .lb-proj-det-tabs-stuck.
 */
export default function ProjectTabs({ tabs }) {
  return (
    <div className="lb-proj-det-tabs-bar position-sticky lb-proj-det-tabs-stuck">
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
