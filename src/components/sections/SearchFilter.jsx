import { searchFilters } from '../../data/content.js'
import { ChevronDown, Search } from 'lucide-react'

export default function SearchFilter() {
  return (
    <section className="lb-search-filter">
      <div className="container" data-animate>
        <p className="lb-filter-title">{searchFilters.title}</p>
        <div className="bg-white d-flex gap-2 align-items-center lb-filter-bar">
          {searchFilters.filters.map((f) => (
            <div className="flex-fill position-relative lb-filter-item" key={f.id}>
              <label className="d-block lb-filter-label">{f.label}</label>
              <select className="form-select border-0 bg-transparent lb-form-select" defaultValue="">
                <option value="" disabled>{f.placeholder}</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="position-absolute end-0 top-50 translate-middle me-2 text-muted" />
            </div>
          ))}
          <button className="btn lb-btn-search" type="button">
            <Search size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
